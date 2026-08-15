import React, { useMemo, useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  PieChart,
  Gauge,
  Wallet,
  IndianRupee,
  GraduationCap,
  Activity,
  X,
  ArrowRight,
  User,
  LogOut,
  BriefcaseBusiness,
  Users,
  ShieldCheck,
} from "lucide-react";

import "./Analytics.css";


// ======================================================
// HELPERS
// ======================================================

const formatMoney = (value) => {
  const number = Number(value || 0);

  if (number >= 10000000) {
    return `₹${(number / 10000000).toFixed(1)}Cr`;
  }

  if (number >= 100000) {
    return `₹${(number / 100000).toFixed(1)}L`;
  }

  return `₹${number.toLocaleString("en-IN")}`;
};


export default function Analytics() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/applications`)
      .then(res => res.json())
      .then(parsed => {
        setApplications(parsed.map((item, index) => ({
          applicationId: item.application_id || `LOAN-${index + 1}`,
          income: Number(item.income_annum || 0),
          loanAmount: Number(item.loan_amount || 0),
          cibil: Number(item.cibil_score || 0),
          education: item.education || "Graduate",
          selfEmployed: item.self_employed === "Yes" || item.self_employed === true,
          dependents: Number(item.no_of_dependents || 0),
          approved: item.status === "Approved"
        })));
      })
      .catch(err => console.error(err));
  }, []);

  const [selectedDetail, setSelectedDetail] = useState(null);

  const [selectedApplicant, setSelectedApplicant] =
    useState(null);


  // ====================================================
  // CALCULATIONS
  // ====================================================

  const totalApplications = applications.length;

  const approvedApplications =
    applications.filter((item) => item.approved).length;

  const rejectedApplications =
    applications.filter((item) => !item.approved).length;

  const approvalRate =
    totalApplications > 0
      ? Math.round(
          (approvedApplications / totalApplications) * 100
        )
      : 0;


  const averageCibil =
    totalApplications > 0
      ? Math.round(
          applications.reduce(
            (sum, item) => sum + Number(item.cibil || 0),
            0
          ) / totalApplications
        )
      : 0;


  const averageIncome =
    totalApplications > 0
      ? applications.reduce(
          (sum, item) => sum + Number(item.income || 0),
          0
        ) / totalApplications
      : 0;


  const averageLoan =
    totalApplications > 0
      ? applications.reduce(
          (sum, item) => sum + Number(item.loanAmount || 0),
          0
        ) / totalApplications
      : 0;


  const graduates = applications.filter(
    (item) =>
      String(item.education).toLowerCase().includes("graduate")
  ).length;


  const selfEmployed = applications.filter(
    (item) => item.selfEmployed
  ).length;


  const totalDependents = applications.reduce(
    (sum, item) =>
      sum + Number(item.dependents || 0),
    0
  );

  const approvedApps = applications.filter((a) => a.approved);
  const rejectedApps = applications.filter((a) => !a.approved);

  const avgIncomeAppr = approvedApps.length > 0 ? approvedApps.reduce((s, a) => s + Number(a.income || 0), 0) / approvedApps.length : 0;
  const avgIncomeRej = rejectedApps.length > 0 ? rejectedApps.reduce((s, a) => s + Number(a.income || 0), 0) / rejectedApps.length : 0;

  const avgLoanAppr = approvedApps.length > 0 ? approvedApps.reduce((s, a) => s + Number(a.loanAmount || 0), 0) / approvedApps.length : 0;
  const avgLoanRej = rejectedApps.length > 0 ? rejectedApps.reduce((s, a) => s + Number(a.loanAmount || 0), 0) / rejectedApps.length : 0;

  const avgCibilAppr = approvedApps.length > 0 ? approvedApps.reduce((s, a) => s + Number(a.cibil || 0), 0) / approvedApps.length : 0;
  const avgCibilRej = rejectedApps.length > 0 ? rejectedApps.reduce((s, a) => s + Number(a.cibil || 0), 0) / rejectedApps.length : 0;

  const maxIncome = Math.max(avgIncomeAppr, avgIncomeRej, 1);
  const maxLoan = Math.max(avgLoanAppr, avgLoanRej, 1);
  const maxCibil = 900;



  // ====================================================
  // OPEN DETAILS
  // ====================================================

  const openDetails = (type) => {
    setSelectedApplicant(null);
    setSelectedDetail(type);
  };


  const openApplicant = (applicant) => {
    setSelectedDetail(null);
    setSelectedApplicant(applicant);
  };


  const closeDetails = () => {
    setSelectedDetail(null);
    setSelectedApplicant(null);
  };


  // ====================================================
  // CIBIL DATA
  // ====================================================

  const excellent = applications.filter(
    (item) => Number(item.cibil) >= 750
  ).length;

  const good = applications.filter(
    (item) =>
      Number(item.cibil) >= 700 &&
      Number(item.cibil) < 750
  ).length;

  const average = applications.filter(
    (item) =>
      Number(item.cibil) >= 650 &&
      Number(item.cibil) < 700
  ).length;

  const poor = applications.filter(
    (item) => Number(item.cibil) < 650
  ).length;


  return (
    <div className="analytics-page">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="analytics-header">

        <div>

          <div className="analytics-label">
            ANALYTICS CENTER
          </div>

          <h1>
            Loan Portfolio Analytics
          </h1>

          <p>
            Understand applicant patterns, loan trends
            and approval behavior.
          </p>

        </div>


        <div className="live-data">

          <span></span>

          LIVE DATA

        </div>

      </div>



      {/* ==================================================
          STAT CARDS
      ================================================== */}

      <div className="analytics-stats-grid">


        {/* TOTAL */}

        <div
          className="analytics-card clickable"
          onClick={() => openDetails("applications")}
        >

          <div className="analytics-icon purple">
            <FileText size={22} />
          </div>

          <div className="analytics-card-content">

            <span>Total Applications</span>

            <strong>
              {totalApplications}
            </strong>

            <small>
              Current portfolio
            </small>

          </div>

          <ArrowRight className="card-arrow" size={17} />

        </div>


        {/* APPROVED */}

        <div
          className="analytics-card clickable"
          onClick={() => openDetails("approved")}
        >

          <div className="analytics-icon green">
            <CheckCircle2 size={22} />
          </div>

          <div className="analytics-card-content">

            <span>Approved</span>

            <strong>
              {approvedApplications}
            </strong>

            <small>
              Approved applications
            </small>

          </div>

          <ArrowRight className="card-arrow" size={17} />

        </div>


        {/* REJECTED */}

        <div
          className="analytics-card clickable"
          onClick={() => openDetails("rejected")}
        >

          <div className="analytics-icon red">
            <XCircle size={22} />
          </div>

          <div className="analytics-card-content">

            <span>Rejected</span>

            <strong>
              {rejectedApplications}
            </strong>

            <small>
              Rejected applications
            </small>

          </div>

          <ArrowRight className="card-arrow" size={17} />

        </div>


        {/* APPROVAL RATE */}

        <div
          className="analytics-card clickable"
          onClick={() => openDetails("approvalRate")}
        >

          <div className="analytics-icon blue">
            <PieChart size={22} />
          </div>

          <div className="analytics-card-content">

            <span>Approval Rate</span>

            <strong>
              {approvalRate}%
            </strong>

            <small>
              Portfolio approval
            </small>

          </div>

          <ArrowRight className="card-arrow" size={17} />

        </div>


        {/* CIBIL */}

        <div
          className="analytics-card clickable"
          onClick={() => openDetails("cibil")}
        >

          <div className="analytics-icon purple">
            <Gauge size={22} />
          </div>

          <div className="analytics-card-content">

            <span>Average CIBIL</span>

            <strong>
              {averageCibil}
            </strong>

            <small>
              Excellent credit profile
            </small>

          </div>

          <ArrowRight className="card-arrow" size={17} />

        </div>


        {/* INCOME */}

        <div
          className="analytics-card clickable"
          onClick={() => openDetails("income")}
        >

          <div className="analytics-icon green">
            <Wallet size={22} />
          </div>

          <div className="analytics-card-content">

            <span>Average Income</span>

            <strong>
              {formatMoney(averageIncome)}
            </strong>

            <small>
              Average annual income
            </small>

          </div>

          <ArrowRight className="card-arrow" size={17} />

        </div>


        {/* LOAN */}

        <div
          className="analytics-card clickable"
          onClick={() => openDetails("loan")}
        >

          <div className="analytics-icon blue">
            <IndianRupee size={22} />
          </div>

          <div className="analytics-card-content">

            <span>Average Loan</span>

            <strong>
              {formatMoney(averageLoan)}
            </strong>

            <small>
              Average requested amount
            </small>

          </div>

          <ArrowRight className="card-arrow" size={17} />

        </div>


        {/* GRADUATES */}

        <div
          className="analytics-card clickable"
          onClick={() => openDetails("education")}
        >

          <div className="analytics-icon purple">
            <GraduationCap size={22} />
          </div>

          <div className="analytics-card-content">

            <span>Graduates</span>

            <strong>
              {graduates}
            </strong>

            <small>
              Education profile
            </small>

          </div>

          <ArrowRight className="card-arrow" size={17} />

        </div>

      </div>



      {/* ==================================================
          CHARTS
      ================================================== */}

      <div className="analytics-grid">


        {/* CIBIL */}

        <div
          className="analytics-panel clickable-panel"
          onClick={() => openDetails("cibil")}
        >

          <div className="panel-heading">

            <div>

              <h2>
                CIBIL Score Distribution
              </h2>

              <p>
                Applicant credit profile
              </p>

            </div>

            <Activity size={20} />

          </div>


          <div className="cibil-chart">

            <div
              className="cibil-ring"
              style={{
                "--percentage":
                  totalApplications
                    ? `${(excellent / totalApplications) * 100}%`
                    : "0%",
              }}
            >

              <div className="ring-center">

                <strong>
                  {excellent}
                </strong>

                <span>
                  Excellent
                </span>

              </div>

            </div>


            <div className="legend">

              <div>
                <span className="dot excellent"></span>
                Excellent
                <strong>{excellent}</strong>
              </div>

              <div>
                <span className="dot good"></span>
                Good
                <strong>{good}</strong>
              </div>

              <div>
                <span className="dot average"></span>
                Average
                <strong>{average}</strong>
              </div>

              <div>
                <span className="dot poor"></span>
                Poor
                <strong>{poor}</strong>
              </div>

            </div>

          </div>

        </div>



        {/* APPROVAL */}

        <div
          className="analytics-panel clickable-panel"
          onClick={() => openDetails("approvalRate")}
        >

          <div className="panel-heading">

            <div>

              <h2>
                Approval Overview
              </h2>

              <p>
                Current portfolio status
              </p>

            </div>

            <ShieldCheck size={20} />

          </div>


          <div className="approval-chart">

            <div className="approval-ring">

              <div>

                <strong>
                  {approvalRate}%
                </strong>

                <span>
                  Approved
                </span>

              </div>

            </div>


            <div className="approval-legend">

              <div>

                <span className="dot approved"></span>

                <span>
                  Approved
                </span>

                <strong>
                  {approvedApplications}
                </strong>

              </div>

              <div>

                <span className="dot rejected"></span>

                <span>
                  Rejected
                </span>

                <strong>
                  {rejectedApplications}
                </strong>

              </div>

            </div>

          </div>

        </div>



        {/* INCOME VS LOAN */}

        <div className="analytics-panel income-panel">

          <div className="panel-heading">

            <div>

              <h2>
                Income vs Loan Amount
              </h2>

              <p>
                Click an applicant for details
              </p>

            </div>

          </div>


          <div className="bar-chart">

            {applications.map((app, index) => {

              const maxValue = Math.max(
                ...applications.map(
                  (a) =>
                    Math.max(
                      a.income,
                      a.loanAmount
                    )
                ),
                1
              );

              const incomeHeight =
                (app.income / maxValue) * 190;

              const loanHeight =
                (app.loanAmount / maxValue) * 190;


              return (
                <div
                  className="bar-group"
                  key={index}
                  onClick={() =>
                    openApplicant(app)
                  }
                >

                  <div className="bars">

                    <div
                      className="bar income-bar"
                      style={{
                        height:
                          `${Math.max(
                            incomeHeight,
                            8
                          )}px`,
                      }}
                    ></div>

                    <div
                      className="bar loan-bar"
                      style={{
                        height:
                          `${Math.max(
                            loanHeight,
                            8
                          )}px`,
                      }}
                    ></div>

                  </div>

                  <span>
                    {index + 1}
                  </span>

                </div>
              );
            })}

          </div>


          <div className="chart-legend">

            <span>
              <i className="income-dot"></i>
              Income
            </span>

            <span>
              <i className="loan-dot"></i>
              Loan Amount
            </span>

          </div>

        </div>

      </div>



      {/* ==================================================
          FEATURE VS APPROVAL ANALYSIS
      ================================================== */}

      <div className="analytics-grid feature-analysis">

        <div className="analytics-panel full-width">

          <div className="panel-heading">
            <div>
              <h2>Features vs Approval Status</h2>
              <p>Compare average applicant metrics between approved and rejected loans</p>
            </div>
            <Activity size={20} />
          </div>

          <div className="feature-compare-grid">
            
            {/* Income */}
            <div className="feature-compare-item">
              <span>Average Income</span>
              <div className="compare-bars">
                <div className="compare-row">
                  <span className="compare-label">Approved</span>
                  <div className="compare-track">
                    <div className="compare-fill approved-fill" style={{ width: `${Math.min(100, (avgIncomeAppr / maxIncome) * 100)}%` }}></div>
                  </div>
                  <span className="compare-value">{formatMoney(avgIncomeAppr)}</span>
                </div>
                <div className="compare-row">
                  <span className="compare-label">Rejected</span>
                  <div className="compare-track">
                    <div className="compare-fill rejected-fill" style={{ width: `${Math.min(100, (avgIncomeRej / maxIncome) * 100)}%` }}></div>
                  </div>
                  <span className="compare-value">{formatMoney(avgIncomeRej)}</span>
                </div>
              </div>
            </div>

            {/* Loan Amount */}
            <div className="feature-compare-item">
              <span>Average Loan Amount</span>
              <div className="compare-bars">
                <div className="compare-row">
                  <span className="compare-label">Approved</span>
                  <div className="compare-track">
                    <div className="compare-fill approved-fill" style={{ width: `${Math.min(100, (avgLoanAppr / maxLoan) * 100)}%` }}></div>
                  </div>
                  <span className="compare-value">{formatMoney(avgLoanAppr)}</span>
                </div>
                <div className="compare-row">
                  <span className="compare-label">Rejected</span>
                  <div className="compare-track">
                    <div className="compare-fill rejected-fill" style={{ width: `${Math.min(100, (avgLoanRej / maxLoan) * 100)}%` }}></div>
                  </div>
                  <span className="compare-value">{formatMoney(avgLoanRej)}</span>
                </div>
              </div>
            </div>

            {/* CIBIL Score */}
            <div className="feature-compare-item">
              <span>Average CIBIL Score</span>
              <div className="compare-bars">
                <div className="compare-row">
                  <span className="compare-label">Approved</span>
                  <div className="compare-track">
                    <div className="compare-fill approved-fill" style={{ width: `${Math.min(100, (avgCibilAppr / maxCibil) * 100)}%` }}></div>
                  </div>
                  <span className="compare-value">{Math.round(avgCibilAppr)}</span>
                </div>
                <div className="compare-row">
                  <span className="compare-label">Rejected</span>
                  <div className="compare-track">
                    <div className="compare-fill rejected-fill" style={{ width: `${Math.min(100, (avgCibilRej / maxCibil) * 100)}%` }}></div>
                  </div>
                  <span className="compare-value">{Math.round(avgCibilRej)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>



      {/* ==================================================
          APPLICANT PROFILE
      ================================================== */}

      <div className="profile-section">

        <div className="section-title">

          <div>

            <span>
              APPLICANT PROFILE
            </span>

            <h2>
              Applicant Overview
            </h2>

          </div>

          <small>
            {totalApplications} applicants
          </small>

        </div>


        <div className="profile-grid">

          <div
            className="profile-mini clickable"
            onClick={() => openDetails("education")}
          >

            <GraduationCap />

            <div>

              <strong>
                {graduates}
              </strong>

              <span>
                Graduates
              </span>

            </div>

          </div>


          <div
            className="profile-mini clickable"
            onClick={() => openDetails("employment")}
          >

            <BriefcaseBusiness />

            <div>

              <strong>
                {selfEmployed}
              </strong>

              <span>
                Self Employed
              </span>

            </div>

          </div>


          <div
            className="profile-mini clickable"
            onClick={() => openDetails("dependents")}
          >

            <Users />

            <div>

              <strong>
                {totalDependents}
              </strong>

              <span>
                Dependents
              </span>

            </div>

          </div>

        </div>

      </div>



      {/* ==================================================
          MODAL
      ================================================== */}

      {(selectedDetail || selectedApplicant) && (

        <div
          className="details-overlay"
          onClick={closeDetails}
        >

          <div
            className="details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={closeDetails}
            >
              <X size={20} />
            </button>


            {/* ============================================
                APPLICANT
            ============================================ */}

            {selectedApplicant && (

              <>

                <div className="modal-label">
                  APPLICATION DETAILS
                </div>

                <h2>
                  {selectedApplicant.applicationId}
                </h2>

                <div className="modal-status approved-status">
                  <CheckCircle2 size={17} />
                  {selectedApplicant.approved
                    ? "Loan Approved"
                    : "Loan Rejected"}
                </div>


                <div className="applicant-details-grid">

                  <div>
                    <span>Annual Income</span>
                    <strong>
                      {formatMoney(
                        selectedApplicant.income
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Loan Amount</span>
                    <strong>
                      {formatMoney(
                        selectedApplicant.loanAmount
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>CIBIL Score</span>
                    <strong>
                      {selectedApplicant.cibil}
                    </strong>
                  </div>

                  <div>
                    <span>Education</span>
                    <strong>
                      {selectedApplicant.education}
                    </strong>
                  </div>

                  <div>
                    <span>Employment</span>
                    <strong>
                      {selectedApplicant.selfEmployed
                        ? "Self Employed"
                        : "Salaried"}
                    </strong>
                  </div>

                  <div>
                    <span>Dependents</span>
                    <strong>
                      {selectedApplicant.dependents}
                    </strong>
                  </div>

                </div>


                <div className="prediction-box">

                  <ShieldCheck size={22} />

                  <div>

                    <strong>
                      AI Prediction
                    </strong>

                    <span>
                      Applicant has a favorable
                      profile based on the available
                      financial and credit information.
                    </span>

                  </div>

                </div>

              </>

            )}



            {/* ============================================
                APPLICATIONS
            ============================================ */}

            {selectedDetail === "applications" && (

              <>

                <div className="modal-label">
                  APPLICATION CENTER
                </div>

                <h2>
                  All Applications
                </h2>

                <div className="modal-big-number">
                  {totalApplications}
                </div>

                <p>
                  Total loan applications currently
                  available in the portfolio.
                </p>

                <div className="modal-list">

                  {applications.map(
                    (app, index) => (

                      <div
                        className="modal-list-item clickable"
                        key={index}
                        onClick={() =>
                          openApplicant(app)
                        }
                      >

                        <div>

                          <strong>
                            {app.applicationId}
                          </strong>

                          <span>
                            CIBIL {app.cibil}
                          </span>

                        </div>

                        <span className="approved-pill">
                          {app.approved
                            ? "Approved"
                            : "Rejected"}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </>

            )}



            {/* ============================================
                APPROVED
            ============================================ */}

            {selectedDetail === "approved" && (

              <>

                <div className="modal-label">
                  APPROVAL ANALYSIS
                </div>

                <h2>
                  Approved Applications
                </h2>

                <div className="modal-big-number green">
                  {approvedApplications}
                </div>

                <p>
                  Applications that have received
                  an approved prediction.
                </p>

                <div className="modal-list">

                  {applications
                    .filter(
                      (app) => app.approved
                    )
                    .map((app, index) => (

                      <div
                        className="modal-list-item clickable"
                        key={index}
                        onClick={() =>
                          openApplicant(app)
                        }
                      >

                        <div>

                          <strong>
                            {app.applicationId}
                          </strong>

                          <span>
                            CIBIL {app.cibil}
                          </span>

                        </div>

                        <span className="approved-pill">
                          Approved
                        </span>

                      </div>

                    ))}

                </div>

              </>

            )}



            {/* ============================================
                REJECTED
            ============================================ */}

            {selectedDetail === "rejected" && (

              <>

                <div className="modal-label red">
                  RISK ANALYSIS
                </div>

                <h2>
                  Rejected Applications
                </h2>

                <div className="modal-big-number red">
                  {rejectedApplications}
                </div>

                {rejectedApplications === 0 ? (

                  <div className="empty-box">
                    <CheckCircle2 size={24} />

                    <strong>
                      No rejected applications
                    </strong>

                    <span>
                      All current applications have
                      an approved prediction.
                    </span>

                  </div>

                ) : (

                  <div className="modal-list">

                    {applications
                      .filter(
                        (app) => !app.approved
                      )
                      .map(
                        (app, index) => (

                          <div
                            className="modal-list-item clickable"
                            key={index}
                            onClick={() =>
                              openApplicant(app)
                            }
                          >

                            <strong>
                              {app.applicationId}
                            </strong>

                            <span className="rejected-pill">
                              Rejected
                            </span>

                          </div>

                        )
                      )}

                  </div>

                )}

              </>

            )}



            {/* ============================================
                APPROVAL RATE
            ============================================ */}

            {selectedDetail === "approvalRate" && (

              <>

                <div className="modal-label">
                  PORTFOLIO PERFORMANCE
                </div>

                <h2>
                  Approval Rate
                </h2>

                <div className="modal-big-number">
                  {approvalRate}%
                </div>

                <div className="progress-container">

                  <div
                    className="progress-bar"
                    style={{
                      width:
                        `${approvalRate}%`,
                    }}
                  ></div>

                </div>


                <div className="analysis-row">

                  <span>
                    Approved Applications
                  </span>

                  <strong>
                    {approvedApplications}
                  </strong>

                </div>


                <div className="analysis-row">

                  <span>
                    Rejected Applications
                  </span>

                  <strong>
                    {rejectedApplications}
                  </strong>

                </div>


                <div className="analysis-row">

                  <span>
                    Total Applications
                  </span>

                  <strong>
                    {totalApplications}
                  </strong>

                </div>

              </>

            )}



            {/* ============================================
                CIBIL
            ============================================ */}

            {selectedDetail === "cibil" && (

              <>

                <div className="modal-label">
                  CREDIT PROFILE
                </div>

                <h2>
                  CIBIL Score Analysis
                </h2>

                <div className="modal-big-number">
                  {averageCibil}
                </div>

                <div className="excellent-badge">
                  Excellent Credit Profile
                </div>


                <div className="analysis-row">

                  <span>
                    Excellent
                  </span>

                  <strong>
                    {excellent}
                  </strong>

                </div>


                <div className="analysis-row">

                  <span>
                    Good
                  </span>

                  <strong>
                    {good}
                  </strong>

                </div>


                <div className="analysis-row">

                  <span>
                    Average
                  </span>

                  <strong>
                    {average}
                  </strong>

                </div>


                <div className="analysis-row">

                  <span>
                    Poor
                  </span>

                  <strong>
                    {poor}
                  </strong>

                </div>

              </>

            )}



            {/* ============================================
                INCOME
            ============================================ */}

            {selectedDetail === "income" && (

              <>

                <div className="modal-label">
                  FINANCIAL PROFILE
                </div>

                <h2>
                  Average Annual Income
                </h2>

                <div className="modal-big-number">
                  {formatMoney(averageIncome)}
                </div>

                <p>
                  Average annual income of all
                  applicants in the portfolio.
                </p>


                <div className="modal-list">

                  {applications.map(
                    (app, index) => (

                      <div
                        className="modal-list-item"
                        key={index}
                      >

                        <div>

                          <strong>
                            {app.applicationId}
                          </strong>

                          <span>
                            Applicant income
                          </span>

                        </div>

                        <strong>
                          {formatMoney(app.income)}
                        </strong>

                      </div>

                    )
                  )}

                </div>

              </>

            )}



            {/* ============================================
                LOAN
            ============================================ */}

            {selectedDetail === "loan" && (

              <>

                <div className="modal-label">
                  LOAN PORTFOLIO
                </div>

                <h2>
                  Average Loan Amount
                </h2>

                <div className="modal-big-number">
                  {formatMoney(averageLoan)}
                </div>

                <div className="analysis-row">

                  <span>
                    Total Applications
                  </span>

                  <strong>
                    {totalApplications}
                  </strong>

                </div>


                <div className="analysis-row">

                  <span>
                    Average Requested Amount
                  </span>

                  <strong>
                    {formatMoney(averageLoan)}
                  </strong>

                </div>

              </>

            )}



            {/* ============================================
                EDUCATION
            ============================================ */}

            {selectedDetail === "education" && (

              <>

                <div className="modal-label">
                  APPLICANT PROFILE
                </div>

                <h2>
                  Education Analysis
                </h2>

                <div className="modal-big-number">
                  {graduates}
                </div>

                <div className="excellent-badge">
                  Graduate Applicants
                </div>


                <div className="analysis-row">

                  <span>
                    Graduates
                  </span>

                  <strong>
                    {graduates}
                  </strong>

                </div>


                <div className="analysis-row">

                  <span>
                    Total Applicants
                  </span>

                  <strong>
                    {totalApplications}
                  </strong>

                </div>

              </>

            )}



            {/* ============================================
                EMPLOYMENT
            ============================================ */}

            {selectedDetail === "employment" && (

              <>

                <div className="modal-label">
                  EMPLOYMENT PROFILE
                </div>

                <h2>
                  Employment Analysis
                </h2>

                <div className="modal-big-number">
                  {selfEmployed}
                </div>

                <div className="analysis-row">

                  <span>
                    Self Employed
                  </span>

                  <strong>
                    {selfEmployed}
                  </strong>

                </div>


                <div className="analysis-row">

                  <span>
                    Salaried
                  </span>

                  <strong>
                    {totalApplications -
                      selfEmployed}
                  </strong>

                </div>

              </>

            )}



            {/* ============================================
                DEPENDENTS
            ============================================ */}

            {selectedDetail === "dependents" && (

              <>

                <div className="modal-label">
                  FAMILY PROFILE
                </div>

                <h2>
                  Dependents Analysis
                </h2>

                <div className="modal-big-number">
                  {totalDependents}
                </div>

                <p>
                  Total number of dependents across
                  the current applicant portfolio.
                </p>


                <div className="analysis-row">

                  <span>
                    Total Applicants
                  </span>

                  <strong>
                    {totalApplications}
                  </strong>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}