import React, { useMemo, useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  PieChart as PieChartIcon,
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

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
} from "recharts";

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
          selfEmployed: item.self_employed === "Yes" || item.self_employed === true || item.self_employed === "Employed",
          dependents: Number(item.no_of_dependents || 0),
          status: item.status,
          aiRecommendation: item.ai_recommendation
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
    applications.filter((item) => item.status === "Approved").length;

  const rejectedApplications =
    applications.filter((item) => item.status === "Rejected").length;

  const pendingApplications =
    applications.filter((item) => item.status === "Pending").length;

  const totalResolved = approvedApplications + rejectedApplications;

  const approvalRate =
    totalResolved > 0
      ? Math.round(
          (approvedApplications / totalResolved) * 100
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

  const approvedApps = applications.filter((a) => a.status === "Approved");
  const rejectedApps = applications.filter((a) => a.status === "Rejected");

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

  // ====================================================
  // RECHARTS DATA
  // ====================================================
  
  const cibilData = [
    { name: "Excellent", value: excellent, color: "#754ce8" },
    { name: "Good", value: good, color: "#4f8cff" },
    { name: "Average", value: average, color: "#f4a62a" },
    { name: "Poor", value: poor, color: "#ed6673" },
  ];

  const approvalData = [
    { name: "Approved", value: approvedApplications, color: "#27ad72" },
    { name: "Rejected", value: rejectedApplications, color: "#ed6673" },
    { name: "Pending", value: pendingApplications, color: "#f4a62a" },
  ];

  const featureData = [
    { name: "Avg Income", Approved: avgIncomeAppr, Rejected: avgIncomeRej },
    { name: "Avg Loan", Approved: avgLoanAppr, Rejected: avgLoanRej },
    { name: "Avg CIBIL", Approved: avgCibilAppr, Rejected: avgCibilRej },
  ];

  const trendData = applications.slice(0, 10).map((app) => ({
    name: app.applicationId,
    Income: app.income,
    Loan: app.loanAmount,
  })).reverse();

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
            <div className="trend-badge positive">
              <Activity size={10} /> +12.5%
            </div>

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
            <div className="trend-badge positive">
              <Activity size={10} /> +5.2%
            </div>

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
            <div className="trend-badge negative">
              <Activity size={10} /> -1.8%
            </div>

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
            <PieChartIcon size={22} />
          </div>

          <div className="analytics-card-content">

            <span>Approval Rate</span>

            <strong>
              {approvalRate}%
            </strong>
            <div className="trend-badge positive">
              <Activity size={10} /> +2.1%
            </div>

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
            <div className="trend-badge positive">
              <Activity size={10} /> +14 pts
            </div>

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
            <div className="trend-badge positive">
              <Activity size={10} /> +8.4%
            </div>

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
            <div className="trend-badge warning">
              <Activity size={10} /> +4.2%
            </div>

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
            <div className="trend-badge positive">
              <Activity size={10} /> +15.3%
            </div>

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

      <div className="analytics-main-grid">


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


          <div className="cibil-chart" style={{ height: "220px", display: "flex", flexDirection: "column" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cibilData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {cibilData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(33, 45, 75, 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                  }}
                  itemStyle={{ fontWeight: "700" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: "600" }} />
              </PieChart>
            </ResponsiveContainer>
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


          <div className="approval-chart" style={{ height: "220px", display: "flex", flexDirection: "column" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={approvalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {approvalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(33, 45, 75, 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                  }}
                  itemStyle={{ fontWeight: "700" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: "600" }} />
              </PieChart>
            </ResponsiveContainer>
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


          <div className="bar-chart" style={{ height: "250px", marginTop: "20px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#a0a8b6" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "#a0a8b6" }} 
                  tickFormatter={(val) => `₹${val/100000}L`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(117, 76, 232, 0.04)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(33, 45, 75, 0.1)",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                  }}
                  itemStyle={{ fontWeight: "700" }}
                  formatter={(value) => formatMoney(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: "600", paddingTop: "10px" }} />
                <Bar dataKey="Income" fill="#35ad72" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Loan" fill="#754ce8" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>



      {/* ==================================================
          FEATURE VS APPROVAL ANALYSIS
      ================================================== */}

      <div className="analytics-main-grid feature-analysis">

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
            <div className="feature-compare-item" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ marginBottom: '16px', fontWeight: '600' }}>Average Income</span>
              <div style={{ height: 200, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Approved', value: avgIncomeAppr },
                    { name: 'Rejected', value: avgIncomeRej }
                  ]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8b9bb4', fontWeight: 600 }} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#8b9bb4' }}
                      tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontWeight: 600, fontSize: 14 }}
                      formatter={(val) => [formatMoney(val), 'Income']}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {
                        [
                          { name: 'Approved', value: avgIncomeAppr },
                          { name: 'Rejected', value: avgIncomeRej }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === 'Approved' ? '#35ad72' : '#e84c4c'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Loan Amount */}
            <div className="feature-compare-item" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ marginBottom: '16px', fontWeight: '600' }}>Average Loan Amount</span>
              <div style={{ height: 200, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Approved', value: avgLoanAppr },
                    { name: 'Rejected', value: avgLoanRej }
                  ]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8b9bb4', fontWeight: 600 }} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#8b9bb4' }}
                      tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontWeight: 600, fontSize: 14 }}
                      formatter={(val) => [formatMoney(val), 'Loan Amount']}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {
                        [
                          { name: 'Approved', value: avgLoanAppr },
                          { name: 'Rejected', value: avgLoanRej }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === 'Approved' ? '#35ad72' : '#e84c4c'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CIBIL Score */}
            <div className="feature-compare-item" style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ marginBottom: '16px', fontWeight: '600' }}>Average CIBIL Score</span>
              <div style={{ height: 200, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Approved', value: avgCibilAppr },
                    { name: 'Rejected', value: avgCibilRej }
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8b9bb4', fontWeight: 600 }} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#8b9bb4' }}
                      domain={[300, 900]}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontWeight: 600, fontSize: 14 }}
                      formatter={(val) => [Math.round(val), 'CIBIL Score']}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                      {
                        [
                          { name: 'Approved', value: avgCibilAppr },
                          { name: 'Rejected', value: avgCibilRej }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name === 'Approved' ? '#35ad72' : '#e84c4c'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
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
                Type of Employment
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
                    <span>Type of Employment</span>
                    <strong>
                      {selectedApplicant.selfEmployed
                        ? "Employed"
                        : "Unemployed"}
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
                    Type of Employment
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