import pandas as pd
import numpy as np
import shap
import joblib
import matplotlib.pyplot as plt
import os
from preprocessing import get_data_and_preprocessor

def generate_global_shap():
    print("="*50)
    print("STAGE 10: SHAP EXPLAINABILITY (GLOBAL)")
    print("="*50)
    
    # Load model and data
    pipeline = joblib.load("models/loan_approval_model.pkl")
    input_file = os.path.join("data", "engineered_loan.csv")
    X_train, X_test, _, _, preprocessor = get_data_and_preprocessor(input_file)
    
    # Extract model and preprocessor
    model = pipeline.named_steps['model']
    preprocessor = pipeline.named_steps['preprocessor']
    
    # Transform test set to match what the model sees
    X_test_transformed = preprocessor.transform(X_test)
    
    # Extract feature names from ColumnTransformer
    # Categorical features
    cat_encoder = preprocessor.named_transformers_['cat'].named_steps['encoder']
    cat_cols = preprocessor.transformers_[1][2]
    cat_feature_names = cat_encoder.get_feature_names_out(cat_cols).tolist()
    
    # Numerical features
    num_cols = preprocessor.transformers_[0][2]
    
    feature_names = num_cols + cat_feature_names
    
    # Initialize SHAP TreeExplainer
    explainer = shap.TreeExplainer(model)
    
    # We only take a subset for speed in summary plot
    X_sample = X_test_transformed[:500]
    shap_values = explainer.shap_values(X_sample)
    
    # Depending on the RF configuration, shap_values might be a list (for classification)
    if isinstance(shap_values, list):
        shap_values_class1 = shap_values[1] # Focus on 'Approved' class
    else:
        shap_values_class1 = shap_values
    
    # Generate summary plot
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values_class1, features=X_sample, feature_names=feature_names, show=False)
    
    # Save figure
    os.makedirs(os.path.join("reports", "figures"), exist_ok=True)
    plt.savefig("reports/figures/shap_summary.png", bbox_inches='tight')
    plt.close()
    
    print("[SUCCESS] Global SHAP summary plot saved to reports/figures/shap_summary.png")
    
if __name__ == "__main__":
    generate_global_shap()
