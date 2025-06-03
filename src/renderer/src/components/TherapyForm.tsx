import { useState } from "react";
import { Therapy } from "../types";
import "./Dashboard.css";

interface TherapyFormProps {
  initialValues?: Therapy | null;
  diseaseId: number;
  onSave: (therapy: Therapy) => Promise<void>;
  onCancel: () => void;
}

const TherapyForm = ({ initialValues, diseaseId, onSave, onCancel }: TherapyFormProps) => {
  const [therapy, setTherapy] = useState<Therapy>(
    initialValues || {
      diseaseId,
      name: "",
      fitnessOrTherapy: "",
      homeRemedies: "",
      dietReference: "",
      lifestyleModifications: "",
      secondaryTherapy: "",
      aggravatingPoses: "",
      relievingPoses: "",
      flexibilityLevel: "",
      nerveStiffness: "",
      muscleStiffness: "",
      avoidablePoses: "",
      therapyPoses: "",
      sideEffects: "",
      progressiveReport: ""
    }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTherapy(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      await onSave({
        ...therapy,
        id: initialValues?.id,
        diseaseId,
      });
    } catch (err: any) {
      setError(`Error saving therapy: ${err.message}`);
      console.error("Error in save:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-card">
      <div className="mb-6">
        <h2 className="section-title">
          {initialValues ? "Edit Therapy" : "Add Therapy"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Record therapy details for this disease
        </p>
      </div>

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
              <label htmlFor="name" className="form-label">
                Therapy Name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                onChange={handleChange}
                value={therapy.name}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="fitnessOrTherapy" className="form-label">
                Fitness or Therapy Type*
              </label>
              <input
                id="fitnessOrTherapy"
                name="fitnessOrTherapy"
                type="text"
                className="form-input"
                onChange={handleChange}
                value={therapy.fitnessOrTherapy}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="homeRemedies" className="form-label">
                Home Remedies
              </label>
              <textarea
                id="homeRemedies"
                name="homeRemedies"
                rows={3}
                className="form-textarea"
                onChange={handleChange}
                value={therapy.homeRemedies || ""}
              />
            </div>

            <div className="form-field">
              <label htmlFor="dietReference" className="form-label">
                Diet Reference
              </label>
              <textarea
                id="dietReference"
                name="dietReference"
                rows={3}
                className="form-textarea"
                onChange={handleChange}
                value={therapy.dietReference || ""}
              />
            </div>

            <div className="form-field">
              <label htmlFor="lifestyleModifications" className="form-label">
                Lifestyle Modifications
              </label>
              <textarea
                id="lifestyleModifications"
                name="lifestyleModifications"
                rows={3}
                className="form-textarea"
                onChange={handleChange}
                value={therapy.lifestyleModifications || ""}
              />
            </div>

            <div className="form-field">
              <label htmlFor="secondaryTherapy" className="form-label">
                Secondary Therapy
              </label>
              <textarea
                id="secondaryTherapy"
                name="secondaryTherapy"
                rows={3}
                className="form-textarea"
                onChange={handleChange}
                value={therapy.secondaryTherapy || ""}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Poses Information</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="aggravatingPoses" className="form-label">
                Aggravating Poses
              </label>
              <textarea
                id="aggravatingPoses"
                name="aggravatingPoses"
                rows={3}
                className="form-textarea"
                onChange={handleChange}
                value={therapy.aggravatingPoses || ""}
              />
            </div>

            <div className="form-field">
              <label htmlFor="relievingPoses" className="form-label">
                Relieving Poses
              </label>
              <textarea
                id="relievingPoses"
                name="relievingPoses"
                rows={3}
                className="form-textarea"
                onChange={handleChange}
                value={therapy.relievingPoses || ""}
              />
            </div>

            <div className="form-field">
              <label htmlFor="avoidablePoses" className="form-label">
                Avoidable Poses
              </label>
              <textarea
                id="avoidablePoses"
                name="avoidablePoses"
                rows={3}
                className="form-textarea"
                onChange={handleChange}
                value={therapy.avoidablePoses || ""}
              />
            </div>

            <div className="form-field">
              <label htmlFor="therapyPoses" className="form-label">
                Therapy Poses
              </label>
              <textarea
                id="therapyPoses"
                name="therapyPoses"
                rows={3}
                className="form-textarea"
                onChange={handleChange}
                value={therapy.therapyPoses || ""}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Physical Assessment</h3>
          <div className="form-grid-3">
            <div className="form-field">
              <label htmlFor="flexibilityLevel" className="form-label">
                Flexibility Level
              </label>
              <input
                id="flexibilityLevel"
                name="flexibilityLevel"
                type="text"
                className="form-input"
                onChange={handleChange}
                value={therapy.flexibilityLevel || ""}
              />
            </div>

            <div className="form-field">
              <label htmlFor="nerveStiffness" className="form-label">
                Nerve Stiffness
              </label>
              <input
                id="nerveStiffness"
                name="nerveStiffness"
                type="text"
                className="form-input"
                onChange={handleChange}
                value={therapy.nerveStiffness || ""}
              />
            </div>

            <div className="form-field">
              <label htmlFor="muscleStiffness" className="form-label">
                Muscle Stiffness
              </label>
              <input
                id="muscleStiffness"
                name="muscleStiffness"
                type="text"
                className="form-input"
                onChange={handleChange}
                value={therapy.muscleStiffness || ""}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Additional Information</h3>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="sideEffects" className="form-label">
                Side Effects
              </label>
              <textarea
                id="sideEffects"
                name="sideEffects"
                rows={3}
                className="form-textarea"
                onChange={handleChange}
                value={therapy.sideEffects || ""}
              />
            </div>

            <div className="form-field">
              <label htmlFor="progressiveReport" className="form-label">
                Progressive Report
              </label>
              <textarea
                id="progressiveReport"
                name="progressiveReport"
                rows={3}
                className="form-textarea"
                onChange={handleChange}
                value={therapy.progressiveReport || ""}
              />
            </div>
          </div>
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
            {saving ? "Saving..." : "Save Therapy"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TherapyForm; 