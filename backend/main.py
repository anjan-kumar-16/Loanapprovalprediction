import sys
import os

# Add the parent directory and src to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'machine_learning')))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine

# Import routers
from routers import auth, applications, predict, metrics

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Loan Approval API")

# Allow CORS for the frontend
origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173"
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
