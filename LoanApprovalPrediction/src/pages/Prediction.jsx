import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Banknote,
  GraduationCap,
  BriefcaseBusiness,
  Users,
} from "lucide-react";
import "./Prediction.css";

const Prediction = () => {
  const { state } = useLocation();

  const data = state?.application || {};
  const prediction = state?.predictionResult || {};

  const approved = prediction.loan_status === "Loan Approved";

  const confidence = approved 
    ? Math.round((prediction.approval_probability || 0) * 100) 
    : Math.round((prediction.rejection_probability || 0) * 100);

  const cibil = data.cibil_score || 0;

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
            <strong>{cibil}</strong>
            <small>
              {cibil >= 750
                ? "Excellent"
                : cibil >= 700
                ? "Good"
                : "Needs Improvement"}
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
              <BriefcaseBusiness size={19} />
            </div>

            <div>
              <span>Employment</span>
              <strong>
                {data.self_employed === "Yes" ? "Self Employed" : "Salaried"}
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

        <Link to="/dashboard" className="primary-button">
          View Dashboard
        </Link>

      </div>

    </div>
  );
};

export default Prediction;