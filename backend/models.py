from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password = Column(String(50))
    role = Column(String(20)) # "manager" or "applicant"

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    no_of_dependents = Column(Integer)
    education = Column(String(50))
    self_employed = Column(String(10))
    income_annum = Column(Float)
    loan_amount = Column(Float)
    loan_term = Column(Integer)
    cibil_score = Column(Float)
    bank_asset_value = Column(Float)
    
    # ML Results
    status = Column(String(50)) # Pending / Approved / Rejected
    ai_recommendation = Column(String(50)) # Loan Approved / Loan Rejected
    probability_score = Column(Integer)
    date = Column(String(50))
