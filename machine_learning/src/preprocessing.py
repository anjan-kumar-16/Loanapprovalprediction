import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, FunctionTransformer
from sklearn.compose import ColumnTransformer

def feature_engineering_fn(X):
    X = X.copy()
    X["total_assets"] = X["bank_asset_value"]
    X["loan_to_income"] = X["loan_amount"] / (X["income_annum"] + 1)
    X["loan_to_asset"] = X["loan_amount"] / (X["total_assets"] + 1)
    if 'loan_id' in X.columns:
        X = X.drop(columns=['loan_id'])
    return X

def get_data_and_preprocessor(filepath="data/cleaned_loan.csv"):
    """
    Loads data, splits into train/test, and creates a ColumnTransformer preprocessor.
    """
    print("="*50)
    print("STAGE 3: PREPROCESSING & DATA SPLIT")
    print("="*50)
    
    df = pd.read_csv(filepath)
    
    # Target Encoding
    df['loan_status'] = df['loan_status'].map({'Approved': 1, 'Rejected': 0})
    
    X = df.drop(columns=['loan_status'])
    y = df['loan_status']
    
    # Train / Test Split (80/20, stratify, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    print(f" -> Train set size: {X_train.shape[0]} samples")
    print(f" -> Test set size: {X_test.shape[0]} samples")
    
    feature_engineer = FunctionTransformer(feature_engineering_fn, validate=False)
    
    # Apply once to get the exact columns for ColumnTransformer
    X_train_eng = feature_engineering_fn(X_train)
    
    # Define Numerical and Categorical columns
    # Exclude object columns for numerical
    num_cols = X_train_eng.select_dtypes(include=['int64', 'float64']).columns.tolist()
    cat_cols = X_train_eng.select_dtypes(include=['object', 'category']).columns.tolist()
    
    # Numerical Pipeline: Median Imputation + StandardScaler
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    # Categorical Pipeline: Most-frequent Imputation + OneHotEncoder
    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    # ColumnTransformer
    col_transformer = ColumnTransformer(
        transformers=[
            ('num', num_pipeline, num_cols),
            ('cat', cat_pipeline, cat_cols)
        ],
        remainder='drop'
    )
    
    preprocessor = Pipeline([
        ('feature_engineer', feature_engineer),
        ('col_transformer', col_transformer)
    ])
    
    print(f" -> Configured Preprocessor Pipeline with {len(num_cols)} numerical and {len(cat_cols)} categorical features.")
    return X_train, X_test, y_train, y_test, preprocessor

if __name__ == "__main__":
    import os
    input_file = os.path.join("data", "cleaned_loan.csv")
    if os.path.exists(input_file):
        X_train, X_test, y_train, y_test, preprocessor = get_data_and_preprocessor(input_file)
        
        # Test fitting the preprocessor on train data
        X_train_processed = preprocessor.fit_transform(X_train)
        print(f" -> Preprocessor fit successful. Processed X_train shape: {X_train_processed.shape}")
        print("[SUCCESS] Stage 3 Preprocessing pipeline verified.")
    else:
        print(f"Error: {input_file} not found. Run feature_engineering.py first.")
