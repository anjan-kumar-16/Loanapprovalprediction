import {
  Activity,
  BarChart3,
  BrainCircuit,
  FilePlus2,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  X,
} from "lucide-react";

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
      icon: <Home size={16} />,
    },

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={16} />,
    },

    {
      name: "New Application",
      path: "/application",
      icon: <FilePlus2 size={16} />,
    },

    {
      name: "Applications",
      path: "/applications",
      icon: <FileText size={16} />,
    },

    {
      name: "Prediction",
      path: "/prediction",
      icon: <BrainCircuit size={16} />,
    },

    {
      name: "What-If Analysis",
      path: "/what-if",
      icon: <Sparkles size={16} />,
    },

    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 size={16} />,
    },

    {
      name: "Model Performance",
      path: "/model-performance",
      icon: <Activity size={16} />,
    },

    {
      name: "Logout",
      path: "#logout",
      icon: <LogOut size={16} />,
      onClick: handleLogout,
    },

  ];

  const filteredMenuItems = authRole === 'applicant' 
    ? menuItems.filter(item => ['/', '/dashboard', '/application', '/prediction', '#logout'].includes(item.path))
    : menuItems;

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

      {/* MOBILE BUTTON */}

      <button
        className="mobile-menu-button"
        onClick={() =>
          setMobileOpen(true)
        }
      >

        <Menu size={20} />

      </button>


      {/* OVERLAY */}

      {mobileOpen && (

        <div
          className="sidebar-overlay"
          onClick={() =>
            setMobileOpen(false)
          }
        />

      )}


      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          mobileOpen
            ? "sidebar-open"
            : ""
        }`}
      >


        {/* CLOSE */}

        <button
          className="sidebar-close"
          onClick={() =>
            setMobileOpen(false)
          }
        >

          <X size={18} />

        </button>


        {/* LOGO */}

        <div className="sidebar-logo">

          <div className="logo-mark">

            <BrainCircuit size={20} />

          </div>

          <div>

            <h2>
              Loan<span>AI</span>
            </h2>

            <p>
              SMART PREDICTION
            </p>

          </div>

        </div>


        {/* USER */}

        <div className="sidebar-user">

          <div className="user-avatar">
            AI
          </div>

          <div>

            <strong>
              Loan Analyst
            </strong>

            <span>
              Prediction Center
            </span>

          </div>

        </div>


        {/* MENU TITLE */}

        <div className="sidebar-title">
          MAIN MENU
        </div>


        {/* NAVIGATION */}

        <ul className="sidebar-nav">
          {filteredMenuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path !== "#logout" ? item.path : "#"}
                end={item.path === "/"}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  } else {
                    handleNavigation();
                  }
                }}
                className={({ isActive }) =>
                  `sidebar-link ${isActive && item.path !== "#logout" ? "active" : ""}`
                }
              >
                <span className="sidebar-icon">
                  {item.icon}
                </span>
                <span className="sidebar-text">
                  {item.name}
                </span>
                {item.path !== "#logout" && (
                  <span className="sidebar-arrow">
                    →
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>


        {/* BOTTOM */}

        <div className="sidebar-bottom">


          {/* AI STATUS */}

          <div className="ai-status">

            <div className="ai-status-icon">

              <BrainCircuit size={14} />

            </div>

            <div>

              <strong>
                AI Engine
              </strong>

              <span>

                <i />

                Online

              </span>

            </div>

          </div>


        </div>

      </aside>

    </>

  );
}


export default Sidebar;