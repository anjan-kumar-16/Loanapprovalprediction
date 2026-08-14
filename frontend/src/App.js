import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Send, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Building,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    no_of_dependents: "0",
    education: "Graduate",
    self_employed: "No",
    income_annum: "",
    loan_amount: "",
    loan_term: "12",
    cibil_score: "",
    bank_asset_value: "0",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        no_of_dependents: formData.no_of_dependents,
        education: formData.education,
        self_employed: formData.self_employed,
        income_annum: Number(formData.income_annum),
        loan_amount: Number(formData.loan_amount),
        loan_term: Number(formData.loan_term),
        cibil_score: Number(formData.cibil_score),
        bank_asset_value: Number(formData.bank_asset_value),
      };

      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to connect to AI engine.");
      }

      const data = await response.json();
      setResult(data);
      
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      
      <header className="header">
        <h1>
          <Sparkles className="inline-icon" size={36} style={{ verticalAlign: 'middle', marginRight: '10px', color: 'var(--accent)' }} />
          Nexus AI Loan Predictor
        </h1>
        <p>Harness the power of XGBoost to instantly evaluate loan eligibility with complete explainability.</p>
      </header>

      <main className="main-content">
        
        {/* Application Form */}
        <section className="glass-card">
          <form onSubmit={handleSubmit} className="form-grid">
            
            <div className="form-group full-width">
              <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} color="var(--accent)"/>
                Applicant Profile
              </h3>
            </div>

            <div className="form-group">
              <label>Education</label>
              <select name="education" value={formData.education} onChange={handleChange} className="form-control">
                <option value="Graduate">Graduate</option>
                <option value="Not Graduate">Not Graduate</option>
              </select>
            </div>

            <div className="form-group">
              <label>Employment</label>
              <select name="self_employed" value={formData.self_employed} onChange={handleChange} className="form-control">
                <option value="Yes">Self Employed</option>
                <option value="No">Salaried (No)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dependents</label>
              <input type="number" min="0" max="10" name="no_of_dependents" value={formData.no_of_dependents} onChange={handleChange} className="form-control" required />
            </div>

            <div className="form-group">
              <label>CIBIL Score</label>
              <input type="number" min="300" max="900" name="cibil_score" value={formData.cibil_score} onChange={handleChange} placeholder="e.g. 750" className="form-control" required />
            </div>


            <div className="form-group full-width" style={{ marginTop: '1rem' }}>
              <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={18} color="var(--accent)"/>
                Financial & Loan Details
              </h3>
            </div>

            <div className="form-group">
              <label>Annual Income (₹)</label>
              <input type="number" name="income_annum" value={formData.income_annum} onChange={handleChange} placeholder="e.g. 1500000" className="form-control" required />
            </div>

            <div className="form-group">
              <label>Loan Amount (₹)</label>
              <input type="number" name="loan_amount" value={formData.loan_amount} onChange={handleChange} placeholder="e.g. 5000000" className="form-control" required />
            </div>

            <div className="form-group">
              <label>Loan Term (Years)</label>
              <select name="loan_term" value={formData.loan_term} onChange={handleChange} className="form-control">
                {[1, 2, 3, 4, 5, 7, 10, 15, 20].map(y => (
                  <option key={y} value={y}>{y} Years</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Bank Asset Value (₹)</label>
              <input type="number" name="bank_asset_value" value={formData.bank_asset_value} onChange={handleChange} className="form-control" />
            </div>

            <button type="submit" disabled={loading} className="submit-btn full-width">
              {loading ? (
                <>Analyzing <span className="loading-dots">...</span></>
              ) : (
                <>Analyze Eligibility <Send size={18} /></>
              )}
            </button>
          </form>
        </section>


        {/* Results Display */}
        <section className="glass-card results-card">
          
          {!result && !loading && !error && (
            <div className="empty-state">
              <BrainCircuit size={64} opacity={0.5} />
              <h2>Awaiting Application</h2>
              <p>Enter the applicant's details and submit to see real-time AI predictions.</p>
            </div>
          )}

          {loading && (
            <div className="empty-state">
              <div className="loading-spinner"></div>
              <h2>AI is processing...</h2>
              <p>Evaluating thousands of data points...</p>
            </div>
          )}

          {error && (
            <div className="empty-state">
              <AlertCircle size={64} color="var(--error)" />
              <h2 style={{color: 'var(--error)'}}>System Error</h2>
              <p>{error}</p>
            </div>
          )}

          {result && !loading && (
            <>
              {/* Dynamic Probability Ring */}
              <div 
                className={`probability-ring ${result.loan_status === "Loan Rejected" ? "rejected" : ""}`}
                style={{ "--p": `${result.approval_probability * 100}%` }}
              >
                <div className="probability-inner">
                  <span className="probability-value">
                    {Math.round(result.approval_probability * 100)}<span style={{fontSize:'1.5rem'}}>%</span>
                  </span>
                  <span className="probability-label">Approval Chance</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`status-badge ${result.loan_status === "Loan Approved" ? "status-approved" : "status-rejected"}`}>
                {result.loan_status === "Loan Approved" ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 /> APPROVED</span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><XCircle /> REJECTED</span>
                )}
              </div>

              {/* Explainability Reasons */}
              <div className="reasons-container">
                <h3 className="reasons-title">
                  <Lightbulb size={20} color="var(--accent)" />
                  AI Decision Breakdown
                </h3>
                
                {result.reasons_for_decision && result.reasons_for_decision.map((reason, idx) => (
                  <div key={idx} className="reason-item">
                    <Sparkles size={16} className="reason-icon" />
                    <span className="reason-text">{reason}</span>
                  </div>
                ))}
                
                {(!result.reasons_for_decision || result.reasons_for_decision.length === 0) && (
                  <div className="reason-item">
                    <span className="reason-text">No distinct top factors identified.</span>
                  </div>
                )}
              </div>
            </>
          )}

        </section>
      </main>

    </div>
  );
}

export default App;
