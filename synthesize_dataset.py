import pandas as pd
import numpy as np

# Load original
df = pd.read_csv('data/LOAN1.csv')
# Clean column names
df.columns = df.columns.str.strip()

# Clean loan_status for comparison
df['loan_status'] = df['loan_status'].str.strip()

print("Original Distribution:")
print(pd.crosstab(df['cibil_score'] >= 550, df['loan_status']))

# 1. Reject high CIBIL scores (>= 550) if their debt logic is bad
# We'll be pretty aggressive to give the model lots of negative examples for high CIBIL
high_cibil_reject_mask = (df['cibil_score'] >= 550) & (
    (df['loan_amount'] > df['income_annum'] * 3.5) | 
    (df['loan_amount'] > df['bank_asset_value'] * 1.2)
)
df.loc[high_cibil_reject_mask, 'loan_status'] = 'Rejected'

# 2. Approve low CIBIL scores (>= 400 and < 550) if they have great assets/income
low_cibil_approve_mask = (df['cibil_score'] >= 350) & (df['cibil_score'] < 550) & (
    (df['bank_asset_value'] > df['loan_amount'] * 1.5) |
    (df['income_annum'] > df['loan_amount'] * 0.4)
)
df.loc[low_cibil_approve_mask, 'loan_status'] = 'Approved'

# 3. Add random noise around the boundary (cibil between 450 and 650) to soften the threshold
np.random.seed(42)
boundary_mask = (df['cibil_score'] >= 450) & (df['cibil_score'] <= 650)
# Randomly flip 15% of these
flip_mask = boundary_mask & (np.random.rand(len(df)) < 0.15)

df.loc[flip_mask & (df['loan_status'] == 'Approved'), 'loan_status'] = 'TEMP'
df.loc[flip_mask & (df['loan_status'] == 'Rejected'), 'loan_status'] = 'Approved'
df.loc[df['loan_status'] == 'TEMP', 'loan_status'] = 'Rejected'

# Map back to original format with spaces
df['loan_status'] = df['loan_status'].apply(lambda x: f" {x}")

df.to_csv('data/LOAN1.csv', index=False)

print("\nNew Synthesized Distribution:")
print(pd.crosstab(df['cibil_score'] >= 550, df['loan_status']))
