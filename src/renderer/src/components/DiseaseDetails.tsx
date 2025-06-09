import { useState, useEffect } from "react";
import { Disease, MedicalHistory, Therapy, TherapyTools } from "../types";
import "./Dashboard.css";
import MedicalHistoryView from "./MedicalHistoryView";
import MedicalHistoryForm from "./MedicalHistoryForm";
import TherapyForm from "./TherapyForm";
import TherapyView from "./TherapyView";

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

  const handleSaveMedicalHistory = async (medicalHistory: MedicalHistory) => {
    try {
      let savedMedicalHistory;

      if (medicalHistory.id) {
        savedMedicalHistory = await window.electron.ipcRenderer.invoke("update-medical-history", {
          id: medicalHistory.id,
          data: medicalHistory
        });
      } else {
        savedMedicalHistory = await window.electron.ipcRenderer.invoke("create-medical-history", medicalHistory);
      }

      // Update the local disease state with the new medical history
      setDisease(prev => prev ? {
        ...prev,
        medicalHistory: savedMedicalHistory
      } : null);

      setViewState("details");
    } catch (err) {
      console.error("Error saving medical history:", err);
      setError("Failed to save medical history");
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
      <MedicalHistoryForm
        diseaseId={id}
        initialValues={disease?.medicalHistory}
        onSave={handleSaveMedicalHistory}
        onCancel={() => setViewState("details")}
      />
    );
  }

   const handleCancelTherapy = () => {
    setSelectedTherapy(null);
    setViewState("details");
  };

    const handleSaveTherapy = async (therapy: Therapy) => {
    try {
      let savedTherapy;

      if (therapy.id) {
        savedTherapy = await window.electron.ipcRenderer.invoke("update-therapy", {
          id: therapy.id,
          data: therapy
        });
      } else {
        savedTherapy = await window.electron.ipcRenderer.invoke("create-therapy", therapy);
      }

      // Update the local disease state with the new therapy
      setDisease(prev => {
        if (!prev) return null;

        // Check if we're updating an existing therapy or adding a new one
        if (therapy.id) {
          // Update existing therapy
          const updatedTherapies = prev.therapies ?
            prev.therapies.map(t => t.id === therapy.id ? savedTherapy : t) :
            [savedTherapy];
          return {
            ...prev,
            therapies: updatedTherapies
          };
        } else {
          // Add new therapy
          return {
            ...prev,
            therapies: prev.therapies ? [...prev.therapies, savedTherapy] : [savedTherapy]
          };
        }
      });

      setSelectedTherapy(null);
      setViewState("details");
    } catch (err) {
      console.error("Error saving therapy:", err);
      throw err;
    }
  };

  if (viewState === "therapy-form") {
   return (
      <TherapyForm
        initialValues={selectedTherapy}
        diseaseId={disease.id!}
        onSave={handleSaveTherapy}
        onCancel={handleCancelTherapy}
      />
    );
  }
    const handleEditFromTherapyView = () => {
    setViewState("therapy-form");
    };
  const handleSaveTherapyTools = async (therapyTools: TherapyTools) => {
    try {
      let savedTherapyTools;

      if (therapyTools.id) {
        // Update existing therapy tools
        savedTherapyTools = await window.electron.ipcRenderer.invoke("update-therapy-tools", {
          id: therapyTools.id,
          data: therapyTools
        });
      } else {
        // Create new therapy tools
        savedTherapyTools = await window.electron.ipcRenderer.invoke("create-therapy-tools", therapyTools);
      }

      // Update local state
      setDisease(prev => {
        if (!prev) return null;

        // Find the therapy we're updating tools for
        const updatedTherapies = prev.therapies?.map(t => {
          if (t.id === therapyTools.therapyId) {
            return {
              ...t,
              therapyTools: savedTherapyTools
            };
          }
          return t;
        });

        return {
          ...prev,
          therapies: updatedTherapies
        };
      });

      setViewState("therapy-view");
    } catch (err) {
      console.error("Error saving therapy tools:", err);
      throw err;
    }
  };

  if (viewState === "therapy-view") {
     return (
      <div>
        <TherapyView
          therapy={selectedTherapy}
          onEdit={handleEditFromTherapyView}
          onSaveTherapyTools={handleSaveTherapyTools}
        />
        <div className="mt-4">
          <button
            onClick={() => setViewState("details")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Back to Disease
          </button>
        </div>
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
      <MedicalHistoryView
        medicalHistory={disease.medicalHistory}
        onEdit={handleEditMedicalHistory}
      />



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