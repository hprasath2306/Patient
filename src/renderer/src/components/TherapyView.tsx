import { useState } from "react";
import { Therapy, TherapyTools } from "../types";
import "./Dashboard.css";

interface TherapyViewProps {
  therapy: Therapy | null | undefined;
  onEdit: () => void;
  onSaveTherapyTools?: (therapyTools: TherapyTools) => Promise<void>;
}

type ViewState = "view" | "edit-tools";

const TherapyView = ({ therapy, onEdit, onSaveTherapyTools }: TherapyViewProps) => {
  const [viewState, setViewState] = useState<ViewState>("view");

  if (!therapy) {
    return (
      <div className="therapy-card">
        <div className="therapy-header">
          <h2 className="therapy-title">Therapy</h2>
          <button
            onClick={onEdit}
            className="btn-primary"
          >
            Add Therapy
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          No therapy has been recorded yet.
        </div>
      </div>
    );
  }

  const handleEditTherapyTools = () => {
    setViewState("edit-tools");
  };

  // The TherapyToolsForm will be implemented separately
  if (viewState === "edit-tools") {
    return (
      <div className="no-data-card">
        <h2 className="no-data-title">Therapy Tools Form</h2>
        <p className="no-data-text">The therapy tools form component will be implemented separately.</p>
        <button className="btn-primary" onClick={() => setViewState("view")}>
          Back to Therapy View
        </button>
      </div>
    );
  }

  return (
    <div className="therapy-card">
      <div className="therapy-header">
        <h2 className="therapy-title">
          {therapy.name} <span className="therapy-subtitle">({therapy.fitnessOrTherapy})</span>
        </h2>
        <button
          onClick={onEdit}
          className="btn-primary"
        >
          Edit Therapy
        </button>
      </div>

      <div className="space-y-6">
        <div className="therapy-grid">
          {therapy.homeRemedies && (
            <div className="therapy-item">
              <span className="detail-label">Home Remedies</span>
              <p className="detail-value detail-multiline">{therapy.homeRemedies}</p>
            </div>
          )}

          {therapy.dietReference && (
            <div className="therapy-item">
              <span className="detail-label">Diet Reference</span>
              <p className="detail-value detail-multiline">{therapy.dietReference}</p>
            </div>
          )}

          {therapy.lifestyleModifications && (
            <div className="therapy-item">
              <span className="detail-label">Lifestyle Modifications</span>
              <p className="detail-value detail-multiline">{therapy.lifestyleModifications}</p>
            </div>
          )}

          {therapy.secondaryTherapy && (
            <div className="therapy-item">
              <span className="detail-label">Secondary Therapy</span>
              <p className="detail-value detail-multiline">{therapy.secondaryTherapy}</p>
            </div>
          )}
        </div>

        <div className="therapy-section">
          <h3 className="therapy-section-title">Poses Information</h3>
          <div className="therapy-grid">
            {therapy.aggravatingPoses && (
              <div className="therapy-item">
                <span className="detail-label">Aggravating Poses</span>
                <p className="detail-value detail-multiline">{therapy.aggravatingPoses}</p>
              </div>
            )}

            {therapy.relievingPoses && (
              <div className="therapy-item">
                <span className="detail-label">Relieving Poses</span>
                <p className="detail-value detail-multiline">{therapy.relievingPoses}</p>
              </div>
            )}

            {therapy.avoidablePoses && (
              <div className="therapy-item">
                <span className="detail-label">Avoidable Poses</span>
                <p className="detail-value detail-multiline">{therapy.avoidablePoses}</p>
              </div>
            )}

            {therapy.therapyPoses && (
              <div className="therapy-item">
                <span className="detail-label">Therapy Poses</span>
                <p className="detail-value detail-multiline">{therapy.therapyPoses}</p>
              </div>
            )}
          </div>
        </div>

        <div className="therapy-section">
          <h3 className="therapy-section-title">Physical Assessment</h3>
          <div className="therapy-grid-3">
            {therapy.flexibilityLevel && (
              <div className="therapy-item">
                <span className="detail-label">Flexibility Level</span>
                <p className="detail-value">{therapy.flexibilityLevel}</p>
              </div>
            )}

            {therapy.nerveStiffness && (
              <div className="therapy-item">
                <span className="detail-label">Nerve Stiffness</span>
                <p className="detail-value">{therapy.nerveStiffness}</p>
              </div>
            )}

            {therapy.muscleStiffness && (
              <div className="therapy-item">
                <span className="detail-label">Muscle Stiffness</span>
                <p className="detail-value">{therapy.muscleStiffness}</p>
              </div>
            )}
          </div>
        </div>

        {therapy.sideEffects && (
          <div className="therapy-section">
            <h3 className="therapy-section-title">Side Effects</h3>
            <p className="detail-value detail-multiline">{therapy.sideEffects}</p>
          </div>
        )}

        {therapy.progressiveReport && (
          <div className="therapy-section">
            <h3 className="therapy-section-title">Progressive Report</h3>
            <p className="detail-value detail-multiline">{therapy.progressiveReport}</p>
          </div>
        )}

        {/* Therapy Tools Section */}
        <div className="therapy-section">
          <div className="therapy-header">
            <h3 className="therapy-section-title">Therapy Tools</h3>
            <button
              onClick={onSaveTherapyTools ? handleEditTherapyTools : onEdit}
              className="btn-primary"
            >
              {therapy.therapyTools ? "Edit Tools" : "Add Tools"}
            </button>
          </div>
          
          {!therapy.therapyTools ? (
            <div className="text-center py-8 text-gray-500">
              No therapy tools have been recorded yet.
            </div>
          ) : (
            <div className="no-data-card">
              <p className="no-data-text">
                Therapy tools view component will be implemented separately.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapyView; 