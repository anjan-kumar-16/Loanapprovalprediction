import React, { useState } from "react";
import {
  Database,
  Activity,
  ShieldCheck,
  Target,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  XCircle,
  Info,
  X,
  Users,
  GraduationCap,
  BriefcaseBusiness,
  IndianRupee,
  Clock3,
  CreditCard,
  Building2,
  Gem,
  WalletCards,
} from "lucide-react";

import "./ModelPerformance.css";

const initialMetrics = [
  {
    name: "Accuracy",
    value: "...",
    icon: Target,
    description: "Overall correct predictions made by the model.",
    detail:
      "Accuracy measures how many loan applications were classified correctly out of all evaluated applications.",
  },
  {
    name: "Precision",
    value: "...",
    icon: TrendingUp,
    description: "Approved predictions that were actually correct.",
    detail:
      "Precision shows how reliable the model is when it predicts that a loan application should be approved.",
  },
  {
    name: "Recall",
    value: "...",
    icon: BarChart3,
    description: "Actual approvals correctly identified.",
    detail:
      "Recall measures how many of the applications that should be approved were successfully identified by the model.",
  },
  {
    name: "F1 Score",
    value: "...",
    icon: Activity,
    description: "Balanced measure of precision and recall.",
    detail:
      "F1 Score combines precision and recall into one balanced performance measure.",
  },
];

const initialMatrixItems = [
  {
    value: 0,
    title: "True Positive",
    subtitle: "Correctly Approved",
    className: "tp",
    description:
      "The model predicted Approved and the actual application was also Approved.",
  },
  {
    value: 0,
    title: "False Negative",
    subtitle: "Missed Approval",
    className: "fn",
    description:
      "The actual application was Approved, but the model predicted Rejected.",
  },
  {
    value: 0,
    title: "False Positive",
    subtitle: "Incorrect Approval",
    className: "fp",
    description:
      "The actual application was Rejected, but the model predicted Approved.",
  },
  {
    value: 0,
    title: "True Negative",
    subtitle: "Correctly Rejected",
    className: "tn",
    description:
      "The model predicted Rejected and the actual application was also Rejected.",
  },
];

const features = [
  {
    name: "Number of Dependents",
    icon: Users,
    description:
      "Number of family members or dependents supported by the applicant.",
    type: "Numerical",
  },
  {
    name: "Education",
    icon: GraduationCap,
    description:
      "Applicant education level used as part of the applicant profile.",
    type: "Categorical",
  },
  {
    name: "Type of Employment",
    icon: BriefcaseBusiness,
    description:
      "Indicates whether the applicant is self-employed.",
    type: "Categorical",
  },
  {
    name: "Annual Income",
    icon: IndianRupee,
    description:
      "Applicant's yearly income used to assess repayment capability.",
    type: "Numerical",
  },
  {
    name: "Loan Amount",
    icon: IndianRupee,
    description:
      "Amount of loan requested by the applicant.",
    type: "Numerical",
  },
  {
    name: "Loan Term",
    icon: Clock3,
    description:
      "Requested repayment period for the loan.",
    type: "Numerical",
  },
  {
    name: "CIBIL Score",
    icon: CreditCard,
    description:
      "Credit score representing the applicant's credit profile.",
    type: "Numerical",
  },
  {
    name: "Bank Asset Value",
    icon: WalletCards,
    description:
      "Value of bank or financial assets owned by the applicant.",
    type: "Numerical",
  },
];

