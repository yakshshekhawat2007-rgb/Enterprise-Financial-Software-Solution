import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://enterprise-financial-software-solution.onrender.com";

function Account() {
  const [account, setAccount] = useState(null);
  const name = localStorage.getItem("name") 
    || "User";
  const token = localStorage.getItem("token");
  const headers = { 
    Authorization: `Bearer ${token}` 
  };

  useEffect(() => {
    axios.get(`${API}/account`, { headers })
      .then(r => setAccount(r.data));
  }, []);

  return (
    <div className="page">
      <div className="account-card-visual">
        <div className="card-top">
          <div className="card-chip"></div>
          <div className="card-logo">
            Fin<span>Vault</span>
          </div>
        </div>
        <div className="card-number">
          {account ? 
            account.account_number
              .replace(/(\d{4})(?=\d)/g, "$1 ") : 
            "**** **** ****"}
        </div>
        <div className="card-bottom">
          <div>
            <div className="card-holder-label">
              Account Holder
            </div>
            <div className="card-holder-name">
              {name}
            </div>
          </div>
          <div className="card-balance">
            <div className="card-balance-label">
              Balance
            </div>
            <div className="card-balance-amount">
              <span>₹</span>
              {account ? 
                account.balance.toLocaleString(
                  "en-IN") : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <div className="detail-label">
            Account Number
          </div>
          <div className="detail-value">
            {account ? 
              account.account_number : "—"}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-label">
            Account Type
          </div>
          <div className="detail-value normal">
            {account ? 
              account.account_type : "—"}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-label">
            Account Holder
          </div>
          <div className="detail-value normal">
            {name}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-label">
            Status
          </div>
          <div className="detail-value">
            <span className="status-dot">
              Active
            </span>
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-label">
            Current Balance
          </div>
          <div className="detail-value">
            ₹{account ? 
              account.balance.toLocaleString(
                "en-IN") : "—"}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-label">
            Security
          </div>
          <div className="detail-value normal">
            JWT Encrypted
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;