const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

let flaskProc = null;
let frontendProc = null;

const isDev = !app.isPackaged;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4321";
const DEFAULT_FLASK_PORT = 5001;
let currentFlaskPort = DEFAULT_FLASK_PORT;
let flaskPortKnownPromise = null; // Promise to signal when the Flask port is known
let resolveFlaskPortKnown; // Function to resolve the promise

function getBackendPaths() {
  if (isDev) {
    // In development, run the Python script directly
    return {
      command: process.platform === "win32" ? "python" : "python3",
      args: [path.join(__dirname, "../backend/main.py")],
      cwd: path.join(__dirname, "../backend"),
      isExecutable: false,
    };
  } else {
    // In production, run the PyInstaller executable
    const executableName = "EartFlaskBackend";
    const platformExecutableName =
      process.platform === "win32" ? `${executableName}.exe` : executableName;
    const executableDir = path.join(process.resourcesPath, "python_dist");
    const fullExecutablePath = path.join(executableDir, platformExecutableName);
    return {
      command: fullExecutablePath,
      args: [],
      cwd: executableDir,
      isExecutable: true,
    };
  }
}

function startFlask() {
  // Create a new promise each time Flask starts
  flaskPortKnownPromise = new Promise((resolve) => {
    resolveFlaskPortKnown = resolve;
  });

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
      resolveFlaskPortKnown(); // Resolve promise even on early exit to not hang app
      return flaskPortKnownPromise;
    }
    logDir = __dirname; // Fallback for dev
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
      { flag: "w" } // Overwrite log on new start
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
    // Not returning here, as other console logs might still be useful
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
    if (resolveFlaskPortKnown) resolveFlaskPortKnown();
    return flaskPortKnownPromise;
  }
  if (!fs.existsSync(backendConfig.cwd)) {
    const errorMsg = `[${new Date().toISOString()}] ERROR: Backend CWD not found at ${
      backendConfig.cwd
    }\n`;
    console.error(errorMsg);
    fs.writeFileSync(flaskLogPath, errorMsg, { flag: "a" });
    if (resolveFlaskPortKnown) resolveFlaskPortKnown();
    return flaskPortKnownPromise;
  }

  currentFlaskPort = DEFAULT_FLASK_PORT; // Reset to default before each start attempt

  flaskProc = spawn(backendConfig.command, backendConfig.args, {
    cwd: backendConfig.cwd,
  });

  let portFound = false;
  flaskProc.stdout.on("data", (data) => {
    const output = data.toString();
    const message = `[Flask STDOUT][${new Date().toISOString()}]: ${output}`;
    console.log(message);
    fs.writeFileSync(flaskLogPath, message, { flag: "a" });

    if (!portFound) {
      const match = output.match(/^FLASK_RUNNING_ON_PORT=(\d+)/m);
      if (match && match[1]) {
        const parsedPort = parseInt(match[1], 10);
        if (!isNaN(parsedPort)) {
          currentFlaskPort = parsedPort;
          portFound = true;
          const portMsg = `[Main Process] Flask backend confirmed running on dynamic port: ${currentFlaskPort}`;
          console.log(portMsg);
          fs.writeFileSync(
            flaskLogPath,
            `[${new Date().toISOString()}] ${portMsg}\n`,
            { flag: "a" }
          );
          if (resolveFlaskPortKnown) resolveFlaskPortKnown();
        }
      }
    }
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
    if (!portFound && resolveFlaskPortKnown) {
      console.warn(
        "[Main Process] Flask process closed before port was identified."
      );
      fs.writeFileSync(
        flaskLogPath,
        `[${new Date().toISOString()}] [Main Process] Flask process closed before port was identified.\n`,
        { flag: "a" }
      );
      resolveFlaskPortKnown(); // Ensure promise resolves if process dies before port is found
    }
  });

  flaskProc.on("error", (err) => {
    const message = `[Main Process][${new Date().toISOString()}] Failed to start Flask process (spawn error): ${err.toString()}\n`;
    console.error(message);
    fs.writeFileSync(flaskLogPath, message, { flag: "a" });
    if (resolveFlaskPortKnown) resolveFlaskPortKnown(); // Ensure promise resolves on spawn error
  });

  return flaskPortKnownPromise;
}

