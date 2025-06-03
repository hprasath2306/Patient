import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DiseaseList from "./DiseaseList";
import "./Dashboard.css"; // Reuse dashboard styling

interface Patient {
  id: number;
  name: string;
  date: string;
  age: number;
  gender: "MALE" | "Female";
  placeOfResidence?: string;
  referencePerson?: string;
  natureOfWork?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  sleepPatterns?: string;
  diet?: string;
  createdAt: string;
  updatedAt: string;
  diseases?: any[];
}

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "diseases">("details");

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          setLoading(true);
          const fetchedPatient = await window.electron.ipcRenderer.invoke("get-patient", id);
          setPatient(fetchedPatient);
        } catch (error) {
          console.error("Error fetching patient:", error);
          setError("Failed to load patient data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatient();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await window.electron.ipcRenderer.invoke("delete-patient", id);
        navigate("/patients");
      } catch (error) {
        console.error("Error deleting patient:", error);
        setError("Failed to delete patient");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!patient) {
    return (
      <div className="no-data-card">
        <h2 className="no-data-title">Patient not found</h2>
        <p className="no-data-text">The patient you're looking for doesn't exist or has been removed.</p>
        <Link to="/patients" className="btn-primary">
          Back to Patient List
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="details-header">
        <div className="details-title-container">
          <h1 className="page-title">{patient.name}</h1>
          <span className="patient-id">ID: {patient.id}</span>
        </div>
        <div className="details-actions">
          <Link
            to={`/patients/${id}/edit`}
            className="btn-primary"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="btn-danger"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Patient Details
        </button>
        <button
          className={`tab-button ${activeTab === "diseases" ? "active" : ""}`}
          onClick={() => setActiveTab("diseases")}
        >
          Diseases & Conditions
        </button>
      </div>

      <div className="details-content">
        {activeTab === "details" ? (
          <div className="details-grid">
            <div className="details-column">
              <div className="details-section">
                <h2 className="section-title">Basic Information</h2>
                <div className="details-grid-2">
                  <div className="detail-item">
                    <span className="detail-label">Registration Date</span>
                    <span className="detail-value">{formatDate(patient.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Age</span>
                    <span className="detail-value">{patient.age}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender</span>
                    <span className="detail-value">{patient.gender}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Place of Residence</span>
                    <span className="detail-value">{patient.placeOfResidence || "-"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Reference Person</span>
                    <span className="detail-value">{patient.referencePerson || "-"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nature of Work</span>
                    <span className="detail-value">{patient.natureOfWork || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h2 className="section-title">Physical Information</h2>
                <div className="details-grid-3">
                  <div className="detail-item">
                    <span className="detail-label">Height</span>
                    <span className="detail-value">
                      {patient.height ? `${patient.height} cm` : "-"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Weight</span>
                    <span className="detail-value">
                      {patient.weight ? `${patient.weight} kg` : "-"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">BMI</span>
                    <span className="detail-value">{patient.bmi || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-column">
              <div className="details-section">
                <h2 className="section-title">Lifestyle</h2>
                <div className="details-grid-1">
                  <div className="detail-item">
                    <span className="detail-label">Sleep Patterns</span>
                    <span className="detail-value detail-multiline">
                      {patient.sleepPatterns || "-"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Diet</span>
                    <span className="detail-value detail-multiline">
                      {patient.diet || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h2 className="section-title">Record Information</h2>
                <div className="details-grid-2">
                  <div className="detail-item">
                    <span className="detail-label">Created</span>
                    <span className="detail-value">
                      {formatDateTime(patient.createdAt)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Updated</span>
                    <span className="detail-value">
                      {formatDateTime(patient.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="diseases-container">
            {patient && patient.id && (
              <DiseaseList patientId={patient.id} />
            )}
          </div>
        )}
      </div>

      <div className="details-footer">
        <Link
          to="/patients"
          className="link-button"
        >
          ← Back to Patient List
        </Link>
      </div>
    </div>
  );
};

export default PatientDetails; 