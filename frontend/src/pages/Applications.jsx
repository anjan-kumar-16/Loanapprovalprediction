import {
  Search,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "./Applications.css";

function Applications() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [applicationsData, setApplicationsData] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/applications`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setApplicationsData(data);
        } else {
          console.error("Expected array but got:", data);
        }
      })
      .catch(err => console.error("Failed to fetch applications", err));
  }, []);

  const formatMoney = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };
  
  const applications = applicationsData.map((app, index) => ({
    id: app.application_id || `LA-${1000 + index}`,
    name: app.name || "Applicant",
    income: formatMoney(app.income_annum),
    loan: formatMoney(app.loan_amount),
    score: app.probability_score || 0,
    status: app.status || "Pending",
    aiRecommendation: app.ai_recommendation || "Pending",
    date: app.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    raw: app, // store raw for modal
  }));

  const authRole = localStorage.getItem("userRole");

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setApplicationsData(prev => prev.map(app => 
          app.application_id === appId ? { ...app, status: newStatus } : app
        ));
        toast.success(`Application marked as ${newStatus}`);
        setSelectedApp(null);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  const filteredApplications = applications.filter((application) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      application.name.toLowerCase().includes(searchText) ||
      application.id.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All" ||
      application.status === filter;

    return matchesSearch && matchesFilter;
  });

  const approved = applications.filter(
    (item) => item.status === "Approved"
  ).length;

  const pending = applications.filter(
    (item) => item.status === "Pending"
  ).length;

  const rejected = applications.filter(
    (item) => item.status === "Rejected"
  ).length;

  return (
    <div className="applications-page">

      {/* ================= HEADER ================= */}

      <div className="applications-header">

        <div>
          <span className="applications-label">
            LOAN MANAGEMENT
          </span>

          <h1>Applications</h1>

          <p>
            View and manage all loan applications.
          </p>
        </div>

        <button
          className="new-application-button"
          onClick={() => navigate("/application")}
        >
          + New Application
        </button>

      </div>


      {/* ================= STAT CARDS ================= */}

      <div className="application-stats">

        <StatCard
          icon={<FileText size={19} />}
          title="Total Applications"
          value={applications.length}
          type="blue"
        />

        <StatCard
          icon={<CheckCircle2 size={19} />}
          title="Approved"
          value={approved}
          type="green"
        />

        <StatCard
          icon={<Clock3 size={19} />}
          title="Pending"
          value={pending}
          type="orange"
        />

        <StatCard
          icon={<XCircle size={19} />}
          title="Rejected"
          value={rejected}
          type="red"
        />

      </div>


      {/* ================= APPLICATION TABLE CARD ================= */}

      <div className="applications-card">

        {/* TOOLBAR */}

        <div className="applications-toolbar">

          <div className="search-box">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search applicant or application ID..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>


          <div className="filter-buttons">

            <SlidersHorizontal size={16} />

            {["All", "Approved", "Pending", "Rejected"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={`filter-button ${
                    filter === item ? "active" : ""
                  } ${item.toLowerCase()}`}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              )
            )}

          </div>

        </div>


        {/* ================= TABLE ================= */}

        <div className="applications-table-wrapper">

          <table className="applications-table">

            <thead>
              <tr>
                <th>APPLICATION</th>
                <th>APPLICANT</th>
                <th>INCOME</th>
                <th>LOAN AMOUNT</th>
                <th>SCORE</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>


            <tbody>

              {filteredApplications.map((application) => (

                <tr key={application.id}>

                  {/* ================= APPLICATION NUMBER ================= */}

                  <td className="application-number-column">

                    <div className="application-number">

                      <div className="application-number-icon">
                        <FileText size={16} />
                      </div>

                      <div className="application-number-content">

                        <span className="application-number-label">
                          Application ID
                        </span>

                        <strong>
                          {application.id}
                        </strong>

                      </div>

                    </div>

                  </td>


                  {/* ================= APPLICANT ================= */}

                  <td>

                    <div className="applicant-name">

                      <div className="avatar">
                        {application.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="applicant-details">

                        <strong>
                          {application.name}
                        </strong>

                        <span>
                          Applicant
                        </span>

                      </div>

                    </div>

                  </td>


                  {/* ================= INCOME ================= */}

                  <td className="income-value">
                    {application.income}
                  </td>


                  {/* ================= LOAN ================= */}

                  <td className="loan-value">

                    {application.loan}

                  </td>


                  {/* ================= SCORE ================= */}

                  <td>

                    <div className="score-cell">

                      <span
                        className={
                          application.score >= 70
                            ? "score-number good"
                            : application.score >= 50
                            ? "score-number medium"
                            : "score-number low"
                        }
                      >
                        {application.score}
                      </span>

                      <div className="mini-progress">

                        <div
                          className={
                            application.score >= 70
                              ? "progress-good"
                              : application.score >= 50
                              ? "progress-medium"
                              : "progress-low"
                          }
                          style={{
                            width: `${application.score}%`,
                          }}
                        />

                      </div>

                    </div>

                  </td>


                  {/* ================= STATUS ================= */}

                  <td>

                    <StatusBadge
                      status={application.status}
                    />

                  </td>


                  {/* ================= DATE ================= */}

                  <td className="date-cell">
                    {application.date}
                  </td>


                  {/* ================= ACTION ================= */}

                  <td className="actions-cell">
                    <button className="action-button view" onClick={() => setSelectedApp(application.raw)}>
                      <Eye size={17} />
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {/* ================= NO RESULTS ================= */}

          {filteredApplications.length === 0 && (

            <div className="empty-applications">

              <FileText size={32} />

              <h3>
                No applications found
              </h3>

              <p>
                Try changing your search or filter.
              </p>

            </div>

          )}

        </div>


        {/* ================= FOOTER ================= */}

        <div className="applications-footer">

          <span>
            Showing{" "}
            <strong>
              {filteredApplications.length}
            </strong>{" "}
            of{" "}
            <strong>
              {applications.length}
            </strong>{" "}
            applications
          </span>

          <div className="footer-summary">

            <TrendingUp size={14} />

            <span>
              Average eligibility score:
            </span>

            <strong>
              68
            </strong>

          </div>

        </div>

      </div>

      <ApplicationModal 
        app={selectedApp} 
        onClose={() => setSelectedApp(null)} 
        authRole={authRole}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  title,
  value,
  type,
}) {
  return (
    <div className="application-stat-card">

      <div className={`stat-icon ${type}`}>
        {icon}
      </div>

      <div className="stat-content">

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {

  if (status === "Approved") {

    return (
      <span className="status-badge approved">

        <CheckCircle2 size={13} />

        Approved

      </span>
    );
  }


  if (status === "Rejected") {

    return (
      <span className="status-badge rejected">

        <XCircle size={13} />

        Rejected

      </span>
    );
  }


  return (
    <span className="status-badge pending">

      <Clock3 size={13} />

      Pending

    </span>
  );
}

const ApplicationModal = ({ app, onClose, authRole, onUpdateStatus }) => {
  if (!app) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Application Details</h2>
          <button onClick={onClose} className="modal-close"><XCircle size={24} /></button>
        </div>
        <div className="modal-body">
          <p><strong>Applicant Name:</strong> {app.name}</p>
          <p><strong>Dependents:</strong> {app.no_of_dependents}</p>
          <p><strong>Education:</strong> {app.education}</p>
          <p><strong>Type of Employment:</strong> {app.self_employed}</p>
          <p><strong>Income:</strong> ₹{app.income_annum}</p>
          <p><strong>Loan Amount:</strong> ₹{app.loan_amount}</p>
          <p><strong>Loan Term:</strong> {app.loan_term} years</p>
          <p><strong>CIBIL Score:</strong> {app.cibil_score}</p>
          <p><strong>Bank Assets:</strong> ₹{app.bank_asset_value}</p>
          <hr />
          
          <div className="ai-recommendation-box">
            <div className="ai-rec-header">
              <span className="badge">AI Recommendation</span>
            </div>
            <p><strong>Decision:</strong> {app.ai_recommendation || 'Pending'}</p>
            <p><strong>Confidence Score:</strong> {app.ai_recommendation === 'Loan Rejected' ? 100 - app.probability_score : app.probability_score}%</p>
          </div>

          <p><strong>Current Status:</strong> <StatusBadge status={app.status} /></p>
          
          {app.status === "Pending" && authRole === "manager" && (
            <div className="modal-actions">
              <button className="btn-approve" onClick={() => onUpdateStatus(app.application_id, "Approved")}>
                <CheckCircle2 size={16} /> Approve
              </button>
              <button className="btn-reject" onClick={() => onUpdateStatus(app.application_id, "Rejected")}>
                <XCircle size={16} /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;