const { contextBridge, ipcRenderer } = require("electron");
const dev = "Spaker the TMC";

window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload script loaded successfully!');
  });
contextBridge.exposeInMainWorld("electronAPI", {
    devName: dev,
    addEleve: (req) => ipcRenderer.send('add-eleve', req),
    requeteSQL: () => ipcRenderer.send('requete-sql'),
    recevoirResultats: (callback) => ipcRenderer.on('resultat-sql', callback),
    setSql: (args) => ipcRenderer.send('set-sql', args),
    sql: () => ipcRenderer.invoke('sql'),
    setTitle: (title) => ipcRenderer.send('set-title', title),
    ping: () => ipcRenderer.invoke('ping'),
});