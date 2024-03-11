const { contextBridge, ipcRenderer } = require("electron");
const dev = "Spaker the TMC";

window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload script loaded successfully!');
  });
contextBridge.exposeInMainWorld("electronAPI", {
    devName: dev,
    ping: () => ipcRenderer.invoke('ping'),
});