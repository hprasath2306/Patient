import { ipcMain } from 'electron'
import db from '../db' // your better-sqlite3 instance

// --- Pranayama ---
export function setupPranayamaHandlers() {
  ipcMain.handle('create-pranayama', async (_, data) => {
    const stmt = db.prepare(`
    INSERT INTO Pranayama (therapyToolsId, techniques, repeatingTimingsPerDay)
    VALUES (?, ?, ?)
  `)
    const result = stmt.run(
      parseInt(data.therapyToolsId),
      data.techniques,
      data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
    )
    return db.prepare(`SELECT * FROM Pranayama WHERE id = ?`).get(result.lastInsertRowid)
  })

  ipcMain.handle('update-pranayama', async (_, { id, data }) => {
    const stmt = db.prepare(`
    UPDATE Pranayama
    SET techniques = ?, repeatingTimingsPerDay = ?
    WHERE id = ?
  `)
    stmt.run(
      data.techniques,
      data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null,
      parseInt(id)
    )
    return db.prepare(`SELECT * FROM Pranayama WHERE id = ?`).get(parseInt(id))
  })
}

// --- Mudras ---
export function setupMudrasHandlers() {
  ipcMain.handle('create-mudras', async (_, data) => {
    const stmt = db.prepare(`
    INSERT INTO Mudras (therapyToolsId, mudraNames, repeatingTimingsPerDay)
    VALUES (?, ?, ?)
  `)
    const result = stmt.run(
      parseInt(data.therapyToolsId),
      data.mudraNames,
      data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
    )
    return db.prepare(`SELECT * FROM Mudras WHERE id = ?`).get(result.lastInsertRowid)
  })

  ipcMain.handle('update-mudras', async (_, { id, data }) => {
    const stmt = db.prepare(`
    UPDATE Mudras
    SET mudraNames = ?, repeatingTimingsPerDay = ?
    WHERE id = ?
  `)
    stmt.run(
      data.mudraNames,
      data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null,
      parseInt(id)
    )
    return db.prepare(`SELECT * FROM Mudras WHERE id = ?`).get(parseInt(id))
  })
}

// --- Breathing Exercises ---
export function setupBreathingExercisesHandlers() {
  ipcMain.handle('create-breathing-exercises', async (_, data) => {
    const stmt = db.prepare(`
    INSERT INTO BreathingExercises (therapyToolsId, exercises, repeatingTimingsPerDay)
    VALUES (?, ?, ?)
  `)
    const result = stmt.run(
      parseInt(data.therapyToolsId),
      data.exercises,
      data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
    )
    return db.prepare(`SELECT * FROM BreathingExercises WHERE id = ?`).get(result.lastInsertRowid)
  })

  ipcMain.handle('update-breathing-exercises', async (_, { id, data }) => {
    const stmt = db.prepare(`
    UPDATE BreathingExercises
    SET exercises = ?, repeatingTimingsPerDay = ?
    WHERE id = ?
  `)
    stmt.run(
      data.exercises,
      data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null,
      parseInt(id)
    )
    return db.prepare(`SELECT * FROM BreathingExercises WHERE id = ?`).get(parseInt(id))
  })
}
