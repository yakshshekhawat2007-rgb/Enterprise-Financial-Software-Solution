import { useState } from "react";
import axios from "axios";

const API = "https://enterprise-financial-software-solution.onrender.com";

function Login({ setToken }) {
  const [isRegister, setIsRegister] = 
    useState(false);
  const [form, setForm] = useState({ 
    name: "", email: "", password: "" 
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setError("");
    setMessage("");
    const url = isRegister ? 
      `${API}/register` : `${API}/login`;
    axios.post(url, form)
      .then(res => {
        if (isRegister) {
          setMessage(`Account created! 
            Number: ${res.data.account_number}`);
          setIsRegister(false);
        } else {
          localStorage.setItem(
            "token", res.data.token);
          localStorage.setItem(
            "name", res.data.name);
          setToken(res.data.token);
        }
      })
      .catch(err => setError(
        err.response?.data?.error || 
        "Something went wrong"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-brand">
          <span className="brand-icon">◈</span>
          <span style={{color:"white",
            fontFamily:"Syne,sans-serif",
            fontWeight:700,fontSize:18}}>
            FinVault
          </span>
          <span className="brand-tag">
            ENTERPRISE
          </span>
        </div>
        <div>
          <div className="login-left-tagline">
            Enterprise<br />
            <span>Financial</span><br />
            Software<br />
            Solution
          </div>
        </div>
        <div className="login-left-stats">
          <div className="login-stat">
            <div className="login-stat-value">
              99.9%
            </div>
            <div className="login-stat-label">
              Uptime guarantee
            </div>
          </div>
          <div className="login-stat">
            <div className="login-stat-value">
              256-bit
            </div>
            <div className="login-stat-label">
              SSL Encryption
            </div>
          </div>
          <div className="login-stat">
            <div className="login-stat-value">
              24/7
            </div>
            <div className="login-stat-label">
              System monitoring
            </div>
          </div>
          <div className="login-stat">
            <div className="login-stat-value">
              JWT
            </div>
            <div className="login-stat-label">
              Secure auth tokens
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-form-title">
            {isRegister ? 
              "Open an account" : 
              "Welcome back"}
          </div>
          <div className="login-form-sub">
            {isRegister
              ? "Create your enterprise account"
              : "Sign in to your FinVault account"}
          </div>

          {isRegister && (
            <div className="form-group">
              <label className="form-label">
                Full name
              </label>
              <input
                className="form-input"
                placeholder="Yaksh Shekhawat"
                value={form.name}
                onChange={e => setForm({ 
                  ...form, name: e.target.value 
                })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Email address
            </label>
            <input
              className="form-input"
              type="email"
              placeholder="yaksh@example.com"
              value={form.email}
              onChange={e => setForm({ 
                ...form, email: e.target.value 
              })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
            </label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ 
                ...form, password: e.target.value 
              })}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handle}
            disabled={loading}>
            {loading ? "Please wait..." : 
              isRegister ? 
              "Create account →" : "Sign in →"}
          </button>

          {error && (
            <div className="form-error">
              ⚠ {error}
            </div>
          )}
          {message && (
            <div className="form-success">
              ✓ {message}
            </div>
          )}

          <div className="form-switch">
            {isRegister ? 
              "Already have an account? " : 
              "Don't have an account? "}
            <span onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setMessage("");
            }}>
              {isRegister ? 
                "Sign in" : "Create one"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;