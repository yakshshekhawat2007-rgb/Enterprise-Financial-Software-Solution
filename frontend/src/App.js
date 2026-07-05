import { useState } from "react";
import { BrowserRouter, Routes,
  Route, Link, useLocation }
  from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Transfer from "./components/Transfer";
import Account from "./components/Account";
import "./App.css";

function Navbar({ onLogout }) {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-name">
          FinVault
        </span>
        <span className="brand-tag">
          ENTERPRISE
        </span>
      </div>
      <div className="navbar-links">
        <Link to="/"
          className={`nav-link
          ${location.pathname === "/" ?
          "active" : ""}`}>
          Dashboard
        </Link>
        <Link to="/transfer"
          className={`nav-link
          ${location.pathname === "/transfer" ?
          "active" : ""}`}>
          Transactions
        </Link>
        <Link to="/account"
          className={`nav-link
          ${location.pathname === "/account" ?
          "active" : ""}`}>
          Account
        </Link>
      </div>
      <button className="logout-btn"
        onClick={onLogout}>
        Sign out
      </button>
    </nav>
  );
}

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  };

  if (!token) return (
    <Login setToken={setToken} />
  );

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar onLogout={handleLogout} />
        <main className="app-main">
          <Routes>
            <Route path="/"
              element={<Dashboard />} />
            <Route path="/transfer"
              element={<Transfer />} />
            <Route path="/account"
              element={<Account />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;