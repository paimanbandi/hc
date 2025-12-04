import React, { useState, useEffect } from "react";
import "./ConsentManagement.css";
import { apiService } from "../services/apiService";
import { useWeb3 } from "../hooks/useWeb3";

const ConsentManagement = ({ account }) => {
  const { signMessage } = useWeb3();
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    purpose: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // TODO: Implement fetchConsents function
  useEffect(() => {
    const fetchConsents = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Call apiService.getConsents with appropriate filters
        // TODO: Update consents state
        console.log(filterStatus);
        console.log("Filter status:", filterStatus);
        const data = await apiService.getConsents(
          null, // patientId
          filterStatus !== "all" ? filterStatus : null, // status
        );

        console.log("API Response:", data);
        setConsents(data.consents);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching consents:", err);
      } finally {
        setLoading(false);
      }
    };

    if (account) {
      fetchConsents();
    } else {
      setLoading(false);
      setConsents([]);
    }
  }, [filterStatus, account]);

  // TODO: Implement createConsent function
  // This should:
  // 1. Sign a message using signMessage from useWeb3 hook
  // 2. Call apiService.createConsent with the consent data and signature
  // 3. Refresh the consents list
  const handleCreateConsent = async (e) => {
    e.preventDefault();
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }
    setSubmitting(true);

    try {
      // TODO: Implement consent creation with signature
      // 1. Create a message to sign (e.g., "I consent to: {purpose} for patient: {patientId}")
      const message = `I consent to: ${formData.purpose} for patient: ${formData.patientId}`;

      // 2. Sign the message using signMessage
      const signature = await signMessage(message);
      console.log("signature", signature);

      const consentData = {
        patientId: formData.patientId,
        purpose: formData.purpose,
        walletAddress: account,
        signature: signature,
        message: message,
      };

      // 3. Call apiService.createConsent with patientId, purpose, account, and signature
      await apiService.createConsent(consentData);

      // 4. Refresh consents and reset form
      setFormData({ patientId: "", purpose: "" });
      setShowCreateForm(false);

      console.log("Filter status:", filterStatus);
      const data = await apiService.getConsents(
        null, // patientId
        filterStatus !== "all" ? filterStatus : null, // status
      );

      console.log("API Response:", data);
      setConsents(data.consents);

      alert("Consent created successfully!");
    } catch (err) {
      console.error("Error creating consent:", err);
      alert("Failed to create consent: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // TODO: Implement updateConsentStatus function
  // This should update a consent's status (e.g., from pending to active)
  const handleUpdateStatus = async (consentId, newStatus) => {
    try {
      // TODO: Call apiService.updateConsent to update the status
      const updates = { status: newStatus };

      if (newStatus === "active") {
        const fakeHash = `0x${Math.random().toString(16).substring(2, 42)}${Math.random().toString(16).substring(2, 42)}`;
        updates.blockchainTxHash = fakeHash;
      }

      await apiService.updateConsent(consentId, updates);

      // TODO: Refresh consents list
      console.log("Filter status:", filterStatus);
      const data = await apiService.getConsents(
        null, // patientId
        filterStatus !== "all" ? filterStatus : null, // status
      );
      console.log("API Response:", data);
      setConsents(data.consents);

      alert(`Consent status updated to ${newStatus}`);
    } catch (err) {
      alert("Failed to update consent: " + err.message);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="consent-management-container">
        <div className="loading">Loading consents...</div>
      </div>
    );
  }

  return (
    <div className="consent-management-container">
      <div className="consent-header">
        <h2>Consent Management</h2>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={!account}
        >
          {showCreateForm ? "Cancel" : "Create New Consent"}
        </button>
      </div>

      {!account && (
        <div className="warning">
          Please connect your MetaMask wallet to manage consents
        </div>
      )}

      {error && (
        <div
          className="warning"
          style={{
            background: "#f8d7da",
            borderColor: "#f5c6cb",
            color: "#721c24",
          }}
        >
          Error: {error}
        </div>
      )}

      {showCreateForm && account && (
        <div className="create-consent-form">
          <h3>Create New Consent</h3>
          <form onSubmit={handleCreateConsent}>
            <div className="form-group">
              <label>Patient ID</label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
                required
                placeholder="e.g., patient-001"
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label>Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                required
                disabled={submitting}
              >
                <option value="">Select purpose...</option>
                <option value="Research Study Participation">
                  Research Study Participation
                </option>
                <option value="Data Sharing with Research Institution">
                  Data Sharing with Research Institution
                </option>
                <option value="Third-Party Analytics Access">
                  Third-Party Analytics Access
                </option>
                <option value="Insurance Provider Access">
                  Insurance Provider Access
                </option>
              </select>
            </div>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Signing..." : "Sign & Create Consent"}
            </button>
          </form>
        </div>
      )}

      <div className="consent-filters">
        <button
          className={filterStatus === "all" ? "active" : ""}
          onClick={() => setFilterStatus("all")}
        >
          All
        </button>
        <button
          className={filterStatus === "active" ? "active" : ""}
          onClick={() => setFilterStatus("active")}
        >
          Active
        </button>
        <button
          className={filterStatus === "pending" ? "active" : ""}
          onClick={() => setFilterStatus("pending")}
        >
          Pending
        </button>
      </div>

      {/* TODO: Display consents list */}
      <div className="consents-list">
        {/* Your implementation here */}
        {/* Map through consents and display them */}
        {/* Show: patientId, purpose, status, createdAt, blockchainTxHash */}
        {/* Add buttons to update status for pending consents */}
        {consents.length === 0 ? (
          <div className="placeholder">
            <p>No consents found</p>
            {account && <p>Create a new consent to get started</p>}
          </div>
        ) : (
          consents.map((consent) => (
            <div key={consent.id} className="consent-card">
              <div className="consent-header-info">
                <div className="consent-purpose">{consent.purpose}</div>
                <span className={`consent-status ${consent.status}`}>
                  {consent.status}
                </span>
              </div>

              <div className="consent-details">
                <div className="consent-detail-item">
                  <strong>Patient ID:</strong>
                  <span>{consent.patientId}</span>
                </div>
                <div className="consent-detail-item">
                  <strong>Wallet Address:</strong>
                  <span className="consent-wallet">
                    {consent.walletAddress}
                  </span>
                </div>
                <div className="consent-detail-item">
                  <strong>Created:</strong>
                  <span>{formatDate(consent.createdAt)}</span>
                </div>
                <div className="consent-detail-item">
                  <strong>Transaction:</strong>
                  <span className="consent-tx-hash">
                    {consent.blockchainTxHash}
                  </span>
                </div>
              </div>

              {consent.status === "pending" && (
                <div className="consent-actions">
                  <button
                    className="action-btn primary"
                    onClick={() => handleUpdateStatus(consent.id, "active")}
                  >
                    Activate
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => handleUpdateStatus(consent.id, "revoked")}
                  >
                    Revoke
                  </button>
                </div>
              )}

              {consent.status === "active" && (
                <div className="consent-actions">
                  <button
                    className="action-btn"
                    onClick={() => handleUpdateStatus(consent.id, "revoked")}
                  >
                    Revoke
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsentManagement;
