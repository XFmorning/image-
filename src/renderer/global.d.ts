interface ProviderConfig {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
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
  readImage: (filename: string) => Promise<string>;
  saveImageBuffer: (filename: string, buffer: ArrayBuffer) => Promise<string>;
  saveUploadImage: (filename: string, dataUrl: string) => Promise<string>;
  readUploadImage: (filename: string) => Promise<string>;
  downloadImage: (url: string, filename: string) => Promise<string>;
  clearAllImages: () => Promise<boolean>;
  openStorageFolder: () => Promise<void>;
  openExternal: (url: string) => Promise<void>;
}

interface Window {
  electronAPI: ElectronAPI;
}
