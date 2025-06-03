import { ipcMain } from 'electron'
import db from '../db' // your better-sqlite3 instance

export function setupYogaHandlers() {
  // Create yoga
  ipcMain.handle('create-yoga', async (_, data) => {
    const stmt = db.prepare(`
    INSERT INTO Yoga (therapyToolsId, poses, repeatingTimingsPerDay)
    VALUES (?, ?, ?)
  `)

    const result = stmt.run(
      parseInt(data.therapyToolsId),
      data.poses,
      data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null
    )

    return db.prepare(`SELECT * FROM Yoga WHERE id = ?`).get(result.lastInsertRowid)
  })

  // Update yoga
  ipcMain.handle('update-yoga', async (_, { id, data }) => {
    const stmt = db.prepare(`
    UPDATE Yoga
    SET poses = ?, repeatingTimingsPerDay = ?
    WHERE id = ?
  `)

    stmt.run(
      data.poses,
      data.repeatingTimingsPerDay ? parseInt(data.repeatingTimingsPerDay) : null,
      parseInt(id)
    )

    return db.prepare(`SELECT * FROM Yoga WHERE id = ?`).get(parseInt(id))
  })
}
