// ========== 类型 ==========

export interface GenerateParams {
  prompt: string;
  size: string;
  provider: ProviderConfig;
}

export interface GenerateWithRefParams extends GenerateParams {
  refImages: File[];
}

export interface ApiResult {
  success: boolean;
  images: ArrayBuffer[];
  error?: string;
  errorCode?: string;
}

// ========== 错误格式化 ==========

function formatError(status: number, body: string): { message: string; code: string } {
  let apiMessage = "";
  try {
    const json = JSON.parse(body);
    apiMessage = json?.error?.message || json?.message || "";
  } catch {
    apiMessage = body;
  }

  if (status === 400 && (apiMessage.includes("content_policy") || apiMessage.includes("内容") || apiMessage.includes("政策"))) {
    return { code: "content_policy", message: "内容审核未通过，请修改提示词后重试。" };
  }
  if (status === 400) {
    return { code: "bad_request", message: `请求参数有误：${apiMessage || "请检查提示词和参数设置"}` };
  }
  if (status === 401) {
    return { code: "auth", message: "API Key 无效或已过期，请到「模型管理」中重新设置。" };
  }
  if (status === 403) {
    return { code: "auth", message: "API 访问被拒绝，请检查账户权限或余额是否充足。" };
  }
  if (status === 404) {
    return { code: "not_found", message: "API 接口不存在，请检查请求地址和接口路径是否正确。" };
  }
  if (status === 429) {
    return { code: "rate_limit", message: "请求太频繁，请稍等片刻后重试。" };
  }
  if (status >= 500) {
    return { code: "server", message: `服务商服务器异常 (${status})，请稍后重试。` };
  }
  return { code: "unknown", message: `请求失败 (HTTP ${status})：${apiMessage || "未知错误"}` };
}

function networkError(msg: string): ApiResult {
  return { success: false, images: [], error: `无法连接到 API 服务器，请检查：\n• 网络连接是否正常\n• 请求地址和接口路径是否正确\n\n${msg}`, errorCode: "network" };
}

// ========== 响应解析 ==========

/** 将 base64 字符串转为 ArrayBuffer */
function b64ToBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
  return buffer;
}

/** 解析 OpenAI 兼容响应: { data: [{ b64_json?, url? }] } */
async function parseOpenAiResponse(data: any): Promise<ArrayBuffer[]> {
  const images: ArrayBuffer[] = [];
  for (const item of data.data || []) {
    if (item.b64_json) {
      images.push(b64ToBuffer(item.b64_json));
    } else if (item.url) {
      const resp = await fetch(item.url);
      images.push(await resp.arrayBuffer());
    }
  }
  return images;
}

/** 解析 Stability AI 响应: { artifacts: [{ base64? }] } 或 { image: "base64" } */
async function parseStabilityResponse(data: any): Promise<ArrayBuffer[]> {
  const images: ArrayBuffer[] = [];
  // Stability v1/v2beta 格式
  if (data.artifacts) {
    for (const art of data.artifacts) {
      if (art.base64) images.push(b64ToBuffer(art.base64));
    }
  }
  // Stability 简单格式
  if (data.image) {
    images.push(b64ToBuffer(data.image));
  }
  return images;
}

/** 解析通用 JSON 响应，尝试多种常见字段名 */
async function parseGenericResponse(data: any): Promise<ArrayBuffer[]> {
  const images: ArrayBuffer[] = [];
  // 尝试多种常见路径
  const candidates: string[] = [];
  if (data.data) for (const d of data.data) {
    candidates.push(d.b64_json || d.image || d.base64 || "");
  }
  if (data.images) for (const img of data.images) {
    candidates.push(img.image || img.b64_json || img.base64 || img.url || "");
  }
  if (data.output) candidates.push(data.output.b64_json || data.output.image || data.output.base64 || "");
  if (data.result) candidates.push(data.result.b64_json || data.result.image || data.result.base64 || "");
  if (data.image) candidates.push(data.image);

  for (const c of candidates) {
    if (!c) continue;
    if (c.startsWith("http")) {
      try {
        const resp = await fetch(c);
        images.push(await resp.arrayBuffer());
      } catch { /* skip failed URLs */ }
    } else {
      try {
        images.push(b64ToBuffer(c));
      } catch { /* skip malformed base64 */ }
    }
  }
  return images;
}

// ========== 文生图 ==========

