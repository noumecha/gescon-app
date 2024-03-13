/*const { ipcRenderer } = require('electron');

// Envoie un message au processus principal pour récupérer les éléments de la table "élève"
ipcRenderer.send('get-eleves');

// Réception d'une réponse du processus principal avec les éléments de la table "élève"
ipcRenderer.on('eleves-result', (event, result) => {
  if (result.success) {
    console.log('Récupération des éléments de la table "élève" avec succès :', result.data);
    // Mettre à jour l'état ou faire toute autre opération avec les données reçues
  } else {
    console.error('Erreur lors de la récupération des éléments de la table "élève" :', result.error);
    // Gérer l'erreur de manière appropriée
  }
});*/

const title = window.electronAPI.setTitle("test-title");
console.log("title setted : " + title);