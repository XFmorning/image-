import { app, BrowserWindow, ipcMain, shell, Menu, safeStorage, Tray, nativeImage } from "electron";
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

  // --- 历史记录（带写入锁防并发损坏） ---

  let historyWriteLock: Promise<void> = Promise.resolve();

  ipcMain.handle("get-history", async () => {
    try {
      const raw = await fs.promises.readFile(historyPath, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  ipcMain.handle("set-history", async (_, history) => {
    const prev = historyWriteLock;
    let resolve: () => void;
    historyWriteLock = new Promise<void>((r) => { resolve = r; });
    await prev;
    try {
      await fs.promises.writeFile(historyPath, JSON.stringify(history, null, 2), "utf-8");
    } finally {
      resolve!();
    }
    return true;
  });

  // 原子追加一条历史记录（避免读-改-写竞争）
  ipcMain.handle("append-to-history", async (_, entry: any) => {
    const prev = historyWriteLock;
    let resolve: () => void;
    historyWriteLock = new Promise<void>((r) => { resolve = r; });
    await prev;
    try {
      let history: any[] = [];
      try {
        const raw = await fs.promises.readFile(historyPath, "utf-8");
        history = JSON.parse(raw);
      } catch { /* 文件不存在或损坏则从空开始 */ }
      history.unshift(entry);
      await fs.promises.writeFile(historyPath, JSON.stringify(history), "utf-8");
    } finally {
      resolve!();
    }
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
    // 先试不带认证头（有些 CDN/S3 预签名 URL 带了认证反而 403）
    for (const useAuth of [false, true]) {
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 30000); // 30s 超时
      try {
        const headers: Record<string, string> = {};
        if (useAuth && authHeader) headers["Authorization"] = authHeader;
        console.log(`[main] fetch-url-buffer ${useAuth ? "带认证" : "无认证"}:`, url.substring(0, 80) + "...");
        const response = await fetch(url, { headers, signal: ac.signal });
        clearTimeout(timer);
        console.log("[main] fetch-url-buffer 响应状态:", response.status, response.headers.get("content-type"));
        if (response.ok) {
          const buf = await response.arrayBuffer();
          console.log("[main] fetch-url-buffer 下载成功，大小:", buf.byteLength);
          const base64 = Buffer.from(buf).toString("base64");
          return "data:image/png;base64," + base64;
        }
        console.error("[main] fetch-url-buffer HTTP 错误:", response.status);
      } catch (e: any) {
        clearTimeout(timer);
        if (e.name === "AbortError") {
          console.error("[main] fetch-url-buffer 30s 超时:", url.substring(0, 60));
        } else {
          console.error("[main] fetch-url-buffer 异常:", e.message || e);
        }
      }
    }
    return null;
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

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
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
    mainWindow?.show();
  });

  // 关闭窗口 → 最小化到托盘
  mainWindow.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
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

// ========== 托盘 ==========

function createTray() {
  // 用简单的 16x16 彩色图标（绿色圆点）
  const icon = nativeImage.createFromDataURL(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2NkYPj/n4EBBJgYKAQMowJGDcAaQDMPGNEIGNAAAwahwYAM4w0whkEDBg0AAGFfD4Gx4gM5AAAAAElFTkSuQmCC"
  );
  tray = new Tray(icon);
  tray.setToolTip("FutureAI Image - 正在运行");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      },
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        (app as any).isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
}

// ========== 应用生命周期 ==========

app.whenReady().then(() => {
  ensureDirs();
  registerIpcHandlers();
  Menu.setApplicationMenu(null);
  createWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
});

app.on("before-quit", () => {
  (app as any).isQuitting = true;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
