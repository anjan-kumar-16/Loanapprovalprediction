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
        pipeline = joblib.load("models/loan_approval_model.pkl")
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
        "no_of_dependents", "education", "self_employed", "income_annum",
        "loan_amount", "loan_term", "cibil_score", "residential_assets_value",
        "commercial_assets_value", "luxury_assets_value", "bank_asset_value"
    ]
    
    for key in required_keys:
        if key not in application_data:
            return {"error": f"Missing required input: {key}"}
            
    # Create DataFrame
    df = pd.DataFrame([application_data])
    
    # Feature Engineering (Dynamically apply what we did in training)
    df["total_assets"] = (
        df["residential_assets_value"] +
        df["commercial_assets_value"] +
        df["luxury_assets_value"] +
        df["bank_asset_value"]
    )
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
        
        # Format explanation
        top_factors = []
        for feature, impact in top_3:
            # Since we selected SHAP values specifically for the PREDICTED class:
            # Positive impact means it pushed TOWARDS the prediction.
            # Negative impact means it pushed AWAY from the prediction.
            if impact > 0:
                direction = f"contributed to {prediction_label.upper()}"
            else:
                direction = f"worked against {prediction_label.upper()}"
            top_factors.append(f"{feature} ({direction})")
            
        return {
            "prediction": prediction_label,
            "approval_probability": float(approval_prob),
            "rejection_probability": float(rejection_prob),
            "top_factors": top_factors
        }
        
    except Exception as e:
        return {"error": f"Prediction failed: {e}"}

if __name__ == "__main__":
    # Test the function with dummy data
    test_applicant = {
        "no_of_dependents": 2,
        "education": "Graduate",
        "self_employed": 1,
        "income_annum": 8000000,
        "loan_amount": 10000000,
        "loan_term": 10,
        "cibil_score": 850,
        "residential_assets_value": 5000000,
        "commercial_assets_value": 1000000,
        "luxury_assets_value": 2000000,
        "bank_asset_value": 1500000
    }
    
    print("="*50)
    print("STAGE 12: PREDICTION & EXPLAINABILITY TEST")
    print("="*50)
    print("Input Data:")
    print(json.dumps(test_applicant, indent=2))
    
    print("\nResult:")
    result = predict_loan(test_applicant)
    print(json.dumps(result, indent=2))
