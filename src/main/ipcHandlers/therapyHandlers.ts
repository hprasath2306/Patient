import { ipcMain } from "electron";
import db from "../db"; // adjust the path as needed

export function setupTherapyHandlers() {
  // Get all therapies by disease ID
  ipcMain.handle("get-therapies-by-disease", async (_, diseaseId) => {
    const stmt = db.prepare(`SELECT * FROM Therapy WHERE diseaseId = ?`);
    return stmt.all(parseInt(diseaseId));
  });

  // Create a new therapy
  ipcMain.handle("create-therapy", async (_, therapyData) => {
    const {
      diseaseId,
      name,
      fitnessOrTherapy,
      homeRemedies,
      dietReference,
      lifestyleModifications,
      secondaryTherapy,
      aggravatingPoses,
      relievingPoses,
      flexibilityLevel,
      nerveStiffness,
      muscleStiffness,
      avoidablePoses,
      therapyPoses,
      sideEffects,
      progressiveReport,
      createdAt = new Date().toISOString(),
      updatedAt = new Date().toISOString(),
    } = therapyData;

    const stmt = db.prepare(`
      INSERT INTO Therapy (
        diseaseId,
        name,
        fitnessOrTherapy,
        homeRemedies,
        dietReference,
        lifestyleModifications,
        secondaryTherapy,
        aggravatingPoses,
        relievingPoses,
        flexibilityLevel,
        nerveStiffness,
        muscleStiffness,
        avoidablePoses,
        therapyPoses,
        sideEffects,
        progressiveReport,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      diseaseId,
      name,
      fitnessOrTherapy,
      homeRemedies,
      dietReference,
      lifestyleModifications,
      secondaryTherapy,
      aggravatingPoses,
      relievingPoses,
      flexibilityLevel,
      nerveStiffness,
      muscleStiffness,
      avoidablePoses,
      therapyPoses,
      sideEffects,
      progressiveReport,
      createdAt,
      updatedAt
    );

    return db.prepare(`SELECT * FROM Therapy WHERE id = ?`).get(info.lastInsertRowid);
  });

  // Get a therapy by ID (including related therapyTools and their nested relations)
  ipcMain.handle("get-therapy", async (_, id) => {
    const therapy = db.prepare(`SELECT * FROM Therapy WHERE id = ?`).get(parseInt(id));
    if (!therapy) return null;

    // Fetch therapyTools
    const therapyTools = db.prepare(`SELECT * FROM TherapyTools WHERE therapyId = ?`).get(therapy.id);

    if (therapyTools) {
      // Fetch Yoga, Pranayama, Mudras, BreathingExercises for therapyTools
      const yoga = db.prepare(`SELECT * FROM Yoga WHERE therapyToolsId = ?`).all(therapyTools.id);
      const pranayama = db.prepare(`SELECT * FROM Pranayama WHERE therapyToolsId = ?`).all(therapyTools.id);
      const mudras = db.prepare(`SELECT * FROM Mudras WHERE therapyToolsId = ?`).all(therapyTools.id);
      const breathingExercises = db.prepare(`SELECT * FROM BreathingExercises WHERE therapyToolsId = ?`).all(therapyTools.id);

      therapy.therapyTools = {
        ...therapyTools,
        yoga,
        pranayama,
        mudras,
        breathingExercises,
      };
    } else {
      therapy.therapyTools = null;
    }

    return therapy;
  });

  // Update a therapy
  ipcMain.handle("update-therapy", async (_, { id, data }) => {
    // Remove fields that should not be updated directly
    const {
      id: therapyId,
      therapyTools,
      createdAt,
      updatedAt,
      ...updateData
    } = data;

    const keys = Object.keys(updateData);
    const fields = keys.map(key => `${key} = ?`).join(", ");
    const values = keys.map(key => updateData[key]);
    values.push(parseInt(id));

    const stmt = db.prepare(`UPDATE Therapy SET ${fields} WHERE id = ?`);
    stmt.run(...values);

    return db.prepare(`SELECT * FROM Therapy WHERE id = ?`).get(parseInt(id));
  });

  // Delete a therapy
  ipcMain.handle("delete-therapy", async (_, id) => {
    const stmt = db.prepare(`DELETE FROM Therapy WHERE id = ?`);
    const info = stmt.run(parseInt(id));
    return { success: info.changes > 0 };
  });
}
