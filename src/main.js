const { app, BrowserWindow } = require('electron');
const path = require('node:path');

// Function to dynamically import electron-is-dev
async function getIsDev() {
  // ES Modules need to be imported dynamically in CommonJS
  const { default: isDev } = await import('electron-is-dev');
  return isDev;
}

async function createWindow() {
  const isDev = await getIsDev(); // Await the dynamic import

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // Optional: for a preload script
    }
  });

  if (isDev) {
    // In development, load from webpack-dev-server
    // Ensure the port matches your webpack-dev-server config
    win.loadURL('http://localhost:9000'); // Default webpack-dev-server port
    // Open DevTools automatically in development
    win.webContents.openDevTools();
  } else {
    // In production, load the index.html file
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await createWindow(); // Call the async createWindow

  app.on('activate', async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});