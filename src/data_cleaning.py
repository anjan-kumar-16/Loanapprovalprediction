import pandas as pd
import numpy as np
import os

def clean_data(input_path, output_path):
    print("="*50)
    print("STAGE 2: DATA CLEANING PIPELINE")
    print("="*50)

    # Load data
    df = pd.read_csv(input_path)
    initial_rows, initial_cols = df.shape
    print(f"\nLoaded dataset with {initial_rows} rows and {initial_cols} columns.")

    # 1. Clean Column Names
    # What was found: Leading spaces in column names
    # Why it matters: Causes issues when accessing columns (e.g. ' loan_amount' vs 'loan_amount')
    old_cols = df.columns.tolist()
    df.columns = df.columns.str.strip()
    changed_cols = sum([1 for o, n in zip(old_cols, df.columns) if o != n])
    print(f"\n[CLEANING] Stripped leading spaces from column names.")
    print(f"  -> Affected columns: {changed_cols}")

    # 2. Clean Categorical Whitespaces
    # What was found: Leading spaces in categorical values (e.g. ' Approved')
    # Why it matters: Causes issues in encoding and matching strings
    cat_cols = df.select_dtypes(include=['object']).columns
    rows_affected_cat = 0
    for col in cat_cols:
        before = df[col].copy()
        df[col] = df[col].str.strip()
        rows_affected_cat += (before != df[col]).sum()
    print(f"\n[CLEANING] Stripped leading spaces from categorical values.")
    print(f"  -> Affected rows (across all categorical columns): {rows_affected_cat}")

    # 3. Duplicate Records
    # What was found: Exact duplicate rows
    # Why it matters: Duplicates can bias model training and leak into the test set
    duplicates = df.duplicated().sum()
    if duplicates > 0:
        df = df.drop_duplicates()
        print(f"\n[CLEANING] Dropped {duplicates} duplicate records.")
    else:
        print(f"\n[CLEANING] Checked duplicates: 0 found.")
        
    # Check duplicate IDs
    if 'loan_id' in df.columns:
        dup_ids = df['loan_id'].duplicated().sum()
        if dup_ids > 0:
            df = df.drop_duplicates(subset=['loan_id'])
            print(f"\n[CLEANING] Dropped {dup_ids} records with duplicate loan_ids.")
        else:
            print(f"\n[CLEANING] Checked duplicate IDs: 0 found.")

    # 4. Missing Values
    # What was found: Missing values (np.nan or empty strings)
    # Why it matters: Scikit-learn algorithms generally cannot handle missing values
    missing = df.isnull().sum().sum()
    if missing > 0:
        for col in df.columns:
            if df[col].isnull().sum() > 0:
                if df[col].dtype == 'object':
                    mode_val = df[col].mode()[0]
                    df[col] = df[col].fillna(mode_val)
                    print(f"  -> Imputed missing values in categorical column '{col}' with most frequent value.")
                else:
                    median_val = df[col].median()
                    df[col] = df[col].fillna(median_val)
                    print(f"  -> Imputed missing values in numerical column '{col}' with median.")
        print(f"\n[CLEANING] Handled missing values. Affected entries: {missing}")
    else:
        print(f"\n[CLEANING] Checked missing values: 0 found.")

    # 5. Invalid values check (Negative financials, impossible terms)
    # What was found: Negative financial values or invalid terms
    # Why it matters: Negative income or loan amounts are data entry errors and distort modeling.
    financial_cols = ['income_annum', 'loan_amount', 'bank_asset_value']
    
    invalid_financial_rows = 0
    for col in financial_cols:
        if col in df.columns:
            negatives = df[df[col] < 0]
            if not negatives.empty:
                invalid_financial_rows += len(negatives)
                # Cap at 0 or drop. Since instruction says don't unnecessarily remove, we'll cap at 0
                df.loc[df[col] < 0, col] = 0
    
    if invalid_financial_rows > 0:
        print(f"\n[CLEANING] Fixed negative values in financial columns (capped at 0).")
        print(f"  -> Affected rows: {invalid_financial_rows}")
    else:
        print(f"\n[CLEANING] Checked negative financial values: 0 found.")

    # 6. Verify Target Values
    if 'loan_status' in df.columns:
        print(f"\n[TARGET IDENTIFICATION]")
        print(f"Target column: loan_status")
        print(f"Unique values: {df['loan_status'].unique().tolist()}")
        print(f"Class distribution:\n{df['loan_status'].value_counts().to_string()}")

    # Save cleaned dataset
    df.to_csv(output_path, index=False)
    print(f"\n[SUCCESS] Cleaned data saved to {output_path}")
    print(f"Final shape: {df.shape}")

if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    input_file = os.path.join("data", "loan.csv")
    output_file = os.path.join("data", "cleaned_loan.csv")
    if os.path.exists(input_file):
        clean_data(input_file, output_file)
    else:
        print(f"Error: {input_file} not found.")
