from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: EmailStr
    created_at: datetime


class IncomeBase(BaseModel):
    source: str
    amount: float
    date: date
    notes: str | None = None


class IncomeCreate(IncomeBase):
    pass


class IncomeOut(IncomeBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class ExpenseBase(BaseModel):
    name: str
    category: str
    amount: float
    date: date
    payment_method: str | None = None
    notes: str | None = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseOut(ExpenseBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class RecurringExpenseBase(BaseModel):
    name: str
    amount: float
    category: str
    frequency: str
    due_day: int
    next_due_date: date
    is_active: bool = True


class RecurringExpenseCreate(RecurringExpenseBase):
    pass


class RecurringExpenseOut(RecurringExpenseBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class LoanBase(BaseModel):
    provider: str
    loan_type: str | None = None
    original_amount: float | None = None
    remaining_balance: float = 0
    monthly_payment: float = 0
    interest_or_fees: float | None = None
    due_date: date
    status: str = "active"
    notes: str | None = None


class LoanCreate(LoanBase):
    pass


class LoanOut(LoanBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class SavingsGoalBase(BaseModel):
    goal_name: str
    target_amount: float
    current_amount: float = 0
    target_date: date | None = None
    notes: str | None = None


class SavingsGoalCreate(SavingsGoalBase):
    pass


class SavingsGoalOut(SavingsGoalBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class LocalCostBase(BaseModel):
    item_name: str
    category: str
    unit: str
    price: float
    location_note: str | None = None


class LocalCostCreate(LocalCostBase):
    pass


class LocalCostOut(LocalCostBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class DashboardSummary(BaseModel):
    monthly_income: float
    monthly_expenses: float
    remaining_balance: float
    total_savings: float
    total_loan_balance: float
    upcoming_bills: list[RecurringExpenseOut]
    upcoming_loans: list[LoanOut]
    category_spending: list[dict]
    monthly_trend: list[dict]
    savings_progress: list[dict]


class InsightResponse(BaseModel):
    summary: list[str]
    warnings: list[str]
    recommendations: list[str]
    forecast: dict


class OcrLoanResult(BaseModel):
    raw_text: str
    provider: str | None = None
    amount_due: float | None = None
    remaining_balance: float | None = None
    original_amount: float | None = None
    monthly_payment: float | None = None
    due_date: date | None = None
    interest_or_fees: float | None = None
    status: str = "active"
