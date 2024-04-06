const { contextBridge, ipcRenderer } = require("electron");
const dev = "Spaker the TMC";
ipcRenderer.setMaxListeners(1000);

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
    addConge: (req) => ipcRenderer.send('add-conge', req),
    congeAddedSuccess: (callback) => ipcRenderer.on('conge-added-success', callback),    
    getConge: () => ipcRenderer.send('get-conge'),
    retrieveConge: (callback) => ipcRenderer.on('all-conge', callback),
    getAttestationConge: () => ipcRenderer.send('get-attestation-conge'),
    retrieveAttestationConge: (callback) => ipcRenderer.on('all-attestation-conge', callback),
    addArchiveAttestationConge: (req) => ipcRenderer.send('add-archive-attestation-conge' , req),
    addArchiveAttCongeSuccess: (callback) => ipcRenderer.on('attestation-conge-added-success', callback),
    updateConge: (req) => ipcRenderer.send('update-conge' , req),
    updateCongeSuccess: (callback) => ipcRenderer.on('update-conge-success', callback),
    getArchiveAttConge: () => ipcRenderer.send('get-archive-att-conge'),
    retrieveArchiveAttConge: (callback) => ipcRenderer.on('all-archived-conge', callback),
    deleteArchiveAttConge: (req) => ipcRenderer.send('delete-archive-att-conge', req),
    deleteArchiveAttCongeSuccess: (callback) => ipcRenderer.on('delete-archive-att-conge-success', callback),
    getSpecificCongeType: (arg) => ipcRenderer.send('get-specific-conge-type', arg),
    retrieveSpecificCongeType: (callback) => ipcRenderer.on('specific-conge-type', callback),
    // permission : 
    permissionAddedSuccess: (callback) => ipcRenderer.on('permission-added-success', callback),
    addPermission: (req) => ipcRenderer.send('add-permission', req),
    getPermission: () => ipcRenderer.send('get-permission'),
    retrievePermission: (callback) => ipcRenderer.on('all-permission', callback),
    getLastPermission: (req) => ipcRenderer.send('get-last-permission', req),
    retrieveLastPermission: (callback) => ipcRenderer.on('all-last-permission', callback),
    getAttestationPermission: () => ipcRenderer.send('get-attestation-permission'),
    retrieveAttestationPermission: (callback) => ipcRenderer.on('all-attestation-permission', callback),
    addArchiveAttestationPermission: (req) => ipcRenderer.send('add-archive-attestation-permission' , req),
    addArchiveAttPermissionSuccess: (callback) => ipcRenderer.on('attestation-permission-added-success', callback),
    updatePermission: (req) => ipcRenderer.send('update-permission' , req),
    updatePermissionSuccess: (callback) => ipcRenderer.on('update-permission-success', callback),
    getArchiveAttPermission: () => ipcRenderer.send('get-archive-att-permission'),
    retrieveArchiveAttPermission: (callback) => ipcRenderer.on('all-archived-permission', callback),
    deleteArchiveAttPermission: (req) => ipcRenderer.send('delete-archive-att-permission', req),
    deleteArchiveAttPermissionSuccess: (callback) => ipcRenderer.on('delete-archive-att-permission-success', callback),
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
    getSpecificPersonnel: (req) => ipcRenderer.send('get-specific-personnel', req),
    retrieveSpecificPersonnel: (callback) => ipcRenderer.on('specific-personnel', callback),
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