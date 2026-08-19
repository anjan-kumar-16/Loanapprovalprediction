<div align="center">
  
  # 🏦 AI-Powered Loan Approval & Portfolio Analytics
  
  **An intelligent, full-stack predictive analytics platform bridging the gap between black-box ML models and actionable financial insights.**

  [![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org)
  [![FastAPI](https://img.shields.io/badge/FastAPI-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E.svg?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Open-informational?style=flat&logo=internet-explorer&logoColor=white&color=2b85d8)](https://loanapprovalprediction-1-sh9t.onrender.com/)

</div>

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Live Demo](#-live-demo)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [How the AI Works](#-how-the-ai-works)

---

## 🎯 About the Project

Traditional loan approval systems often rely on rigid rule-based logic or opaque machine learning models that offer no explanation for their decisions. 

This platform leverages **Machine Learning** to accurately predict loan approvals and utilizes **SHAP (SHapley Additive exPlanations)** to provide transparent, human-readable rationale for every decis[...] 

---

## ✨ Key Features

- **🧠 AI Loan Prediction:** Predicts loan approval probabilities based on an applicant's holistic financial profile (Income, CIBIL Score, Loan Amount, Dependents, Education).
- **🔍 Explainable AI (XAI):** Breaks down the positive and negative contributing factors for every application using SHAP values.
- **🎛️ What-If Simulator:** An interactive sandbox allowing loan officers to tweak an applicant's parameters (like CIBIL score or requested loan amount) in real-time to see how it affects the a[...] 
- **📊 Portfolio Analytics:** A comprehensive dashboard visualizing approval rates, feature comparisons (e.g., Average Income vs Approval Status), and overall portfolio risk distribution.
- **📈 Performance Monitoring:** Tracks model drift, data leakage, and real-time prediction accuracy to ensure the AI remains unbiased and effective.

---

## 🚀 Live Demo

A professionally hosted live demo is available for evaluation and demonstration. It showcases the application's core capabilities, including the loan prediction interface, SHAP-based explanations, and portfolio analytics dashboards.

Visit the live demo: https://loanapprovalprediction-1-sh9t.onrender.com/

Professional notes:
- This instance is intended for demonstration and testing only; it may contain synthetic or anonymized sample data.
- For production deployment, ensure secure configuration, HTTPS, access controls, and compliance with applicable data protection regulations.
- If you need a dedicated demo environment, integration support, or have questions about deployment, please contact the repository owner.

---

## 🏗️ System Architecture

```mermaid
graph TD;
    Client[React Frontend] -->|REST API calls| API(FastAPI Backend)
    API -->|Read/Write| DB[(PostgreSQL Database)]
    API -->|Input Data| ML[ML Pipeline]
    ML -->|Preprocessing| Pre[StandardScaler]
    Pre -->|Model Inference| RF[Random Forest Model]
    RF -->|Explainability| SHAP[SHAP TreeExplainer]
    SHAP -->|Rationale| API
    RF -->|Probability Score| API
    API -->|JSON Response| Client
```

---

## 🛠️ Technology Stack

| Category | Technologies |
| --- | --- |
| **Frontend** | React 19, Vite, Recharts, Lucide React, React Router Dom |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy, Pydantic |
| **Machine Learning** | Scikit-Learn, XGBoost, SHAP, Pandas, NumPy |
| **Database** | PostgreSQL |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm
- **PostgreSQL** (local or hosted)

### 2. Backend Setup

Navigate to the project root and install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory (or your environment) with the database connection URL and any other secrets the backend needs. Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/loan_db
```

Start the FastAPI development server:

```bash
cd backend
uvicorn main:app --reload --port 8000
```
> **Note:** The backend API will be running at `http://localhost:8000`. You can view the interactive API documentation at `http://localhost:8000/docs`.

---

### 3. Frontend Setup

Open a new terminal window, navigate to the `frontend` directory:

```bash
cd frontend
```

**Environment Variables:**
Create a `.env` file in the `frontend` directory and add the backend API URL:
```env
VITE_API_URL=http://localhost:8000
```

Install the npm packages and start the Vite development server:

```bash
npm install
npm run dev
```
> **Note:** The React application will be available at `http://localhost:5173`.

---

## 📂 Project Structure

```text
Loanapprovalprediction/
├── backend/                   # ⚙️ FastAPI Backend
│   ├── routers/               # API endpoint handlers
│   ├── database.py            # Database connection setup
│   ├── models.py              # SQLAlchemy database models
│   ├── schemas.py             # Pydantic validation schemas
│   └── main.py                # FastAPI app entry point
│
├── frontend/                  # 🎨 React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Main views (Dashboard, Analytics, WhatIf)
│   │   └── App.jsx            # Main React application
│   ├── .env                   # Environment variables (create this)
│   └── package.json           # Frontend dependencies
│
├── machine_learning/          # 🧠 Machine Learning Pipeline
│   ├── data/                  # Raw, interim, and processed datasets
│   ├── models/                # Serialized models (.pkl)
│   ├── src/                   # ML source code (predict, train, etc.)
│   └── synthesize_dataset.py  # Mock data generation script
│
├── docs/                      # 📄 Project documentation and artifacts
├── requirements.txt           # Python dependencies
└── README.md                  # Project documentation
```

---

## 🔬 How the AI Works

1. **Prediction Pipeline**: When an application is submitted, the backend routes the financial data to `machine_learning/src/predict.py`.
2. **Preprocessing**: Data passes through the preprocessing pipeline embedded within the model artifacts, where categorical variables are encoded and numerical features are scaled.
3. **Inference**: The preprocessed data is fed into the trained ML model (`loan_approval_model.pkl`) to generate an approval probability score (0-100%).
4. **SHAP Explanation**: The `TreeExplainer` calculates SHAP values, assigning a direct quantitative impact to each feature (e.g., *"-15% due to low CIBIL score"*). This rationale is instantly re[...]
5. **Actionable Suggestions**: If an application is rejected, the system dynamically analyzes the negative SHAP values to provide constructive, targeted advice to the applicant on how to improve[...] 
