import pandas as pd
import numpy as np
import os
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_predict

from preprocessing import get_data_and_preprocessor
from evaluate import evaluate_model

def train_logistic_regression():
    print("="*50)
    print("STAGE 4: TRAIN LOGISTIC REGRESSION (BASELINE)")
    print("="*50)
    
    input_file = os.path.join("data", "engineered_loan.csv")
    X_train, X_test, y_train, y_test, preprocessor = get_data_and_preprocessor(input_file)
    
    # Define model
    model = LogisticRegression(random_state=42, max_iter=1000)
    
    # Create Pipeline
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('model', model)
    ])
    
    # We evaluate using Cross-Validation on the training data so we don't touch the test set
    print("\nRunning 5-Fold Cross Validation on Training Data...")
    
    # We can fit the pipeline fully on train data and predict
    # But to get clean metrics without touching test data, let's use cross_val_predict
    y_pred_cv = cross_val_predict(pipeline, X_train, y_train, cv=5)
    
    # Fit the pipeline on the full training data
    pipeline.fit(X_train, y_train)
    
    # Generate probabilities using cross_val_predict (method='predict_proba')
    y_prob_cv = cross_val_predict(pipeline, X_train, y_train, cv=5, method='predict_proba')[:, 1]
    
    # We will create a dummy model class to pass into our evaluate_model function
    class CVModel:
        def predict(self, X): return y_pred_cv
        def predict_proba(self, X):
            return np.column_stack((1 - y_prob_cv, y_prob_cv))
            
    dummy_model = CVModel()
    
    # Evaluate (passing X_train just as a dummy parameter since predict is overridden)
    results = evaluate_model(dummy_model, X_train, y_train, "Logistic Regression (CV)")
    
    # Save the model
    os.makedirs("models", exist_ok=True)
    joblib.dump(pipeline, "models/logistic_regression_baseline.pkl")
    print("\n[SUCCESS] Saved Logistic Regression baseline to models/logistic_regression_baseline.pkl")
    
    # Save results to a CSV
    os.makedirs("reports", exist_ok=True)
    
    # Append or create
    if os.path.exists("reports/model_comparison.csv"):
        df_results = pd.read_csv("reports/model_comparison.csv")
        df_results = pd.concat([df_results, pd.DataFrame([results])], ignore_index=True)
    else:
        df_results = pd.DataFrame([results])
        
    df_results.to_csv("reports/model_comparison.csv", index=False)

def train_random_forest():
    from sklearn.ensemble import RandomForestClassifier
    
    print("\n" + "="*50)
    print("STAGE 5: TRAIN RANDOM FOREST")
    print("="*50)
    
    input_file = os.path.join("data", "engineered_loan.csv")
    X_train, X_test, y_train, y_test, preprocessor = get_data_and_preprocessor(input_file)
    
    model = RandomForestClassifier(random_state=42, n_estimators=100)
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('model', model)
    ])
    
    print("\nRunning 5-Fold Cross Validation on Training Data...")
    y_pred_cv = cross_val_predict(pipeline, X_train, y_train, cv=5)
    
    pipeline.fit(X_train, y_train)
    y_prob_cv = cross_val_predict(pipeline, X_train, y_train, cv=5, method='predict_proba')[:, 1]
    
    class CVModel:
        def predict(self, X): return y_pred_cv
        def predict_proba(self, X): return np.column_stack((1 - y_prob_cv, y_prob_cv))
            
    dummy_model = CVModel()
    results = evaluate_model(dummy_model, X_train, y_train, "Random Forest (CV)")
    
    joblib.dump(pipeline, "models/random_forest.pkl")
    print("\n[SUCCESS] Saved Random Forest to models/random_forest.pkl")
    
    df_results = pd.read_csv("reports/model_comparison.csv")
    df_results = pd.concat([df_results, pd.DataFrame([results])], ignore_index=True)
    df_results.to_csv("reports/model_comparison.csv", index=False)

def train_xgboost():
    from xgboost import XGBClassifier
    
    print("\n" + "="*50)
    print("STAGE 6: TRAIN XGBOOST")
    print("="*50)
    
    input_file = os.path.join("data", "engineered_loan.csv")
    X_train, X_test, y_train, y_test, preprocessor = get_data_and_preprocessor(input_file)
    
    model = XGBClassifier(random_state=42, use_label_encoder=False, eval_metric='logloss')
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('model', model)
    ])
    
    print("\nRunning 5-Fold Cross Validation on Training Data...")
    y_pred_cv = cross_val_predict(pipeline, X_train, y_train, cv=5)
    
    pipeline.fit(X_train, y_train)
    y_prob_cv = cross_val_predict(pipeline, X_train, y_train, cv=5, method='predict_proba')[:, 1]
    
    class CVModel:
        def predict(self, X): return y_pred_cv
        def predict_proba(self, X): return np.column_stack((1 - y_prob_cv, y_prob_cv))
            
    dummy_model = CVModel()
    results = evaluate_model(dummy_model, X_train, y_train, "XGBoost (CV)")
    
    joblib.dump(pipeline, "models/xgboost.pkl")
    print("\n[SUCCESS] Saved XGBoost to models/xgboost.pkl")
    
    df_results = pd.read_csv("reports/model_comparison.csv")
    df_results = pd.concat([df_results, pd.DataFrame([results])], ignore_index=True)
    df_results.to_csv("reports/model_comparison.csv", index=False)
    
if __name__ == "__main__":
    train_logistic_regression()
    train_random_forest()
    train_xgboost()
