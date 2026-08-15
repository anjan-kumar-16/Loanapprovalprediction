import { BrainCircuit, ShieldCheck, BarChart3 } from "lucide-react";
import "./PredictionLoading.css";

function PredictionLoading() {
  return (
    <div className="prediction-loading-page">
      <div className="loading-card">

        <div className="ai-loader">
          <div className="loader-ring"></div>
          <BrainCircuit size={38} />
        </div>

        <span className="loading-label">
          AI LOAN ANALYSIS
        </span>

        <h1>
          Analyzing Your Application
        </h1>

        <p>
          Our AI model is evaluating your financial
          information and calculating your loan eligibility.
        </p>

        <div className="loading-progress">
          <div className="loading-progress-bar"></div>
        </div>

        <span className="processing-text">
          Processing prediction...
        </span>

        <div className="analysis-items">

          <div className="analysis-item">
            <ShieldCheck size={17} />
            <span>Checking credit history</span>
            <b>✓</b>
          </div>

          <div className="analysis-item">
            <BarChart3 size={17} />
            <span>Analyzing income profile</span>
            <b>✓</b>
          </div>

          <div className="analysis-item">
            <BrainCircuit size={17} />
            <span>Running AI prediction model</span>
            <i></i>
          </div>

        </div>

      </div>
    </div>
  );
}

export default PredictionLoading;