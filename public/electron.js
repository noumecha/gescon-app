const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const mysql = require('mysql2');

//const isDev = import('electron-is-dev');

let mainWindow;
function createWindow() {
    // configure the main window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            backgroundThrottling: false, // Avoid background throttling
            enableBlinkFeatures: 'CSSVariables, FontCache',
            sandbox: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: true,
            autoHideMenuBar: true,
            preload: path.join(__dirname, '../public/preload.js')
        }
    });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL(
        `http://localhost:3000`
        //`file://${path.join(__dirname, '../build/index.html')}`
    );

};

function handleSetTitle(event, title) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
}

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gescon_db'
})

// fucntion for the personnel :
function addPersonnelDette(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('add-personnel-dette-success');
    });
}
//addPersonnelDetteSuccess:
function addPersonnel(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('personnel-added-success', { message: 'Personnel ajouté avec succès !' });
    });
}
function getSpecificPersonnel(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('specific-personnel', res);
    })
}
function getPersonnel(event, arg) {
    pool.query('SELECT * FROM Personnel', (err, res) => {
        if (err) throw err;
        event.sender.send('all-personnel', res);
    });
}
function updatePersonnel(event, req) {
    try {
        pool.query(req, (err) => {
            if (err) throw err;
            event.sender.send('update-personnel-success', { message: 'Personnel mis à jour avec succès!' });
        });
    } catch (error) {
        console.log("Error on udpate personnel ", error.message);
    }
}
// functions for decision : 
function getDecision(event, arg) {
    pool.query('SELECT id_decision,decision.id_type_personnel,numero_decision,objet_decision,signataire_decision,date_decision,libelle_type_personnel,statut_decision FROM decision,type_personnel WHERE decision.id_type_personnel = type_personnel.id_type_personnel', (err, res) => {
        if (err) throw err;
        event.sender.send('all-decision', res);
    });
}

function getSpecificDec(event, arg) {
    pool.query('SELECT * FROM decision WHERE id_type_personnel =? AND statut_decision = "activé"', [arg], (err, res) => {
        if (err) throw err;
        event.sender.send('specific-decision', res);
    });
}

function addDecision(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('decision-added-success', { message: 'Decision ajouté avec succès!' });
    })
}

function changeStatutDecision(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('decision-changed-success');
    })
}

function updateDecision(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('decision-updated-success', { message: 'Decision mis à jour avec succès!' });
    })
}

function deleteDecision(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('decision-deleted-success', { message: 'Decision supprimée avec succès!' });
    })
}

// functions for getting all conges :
function getConge(event, req) {
    pool.query('SELECT * FROM conge,personnel WHERE conge.id_personnel = personnel.id_personnel ORDER BY id_conge DESC;', (err, res) => {
        if (err) throw err;
        event.sender.send('all-conge', res);
    });
}

// function for getting specific data

function getAttestationConge(even, req) {
    pool.query('SELECT id_conge,nom_prenom_personnel,matricule_personnel,attestation_conge,statut_attestation_conge FROM conge,personnel WHERE conge.id_personnel = personnel.id_personnel  AND attestation_conge != "null" AND attestation_conge != "" ORDER BY id_conge DESC;', (err, res) => {
        if (err) throw err;
        even.sender.send('all-attestation-conge', res);
    });
}
// attestation reprise congé & archive attestation rep congés
function getAttestationRepConge(event, req) {
    pool.query('SELECT id_conge,nom_prenom_personnel,matricule_personnel,attestation_reprise_service,statut_att_rep_conge FROM conge,personnel WHERE conge.id_personnel = personnel.id_personnel AND attestation_reprise_service != "null" AND attestation_reprise_service != "";', (err, res) => {
        if (err) throw err;
        event.sender.send('all-attestation-rep-conge', res);
    })
}

function addArchiveAttestationRepConge(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('attestation-rep-conge-added-success');
    })
}

function deleteArchiveAttRepConge(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('delete-archive-att-rep-conge-success')
    })
}

