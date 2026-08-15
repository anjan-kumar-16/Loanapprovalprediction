import sys
import os

# Add the parent directory to sys.path so we can import src
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine

# Import routers
from routers import auth, applications, predict, metrics

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Loan Approval API")

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(applications.router)
app.include_router(predict.router)
app.include_router(metrics.router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}
