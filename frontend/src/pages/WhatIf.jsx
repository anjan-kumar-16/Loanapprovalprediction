import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  Gauge,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./WhatIf.css";

function WhatIf() {

  const navigate = useNavigate();

  const [application, setApplication] =
    useState(null);

  const [values, setValues] = useState({
    cibil_score: 700,
    income_annum: 3000000,
    loan_amount: 10000000,
    loan_term: 10,
    no_of_dependents: 2,
    employment_type: "Employed",
  });


  /* =====================================================
     LOAD LAST APPLICATION
     ===================================================== */

  useEffect(() => {

    const applications =
      JSON.parse(
        localStorage.getItem(
          "loanApplications"
        )
      ) || [];

    if (applications.length > 0) {

      const latest =
        applications[
          applications.length - 1
        ];

      setApplication(latest);

      setValues({
        cibil_score:
          Number(
            latest.cibil_score
          ),

        income_annum:
          Number(
            latest.income_annum
          ),

        loan_amount:
          Number(
            latest.loan_amount
          ),

        loan_term:
          Number(
            latest.loan_term
          ),

        no_of_dependents:
          Number(
            latest.no_of_dependents
          ),

        employment_type:
          latest.employment_type || (latest.self_employed === "Yes" ? "Employed" : "Unemployed"),
      });
    }

  }, []);


  /* =====================================================
     PREDICTION
     ===================================================== */

  const [prediction, setPrediction] = useState({
    probability: 0,
    approved: false,
    risk: "High",
  });

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            no_of_dependents: String(values.no_of_dependents),
            education: application ? application.education : "Graduate",
            employment_type: values.employment_type,
            income_annum: values.income_annum,
            loan_amount: values.loan_amount,
            loan_term: values.loan_term,
            cibil_score: values.cibil_score,
            bank_asset_value: application ? application.bank_asset_value || 0 : 0,
            is_whatif: true,
          }),
        });
        const data = await response.json();
        if (data && data.approval_probability !== undefined) {
          const prob = Math.round(data.approval_probability * 100);
          let risk = "High";
          if (prob >= 75) risk = "Low";
          else if (prob >= 55) risk = "Medium";
          
          setPrediction({
            probability: prob,
            approved: data.loan_status === "Loan Approved",
            risk: risk,
          });
        }
      } catch (err) {
        console.error("Error fetching prediction", err);
      }
    };

    fetchPrediction();
  }, [values, application]);


  /* =====================================================
     HANDLE VALUE CHANGE
     ===================================================== */

  const updateValue = (
    field,
    value
  ) => {

    setValues(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };


  /* =====================================================
     RESET
     ===================================================== */

  const resetValues = () => {

    if (!application) return;

    setValues({
      cibil_score:
        Number(
          application.cibil_score
        ),

      income_annum:
        Number(
          application.income_annum
        ),

      loan_amount:
        Number(
          application.loan_amount
        ),

      loan_term:
        Number(
          application.loan_term
        ),

      no_of_dependents:
        Number(
          application.no_of_dependents
        ),

      employment_type:
        application.employment_type || (application.self_employed === "Yes" ? "Employed" : "Unemployed"),
    });
  };


  /* =====================================================
     FORMAT MONEY
     ===================================================== */

  const formatMoney = (value) => {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(
      Number(value || 0)
    );
  };


  /* =====================================================
     NO APPLICATION
     ===================================================== */

  if (!application) {

    return (

      <div className="whatif-empty">

        <div className="whatif-empty-icon">
          <Sparkles size={28} />
        </div>

        <h1>
          Start a Loan Application First
        </h1>

        <p>
          What-If Analysis needs an application
          before you can experiment with the
          loan parameters.
        </p>

        <button
          onClick={() =>
            navigate("/application")
          }
        >
          Create Application
          <ArrowRight size={14} />
        </button>

      </div>
    );
  }


  return (

    <div className="whatif-page">


      {/* =================================================
          HEADER
          ================================================= */}

      <div className="whatif-header">

        <div>

          <div className="whatif-label">

            <Sparkles size={11} />

            WHAT-IF ANALYSIS

          </div>

          <h1>
            Explore Loan Scenarios
          </h1>

          <p>
            Adjust applicant information and
            instantly see how the predicted
            eligibility changes.
          </p>

        </div>


        <button
          className="reset-button"
          onClick={resetValues}
        >

          <RotateCcw size={13} />

          Reset

        </button>

      </div>


      {/* =================================================
          RESULT
          ================================================= */}

      <section
        className={
          prediction.approved
            ? "whatif-result approved"
            : "whatif-result rejected"
        }
      >

        <div className="whatif-result-icon">

          {prediction.approved ? (

            <CheckCircle2 size={30} />

          ) : (

            <XCircle size={30} />

          )}

        </div>


        <div className="whatif-result-text">

          <span>
            CURRENT SCENARIO
          </span>

          <h2>

            {prediction.approved
              ? "Likely Approved"
              : "Likely Rejected"}

          </h2>

          <p>
            Prediction updates automatically
            as you change the values.
          </p>

        </div>


        <div className="whatif-probability">

          <span>
            PROBABILITY
          </span>

          <strong>
            {prediction.probability}%
          </strong>

        </div>


        <div
          className={`risk-badge ${prediction.risk.toLowerCase()}`}
        >

          <ShieldCheck size={12} />

          {prediction.risk} Risk

        </div>

      </section>


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <div className="whatif-layout">


        {/* =================================================
            CONTROLS
            ================================================= */}

        <section className="whatif-controls">

          <div className="whatif-card-title">

            <div className="whatif-title-icon">
              <Gauge size={16} />
            </div>

            <div>

              <h2>
                Adjust Parameters
              </h2>

              <p>
                Modify the values below
              </p>

            </div>

          </div>


          {/* CIBIL */}

          <ScenarioSlider
            icon={<CreditCard size={14} />}
            label="CIBIL Score"
            value={values.cibil_score}
            min={300}
            max={900}
            step={10}
            onChange={(value) =>
              updateValue(
                "cibil_score",
                Number(value)
              )
            }
            suffix=""
          />


          {/* INCOME */}

          <ScenarioSlider
            icon={<Banknote size={14} />}
            label="Annual Income"
            value={values.income_annum}
            min={100000}
            max={20000000}
            step={100000}
            onChange={(value) =>
              updateValue(
                "income_annum",
                Number(value)
              )
            }
            money
          />


          {/* LOAN */}

          <ScenarioSlider
            icon={<Banknote size={14} />}
            label="Loan Amount"
            value={values.loan_amount}
            min={100000}
            max={50000000}
            step={100000}
            onChange={(value) =>
              updateValue(
                "loan_amount",
                Number(value)
              )
            }
            money
          />


          {/* LOAN TERM */}

          <ScenarioSlider
            icon={<Activity size={14} />}
            label="Loan Term"
            value={values.loan_term}
            min={1}
            max={30}
            step={1}
            onChange={(value) =>
              updateValue(
                "loan_term",
                Number(value)
              )
            }
            suffix=" years"
          />


          {/* DEPENDENTS */}

          <ScenarioSlider
            icon={<UserRound size={14} />}
            label="Dependents"
            value={values.no_of_dependents}
            min={0}
            max={10}
            step={1}
            onChange={(value) =>
              updateValue(
                "no_of_dependents",
                Number(value)
              )
            }
          />


          {/* EMPLOYMENT */}

          <div className="scenario-select">

            <label>
              Employment Status
            </label>

            <select
              value={
                values.employment_type
              }
              onChange={(event) =>
                updateValue(
                  "employment_type",
                  event.target.value
                )
              }
            >

              <option value="Unemployed">
                Unemployed
              </option>

              <option value="Employed">
                Employed
              </option>

            </select>

          </div>

        </section>


        {/* =================================================
            LIVE ANALYSIS
            ================================================= */}

        <section className="whatif-analysis">

          <div className="whatif-card-title">

            <div className="whatif-title-icon blue">
              <TrendingUp size={16} />
            </div>

            <div>

              <h2>
                Live Analysis
              </h2>

              <p>
                Scenario impact
              </p>

            </div>

          </div>


          {/* SCORE */}

          <div className="scenario-score">

            <div className="scenario-score-circle">

              <div>

                <strong>
                  {prediction.probability}%
                </strong>

                <span>
                  Approval
                </span>

              </div>

            </div>

          </div>


          {/* METRICS */}

          <div className="scenario-metrics">

            <ScenarioMetric
              label="CIBIL Score"
              value={
                values.cibil_score
              }
            />

            <ScenarioMetric
              label="Annual Income"
              value={formatMoney(
                values.income_annum
              )}
            />

            <ScenarioMetric
              label="Loan Amount"
              value={formatMoney(
                values.loan_amount
              )}
            />

            <ScenarioMetric
              label="Loan / Income"
              value={
                values.income_annum > 0
                  ? (
                      values.loan_amount /
                      values.income_annum
                    ).toFixed(1) + "x"
                  : "—"
              }
            />

          </div>


          {/* INSIGHT */}

          <div className="scenario-insight">

            <Sparkles size={15} />

            <div>

              <strong>
                AI Insight
              </strong>

              <p>

                {prediction.approved
                  ? "The current combination of income, loan amount and CIBIL score indicates a relatively favorable scenario."
                  : "Consider increasing the CIBIL score or improving the income-to-loan ratio to strengthen the application."}

              </p>

            </div>

          </div>

        </section>

      </div>


      {/* =================================================
          ACTIONS
          ================================================= */}

      <div className="whatif-actions">

        <button
          className="secondary-whatif-button"
          onClick={() =>
            navigate("/prediction")
          }
        >
          View Prediction
        </button>


        <button
          className="primary-whatif-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >

          Go to Dashboard

          <ArrowRight size={14} />

        </button>

      </div>

    </div>
  );
}


/* =====================================================
   SLIDER COMPONENT
   ===================================================== */

function ScenarioSlider({
  icon,
  label,
  value,
  min,
  max,
  step,
  onChange,
  money,
  suffix = "",
}) {

  const displayValue = money
    ? new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }
      ).format(value)
    : `${value}${suffix}`;


  return (

    <div className="scenario-slider">

      <div className="scenario-slider-header">

        <label>

          <span>
            {icon}
          </span>

          {label}

        </label>

        <strong>
          {displayValue}
        </strong>

      </div>


      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

      <div className="range-labels">

        <span>
          {money
            ? new Intl.NumberFormat(
                "en-IN",
                {
                  notation: "compact",
                  compactDisplay: "short",
                }
              ).format(min)
            : min}
        </span>

        <span>
          {money
            ? new Intl.NumberFormat(
                "en-IN",
                {
                  notation: "compact",
                  compactDisplay: "short",
                }
              ).format(max)
            : max}
        </span>

      </div>

    </div>
  );
}


/* =====================================================
   METRIC
   ===================================================== */

function ScenarioMetric({
  label,
  value,
}) {

  return (

    <div className="scenario-metric">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}


export default WhatIf;