function getArchiveAttRepConge(event) {
    pool.query('SELECT archive_att_reprise_conge.id_conge,id_archive_att_reprise_conge,nom_prenom_personnel,matricule_personnel,created_at_archive_att_reprise_conge,fichier_archive_att_reprise_conge FROM conge,personnel,archive_att_reprise_conge WHERE conge.id_personnel = personnel.id_personnel AND conge.id_conge = archive_att_reprise_conge.id_conge;', (err, res) => {
        if (err) throw err;
        event.sender.send('all-archive-att-rep-conge', res);
    });
}
// data -> getting generic data : 
function getData(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('all-specific-data', res);
    });
}
// congés -> getting specific conge by req
function getSpecificConge(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('all-specific-conge', res);
    });
}
// congés -> congés
function addConge(event, req) {
    try {
        pool.query(req, (err) => {
            if (err) throw err;
            event.sender.send('conge-added-success', { message: 'Conge ajouté avec succès!' });
        })
    } catch (error) {
        console.log("Error on adding congé : " , error.message);
    }
}

function updateConge(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('update-conge-success', { message: 'Conge mis à jour avec succès!' });
    });
}

function addArchiveAttestationConge(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('attestation-conge-added-success', { message: 'Attestation de conge ajouté avec succès!' });
    })
}

function getArchiveAttConge(event, req) {
    pool.query('SELECT archive_att_conge.id_conge,id_archive_att_conge,nom_prenom_personnel,matricule_personnel,created_at_arch_att_conge,fichier_archive_att_conge FROM conge,personnel,archive_att_conge WHERE conge.id_personnel = personnel.id_personnel AND conge.id_conge = archive_att_conge.id_conge;', (err, res) => {
        if (err) throw err;
        event.sender.send('all-archived-conge', res);
    });
}

function deleteArchiveAttConge(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('delete-archive-att-conge-success', { message: 'Archive supprimée avec succès!' });
    })
}

// permission 
function getPermission(event, req) {
    pool.query('SELECT * FROM permission,personnel WHERE permission.id_personnel = personnel.id_personnel;', (err, res) => {
        if (err) throw err;
        event.sender.send('all-permission', res);
    });
}

function getAttestationPermission(even, req) {
    pool.query('SELECT id_permission,nom_prenom_personnel,matricule_personnel,attestation_permission,statut_permission,statut_attestation_permission FROM permission,personnel WHERE permission.id_personnel = personnel.id_personnel AND attestation_permission !="null" AND attestation_permission !=""', (err, res) => {
        if (err) throw err;
        even.sender.send('all-attestation-permission', res);
    });
}

function addPermission(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('permission-added-success', { message: 'Permission ajouté avec succès!' });
    })
}

function updatePermission(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('update-permission-success', { message: 'Permission mis à jour avec succès!' });
    });
}

function addArchiveAttestationPermission(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('attestation-permission-added-success', { message: 'Attestation de conge ajouté avec succès!' });
    })
}

function getArchiveAttPermission(event, req) {
    pool.query('SELECT archive_att_permission.id_permission,id_arch_att_permission,nom_prenom_personnel,matricule_personnel,created_at_arch_permission,fichier_arch_att_permission FROM permission,personnel,archive_att_permission WHERE permission.id_personnel = personnel.id_personnel AND permission.id_permission = archive_att_permission.id_permission;', (err, res) => {
        if (err) throw err;
        event.sender.send('all-archived-permission', res);
    });
}

function deleteArchiveAttPermission(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('delete-archive-att-permission-success', { message: 'Archive supprimée avec succès!' });
    })
}

// permission -> attestation reprise permission & archives: 
function getAttestationRepPermission(event) {
    pool.query('SELECT id_permission,nom_prenom_personnel,matricule_personnel,attestation_reprise_permission,statut_permission,statut_att_reprise_permission FROM permission,personnel WHERE permission.id_personnel = personnel.id_personnel AND attestation_reprise_permission !="null" AND attestation_reprise_permission !="";', (err, res) => {
        if (err) throw err;
        event.sender.send('all-attestation-rep-permission', res);
    })
}

