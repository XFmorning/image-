type ApiProtocol = "openai" | "stability" | "custom";

interface ProviderConfig {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  apiProtocol: ApiProtocol;
  t2iEndpoint: string;   // 文生图接口路径，如 /v1/images/generations
  i2iEndpoint: string;   // 图生图接口路径，如 /v1/images/edits
  createdAt: number;
}

interface Config {
  providers: ProviderConfig[];
  activeProviderId: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  translatedPrompt?: string;
  imagePath: string;
  providerName: string;
  model: string;
  size: string;
  mode: "t2i" | "i2i";
  refImagePaths?: string[];
  timestamp: number;
  status: "completed" | "failed";
  errorMessage?: string;
}

interface ElectronAPI {
  getConfig: () => Promise<Config>;
  setConfig: (config: Config) => Promise<boolean>;
  getHistory: () => Promise<HistoryItem[]>;
  setHistory: (history: HistoryItem[]) => Promise<boolean>;
  appendToHistory: (entry: any) => Promise<boolean>;
  readImage: (filename: string) => Promise<string>;
  saveImageBuffer: (filename: string, buffer: ArrayBuffer) => Promise<string>;
  saveUploadImage: (filename: string, dataUrl: string) => Promise<string>;
  readUploadImage: (filename: string) => Promise<string>;
  downloadImage: (url: string, filename: string) => Promise<string>;
  clearAllImages: () => Promise<boolean>;
  openStorageFolder: () => Promise<void>;
  fetchUrlBuffer: (url: string, authHeader?: string) => Promise<string | null>;
  openExternal: (url: string) => Promise<void>;
}

interface Window {
  electronAPI: ElectronAPI;
}
