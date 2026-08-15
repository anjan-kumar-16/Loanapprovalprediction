import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewApplication from "./pages/NewApplication";
import Applications from "./pages/Applications";
import Prediction from "./pages/Prediction";
import WhatIf from "./pages/WhatIf";
import Analytics from "./pages/Analytics";
import ModelPerformance from "./pages/ModelPerformance";

import "./App.css";

const ProtectedRoute = ({ children, allowedRoles, authRole }) => {
  if (!authRole) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(authRole)) return <Navigate to="/application" replace />;
  return children;
};

function AppLayout({ authRole, setAuthRole }) {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login";

  return (
    <div className="app">
      {!hideSidebar && <Sidebar authRole={authRole} onLogout={() => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("authToken");
        setAuthRole(null);
      }} />}

      <main className={`main-content ${hideSidebar ? "main-content-home" : ""}`}>
        <Routes>
          <Route path="/" element={<ProtectedRoute authRole={authRole}><Home /></ProtectedRoute>} />
          <Route path="/login" element={<Login setAuthRole={setAuthRole} />} />
          
          <Route path="/application" element={<ProtectedRoute authRole={authRole}><NewApplication /></ProtectedRoute>} />
          <Route path="/prediction" element={<ProtectedRoute authRole={authRole}><Prediction /></ProtectedRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute authRole={authRole}><Dashboard /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute authRole={authRole} allowedRoles={['manager']}><Applications /></ProtectedRoute>} />
          <Route path="/what-if" element={<ProtectedRoute authRole={authRole} allowedRoles={['manager']}><WhatIf /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute authRole={authRole} allowedRoles={['manager']}><Analytics /></ProtectedRoute>} />
          <Route path="/model-performance" element={<ProtectedRoute authRole={authRole} allowedRoles={['manager']}><ModelPerformance /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [authRole, setAuthRole] = useState(localStorage.getItem("userRole"));

  return (
    <BrowserRouter>
      <AppLayout authRole={authRole} setAuthRole={setAuthRole} />
    </BrowserRouter>
  );
}

export default App;