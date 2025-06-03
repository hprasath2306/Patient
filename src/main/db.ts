import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

// Store DB in user's data path
const dbPath = path.join(app.getPath('userData'), 'app.db');
const db: any = new Database(dbPath);

// Run full schema
db.exec(`
CREATE TABLE IF NOT EXISTS "Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "placeOfResidence" TEXT,
    "referencePerson" TEXT,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "natureOfWork" TEXT,
    "height" REAL,
    "weight" REAL,
    "bmi" REAL,
    "sleepPatterns" TEXT,
    "diet" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "Disease" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "nameOfDisease" TEXT,
    "chiefComplaint" TEXT,
    "timePeriod" TEXT,
    "onsetOfDisease" TEXT,
    "symptoms" TEXT,
    "locationOfPain" TEXT,
    "severity" TEXT,
    "recurrenceTiming" TEXT,
    "aggravatingFactors" TEXT,
    "typeOfDisease" TEXT,
    "anatomicalReference" TEXT,
    "physiologicalReference" TEXT,
    "psychologicalReference" TEXT,
    FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "MedicalHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diseaseId" INTEGER NOT NULL UNIQUE,
    "childhoodIllness" TEXT,
    "psychiatricIllness" TEXT,
    "occupationalInfluences" TEXT,
    "operationsOrSurgeries" TEXT,
    "hereditary" BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY ("diseaseId") REFERENCES "Disease" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "MedicalReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filePath" TEXT NOT NULL,
    "diseaseId" INTEGER,
    "medicalHistoryId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("diseaseId") REFERENCES "Disease" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("medicalHistoryId") REFERENCES "MedicalHistory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Therapy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "diseaseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fitnessOrTherapy" TEXT NOT NULL,
    "homeRemedies" TEXT,
    "dietReference" TEXT,
    "lifestyleModifications" TEXT,
    "secondaryTherapy" TEXT,
    "aggravatingPoses" TEXT,
    "relievingPoses" TEXT,
    "flexibilityLevel" TEXT,
    "nerveStiffness" TEXT,
    "muscleStiffness" TEXT,
    "avoidablePoses" TEXT,
    "therapyPoses" TEXT,
    "sideEffects" TEXT,
    "progressiveReport" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("diseaseId") REFERENCES "Disease" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "TherapyTools" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "therapyId" INTEGER NOT NULL UNIQUE,
    "mantras" TEXT,
    "meditationTypes" TEXT,
    "bandhas" TEXT,
    FOREIGN KEY ("therapyId") REFERENCES "Therapy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Yoga" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "therapyToolsId" INTEGER NOT NULL UNIQUE,
    "poses" TEXT,
    "repeatingTimingsPerDay" INTEGER,
    FOREIGN KEY ("therapyToolsId") REFERENCES "TherapyTools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Pranayama" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "therapyToolsId" INTEGER NOT NULL UNIQUE,
    "techniques" TEXT,
    "repeatingTimingsPerDay" INTEGER,
    FOREIGN KEY ("therapyToolsId") REFERENCES "TherapyTools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Mudras" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "therapyToolsId" INTEGER NOT NULL UNIQUE,
    "mudraNames" TEXT,
    "repeatingTimingsPerDay" INTEGER,
    FOREIGN KEY ("therapyToolsId") REFERENCES "TherapyTools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "BreathingExercises" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "therapyToolsId" INTEGER NOT NULL UNIQUE,
    "exercises" TEXT,
    "repeatingTimingsPerDay" INTEGER,
    FOREIGN KEY ("therapyToolsId") REFERENCES "TherapyTools" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
`);

export default db;
