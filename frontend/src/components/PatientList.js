import React, { useState, useEffect, useCallback, useRef } from "react";
import "./PatientList.css";
import { apiService } from "../services/apiService";

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const containerRef = useRef(null);
  const isInitialMount = useRef(true);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // TODO: Implement the fetchPatients function
  // This function should:
  // 1. Call apiService.getPatients with appropriate parameters (page, limit, search)
  // 2. Update the patients state with the response data
  // 3. Update the pagination state
  // 4. Handle loading and error states
  const fetchPatients = useCallback(async () => {
    const scrollY = window.scrollY;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getPatients(
        currentPage,
        ITEMS_PER_PAGE,
        debouncedSearch,
      );

      setPatients(response.data || response.patients || []);
      setPagination(
        response.pagination || {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
          hasNext: response.hasNext,
          hasPrev: response.hasPrev,
        },
      );
      requestAnimationFrame(() => {
        if (!isInitialMount.current) {
          window.scrollTo(0, scrollY);
        } else {
          isInitialMount.current = false;
        }
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch patients",
      );
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // TODO: Implement search functionality
  // Add a debounce or handle search input changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePatientClick = (patientId) => {
    if (onSelectPatient) {
      onSelectPatient(patientId);
    }
  };

  const handlePreviousPage = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageClick = (e, pageNumber) => {
    e.preventDefault();
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-button ${currentPage === i ? "active" : ""}`}
          onClick={(e) => handlePageClick(e, i)}
          type="button"
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  if (error) {
    return (
      <div className="patient-list-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="patient-list-container" ref={containerRef}>
      <div className="patient-list-header">
        <h2>Patients</h2>
        {/* TODO: Add search input field */}
        <input
          type="text"
          placeholder="Search patients..."
          className="search-input"
          // TODO: Add value, onChange handlers
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* TODO: Implement patient list display */}
      {/* Map through patients and display them */}
      {/* Each patient should be clickable and call onSelectPatient with patient.id */}
      <div
        className="patient-list"
        style={{
          opacity: loading ? 0.5 : 1,
          transition: "opacity 0.2s ease",
          minHeight: "400px",
        }}
      >
        {loading && patients.length === 0 ? (
          <div className="empty-state">
            <p>No patients found</p>
            {debouncedSearch && <p>Try a different search term</p>}
          </div>
        ) : (
          patients.map((patient) => (
            <div
              key={patient.id}
              className="patient-card"
              onClick={() => handlePatientClick(patient.id)}
            >
              <div className="patient-card-header">
                <div>
                  <div className="patient-name">{patient.name}</div>
                  <div className="patient-id">ID: {patient.id}</div>
                </div>
              </div>
              <div className="patient-info">
                {patient.email && (
                  <div className="patient-info-item">{patient.email}</div>
                )}
                {patient.phone && (
                  <div className="patient-info-item">{patient.phone}</div>
                )}
                {patient.dateOfBirth && (
                  <div className="patient-info-item">{patient.dateOfBirth}</div>
                )}
              </div>
              {patient.walletAddress && (
                <div className="patient-wallet">{patient.walletAddress}</div>
              )}
            </div>
          ))
        )}
      </div>
      {/* Show pagination buttons if pagination data is available */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            type="button"
          >
            Previous
          </button>

          {renderPaginationButtons()}

          <button
            className="page-button"
            onClick={handleNextPage}
            disabled={currentPage === pagination.totalPages}
            type="button"
          >
            Next
          </button>

          <div className="pagination-info">
            Page {currentPage} of {pagination.totalPages}
            {pagination.totalItems && ` (${pagination.totalItems} total)`}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
