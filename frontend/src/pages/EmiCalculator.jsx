import React, { useState, useMemo } from "react";
import {
  Calculator,
  IndianRupee,
  TrendingUp,
  Calendar,
  Banknote,
  PieChart,
} from "lucide-react";
import "./EmiCalculator.css";

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(2000000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTerm, setLoanTerm] = useState(5);

  const emiCalc = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTerm * 12;
    if (r <= 0 || n <= 0 || P <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  }, [loanAmount, interestRate, loanTerm]);

  const formatMoney = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const principalPercent = emiCalc.totalPayment > 0
    ? ((loanAmount / emiCalc.totalPayment) * 100).toFixed(1)
    : 50;

  const interestPercent = emiCalc.totalPayment > 0
    ? ((emiCalc.totalInterest / emiCalc.totalPayment) * 100).toFixed(1)
    : 50;

  return (
    <div className="emi-page">

      {/* HEADER */}
      <div className="emi-page-header">
        <span>✧ FINANCIAL TOOLS</span>
        <h1>EMI Calculator</h1>
        <p>Plan your monthly payments by adjusting loan amount, interest rate, and tenure</p>
      </div>

      {/* MAIN GRID */}
      <div className="emi-page-grid">

        {/* LEFT: SLIDERS */}
        <div className="emi-sliders-card">

          {/* Loan Amount */}
          <div className="emi-slider-block">
            <div className="emi-slider-head">
              <div className="emi-slider-icon blue">
                <IndianRupee size={18} />
              </div>
              <div>
                <span>Loan Amount</span>
                <strong>{formatMoney(loanAmount)}</strong>
              </div>
            </div>
            <input
              type="range"
              min="50000"
              max="50000000"
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="emi-slider"
            />
            <div className="emi-slider-bounds">
              <small>₹50K</small>
              <small>₹5 Cr</small>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="emi-slider-block">
            <div className="emi-slider-head">
              <div className="emi-slider-icon purple">
                <TrendingUp size={18} />
              </div>
              <div>
                <span>Interest Rate (Annual)</span>
                <strong>{interestRate.toFixed(1)}%</strong>
              </div>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="emi-slider"
            />
            <div className="emi-slider-bounds">
              <small>4%</small>
              <small>24%</small>
            </div>
          </div>

          {/* Loan Term */}
          <div className="emi-slider-block">
            <div className="emi-slider-head">
              <div className="emi-slider-icon green">
                <Calendar size={18} />
              </div>
              <div>
                <span>Loan Tenure</span>
                <strong>{loanTerm} {loanTerm === 1 ? "Year" : "Years"} ({loanTerm * 12} months)</strong>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="emi-slider"
            />
            <div className="emi-slider-bounds">
              <small>1 Year</small>
              <small>30 Years</small>
            </div>
          </div>

        </div>

        {/* RIGHT: RESULTS */}
        <div className="emi-results-panel">

          {/* EMI Highlight */}
          <div className="emi-highlight-card">
            <Calculator size={28} />
            <div>
              <span>Monthly EMI</span>
              <strong>{formatMoney(emiCalc.emi)}</strong>
              <small>per month for {loanTerm * 12} months</small>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="emi-stats-grid">
            <div className="emi-stat">
              <div className="emi-stat-icon" style={{ background: "#f0eaff", color: "#754ce8" }}>
                <IndianRupee size={18} />
              </div>
              <div>
                <span>Principal Amount</span>
                <strong>{formatMoney(loanAmount)}</strong>
              </div>
            </div>

            <div className="emi-stat">
              <div className="emi-stat-icon" style={{ background: "#fff4e2", color: "#ed9a28" }}>
                <TrendingUp size={18} />
              </div>
              <div>
                <span>Total Interest</span>
                <strong>{formatMoney(emiCalc.totalInterest)}</strong>
              </div>
            </div>

            <div className="emi-stat">
              <div className="emi-stat-icon" style={{ background: "#eaf9f1", color: "#24a96f" }}>
                <Banknote size={18} />
              </div>
              <div>
                <span>Total Payment</span>
                <strong>{formatMoney(emiCalc.totalPayment)}</strong>
              </div>
            </div>
          </div>

          {/* Breakdown Bar */}
          <div className="emi-visual-breakdown">
            <div className="emi-breakdown-title">
              <PieChart size={16} />
              <span>Payment Breakdown</span>
            </div>
            <div className="emi-bar-container">
              <div
                className="emi-bar-principal"
                style={{ width: `${principalPercent}%` }}
              >
                <span>{principalPercent}%</span>
              </div>
              <div
                className="emi-bar-interest"
                style={{ width: `${interestPercent}%` }}
              >
                <span>{interestPercent}%</span>
              </div>
            </div>
            <div className="emi-bar-legend">
              <div className="emi-legend-item">
                <div className="emi-legend-dot" style={{ background: "#754ce8" }}></div>
                <span>Principal ({principalPercent}%)</span>
              </div>
              <div className="emi-legend-item">
                <div className="emi-legend-dot" style={{ background: "#f59e0b" }}></div>
                <span>Interest ({interestPercent}%)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default EmiCalculator;
