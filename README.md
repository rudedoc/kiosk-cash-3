# Overview
This project is an Electron application that uses Vue.js for the frontend. Webpack is used to bundle the Vue.js components and other assets. The project structure is as follows:

# Webpack

## Webpack Configuration
Webpack is configured to bundle the Vue.js components and other assets. The configuration is defined in webpack.config.js


## How Webpack Works
- Entry Point: The entry point for the application is renderer.js.
Dev Server: The devServer configuration sets up the Webpack Dev Server to serve the application during development.
Running the Webpack Dev Server
To run the Webpack Dev Server, use the following command:

This command starts the Webpack Dev Server, which serves the application at http://localhost:9000.
The server uses hot module replacement (HMR) to update the application in real-time without requiring a full page reload.

## Running the Webpack Dev Server
To run the Webpack Dev Server, use the following command:

`yarn dev`

# Electron App

## Running the Electron App
To run the Electron application, use the following command:

`yarn start`

This command starts the Electron application. The main process is defined in main.js

## How the Electron App Works
- Main Process: The main process creates a browser window and loads the application. During development,
  it loads the application from the Webpack Dev Server (http://localhost:9000). In production, it loads the bundled index.html from the dist directory.
- Preload Script: The preload.js script exposes Node.js APIs to the renderer process using contextBridge.
- Renderer Process: The renderer process is defined in renderer.js, which creates and mounts the Vue.js application.
- IPC Communication: The renderer process sends messages to the main process using ipcRenderer, and the main process listens for these messages using ipcMain.


## F53 Integration

Best current implementation is defined in basic.js which requries FujitsuDeviceCommunicator.js
- Reliably initializes the machine
- reliably deispenses bills on command

TODO:
Refactor more of the logic back to FujitsuDeviceCommunicator so that only the basic commands are contained within basic.js
- Implement state tracking with with electron-store
- Reuse this logic in the main election app
- parsing responses from the device, differentiating between successful and error response
- logging of interations between ElectronJS app and device - logrotate solution
