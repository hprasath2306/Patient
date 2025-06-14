import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { setupPatientHandlers } from './ipcHandlers/patientHandlers'
import { setupDiseaseHandlers } from './ipcHandlers/diseaseHandlers'
import { setupMedicalHistoryHandlers } from './ipcHandlers/medicalHistoryHandlers'
import { setupTherapyHandlers } from './ipcHandlers/therapyHandlers'
import { setupTherapyToolsHandlers } from './ipcHandlers/therapyToolsHandlers'
import { setupPranayamaHandlers, setupBreathingExercisesHandlers, setupMudrasHandlers } from './ipcHandlers/pranayamaHandlers'
import { setupMedicalReportHandlers } from './ipcHandlers/reportHandlers'
import { setupYogaHandlers } from './ipcHandlers/yogaHandlers'

function createWindow(): void {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  // mainWindow.maximize();
  mainWindow.setMenu(null);
  mainWindow.setResizable(false);
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  setupPatientHandlers()
  setupDiseaseHandlers()
  setupMedicalHistoryHandlers()
  setupTherapyHandlers()
  setupTherapyToolsHandlers()
  setupPranayamaHandlers()
  setupBreathingExercisesHandlers()
  setupMudrasHandlers()
  setupMedicalReportHandlers()
  setupYogaHandlers()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
