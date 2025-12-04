import React, { useState, useEffect } from "react";
import "./StatsDashboard.css";
import { apiService } from "../services/apiService";

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implement fetchStats function
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // TODO: Call apiService.getStats()
        // TODO: Update stats state
        const data = await apiService.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-dashboard-container">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    apiService
      .getStats()
      .then((data) => {
        setStats(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch statistics");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (error || !stats) {
    return (
      <div className="stats-dashboard-container">
        <div className="error">
          <p>Error loading statistics: {error || "No data available"}</p>
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-dashboard-container">
      <h2>Platform Statistics</h2>

      {/* TODO: Display statistics in a nice grid layout */}
      {/* Show: totalPatients, totalRecords, totalConsents, activeConsents, pendingConsents, totalTransactions */}
      <div className="stats-grid">
        {/* Your implementation here */}
        <div className="stat-card primary">
          <div className="stat-label">Total Patients</div>
          <div className="stat-value">{stats.totalPatients || 0}</div>
          <div className="stat-description">Registered in the system</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Health Records</div>
          <div className="stat-value">{stats.totalRecords || 0}</div>
          <div className="stat-description">Total medical records</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Consents</div>
          <div className="stat-value">{stats.totalConsents || 0}</div>
          <div className="stat-description">All consent requests</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Active Consents</div>
          <div className="stat-value">{stats.activeConsents || 0}</div>
          <div className="stat-description">Currently active</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Pending Consents</div>
          <div className="stat-value">{stats.pendingConsents || 0}</div>
          <div className="stat-description">Awaiting approval</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Blockchain Transactions</div>
          <div className="stat-value">{stats.totalTransactions || 0}</div>
          <div className="stat-description">Total on-chain records</div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
