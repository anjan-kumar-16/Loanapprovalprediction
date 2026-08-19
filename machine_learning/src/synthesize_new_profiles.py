import pandas as pd
import numpy as np
import os

def generate_synthetic_data(input_path, output_path):
    print("="*50)
    print("SYNTHESIZING DATA FOR NEW PROFILES")
    print("="*50)
    
    # Load original dataset
    df = pd.read_csv(input_path)
    df.columns = df.columns.str.strip()
    
    # 1. Generate 2500 "New to Credit" (CIBIL = 0) records
    print("Generating 2500 'New to Credit' records (CIBIL = 0)...")
    np.random.seed(42)
    
    new_to_credit = df.sample(n=2500, replace=True, random_state=42).reset_index(drop=True)
    new_to_credit['cibil_score'] = 0
    
    # Set loan_status based on income vs loan amount for new to credit
    new_to_credit['loan_status'] = ' Rejected'
    approve_mask_ntc = (new_to_credit['income_annum'] > new_to_credit['loan_amount'] * 0.4) & (new_to_credit['bank_asset_value'] > new_to_credit['loan_amount'] * 0.5)
    new_to_credit.loc[approve_mask_ntc, 'loan_status'] = ' Approved'
    
    # 2. Generate 2500 "Farmer" records
    print("Generating 2500 'Farmer' records...")
    farmers = df.sample(n=2500, replace=True, random_state=123).reset_index(drop=True)
    
    # For farmers we will use the string ' Farmer' to match categorical formatting if any
    # Wait, in the original dataset 'employment_type' is 0 or 1 according to the view_file of LOAN1.csv:
    # 1,2,Graduate,0,9600000,29900000,144,778,8000000,Approved
    # So 0 and 1 are integers. If we introduce ' Farmer' (a string), this column becomes mixed type.
    # To keep it safe, let's cast the original 0 to '0' and 1 to '1' or ' Employed' / ' Unemployed'?
    # Let's map 0 to 'Unemployed' and 1 to 'Employed' first, or simply use 'Farmer' and cast all to string.
    # The preprocessor handles strings as categories perfectly.
    df['employment_type'] = df['employment_type'].astype(str)
    new_to_credit['employment_type'] = new_to_credit['employment_type'].astype(str)
    
    farmers['employment_type'] = 'Farmer'
    
    # Farmers usually have lower stated income but high land asset value
    farmers['income_annum'] = np.random.randint(100000, 1000000, 2500)
    farmers['bank_asset_value'] = np.random.randint(1000000, 20000000, 2500)
    
    # Set loan_status based on asset value
    farmers['loan_status'] = ' Rejected'
    approve_mask_farmer = (farmers['bank_asset_value'] > farmers['loan_amount'] * 1.5)
    farmers.loc[approve_mask_farmer, 'loan_status'] = ' Approved'
    
    # Concatenate all
    df_combined = pd.concat([df, new_to_credit, farmers], ignore_index=True)
    
    # Fix the loan_id
    if 'loan_id' in df_combined.columns:
        df_combined['loan_id'] = range(1, len(df_combined) + 1)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    df_combined.to_csv(output_path, index=False)
    
    print(f"[SUCCESS] Synthesized dataset saved to {output_path}")
    print(f"Original shape: {df.shape}")
    print(f"New shape: {df_combined.shape}")

if __name__ == "__main__":
    import sys
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_file = os.path.join(base_dir, "data", "raw", "LOAN1.csv")
    output_file = os.path.join(base_dir, "data", "LOAN1.csv")
    
    if not os.path.exists(input_file):
        print(f"File not found: {input_file}")
        sys.exit(1)
        
    generate_synthetic_data(input_file, output_file)
