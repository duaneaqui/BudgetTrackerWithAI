from calendar import monthrange
from datetime import date, timedelta
from sqlalchemy import extract
from sqlalchemy.orm import Session
from .. import models


def peso(value: float) -> str:
    return f"PHP {value:,.2f}"


def month_bounds(year: int | None = None, month: int | None = None):
    today = date.today()
    year = year or today.year
    month = month or today.month
    start = date(year, month, 1)
    end = date(year, month, monthrange(year, month)[1])
    return start, end


def dashboard(db: Session, user_id: int, year: int | None = None, month: int | None = None):
    start, end = month_bounds(year, month)
    incomes = db.query(models.Income).filter(models.Income.user_id == user_id, models.Income.date.between(start, end)).all()
    expenses = db.query(models.Expense).filter(models.Expense.user_id == user_id, models.Expense.date.between(start, end)).all()
    recurring = db.query(models.RecurringExpense).filter(models.RecurringExpense.user_id == user_id, models.RecurringExpense.is_active == True).all()
    loans = db.query(models.Loan).filter(models.Loan.user_id == user_id).all()
    savings = db.query(models.SavingsGoal).filter(models.SavingsGoal.user_id == user_id).all()
    upcoming_limit = date.today() + timedelta(days=14)

    monthly_income = sum(i.amount for i in incomes)
    monthly_expenses = sum(e.amount for e in expenses)
    category_totals: dict[str, float] = {}
    for expense in expenses:
        category_totals[expense.category] = category_totals.get(expense.category, 0) + expense.amount

    trend = []
    for m in range(1, 13):
        total = sum(e.amount for e in db.query(models.Expense).filter(
            models.Expense.user_id == user_id,
            extract("year", models.Expense.date) == start.year,
            extract("month", models.Expense.date) == m,
        ).all())
        trend.append({"month": m, "expenses": total})

    return {
        "monthly_income": monthly_income,
        "monthly_expenses": monthly_expenses,
        "remaining_balance": monthly_income - monthly_expenses,
        "total_savings": sum(s.current_amount for s in savings),
        "total_loan_balance": sum(l.remaining_balance for l in loans if l.status != "paid"),
        "upcoming_bills": [b for b in recurring if b.next_due_date <= upcoming_limit],
        "upcoming_loans": [l for l in loans if l.status != "paid" and l.due_date <= upcoming_limit],
        "category_spending": [{"category": k, "amount": v} for k, v in category_totals.items()],
        "monthly_trend": trend,
        "savings_progress": [
            {
                "goal": s.goal_name,
                "current": s.current_amount,
                "target": s.target_amount,
                "percent": round((s.current_amount / s.target_amount) * 100, 1) if s.target_amount else 0,
            }
            for s in savings
        ],
    }


def monthly_insights(db: Session, user_id: int):
    data = dashboard(db, user_id)
    recurring = db.query(models.RecurringExpense).filter(models.RecurringExpense.user_id == user_id, models.RecurringExpense.is_active == True).all()
    loans = db.query(models.Loan).filter(models.Loan.user_id == user_id, models.Loan.status != "paid").all()
    local_costs = db.query(models.LocalCost).filter(models.LocalCost.user_id == user_id).all()

    income = data["monthly_income"]
    expenses = data["monthly_expenses"]
    recurring_total = sum(r.amount for r in recurring)
    loan_payment_total = sum(l.monthly_payment for l in loans)
    food = next((c["amount"] for c in data["category_spending"] if c["category"].lower() == "food"), 0)
    balance = income - expenses - recurring_total

    summary = [
        f"Your recorded income this month is {peso(income)}.",
        f"You have spent {peso(expenses)} so far, leaving an estimated {peso(income - expenses)} before recurring bills.",
        f"Your active loan balance is {peso(data['total_loan_balance'])}.",
    ]
    warnings = []
    recommendations = []

    if income > 0 and food / income > 0.30:
        warnings.append(f"Food spending is {round(food / income * 100)}% of income this month.")
        recommendations.append(f"Reducing food spending by 10% could save around {peso(food * 0.10)}.")
    if income > 0 and loan_payment_total / income > 0.15:
        warnings.append("Loan payments are above 15% of income. Avoid new loans if possible.")
    if recurring_total:
        summary.append(f"Recurring expenses are taking {peso(recurring_total)} monthly.")
    if data["upcoming_bills"]:
        recommendations.append(f"Upcoming bills in the next 14 days total {peso(sum(b.amount for b in data['upcoming_bills']))}.")
    if local_costs:
        cheapest = sorted(local_costs, key=lambda c: c.price)[:3]
        recommendations.append("Track local prices closely: " + ", ".join(f"{c.item_name} at {peso(c.price)}/{c.unit}" for c in cheapest) + ".")
    if balance < 0:
        warnings.append("Your forecasted end-of-month balance is negative after recurring bills.")

    recommendations.append("Set aside savings right after income is received, even if the amount is small.")
    return {
        "summary": summary,
        "warnings": warnings,
        "recommendations": recommendations,
        "forecast": {
            "estimated_end_month_balance": balance,
            "recurring_monthly_total": recurring_total,
            "loan_payment_total": loan_payment_total,
            "food_savings_if_reduced_10_percent": food * 0.10,
        },
    }
