import React, { useState, useMemo } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Banknote,
  GraduationCap,
  BriefcaseBusiness,
  Users,
  Download,
  Calculator,
  Gauge,
  Info,
  Tractor,
} from "lucide-react";
import "./Prediction.css";

const Prediction = () => {
  const { state } = useLocation();

  if (!state) {
    return <Navigate to="/application" replace />;
  }

  const data = state?.application || {};
  const prediction = state?.predictionResult || {};

  const approved = prediction.loan_status === "Loan Approved";

  const confidence = approved
    ? Math.round((prediction.approval_probability || 0) * 100)
    : Math.round((prediction.rejection_probability || 0) * 100);

  const cibil = Number(data.cibil_score) || 0;
  const isNewToCredit = cibil === 0;
  const isFarmer = data.employment_type === "Farmer";

  const loanAmount = Number(data.loan_amount || 0);
  const income = Number(data.income_annum || 0);

  const formatMoney = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // --- CIBIL Score Check ---
  const getCibilBand = (score) => {
    if (score === 0) return { label: "New to Credit", color: "#6366f1", bg: "#eef2ff", percent: 5 };
    if (score >= 750) return { label: "Excellent", color: "#10b981", bg: "#ecfdf5", percent: (score / 900) * 100 };
    if (score >= 700) return { label: "Good", color: "#22c55e", bg: "#f0fdf4", percent: (score / 900) * 100 };
    if (score >= 650) return { label: "Fair", color: "#f59e0b", bg: "#fffbeb", percent: (score / 900) * 100 };
    if (score >= 300) return { label: "Poor", color: "#ef4444", bg: "#fef2f2", percent: (score / 900) * 100 };
    return { label: "Invalid", color: "#94a3b8", bg: "#f8fafc", percent: 0 };
  };

  const cibilBand = getCibilBand(cibil);

  const cibilTips = {
    "Excellent": [
      "Your credit score is excellent! You qualify for the best interest rates.",
      "Maintain timely payments to keep this score.",
      "You may be eligible for premium credit products.",
    ],
    "Good": [
      "Your score is good. Small improvements can push it to Excellent.",
      "Keep your credit utilization below 30%.",
      "Avoid opening too many new credit accounts.",
    ],
    "Fair": [
      "Your score needs improvement. Focus on reducing outstanding debts.",
      "Set up auto-payments to avoid missed deadlines.",
      "Check your credit report for errors and dispute them.",
    ],
    "Poor": [
      "Your score needs significant improvement before applying for large loans.",
      "Pay off existing debts starting with the highest-interest ones.",
      "Consider a secured credit card to rebuild your credit history.",
      "Avoid multiple loan applications in a short period.",
    ],
    "New to Credit": [
      "You have no credit history yet. This is normal for first-time applicants.",
      "Start building credit with a secured credit card or a small personal loan.",
      "Become an authorized user on a family member's credit card.",
      "Pay all utility bills on time — some bureaus track these.",
      "Your loan evaluation will rely more heavily on income and assets.",
    ],
  };


  // --- Employment display ---
  const getEmploymentLabel = (type) => {
    if (type === "Farmer") return "Farmer / Agricultural";
    if (type === "Employed") return "Employed";
    return "Unemployed";
  };

  return (
    <div className="prediction-page">

      {/* HEADER */}

      <div className="prediction-header">

        <Link to="/application" className="back-link">
          <ArrowLeft size={18} />
          Back to Application
        </Link>

        <div className="prediction-heading">
          <span>✧ AI PREDICTION ENGINE</span>

          <h1>Loan Eligibility Result</h1>

          <p>
            Our prediction system analyzed the applicant's financial
            and credit profile.
          </p>
        </div>

        <div className="application-id">
          <span>APPLICATION ID</span>
          <strong>
            LOAN-{Date.now()}
          </strong>
        </div>

      </div>

      {/* RESULT CARD */}

      <div className={`prediction-result-card ${approved ? "approved" : "rejected"}`}>

        <div className="result-icon">
          {approved ? (
            <CheckCircle2 size={34} />
          ) : (
            <ShieldCheck size={34} />
          )}
        </div>

        <div className="result-label">
          PREDICTION RESULT
        </div>

        <h2>
          {approved ? "Loan Approved" : "Loan Rejected"}
        </h2>

        <p className="result-description">
          {approved
            ? "The applicant has a favorable profile based on the analyzed financial and credit information."
            : "The applicant profile requires further review based on the analyzed financial and credit information."}
        </p>

        <div className="confidence-box">
          <strong>{confidence}%</strong>
          <span>Confidence</span>
        </div>

      </div>

      {/* METRICS */}

      <div className="prediction-metrics">

        <div className="prediction-metric">

          <div className="metric-icon purple">
            <ShieldCheck size={21} />
          </div>

          <div>
            <span>CIBIL Score</span>
            <strong>{isNewToCredit ? "N/A" : cibil}</strong>
            <small>
              {cibilBand.label}
            </small>
          </div>

        </div>

        <div className="prediction-metric">

          <div className="metric-icon green">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>Risk Level</span>
            <strong>{approved ? "Low Risk" : "High Risk"}</strong>
            <small>Profile assessment</small>
          </div>

        </div>

        <div className="prediction-metric">

          <div className="metric-icon blue">
            <Wallet size={21} />
          </div>

          <div>
            <span>Loan Amount</span>
            <strong>{formatMoney(loanAmount)}</strong>
            <small>Requested amount</small>
          </div>

        </div>

        <div className="prediction-metric">

          <div className="metric-icon orange">
            <Banknote size={21} />
          </div>

          <div>
            <span>Annual Income</span>
            <strong>{formatMoney(income)}</strong>
            <small>Applicant income</small>
          </div>

        </div>

      </div>

      {/* AI EXPLAINABILITY */}
      {prediction.reasons_for_decision && prediction.reasons_for_decision.length > 0 && (
        <div className="applicant-details-card" style={{ marginBottom: "2rem", marginTop: "2rem" }}>
          <div className="details-header">
            <div>
              <h2>Why was this decision made?</h2>
              <p>Key factors contributing to the AI prediction</p>
            </div>
          </div>
          <div style={{ padding: "0 1.5rem 1.5rem" }}>
            <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8", margin: 0 }}>
              {prediction.reasons_for_decision.map((reason, idx) => (
                <li key={idx} style={{ color: "#475569" }}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* DYNAMIC LOAN TERMS (IF APPROVED) */}
      {approved && prediction.interest_rate && (
        <div className="prediction-metrics" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <div className="prediction-metric">
            <div className="metric-icon purple">
              <TrendingUp size={21} />
            </div>
            <div>
              <span>Interest Rate</span>
              <strong>{prediction.interest_rate}%</strong>
              <small>Dynamic rate based on risk</small>
            </div>
          </div>
          <div className="prediction-metric">
            <div className="metric-icon green">
              <Banknote size={21} />
            </div>
            <div>
              <span>Estimated EMI</span>
              <strong>{formatMoney(prediction.estimated_emi)}</strong>
              <small>Monthly payment</small>
            </div>
          </div>
        </div>
      )}

      {/* SUGGESTIONS (IF REJECTED) */}
      {!approved && prediction.improvement_suggestions && prediction.improvement_suggestions.length > 0 && (
        <div className="applicant-details-card" style={{ marginBottom: "2rem", marginTop: "2rem", borderLeft: "4px solid #f59e0b" }}>
          <div className="details-header">
            <div>
              <h2>How to improve your chances</h2>
              <p>Actionable steps to get approved next time</p>
            </div>
          </div>
          <div style={{ padding: "0 1.5rem 1.5rem" }}>
            <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.8", margin: 0 }}>
              {prediction.improvement_suggestions.map((suggestion, idx) => (
                <li key={idx} style={{ color: "#475569" }}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}


      {/* ========================================
          EXTERNAL TOOLS
          ======================================== */}

      <div className="applicant-details-card" style={{ marginBottom: "2rem" }}>
        <div className="details-header">
          <div>
            <h2>Financial Tools</h2>
            <p>Explore more about your credit health and plan payments</p>
          </div>
        </div>

        <div className="details-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          
          <Link to="/cibil-check" className="detail-item" style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <div className="metric-icon purple" style={{ width: 42, height: 42, borderRadius: 12 }}>
              <Gauge size={22} />
            </div>
            <div style={{ flex: 1, paddingLeft: '4px' }}>
              <span style={{ fontSize: '10px', color: '#8792a5', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: 600 }}>Credit Health</span>
              <strong style={{ display: 'block', marginTop: '3px', fontSize: '15px', color: '#25344f', fontWeight: 800 }}>Check CIBIL Score</strong>
            </div>
            <div style={{ color: '#754ce8' }}>
               <ArrowRight size={20} />
            </div>
          </Link>

          <Link to="/emi-calculator" className="detail-item" style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <div className="metric-icon blue" style={{ width: 42, height: 42, borderRadius: 12 }}>
              <Calculator size={22} />
            </div>
            <div style={{ flex: 1, paddingLeft: '4px' }}>
              <span style={{ fontSize: '10px', color: '#8792a5', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: 600 }}>Plan Payments</span>
              <strong style={{ display: 'block', marginTop: '3px', fontSize: '15px', color: '#25344f', fontWeight: 800 }}>EMI Calculator</strong>
            </div>
            <div style={{ color: '#4d8df5' }}>
               <ArrowRight size={20} />
            </div>
          </Link>

        </div>
      </div>


      {/* APPLICANT DETAILS */}

      <div className="applicant-details-card">

        <div className="details-header">
          <div>
            <h2>Applicant Profile</h2>
            <p>Key information used for prediction</p>
          </div>
        </div>

        <div className="details-grid">

          <div className="detail-item">
            <div className="detail-icon">
              <GraduationCap size={19} />
            </div>

            <div>
              <span>Education</span>
              <strong>{data.education || "Graduate"}</strong>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              {isFarmer ? <Tractor size={19} /> : <BriefcaseBusiness size={19} />}
            </div>

            <div>
              <span>Employment</span>
              <strong>
                {getEmploymentLabel(data.employment_type)}
              </strong>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Users size={19} />
            </div>

            <div>
              <span>Dependents</span>
              <strong>{data.no_of_dependents || "0"}</strong>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <span>Loan Term</span>
              <strong>{data.loan_term || "0"} Years</strong>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div className="prediction-footer">

        <Link to="/application" className="secondary-button">
          <ArrowLeft size={16} />
          New Application
        </Link>

        <button onClick={() => window.print()} className="primary-button" style={{ marginLeft: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Download size={16} />
          Download Report
        </button>

      </div>

    </div>
  );
};

export default Prediction;