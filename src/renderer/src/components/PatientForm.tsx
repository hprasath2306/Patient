import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

type PatientFormData = Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'diseases'>;

const initialValues: PatientFormData = {
  name: "",
  date: new Date().toISOString(),
  age: 0,
  gender: "MALE",
  placeOfResidence: "",
  referencePerson: "",
  natureOfWork: "",
  height: undefined,
  weight: undefined,
  bmi: undefined,
  sleepPatterns: "",
  diet: "",
};

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientFormData>(initialValues);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");
  const isEditing = !!id;

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

  const calculateBMI = (height?: number, weight?: number) => {
    if (height && weight) {
      // BMI = weight(kg) / (height(m))²
      const heightInMeters = height / 100; // Convert cm to meters
      const bmi = weight / (heightInMeters * heightInMeters);
      return parseFloat(bmi.toFixed(2));
    }
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Create a copy of the patient data
      const formData = { ...patient };
      
      // Calculate BMI if height and weight are provided
      if (formData.height && formData.weight) {
        formData.bmi = calculateBMI(formData.height, formData.weight);
      }

      if (isEditing) {
        await window.electron.ipcRenderer.invoke("update-patient", {
          id: parseInt(id!),
          data: formData,
        });
      } else {
        await window.electron.ipcRenderer.invoke("create-patient", formData);
      }
      navigate("/patients");
    } catch (error) {
      console.error("Error saving patient:", error);
      setError("Failed to save patient data");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'age' || name === 'height' || name === 'weight') {
      const numValue = name === 'age' ? parseInt(value) : parseFloat(value);
      setPatient(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? undefined : numValue
      }));
      
      // Update BMI if height or weight changes
      if ((name === 'height' || name === 'weight') && !isNaN(numValue)) {
        const updatedPatient = {
          ...patient,
          [name]: numValue
        };
        
        const newHeight = name === 'height' ? numValue : updatedPatient.height;
        const newWeight = name === 'weight' ? numValue : updatedPatient.weight;
        
        if (newHeight && newWeight) {
          updatedPatient.bmi = calculateBMI(newHeight, newWeight);
        }
        
        setPatient(updatedPatient);
      }
    } else {
      setPatient(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="page-title">
        {isEditing ? "Edit Patient" : "Add New Patient"}
      </h1>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="name" className="form-label">
                  Patient Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={patient.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="age" className="form-label">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  min="0"
                  value={patient.age || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="gender" className="form-label">
                  Gender *
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={patient.gender}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="MALE">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="placeOfResidence" className="form-label">
                  Place of Residence
                </label>
                <input
                  type="text"
                  name="placeOfResidence"
                  id="placeOfResidence"
                  value={patient.placeOfResidence || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="referencePerson" className="form-label">
                  Reference Person
                </label>
                <input
                  type="text"
                  name="referencePerson"
                  id="referencePerson"
                  value={patient.referencePerson || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="natureOfWork" className="form-label">
                  Nature of Work
                </label>
                <input
                  type="text"
                  name="natureOfWork"
                  id="natureOfWork"
                  value={patient.natureOfWork || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Physical Information</h2>
            <div className="form-grid form-grid-3">
              <div className="form-field">
                <label htmlFor="height" className="form-label">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  id="height"
                  step="0.01"
                  value={patient.height || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="weight" className="form-label">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  step="0.01"
                  value={patient.weight || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="bmi" className="form-label">
                  BMI
                </label>
                <input
                  type="number"
                  name="bmi"
                  id="bmi"
                  value={patient.bmi || ''}
                  className="form-input form-input-disabled"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Lifestyle</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="sleepPatterns" className="form-label">
                  Sleep Patterns
                </label>
                <textarea
                  name="sleepPatterns"
                  id="sleepPatterns"
                  rows={3}
                  value={patient.sleepPatterns || ''}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
              </div>

              <div className="form-field">
                <label htmlFor="diet" className="form-label">
                  Diet
                </label>
                <textarea
                  name="diet"
                  id="diet"
                  rows={3}
                  value={patient.diet || ''}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/patients")}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {isEditing ? "Update Patient" : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm; 