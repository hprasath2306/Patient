import { ipcMain } from "electron";
import db from "../db"; // your better-sqlite3 DB instance

export function setupTherapyToolsHandlers() {
  // Create therapy tools and nested related records
  ipcMain.handle("create-therapy-tools", async (_, data) => {
    const { yoga, pranayama, mudras, breathingExercises, ...therapyToolsData } = data;

    const insertTherapyTools = db.prepare(`
      INSERT INTO TherapyTools (therapyId, mantras, meditationTypes, bandhas)
      VALUES (?, ?, ?, ?)
    `);
    const result = insertTherapyTools.run(
      parseInt(therapyToolsData.therapyId),
      therapyToolsData.mantras,
      therapyToolsData.meditationTypes,
      therapyToolsData.bandhas
    );

    const therapyToolsId = result.lastInsertRowid;

    const created = { id: therapyToolsId, ...therapyToolsData };

    // Helper to insert nested records
    function createNested(table: string, data: any, fields: string[], parentId: number) {
      const keys = fields.join(", ");
      const placeholders = fields.map(() => "?").join(", ");
      const stmt = db.prepare(`INSERT INTO ${table} (${keys}, therapyToolsId) VALUES (${placeholders}, ?)`);
      const values = fields.map(f => data[f]);
      const info = stmt.run(...values, parentId);
      return { id: info.lastInsertRowid, ...data };
    }

    let createdYoga = null;
    if (yoga && (yoga.poses || yoga.repeatingTimingsPerDay)) {
      createdYoga = createNested(
        "Yoga",
        {
          poses: yoga.poses || "",
          repeatingTimingsPerDay: yoga.repeatingTimingsPerDay ? parseInt(yoga.repeatingTimingsPerDay) : null,
        },
        ["poses", "repeatingTimingsPerDay"],
        therapyToolsId
      );
    }

    let createdPranayama = null;
    if (pranayama && (pranayama.techniques || pranayama.repeatingTimingsPerDay)) {
      createdPranayama = createNested(
        "Pranayama",
        {
          techniques: pranayama.techniques || "",
          repeatingTimingsPerDay: pranayama.repeatingTimingsPerDay ? parseInt(pranayama.repeatingTimingsPerDay) : null,
        },
        ["techniques", "repeatingTimingsPerDay"],
        therapyToolsId
      );
    }

    let createdMudras = null;
    if (mudras && (mudras.mudraNames || mudras.repeatingTimingsPerDay)) {
      createdMudras = createNested(
        "Mudras",
        {
          mudraNames: mudras.mudraNames || "",
          repeatingTimingsPerDay: mudras.repeatingTimingsPerDay ? parseInt(mudras.repeatingTimingsPerDay) : null,
        },
        ["mudraNames", "repeatingTimingsPerDay"],
        therapyToolsId
      );
    }

    let createdBreathingExercises = null;
    if (breathingExercises && (breathingExercises.exercises || breathingExercises.repeatingTimingsPerDay)) {
      createdBreathingExercises = createNested(
        "BreathingExercises",
        {
          exercises: breathingExercises.exercises || "",
          repeatingTimingsPerDay: breathingExercises.repeatingTimingsPerDay ? parseInt(breathingExercises.repeatingTimingsPerDay) : null,
        },
        ["exercises", "repeatingTimingsPerDay"],
        therapyToolsId
      );
    }

    return {
      ...created,
      yoga: createdYoga,
      pranayama: createdPranayama,
      mudras: createdMudras,
      breathingExercises: createdBreathingExercises,
    };
  });

  // Get therapy tools by ID (including nested)
  ipcMain.handle("get-therapy-tools", async (_, id) => {
    const therapyTools = db.prepare(`SELECT * FROM TherapyTools WHERE id = ?`).get(parseInt(id));
    if (!therapyTools) return null;

    therapyTools.yoga = db.prepare(`SELECT * FROM Yoga WHERE therapyToolsId = ?`).get(therapyTools.id);
    therapyTools.pranayama = db.prepare(`SELECT * FROM Pranayama WHERE therapyToolsId = ?`).get(therapyTools.id);
    therapyTools.mudras = db.prepare(`SELECT * FROM Mudras WHERE therapyToolsId = ?`).get(therapyTools.id);
    therapyTools.breathingExercises = db.prepare(`SELECT * FROM BreathingExercises WHERE therapyToolsId = ?`).get(therapyTools.id);

    return therapyTools;
  });

  // Get therapy tools by therapy ID (including nested)
  ipcMain.handle("get-therapy-tools-by-therapy", async (_, therapyId) => {
    const therapyTools = db.prepare(`SELECT * FROM TherapyTools WHERE therapyId = ?`).get(parseInt(therapyId));
    if (!therapyTools) return null;

    therapyTools.yoga = db.prepare(`SELECT * FROM Yoga WHERE therapyToolsId = ?`).get(therapyTools.id);
    therapyTools.pranayama = db.prepare(`SELECT * FROM Pranayama WHERE therapyToolsId = ?`).get(therapyTools.id);
    therapyTools.mudras = db.prepare(`SELECT * FROM Mudras WHERE therapyToolsId = ?`).get(therapyTools.id);
    therapyTools.breathingExercises = db.prepare(`SELECT * FROM BreathingExercises WHERE therapyToolsId = ?`).get(therapyTools.id);

    return therapyTools;
  });

  // Update therapy tools and nested related records
  ipcMain.handle("update-therapy-tools", async (_, { id, data }) => {
    const {
      id: toolId,
      yoga,
      pranayama,
      mudras,
      breathingExercises,
      therapyId,
      ...updateData
    } = data;

    // Update main therapy tools record
    const keys = Object.keys(updateData);
    const fields = keys.map(k => `${k} = ?`).join(", ");
    const values = keys.map(k => updateData[k]);
    values.push(parseInt(id));

    db.prepare(`UPDATE TherapyTools SET ${fields} WHERE id = ?`).run(...values);

    function updateOrCreateNested(table: string, nestedData: any, parentId: number) {
      if (!nestedData) return null;

      if (nestedData.id) {
        // update existing
        const nestedKeys = Object.keys(nestedData).filter(k => k !== "id");
        const nestedFields = nestedKeys.map(k => `${k} = ?`).join(", ");
        const nestedValues = nestedKeys.map(k => nestedData[k]);
        nestedValues.push(nestedData.id);
        db.prepare(`UPDATE ${table} SET ${nestedFields} WHERE id = ?`).run(...nestedValues);
        return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(nestedData.id);
      } else if (Object.values(nestedData).some(v => v !== null && v !== undefined && v !== "")) {
        // create new
        const keys = Object.keys(nestedData);
        const fields = keys.join(", ");
        const placeholders = keys.map(() => "?").join(", ");
        const stmt = db.prepare(`INSERT INTO ${table} (${fields}, therapyToolsId) VALUES (${placeholders}, ?)`);
        const values = keys.map(k => nestedData[k]);
        const info = stmt.run(...values, parentId);
        return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(info.lastInsertRowid);
      }
      return null;
    }

    const updatedYoga = updateOrCreateNested("Yoga", yoga, parseInt(id));
    const updatedPranayama = updateOrCreateNested("Pranayama", pranayama, parseInt(id));
    const updatedMudras = updateOrCreateNested("Mudras", mudras, parseInt(id));
    const updatedBreathingExercises = updateOrCreateNested("BreathingExercises", breathingExercises, parseInt(id));

    const updatedTherapyTools = db.prepare(`SELECT * FROM TherapyTools WHERE id = ?`).get(parseInt(id));

    return {
      ...updatedTherapyTools,
      yoga: updatedYoga,
      pranayama: updatedPranayama,
      mudras: updatedMudras,
      breathingExercises: updatedBreathingExercises,
    };
  });

  // Delete therapy tools and related nested records (optional, depends on foreign keys)
  ipcMain.handle("delete-therapy-tools", async (_, id) => {
    // Optionally delete nested records first if FK constraints don't cascade
    db.prepare(`DELETE FROM Yoga WHERE therapyToolsId = ?`).run(parseInt(id));
    db.prepare(`DELETE FROM Pranayama WHERE therapyToolsId = ?`).run(parseInt(id));
    db.prepare(`DELETE FROM Mudras WHERE therapyToolsId = ?`).run(parseInt(id));
    db.prepare(`DELETE FROM BreathingExercises WHERE therapyToolsId = ?`).run(parseInt(id));

    const result = db.prepare(`DELETE FROM TherapyTools WHERE id = ?`).run(parseInt(id));
    return { success: result.changes > 0 };
  });
}
