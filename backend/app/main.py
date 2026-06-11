import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas
from .database import Base, engine
from .routers.app_routes import router as app_router
from .routers.auth_routes import router as auth_router
from .routers.crud import crud_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BudgetAI PH API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"), "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(app_router)
app.include_router(crud_router("/incomes", "incomes", models.Income, schemas.IncomeCreate, schemas.IncomeOut))
app.include_router(crud_router("/expenses", "expenses", models.Expense, schemas.ExpenseCreate, schemas.ExpenseOut))
app.include_router(crud_router("/recurring-expenses", "recurring", models.RecurringExpense, schemas.RecurringExpenseCreate, schemas.RecurringExpenseOut))
app.include_router(crud_router("/loans", "loans", models.Loan, schemas.LoanCreate, schemas.LoanOut))
app.include_router(crud_router("/savings-goals", "savings", models.SavingsGoal, schemas.SavingsGoalCreate, schemas.SavingsGoalOut))
app.include_router(crud_router("/local-costs", "local-costs", models.LocalCost, schemas.LocalCostCreate, schemas.LocalCostOut))


@app.get("/")
def root():
    return {"name": "BudgetAI PH", "status": "ok"}