function addArchiveAttestationRepPermission(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('attestation-rep-permission-added-success');
    })
}

function getArchiveAttRepPermission(event) {
    pool.query('SELECT archive_att_reprise_permission.id_permission,id_arch_att_rep_permission,nom_prenom_personnel,matricule_personnel,created_at_arch_att_rep_permission,fichier_arch_att_rep_permission FROM permission,personnel,archive_att_reprise_permission WHERE permission.id_personnel = personnel.id_personnel AND permission.id_permission = archive_att_reprise_permission.id_permission;', (err, res) => {
        if (err) throw err;
        event.sender.send('all-archive-att-rep-permission', res);
    })
}

function deleteArchiveAttRepPermission(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('delete-archive-att-rep-permission-success');
    });
}

function getLastPermission(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('all-last-permission', res);
    })
}

// functions for conge type :
function getSpecificCongeType(event, arg) {
    pool.query('SELECT * FROM type_conge WHERE id_type_conge =?', [arg], (err, res) => {
        if (err) throw err;
        event.sender.send('specific-conge-type', res);
    });
}
function getCongeType(event, res) {
    pool.query('SELECT * FROM type_conge', (err, res) => {
        if (err) throw err;
        event.sender.send('all-conge-type', res);
    });
}

function addCongeType(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('conge-type-added-success', { message: 'Type de conge ajouté avec succès!' });
    });
}

// functions for document : 
function addDocument(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('document-added-success', { message: 'Document ajouté avec succès!' });
    });
}
function getDocument(event, req) {
    pool.query('SELECT * FROM doc_a_fournir', (err, res) => {
        if (err) throw err;
        event.sender.send('all-document', res);
    });
}
// functions for add_users : 

function addUser(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('user-added-success', { message: 'Utilisateur ajouté avec succès!' });
    })
}
function delUser(event, r) {
    pool.query(r, (err, res) => {
        if (err) throw err;
        event.sender.send('user-deleted-success', { message: 'Utilisateur ajouté avec succès!' });
    })
}
function getUsers(event, req) {
    pool.query('SELECT * FROM utilisateur', (err, res) => {
        if (err) throw err;
        event.sender.send('all-users', res);
    })
}
function updateUser(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('user-updated-success', res);
    })
}

function updateUserPassword(event, req) {
    pool.query(req, (err) => {
        if (err) throw err;
        event.sender.send('user-password-updated-success', { message: 'Utilisateur ajouté avec succès!' });
    })
}

// structures
function getStructuresNames(event, req) {
    pool.query('SELECT DISTINCT structure_personnel FROM personnel', (err, res) => {
        if (err) throw err;
        event.sender.send('all-structures-names', res);
    });
}

// conges years
function getCongeYears(event, req) {
    pool.query('SELECT DISTINCT YEAR(date_fin_conge) AS annee FROM conge;', (err, res) => {
        if (err) throw err;
        event.sender.send('all-conges-years', res);
    });
}

function getStructuresNamePersonnel(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('all-structures-name-personnel', res);
    });
}

function getStructuresConges(event, req) {
    pool.query(req, (err, res) => {
        if (err) throw err;
        event.sender.send('structures-conges', res);
    });
}

/**
 * cron jobs for udpates conge and personnel states
 */

function parseRepriseDate(str) {
    // str = "dd/mm/yyyy"
    const [day, month, year] = str.split("/").map(Number);
    return new Date(year, month - 1, day);
}

