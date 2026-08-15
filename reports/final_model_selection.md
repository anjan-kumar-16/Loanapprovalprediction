# Final Model Selection Report

Based on the latest cross-validation evaluation after applying the dataset synthesis (which softened the strict 550 CIBIL score threshold), we compared three models: Logistic Regression, Random Forest, and XGBoost.

## Performance Comparison (5-Fold Cross Validation)

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression** (Baseline) | 83.13% | 45.05% | 14.70% | 22.16% | 80.95% |
| **Random Forest** | **94.03%** | **89.86%** | 71.51% | **79.64%** | 93.32% |
| **XGBoost** | 93.32% | 84.66% | **72.22%** | 77.95% | **94.72%** |

## Conclusion

**Selected Model: Random Forest**

1. **Overall Performance:** Random Forest achieved the highest Accuracy (94.03%) and F1-Score (79.64%), making it the most robust overall classifier for this dataset.
2. **Precision:** It has the highest Precision (89.86%), meaning that when it predicts a loan should be approved, it is highly accurate and minimizes false approvals (which represents financial risk).
3. **Handling of the Softened Threshold:** Following the dataset modifications to handle the dominant CIBIL score feature, Random Forest adapted well, maintaining high performance while learning the new nuanced interactions between CIBIL score, income, and asset values.

The `models/loan_approval_model.pkl` has been updated with the Random Forest model and is currently serving predictions in the backend API.
