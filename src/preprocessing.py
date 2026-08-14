import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

def get_data_and_preprocessor(filepath="data/engineered_loan.csv"):
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
    
    # Define Numerical and Categorical columns
    # Exclude object columns for numerical
    num_cols = X_train.select_dtypes(include=['int64', 'float64']).columns.tolist()
    cat_cols = X_train.select_dtypes(include=['object', 'category']).columns.tolist()
    
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
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_pipeline, num_cols),
            ('cat', cat_pipeline, cat_cols)
        ],
        remainder='drop'
    )
    
    print(f" -> Configured ColumnTransformer with {len(num_cols)} numerical and {len(cat_cols)} categorical features.")
    return X_train, X_test, y_train, y_test, preprocessor

if __name__ == "__main__":
    import os
    input_file = os.path.join("data", "engineered_loan.csv")
    if os.path.exists(input_file):
        X_train, X_test, y_train, y_test, preprocessor = get_data_and_preprocessor(input_file)
        
        # Test fitting the preprocessor on train data
        X_train_processed = preprocessor.fit_transform(X_train)
        print(f" -> Preprocessor fit successful. Processed X_train shape: {X_train_processed.shape}")
        print("[SUCCESS] Stage 3 Preprocessing pipeline verified.")
    else:
        print(f"Error: {input_file} not found. Run feature_engineering.py first.")
