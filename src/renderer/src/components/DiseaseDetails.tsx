import { useState, useEffect } from "react";
import { Disease, MedicalHistory, Therapy, TherapyTools } from "../types";
import "./Dashboard.css";

interface DiseaseDetailsProps {
  id: number;
  onBack: () => void;
  onEdit: (disease: Disease) => void;
}

type ViewState = "details" | "medical-history-form" | "therapy-form" | "therapy-view" | "therapy-tools-form";

const DiseaseDetails = ({ id, onBack, onEdit }: DiseaseDetailsProps) => {
  const [disease, setDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewState, setViewState] = useState<ViewState>("details");
  const [selectedTherapy, setSelectedTherapy] = useState<Therapy | null>(null);

  useEffect(() => {
    const fetchDisease = async () => {
      try {
        setLoading(true);
        const fetchedDisease = await window.electron.ipcRenderer.invoke("get-disease", id);
        setDisease(fetchedDisease);
      } catch (err) {
        console.error("Error fetching disease:", err);
        setError("Failed to load disease data");
      } finally {
        setLoading(false);
      }
    };

    fetchDisease();
  }, [id]);

  const handleEdit = () => {
    if (disease) {
      onEdit(disease);
    }
  };

  const handleEditMedicalHistory = () => {
    setViewState("medical-history-form");
  };

  const handleAddTherapy = () => {
    setSelectedTherapy(null);
    setViewState("therapy-form");
  };

  const handleEditTherapy = (therapy: Therapy) => {
    setSelectedTherapy(therapy);
    setViewState("therapy-form");
  };

  const handleViewTherapy = (therapy: Therapy) => {
    setSelectedTherapy(therapy);
    setViewState("therapy-view");
  };

  const handleDeleteTherapy = async (therapyId: number) => {
    try {
      await window.electron.ipcRenderer.invoke("delete-therapy", therapyId);

      // Update local state
      setDisease(prev => {
        if (!prev || !prev.therapies) return prev;
        return {
          ...prev,
          therapies: prev.therapies.filter(t => t.id !== therapyId)
        };
      });
    } catch (err) {
      console.error("Error deleting therapy:", err);
      setError("Failed to delete therapy");
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-box">
        {error}
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="no-data-card">
        <h2 className="no-data-title">Disease not found</h2>
        <p className="no-data-text">It may have been deleted.</p>
        <button className="btn-primary" onClick={onBack}>
          Back to Disease List
        </button>
      </div>
    );
  }

  // The MedicalHistoryForm, TherapyForm, and TherapyView components will be implemented separately
  if (viewState === "medical-history-form") {
    return (
      <div className="no-data-card">
        <h2 className="no-data-title">Medical History Form</h2>
        <p className="no-data-text">The medical history form component will be implemented separately.</p>
        <button className="btn-primary" onClick={() => setViewState("details")}>
          Back to Disease Details
        </button>
      </div>
    );
  }

  if (viewState === "therapy-form") {
    return (
      <div className="no-data-card">
        <h2 className="no-data-title">Therapy Form</h2>
        <p className="no-data-text">The therapy form component will be implemented separately.</p>
        <button className="btn-primary" onClick={() => setViewState("details")}>
          Back to Disease Details
        </button>
      </div>
    );
  }

  if (viewState === "therapy-view") {
    return (
      <div className="no-data-card">
        <h2 className="no-data-title">Therapy View</h2>
        <p className="no-data-text">The therapy view component will be implemented separately.</p>
        <button className="btn-primary" onClick={() => setViewState("details")}>
          Back to Disease Details
        </button>
      </div>
    );
  }

  // Helper function to format list items from comma-separated strings
  const formatList = (text?: string) => {
    if (!text) return null;
    return (
      <ul className="list-disc pl-5">
        {text.split(",").map((item, index) => (
          <li key={index} className="mb-1">
            {item.trim()}
          </li>
        ))}
      </ul>
    );
  };

  // Group fields into sections for better organization
  const sections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Disease Name", value: disease.nameOfDisease },
        { label: "Type of Disease", value: disease.typeOfDisease },
        { label: "Chief Complaint", value: disease.chiefComplaint },
        { label: "Time Period", value: disease.timePeriod },
        { label: "Onset of Disease", value: disease.onsetOfDisease },
        { label: "Severity", value: disease.severity },
      ],
    },
    {
      title: "Symptoms and Effects",
      fields: [
        {
          label: "Symptoms",
          value: disease.symptoms,
          format: formatList
        },
        { label: "Location of Pain", value: disease.locationOfPain },
        { label: "Recurrence Timing", value: disease.recurrenceTiming },
        {
          label: "Aggravating Factors",
          value: disease.aggravatingFactors,
          format: formatList
        },
      ],
    },
    {
      title: "References",
      fields: [
        { label: "Anatomical Reference", value: disease.anatomicalReference },
        { label: "Physiological Reference", value: disease.physiologicalReference },
        { label: "Psychological Reference", value: disease.psychologicalReference },
      ],
    },
    {
      title: "Additional Information",
      fields: [
        { label: "Medical Reports", value: disease.medicalReports },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="disease-card">
        <div className="disease-card-header mb-6">
          <h2 className="section-title">
            {disease.nameOfDisease || "Unnamed Disease"}
          </h2>
          <button
            onClick={handleEdit}
            className="btn-primary"
          >
            Edit
          </button>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="section-title border-b pb-2 mb-4">{section.title}</h3>
              <div className="details-grid-2">
                {section.fields.map((field) =>
                  field.value ? (
                    <div key={field.label} className="detail-item">
                      <span className="detail-label">{field.label}</span>
                      <div className="detail-value">
                        {field.format ? field.format(field.value) : <p>{field.value}</p>}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical History Section */}
      <div className="medical-history-card">
        <div className="medical-history-header">
          <h2 className="medical-history-title">Medical History</h2>
          <button
            onClick={handleEditMedicalHistory}
            className="btn-primary"
          >
            {disease.medicalHistory ? "Edit" : "Add Medical History"}
          </button>
        </div>

        {!disease.medicalHistory ? (
          <p className="text-gray-500">No medical history recorded for this disease.</p>
        ) : (
          <div className="medical-history-grid">
            {disease.medicalHistory.childhoodIllness && (
              <div className="medical-history-item">
                <span className="detail-label">Childhood Illness</span>
                <p className="detail-value detail-multiline">{disease.medicalHistory.childhoodIllness}</p>
              </div>
            )}

            {disease.medicalHistory.psychiatricIllness && (
              <div className="medical-history-item">
                <span className="detail-label">Psychiatric Illness</span>
                <p className="detail-value detail-multiline">{disease.medicalHistory.psychiatricIllness}</p>
              </div>
            )}

            {disease.medicalHistory.occupationalInfluences && (
              <div className="medical-history-item">
                <span className="detail-label">Occupational Influences</span>
                <p className="detail-value detail-multiline">{disease.medicalHistory.occupationalInfluences}</p>
              </div>
            )}

            {disease.medicalHistory.operationsOrSurgeries && (
              <div className="medical-history-item">
                <span className="detail-label">Operations or Surgeries</span>
                <p className="detail-value detail-multiline">{disease.medicalHistory.operationsOrSurgeries}</p>
              </div>
            )}

            <div className="hereditary-indicator">
              <div className={`hereditary-dot ${disease.medicalHistory.hereditary ? "yes" : "no"}`}>
                {disease.medicalHistory.hereditary && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="detail-value">
                {disease.medicalHistory.hereditary ? "Hereditary" : "Not Hereditary"}
              </span>
            </div>

            {disease.medicalHistory.medicalReports && (
              <div className="medical-history-item">
                <span className="detail-label">Medical Reports Notes</span>
                <p className="detail-value detail-multiline">{disease.medicalHistory.medicalReports}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Therapies Section */}
      <div className="therapy-card">
        <div className="therapy-header">
          <h2 className="therapy-title">Therapies</h2>
          <button
            onClick={handleAddTherapy}
            className="btn-primary"
          >
            Add Therapy
          </button>
        </div>

        {(!disease.therapies || disease.therapies.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            No therapies have been recorded yet.
          </div>
        ) : (
          <div className="space-y-6">
            {disease.therapies.map((therapy) => (
              <div key={therapy.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{therapy.name} <span className="therapy-subtitle">({therapy.fitnessOrTherapy})</span></h3>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditTherapy(therapy)}
                      className="link-button-small"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => therapy.id && handleDeleteTherapy(therapy.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="therapy-grid">
                  {therapy.homeRemedies && (
                    <div className="therapy-item">
                      <span className="detail-label">Home Remedies:</span> {therapy.homeRemedies}
                    </div>
                  )}
                  {therapy.dietReference && (
                    <div className="therapy-item">
                      <span className="detail-label">Diet:</span> {therapy.dietReference}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleViewTherapy(therapy)}
                  className="link-button"
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="details-footer">
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default DiseaseDetails; 