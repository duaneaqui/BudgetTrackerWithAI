from datetime import date, datetime
from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class OwnedMixin:
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Income(OwnedMixin, Base):
    __tablename__ = "incomes"

    source: Mapped[str] = mapped_column(String(120))
    amount: Mapped[float] = mapped_column(Float)
    date: Mapped[date] = mapped_column(Date)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)


class Expense(OwnedMixin, Base):
    __tablename__ = "expenses"

    name: Mapped[str] = mapped_column(String(160))
    category: Mapped[str] = mapped_column(String(80))
    amount: Mapped[float] = mapped_column(Float)
    date: Mapped[date] = mapped_column(Date)
    payment_method: Mapped[str | None] = mapped_column(String(80), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)


class RecurringExpense(OwnedMixin, Base):
    __tablename__ = "recurring_expenses"

    name: Mapped[str] = mapped_column(String(160))
    amount: Mapped[float] = mapped_column(Float)
    category: Mapped[str] = mapped_column(String(80))
    frequency: Mapped[str] = mapped_column(String(40))
    due_day: Mapped[int] = mapped_column(Integer)
    next_due_date: Mapped[date] = mapped_column(Date)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Loan(OwnedMixin, Base):
    __tablename__ = "loans"

    provider: Mapped[str] = mapped_column(String(120))
    loan_type: Mapped[str | None] = mapped_column(String(80), nullable=True)
    original_amount: Mapped[float | None] = mapped_column(Float, nullable=True)
    remaining_balance: Mapped[float] = mapped_column(Float, default=0)
    monthly_payment: Mapped[float] = mapped_column(Float, default=0)
    interest_or_fees: Mapped[float | None] = mapped_column(Float, nullable=True)
    due_date: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(40), default="active")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)


class SavingsGoal(OwnedMixin, Base):
    __tablename__ = "savings_goals"

    goal_name: Mapped[str] = mapped_column(String(160))
    target_amount: Mapped[float] = mapped_column(Float)
    current_amount: Mapped[float] = mapped_column(Float, default=0)
    target_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)


class LocalCost(OwnedMixin, Base):
    __tablename__ = "local_costs"

    item_name: Mapped[str] = mapped_column(String(160))
    category: Mapped[str] = mapped_column(String(80))
    unit: Mapped[str] = mapped_column(String(80))
    price: Mapped[float] = mapped_column(Float)
    location_note: Mapped[str | None] = mapped_column(String(160), nullable=True)
