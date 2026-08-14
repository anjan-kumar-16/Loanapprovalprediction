import sys
import os

# Add the parent directory to sys.path so we can import src
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from src.predict import predict_loan

app = FastAPI(title="AI Loan Approval API")

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoanApplication(BaseModel):
    no_of_dependents: str
    education: str
    self_employed: str
    income_annum: float
    loan_amount: float
    loan_term: float
    cibil_score: float
    bank_asset_value: Optional[float] = 0

@app.post("/api/predict")
def get_prediction(application: LoanApplication):
    try:
        # Map frontend schema to ML backend schema
        ml_input = {
            "no_of_dependents": int(application.no_of_dependents),
            "education": application.education.strip(),
            "employment_type": 1 if application.self_employed == "Yes" else 0,
            "income_annum": application.income_annum,
            "loan_amount": application.loan_amount,
            "loan_term": application.loan_term,
            "cibil_score": application.cibil_score,
            "bank_asset_value": application.bank_asset_value,
        }
        
        result = predict_loan(ml_input)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}
