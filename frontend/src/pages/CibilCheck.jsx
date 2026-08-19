import React, { useState } from "react";
import {
  Gauge,
  Info,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Star,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import "./CibilCheck.css";

const CibilCheck = () => {
  const [score, setScore] = useState("");
  const [checked, setChecked] = useState(false);
  const [isNewToCredit, setIsNewToCredit] = useState(false);

  const parsedScore = isNewToCredit ? 0 : Number(score) || 0;

  const getCibilBand = (s) => {
    if (s === 0) return { label: "New to Credit", color: "#6366f1", bg: "#eef2ff", icon: <Sparkles size={20} /> };
    if (s >= 750) return { label: "Excellent", color: "#10b981", bg: "#ecfdf5", icon: <Star size={20} /> };
    if (s >= 700) return { label: "Good", color: "#22c55e", bg: "#f0fdf4", icon: <TrendingUp size={20} /> };
    if (s >= 650) return { label: "Fair", color: "#f59e0b", bg: "#fffbeb", icon: <AlertTriangle size={20} /> };
    if (s >= 300) return { label: "Poor", color: "#ef4444", bg: "#fef2f2", icon: <ShieldCheck size={20} /> };
    return { label: "Enter Score", color: "#94a3b8", bg: "#f8fafc", icon: <Gauge size={20} /> };
  };

  const cibilBand = getCibilBand(parsedScore);

  const cibilTips = {
    "Excellent": [
      "🎉 Your credit score is excellent! You qualify for the best interest rates.",
      "Maintain timely payments to keep this score.",
      "You may be eligible for premium credit products and higher loan limits.",
      "Avoid closing old credit accounts — account age boosts your score.",
    ],
    "Good": [
      "👍 Your score is good. Small improvements can push it to Excellent.",
      "Keep your credit utilization below 30% of your limit.",
      "Avoid opening too many new credit accounts in a short period.",
      "Continue making all payments on or before due dates.",
    ],
    "Fair": [
      "⚠️ Your score needs improvement. Focus on reducing outstanding debts.",
      "Set up auto-payments to avoid missed deadlines.",
      "Check your credit report for errors and dispute them immediately.",
      "Avoid applying for multiple loans or credit cards simultaneously.",
      "Try to maintain a mix of secured and unsecured credit.",
    ],
    "Poor": [
      "🔴 Your score needs significant improvement before applying for large loans.",
      "Pay off existing debts starting with the highest-interest ones.",
      "Consider a secured credit card to rebuild your credit history.",
      "Avoid multiple loan applications in a short period — each inquiry lowers your score.",
      "Consider debt consolidation if managing multiple EMIs.",
      "Settle any overdue accounts and request 'settled' marks be updated.",
    ],
    "New to Credit": [
      "🆕 You have no credit history yet. This is completely normal for first-time applicants.",
      "Start building credit with a secured credit card or a small personal loan.",
      "Become an authorized user on a family member's credit card.",
      "Pay all utility bills and rent on time — some bureaus now track these.",
      "Your loan evaluation will rely more heavily on income, assets, and employment stability.",
      "Consider starting with an agricultural loan or government-backed scheme if you're a farmer.",
    ],
  };

  const getInterestRange = (s) => {
    if (s === 0) return "14% – 18% (asset-backed)";
    if (s >= 750) return "6% – 9%";
    if (s >= 700) return "9% – 12%";
    if (s >= 650) return "12% – 15%";
    if (s >= 300) return "15% – 20%+";
    return "—";
  };

  const getLoanEligibility = (s) => {
    if (s === 0) return "Limited (secured/govt. schemes)";
    if (s >= 750) return "High — All loan types";
    if (s >= 700) return "Moderate — Most loans";
    if (s >= 650) return "Low — Select loans only";
    if (s >= 300) return "Very Low — May need collateral";
    return "—";
  };

  const handleCheck = (e) => {
    e.preventDefault();
    if (parsedScore >= 0) {
      setChecked(true);
    }
  };

  return (
    <div className="cibil-page">

      {/* HEADER */}
      <div className="cibil-page-header">
        <span>✧ CREDIT HEALTH</span>
        <h1>Check Your CIBIL Score</h1>
        <p>Understand your creditworthiness, loan eligibility, and get personalized tips to improve</p>
      </div>

      {/* INPUT CARD */}
      <div className="cibil-input-card">
        <div className="cibil-input-header">
          <Gauge size={22} />
          <div>
            <h2>Enter Your CIBIL Score</h2>
            <p>Your score ranges from 300 to 900. Check it on CIBIL's official website.</p>
          </div>
        </div>

        <form onSubmit={handleCheck} className="cibil-input-form">
          <div className="cibil-input-row">
            <div className="cibil-score-input-wrapper">
              <input
                type="number"
                min="300"
                max="900"
                value={score}
                onChange={(e) => { setScore(e.target.value); setChecked(false); }}
                placeholder="Enter score (300–900)"
                disabled={isNewToCredit}
                className="cibil-score-input"
              />
            </div>

            <div className="cibil-ntc-checkbox">
              <input
                type="checkbox"
                id="ntcCheck"
                checked={isNewToCredit}
                onChange={(e) => {
                  setIsNewToCredit(e.target.checked);
                  if (e.target.checked) { setScore(""); setChecked(false); }
                }}
              />
              <label htmlFor="ntcCheck">I'm new to credit (no score)</label>
            </div>

            <button type="submit" className="cibil-check-btn">
              <ShieldCheck size={16} />
              Check Score
            </button>
          </div>

          <div className="cibil-official-link">
            <Info size={15} />
            <span>Don't know your CIBIL score?</span>
            <a
              href="https://www.cibil.com/freecibilscore"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check it free on CIBIL's official website →
            </a>
          </div>

        </form>
      </div>


      {/* RESULTS (only after check) */}
      {checked && (
        <>
          {/* GAUGE */}
          <div className="cibil-result-card">
            <div className="cibil-result-top">
              <div className="cibil-score-display" style={{ borderColor: cibilBand.color }}>
                <strong style={{ color: cibilBand.color }}>{isNewToCredit ? "N/A" : parsedScore}</strong>
                <small>out of 900</small>
              </div>
              <div className="cibil-band-info">
                <div className="cibil-band-pill" style={{ backgroundColor: cibilBand.bg, color: cibilBand.color, border: `1.5px solid ${cibilBand.color}30` }}>
                  {cibilBand.icon}
                  <span>{cibilBand.label}</span>
                </div>
              </div>
            </div>

            {/* Gauge Bar */}
            <div className="cibil-gauge-container-page">
              <div className="cibil-gauge-labels">
                <span>300</span>
                <span>650</span>
                <span>700</span>
                <span>750</span>
                <span>900</span>
              </div>
              <div className="cibil-gauge-bar-page">
                <div className="cibil-seg poor"></div>
                <div className="cibil-seg fair"></div>
                <div className="cibil-seg good"></div>
                <div className="cibil-seg excellent"></div>
              </div>
              <div className="cibil-gauge-label-row">
                <span style={{ color: "#ef4444" }}>Poor</span>
                <span style={{ color: "#f59e0b" }}>Fair</span>
                <span style={{ color: "#22c55e" }}>Good</span>
                <span style={{ color: "#10b981" }}>Excellent</span>
              </div>
              {!isNewToCredit && parsedScore >= 300 && (
                <div
                  className="cibil-pointer-page"
                  style={{ left: `${Math.max(1, Math.min(99, ((parsedScore - 300) / 600) * 100))}%` }}
                >
                  <div className="cibil-pointer-dot" style={{ backgroundColor: cibilBand.color }}></div>
                  <div className="cibil-pointer-label" style={{ color: cibilBand.color }}>{parsedScore}</div>
                </div>
              )}
            </div>
          </div>

          {/* ELIGIBILITY CARDS */}
          <div className="cibil-info-grid">
            <div className="cibil-info-item">
              <div className="cibil-info-icon" style={{ background: "#f0eaff", color: "#754ce8" }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <span>Expected Interest Rate</span>
                <strong>{getInterestRange(parsedScore)}</strong>
              </div>
            </div>
            <div className="cibil-info-item">
              <div className="cibil-info-icon" style={{ background: "#eaf9f1", color: "#24a96f" }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <span>Loan Eligibility</span>
                <strong>{getLoanEligibility(parsedScore)}</strong>
              </div>
            </div>
          </div>

          {/* TIPS */}
          <div className="cibil-tips-card">
            <div className="cibil-tips-heading">
              <Info size={18} />
              <h3>{isNewToCredit ? "Getting Started with Credit" : "Tips to Improve Your Score"}</h3>
            </div>
            <ul className="cibil-tips-list">
              {(cibilTips[cibilBand.label] || []).map((tip, idx) => (
                <li key={idx}>
                  <ChevronRight size={14} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

    </div>
  );
};

export default CibilCheck;