function autoUpdateCongeBackend() {
    console.log("Running auto conges updater …");
    const now = new Date();
    // Load all congés with personnel information
    const sql = `SELECT * FROM conge INNER JOIN personnel ON personnel.id_personnel = conge.id_personnel;`;
    pool.query(sql, (err, rows) => {
        if (err) return console.error("DB error:", err);
        rows.forEach((conge, key) => {
            try {
                const debut = new Date(conge.date_debut_conge);
                const fin = new Date(conge.date_fin_conge);
                // Parse JSON repriseDate
                const att = JSON.parse(conge.attestation_conge);
                const repriseDate = parseRepriseDate(att.repriseDate);
                /** -------------------------------------------
                 * 1️⃣ If today is between début and fin → en congé
                --------------------------------------------*/
                if (now >= debut && now <= fin) {
                    const q = `
                    UPDATE personnel
                    SET statut_personnel = "en congé"
                    WHERE id_personnel = ${conge.id_personnel};
                    `;
                    pool.query(q);
                    const cr = `UPDATE conge SET statut_conge = "en cours" WHERE id_conge = ${conge.id_conge};`;
                    pool.query(cr)
                }
                /** -------------------------------------------
                 * 2️⃣ If today == fin de congé → terminer le congé
                --------------------------------------------*/
                const sameDay =
                    now.getDate() === fin.getDate() &&
                    now.getMonth() === fin.getMonth() &&
                    now.getFullYear() === fin.getFullYear();
                if (sameDay) {
                    const q = `
                    UPDATE conge
                    SET statut_conge = "terminé"
                    WHERE id_conge = ${conge.id_conge};
                    `;
                    pool.query(q);
                }
                /** -------------------------------------------
                 * 3️⃣ If month passed after fin → terminé
                --------------------------------------------*/
                if (
                    now.getFullYear() === fin.getFullYear() &&
                    now.getMonth() > fin.getMonth()
                ) {
                    const q = `
                    UPDATE conge
                    SET statut_conge = "terminé"
                    WHERE id_conge = ${conge.id_conge};
                    `;
                    pool.query(q);
                }
                /** -------------------------------------------
                 * 4️⃣ If today == reprise date → en poste
                --------------------------------------------*/
                const sameRepriseDay =
                    now.getDate() === repriseDate.getDate() &&
                    now.getMonth() === repriseDate.getMonth() &&
                    now.getFullYear() === repriseDate.getFullYear();
                if (sameRepriseDay) {
                    const q = `
                    UPDATE personnel
                    SET statut_personnel = "en poste"
                    WHERE id_personnel = ${conge.id_personnel};
                    `;
                    pool.query(q);
                }
                /** -------------------------------------------
                 * 5️⃣ If month passed after reprise date → en poste
                --------------------------------------------*/
                if (
                    now.getFullYear() === repriseDate.getFullYear() &&
                    now.getMonth() > repriseDate.getMonth()
                ) {
                    const q = `
                    UPDATE personnel
                    SET statut_personnel = "en poste"
                    WHERE id_personnel = ${conge.id_personnel};
                    `;
                    pool.query(q);
                }
            } catch (error) {
                console.error("Error processing congé:", error);
            }
        });
        console.log("Auto conges update completed");
    });
}

/**
 * In this following code is the main
 * code when the app is started
 */
function userLogin(event, { username, password }) {
    pool.query('SELECT * FROM utilisateur', (err, results) => {
        if (err) throw err;
        event.sender.send('login-success', results);
    });
}

/**
 * run functions
 */
