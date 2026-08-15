from pydantic import BaseModel
from typing import Optional

class LoanApplication(BaseModel):
    no_of_dependents: str
    education: str
    self_employed: str
    income_annum: float
    loan_amount: float
    loan_term: float
    cibil_score: float
    bank_asset_value: Optional[float] = 0
    name: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class StatusUpdateRequest(BaseModel):
    status: str