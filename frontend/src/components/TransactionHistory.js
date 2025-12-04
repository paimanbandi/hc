import React, { useState, useEffect } from "react";
import "./TransactionHistory.css";
import { apiService } from "../services/apiService";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  AlertTriangle,
  TrendingUp,
  Wallet,
} from "lucide-react";

const TransactionHistory = ({ account }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implement fetchTransactions function
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // TODO: Call apiService.getTransactions with account address if available
        console.log(account);
        const response = await apiService.getTransactions(account || null);

        // TODO: Update transactions state
        setTransactions(response.transactions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [account]);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatDate = (timestamp) => {
    // TODO: Format the timestamp to a readable date
    if (!timestamp) return "N/A";

    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (err) {
      return timestamp;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle2 size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "failed":
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const renderTransactionCard = (transaction) => {
    return (
      <div key={transaction.id} className="transaction-card">
        <div className="transaction-header-info">
          <span className={`transaction-type ${transaction.type}`}>
            {transaction.type?.replace("_", " ")}
          </span>
          <span className={`transaction-status ${transaction.status}`}>
            <span className="status-icon">
              {getStatusIcon(transaction.status)}
            </span>
            {transaction.status}
          </span>
        </div>

        <div className="transaction-details">
          <div className="transaction-detail-item">
            <span className="transaction-detail-label">From</span>
            <span
              className="transaction-detail-value address"
              title={transaction.from}
            >
              {formatAddress(transaction.from)}
            </span>
          </div>

          <div className="transaction-detail-item">
            <span className="transaction-detail-label">To</span>
            <span
              className="transaction-detail-value address"
              title={transaction.to}
            >
              {formatAddress(transaction.to)}
            </span>
          </div>

          <div className="transaction-detail-item">
            <span className="transaction-detail-label">Amount</span>
            <span className="transaction-detail-value transaction-amount">
              {transaction.amount} {transaction.currency}
            </span>
          </div>

          <div className="transaction-detail-item">
            <span className="transaction-detail-label">Timestamp</span>
            <span className="transaction-detail-value transaction-timestamp">
              {formatDate(transaction.timestamp)}
            </span>
          </div>
        </div>

        {transaction.blockchainTxHash && (
          <div className="transaction-detail-item">
            <span className="transaction-detail-label">Transaction Hash</span>
            <span
              className="transaction-detail-value hash"
              title={transaction.blockchainTxHash}
            >
              {transaction.blockchainTxHash}
            </span>
          </div>
        )}

        {transaction.blockNumber && (
          <div className="transaction-detail-item">
            <span className="transaction-detail-label">Block Number</span>
            <span className="transaction-detail-value">
              #{transaction.blockNumber}
            </span>
          </div>
        )}

        {transaction.gasUsed && (
          <div className="transaction-detail-item">
            <span className="transaction-detail-label">Gas Used</span>
            <span className="transaction-detail-value">
              {transaction.gasUsed} wei
            </span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="loading">
          <Loader2 className="loading-spinner" size={48} />
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-container">
        <div className="error">
          <AlertTriangle size={48} color="#c62828" />
          <h3>Error Loading Transactions</h3>
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <h2>Transaction History</h2>
        {account && (
          <div className="wallet-filter">
            <Wallet size={16} />
            <span> Filtering for: {formatAddress(account)}</span>
          </div>
        )}
      </div>

      {/* TODO: Display transactions list */}
      {/* Show: type, from, to, amount, currency, status, timestamp, blockchainTxHash */}
      <div className="transactions-list">
        {/* Your implementation here */}
        {transactions.length === 0 ? (
          <div className="placeholder">
            <TrendingUp size={64} color="#999" className="placeholder-icon" />
            <h3>No Transactions Found</h3>
            <p>
              {account
                ? "No transactions found for this wallet address."
                : "Connect your wallet to view your transactions."}
            </p>
          </div>
        ) : (
          <div className="transactions-list">
            <div className="transactions-summary">
              <p>
                Showing {transactions.length} transaction
                {transactions.length !== 1 ? "s" : ""}
              </p>
            </div>
            {transactions.map(renderTransactionCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