app.whenReady().then(() => {
    // run cron on start and every day
    autoUpdateCongeBackend();
    setInterval(() => {
        autoUpdateCongeBackend();
    }, 24 * 60 * 60 * 1000);

    // ping pong test
    ipcMain.handle('ping', () => 'pongrr!');
    // personnel datas get
    ipcMain.on('requete-sql', (event, arg) => {
        pool.query('SELECT * FROM personnel', (err, results) => {
            if (err) throw err;
            event.sender.send('resultat-sql', results);
        });
    });
    ipcMain.on('add-personnel', addPersonnel);
    ipcMain.on('add-personnel-dette', addPersonnelDette);
    ipcMain.on('get-personnel', getPersonnel);
    ipcMain.on('get-specific-personnel', getSpecificPersonnel);
    ipcMain.on('update-personnel', updatePersonnel);
    // decision
    ipcMain.on('get-decision', getDecision);
    ipcMain.on('add-decision', addDecision);
    ipcMain.on('update-decision', updateDecision);
    ipcMain.on('delete-decision', deleteDecision);
    ipcMain.on('change-decision-statut', changeStatutDecision);
    ipcMain.on('get-specific-decision', getSpecificDec);
    // conge type  
    ipcMain.on('get-conge-type', getCongeType);
    ipcMain.on('add-conge-type', addCongeType);
    ipcMain.on('get-specific-conge-type', getSpecificCongeType);
    // conge
    // Handle invoked queries cleanly
    ipcMain.handle("get-stats-conge", async (event, query) => {
        return new Promise((resolve, reject) => {
            pool.query(query, (err, results) => {
                if (err) {
                    console.error("SQL error:", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    });
    ipcMain.on('get-specific-conge', getSpecificConge);
    ipcMain.on('get-specific-data', getData);
    ipcMain.on('get-conge', getConge);
    ipcMain.on('add-archive-attestation-conge', addArchiveAttestationConge)
    ipcMain.on('update-conge', updateConge);
    ipcMain.on('add-conge', addConge);
    ipcMain.on('get-attestation-conge', getAttestationConge);
    ipcMain.on('get-archive-att-conge', getArchiveAttConge);
    ipcMain.on('delete-archive-att-conge', deleteArchiveAttConge);
    // conge -> attestation reprise
    ipcMain.on('get-attestation-rep-conge', getAttestationRepConge);
    ipcMain.on('add-archive-attestation-rep-conge', addArchiveAttestationRepConge);
    ipcMain.on('get-archive-att-rep-conge', getArchiveAttRepConge);
    ipcMain.on('delete-archive-att-rep-conge', deleteArchiveAttRepConge);
    // permission  
    ipcMain.on('get-permission', getPermission);
    ipcMain.on('get-last-permission', getLastPermission);
    ipcMain.on('add-archive-attestation-permission', addArchiveAttestationPermission)
    ipcMain.on('update-permission', updatePermission);
    ipcMain.on('add-permission', addPermission);
    ipcMain.on('get-attestation-permission', getAttestationPermission);
    ipcMain.on('get-archive-att-permission', getArchiveAttPermission);
    ipcMain.on('delete-archive-att-permission', deleteArchiveAttPermission);
    // permission -> attestation reprise permission
    ipcMain.on('get-attestation-rep-permission', getAttestationRepPermission);
    ipcMain.on('add-archive-attestation-rep-permission', addArchiveAttestationRepPermission);
    // permission -> archive attestation reprise permission
    ipcMain.on('get-archive-att-rep-permission', getArchiveAttRepPermission);
    ipcMain.on('delete-archive-att-rep-permission', deleteArchiveAttRepPermission);
    // document à fournir : 
    ipcMain.on('get-document', getDocument);
    ipcMain.on('add-document', addDocument);
    // users :
    ipcMain.on('get-users', getUsers);
    ipcMain.on('add-user', addUser);
    ipcMain.on('del-user', delUser);
    ipcMain.on('update-user', updateUser);
    ipcMain.on('update-user-password', updateUserPassword);
    // structures : 
    ipcMain.on('get-structures-names', getStructuresNames);
    ipcMain.on('get-structures-name-personnel', getStructuresNamePersonnel);
    ipcMain.on('get-structures-conges', getStructuresConges);
    // provisory year management 
    ipcMain.on('get-conges-years', getCongeYears);
    // set the App title
    ipcMain.on('set-title', handleSetTitle);
    ipcMain.on('user-login', userLogin);
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
})

app.disableHardwareAcceleration();
app.on('activate', () => {
    app.commandLine.appendSwitch('disable-gpu-rasterization');
    app.commandLine.appendSwitch('disable-zero-copy');
    app.commandLine.appendSwitch('enable-low-end-device-mode');
    app.commandLine.appendSwitch('max-tiles-for-interest-area', '512');
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})