import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://enterprise-financial-software-solution.onrender.com";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [history, setHistory] = useState([]);
  const name = localStorage.getItem("name") 
    || "User";
  const token = localStorage.getItem("token");
  const headers = { 
    Authorization: `Bearer ${token}` 
  };

  useEffect(() => {
    axios.get(`${API}/account`, { headers })
      .then(r => setAccount(r.data));
    axios.get(`${API}/history`, { headers })
      .then(r => setHistory(r.data));
  }, []);

  const totalDeposits = history
    .filter(t => t.type === "deposit")
    .reduce((s, t) => s + t.amount, 0);

  const totalWithdrawn = history
    .filter(t => t.type === "withdrawal")
    .reduce((s, t) => s + t.amount, 0);

  const totalTransferred = history
    .filter(t => t.type === "transfer")
    .reduce((s, t) => s + t.amount, 0);

  const typeIcon = (type) => {
    if (type === "deposit") return { 
      icon: "↓", 
      bg: "var(--blue-dim)", 
      color: "var(--blue)" 
    };
    if (type === "withdrawal") return { 
      icon: "↑", 
      bg: "var(--red-dim)", 
      color: "var(--red)" 
    };
    return { 
      icon: "⇄", 
      bg: "var(--gold-dim)", 
      color: "var(--gold)" 
    };
  };

  return (
    <div className="page">
      <div className="dashboard-hero">
        <div className="hero-left">
          <div className="hero-greeting">
            Good day,
          </div>
          <div className="hero-name">
            {name}
          </div>
          <div className="hero-account-label">
            Account Number
          </div>
          <div className="hero-account-number">
            {account ? 
              account.account_number : 
              "Loading..."}
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-balance-label">
            Available Balance
          </div>
          <div className="hero-balance">
            <span className="hero-balance-currency">
              ₹
            </span>
            {account ? 
              account.balance.toLocaleString(
                "en-IN", 
                {minimumFractionDigits: 2}
              ) : "—"}
          </div>
          <div className="hero-badge">
            Savings Account · Active
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-label">
              Total Deposited
            </div>
            <div className="stat-icon" 
              style={{background:"var(--blue-dim)",
                color:"var(--blue)"}}>↓
            </div>
          </div>
          <div className="stat-value">
            ₹{totalDeposits.toLocaleString("en-IN")}
          </div>
          <div className="stat-change up">
            All time
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-label">
              Total Withdrawn
            </div>
            <div className="stat-icon"
              style={{background:"var(--red-dim)",
                color:"var(--red)"}}>↑
            </div>
          </div>
          <div className="stat-value">
            ₹{totalWithdrawn.toLocaleString(
              "en-IN")}
          </div>
          <div className="stat-change neutral">
            All time
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-label">
              Total Transferred
            </div>
            <div className="stat-icon"
              style={{background:"var(--gold-dim)",
                color:"var(--gold)"}}>⇄
            </div>
          </div>
          <div className="stat-value">
            ₹{totalTransferred.toLocaleString(
              "en-IN")}
          </div>
          <div className="stat-change neutral">
            All time
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-label">
              Transactions
            </div>
            <div className="stat-icon"
              style={{background:"var(--green-dim)",
                color:"var(--green)"}}>#
            </div>
          </div>
          <div className="stat-value">
            {history.length}
          </div>
          <div className="stat-change up">
            Total records
          </div>
        </div>
      </div>

      <div className="card p-28">
        <div className="section-header">
          <div className="section-title">
            Transaction History
          </div>
          <span className="section-action">
            {history.length} records
          </span>
        </div>

        {history.length === 0 ? (
          <div style={{textAlign:"center",
            padding:"40px",
            color:"var(--muted)",
            fontSize:14}}>
            No transactions yet!
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((t, i) => {
                const style = typeIcon(t.type);
                return (
                  <tr key={i}>
                    <td>
                      <div className="trans-type">
                        <div className="trans-icon"
                          style={{
                            background:style.bg,
                            color:style.color}}>
                          {style.icon}
                        </div>
                        <div>
                          <div className="trans-name">
                            {t.description}
                          </div>
                          <div className="trans-date">
                            {t.type === "transfer" ? 
                              `To: ${t.to}` : 
                              `Ref: ${t.from}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge 
                        badge-${t.type === "deposit" ? 
                        "deposit" : "withdraw"}`}>
                        {t.type.charAt(0)
                          .toUpperCase() + 
                          t.type.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`amount 
                        ${t.type === "deposit" ? 
                        "amount-pos" : "amount-neg"}`}>
                        {t.type === "deposit" ? 
                          "+" : "-"}
                        ₹{t.amount.toLocaleString(
                          "en-IN")}
                      </span>
                    </td>
                    <td style={{color:"var(--muted)",
                      fontSize:13}}>
                      {t.date ? 
                        t.date.slice(0,10) : "—"}
                    </td>
                    <td>
                      <span className="badge 
                        badge-success">
                        Completed
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;