function ModelPerformance() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [metrics, setMetrics] = React.useState(initialMetrics);
  const [matrixItems, setMatrixItems] = React.useState(initialMatrixItems);

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/metrics`)
      .then((res) => res.json())
      .then((data) => {
        setMetrics((prev) => [
          { ...prev[0], value: `${data.accuracy}%` },
          { ...prev[1], value: `${data.precision}%` },
          { ...prev[2], value: `${data.recall}%` },
          { ...prev[3], value: `${data.f1_score}%` },
        ]);
        setMatrixItems((prev) => [
          { ...prev[0], value: data.confusion_matrix.true_positive },
          { ...prev[1], value: data.confusion_matrix.false_negative },
          { ...prev[2], value: data.confusion_matrix.false_positive },
          { ...prev[3], value: data.confusion_matrix.true_negative },
        ]);
      })
      .catch((err) => console.error("Failed to fetch metrics", err));
  }, []);

  const openDetails = (item) => {
    setSelectedItem(item);
  };

  const closeDetails = () => {
    setSelectedItem(null);
  };

  return (
    <div className="model-page">
      {/* HEADER */}
      <div className="model-header">
        <div>
          <div className="eyebrow">
            <Activity size={14} />
            AI MODEL PERFORMANCE
          </div>

          <h1>Loan Approval Model</h1>

          <p>
            Monitor prediction quality and machine learning model performance.
          </p>
        </div>

        <div className="model-active">
          <span></span>
          MODEL ACTIVE
        </div>
      </div>

      {/* CURRENT MODEL */}
      <section className="current-model-card">
        <div className="current-model-left">
          <div className="model-icon">
            <Activity size={30} />
          </div>

          <div>
            <span className="small-label">CURRENT MODEL</span>
            <h2>Loan Approval Predictor</h2>
            <p>
              Classification model trained to predict loan approval
              eligibility.
            </p>
          </div>
        </div>

        <div className="model-tags">
          <div className="model-tag">
            <Database size={20} />
            <div>
              <span>Dataset</span>
              <strong>Loan Approval Dataset</strong>
            </div>
          </div>

          <div className="model-tag">
            <Activity size={20} />
            <div>
              <span>Problem Type</span>
              <strong>Binary Classification</strong>
            </div>
          </div>

          <div className="model-tag">
            <ShieldCheck size={20} />
            <div>
              <span>Output</span>
              <strong>Approved / Rejected</strong>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="section">
        <div className="section-heading">
          <div>
            <h2>Evaluation Metrics</h2>
            <p>Performance measured on the model evaluation dataset</p>
          </div>

          <span className="click-hint">
            Click a metric to view details
          </span>
        </div>

        <div className="metrics-grid">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <button
                key={metric.name}
                className="metric-card"
                onClick={() => openDetails(metric)}
              >
                <div className="metric-top">
                  <div className="metric-icon">
                    <Icon size={21} />
                  </div>

                  <span className="good-badge">GOOD</span>
                </div>

                <div className="metric-value">{metric.value}</div>

                <h3>{metric.name}</h3>

                <p>{metric.description}</p>

                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{
                      width: metric.value,
                    }}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CONFUSION MATRIX + SUMMARY */}
      <section className="analysis-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h2>Confusion Matrix</h2>
              <p>Prediction classification results</p>
            </div>

            <div className="panel-icon">
              <Target size={19} />
            </div>
          </div>

          <div className="matrix-labels">
            <span></span>
            <span>Predicted Approved</span>
            <span>Predicted Rejected</span>
          </div>

          <div className="matrix-grid">
            <div className="actual-label">
              Actual
              <br />
              Approved
            </div>

            {matrixItems.slice(0, 2).map((item) => (
              <button
                key={item.title}
                className={`matrix-cell ${item.className}`}
                onClick={() => openDetails(item)}
              >
                <strong>{item.value}</strong>
                <span>{item.title}</span>
                <small>{item.subtitle}</small>
              </button>
            ))}

            <div className="actual-label">
              Actual
              <br />
              Rejected
            </div>

            {matrixItems.slice(2, 4).map((item) => (
              <button
                key={item.title}
                className={`matrix-cell ${item.className}`}
                onClick={() => openDetails(item)}
              >
                <strong>{item.value}</strong>
                <span>{item.title}</span>
                <small>{item.subtitle}</small>
              </button>
            ))}
          </div>
        </div>

        {/* PERFORMANCE SUMMARY */}
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h2>Performance Summary</h2>
              <p>Model reliability indicators</p>
            </div>

            <div className="panel-icon success">
              <CheckCircle2 size={19} />
            </div>
          </div>

          <div className="summary-list">
            {metrics.map((metric) => (
              <div className="summary-item" key={metric.name}>
                <div className="summary-title">
                  <span>{metric.name}</span>
                  <strong>{metric.value}</strong>
                </div>

                <div className="summary-progress">
                  <div
                    style={{
                      width: metric.value,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="status-box">
            <ShieldCheck size={23} />

            <div>
              <strong>Model Status: Good</strong>
              <p>
                The model demonstrates strong predictive performance across
                the evaluation metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DATASET FEATURES */}
      <section className="panel features-panel">
        <div className="panel-heading">
          <div>
            <h2>Dataset Features Used</h2>
            <p>Input variables used by the prediction system</p>
          </div>

          <div className="panel-icon">
            <Database size={19} />
          </div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <button
                className="feature-card"
                key={feature.name}
                onClick={() => openDetails(feature)}
              >
                <div className="feature-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="feature-icon">
                  <Icon size={18} />
                </div>

                <div className="feature-content">
                  <strong>{feature.name}</strong>
                  <span>{feature.type}</span>
                </div>

                <Info size={16} className="feature-info" />
              </button>
            );
          })}
        </div>
      </section>

      {/* MODEL INFORMATION */}
      <section className="model-info-section">
        <div className="info-title">
          <div className="panel-icon">
            <Activity size={19} />
          </div>

          <div>
            <h2>Model Information</h2>
            <p>Technical overview of the loan prediction system</p>
          </div>
        </div>

        <div className="info-grid">
          <div>
            <span>Model Type</span>
            <strong>Classification</strong>
          </div>

          <div>
            <span>Algorithm</span>
            <strong>Random Forest</strong>
          </div>

          <div>
            <span>Dataset</span>
            <strong>Loan Approval Dataset</strong>
          </div>

          <div>
            <span>Output</span>
            <strong>Approved / Rejected</strong>
          </div>

          <div>
            <span>Input Features</span>
            <strong>11</strong>
          </div>

          <div>
            <span>Model Status</span>
            <strong className="active-text">● Active</strong>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="model-footer">
        <span>
          <i></i>
          Prediction engine ready
        </span>

        <span>11 input features</span>

        <span>Binary classification</span>
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div
            className="details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={closeDetails}>
              <X size={20} />
            </button>

            <div className="modal-icon">
              <Info size={25} />
            </div>

            <span className="modal-label">DETAIL VIEW</span>

            <h2>
              {selectedItem.name ||
                selectedItem.title ||
                selectedItem.name}
            </h2>

            {selectedItem.value && (
              <div className="modal-value">{selectedItem.value}</div>
            )}

            {selectedItem.type && (
              <div className="modal-type">
                Feature Type: <strong>{selectedItem.type}</strong>
              </div>
            )}

            <p>
              {selectedItem.detail ||
                selectedItem.description ||
                "Detailed information about this model component."}
            </p>

            {selectedItem.subtitle && (
              <div className="modal-note">
                <CheckCircle2 size={18} />
                {selectedItem.subtitle}
              </div>
            )}

            <button className="modal-button" onClick={closeDetails}>
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelPerformance;