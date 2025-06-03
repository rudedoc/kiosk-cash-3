const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const axios = require('axios');
// Function to dynamically import electron-is-dev

async function main() {
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
        preload: path.join(__dirname, 'preload.js'), // Optional: for a preload script
      },
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

  ipcMain.handle('ticket:checkValue', async (event, barcode) => {
    console.log(`MAIN: Received request to validate ticket with barcode: ${barcode} using Axios.`);
    if (!barcode) {
      return { success: false, error: 'Barcode cannot be empty.' };
    }
    const TICKET_API_URL = 'https://doveshield.com/tickets';
    const requestUrl = `${TICKET_API_URL}/${encodeURIComponent(barcode)}.json`;

    console.log(`MAIN: Axios requesting URL: ${requestUrl}`);

    try {
      const response = await axios.get(requestUrl, { timeout: 5000 });

      console.log(`MAIN: Ticket API Response Status (Axios): ${response.status}`);
      const apiResponse = response.data;
      console.log('MAIN: Ticket API Response Data (Axios):', apiResponse);

      return {
        data: {
          ean_code: apiResponse.ean_code,
          amount: parseFloat(apiResponse.amount),
          state: apiResponse.state,
        },
      };
    } catch (error) {
      console.error('MAIN: Axios Ticket API request error:', error.message);
      if (error.response) {
        console.error('MAIN: Axios Error Response Data:', error.response.data);
        console.error('MAIN: Axios Error Response Status:', error.response.status);
        console.error('MAIN: Axios Error Response Headers:', error.response.headers);
        return {
          success: false,
          error: `API request failed with status ${error.response.status}. ${
            error.response.data?.message || ''
          }`.trim(),
          details: error.response.data,
        };
      } else if (error.request) {
        console.error('MAIN: Axios Error Request (no response):', error.request);
        return {
          success: false,
          error: 'No response received from API server.',
          details: error.message,
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('MAIN: Axios Error (request setup):', error.message);
        return { success: false, error: 'Error setting up API request.', details: error.message };
      }
    }
  });
}

main().catch(err => {
  console.error('Error starting Electron app:', err);
  app.quit();
});
