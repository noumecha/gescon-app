const { contextBridge, ipcRenderer } = require("electron");
const dev = "Spaker the TMC";

window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload script loaded successfully!');
  });
contextBridge.exposeInMainWorld("electronAPI", {
    devName: dev,
    //addEleve: (req) => ipcRenderer.send('add-eleve', req),
    requeteSQL: () => ipcRenderer.send('requete-sql'),
    recevoirResultats: (callback) => ipcRenderer.on('resultat-sql', callback),
    setTitle: (title) => ipcRenderer.send('set-title', title),
    ping: () => ipcRenderer.invoke('ping'),
    // personnel : 
    personnelAddedSuccess: (callback) => ipcRenderer.on('personnel-added-success', callback),
    addPersonnel : (req) => ipcRenderer.send('add-personnel', req),// to add personnel in the db
    getPersonnel: () => ipcRenderer.send('get-personnel'), // execute select all personnel
    receivePersonnel: (callback) => ipcRenderer.on('all-personnel', callback), // get all personnel form the getPersonnel function
});