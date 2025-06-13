const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, fn) => ipcRenderer.on(channel, (e, ...args) => fn(...args)),
});

contextBridge.exposeInMainWorld("api", {
  fetchReport: (url) => ipcRenderer.invoke("fetch-report", url),
});
