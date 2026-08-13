from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, classification_report
import matplotlib.pyplot as plt
import seaborn as sns
import os

def evaluate_model(model, X_val, y_val, model_name):
    """
    Evaluates a trained model and returns a dictionary of metrics.
    Prints the classification report and confusion matrix.
    """
    print(f"\n{'='*40}")
    print(f"EVALUATING MODEL: {model_name}")
    print(f"{'='*40}")
    
    y_pred = model.predict(X_val)
    y_prob = model.predict_proba(X_val)[:, 1] if hasattr(model, "predict_proba") else None
    
    acc = accuracy_score(y_val, y_pred)
    prec = precision_score(y_val, y_pred)
    rec = recall_score(y_val, y_pred)
    f1 = f1_score(y_val, y_pred)
    roc_auc = roc_auc_score(y_val, y_prob) if y_prob is not None else "N/A"
    
    print(f"Accuracy : {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall   : {rec:.4f}")
    print(f"F1 Score : {f1:.4f}")
    if y_prob is not None:
        print(f"ROC-AUC  : {roc_auc:.4f}")
        
    print("\nClassification Report:")
    print(classification_report(y_val, y_pred))
    
    print("Confusion Matrix:")
    cm = confusion_matrix(y_val, y_pred)
    print(cm)
    
    return {
        "Model": model_name,
        "Accuracy": acc,
        "Precision": prec,
        "Recall": rec,
        "F1": f1,
        "ROC-AUC": roc_auc
    }
