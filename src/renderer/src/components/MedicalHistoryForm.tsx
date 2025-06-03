import { useState, useEffect } from "react";
import { MedicalHistory, MedicalReport } from "../types";
import "./Dashboard.css";

interface MedicalHistoryFormProps {
  initialValues?: MedicalHistory | null;
  diseaseId: number;
  onSave: (medicalHistory: MedicalHistory) => Promise<void>;
  onCancel: () => void;
}

const MedicalHistoryForm = ({ initialValues, diseaseId, onSave, onCancel }: MedicalHistoryFormProps) => {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>(
    initialValues || {
      childhoodIllness: "",
      psychiatricIllness: "",
      occupationalInfluences: "",
      operationsOrSurgeries: "",
      hereditary: false,
      medicalReports: "",
      diseaseId,
    }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadedReports, setUploadedReports] = useState<MedicalReport[]>([]);
  const [historyId, setHistoryId] = useState<number | undefined>(initialValues?.id);

  useEffect(() => {
    // Fetch the uploaded reports if we have a history ID
    if (initialValues?.id) {
      setHistoryId(initialValues.id);
    }
  }, [initialValues]);

  const handleFileUploaded = (report: MedicalReport) => {
    setUploadedReports(prev => [...prev, report]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    setMedicalHistory(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      // Remove medicalReports if it exists in values to prevent database error
      const { medicalReports, ...medicalHistoryValues } = medicalHistory;

      await onSave({
        ...medicalHistoryValues,
        id: initialValues?.id,
        diseaseId,
      });
    } catch (err: any) {
      setError(`Error saving medical history: ${err.message}`);
      console.error("Error in save:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="section-title">
        {initialValues?.id ? "Edit Medical History" : "Add Medical History"}
      </h2>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="childhoodIllness" className="form-label">
              Childhood Illness
            </label>
            <textarea
              id="childhoodIllness"
              name="childhoodIllness"
              rows={3}
              className="form-textarea"
              onChange={handleChange}
              value={medicalHistory.childhoodIllness || ""}
            />
          </div>

          <div className="form-field">
            <label htmlFor="psychiatricIllness" className="form-label">
              Psychiatric Illness
            </label>
            <textarea
              id="psychiatricIllness"
              name="psychiatricIllness"
              rows={3}
              className="form-textarea"
              onChange={handleChange}
              value={medicalHistory.psychiatricIllness || ""}
            />
          </div>

          <div className="form-field">
            <label htmlFor="occupationalInfluences" className="form-label">
              Occupational Influences
            </label>
            <textarea
              id="occupationalInfluences"
              name="occupationalInfluences"
              rows={3}
              className="form-textarea"
              onChange={handleChange}
              value={medicalHistory.occupationalInfluences || ""}
            />
          </div>

          <div className="form-field">
            <label htmlFor="operationsOrSurgeries" className="form-label">
              Operations or Surgeries
            </label>
            <textarea
              id="operationsOrSurgeries"
              name="operationsOrSurgeries"
              rows={3}
              className="form-textarea"
              onChange={handleChange}
              value={medicalHistory.operationsOrSurgeries || ""}
            />
          </div>

          <div className="form-field">
            <div className="flex items-center">
              <input
                id="hereditary"
                name="hereditary"
                type="checkbox"
                className="form-checkbox"
                onChange={handleChange}
                checked={medicalHistory.hereditary}
              />
              <label htmlFor="hereditary" className="ml-2 form-label">
                Hereditary
              </label>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="medicalReports" className="form-label">
              Medical Reports Notes
            </label>
            <textarea
              id="medicalReports"
              name="medicalReports"
              rows={3}
              className="form-textarea"
              onChange={handleChange}
              value={medicalHistory.medicalReports || ""}
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Medical Report Files</h3>
          {historyId ? (
            <div className="no-data-card">
              <p className="no-data-text">
                Medical report file viewer component will be implemented separately.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-3">
              Save this form to enable file uploads
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
            disabled={saving}
            className="btn-primary"
          >
            {saving ? "Saving..." : initialValues?.id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalHistoryForm; 