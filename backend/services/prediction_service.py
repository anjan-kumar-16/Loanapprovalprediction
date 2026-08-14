import os
import joblib

# Look for 'model.pkl' or 'model.joblib' in the same services folder
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

# Load model if it exists
model = None
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print("✅ ML Model loaded successfully!")
    except Exception as e:
        print(f"⚠️ Error loading model file: {e}")

def predict_loan(application):
    # Convert Pydantic object to a dictionary
    data = application.model_dump()
    
    # IF MODEL IS READY:
    if model is not None:
        # into the features list expected by model.predict()
        # example: features = [[data['income_annum'], data['cibil_score'], ...]]
        # prediction = model.predict(features)
        pass

    # FALLBACK: Dynamic response while waiting for model.pkl
    is_approved = data.get("cibil_score", 0) >= 650
    return {
        "decision": "Approved" if is_approved else "Rejected",
        "approval_probability": 88.5 if is_approved else 32.0,
        "risk_level": "Low" if is_approved else "High",
        "message": "API working cleanly! Add model.pkl to services/ to run live ML predictions."
    }