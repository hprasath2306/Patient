import { ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import db from "../db";
import { app } from "electron";

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const medicalReportsDir = path.join(uploadsDir, 'medical-reports');
if (!fs.existsSync(medicalReportsDir)) {
    fs.mkdirSync(medicalReportsDir, { recursive: true });
}

// Open file dialog and choose a file to upload
ipcMain.handle("choose-medical-report-file", async () => {
    try {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Documents', extensions: ['pdf'] },
                { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] }
            ]
        });
        
        if (canceled || filePaths.length === 0) {
            return null;
        }
        
        return filePaths[0];
    } catch (error) {
        console.error('Error choosing file:', error);
        throw error;
    }
});

// Upload/copy file to app directory and save reference in DB
ipcMain.handle("upload-medical-report", async (_, { filePath, diseaseId, medicalHistoryId }) => {
    try {
        // Generate a unique filename
        const fileExt = path.extname(filePath);
        const fileName = `medical-report-${Date.now()}${fileExt}`;
        const destPath = path.join(medicalReportsDir, fileName);
        
        // Copy the file to our app's storage
        fs.copyFileSync(filePath, destPath);
        
        // Create record in the database
        const stmt = db.prepare(`
            INSERT INTO MedicalReport (filePath, diseaseId, medicalHistoryId, createdAt)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `);
        
        const result = stmt.run(destPath, diseaseId ? parseInt(diseaseId) : null, medicalHistoryId ? parseInt(medicalHistoryId) : null);
        
        return {
            id: result.lastInsertRowid,
            filePath: destPath,
            diseaseId: diseaseId ? parseInt(diseaseId) : null,
            medicalHistoryId: medicalHistoryId ? parseInt(medicalHistoryId) : null
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
});

// Get all medical reports for a disease
ipcMain.handle("get-medical-reports-by-disease", async (_, diseaseId) => {
    const stmt = db.prepare('SELECT * FROM MedicalReport WHERE diseaseId = ?');
    return stmt.all(parseInt(diseaseId));
});

// Get all medical reports for a medical history
ipcMain.handle("get-medical-reports-by-medical-history", async (_, medicalHistoryId) => {
    const stmt = db.prepare('SELECT * FROM MedicalReport WHERE medicalHistoryId = ?');
    return stmt.all(parseInt(medicalHistoryId));
});

// Open a medical report file
ipcMain.handle("open-medical-report", async (_, filePath) => {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }
        
        // Return file data as base64 string
        const fileData = fs.readFileSync(filePath);
        return {
            data: fileData.toString('base64'),
            fileType: path.extname(filePath).toLowerCase(),
            fileName: path.basename(filePath)
        };
    } catch (error) {
        console.error('Error opening file:', error);
        throw error;
    }
});

// Delete a medical report
ipcMain.handle("delete-medical-report", async (_, id) => {
    try {
        // Get the report first to find the file path
        const stmt = db.prepare('SELECT * FROM MedicalReport WHERE id = ?');
        const report = stmt.get(parseInt(id));
        
        if (!report) {
            throw new Error('Report not found');
        }
        
        // Delete the physical file if it exists
        if (fs.existsSync(report.filePath)) {
            fs.unlinkSync(report.filePath);
        }
        
        // Delete the database record
        const deleteStmt = db.prepare('DELETE FROM MedicalReport WHERE id = ?');
        deleteStmt.run(parseInt(id));
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting report:', error);
        throw error;
    }
});
