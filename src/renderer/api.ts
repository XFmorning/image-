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
  error?: string;
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
      const err = await response.text();
      return { success: false, images: [], error: `HTTP ${response.status}: ${err}` };
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
    return { success: false, images: [], error: e.message || "网络请求失败" };
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
      const err = await response.text();
      return { success: false, images: [], error: `HTTP ${response.status}: ${err}` };
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
    return { success: false, images: [], error: e.message || "网络请求失败" };
  }
}
