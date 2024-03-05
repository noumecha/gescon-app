const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
//const isDev = import('electron-is-dev');

// initialize main window var
let mainWindow;

// function to create the main window
const createWindow = () => {
    // configure the main window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: true,
            contextIsolation: true,
            autoHideMenuBar: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    
    // hide the menu bar
    mainWindow.setMenuBarVisibility(false);

    // load the appropriate URL based on the env
    console.log(__dirname);
    mainWindow.loadURL(
        `http://localhost:3000`
        //`file://${path.join(__dirname, '/../build/index.html')}`
        //isDev ? `http://localhost:3000` : `file://${path.join(__dirname, '/../build/index.html')}`
    );

    // opent dev tools in dev mode
    /*if(isDev) {
        mainWindow.webContents.openDevTools({mode: 'detached'});
    }*/
};

// create the main window when the app is ready
app.whenReady().then(() => {
    createWindow();
});

// add user to the db 
/*app.on('ready', () => {
    createWindow();
} )*/

// quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    app.quit();
})

ipcMain.on('user-data', (event, args) => {
    console.log(args);
})

// create a new window when the app is activated (macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})