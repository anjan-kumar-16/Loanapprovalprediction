# Data Leakage Report

## Overview
This report analyzes the dataset (`loan.csv`) for potential sources of data leakage before training our Loan Approval Prediction model. Data leakage occurs when the model is trained using information that would not be available at the time of prediction, leading to overly optimistic performance during testing that fails in production.

## Features Reviewed

### 1. `loan_id`
- **Type**: Identifier
- **Status**: **Removed**
- **Reason**: Identifiers carry no predictive power and can inadvertently cause the model to memorize specific instances (e.g. if IDs were assigned sequentially based on outcome or date).

### 2. Post-Decision Features
- **Check**: Are there features that are created *after* the loan decision is made? (e.g., `default_status`, `repayment_history_on_this_loan`).
- **Status**: **None found**. All features (income, assets, cibil_score, dependents, loan_amount, loan_term) are standard application variables collected *before* a decision is made.

### 3. Duplicate Information (Target Leakage)
- **Check**: Are there features that perfectly predict the target because they are a proxy for it?
- **Status**: **None found**. No feature is a direct proxy for `loan_status`.

### 4. Data Split Leakage
- **Check**: Information from the test set leaking into the training set.
- **Prevention Strategy**: We will perform the 80/20 train-test split **before** fitting the preprocessing pipeline (imputation, scaling, one-hot encoding). The `ColumnTransformer` will only be `fit` on `X_train` and then used to `transform` both `X_train` and `X_test`. If SMOTE is used later for class imbalance, it will be strictly applied *only* to the training set.

## Conclusion
The dataset is clean of obvious data leakage. By dropping `loan_id` and strictly adhering to fitting preprocessors only on training data, we ensure a robust and realistic model evaluation.
