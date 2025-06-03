import { useState, useEffect } from "react";
import { Disease } from "../types";
import DiseaseForm from "./DiseaseForm";
import DiseaseDetails from "./DiseaseDetails";
import "./Dashboard.css";

interface DiseaseListProps {
  patientId: number;
}

type ViewState = "list" | "form" | "details";

const DiseaseList = ({ patientId }: DiseaseListProps) => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewState, setViewState] = useState<ViewState>("list");
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setLoading(true);
        const diseasesList = await window.electron.ipcRenderer.invoke("get-diseases-by-patient", patientId);
        setDiseases(diseasesList);
      } catch (err) {
        console.error("Error fetching diseases:", err);
        setError("Failed to load diseases");
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, [patientId]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this disease record?")) {
      try {
        await window.electron.ipcRenderer.invoke("delete-disease", id);
        setDiseases(diseases.filter(disease => disease.id !== id));
      } catch (err) {
        console.error("Error deleting disease:", err);
        setError("Failed to delete disease");
      }
    }
  };

  const handleAddNew = () => {
    setEditingDisease(null);
    setViewState("form");
  };

  const handleEdit = (disease: Disease) => {
    setEditingDisease(disease);
    setViewState("form");
  };

  const handleViewDetails = (id: number | undefined) => {
    if (id) {
      setSelectedDiseaseId(id);
      setViewState("details");
    }
  };

  const handleSaveDisease = async (disease: Disease) => {
    try {
      let savedDisease;
      if (disease.id) {
        // Update existing disease
        savedDisease = await window.electron.ipcRenderer.invoke("update-disease", disease);
        setDiseases(diseases.map(d => d.id === disease.id ? savedDisease : d));
      } else {
        // Add new disease
        savedDisease = await window.electron.ipcRenderer.invoke("add-disease", disease);
        setDiseases([...diseases, savedDisease]);
      }
      setViewState("list");
    } catch (err) {
      console.error("Error saving disease:", err);
      setError("Failed to save disease");
    }
  };

  const handleDiseaseEdit = (disease: Disease) => {
    setEditingDisease(disease);
    setViewState("form");
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

  if (viewState === "form") {
    return (
      <DiseaseForm
        initialValues={editingDisease || undefined}
        patientId={patientId}
        onSave={handleSaveDisease}
        onCancel={() => setViewState("list")}
      />
    );
  }

  if (viewState === "details" && selectedDiseaseId !== null) {
    return (
      <DiseaseDetails
        id={selectedDiseaseId}
        onBack={() => setViewState("list")}
        onEdit={handleDiseaseEdit}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="page-header">
        <h2 className="section-title">Diseases & Conditions</h2>
        <button
          onClick={handleAddNew}
          className="btn-primary"
        >
          Add New Disease
        </button>
      </div>

      {diseases.length === 0 ? (
        <div className="no-data-card">
          <h2 className="no-data-title">No diseases found</h2>
          <p className="no-data-text">No diseases or conditions have been recorded for this patient.</p>
          <button className="btn-primary" onClick={handleAddNew}>
            Add the first one
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {diseases.map((disease) => (
            <div
              key={disease.id}
              className="disease-card"
            >
              <div className="disease-card-header">
                <h3 className="disease-card-title">{disease.nameOfDisease || "Unnamed Disease"}</h3>
                <div className="action-buttons">
                  <button
                    onClick={() => handleEdit(disease)}
                    className="link-button-small"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => disease.id && handleDelete(disease.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {disease.typeOfDisease && (
                <div className="disease-type">
                  Type: {disease.typeOfDisease}
                </div>
              )}

              <div className="disease-details-grid">
                <div className="disease-detail-item">
                  <h4 className="detail-label">Chief Complaint</h4>
                  <p className="detail-value">{disease.chiefComplaint || "-"}</p>
                </div>

                <div className="disease-detail-item">
                  <h4 className="detail-label">Time Period</h4>
                  <p className="detail-value">{disease.timePeriod || "-"}</p>
                </div>

                {disease.severity && (
                  <div className="disease-detail-item">
                    <h4 className="detail-label">Severity</h4>
                    <p className="detail-value">{disease.severity}</p>
                  </div>
                )}

                {disease.onsetOfDisease && (
                  <div className="disease-detail-item">
                    <h4 className="detail-label">Onset</h4>
                    <p className="detail-value">{disease.onsetOfDisease}</p>
                  </div>
                )}
              </div>

              <button
                className="link-button"
                onClick={() => handleViewDetails(disease.id)}
              >
                View complete details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiseaseList; 