import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import PatientList from "./components/PatientList";
// import PatientForm from "./components/PatientForm";
// import PatientDetails from "./components/PatientDetails";
import Dashboard from "./components/Dashboard";
import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";
import PatientDetails from "./components/PatientDetails";
import DiseaseList from "./components/DiseaseList";
import "./App.css"; // Import the CSS file

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>Patient Management</h1>
          </div>
          <nav className="sidebar-nav">
            <Link to="/" className="nav-link">
              Dashboard
            </Link>
            <Link to="/patients" className="nav-link">
              Patient List
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-padding">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patients/new" element={<PatientForm />} />
              <Route path="/patients/:id" element={<PatientDetails />} />
              <Route path="/patients/:id/edit" element={<PatientForm />} />
              
              {/* Disease Management will be integrated directly in PatientDetails */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
