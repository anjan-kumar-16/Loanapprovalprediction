from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas import StatusUpdateRequest
import models
from database import get_db

router = APIRouter(prefix="/api", tags=["applications"])

@router.get("/applications")
def get_applications(db: Session = Depends(get_db)):
    applications = db.query(models.Application).all()
    return applications

@router.put("/applications/{app_id}/status")
def update_application_status(app_id: str, req: StatusUpdateRequest, db: Session = Depends(get_db)):
    application = db.query(models.Application).filter(models.Application.application_id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = req.status
    db.commit()
    db.refresh(application)
    return application
