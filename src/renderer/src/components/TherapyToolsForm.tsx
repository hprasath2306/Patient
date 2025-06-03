import { useState } from "react";
import { TherapyTools, Yoga, Pranayama, Mudras, BreathingExercises } from "../types";
import "./Dashboard.css";

interface TherapyToolsFormProps {
  initialValues?: TherapyTools | null;
  therapyId: number;
  onSave: (therapyTools: TherapyTools) => Promise<void>;
  onCancel: () => void;
}

const TherapyToolsForm = ({ initialValues, therapyId, onSave, onCancel }: TherapyToolsFormProps) => {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "yoga" | "pranayama" | "mudras" | "breathing">("general");

  const emptyYoga: Yoga = {
    therapyToolsId: 0,
    poses: "",
    repeatingTimingsPerDay: 0
  };

  const emptyPranayama: Pranayama = {
    therapyToolsId: 0,
    techniques: "",
    repeatingTimingsPerDay: 0
  };

  const emptyMudras: Mudras = {
    therapyToolsId: 0,
    mudraNames: "",
    repeatingTimingsPerDay: 0
  };

  const emptyBreathingExercises: BreathingExercises = {
    therapyToolsId: 0,
    exercises: "",
    repeatingTimingsPerDay: 0
  };

  const [therapyTools, setTherapyTools] = useState<TherapyTools>(
    initialValues || {
      therapyId,
      mantras: "",
      meditationTypes: "",
      bandhas: "",
      yoga: emptyYoga,
      pranayama: emptyPranayama,
      mudras: emptyMudras,
      breathingExercises: emptyBreathingExercises
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parentField, childField] = name.split('.');
      
      setTherapyTools(prev => ({
        ...prev,
        [parentField]: {
          ...prev[parentField as keyof TherapyTools],
          [childField]: childField.includes('repeatingTimings') 
            ? parseInt(value) || 0 
            : value
        }
      }));
    } else {
      // Handle direct fields
      setTherapyTools(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      
      await onSave({
        ...therapyTools,
        id: initialValues?.id,
        therapyId,
        yoga: therapyTools.yoga ? {
          ...therapyTools.yoga,
          id: initialValues?.yoga?.id,
          therapyToolsId: initialValues?.id || 0
        } : undefined,
        pranayama: therapyTools.pranayama ? {
          ...therapyTools.pranayama,
          id: initialValues?.pranayama?.id,
          therapyToolsId: initialValues?.id || 0
        } : undefined,
        mudras: therapyTools.mudras ? {
          ...therapyTools.mudras,
          id: initialValues?.mudras?.id,
          therapyToolsId: initialValues?.id || 0
        } : undefined,
        breathingExercises: therapyTools.breathingExercises ? {
          ...therapyTools.breathingExercises,
          id: initialValues?.breathingExercises?.id,
          therapyToolsId: initialValues?.id || 0
        } : undefined
      });
      
    } catch (err: any) {
      setError(`Error saving therapy tools: ${err.message}`);
      console.error("Error in save:", err);
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "general") {
      return (
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="mantras" className="form-label">
              Mantras
            </label>
            <textarea
              id="mantras"
              name="mantras"
              rows={3}
              className="form-textarea"
              onChange={handleChange}
              value={therapyTools.mantras || ""}
            />
          </div>

          <div className="form-field">
            <label htmlFor="meditationTypes" className="form-label">
              Meditation Types
            </label>
            <textarea
              id="meditationTypes"
              name="meditationTypes"
              rows={3}
              className="form-textarea"
              onChange={handleChange}
              value={therapyTools.meditationTypes || ""}
            />
          </div>

          <div className="form-field">
            <label htmlFor="bandhas" className="form-label">
              Bandhas
            </label>
            <textarea
              id="bandhas"
              name="bandhas"
              rows={3}
              className="form-textarea"
              onChange={handleChange}
              value={therapyTools.bandhas || ""}
            />
          </div>
        </div>
      );
    }

    if (activeTab === "yoga") {
      return (
        <div className="space-y-6">
          <div className="form-field">
            <label htmlFor="yoga.poses" className="form-label">
              Yoga Poses
            </label>
            <textarea
              id="yoga.poses"
              name="yoga.poses"
              rows={5}
              className="form-textarea"
              onChange={handleChange}
              value={therapyTools.yoga?.poses || ""}
            />
          </div>

          <div className="form-field">
            <label htmlFor="yoga.repeatingTimingsPerDay" className="form-label">
              Repeating Timings Per Day
            </label>
            <input
              id="yoga.repeatingTimingsPerDay"
              name="yoga.repeatingTimingsPerDay"
              type="number"
              min="0"
              className="form-input"
              onChange={handleChange}
              value={therapyTools.yoga?.repeatingTimingsPerDay || 0}
            />
          </div>
        </div>
      );
    }

    if (activeTab === "pranayama") {
      return (
        <div className="space-y-6">
          <div className="form-field">
            <label htmlFor="pranayama.techniques" className="form-label">
              Pranayama Techniques
            </label>
            <textarea
              id="pranayama.techniques"
              name="pranayama.techniques"
              rows={5}
              className="form-textarea"
              onChange={handleChange}
              value={therapyTools.pranayama?.techniques || ""}
            />
          </div>

          <div className="form-field">
            <label htmlFor="pranayama.repeatingTimingsPerDay" className="form-label">
              Repeating Timings Per Day
            </label>
            <input
              id="pranayama.repeatingTimingsPerDay"
              name="pranayama.repeatingTimingsPerDay"
              type="number"
              min="0"
              className="form-input"
              onChange={handleChange}
              value={therapyTools.pranayama?.repeatingTimingsPerDay || 0}
            />
          </div>
        </div>
      );
    }

    if (activeTab === "mudras") {
      return (
        <div className="space-y-6">
          <div className="form-field">
            <label htmlFor="mudras.mudraNames" className="form-label">
              Mudra Names
            </label>
            <textarea
              id="mudras.mudraNames"
              name="mudras.mudraNames"
              rows={5}
              className="form-textarea"
              onChange={handleChange}
              value={therapyTools.mudras?.mudraNames || ""}
            />
          </div>

          <div className="form-field">
            <label htmlFor="mudras.repeatingTimingsPerDay" className="form-label">
              Repeating Timings Per Day
            </label>
            <input
              id="mudras.repeatingTimingsPerDay"
              name="mudras.repeatingTimingsPerDay"
              type="number"
              min="0"
              className="form-input"
              onChange={handleChange}
              value={therapyTools.mudras?.repeatingTimingsPerDay || 0}
            />
          </div>
        </div>
      );
    }

    if (activeTab === "breathing") {
      return (
        <div className="space-y-6">
          <div className="form-field">
            <label htmlFor="breathingExercises.exercises" className="form-label">
              Breathing Exercises
            </label>
            <textarea
              id="breathingExercises.exercises"
              name="breathingExercises.exercises"
              rows={5}
              className="form-textarea"
              onChange={handleChange}
              value={therapyTools.breathingExercises?.exercises || ""}
            />
          </div>

          <div className="form-field">
            <label htmlFor="breathingExercises.repeatingTimingsPerDay" className="form-label">
              Repeating Timings Per Day
            </label>
            <input
              id="breathingExercises.repeatingTimingsPerDay"
              name="breathingExercises.repeatingTimingsPerDay"
              type="number"
              min="0"
              className="form-input"
              onChange={handleChange}
              value={therapyTools.breathingExercises?.repeatingTimingsPerDay || 0}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="form-card">
      <div className="mb-6">
        <h2 className="section-title">
          {initialValues ? "Edit Therapy Tools" : "Add Therapy Tools"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Record yoga, pranayama, mudras, and other therapy tools
        </p>
      </div>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="form-tabs">
          <button
            type="button"
            className={`form-tab ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            type="button"
            className={`form-tab ${activeTab === "yoga" ? "active" : ""}`}
            onClick={() => setActiveTab("yoga")}
          >
            Yoga
          </button>
          <button
            type="button"
            className={`form-tab ${activeTab === "pranayama" ? "active" : ""}`}
            onClick={() => setActiveTab("pranayama")}
          >
            Pranayama
          </button>
          <button
            type="button"
            className={`form-tab ${activeTab === "mudras" ? "active" : ""}`}
            onClick={() => setActiveTab("mudras")}
          >
            Mudras
          </button>
          <button
            type="button"
            className={`form-tab ${activeTab === "breathing" ? "active" : ""}`}
            onClick={() => setActiveTab("breathing")}
          >
            Breathing
          </button>
        </div>

        <div className="py-4">
          {renderTabContent()}
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
            {saving ? "Saving..." : "Save Therapy Tools"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TherapyToolsForm; 