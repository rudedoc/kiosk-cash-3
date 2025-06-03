const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hardwareAPI', {
  checkTicket: (eanCode) => ipcRenderer.invoke('ticket:checkValue', eanCode)
});