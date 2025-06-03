import { useState, useEffect } from "react";
import { Disease, MedicalReport } from "../types";
import "./Dashboard.css";

interface DiseaseFormProps {
  initialValues?: Disease;
  patientId: number;
  onSave: (values: Disease) => Promise<void>;
  onCancel: () => void;
}

const emptyDisease: Disease = {
  patientId: 0,
  nameOfDisease: "",
  chiefComplaint: "",
  timePeriod: "",
  onsetOfDisease: "",
  symptoms: "",
  locationOfPain: "",
  severity: "",
  recurrenceTiming: "",
  aggravatingFactors: "",
  typeOfDisease: "",
  anatomicalReference: "",
  physiologicalReference: "",
  psychologicalReference: "",
};

const DiseaseForm = ({ initialValues, patientId, onSave, onCancel }: DiseaseFormProps) => {
  const [disease, setDisease] = useState<Disease>(initialValues || { ...emptyDisease, patientId });
  const [error, setError] = useState("");
  const [diseaseId, setDiseaseId] = useState<number | undefined>(initialValues?.id);
  const [uploadedReports, setUploadedReports] = useState<MedicalReport[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialValues?.id;

  useEffect(() => {
    if (initialValues?.id) {
      setDiseaseId(initialValues.id);
    }
  }, [initialValues]);

  const handleFileUploaded = (report: MedicalReport) => {
    setUploadedReports(prev => [...prev, report]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDisease(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError("");
      
      // Remove medicalReports if it exists in values to prevent database error
      const { medicalReports, ...diseaseValues } = disease;

      // Save the disease
      await onSave(diseaseValues);
    } catch (err) {
      console.error("Error saving disease:", err);
      setError("Failed to save disease information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="section-title">
        {isEditing ? "Edit Disease" : "Add New Disease"}
      </h2>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="nameOfDisease" className="form-label">
                Disease Name *
              </label>
              <input
                type="text"
                name="nameOfDisease"
                id="nameOfDisease"
                className="form-input"
                value={disease.nameOfDisease || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="typeOfDisease" className="form-label">
                Type of Disease
              </label>
              <input
                type="text"
                name="typeOfDisease"
                id="typeOfDisease"
                className="form-input"
                value={disease.typeOfDisease || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="chiefComplaint" className="form-label">
                Chief Complaint *
              </label>
              <textarea
                name="chiefComplaint"
                id="chiefComplaint"
                rows={3}
                className="form-textarea"
                value={disease.chiefComplaint || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="timePeriod" className="form-label">
                Time Period
              </label>
              <input
                type="text"
                name="timePeriod"
                id="timePeriod"
                className="form-input"
                value={disease.timePeriod || ""}
                onChange={handleChange}
                placeholder="e.g., 2 weeks, 3 months"
              />
            </div>

            <div className="form-field">
              <label htmlFor="onsetOfDisease" className="form-label">
                Onset of Disease
              </label>
              <input
                type="text"
                name="onsetOfDisease"
                id="onsetOfDisease"
                className="form-input"
                value={disease.onsetOfDisease || ""}
                onChange={handleChange}
                placeholder="e.g., Sudden, Gradual"
              />
            </div>

            <div className="form-field">
              <label htmlFor="severity" className="form-label">
                Severity
              </label>
              <select
                name="severity"
                id="severity"
                className="form-input"
                value={disease.severity || ""}
                onChange={handleChange}
              >
                <option value="">Select Severity</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Very Severe">Very Severe</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Symptoms and Effects</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="symptoms" className="form-label">
                Symptoms
              </label>
              <textarea
                name="symptoms"
                id="symptoms"
                rows={3}
                className="form-textarea"
                value={disease.symptoms || ""}
                onChange={handleChange}
                placeholder="Separate multiple symptoms with commas"
              />
            </div>

            <div className="form-field">
              <label htmlFor="locationOfPain" className="form-label">
                Location of Pain
              </label>
              <input
                type="text"
                name="locationOfPain"
                id="locationOfPain"
                className="form-input"
                value={disease.locationOfPain || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="recurrenceTiming" className="form-label">
                Recurrence Timing
              </label>
              <input
                type="text"
                name="recurrenceTiming"
                id="recurrenceTiming"
                className="form-input"
                value={disease.recurrenceTiming || ""}
                onChange={handleChange}
                placeholder="e.g., Daily, Weekly, Monthly"
              />
            </div>

            <div className="form-field">
              <label htmlFor="aggravatingFactors" className="form-label">
                Aggravating Factors
              </label>
              <textarea
                name="aggravatingFactors"
                id="aggravatingFactors"
                rows={3}
                className="form-textarea"
                value={disease.aggravatingFactors || ""}
                onChange={handleChange}
                placeholder="Separate multiple factors with commas"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">References</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="anatomicalReference" className="form-label">
                Anatomical Reference
              </label>
              <input
                type="text"
                name="anatomicalReference"
                id="anatomicalReference"
                className="form-input"
                value={disease.anatomicalReference || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="physiologicalReference" className="form-label">
                Physiological Reference
              </label>
              <input
                type="text"
                name="physiologicalReference"
                id="physiologicalReference"
                className="form-input"
                value={disease.physiologicalReference || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="psychologicalReference" className="form-label">
                Psychological Reference
              </label>
              <input
                type="text"
                name="psychologicalReference"
                id="psychologicalReference"
                className="form-input"
                value={disease.psychologicalReference || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Medical Reports</h3>
          {diseaseId ? (
            <div className="space-y-4">
              <div className="no-data-card">
                <p className="no-data-text">
                  Medical report uploader component will be implemented separately.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Save this form first to enable medical report uploads.
            </p>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Disease" : "Add Disease"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiseaseForm; 