const { contextBridge, ipcRenderer } = require("electron");
const dev = "Spaker the TMC";

window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload script loaded successfully!');
  });
contextBridge.exposeInMainWorld("electronAPI", {
    // pour le login : 
    userLogin: (username,password) => ipcRenderer.send('user-login', username, password),
    loginSuccess: (callback) => ipcRenderer.on('login-success', callback),
    loginFail: (callback) => ipcRenderer.on('login-fail', callback),
    // pour la page d'acceuil
    addEleve: (req) => ipcRenderer.send('add-eleve', req),
    requeteSQL: () => ipcRenderer.send('requete-sql'),
    recevoirResultats: (callback) => ipcRenderer.on('resultat-sql', callback),
    // pour les test :
    devName: dev,
    setTitle: (title) => ipcRenderer.send('set-title', title),
    ping: () => ipcRenderer.invoke('ping'),
});