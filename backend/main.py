import sys
import os

# Add the parent directory to sys.path so we can import src
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
import datetime
import random

from src.predict import predict_loan
import models
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

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

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Simple hardcoded authentication for the prototype
    if req.username == "manager" and req.password == "password":
        return {"role": "manager", "token": "fake-jwt-token-manager"}
    elif req.username == "applicant" and req.password == "password":
        return {"role": "applicant", "token": "fake-jwt-token-applicant"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/applications")
def get_applications(db: Session = Depends(get_db)):
    applications = db.query(models.Application).all()
    return applications

class StatusUpdateRequest(BaseModel):
    status: str

@app.put("/api/applications/{app_id}/status")
def update_application_status(app_id: str, req: StatusUpdateRequest, db: Session = Depends(get_db)):
    application = db.query(models.Application).filter(models.Application.application_id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = req.status
    db.commit()
    db.refresh(application)
    return application

@app.post("/api/predict")
def get_prediction(application: LoanApplication, db: Session = Depends(get_db)):
    try:
        # Map frontend schema to ML backend schema
        ml_input = {
            "no_of_dependents": int(application.no_of_dependents),
            "education": application.education.strip(),
            "employment_type": 1 if application.self_employed == "Yes" else 0,
            "income_annum": application.income_annum,
            "loan_amount": application.loan_amount,
            "loan_term": application.loan_term * 12, # Convert years to months
            "cibil_score": application.cibil_score,
            "bank_asset_value": application.bank_asset_value,
        }
        
        result = predict_loan(ml_input)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        # Save to MySQL Database
        db_app = models.Application(
            application_id=f"LA-{random.randint(1000, 9999)}",
            name=application.name if hasattr(application, 'name') and application.name else "Applicant",
            no_of_dependents=int(application.no_of_dependents),
            education=application.education,
            self_employed=application.self_employed,
            income_annum=application.income_annum,
            loan_amount=application.loan_amount,
            loan_term=application.loan_term,
            cibil_score=application.cibil_score,
            bank_asset_value=application.bank_asset_value,
            status="Pending",
            ai_recommendation=result["loan_status"],
            probability_score=int(result["approval_probability"] * 100),
            date=datetime.datetime.now().strftime("%d %b %Y")
        )
        db.add(db_app)
        db.commit()
        db.refresh(db_app)
            
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/simulate")
def simulate_approval(application: LoanApplication):
    """
    Finds the exact thresholds for loan_amount or bank_asset_value 
    needed to flip a rejection into an approval.
    """
    try:
        base_input = {
            "no_of_dependents": int(application.no_of_dependents),
            "education": application.education.strip(),
            "employment_type": 1 if application.self_employed == "Yes" else 0,
            "income_annum": application.income_annum,
            "loan_amount": application.loan_amount,
            "loan_term": application.loan_term * 12, # Convert years to months
            "cibil_score": application.cibil_score,
            "bank_asset_value": application.bank_asset_value,
        }
        
        # Check initial state
        result = predict_loan(base_input)
        if result.get("loan_status") == "Loan Approved":
            return {"message": "You are already approved!"}
            
        # 1. Try reducing the loan amount
        sim_input = base_input.copy()
        step_amount = max(100000, sim_input["loan_amount"] * 0.05) # 5% steps or 100k
        while sim_input["loan_amount"] > 0:
            sim_input["loan_amount"] -= step_amount
            sim_result = predict_loan(sim_input)
            if sim_result.get("loan_status") == "Loan Approved":
                return {
                    "feature_changed": "loan_amount",
                    "original_value": base_input["loan_amount"],
                    "required_value": sim_input["loan_amount"],
                    "message": f"If you reduce your loan amount to ₹{sim_input['loan_amount']:,.0f}, you have a high chance of approval."
                }
                
        # 2. Try increasing the asset value
        sim_input = base_input.copy()
        step_asset = max(100000, sim_input["income_annum"] * 0.1) # 10% of income steps
        max_asset = base_input["bank_asset_value"] + (base_input["income_annum"] * 5) # Try up to 5x income
        while sim_input["bank_asset_value"] < max_asset:
            sim_input["bank_asset_value"] += step_asset
            sim_result = predict_loan(sim_input)
            if sim_result.get("loan_status") == "Loan Approved":
                return {
                    "feature_changed": "bank_asset_value",
                    "original_value": base_input["bank_asset_value"],
                    "required_value": sim_input["bank_asset_value"],
                    "message": f"If you increase your bank assets/savings to ₹{sim_input['bank_asset_value']:,.0f}, you have a high chance of approval."
                }
                
        return {"message": "We could not find a simple single-factor adjustment to approve this loan. Try improving your CIBIL score."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics")
def get_metrics():
    # Return metrics based on our latest Random Forest cross-validation
    return {
        "accuracy": 99.6,
        "precision": 99.4,
        "recall": 99.9,
        "f1_score": 99.6,
        "confusion_matrix": {
            "true_positive": 2124,
            "false_positive": 12,
            "true_negative": 1278,
            "false_negative": 1
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
