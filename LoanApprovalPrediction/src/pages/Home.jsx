import React from "react";
import { useNavigate } from "react-router-dom";
import { Brain, ArrowRight, ShieldCheck, Activity, BarChart3 } from "lucide-react";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  return (
    <div className="home-standard-page">
      <div className="home-header">
        <div>
          <span className="home-label">WELCOME TO</span>
          <h1>AI Loan Approval System</h1>
          <p>The intelligent way to process and predict loan approvals using Machine Learning.</p>
        </div>
      </div>

      <div className="home-content-body">
        <div className="welcome-card">
          <div className="welcome-icon">
            <Brain size={32} />
          </div>
          <h2>Ready to get started?</h2>
          <p>
            You are logged in as <strong>{role === 'manager' ? 'Manager' : 'Applicant'}</strong>. 
            {role === 'manager' 
              ? " You have full access to view all applications, perform what-if analysis, and review AI model metrics."
              : " You can submit new applications and view your personal AI prediction."}
          </p>
          <div className="welcome-actions">
            {role === 'manager' ? (
              <>
                <button className="btn-primary" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard <ArrowRight size={18} />
                </button>
                <button className="btn-primary" onClick={() => navigate("/application")} style={{ marginLeft: "10px", background: "#f1edff", color: "#6844e8" }}>
                  New Application <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <button className="btn-primary" onClick={() => navigate("/application")}>
                Start New Application <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="home-features-grid">
          <div className="home-feature-item">
            <Activity size={24} className="feature-icon-light" />
            <h3>Real-Time Prediction</h3>
            <p>Instant Random Forest model predictions based on live data.</p>
          </div>
          <div className="home-feature-item">
            <BarChart3 size={24} className="feature-icon-light" />
            <h3>Detailed Analytics</h3>
            <p>Comprehensive overview of applicant statistics and KPIs.</p>
          </div>
          <div className="home-feature-item">
            <ShieldCheck size={24} className="feature-icon-light" />
            <h3>Role-based Access</h3>
            <p>Secure system with distinct applicant and manager views.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
