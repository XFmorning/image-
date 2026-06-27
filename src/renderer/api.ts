interface GenerateParams {
  prompt: string;
  size: string;
  provider: ProviderConfig;
}

interface GenerateWithRefParams extends GenerateParams {
  refImages: File[];
}

interface ApiResult {
  success: boolean;
  images: ArrayBuffer[];
  error?: string;       // 用户友好的中文错误信息
  errorCode?: string;   // 错误类型标识：network / auth / rate_limit / content_policy / server / unknown
}

/** 将 API 错误翻译为中文友好提示 */
function formatError(status: number, body: string): { message: string; code: string } {
  // 尝试解析 JSON 错误体
  let apiMessage = "";
  try {
    const json = JSON.parse(body);
    apiMessage = json?.error?.message || json?.message || "";
  } catch {
    apiMessage = body;
  }

  // 内容审核拦截
  if (status === 400 && (apiMessage.includes("content_policy") || apiMessage.includes("内容") || apiMessage.includes("政策"))) {
    return {
      code: "content_policy",
      message: "内容审核未通过，请修改提示词后重试。建议：\n• 避免敏感词汇\n• 换一种描述方式\n• 使用模板库中的安全提示词",
    };
  }
  if (status === 400 && apiMessage.includes("content")) {
    return {
      code: "content_policy",
      message: `内容审核拦截：${apiMessage}`,
    };
  }

  // 普通 400 错误
  if (status === 400) {
    return {
      code: "bad_request",
      message: `请求参数有误：${apiMessage || "请检查提示词和参数设置"}`,
    };
  }

  // 认证失败
  if (status === 401) {
    return {
      code: "auth",
      message: "API Key 无效或已过期，请到「模型管理」中重新设置。",
    };
  }

  // 权限不足
  if (status === 403) {
    return {
      code: "auth",
      message: "API 访问被拒绝，请检查你的账户权限或余额是否充足。",
    };
  }

  // 资源不存在
  if (status === 404) {
    return {
      code: "not_found",
      message: "API 接口不存在，请检查「模型管理」中的请求地址是否正确。",
    };
  }

  // 频率限制
  if (status === 429) {
    return {
      code: "rate_limit",
      message: "请求太频繁，请稍等片刻后重试。",
    };
  }

  // 服务端错误
  if (status >= 500) {
    return {
      code: "server",
      message: `服务商服务器异常 (${status})，请稍后重试。`,
    };
  }

  // 其他 HTTP 错误
  return {
    code: "unknown",
    message: `请求失败 (HTTP ${status})：${apiMessage || "未知错误"}`,
  };
}

/** 文生图 */
export async function generateImage(params: GenerateParams): Promise<ApiResult> {
  const { prompt, size, provider } = params;
  const [width, height] = size.split("x");

  const body = JSON.stringify({
    model: provider.model,
    prompt,
    size: `${width}x${height}`,
    n: 1,
    response_format: "b64_json",
  });

  try {
    const response = await fetch(`${provider.baseUrl}/v1/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body,
    });

    if (!response.ok) {
      const errText = await response.text();
      const { message, code } = formatError(response.status, errText);
      return { success: false, images: [], error: message, errorCode: code };
    }

    const data = await response.json();
    const images: ArrayBuffer[] = [];

    for (const item of data.data || []) {
      if (item.b64_json) {
        const binary = atob(item.b64_json);
        const buffer = new ArrayBuffer(binary.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < binary.length; i++) {
          view[i] = binary.charCodeAt(i);
        }
        images.push(buffer);
      } else if (item.url) {
        const imgResp = await fetch(item.url);
        const arrBuf = await imgResp.arrayBuffer();
        images.push(arrBuf);
      }
    }

    return { success: true, images };
  } catch (e: any) {
    const msg = e.message || "";
    if (msg.includes("fetch") || msg.includes("Failed to fetch") || msg.includes("ENOTFOUND") || msg.includes("ECONNREFUSED")) {
      return {
        success: false,
        images: [],
        error: "无法连接到 API 服务器，请检查：\n• 网络连接是否正常\n• 「模型管理」中的请求地址是否正确",
        errorCode: "network",
      };
    }
    return {
      success: false,
      images: [],
      error: `网络异常：${msg}`,
      errorCode: "network",
    };
  }
}

/** 图生图 */
export async function generateImageWithRef(
  params: GenerateWithRefParams
): Promise<ApiResult> {
  const { prompt, size, provider, refImages } = params;
  const [width, height] = size.split("x");

  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("size", `${width}x${height}`);
  formData.append("model", provider.model);
  formData.append("n", "1");
  formData.append("response_format", "b64_json");

  for (const file of refImages) {
    formData.append("image", file);
  }

  try {
    const response = await fetch(`${provider.baseUrl}/v1/images/edits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      const { message, code } = formatError(response.status, errText);
      return { success: false, images: [], error: message, errorCode: code };
    }

    const data = await response.json();
    const images: ArrayBuffer[] = [];

    for (const item of data.data || []) {
      if (item.b64_json) {
        const binary = atob(item.b64_json);
        const buffer = new ArrayBuffer(binary.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < binary.length; i++) {
          view[i] = binary.charCodeAt(i);
        }
        images.push(buffer);
      } else if (item.url) {
        const imgResp = await fetch(item.url);
        const arrBuf = await imgResp.arrayBuffer();
        images.push(arrBuf);
      }
    }

    return { success: true, images };
  } catch (e: any) {
    const msg = e.message || "";
    if (msg.includes("fetch") || msg.includes("Failed to fetch") || msg.includes("ENOTFOUND") || msg.includes("ECONNREFUSED")) {
      return {
        success: false,
        images: [],
        error: "无法连接到 API 服务器，请检查：\n• 网络连接是否正常\n• 「模型管理」中的请求地址是否正确",
        errorCode: "network",
      };
    }
    return {
      success: false,
      images: [],
      error: `网络异常：${msg}`,
      errorCode: "network",
    };
  }
}
