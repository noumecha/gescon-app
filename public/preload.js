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
    // type conge : 
    congeTypeAddedSuccess: (callback) => ipcRenderer.on('conge-type-added-success', callback),
    addCongeType: (req) => ipcRenderer.send('add-conge-type', req),
    getCongeType: () => ipcRenderer.send('get-conge-type'),
    retrieveCongeType: (callback) => ipcRenderer.on('all-conge-type', callback),
    // conge : 
    congeAddedSuccess: (callback) => ipcRenderer.on('conge-added-success', callback),
    addConge: (req) => ipcRenderer.send('add-conge', req),
    getConge: () => ipcRenderer.send('get-conge'),
    retrieveConge: (callback) => ipcRenderer.on('all-conge', callback),
    // decision : 
    decisionAddedSuccess: (callback) => ipcRenderer.on('decision-added-success', callback),
    addDecision: (req) => ipcRenderer.send('add-decision', req),
    getDecision: () => ipcRenderer.send('get-decision'),
    retrieveDecision: (callback) => ipcRenderer.on('all-decision', callback),
    // demande :
    demandeAddedSuccess: (callback) => ipcRenderer.on('demande-added-success', callback),
    addDemande: (req) => ipcRenderer.send('add-demande',req),
    getDemande: () => ipcRenderer.send('get-demande'),
    retrieveDemande: (callback) => ipcRenderer.on('all-demande', callback),
    // document à fournir : 
    documentAddedSuccess: (callback) => ipcRenderer.on('document-added-success', callback),
    addDocument: (req) => ipcRenderer.send('add-document', req),
    getDocument: () => ipcRenderer.send('get-document'),
    retrieveDocument: (callback) => ipcRenderer.on('all-document', callback),
    // personnel : 
    personnelAddedSuccess: (callback) => ipcRenderer.on('personnel-added-success', callback),
    addPersonnel : (req) => ipcRenderer.send('add-personnel', req),// to add personnel in the db
    getPersonnel: () => ipcRenderer.send('get-personnel'), // execute select all personnel
    receivePersonnel: (callback) => ipcRenderer.on('all-personnel', callback), // get all personnel form the getPersonnel function
    // for users : 
    userAddedSuccess: (callback) => ipcRenderer.on('user-added-success', callback),
    addUsers: (req) => ipcRenderer.send('add-user', req),
    getUsers: () => ipcRenderer.send('get-users'),
    retrieveUsers: (callback) => ipcRenderer.on('all-users', callback)
});