import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Banknote,
  Building2,
  GraduationCap,
  Home,
  IndianRupee,
  ShieldCheck,
  Sparkles,
  UserRound,
  Loader2,
} from "lucide-react";

import "./NewApplication.css";


function NewApplication() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({

    no_of_dependents: "",
    education: "",
    self_employed: "",

    income_annum: "",
    loan_amount: "",
    loan_term: "",

    cibil_score: "",

    bank_asset_value: "",

  });


  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const loanId = `LOAN-${Date.now()}`;

    const application = {
      loan_id: loanId,
      no_of_dependents: formData.no_of_dependents,
      education: formData.education,
      self_employed: formData.self_employed,
      income_annum: Number(formData.income_annum),
      loan_amount: Number(formData.loan_amount),
      loan_term: Number(formData.loan_term),
      cibil_score: Number(formData.cibil_score),
      bank_asset_value: Number(formData.bank_asset_value),
    };

    try {
      // Send application to ML prediction API
      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(application),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction from the server. Please ensure the backend is running.");
      }

      const predictionResult = await response.json();

      // Enhance application with prediction results
      const enhancedApplication = {
        id: "LA-" + Math.floor(1000 + Math.random() * 9000),
        name: "Applicant",
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        status: predictionResult.loan_status === "Loan Approved" ? "Approved" : "Rejected",
        score: Math.round(predictionResult.approval_probability * 100),
        ...application
      };

      // Save application temporarily.
      const existingApplications = JSON.parse(localStorage.getItem("loanApplications")) || [];
      localStorage.setItem(
        "loanApplications",
        JSON.stringify([...existingApplications, enhancedApplication])
      );

      // Navigate to prediction page with both data and result
      navigate("/prediction", {
        state: {
          application,
          predictionResult,
        },
      });
    } catch (err) {
      setError(err.message || "An error occurred while connecting to the AI system.");
    } finally {
      setLoading(false);
    }
  };


  return (

    <div className="new-application-page">


      {/* HEADER */}

      <div className="application-header">

        <div>

          <div className="application-eyebrow">

            <Sparkles size={12} />

            AI LOAN ELIGIBILITY

          </div>

          <h1>
            New Loan Application
          </h1>

          <p>
            Enter applicant information to
            analyze loan eligibility using
            our prediction system.
          </p>

        </div>


        <div className="secure-badge">

          <ShieldCheck size={15} />

          AI Powered

        </div>

      </div>


      <form
        className="application-form"
        onSubmit={handleSubmit}
      >


        {/* =================================
            APPLICANT INFORMATION
            ================================= */}

        <section className="application-card">

          <div className="section-heading">

            <div className="section-icon purple">

              <UserRound size={17} />

            </div>

            <div>

              <h2>
                Applicant Information
              </h2>

              <p>
                Basic applicant profile
              </p>

            </div>

          </div>


          <div className="form-grid">


            {/* DEPENDENTS */}

            <div className="form-group">

              <label>
                Number of Dependents
              </label>

              <select
                name="no_of_dependents"
                value={
                  formData.no_of_dependents
                }
                onChange={handleChange}
                required
              >

                <option value="">
                  Select dependents
                </option>

                <option value="0">
                  0
                </option>

                <option value="1">
                  1
                </option>

                <option value="2">
                  2
                </option>

                <option value="3">
                  3
                </option>

                <option value="4">
                  4+
                </option>

              </select>

            </div>


            {/* EDUCATION */}

            <div className="form-group">

              <label>
                Education
              </label>

              <select
                name="education"
                value={
                  formData.education
                }
                onChange={handleChange}
                required
              >

                <option value="">
                  Select education
                </option>

                <option value="Graduate">
                  Graduate
                </option>

                <option value="Not Graduate">
                  Not Graduate
                </option>

              </select>

            </div>


            {/* EMPLOYMENT */}

            <div className="form-group">

              <label>
                Self Employed
              </label>

              <select
                name="self_employed"
                value={
                  formData.self_employed
                }
                onChange={handleChange}
                required
              >

                <option value="">
                  Select employment
                </option>

                <option value="Yes">
                  Yes
                </option>

                <option value="No">
                  No
                </option>

              </select>

            </div>

          </div>

        </section>


        {/* =================================
            LOAN INFORMATION
            ================================= */}

        <section className="application-card">

          <div className="section-heading">

            <div className="section-icon blue">

              <Banknote size={17} />

            </div>

            <div>

              <h2>
                Loan Information
              </h2>

              <p>
                Loan amount and repayment details
              </p>

            </div>

          </div>


          <div className="form-grid">


            {/* INCOME */}

            <div className="form-group">

              <label>
                Annual Income
              </label>

              <div className="input-with-icon">

                <IndianRupee size={14} />

                <input
                  type="number"
                  name="income_annum"
                  value={
                    formData.income_annum
                  }
                  onChange={handleChange}
                  placeholder="e.g. 9600000"
                  min="0"
                  required
                />

              </div>

              <small>
                Enter annual income in ₹
              </small>

            </div>


            {/* LOAN AMOUNT */}

            <div className="form-group">

              <label>
                Loan Amount
              </label>

              <div className="input-with-icon">

                <IndianRupee size={14} />

                <input
                  type="number"
                  name="loan_amount"
                  value={
                    formData.loan_amount
                  }
                  onChange={handleChange}
                  placeholder="e.g. 29900000"
                  min="0"
                  required
                />

              </div>

              <small>
                Requested loan amount in ₹
              </small>

            </div>


            {/* LOAN TERM */}

            <div className="form-group">

              <label>
                Loan Term
              </label>

              <div className="input-with-icon">

                <input
                  type="number"
                  name="loan_term"
                  value={
                    formData.loan_term
                  }
                  onChange={handleChange}
                  placeholder="e.g. 12"
                  min="1"
                  max="50"
                  required
                />

                <span className="input-unit">
                  Years
                </span>

              </div>

            </div>


          </div>

        </section>


        {/* =================================
            CREDIT INFORMATION
            ================================= */}

        <section className="application-card">

          <div className="section-heading">

            <div className="section-icon green">

              <ShieldCheck size={17} />

            </div>

            <div>

              <h2>
                Credit Profile
              </h2>

              <p>
                Applicant creditworthiness
              </p>

            </div>

          </div>


          <div className="credit-input-area">

            <div className="form-group">

              <label>
                CIBIL Score
              </label>

              <input
                type="number"
                name="cibil_score"
                value={
                  formData.cibil_score
                }
                onChange={handleChange}
                placeholder="300 - 900"
                min="300"
                max="900"
                required
              />

              <small>
                Higher CIBIL scores generally
                indicate lower credit risk.
              </small>

            </div>


            <div className="cibil-guide">

              <div>

                <span>
                  300
                </span>

                <small>
                  Poor
                </small>

              </div>

              <div>

                <span>
                  600
                </span>

                <small>
                  Fair
                </small>

              </div>

              <div>

                <span>
                  750
                </span>

                <small>
                  Good
                </small>

              </div>

              <div>

                <span>
                  900
                </span>

                <small>
                  Excellent
                </small>

              </div>

            </div>

          </div>

        </section>


        {/* =================================
            ASSETS
            ================================= */}

        <section className="application-card">

          <div className="section-heading">

            <div className="section-icon orange">

              <Building2 size={17} />

            </div>

            <div>

              <h2>
                Asset Information
              </h2>

              <p>
                Applicant asset values
              </p>

            </div>

          </div>


          <div className="form-grid">

            <AssetInput
              name="bank_asset_value"
              label="Bank Assets"
              value={
                formData.bank_asset_value
              }
              onChange={handleChange}
              icon={<Banknote size={14} />}
              placeholder="e.g. 8000000"
            />

          </div>

        </section>


        {/* =================================
            PREDICTION BUTTON
            ================================= */}

        <div className="application-submit-area">

          {error && (
            <div style={{ color: "#d93025", backgroundColor: "#fce8e6", padding: "12px", borderRadius: "8px", marginBottom: "16px", width: "100%", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <div className="submit-info">

            <ShieldCheck size={17} />

            <div>

              <strong>
                Ready for AI Analysis?
              </strong>

              <span>
                Your information will be analyzed
                to estimate loan eligibility.
              </span>

            </div>

          </div>


          <button
            type="submit"
            className="predict-button"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >

            {loading ? "Processing..." : "Check Loan Eligibility"}

            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <ArrowRight size={16} />}

          </button>

        </div>


      </form>

    </div>
  );
}


/* =========================================
   ASSET INPUT COMPONENT
   ========================================= */

function AssetInput({
  name,
  label,
  value,
  onChange,
  icon,
  placeholder,
}) {

  return (

    <div className="form-group">

      <label>
        {label}
      </label>

      <div className="input-with-icon">

        {icon}

        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min="0"
          required
        />

      </div>

      <small>
        Asset value in ₹
      </small>

    </div>

  );
}


export default NewApplication;