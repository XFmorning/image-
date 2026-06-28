import { app, BrowserWindow, ipcMain, shell, Menu, safeStorage } from "electron";
import path from "path";
import fs from "fs";

// 处理 Windows Squirrel 安装/卸载事件
if (require("electron-squirrel-startup")) {
  app.quit();
}

function getDataDir(): string {
  if (app.isPackaged) {
    return path.join(path.dirname(app.getPath("exe")), "data");
  }
  return path.join(app.getAppPath(), "data");
}

function ensureDirs() {
  const dataDir = getDataDir();
  for (const sub of ["images", "uploads"]) {
    const p = path.join(dataDir, sub);
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
  }
}

// ========== 加解密工具 ==========

function encryptApiKey(plaintext: string): string {
  if (!safeStorage.isEncryptionAvailable()) {
    return Buffer.from(plaintext, "utf-8").toString("base64");
  }
  return safeStorage.encryptString(plaintext).toString("base64");
}

function decryptApiKey(encoded: string): string {
  if (!safeStorage.isEncryptionAvailable()) {
    return Buffer.from(encoded, "base64").toString("utf-8");
  }
  return safeStorage.decryptString(Buffer.from(encoded, "base64"));
}

// ========== IPC Handler 注册 ==========

function registerIpcHandlers() {
  const dataDir = getDataDir();
  const configPath = path.join(dataDir, "config.json");
  const historyPath = path.join(dataDir, "history.json");
  const imagesDir = path.join(dataDir, "images");
  const uploadsDir = path.join(dataDir, "uploads");

  // --- 配置管理 ---

  ipcMain.handle("get-config", async () => {
    try {
      const raw = await fs.promises.readFile(configPath, "utf-8");
      const config = JSON.parse(raw);
      if (config.providers) {
        for (const p of config.providers) {
          if (p.apiKey) {
            try {
              p.apiKey = decryptApiKey(p.apiKey);
            } catch {
              p.apiKey = "";
            }
          }
        }
      }
      return config;
    } catch {
      return { providers: [], activeProviderId: "" };
    }
  });

  ipcMain.handle("set-config", async (_, config) => {
    const cloned = JSON.parse(JSON.stringify(config));
    if (cloned.providers) {
      for (const p of cloned.providers) {
        if (p.apiKey) {
          p.apiKey = encryptApiKey(p.apiKey);
        }
      }
    }
    await fs.promises.writeFile(configPath, JSON.stringify(cloned, null, 2), "utf-8");
    return true;
  });

  // --- 历史记录 ---

  ipcMain.handle("get-history", async () => {
    try {
      const raw = await fs.promises.readFile(historyPath, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  ipcMain.handle("set-history", async (_, history) => {
    await fs.promises.writeFile(historyPath, JSON.stringify(history, null, 2), "utf-8");
    return true;
  });

  // --- 图片读写 ---

  ipcMain.handle("read-image", async (_, filename: string) => {
    const filePath = path.join(imagesDir, filename);
    const data = await fs.promises.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
    return `data:${mime};base64,${data.toString("base64")}`;
  });

  ipcMain.handle("save-image-buffer", async (_, filename: string, buffer: ArrayBuffer) => {
    const filePath = path.join(imagesDir, filename);
    await fs.promises.writeFile(filePath, Buffer.from(buffer));
    return filePath;
  });

  ipcMain.handle("save-upload-image", async (_, filename: string, dataUrl: string) => {
    const filePath = path.join(uploadsDir, filename);
    const base64 = dataUrl.split(",")[1];
    await fs.promises.writeFile(filePath, Buffer.from(base64, "base64"));
    return filePath;
  });

  ipcMain.handle("read-upload-image", async (_, filename: string) => {
    const filePath = path.join(uploadsDir, filename);
    const data = await fs.promises.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
    return `data:${mime};base64,${data.toString("base64")}`;
  });

  // --- 下载网络图片 ---

  ipcMain.handle("download-image", async (_, url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const filePath = path.join(imagesDir, filename);
      const uint8 = new Uint8Array(await response.arrayBuffer());
      await fs.promises.writeFile(filePath, uint8);
      return filePath;
    } catch {
      return "";
    }
  });

  // --- URL 下载（绕过 CORS） ---

  ipcMain.handle("fetch-url-buffer", async (_, url: string, authHeader?: string) => {
    try {
      const headers: Record<string, string> = {};
      if (authHeader) headers["Authorization"] = authHeader;
      const response = await fetch(url, { headers });
      if (!response.ok) return null;
      const buf = await response.arrayBuffer();
      return Buffer.from(buf); // 转为 Node Buffer，Electron IPC 可序列化
    } catch {
      return null;
    }
  });

  // --- 存储管理 ---

  ipcMain.handle("clear-all-images", async () => {
    for (const dir of [imagesDir, uploadsDir]) {
      const files = await fs.promises.readdir(dir);
      for (const f of files) {
        await fs.promises.unlink(path.join(dir, f));
      }
    }
    await fs.promises.writeFile(historyPath, "[]", "utf-8");
    return true;
  });

  ipcMain.handle("open-storage-folder", async () => {
    shell.openPath(imagesDir);
  });

  // --- 外部链接 ---

  ipcMain.handle("open-external", async (_, url: string) => {
    if (/^https?:\/\//.test(url)) {
      await shell.openExternal(url);
    }
  });
}

// ========== 窗口创建 ==========

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    },
    show: false,
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // 开发模式使用 Vite dev server，生产模式加载打包文件
  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, "../renderer/main_window/index.html")
    );
  }
}

// ========== 应用生命周期 ==========

app.whenReady().then(() => {
  ensureDirs();
  registerIpcHandlers();
  Menu.setApplicationMenu(null);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
