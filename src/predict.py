import pandas as pd
import numpy as np
import joblib
import shap
import json

def load_model_and_explainer():
    """
    Loads the pipeline and initializes the SHAP explainer
    """
    try:
        import os
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "models", "loan_approval_model.pkl")
        pipeline = joblib.load(model_path)
        model = pipeline.named_steps['model']
        explainer = shap.TreeExplainer(model)
        return pipeline, explainer
    except Exception as e:
        raise RuntimeError(f"Could not load model or initialize SHAP: {e}")

# Pre-load to avoid doing it per-request
try:
    PIPELINE, EXPLAINER = load_model_and_explainer()
except:
    PIPELINE, EXPLAINER = None, None

def get_feature_names(preprocessor):
    """Extract feature names from the ColumnTransformer"""
    cat_encoder = preprocessor.named_transformers_['cat'].named_steps['encoder']
    cat_cols = preprocessor.transformers_[1][2]
    cat_feature_names = cat_encoder.get_feature_names_out(cat_cols).tolist()
    
    num_cols = preprocessor.transformers_[0][2]
    return num_cols + cat_feature_names

def predict_loan(application_data):
    """
    Predicts loan approval and provides explainability.
    Accepts a dictionary of applicant data.
    """
    if PIPELINE is None or EXPLAINER is None:
        return {"error": "Model not loaded."}
        
    # Validate Input
    required_keys = [
        "no_of_dependents", "education", "employment_type", "income_annum",
        "loan_amount", "loan_term", "cibil_score", "bank_asset_value"
    ]
    
    for key in required_keys:
        if key not in application_data:
            return {"error": f"Missing required input: {key}"}
            
    # Create DataFrame
    df = pd.DataFrame([application_data])
    
    # Feature Engineering (Dynamically apply what we did in training)
    df["total_assets"] = df["bank_asset_value"]
    df["loan_to_income"] = df["loan_amount"] / (df["income_annum"] + 1)
    df["loan_to_asset"] = df["loan_amount"] / (df["total_assets"] + 1)
    
    # Predict
    try:
        # Preprocess and Predict
        preprocessor = PIPELINE.named_steps['preprocessor']
        X_transformed = preprocessor.transform(df)
        
        prediction_num = PIPELINE.predict(df)[0]
        prediction_label = "Approved" if prediction_num == 1 else "Rejected"
        
        probabilities = PIPELINE.predict_proba(df)[0]
        rejection_prob = round(probabilities[0], 4)
        approval_prob = round(probabilities[1], 4)
        
        # SHAP Explainability
        shap_values = EXPLAINER.shap_values(X_transformed)
        
        # We want to explain the PREDICTED class (if rejected, explain rejection)
        if isinstance(shap_values, list):
            shap_values_target = shap_values[prediction_num][0]
        else:
            if len(shap_values.shape) == 3:
                shap_values_target = shap_values[0, :, prediction_num]
            else:
                # Binary classification often returns SHAP for class 1 only.
                # If predicted class is 0 (Rejected), we invert the values 
                # so that a positive value means "contributed to Rejection".
                shap_values_target = shap_values[0] if prediction_num == 1 else -shap_values[0]
            
        feature_names = get_feature_names(preprocessor)
        
        # Combine feature names with their absolute SHAP values to find top factors
        shap_dict = {feat: val for feat, val in zip(feature_names, shap_values_target)}
        
        # Sort by absolute impact
        sorted_shap = sorted(shap_dict.items(), key=lambda x: abs(x[1]), reverse=True)
        top_3 = sorted_shap[:3]
        
        # Actionable Suggestions Mapping
        SUGGESTIONS = {
            "cibil_score": "Work on improving your CIBIL score by paying off existing debts on time.",
            "loan_to_asset": "Consider applying for a smaller loan amount or wait until your asset value increases.",
            "loan_to_income": "Consider applying for a smaller loan amount to reduce your debt-to-income ratio.",
            "loan_amount": "Requesting a smaller loan amount may improve your chances of approval.",
            "loan_term": "Try adjusting your loan term (a longer term reduces monthly burden).",
            "income_annum": "Increasing your co-applicant's income or showing additional income sources may help.",
            "bank_asset_value": "Increasing your bank balance and savings can improve your approval odds."
        }
        
        # Format explanation
        reasons = []
        suggestions = set()
        
        for feature, impact in top_3:
            # Clean up the feature name for the frontend (e.g., 'loan_to_asset' -> 'Loan To Asset')
            clean_feature = feature.replace('_', ' ').title()
            
            if impact > 0:
                direction = f"contributed to the {prediction_label.lower()} decision"
                # If rejected, and this feature contributed to the rejection, offer a suggestion
                if prediction_num == 0 and feature in SUGGESTIONS:
                    suggestions.add(SUGGESTIONS[feature])
            else:
                direction = f"worked against the {prediction_label.lower()} decision"
                
            reasons.append(f"{clean_feature} {direction}")
            
        result = {
            "loan_status": f"Loan {prediction_label}",
            "approval_probability": float(approval_prob),
            "rejection_probability": float(rejection_prob),
            "reasons_for_decision": reasons
        }
        
        # Dynamic Risk-Based Interest Rate & EMI (if approved)
        if prediction_num == 1:
            # Map probability 0.5-1.0 to Interest Rate 14% to 6%
            # The safer you are, the lower the interest rate
            normalized_prob = max(0, min(1, (approval_prob - 0.5) / 0.5))
            annual_interest_rate = 14.0 - (normalized_prob * 8.0)
            
            # EMI Calculation
            P = application_data["loan_amount"]
            r = annual_interest_rate / 12 / 100
            n = application_data["loan_term"] * 12
            if r > 0 and n > 0:
                emi = (P * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)
            else:
                emi = P / n if n > 0 else 0
                
            result["interest_rate"] = round(annual_interest_rate, 2)
            result["estimated_emi"] = round(emi, 2)
        
        # Only add suggestions if the loan was rejected
        if prediction_num == 0 and suggestions:
            result["improvement_suggestions"] = list(suggestions)
            
        return result
        
    except Exception as e:
        return {"error": f"Prediction failed: {e}"}

if __name__ == "__main__":
    # Test the function with dummy data
    test_applicant = {
        "no_of_dependents": 4,
        "education": " Not Graduate",
        "employment_type": 1,
        "income_annum": 250000,
        "loan_amount": 500000,
        "loan_term": 60,
        "cibil_score": 810,
        "bank_asset_value": 8500000
    }
    
    print("="*50)
    print("STAGE 12: PREDICTION & EXPLAINABILITY TEST")
    print("="*50)
    print("Input Data:")
    print(json.dumps(test_applicant, indent=2))
    
    print("\nResult:")
    result = predict_loan(test_applicant)
    print(json.dumps(result, indent=2))
