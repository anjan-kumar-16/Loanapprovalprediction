import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

function Sidebar({ authRole, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "New Application",
      path: "/application",
    },
    {
      name: "Applications",
      path: "/applications",
    },
    {
      name: "What If Analysis",
      path: "/what-if",
    },
    {
      name: "Analytics",
      path: "/analytics",
    },
    {
      name: "Model Performance",
      path: "/model-performance",
    },
    {
      name: "CIBIL Check",
      path: "/cibil-check",
    },
    {
      name: "EMI Calculator",
      path: "/emi-calculator",
    },
    {
      name: "Login",
      path: "/login",
    },
  ];

  const filteredMenuItems = authRole === 'manager' 
    ? menuItems.filter(item => ['/', '/dashboard', '/applications', '/what-if', '/analytics', '/model-performance'].includes(item.path))
    : menuItems.filter(item => ['/', '/application', '/cibil-check', '/emi-calculator', '/login'].includes(item.path));

  function handleNavigation() {
    setMobileOpen(false);
  }

  function handleLogout() {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      if (onLogout) onLogout();
      navigate("/");
    }
  }

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() => setMobileOpen(true)}
      >
        Menu
      </button>

      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <button
          className="sidebar-close"
          onClick={() => setMobileOpen(false)}
        >
          Close
        </button>

        <div className="sidebar-logo">
          <h2>
            Loan Approval<br/>Prediction
          </h2>
        </div>

        {authRole === 'manager' && (
          <div className="sidebar-user">
            <strong>Admin User</strong>
            <span>Operations</span>
          </div>
        )}

        <div className="sidebar-title">
          MAIN MENU
        </div>

        <ul className="sidebar-nav">
          {filteredMenuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                end={item.path === "/"}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="sidebar-text">
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {authRole === 'manager' && (
          <div className="sidebar-bottom">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;