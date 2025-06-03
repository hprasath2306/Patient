import { ipcMain } from 'electron'
import db from '../db'

export function setupPatientHandlers() {
  ipcMain.handle('get-patients', async () => {
    const stmt = db.prepare(`SELECT * FROM Patient`)
    return stmt.all()
  })

  ipcMain.handle('create-patient', async (_, patientData) => {
    const {
      name,
      date = new Date().toISOString(),
      placeOfResidence,
      referencePerson,
      age,
      gender,
      natureOfWork,
      height,
      weight,
      bmi,
      sleepPatterns,
      diet
    } = patientData

    const stmt = db.prepare(`
      INSERT INTO Patient (
        name, date, placeOfResidence, referencePerson, age, gender,
        natureOfWork, height, weight, bmi, sleepPatterns, diet,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)

    const info = stmt.run(
      name,
      date,
      placeOfResidence,
      referencePerson,
      age,
      gender.toUpperCase(),
      natureOfWork,
      height,
      weight,
      bmi,
      sleepPatterns,
      diet
    )

    return db.prepare('SELECT * FROM Patient WHERE id = ?').get(info.lastInsertRowid)
  })

  ipcMain.handle('get-patient', async (_, id) => {
    const patient = db.prepare(`SELECT * FROM Patient WHERE id = ?`).get(id)
    if (!patient) return null
    const diseases = db.prepare(`SELECT * FROM Disease WHERE patientId = ?`).all(id)
    return { ...patient, diseases }
  })

  ipcMain.handle('update-patient', async (_, { id, data }) => {
    const fields: string[] = []
    const values: any[] = []

    for (const key in data) {
      fields.push(`${key} = ?`)
      values.push(data[key])
    }

    fields.push(`updatedAt = CURRENT_TIMESTAMP`)

    const stmt = db.prepare(`UPDATE Patient SET ${fields.join(', ')} WHERE id = ?`)
    values.push(id)

    stmt.run(...values)
    return db.prepare(`SELECT * FROM Patient WHERE id = ?`).get(id)
  })

  ipcMain.handle('delete-patient', async (_, id) => {
    db.prepare(`DELETE FROM Disease WHERE patientId = ?`).run(id)
    const info = db.prepare(`DELETE FROM Patient WHERE id = ?`).run(id)
    return { success: info.changes > 0 }
  })
}
