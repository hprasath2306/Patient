import { ipcMain } from "electron";
import db from "../db"; // Adjust path as needed

export function setupMedicalHistoryHandlers() {
  // Create a new medical history
  ipcMain.handle("create-medical-history", async (_, medicalHistoryData) => {
    const {
      diseaseId,
      childhoodIllness,
      psychiatricIllness,
      occupationalInfluences,
      operationsOrSurgeries,
      hereditary = 0, // SQLite uses 0/1 for boolean
    } = medicalHistoryData;

    const stmt = db.prepare(`
      INSERT INTO MedicalHistory (
        diseaseId,
        childhoodIllness,
        psychiatricIllness,
        occupationalInfluences,
        operationsOrSurgeries,
        hereditary
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      diseaseId,
      childhoodIllness,
      psychiatricIllness,
      occupationalInfluences,
      operationsOrSurgeries,
      hereditary ? 1 : 0
    );

    return db.prepare(`SELECT * FROM MedicalHistory WHERE id = ?`).get(info.lastInsertRowid);
  });

  // Get a medical history by ID
  ipcMain.handle("get-medical-history", async (_, id) => {
    const stmt = db.prepare(`SELECT * FROM MedicalHistory WHERE id = ?`);
    return stmt.get(id);
  });

  // Update a medical history
  ipcMain.handle("update-medical-history", async (_, { id, data }) => {
    // Build dynamic SET clause and values array
    const keys = Object.keys(data);
    const fields = keys.map((key) => `${key} = ?`).join(", ");
    const values = keys.map((key) => {
      // Cast hereditary to 0 or 1 if present
      if (key === "hereditary") return data[key] ? 1 : 0;
      return data[key];
    });
    values.push(id);

    const stmt = db.prepare(`UPDATE MedicalHistory SET ${fields} WHERE id = ?`);
    stmt.run(...values);

    return db.prepare(`SELECT * FROM MedicalHistory WHERE id = ?`).get(id);
  });

  // Delete a medical history
  ipcMain.handle("delete-medical-history", async (_, id) => {
    const stmt = db.prepare(`DELETE FROM MedicalHistory WHERE id = ?`);
    const info = stmt.run(id);
    return { success: info.changes > 0 };
  });
}
