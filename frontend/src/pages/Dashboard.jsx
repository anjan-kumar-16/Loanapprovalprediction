import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FilePlus2,
  IndianRupee,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Calendar,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import "./Dashboard.css";


function Dashboard() {
  const [applicationsData, setApplicationsData] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/applications`)
      .then(res => res.json())
      .then(data => setApplicationsData(data))
      .catch(err => console.error(err));
  }, []);

  const applications = applicationsData;


  /* -----------------------------------------
     STATISTICS
     ----------------------------------------- */

  let approved = 0;
  let rejected = 0;

  applications.forEach(
    (application) => {

      if (application.status === "Approved") {
        approved++;
      } else {
        rejected++;
      }

    }
  );


  const total =
    applications.length;


  const approvalRate =
    total > 0
      ? Math.round(
          (approved / total) * 100
        )
      : 0;


  const totalLoan =
    applications.reduce(
      (sum, application) =>
        sum +
        (Number(
          application.loan_amount
        ) || 0),
      0
    );


  const averageCibil =
    total > 0
      ? Math.round(
          applications.reduce(
            (sum, application) =>
              sum +
              (Number(
                application.cibil_score
              ) || 0),
            0
          ) / total
        )
      : 0;

  const averageIncome =
    total > 0
      ? Math.round(
          applications.reduce(
            (sum, application) =>
              sum +
              (Number(
                application.income_annum
              ) || 0),
            0
          ) / total
        )
      : 0;

  const averageLoanTerm =
    total > 0
      ? Math.round(
          applications.reduce(
            (sum, application) =>
              sum +
              (Number(
                application.loan_term
              ) || 0),
            0
          ) / total
        )
      : 0;

  /* -----------------------------------------
     FORMAT MONEY
     ----------------------------------------- */

  const formatMoney = (value) => {

    if (!value) {
      return "₹0";
    }

    if (value >= 10000000) {

      return `₹${(
        value / 10000000
      ).toFixed(1)}Cr`;
    }

    if (value >= 100000) {

      return `₹${(
        value / 100000
      ).toFixed(1)}L`;
    }

    if (value >= 1000) {

      return `₹${(
        value / 1000
      ).toFixed(0)}K`;
    }

    return `₹${value}`;
  };

  const authRole = localStorage.getItem("userRole");

  if (authRole === "applicant") {
    return <ApplicantDashboard applications={applicationsData} />;
  }

  return (

    <div className="dashboard-page">


      {/* =====================================
          HEADER
          ===================================== */}

      <div className="dashboard-header">

        <div>

          <div className="dashboard-eyebrow">

            <Activity size={11} />

            LOAN INTELLIGENCE CENTER

          </div>

          <h1>
            Welcome to your Dashboard 👋
          </h1>

          <p>
            Monitor applications, analyze loan
            trends and make smarter approval decisions.
          </p>

        </div>


        <Link
          to="/application"
          className="dashboard-primary-button"
        >

          <FilePlus2 size={15} />

          New Application

        </Link>

      </div>


      {/* =====================================
          HERO
          ===================================== */}

      <section className="dashboard-hero">

        <div className="hero-content">

          <div className="hero-tag">

            <ShieldCheck size={11} />

            AI-POWERED LOAN ANALYSIS

          </div>

          <h2>
            Smarter decisions.
            <br />
            Better lending.
          </h2>

          <p>
            Analyze applicant financial profiles
            and predict loan approval eligibility
            using intelligent data-driven insights.
          </p>


          <div className="hero-actions">

            <Link
              to="/application"
              className="hero-button"
            >

              Check Eligibility

              <ArrowRight size={14} />

            </Link>


            <Link
              to="/analytics"
              className="hero-secondary-button"
            >

              View Analytics

            </Link>

          </div>

        </div>


        <div className="hero-visual">

          <div className="hero-orb">

            <ShieldCheck size={42} />

          </div>

          <div className="hero-score-card">

            <span>
              AI CONFIDENCE
            </span>

            <strong>
              92.4%
            </strong>

            <small>
              High confidence
            </small>

          </div>

        </div>

      </section>


      {/* =====================================
          KPI CARDS
          ===================================== */}

      <div className="dashboard-kpis">


        <DashboardKpi
          icon={<Users size={17} />}
          title="Total Applications"
          value={total}
          description="Applications submitted"
          type="purple"
        />


        <DashboardKpi
          icon={<CheckCircle2 size={17} />}
          title="Approved"
          value={approved}
          description="Eligible applications"
          type="green"
        />


        <DashboardKpi
          icon={<XCircle size={17} />}
          title="Rejected"
          value={rejected}
          description="Needs review"
          type="red"
        />


        <DashboardKpi
          icon={<TrendingUp size={17} />}
          title="Approval Rate"
          value={`${approvalRate}%`}
          description="Current approval trend"
          type="blue"
        />

      </div>


      {/* =====================================
          MAIN GRID
          ===================================== */}

      <div className="dashboard-grid">


        {/* APPLICATION OVERVIEW */}

        <section className="dashboard-card overview-card">

          <div className="dashboard-card-header">

            <div>

              <h2>
                Application Overview
              </h2>

              <p>
                Current loan portfolio status
              </p>

            </div>

            <Link to="/analytics">
              View Analytics
              <ArrowRight size={11} />
            </Link>

          </div>


          <div className="overview-content">


            <div className="big-rate">

              <div className="rate-ring">

                <div>

                  <strong>
                    {approvalRate}%
                  </strong>

                  <span>
                    Approval
                  </span>

                </div>

              </div>

            </div>


            <div className="overview-stats">

              <OverviewStat
                label="Approved"
                value={approved}
                icon={<CheckCircle2 size={13} />}
                type="green"
              />

              <OverviewStat
                label="Rejected"
                value={rejected}
                icon={<XCircle size={13} />}
                type="red"
              />

              <OverviewStat
                label="Total"
                value={total}
                icon={<Users size={13} />}
                type="purple"
              />

            </div>

          </div>

        </section>


        {/* FINANCIAL SUMMARY */}

        <section className="dashboard-card">

          <div className="dashboard-card-header">

            <div>

              <h2>
                Financial Summary
              </h2>

              <p>
                Portfolio financial indicators
              </p>

            </div>

            <IndianRupee size={17} />

          </div>


          <div className="financial-summary">

            <FinancialItem
              icon={<IndianRupee size={14} />}
              label="Total Loan Amount"
              value={formatMoney(totalLoan)}
            />

            <FinancialItem
              icon={<Wallet size={14} />}
              label="Average Income"
              value={formatMoney(averageIncome)}
            />

            <FinancialItem
              icon={<Calendar size={14} />}
              label="Avg. Loan Term"
              value={`${averageLoanTerm} Months`}
            />

            <FinancialItem
              icon={<TrendingUp size={14} />}
              label="Average CIBIL Score"
              value={averageCibil || "—"}
            />

          </div>


          <Link
            to="/applications"
            className="view-all-button"
          >

            View All Applications

            <ArrowRight size={12} />

          </Link>

        </section>


        {/* RECENT APPLICATIONS */}

        <section className="dashboard-card recent-card">

          <div className="dashboard-card-header">

            <div>

              <h2>
                Recent Applications
              </h2>

              <p>
                Latest loan applications
              </p>

            </div>

            <Link to="/applications">

              View All

              <ArrowRight size={11} />

            </Link>

          </div>


          {applications.length === 0 ? (

            <div className="empty-dashboard">

              <div>
                <FilePlus2 size={21} />
              </div>

              <strong>
                No applications yet
              </strong>

              <span>
                Start by submitting your first
                loan application.
              </span>

              <Link to="/application">
                Create Application
              </Link>

            </div>

          ) : (

            <div className="recent-list">

              {applications
                .slice(-5)
                .reverse()
                .map(
                  (
                    application,
                    index
                  ) => {

                    return (

                      <div
                        className="recent-item"
                        key={
                          application.loan_id ||
                          index
                        }
                      >

                        <div className="recent-avatar">

                          {(
                            application
                              .first_name ||
                            application
                              .full_name ||
                            "A"
                          )
                            .charAt(0)
                            .toUpperCase()}

                        </div>


                        <div className="recent-info">

                          <strong>

                            {
                              application
                                .first_name ||
                              application
                                .full_name ||
                              "Applicant"
                            }

                          </strong>

                          <span>

                            {application.loan_id ||
                              `APP-${index + 1}`}

                          </span>

                        </div>


                        <div className="recent-loan">

                          {formatMoney(
                            Number(
                              application
                                .loan_amount
                            )
                          )}

                        </div>


                        <div
                          className={
                            application.status === "Approved"
                              ? "status-approved"
                              : application.status === "Rejected"
                                ? "status-rejected"
                                : "status-pending"
                          }
                        >

                          {application.status === "Approved"
                            ? "Approved"
                            : application.status === "Rejected"
                              ? "Rejected"
                              : "Pending"}

                        </div>

                      </div>

                    );
                  }
                )}

            </div>

          )}

        </section>


        {/* QUICK ACTIONS */}

        <section className="dashboard-card quick-card">

          <div className="dashboard-card-header">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Frequently used tools
              </p>

            </div>

          </div>


          <div className="quick-actions">

            <QuickAction
              to="/application"
              icon={<FilePlus2 size={16} />}
              title="New Application"
              text="Check a new applicant"
            />


            <QuickAction
              to="/prediction"
              icon={<BrainIcon />}
              title="Prediction"
              text="View loan prediction"
            />


            <QuickAction
              to="/what-if"
              icon={<Activity size={16} />}
              title="What-If Analysis"
              text="Test different scenarios"
            />


            <QuickAction
              to="/analytics"
              icon={<BarChart3 size={16} />}
              title="Analytics"
              text="Explore portfolio data"
            />

          </div>

        </section>

      </div>


      {/* =====================================
          FOOTER STATUS
          ===================================== */}

      <div className="dashboard-footer">

        <span>

          <i />

          AI Prediction Engine Online

        </span>

        <span>
          11 dataset features
        </span>

        <span>
          Loan Approval Prediction System
        </span>

      </div>

    </div>
  );
}


/* =========================================
   KPI
   ========================================= */

function DashboardKpi({
  icon,
  title,
  value,
  description,
  type,
}) {

  return (

    <div className="dashboard-kpi">

      <div className={`dashboard-kpi-icon ${type}`}>
        {icon}
      </div>

      <div className="dashboard-kpi-info">

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {description}
        </small>

      </div>

    </div>
  );
}


/* =========================================
   OVERVIEW
   ========================================= */

function OverviewStat({
  label,
  value,
  icon,
  type,
}) {

  return (

    <div className="overview-stat">

      <div className={`overview-stat-icon ${type}`}>
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


/* =========================================
   FINANCIAL
   ========================================= */

function FinancialItem({
  icon,
  label,
  value,
}) {

  return (

    <div className="financial-item">

      <div className="financial-icon">
        {icon}
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


/* =========================================
   QUICK ACTION
   ========================================= */

function QuickAction({
  to,
  icon,
  title,
  text,
}) {

  return (

    <Link
      to={to}
      className="quick-action"
    >

      <div className="quick-action-icon">
        {icon}
      </div>

      <div>

        <strong>
          {title}
        </strong>

        <span>
          {text}
        </span>

      </div>

      <ArrowRight size={12} />

    </Link>
  );
}


/* =========================================
   BRAIN ICON
   ========================================= */

function BrainIcon() {

  return (
    <ShieldCheck size={16} />
  );
}


function ApplicantDashboard({ applications }) {
  return (
    <div className="dashboard-page applicant-dashboard">
      <div className="dashboard-header">
        <div>
          <div className="dashboard-eyebrow">
            <Activity size={11} />
            WELCOME TO LOAN AI
          </div>
          <h1>Hello, Applicant 👋</h1>
          <p>Ready to get started? Check your eligibility and apply for a loan in minutes.</p>
        </div>
      </div>

      <div className="dashboard-grid applicant-grid">
        <section className="dashboard-card action-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Start your journey here</p>
            </div>
            <FilePlus2 size={17} />
          </div>
          <div className="action-buttons">
            <Link to="/prediction" className="dashboard-primary-button">
              <ShieldCheck size={15} /> Check Eligibility
            </Link>
            <Link to="/application" className="hero-button" style={{ marginLeft: '10px' }}>
              <FilePlus2 size={15} /> Apply Now
            </Link>
          </div>
        </section>

        <section className="dashboard-card tips-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Tips for Approval</h2>
              <p>Boost your chances</p>
            </div>
            <CheckCircle2 size={17} />
          </div>
          <ul className="tips-list">
            <li><CheckCircle2 size={14} color="#15945b" /> Maintain a CIBIL score above 750.</li>
            <li><CheckCircle2 size={14} color="#15945b" /> Keep your debt-to-income ratio low.</li>
            <li><CheckCircle2 size={14} color="#15945b" /> Provide accurate asset values.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;