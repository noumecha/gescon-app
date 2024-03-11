const { contextBridge, ipcRenderer } = require("electron");
const { userDB } = require("./database/DBManager");
const dev = "Spaker the TMC";

window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload script loaded successfully!');
  });
contextBridge.exposeInMainWorld("electronAPI", {
    devName: dev,
    userDB,
    ping: () => ipcRenderer.invoke('ping'),
});