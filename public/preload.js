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
    getAttestationConge: () => ipcRenderer.send('get-attestation-conge'),
    retrieveAttestationConge: (callback) => ipcRenderer.on('all-attestation-conge', callback),
    addArchiveAttestaetionCong: (req) => ipcRenderer.send('add-archive-attestation-conge' , req),
    addArchiveAttCongeSuccess: (callback) => ipcRenderer.on('attestation-conge-added-success', callback),
    updateConge: (req) => ipcRenderer.send('update-conge' , req),
    updateCongeSuccess: (callback) => ipcRenderer.on('update-conge-success', callback),
    getArchiveAttConge: () => ipcRenderer.send('get-archive-att-conge'),
    retrieveArchiveAttConge: (callback) => ipcRenderer.on('all-archived-conge', callback),
    deleteArchiveAttConge: (req) => ipcRenderer.send('delete-archive-att-conge', req),
    deleteArchiveAttCongeSuccess: (callback) => ipcRenderer.on('delete-archive-att-conge-success', callback),
    getSpecificCongeType: (arg) => ipcRenderer.send('get-specific-conge-type', arg),
    retrieveSpecificCongeType: (callback) => ipcRenderer.on('specific-conge-type', callback),
    // decision : 
    decisionAddedSuccess: (callback) => ipcRenderer.on('decision-added-success', callback),
    addDecision: (req) => ipcRenderer.send('add-decision', req),
    deleteDecisionSuccess: (callback) => ipcRenderer.on('decision-deleted-success', callback),
    deleteDecision: (req) => ipcRenderer.send('delete-decision', req),
    getDecision: () => ipcRenderer.send('get-decision'),
    retrieveDecision: (callback) => ipcRenderer.on('all-decision', callback),
    getSpecificDec: (arg) => ipcRenderer.send('get-specific-decision', arg),
    retrieveSpecificDec: (callback) => ipcRenderer.on('specific-decision', callback),
    // demande :
    /*demandeCongeAddedSuccess: (callback) => ipcRenderer.on('demande-added-success-conge', callback),
    addDemandeConge: (req) => ipcRenderer.send('add-demande-conge',req),
    getDemandeConge: () => ipcRenderer.send('get-demande-conge'),*/
    retrieveDemandeConge: (callback) => ipcRenderer.on('all-demande-conge', callback),
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
    updatePersonnelSuccess: (callback) => ipcRenderer.on('update-personnel-success', callback),
    updatePersonnel: (req) => ipcRenderer.send('update-personnel', req),
    // for users : 
    userAddedSuccess: (callback) => ipcRenderer.on('user-added-success', callback),
    addUsers: (req) => ipcRenderer.send('add-user', req),
    getUsers: () => ipcRenderer.send('get-users'),
    retrieveUsers: (callback) => ipcRenderer.on('all-users', callback),
});