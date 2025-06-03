import { ipcMain } from 'electron'
import db from '../db'

export function setupDiseaseHandlers() {
  // Get all diseases by patient ID
  ipcMain.handle("get-diseases-by-patient", async (_, patientId) => {
    const stmt = db.prepare(`SELECT * FROM Disease WHERE patientId = ?`)
    return stmt.all(patientId)
  })

  // Create a new disease
  ipcMain.handle("add-disease", async (_, diseaseData) => {
    const {
      patientId,
      nameOfDisease,
      chiefComplaint,
      timePeriod,
      onsetOfDisease,
      symptoms,
      locationOfPain,
      severity,
      recurrenceTiming,
      aggravatingFactors,
      typeOfDisease,
      anatomicalReference,
      physiologicalReference,
      psychologicalReference,
    } = diseaseData

    const stmt = db.prepare(`
      INSERT INTO Disease (
        patientId, nameOfDisease, chiefComplaint, timePeriod, onsetOfDisease,
        symptoms, locationOfPain, severity, recurrenceTiming, aggravatingFactors,
        typeOfDisease, anatomicalReference, physiologicalReference, psychologicalReference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const info = stmt.run(
      patientId,
      nameOfDisease,
      chiefComplaint,
      timePeriod,
      onsetOfDisease,
      symptoms,
      locationOfPain,
      severity,
      recurrenceTiming,
      aggravatingFactors,
      typeOfDisease,
      anatomicalReference,
      physiologicalReference,
      psychologicalReference
    )

    return db.prepare(`SELECT * FROM Disease WHERE id = ?`).get(info.lastInsertRowid)
  })

  // Get a disease by ID with related data
  ipcMain.handle("get-disease", async (_, id) => {
    const disease = db.prepare(`SELECT * FROM Disease WHERE id = ?`).get(id)
    if (!disease) return null

    // Fetch related MedicalHistory (one-to-one)
    const medicalHistory = db.prepare(`SELECT * FROM MedicalHistory WHERE diseaseId = ?`).get(id)

    // Fetch therapies for disease (could be multiple)
    const therapies = db.prepare(`SELECT * FROM Therapy WHERE diseaseId = ?`).all(id)

    // For each therapy, fetch TherapyTools and nested Yoga, Pranayama, Mudras, BreathingExercises
    const therapiesWithTools = therapies.map((therapy) => {
      const therapyTools = db.prepare(`SELECT * FROM TherapyTools WHERE therapyId = ?`).get(therapy.id)

      if (therapyTools) {
        const yoga = db.prepare(`SELECT * FROM Yoga WHERE therapyToolsId = ?`).get(therapyTools.id)
        const pranayama = db.prepare(`SELECT * FROM Pranayama WHERE therapyToolsId = ?`).get(therapyTools.id)
        const mudras = db.prepare(`SELECT * FROM Mudras WHERE therapyToolsId = ?`).get(therapyTools.id)
        const breathingExercises = db.prepare(`SELECT * FROM BreathingExercises WHERE therapyToolsId = ?`).get(therapyTools.id)

        therapy.therapyTools = {
          ...therapyTools,
          yoga,
          pranayama,
          mudras,
          breathingExercises,
        }
      } else {
        therapy.therapyTools = null
      }

      return therapy
    })

    return {
      ...disease,
      medicalHistory,
      therapies: therapiesWithTools,
    }
  })

  // Update a disease
  ipcMain.handle("update-disease", async (_, { id, data }) => {
    // Build the SET clause dynamically based on keys of data
    const keys = Object.keys(data)
    const fields = keys.map((key) => `${key} = ?`).join(", ")
    const values = keys.map((key) => data[key])
    values.push(id)

    const stmt = db.prepare(`UPDATE Disease SET ${fields} WHERE id = ?`)
    stmt.run(...values)

    return db.prepare(`SELECT * FROM Disease WHERE id = ?`).get(id)
  })

  // Delete a disease and its related medical histories
  ipcMain.handle("delete-disease", async (_, id) => {
    db.prepare(`DELETE FROM MedicalHistory WHERE diseaseId = ?`).run(id)
    const info = db.prepare(`DELETE FROM Disease WHERE id = ?`).run(id)
    return { success: info.changes > 0 }
  })
}
