import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://enterprise-financial-backend.onrender.com";

function Transfer() {
  const [action, setAction] = 
    useState("deposit");
  const [amount, setAmount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0);
  const token = localStorage.getItem("token");
  const headers = { 
    Authorization: `Bearer ${token}` 
  };

  useEffect(() => {
    axios.get(`${API}/account`, { headers })
      .then(r => setBalance(r.data.balance));
  }, []);

  const handleSubmit = () => {
    setMessage("");
    setError("");
    const data = action === "transfer" ? 
      { amount: parseFloat(amount), 
        to_account: toAccount } :
      { amount: parseFloat(amount) };

    axios.post(`${API}/${action}`, 
      data, { headers })
      .then(res => {
        setMessage(res.data.message);
        setBalance(res.data.new_balance);
        setAmount("");
      })
      .catch(err => setError(
        err.response?.data?.error || 
        "Error occurred"));
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="page">
      <div className="transfer-layout">
        <div className="card p-28">
          <div className="action-tabs">
            {["deposit","withdraw","transfer"]
              .map(a => (
              <button key={a}
                className={`action-tab 
                  ${action === a ? "active" : ""}`}
                onClick={() => {
                  setAction(a);
                  setMessage("");
                  setError("");
                }}>
                {a === "deposit" ? "⬆ Deposit" :
                  a === "withdraw" ? 
                  "⬇ Withdraw" : "⇄ Transfer"}
              </button>
            ))}
          </div>

          <label className="amount-label">
            Amount
          </label>
          <div className="amount-field-inner">
            <span className="amount-currency">
              ₹
            </span>
            <input
              className="amount-input"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => 
                setAmount(e.target.value)}
            />
          </div>

          <div className="quick-amounts">
            {quickAmounts.map(q => (
              <button key={q}
                className="quick-amount-btn"
                onClick={() => 
                  setAmount(q.toString())}>
                ₹{q.toLocaleString("en-IN")}
              </button>
            ))}
          </div>

          {action === "transfer" && (
            <div className="form-group">
              <label className="form-label">
                To Account Number
              </label>
              <input
                className="form-input"
                placeholder="Enter account number"
                value={toAccount}
                onChange={e => 
                  setToAccount(e.target.value)}
              />
            </div>
          )}

          <button
            className={`btn-action 
              btn-${action}`}
            onClick={handleSubmit}>
            {action === "deposit" ? 
              "⬆ Deposit Money" :
              action === "withdraw" ? 
              "⬇ Withdraw Money" : 
              "⇄ Transfer Money"}
          </button>

          {message && (
            <div className="form-success"
              style={{marginTop:16}}>
              ✓ {message}
            </div>
          )}
          {error && (
            <div className="form-error"
              style={{marginTop:16}}>
              ⚠ {error}
            </div>
          )}
        </div>

        <div>
          <div className="balance-card">
            <div className="balance-card-label">
              Current Balance
            </div>
            <div className="balance-card-amount">
              <span>₹</span>
              {balance.toLocaleString("en-IN",
                {minimumFractionDigits:2})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transfer;