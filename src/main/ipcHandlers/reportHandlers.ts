import { ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import db from '../db' // your better-sqlite3 instance

export function setupMedicalReportHandlers() {
  const medicalReportsDir = path.join(__dirname, '..', 'medical_reports')

  // Ensure the directory exists
  if (!fs.existsSync(medicalReportsDir)) {
    fs.mkdirSync(medicalReportsDir, { recursive: true })
  }

  // Open file dialog and choose a file to upload
  ipcMain.handle('choose-medical-report-file', async () => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'Documents', extensions: ['pdf'] },
          { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] }
        ]
      })

      if (canceled || filePaths.length === 0) {
        return null
      }

      return filePaths[0]
    } catch (error) {
      console.error('Error choosing file:', error)
      throw error
    }
  })

  // Upload/copy file to app directory and save reference in DB
  ipcMain.handle('upload-medical-report', async (_, { filePath, diseaseId, medicalHistoryId }) => {
    try {
      const fileExt = path.extname(filePath)
      const fileName = `medical-report-${Date.now()}${fileExt}`
      const destPath = path.join(medicalReportsDir, fileName)

      // Copy file
      fs.copyFileSync(filePath, destPath)

      // Insert record in DB
      const stmt = db.prepare(`
        INSERT INTO MedicalReport (filePath, diseaseId, medicalHistoryId)
        VALUES (?, ?, ?)
      `)
      const result = stmt.run(
        destPath,
        diseaseId ? parseInt(diseaseId) : null,
        medicalHistoryId ? parseInt(medicalHistoryId) : null
      )

      // Return inserted record
      return db.prepare('SELECT * FROM MedicalReport WHERE id = ?').get(result.lastInsertRowid)
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  })

  // Get all medical reports by disease
  ipcMain.handle('get-medical-reports-by-disease', async (_, diseaseId) => {
    const stmt = db.prepare(`
    SELECT * FROM MedicalReport WHERE diseaseId = ?
  `)
    return stmt.all(parseInt(diseaseId))
  })

  // Get all medical reports by medical history
  ipcMain.handle('get-medical-reports-by-medical-history', async (_, medicalHistoryId) => {
    const stmt = db.prepare(`
    SELECT * FROM MedicalReport WHERE medicalHistoryId = ?
  `)
    return stmt.all(parseInt(medicalHistoryId))
  })

  // Open a medical report file
  ipcMain.handle('open-medical-report', async (_, filePath) => {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found')
      }
      const fileData = fs.readFileSync(filePath)
      return {
        data: fileData.toString('base64'),
        fileType: path.extname(filePath).toLowerCase(),
        fileName: path.basename(filePath)
      }
    } catch (error) {
      console.error('Error opening file:', error)
      throw error
    }
  })

  // Delete a medical report
  ipcMain.handle('delete-medical-report', async (_, id) => {
    try {
      const selectStmt = db.prepare(`SELECT * FROM MedicalReport WHERE id = ?`)
      const report = selectStmt.get(parseInt(id))

      if (!report) {
        throw new Error('Report not found')
      }

      if (fs.existsSync(report.filePath)) {
        fs.unlinkSync(report.filePath)
      }

      const deleteStmt = db.prepare(`DELETE FROM MedicalReport WHERE id = ?`)
      deleteStmt.run(parseInt(id))

      return { success: true }
    } catch (error) {
      console.error('Error deleting report:', error)
      throw error
    }
  })
}
