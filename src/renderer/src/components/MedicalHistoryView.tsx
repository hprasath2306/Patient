import { MedicalHistory } from "../types";
import "./Dashboard.css";
import MedicalReportFileViewer from "./MedicalReportFileViewer";

interface MedicalHistoryViewProps {
  medicalHistory: MedicalHistory | null | undefined;
  onEdit: () => void;
}

const MedicalHistoryView: React.FC<MedicalHistoryViewProps> = ({
  medicalHistory,
  onEdit,
}) => {
  if (!medicalHistory) {
    return (
      <div className="medical-history-empty">
        <div className="empty-state">
          <svg className="empty-state-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="empty-state-title">No Medical History</h3>
          <p className="empty-state-description">No medical history has been added yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-history-container">
      <div className="medical-history-header">
        <h2 className="medical-history-title">Medical History</h2>
        <button onClick={onEdit} className="edit-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="edit-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>

      <div className="medical-history-grid">
        {/* Childhood Illness Section */}
        <div className="medical-history-card">
          <div className="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" className="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="card-title">Childhood Illness</h3>
          </div>
          <p className="card-content">{medicalHistory.childhoodIllness || "None reported"}</p>
        </div>

        {/* Psychiatric Illness Section */}
        <div className="medical-history-card">
          <div className="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" className="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="card-title">Psychiatric Illness</h3>
          </div>
          <p className="card-content">{medicalHistory.psychiatricIllness || "None reported"}</p>
        </div>

        {/* Operations Section */}
        <div className="medical-history-card">
          <div className="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" className="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="card-title">Operations or Surgeries</h3>
          </div>
          <p className="card-content">{medicalHistory.operationsOrSurgeries || "None reported"}</p>
        </div>

        {/* Occupational Influences Section */}
        <div className="medical-history-card">
          <div className="card-header">
            <svg xmlns="http://www.w3.org/2000/svg" className="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="card-title">Occupational Influences</h3>
          </div>
          <p className="card-content">{medicalHistory.occupationalInfluences || "None reported"}</p>
        </div>
      </div>

      {/* Hereditary Status */}
      <div className="hereditary-section">
        <div className={`hereditary-indicator ${medicalHistory.hereditary ? "hereditary-yes" : "hereditary-no"}`}>
          <div className="hereditary-icon-wrapper">
            {medicalHistory.hereditary ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="hereditary-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="hereditary-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <span className="hereditary-text">
            {medicalHistory.hereditary ? "Hereditary Condition" : "Non-Hereditary Condition"}
          </span>
        </div>
      </div>

      {/* Medical Reports Section */}
      {medicalHistory.medicalReports && (
        <div className="medical-reports-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="section-title">Medical Reports Notes</h3>
          </div>
          <p className="section-content">{medicalHistory.medicalReports}</p>
        </div>
      )}

      {/* Medical Report Files */}
      {medicalHistory.id && (
        <div className="medical-files-section">
          <MedicalReportFileViewer medicalHistoryId={medicalHistory.id} />
        </div>
      )}
    </div>
  );
};

export default MedicalHistoryView; 