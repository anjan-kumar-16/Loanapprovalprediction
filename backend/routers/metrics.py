from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["metrics"])

@router.get("/metrics")
def get_metrics():
    return {
        "accuracy": 95.6,
        "precision": 96.2,
        "recall": 96.8,
        "f1_score": 96.5,
        "confusion_matrix": {
            "true_positive": 2068,
            "false_positive": 82,
            "true_negative": 1197,
            "false_negative": 68
        }
    }
