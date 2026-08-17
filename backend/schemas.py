from pydantic import BaseModel, Field
from typing import Optional

class LoanApplication(BaseModel):
    no_of_dependents: str
    education: str
    employment_type: str
    income_annum: float = Field(..., ge=0)
    loan_amount: float = Field(..., gt=0)
    loan_term: float = Field(..., gt=0)
    cibil_score: float = Field(..., ge=300, le=900)
    bank_asset_value: Optional[float] = Field(0, ge=0)
    name: Optional[str] = None
    is_whatif: Optional[bool] = False

class LoginRequest(BaseModel):
    username: str
    password: str

class StatusUpdateRequest(BaseModel):
    status: str