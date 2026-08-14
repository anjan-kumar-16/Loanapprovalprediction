from fastapi import FastAPI
from backend.schemas import LoanApplication

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.predict import predict_loan
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Loan Approval Prediction API",
    description="Backend API for predicting loan approval and providing applicant insights.",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Allows requests from any origin (e.g. React, Next.js, HTML files)
    allow_credentials=True,
    allow_methods=["*"],        # Allows all HTTP methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],        # Allows all custom headers
)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Loan Approval Prediction API",
        "version": "1.0.0"
    }

@app.get("/")
def home():
    return {
        "message": "Loan Approval API is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/predict")
def predict(application: LoanApplication):
    # Convert Pydantic object to dict so predict_loan can read it
    data = application.model_dump()
    result = predict_loan(data)
    return result