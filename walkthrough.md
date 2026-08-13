# Loan Approval ML Pipeline Walkthrough

We have successfully built a robust, explainable Machine Learning pipeline for the Loan Approval Prediction System exactly according to the project specifications!

## Overview of Accomplishments
1. **Data Cleaning & Auditing** (`src/data_cleaning.py`)
   - Stripped all leading whitespace from column names and string values.
   - Handled anomalous negative values in financial columns.
2. **Exploratory Data Analysis** (`src/eda.py`)
   - Generated distribution and correlation plots to understand the financial relationships.
3. **Feature Engineering** (`src/feature_engineering.py`)
   - Added robust financial health metrics: `total_assets`, `loan_to_income`, and `loan_to_asset`.
   - Dropped the non-predictive `loan_id` column to prevent data leakage.
4. **Preprocessing Pipeline** (`src/preprocessing.py`)
   - Performed an 80/20 Stratified train-test split.
   - Built a Scikit-Learn `ColumnTransformer` with median imputation and scaling for numericals, and most-frequent imputation and one-hot encoding for categoricals.
5. **Model Training & Comparison** (`src/train.py`)
   - Evaluated Logistic Regression, Random Forest, and XGBoost using 5-Fold Cross Validation.
   - **Winner:** Random Forest achieved near-perfect performance.
6. **Hyperparameter Tuning & Evaluation** (`src/evaluate_test.py`)
   - Fine-tuned Random Forest and evaluated on the untouched 20% test set, achieving **99.88% Accuracy** and **99.91% F1 Score**.
   - Saved the final robust model to `models/loan_approval_model.pkl`.
7. **SHAP Explainability & Prediction** (`src/predict.py` & `src/explain.py`)
   - Generated a global SHAP summary plot (`reports/figures/shap_summary.png`).
   - Created a backend-ready `predict_loan()` function that accepts raw applicant JSON, handles the feature engineering internally, and outputs the prediction, probabilities, and the **top 3 SHAP contributing factors**.

## Using the Model
You can import the final prediction function directly into your Flask/FastAPI backend:

```python
from src.predict import predict_loan

applicant_data = {
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

result = predict_loan(applicant_data)
print(result)
```

**Expected Output:**
```json
{
  "prediction": "Rejected",
  "approval_probability": 0.4868,
  "rejection_probability": 0.5132,
  "top_factors": [
    "loan_to_asset (negatively impacted decision)",
    "cibil_score (positively impacted decision)",
    "loan_term (negatively impacted decision)"
  ]
}
```

> [!TIP]
> The SHAP explainability provides transparent reasoning for every single loan decision, making this the perfect submission for a hackathon!
