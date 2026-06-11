from datetime import date
from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

email = "demo@budgetai.ph"
user = db.query(models.User).filter(models.User.email == email).first()
if not user:
    user = models.User(name="Demo User", email=email, hashed_password=hash_password("password123"))
    db.add(user)
    db.commit()
    db.refresh(user)

if not db.query(models.Income).filter(models.Income.user_id == user.id).first():
    db.add(models.Income(user_id=user.id, source="Salary", amount=30000, date=date(2026, 6, 15), notes="Monthly salary"))
    expenses = [
        ("Groceries", "Food", 4200, "Cash"),
        ("Electricity", "Utilities", 600, "E-wallet"),
        ("Water", "Utilities", 150, "Cash"),
        ("Jeep fares", "Transport", 780, "Cash"),
        ("Cat food/litter", "Pets", 3000, "Cash"),
    ]
    for name, category, amount, method in expenses:
        db.add(models.Expense(user_id=user.id, name=name, category=category, amount=amount, date=date(2026, 6, 12), payment_method=method))
    for name, amount, category, due in [
        ("Rent", 4500, "Rent", 5),
        ("WiFi", 400, "Utilities", 18),
        ("Cursor", 1250, "Subscriptions", 20),
        ("Cat food/litter", 3000, "Pets", 25),
    ]:
        db.add(models.RecurringExpense(user_id=user.id, name=name, amount=amount, category=category, frequency="monthly", due_day=due, next_due_date=date(2026, 6, due)))
    db.add(models.Loan(user_id=user.id, provider="SLoan", loan_type="Cash loan", original_amount=5000, remaining_balance=3750, monthly_payment=1250, interest_or_fees=0, due_date=date(2026, 6, 15), status="active"))
    db.add(models.SavingsGoal(user_id=user.id, goal_name="Emergency Fund", target_amount=25000, current_amount=6500, target_date=date(2026, 12, 31)))
    for item, category, unit, price, location in [
        ("Laundry", "Household", "kg", 40, "Marikina"),
        ("Rice", "Food", "kg", 55, "Local market"),
        ("Jeep fare", "Transport", "ride", 13, "Metro Manila"),
        ("Water refill", "Utilities", "container", 35, "Nearby station"),
    ]:
        db.add(models.LocalCost(user_id=user.id, item_name=item, category=category, unit=unit, price=price, location_note=location))
    db.commit()

print("Seeded demo account: demo@budgetai.ph / password123")
db.close()
