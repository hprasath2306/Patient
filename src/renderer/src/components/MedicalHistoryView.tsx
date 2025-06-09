import { MedicalHistory } from "../types";
import "./Dashboard.css";
import MedicalReportFileViewer from "./MedicalReportFileViewer";

interface MedicalHistoryViewProps {
  medicalHistory: MedicalHistory | null | undefined;
  onEdit: () => void;
}

const MedicalHistoryView = ({ medicalHistory, onEdit }: MedicalHistoryViewProps) => {
  if (!medicalHistory) {
    return (
      <div className="medical-history-card">
        <div className="medical-history-header">
          <h2 className="medical-history-title">Medical History</h2>
          <button
            onClick={onEdit}
            className="btn-primary"
          >
            Add Medical History
          </button>
        </div>
        <p className="text-gray-500">No medical history recorded for this disease.</p>
      </div>
    );
  }

  return (
    <div className="medical-history-card">
      <div className="medical-history-header">
        <h2 className="medical-history-title">Medical History</h2>
        <button
          onClick={onEdit}
          className="btn-primary"
        >
          Edit
        </button>
      </div>

      <div className="medical-history-grid">
        {medicalHistory.childhoodIllness && (
          <div className="medical-history-item">
            <span className="detail-label">Childhood Illness</span>
            <p className="detail-value detail-multiline">{medicalHistory.childhoodIllness}</p>
          </div>
        )}

        {medicalHistory.psychiatricIllness && (
          <div className="medical-history-item">
            <span className="detail-label">Psychiatric Illness</span>
            <p className="detail-value detail-multiline">{medicalHistory.psychiatricIllness}</p>
          </div>
        )}

        {medicalHistory.occupationalInfluences && (
          <div className="medical-history-item">
            <span className="detail-label">Occupational Influences</span>
            <p className="detail-value detail-multiline">{medicalHistory.occupationalInfluences}</p>
          </div>
        )}

        {medicalHistory.operationsOrSurgeries && (
          <div className="medical-history-item">
            <span className="detail-label">Operations or Surgeries</span>
            <p className="detail-value detail-multiline">{medicalHistory.operationsOrSurgeries}</p>
          </div>
        )}

        <div className="hereditary-indicator">
          <div className={`hereditary-dot ${medicalHistory.hereditary ? "yes" : "no"}`}>
            {medicalHistory.hereditary && (
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
            {medicalHistory.hereditary ? "Hereditary" : "Not Hereditary"}
          </span>
        </div>

        {medicalHistory.medicalReports && (
          <div className="medical-history-item">
            <span className="detail-label">Medical Reports Notes</span>
            <p className="detail-value detail-multiline">{medicalHistory.medicalReports}</p>
          </div>
        )}

        {medicalHistory.id && (
          <div className="mt-4">
            <h3 className="detail-label">Medical Report Files</h3>
            <div className="no-data-card">

              <MedicalReportFileViewer medicalHistoryId={medicalHistory.id} />

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistoryView; 