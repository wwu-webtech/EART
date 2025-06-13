const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

let flaskProc = null;
let frontendProc = null;

const isDev = !app.isPackaged;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4321";
const FLASK_PORT = 5001; // Ensure your PyInstaller'd Flask app still uses this port

function getBackendPaths() {
  if (isDev) {
    // In development, we run the Python script directly
    return {
      command: process.platform === "win32" ? "python" : "python3",
      args: [path.join(__dirname, "../backend/main.py")],
      cwd: path.join(__dirname, "../backend"),
      isExecutable: false, // Indicates we're running python with a script
    };
  } else {
    // In production, we run the PyInstaller executable
    const executableName = "EartFlaskBackend"; // The name of your PyInstaller executable
    // On macOS, executables usually don't have an extension. On Windows, it would be .exe
    const platformExecutableName =
      process.platform === "win32" ? `${executableName}.exe` : executableName;

    const executableDir = path.join(process.resourcesPath, "python_dist");
    const fullExecutablePath = path.join(executableDir, platformExecutableName);

    return {
      command: fullExecutablePath, // This is the command to run
      args: [], // No script arguments needed for the executable itself
      cwd: executableDir, // CWD for the executable
      isExecutable: true, // Indicates we're running a direct executable
    };
  }
}

function startFlask() {
  let logDir;
  try {
    logDir = app.getPath("userData");
    console.log(`[Main Process] userData path: ${logDir}`);
    if (!fs.existsSync(logDir)) {
      console.log(`[Main Process] Creating userData directory: ${logDir}`);
      fs.mkdirSync(logDir, { recursive: true });
    }
  } catch (e) {
    console.error(
      `[Main Process] CRITICAL ERROR: Failed to get/create userData directory: ${e.toString()}`
    );
    if (!isDev) {
      dialog.showErrorBox(
        "Fatal Error",
        `Could not access application data directory: ${e.message}. Please check permissions or reinstall.`
      );
      app.quit();
      return;
    }
    logDir = __dirname;
    console.warn(
      `[Main Process] Warning: Using __dirname as fallback log directory: ${logDir}`
    );
  }

  const flaskLogPath = path.join(logDir, "flask-backend.log");
  console.log(
    `[Main Process] Attempting to log Flask backend activity to: ${flaskLogPath}`
  );

  try {
    fs.writeFileSync(
      flaskLogPath,
      `[${new Date().toISOString()}] --- Log Initialized by startFlask --- \n`,
      { flag: "w" }
    );
  } catch (e) {
    console.error(
      `[Main Process] CRITICAL ERROR: Failed to write initial entry to flask-backend.log at ${flaskLogPath}: ${e.toString()}`
    );
    if (!isDev) {
      dialog.showErrorBox(
        "Fatal Error",
        `Could not write to log file: ${flaskLogPath}. Error: ${e.message}. Please check permissions.`
      );
    }
  }

  const backendConfig = getBackendPaths();

  fs.writeFileSync(
    flaskLogPath,
    `[${new Date().toISOString()}] Backend Command: ${backendConfig.command}\n`,
    { flag: "a" }
  );
  if (backendConfig.args && backendConfig.args.length > 0) {
    fs.writeFileSync(
      flaskLogPath,
      `[${new Date().toISOString()}] Backend Args: ${backendConfig.args.join(
        " "
      )}\n`,
      { flag: "a" }
    );
  }
  fs.writeFileSync(
    flaskLogPath,
    `[${new Date().toISOString()}] Backend CWD: ${backendConfig.cwd}\n`,
    { flag: "a" }
  );

  if (!fs.existsSync(backendConfig.command)) {
    const errorMsg = `[${new Date().toISOString()}] ERROR: Backend command (executable/script) not found at ${
      backendConfig.command
    }\n`;
    console.error(errorMsg);
    fs.writeFileSync(flaskLogPath, errorMsg, { flag: "a" });
    return;
  }
  if (!fs.existsSync(backendConfig.cwd)) {
    const errorMsg = `[${new Date().toISOString()}] ERROR: Backend CWD not found at ${
      backendConfig.cwd
    }\n`;
    console.error(errorMsg);
    fs.writeFileSync(flaskLogPath, errorMsg, { flag: "a" });
    return;
  }

  flaskProc = spawn(backendConfig.command, backendConfig.args, {
    cwd: backendConfig.cwd,
  });

  flaskProc.stdout.on("data", (data) => {
    const message = `[Flask STDOUT][${new Date().toISOString()}]: ${data.toString()}`;
    console.log(message);
    fs.writeFileSync(flaskLogPath, message, { flag: "a" });
  });

  flaskProc.stderr.on("data", (data) => {
    const message = `[Flask STDERR][${new Date().toISOString()}]: ${data.toString()}`;
    console.error(message);
    fs.writeFileSync(flaskLogPath, message, { flag: "a" });
  });

  flaskProc.on("close", (code) => {
    const message = `[Main Process][${new Date().toISOString()}] Flask process exited with code ${code}\n`;
    console.log(message);
    fs.writeFileSync(flaskLogPath, message, { flag: "a" });
  });

  flaskProc.on("error", (err) => {
    const message = `[Main Process][${new Date().toISOString()}] Failed to start Flask process (spawn error): ${err.toString()}\n`;
    console.error(message);
    fs.writeFileSync(flaskLogPath, message, { flag: "a" });
  });
}

