import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getConfig: () => ipcRenderer.invoke("get-config"),
  setConfig: (config: any) => ipcRenderer.invoke("set-config", config),
  getHistory: () => ipcRenderer.invoke("get-history"),
  setHistory: (history: any[]) => ipcRenderer.invoke("set-history", history),
  readImage: (filename: string) => ipcRenderer.invoke("read-image", filename),
  saveImageBuffer: (filename: string, buffer: ArrayBuffer) =>
    ipcRenderer.invoke("save-image-buffer", filename, buffer),
  saveUploadImage: (filename: string, dataUrl: string) =>
    ipcRenderer.invoke("save-upload-image", filename, dataUrl),
  readUploadImage: (filename: string) =>
    ipcRenderer.invoke("read-upload-image", filename),
  downloadImage: (url: string, filename: string) =>
    ipcRenderer.invoke("download-image", url, filename),
  clearAllImages: () => ipcRenderer.invoke("clear-all-images"),
  openStorageFolder: () => ipcRenderer.invoke("open-storage-folder"),
  fetchUrlBuffer: (url: string, authHeader?: string) =>
    ipcRenderer.invoke("fetch-url-buffer", url, authHeader),
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
});
