# AI-Powered Loan Approval Prediction & Analytics Dashboard

An intelligent full-stack application that leverages Machine Learning to predict loan approvals, explain decision rationale using SHAP (SHapley Additive exPlanations), and provide comprehensive analytics for loan portfolios. 

Built for underwriters and financial institutions, this project bridges the gap between black-box AI models and actionable business insights.

## ✨ Key Features

- **🧠 AI Loan Prediction:** Predicts loan approval probabilities based on applicant financial profiles (Income, CIBIL Score, Loan Amount, Dependents, Education, etc.).
- **🔍 Explainable AI (XAI):** Utilizes SHAP values to explain *why* the AI made a decision, breaking down the positive and negative contributing factors for every single application.
- **🎛️ What-If Simulator:** Interactive tool allowing loan officers to tweak an applicant's parameters (like CIBIL score or requested loan amount) in real-time to see how it affects their approval chances.
- **📊 Portfolio Analytics:** A comprehensive dashboard visualizing approval rates, feature comparisons (e.g., Average Income vs Approval Status), and overall portfolio risk distribution.
- **📈 Model Performance Monitoring:** Tracks model drift, data leakage, and prediction accuracy over time.

---

## 🛠️ Technology Stack

**Frontend (Client)**
- **React 19** & **Vite**: Blazing fast UI development.
- **Recharts**: Interactive and responsive data visualizations.
- **Lucide React**: Modern iconography.
- **React Router Dom**: Client-side routing.

**Backend (API)**
- **FastAPI**: High-performance asynchronous Python web framework.
- **SQLAlchemy & SQLite**: ORM and database for storing user accounts and historical applications.
- **Pydantic**: Data validation and serialization.

**Machine Learning (AI)**
- **Scikit-Learn**: Core machine learning model training and inference.
- **SHAP**: Game-theoretic approach to explain the output of any machine learning model.
- **Pandas & NumPy**: Data processing and feature engineering.

---

## 📂 Project Structure

```text
LOAN_APPROVAL/
│
├── backend/                   # FastAPI Backend
│   ├── routers/               # API endpoint handlers (auth, predict, applications)
│   ├── database.py            # SQLite connection setup
│   ├── models.py              # SQLAlchemy database models
│   ├── schemas.py             # Pydantic validation schemas
│   └── main.py                # FastAPI app entry point
│
├── LoanApprovalPrediction/    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components (Sidebar, etc.)
│   │   ├── pages/             # Main views (Dashboard, Analytics, WhatIf, etc.)
│   │   └── App.jsx            # Main React application
│   └── package.json           # Frontend dependencies
│
├── src/                       # Machine Learning Pipeline
│   ├── predict.py             # Model inference & SHAP explainability logic
│   ├── preprocessing.py       # Data cleaning and pipeline processing
│   ├── feature_engineering.py # Feature extraction logic
│   └── evaluate.py            # Model performance tracking
│
├── synthesize_dataset.py      # Script to generate realistic mock loan data
├── requirements.txt           # Python dependencies
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm

### 2. Backend Setup
Navigate to the root directory and install the Python dependencies:
```bash
pip install -r requirements.txt
```

Start the FastAPI server:
```bash
cd backend
uvicorn main:app --reload --port 8000
```
*The backend API will be running at `http://localhost:8000`*

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install npm packages:
```bash
cd LoanApprovalPrediction
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The React application will be available at `http://localhost:5173`*

---

## 🔬 How the AI Works

1. **Prediction Pipeline**: When an application is submitted, the backend routes the financial data to `src/predict.py`.
2. **Preprocessing**: Data goes through `preprocessing.py` where categorical variables are encoded and numerical features are scaled (using `scaler.pkl`).
3. **Inference**: The preprocessed data is fed into the trained ML model (`loan_approval_model.pkl`) to generate a probability score (0-100%).
4. **SHAP Explanation**: The `TreeExplainer` generates SHAP values, assigning a direct quantitative impact to each feature (e.g., "-15% due to low CIBIL score"). This is returned to the frontend to build the "AI Rationale" UI.