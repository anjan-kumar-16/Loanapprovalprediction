import pandas as pd
import numpy as np
import os

def engineer_features(df):
    """
    Applies feature engineering to the dataset as specified in the documentation.
    """
    print("="*50)
    print("STAGE 3: FEATURE ENGINEERING")
    print("="*50)
    
    # 1. Total Assets
    df["total_assets"] = (
        df["residential_assets_value"] +
        df["commercial_assets_value"] +
        df["luxury_assets_value"] +
        df["bank_asset_value"]
    )
    print(" -> Added 'total_assets'")
    
    # 2. Loan-to-Income Ratio
    df["loan_to_income"] = df["loan_amount"] / (df["income_annum"] + 1)
    print(" -> Added 'loan_to_income'")
    
    # 3. Loan-to-Asset Ratio
    df["loan_to_asset"] = df["loan_amount"] / (df["total_assets"] + 1)
    print(" -> Added 'loan_to_asset'")
    
    # We can also drop loan_id here to prevent leakage
    if 'loan_id' in df.columns:
        df = df.drop(columns=['loan_id'])
        print(" -> Dropped 'loan_id' (Identifier)")
        
    return df

if __name__ == "__main__":
    input_file = os.path.join("data", "cleaned_loan.csv")
    output_file = os.path.join("data", "engineered_loan.csv")
    
    if os.path.exists(input_file):
        df = pd.read_csv(input_file)
        df_engineered = engineer_features(df)
        df_engineered.to_csv(output_file, index=False)
        print(f"\n[SUCCESS] Feature engineered data saved to {output_file}")
        
        # Create Feature Dictionary
        features = []
        for col in df_engineered.columns:
            dtype = str(df_engineered[col].dtype)
            usage = "Target" if col == "loan_status" else "Feature"
            features.append({"Column": col, "DataType": dtype, "Usage": usage})
            
        feat_dict = pd.DataFrame(features)
        os.makedirs("reports", exist_ok=True)
        feat_dict.to_csv(os.path.join("reports", "feature_dictionary.csv"), index=False)
        print(f"[SUCCESS] Feature dictionary saved to reports/feature_dictionary.csv")
        
    else:
        print(f"Error: {input_file} not found.")
