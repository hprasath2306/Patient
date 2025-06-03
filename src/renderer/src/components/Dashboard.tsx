import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import "./Dashboard.css";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: "MALE" | "Female";
  createdAt: string;
}

const COLORS = ["#0088FE", "#FF8042"];

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const patientList = await window.electron.ipcRenderer.invoke("get-patients");
        setPatients(patientList);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to load dashboard data: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

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

  const totalPatients = patients.length;
  const maleCount = patients.filter(p => p.gender === "MALE").length;
  const femaleCount = patients.filter(p => p.gender === "Female").length;

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getAgeGroups = () => {
    const ageGroups = [
      { name: '0-18', count: 0 },
      { name: '19-35', count: 0 },
      { name: '36-50', count: 0 },
      { name: '51-65', count: 0 },
      { name: '65+', count: 0 },
    ];

    patients.forEach(patient => {
      const age = patient.age;
      if (age <= 18) ageGroups[0].count++;
      else if (age <= 35) ageGroups[1].count++;
      else if (age <= 50) ageGroups[2].count++;
      else if (age <= 65) ageGroups[3].count++;
      else ageGroups[4].count++;
    });

    return ageGroups;
  };

  const genderData = [
    { name: 'Male', value: maleCount },
    { name: 'Female', value: femaleCount },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h2 className="stat-title">Total Patients</h2>
          <p className="stat-number">{totalPatients}</p>
          <Link to="/patients" className="link-button">View all patients →</Link>
        </div>
        <div className="stat-card">
          <h2 className="stat-title">Male Patients</h2>
          <p className="stat-number">{maleCount}</p>
          <p className="stat-subtext">
            {totalPatients > 0
              ? `${((maleCount / totalPatients) * 100).toFixed(1)}% of total`
              : 'No patients yet'}
          </p>
        </div>
        <div className="stat-card">
          <h2 className="stat-title">Female Patients</h2>
          <p className="stat-number">{femaleCount}</p>
          <p className="stat-subtext">
            {totalPatients > 0
              ? `${((femaleCount / totalPatients) * 100).toFixed(1)}% of total`
              : 'No patients yet'}
          </p>
        </div>
      </div>

      {totalPatients === 0 ? (
        <div className="no-data-card">
          <h2 className="no-data-title">No patients yet</h2>
          <p className="no-data-text">Start by adding your first patient</p>
          <Link to="/patients/new" className="btn-primary">
            Add New Patient
          </Link>
        </div>
      ) : (
        <>
          <div className="charts-grid">
            <div className="chart-card">
              <h2 className="chart-title">Age Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getAgeGroups()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2 className="chart-title">Gender Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="recent-patients-card">
            <div className="recent-header">
              <h2 className="recent-title">Recently Added Patients</h2>
              <Link to="/patients" className="link-button-small">
                View all patients →
              </Link>
            </div>
            <div className="table-container">
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map(patient => (
                    <tr key={patient.id} className="table-row">
                      <td>{patient.id}</td>
                      <td className="font-medium">{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.gender}</td>
                      <td>
                        <Link to={`/patients/${patient.id}`} className="link-button-small">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