function stopFlask() {
  if (flaskProc) {
    console.log("[Main Process] Stopping Flask process...");
    const flaskLogPath = path.join(
      app.getPath("userData"),
      "flask-backend.log"
    );
    fs.writeFileSync(
      flaskLogPath,
      `[${new Date().toISOString()}] Attempting to stop Flask process.\n`,
      { flag: "a" }
    );
    flaskProc.kill();
    flaskProc = null;
  }
}

function startFrontend() {
  console.log("[Main Process] Starting frontend dev server (placeholder)...");
}

function stopFrontend() {
  if (frontendProc) {
    console.log("[Main Process] Stopping frontend dev server (placeholder)...");
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL(FRONTEND_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
  }
}

app.whenReady().then(() => {
  startFlask();

  if (isDev) {
    setTimeout(createWindow, 3000);
  } else {
    createWindow();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  stopFlask();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("fetch-report", async (_, url) => {
  console.log(`[Main Process] IPC 'fetch-report' received for URL: ${url}`);
  const flaskLogPath = path.join(app.getPath("userData"), "flask-backend.log");
  try {
    const fetchUrl = `http://127.0.0.1:${FLASK_PORT}/scrape`;
    fs.writeFileSync(
      flaskLogPath,
      `[${new Date().toISOString()}][IPC fetch-report] Attempting to fetch from Flask: ${fetchUrl} for client URL: ${url}\n`,
      { flag: "a" }
    );
    console.log(`[Main Process] Attempting to fetch from Flask: ${fetchUrl}`);
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    fs.writeFileSync(
      flaskLogPath,
      `[${new Date().toISOString()}][IPC fetch-report] Flask response status: ${
        response.status
      }\n`,
      { flag: "a" }
    );
    console.log(`[Main Process] Flask response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      const errorMsg = `[Main Process] Flask responded with error ${response.status}: ${errorText}`;
      console.error(errorMsg);
      fs.writeFileSync(
        flaskLogPath,
        `[${new Date().toISOString()}][IPC fetch-report] ${errorMsg}\n`,
        { flag: "a" }
      );
      throw new Error(
        `Flask request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    fs.writeFileSync(
      flaskLogPath,
      `[${new Date().toISOString()}][IPC fetch-report] Data received from Flask successfully.\n`,
      { flag: "a" }
    );
    console.log("[Main Process] Data received from Flask:", data);
    return data;
  } catch (error) {
    const errorMsg = `[Main Process] Error fetching report from Flask: ${error.message}`;
    console.error(errorMsg);
    fs.writeFileSync(
      flaskLogPath,
      `[${new Date().toISOString()}][IPC fetch-report] ${errorMsg}\n`,
      { flag: "a" }
    );
    return { error: `Failed to fetch report from backend: ${error.message}` };
  }
});