function stopFlask() {
  if (flaskProc) {
    console.log("[Main Process] Stopping Flask process...");
    const flaskLogPath = path.join(
      app.getPath("userData"),
      "flask-backend.log"
    );
    // Check if logDir was successfully created before trying to write to it
    if (fs.existsSync(path.dirname(flaskLogPath))) {
      fs.writeFileSync(
        flaskLogPath,
        `[${new Date().toISOString()}] Attempting to stop Flask process.\n`,
        { flag: "a" }
      );
    }
    flaskProc.kill();
    flaskProc = null;
  }
}

// Placeholder for frontend dev server logic
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

app.whenReady().then(async () => {
  await startFlask(); // Wait for Flask to start and port to be known (or for the attempt to fail)
  console.log(
    `[Main Process] Proceeding after startFlask. Effective Flask port for IPC: ${currentFlaskPort}`
  );

  if (isDev) {
    setTimeout(createWindow, 500);
  } else {
    createWindow();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      // If app is activated and no windows are open, create one.
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

  // Flask port is known before attempting to fetch
  if (flaskPortKnownPromise) {
    await flaskPortKnownPromise; // Wait for the port to be identified from startFlask
  } else {
    const warnMsg =
      "[Main Process] flaskPortKnownPromise not initialized. Using default/last known port for fetch.";
    console.warn(warnMsg);
    if (fs.existsSync(path.dirname(flaskLogPath))) {
      fs.writeFileSync(
        flaskLogPath,
        `[${new Date().toISOString()}][IPC fetch-report] WARNING: ${warnMsg} Using port ${currentFlaskPort}.\n`,
        { flag: "a" }
      );
    }
  }

  console.log(
    `[Main Process] Using Flask port ${currentFlaskPort} for fetch-report.`
  );

  try {
    const fetchUrl = `http://127.0.0.1:${currentFlaskPort}/scrape`;
    if (fs.existsSync(path.dirname(flaskLogPath))) {
      fs.writeFileSync(
        flaskLogPath,
        `[${new Date().toISOString()}][IPC fetch-report] Attempting to fetch from Flask: ${fetchUrl} for client URL: ${url}\n`,
        { flag: "a" }
      );
    }
    console.log(`[Main Process] Attempting to fetch from Flask: ${fetchUrl}`);
    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (fs.existsSync(path.dirname(flaskLogPath))) {
      fs.writeFileSync(
        flaskLogPath,
        `[${new Date().toISOString()}][IPC fetch-report] Flask response status: ${
          response.status
        }\n`,
        { flag: "a" }
      );
    }
    console.log(`[Main Process] Flask response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      const errorMsg = `[Main Process] Flask responded with error ${response.status}: ${errorText}`;
      console.error(errorMsg);
      if (fs.existsSync(path.dirname(flaskLogPath))) {
        fs.writeFileSync(
          flaskLogPath,
          `[${new Date().toISOString()}][IPC fetch-report] ${errorMsg}\n`,
          { flag: "a" }
        );
      }
      throw new Error(
        `Flask request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    if (fs.existsSync(path.dirname(flaskLogPath))) {
      fs.writeFileSync(
        flaskLogPath,
        `[${new Date().toISOString()}][IPC fetch-report] Data received from Flask successfully.\n`,
        { flag: "a" }
      );
    }
    console.log("[Main Process] Data received from Flask:", data);
    return data;
  } catch (error) {
    const errorMsg = `[Main Process] Error fetching report from Flask: ${error.message}`;
    console.error(errorMsg);
    if (fs.existsSync(path.dirname(flaskLogPath))) {
      fs.writeFileSync(
        flaskLogPath,
        `[${new Date().toISOString()}][IPC fetch-report] ${errorMsg}\n`,
        { flag: "a" }
      );
    }
    return { error: `Failed to fetch report from backend: ${error.message}` };
  }
});
