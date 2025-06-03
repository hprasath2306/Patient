import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Reuse the dashboard styling

interface Patient {
  id: number;
  name: string;
  date: string;
  age: number;
  gender: "MALE" | "Female";
  placeOfResidence?: string;
  createdAt: string;
}

const PatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const patientList = await window.electron.ipcRenderer.invoke("get-patients");
        setPatients(patientList);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to load patients: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleDeletePatient = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await window.electron.ipcRenderer.invoke("delete-patient", id);
        setPatients(patients.filter((patient) => patient.id !== id));
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1 className="page-title">Patients</h1>
        <Link
          to="/patients/new"
          className="btn-primary"
        >
          Add New Patient
        </Link>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search patients..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div className="no-data-card">
          <h2 className="no-data-title">No patients found</h2>
          <p className="no-data-text">
            {searchTerm ? "Try a different search term or " : ""}
            Start by adding your first patient
          </p>
          <Link to="/patients/new" className="btn-primary">
            Add New Patient
          </Link>
        </div>
      ) : (
        <div className="recent-patients-card">
          <div className="table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Location</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="table-row"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{patient.id}</td>
                    <td className="font-medium">{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.placeOfResidence || "-"}</td>
                    <td>{formatDate(patient.date)}</td>
                    <td>
                      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/patients/${patient.id}/edit`}
                          className="link-button-small"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList; 