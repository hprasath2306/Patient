import React, { useState, useEffect } from 'react';
import { MedicalReport } from '../types';
import './Dashboard.css';
import path from 'path-browserify';

interface MedicalReportFileViewerProps {
  diseaseId?: number;
  medicalHistoryId?: number;
  className?: string;
}

const MedicalReportFileViewer: React.FC<MedicalReportFileViewerProps> = ({
  diseaseId,
  medicalHistoryId,
  className
}) => {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<{
    data: string;
    fileType: string;
    fileName: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Helper function to get filename from path
  const getFilename = (filePath: string) => {
    return path.basename(filePath);
  };

  useEffect(() => {
    fetchReports();
  }, [diseaseId, medicalHistoryId]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      let reportData: MedicalReport[] = [];

      if (diseaseId) {
        reportData = await window.electron.ipcRenderer.invoke('get-medical-reports-by-disease', diseaseId);
      } else if (medicalHistoryId) {
        reportData = await window.electron.ipcRenderer.invoke('get-medical-reports-by-medical-history', medicalHistoryId);
      }

      setReports(reportData);
    } catch (err: any) {
      setError(err.message || 'Error loading medical reports');
      console.error('Error fetching medical reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async (report: MedicalReport) => {
    try {
      setLoading(true);
      const fileData = await window.electron.ipcRenderer.invoke('open-medical-report', report.filePath);
      setSelectedReport(fileData);
      setShowPreview(true);
    } catch (err: any) {
      setError(err.message || 'Error loading file');
      console.error('Error opening file:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      setLoading(true);
      await window.electron.ipcRenderer.invoke('delete-medical-report', reportId);
      await fetchReports(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Error deleting report');
      console.error('Error deleting report:', err);
    } finally {
      setLoading(false);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedReport(null);
  };

  if (loading && !showPreview) {
    return <div className="medical-report-loading">Loading medical reports...</div>;
  }

  return (
    <div className={`medical-report-viewer ${className || ''}`}>
      {error && <div className="medical-report-error">{error}</div>}

      {reports.length === 0 ? (
        <div className="medical-report-empty">No medical reports uploaded yet.</div>
      ) : (
        <div className="medical-report-list">
          <h4 className="medical-report-title">Medical Reports</h4>
          <div className="medical-report-list-container">
            {reports.map((report) => (
              <div key={report.id} className="medical-report-item">
                <div className="medical-report-item-left">
                  <svg className="medical-report-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="medical-report-filename">{getFilename(report.filePath)}</span>
                </div>
                <div className="medical-report-actions">
                  <button
                    onClick={() => handleViewReport(report)}
                    className="medical-report-view-btn"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id!)}
                    className="medical-report-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {showPreview && selectedReport && (
        <div className="medical-report-modal-overlay" onClick={closePreview}>
          <div className="medical-report-modal" onClick={e => e.stopPropagation()}>
            <div className="medical-report-modal-header">
              <h3 className="medical-report-modal-title">{selectedReport.fileName}</h3>
              <button onClick={closePreview} className="medical-report-modal-close">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {selectedReport && (
              <div className="medical-report-modal-content">
                {selectedReport.fileType.toLowerCase().includes("pdf") ? (
                  <iframe
                    src={`data:application/pdf;base64,${selectedReport.data}`}
                    title={selectedReport.fileName}
                    width="100%"
                    height="600px"
                    style={{ border: "none" }}
                  />
                ) : (
                  <img
                    src={`data:image/${selectedReport.fileType.replace('.', '').toLowerCase()};base64,${selectedReport.data}`}
                    alt={selectedReport.fileName}
                    className="medical-report-image-viewer"
                  />
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalReportFileViewer;
