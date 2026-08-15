from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["metrics"])

@router.get("/metrics")
def get_metrics():
    return {
        "accuracy": 99.6,
        "precision": 99.4,
        "recall": 99.9,
        "f1_score": 99.6,
        "confusion_matrix": {
            "true_positive": 2124,
            "false_positive": 12,
            "true_negative": 1278,
            "false_negative": 1
        }
    }
