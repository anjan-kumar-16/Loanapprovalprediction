from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import datetime
import random
import uuid
from schemas import LoanApplication
import models
from database import get_db
from src.predict import predict_loan

router = APIRouter(prefix="/api", tags=["predict"])

@router.post("/predict")
def get_prediction(application: LoanApplication, db: Session = Depends(get_db)):
    try:
        ml_input = {
            "no_of_dependents": int(application.no_of_dependents),
            "education": application.education.strip(),
            "employment_type": 1 if application.employment_type == "Employed" else 0,
            "income_annum": application.income_annum,
            "loan_amount": application.loan_amount,
            "loan_term": application.loan_term * 12,
            "cibil_score": application.cibil_score,
            "bank_asset_value": application.bank_asset_value,
        }
        
        result = predict_loan(ml_input)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        if not application.is_whatif:
            db_app = models.Application(
                application_id=f"LA-{str(uuid.uuid4())[:8].upper()}",
                name=application.name if application.name else "Applicant",
                no_of_dependents=int(application.no_of_dependents),
                education=application.education,
                self_employed=application.employment_type,
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

@router.post("/simulate")
def simulate_approval(application: LoanApplication):
    try:
        base_input = {
            "no_of_dependents": int(application.no_of_dependents),
            "education": application.education.strip(),
            "employment_type": 1 if application.employment_type == "Employed" else 0,
            "income_annum": application.income_annum,
            "loan_amount": application.loan_amount,
            "loan_term": application.loan_term * 12,
            "cibil_score": application.cibil_score,
            "bank_asset_value": application.bank_asset_value,
        }
        
        result = predict_loan(base_input)
        if result.get("loan_status") == "Loan Approved":
            return {"message": "You are already approved!"}
            
        sim_input = base_input.copy()
        step_amount = max(100000, sim_input["loan_amount"] * 0.05)
        max_iterations = 20
        iterations = 0
        while sim_input["loan_amount"] > 0 and iterations < max_iterations:
            sim_input["loan_amount"] -= step_amount
            sim_result = predict_loan(sim_input)
            if sim_result.get("loan_status") == "Loan Approved":
                return {
                    "feature_changed": "loan_amount",
                    "original_value": base_input["loan_amount"],
                    "required_value": sim_input["loan_amount"],
                    "message": f"If you reduce your loan amount to ₹{sim_input['loan_amount']:,.0f}, you have a high chance of approval."
                }
            iterations += 1
                
        sim_input = base_input.copy()
        step_asset = max(100000, sim_input["income_annum"] * 0.1)
        max_asset = base_input["bank_asset_value"] + (base_input["income_annum"] * 5)
        iterations = 0
        while sim_input["bank_asset_value"] < max_asset and iterations < max_iterations:
            sim_input["bank_asset_value"] += step_asset
            sim_result = predict_loan(sim_input)
            if sim_result.get("loan_status") == "Loan Approved":
                return {
                    "feature_changed": "bank_asset_value",
                    "original_value": base_input["bank_asset_value"],
                    "required_value": sim_input["bank_asset_value"],
                    "message": f"If you increase your bank assets/savings to ₹{sim_input['bank_asset_value']:,.0f}, you have a high chance of approval."
                }
            iterations += 1
                
        return {"message": "We could not find a simple single-factor adjustment to approve this loan. Try improving your CIBIL score."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