export async function generateImage(params: GenerateParams): Promise<ApiResult> {
  const { prompt, size, provider } = params;
  const [width, height] = size.split("x");
  const protocol = provider.apiProtocol || "openai"; // 旧配置兼容

  try {
    let response: Response;

    switch (protocol) {
      // ---- OpenAI 兼容 ----
      case "openai": {
        const endpoint = provider.t2iEndpoint || "/v1/images/generations";
        response = await fetch(`${provider.baseUrl}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.apiKey}`,
          },
          body: JSON.stringify({
            model: provider.model,
            prompt,
            size: `${width}x${height}`,
            n: 1,
            response_format: "b64_json",
          }),
        });
        if (!response.ok) {
          const errText = await response.text();
          const { message, code } = formatError(response.status, errText);
          return { success: false, images: [], error: message, errorCode: code };
        }
        const data = await response.json();
        return { success: true, images: await parseOpenAiResponse(data) };
      }

      // ---- Stability AI ----
      case "stability": {
        const endpoint = provider.t2iEndpoint || "/v2beta/stable-image/generate/sd3";
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("output_format", "png");
        if (provider.model) formData.append("model", provider.model);

        response = await fetch(`${provider.baseUrl}${endpoint}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${provider.apiKey}` },
          body: formData,
        });
        if (!response.ok) {
          const errText = await response.text();
          const { message, code } = formatError(response.status, errText);
          return { success: false, images: [], error: message, errorCode: code };
        }
        // Stability v2beta 返回直接是图片二进制
        if (response.headers.get("content-type")?.includes("image")) {
          return { success: true, images: [await response.arrayBuffer()] };
        }
        // 否则按 JSON 解析
        const data = await response.json();
        return { success: true, images: await parseStabilityResponse(data) };
      }

      // ---- 自定义 ----
      case "custom":
      default: {
        const endpoint = provider.t2iEndpoint || "/v1/images/generations";
        response = await fetch(`${provider.baseUrl}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.apiKey}`,
          },
          body: JSON.stringify({
            model: provider.model,
            prompt,
            size: `${width}x${height}`,
            n: 1,
          }),
        });
        if (!response.ok) {
          const errText = await response.text();
          const { message, code } = formatError(response.status, errText);
          return { success: false, images: [], error: message, errorCode: code };
        }
        // 检查是否是直接图片响应
        const ct = response.headers.get("content-type") || "";
        if (ct.includes("image")) {
          return { success: true, images: [await response.arrayBuffer()] };
        }
        const data = await response.json();
        return { success: true, images: await parseGenericResponse(data) };
      }
    }
  } catch (e: any) {
    const msg = e.message || "";
    if (msg.includes("fetch") || msg.includes("Failed to fetch") || msg.includes("ENOTFOUND") || msg.includes("ECONNREFUSED")) {
      return networkError(msg);
    }
    return { success: false, images: [], error: `网络异常：${msg}`, errorCode: "network" };
  }
}

// ========== 图生图 ==========

export async function generateImageWithRef(params: GenerateWithRefParams): Promise<ApiResult> {
  const { prompt, size, provider, refImages } = params;
  const [width, height] = size.split("x");
  const protocol = provider.apiProtocol || "openai"; // 旧配置兼容

  try {
    let response: Response;

    switch (protocol) {
      // ---- OpenAI 兼容 (multipart) ----
      case "openai": {
        const endpoint = provider.i2iEndpoint || "/v1/images/edits";
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("size", `${width}x${height}`);
        formData.append("model", provider.model);
        formData.append("n", "1");
        formData.append("response_format", "b64_json");
        for (const file of refImages) formData.append("image", file);

        response = await fetch(`${provider.baseUrl}${endpoint}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${provider.apiKey}` },
          body: formData,
        });
        if (!response.ok) {
          const errText = await response.text();
          const { message, code } = formatError(response.status, errText);
          return { success: false, images: [], error: message, errorCode: code };
        }
        const data = await response.json();
        return { success: true, images: await parseOpenAiResponse(data) };
      }

      // ---- Stability AI (image-to-image) ----
      case "stability": {
        const endpoint = provider.i2iEndpoint || "/v2beta/stable-image/control/sketch";
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("output_format", "png");
        if (provider.model) formData.append("model", provider.model);
        for (const file of refImages) formData.append("image", file);

        response = await fetch(`${provider.baseUrl}${endpoint}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${provider.apiKey}` },
          body: formData,
        });
        if (!response.ok) {
          const errText = await response.text();
          const { message, code } = formatError(response.status, errText);
          return { success: false, images: [], error: message, errorCode: code };
        }
        if (response.headers.get("content-type")?.includes("image")) {
          return { success: true, images: [await response.arrayBuffer()] };
        }
        const data = await response.json();
        return { success: true, images: await parseStabilityResponse(data) };
      }

      // ---- 自定义 ----
      case "custom":
      default: {
        const endpoint = provider.i2iEndpoint || "/v1/images/edits";
        const formData = new FormData();
        formData.append("prompt", prompt);
        if (provider.model) formData.append("model", provider.model);
        for (const file of refImages) formData.append("image", file);

        response = await fetch(`${provider.baseUrl}${endpoint}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${provider.apiKey}` },
          body: formData,
        });
        if (!response.ok) {
          const errText = await response.text();
          const { message, code } = formatError(response.status, errText);
          return { success: false, images: [], error: message, errorCode: code };
        }
        const ct = response.headers.get("content-type") || "";
        if (ct.includes("image")) {
          return { success: true, images: [await response.arrayBuffer()] };
        }
        const data = await response.json();
        return { success: true, images: await parseGenericResponse(data) };
      }
    }
  } catch (e: any) {
    const msg = e.message || "";
    if (msg.includes("fetch") || msg.includes("Failed to fetch") || msg.includes("ENOTFOUND") || msg.includes("ECONNREFUSED")) {
      return networkError(msg);
    }
    return { success: false, images: [], error: `网络异常：${msg}`, errorCode: "network" };
  }
}
