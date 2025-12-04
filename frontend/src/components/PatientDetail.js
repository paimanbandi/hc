import React, { useState, useEffect, useCallback } from "react";
import "./PatientDetail.css";
import { apiService } from "../services/apiService";
import {
  Calendar,
  Stethoscope,
  Building2,
  CheckCircle,
  Clock,
} from "lucide-react";

const PatientDetail = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implement fetchPatientData function
  // This should fetch both patient details and their records
  const fetchPatientData = useCallback(async () => {
    if (!patientId) {
      setError("No patient ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Fetch patient data using apiService.getPatient(patientId)
      // TODO: Fetch patient records using apiService.getPatientRecords(patientId)
      // TODO: Update state with fetched data
      const [patientResponse, recordsResponse] = await Promise.all([
        apiService.getPatient(patientId),
        apiService.getPatientRecords(patientId),
      ]);

      setPatient(patientResponse.data || patientResponse);

      const recordsData =
        recordsResponse.data || recordsResponse.records || recordsResponse;
      setRecords(Array.isArray(recordsData) ? recordsData : []);
    } catch (err) {
      console.error("Error fetching patient data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load patient details",
      );
      setPatient(null);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getRecordTypeClass = (type) => {
    if (!type) return "";
    const typeMap = {
      diagnostic: "diagnostic",
      treatment: "treatment",
      lab: "lab",
      laboratory: "lab",
      prescription: "treatment",
      imaging: "diagnostic",
    };
    return typeMap[type.toLowerCase()] || "diagnostic";
  };

  const handleRetry = () => {
    fetchPatientData();
  };

  if (loading) {
    return (
      <div className="patient-detail-container">
        <div className="loading">Loading patient details...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="patient-detail-container">
        <div className="patient-detail-header">
          <button onClick={onBack} className="back-btn">
            ← Back to List
          </button>
        </div>
        <div className="error">
          <p>Error loading patient: {error || "Patient not found"}</p>
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-detail-container">
      <div className="patient-detail-header">
        <button onClick={onBack} className="back-btn">
          ← Back to List
        </button>
      </div>

      <div className="patient-detail-content">
        {/* TODO: Display patient information */}
        {/* Show: name, email, dateOfBirth, gender, phone, address, walletAddress */}
        <div className="patient-info-section">
          <h2>Patient Information</h2>
          {/* Your implementation here */}
          <div className="patient-info-grid">
            <div className="info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">{patient.name || "N/A"}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Patient ID</span>
              <span className="info-value">{patient.id || "N/A"}</span>
            </div>

            {patient.email && (
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{patient.email}</span>
              </div>
            )}

            {patient.phone && (
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{patient.phone}</span>
              </div>
            )}

            {patient.dateOfBirth && (
              <div className="info-item">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">
                  {formatDate(patient.dateOfBirth)}
                </span>
              </div>
            )}

            {patient.gender && (
              <div className="info-item">
                <span className="info-label">Gender</span>
                <span className="info-value">{patient.gender}</span>
              </div>
            )}

            {patient.address && (
              <div className="info-item">
                <span className="info-label">Address</span>
                <span className="info-value">{patient.address}</span>
              </div>
            )}

            {patient.walletAddress && (
              <div className="info-item">
                <span className="info-label">Wallet Address</span>
                <span className="info-value wallet">
                  {patient.walletAddress}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* TODO: Display patient records */}
        {/* Show list of medical records with: type, title, date, doctor, hospital, status */}
        <div className="patient-records-section">
          <h2>Medical Records ({records.length})</h2>
          {/* Your implementation here */}
          {records.length === 0 ? (
            <div className="placeholder">
              <p>No medical records found for this patient</p>
            </div>
          ) : (
            <div className="records-list">
              {records.map((record) => (
                <div key={record.id || record._id} className="record-card">
                  <div className="record-header">
                    <h3 className="record-title">
                      {record.title || record.name || "Untitled Record"}
                    </h3>
                    {record.type && (
                      <span
                        className={`record-type ${getRecordTypeClass(record.type)}`}
                      >
                        {record.type}
                      </span>
                    )}
                  </div>
                  {record.description && (
                    <p className="record-description">{record.description}</p>
                  )}
                  <div className="record-meta">
                    {record.date && (
                      <div className="record-meta-item">
                        <Calendar size={16} />
                        <span>{formatDate(record.date)}</span>
                      </div>
                    )}

                    {record.doctor && (
                      <div className="record-meta-item">
                        <Stethoscope size={16} />
                        <span>Dr. {record.doctor}</span>
                      </div>
                    )}

                    {record.hospital && (
                      <div className="record-meta-item">
                        <Building2 size={16} />
                        <span>{record.hospital}</span>
                      </div>
                    )}

                    {record.status && (
                      <div className="record-meta-item">
                        <span
                          className={`record-status ${record.status.toLowerCase()}`}
                        >
                          {record.status === "verified" && (
                            <CheckCircle
                              size={14}
                              style={{ display: "inline", marginRight: "4px" }}
                            />
                          )}
                          {record.status === "pending" && (
                            <Clock
                              size={14}
                              style={{ display: "inline", marginRight: "4px" }}
                            />
                          )}
                          {record.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
