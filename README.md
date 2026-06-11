# BudgetAI PH

BudgetAI PH is a full-stack personal finance tracker designed for Filipino users. It tracks manual income, expenses, recurring bills, loans, savings goals, local area prices, monthly reports, and rule-based AI-style budgeting insights.

The project intentionally avoids paid bank APIs, GCash/Maya/BPI integrations, real auto-syncing, and app scraping. All finance data is entered manually, with optional OCR parsing for user-uploaded loan screenshots.

## Features

- JWT authentication with register, login, logout, and protected routes
- Dashboard summary cards for income, expenses, balance, savings, loans, bills, and due dates
- CRUD pages for income, expenses, recurring bills, loans, savings goals, and local costs
- Recharts visualizations for category spending, monthly trends, and savings progress
- Rule-based AI Budget Advisor at `GET /insights/monthly`
- Loan Screenshot Scanner at `POST /ocr/loan-screenshot`
- Editable confirmation form before OCR results are saved
- Monthly reports with month/year filters
- SQLite database with SQLAlchemy models
- Demo seed data for a Filipino budget scenario
- Responsive SaaS-style React dashboard

## Tech Stack

Frontend:

- React
- TypeScript
- Tailwind CSS
- Recharts
- Vite
- Lucide icons

Backend:

- Python
- FastAPI
- SQLite
- SQLAlchemy
- Pydantic
- JWT authentication

OCR:

- Tries `pytesseract` when available
- Falls back to a mock parser so the scanner flow works without local Tesseract setup

## Folder Structure

```text
backend/
  app/
    routers/
    services/
    auth.py
    database.py
    main.py
    models.py
    schemas.py
  seed.py
  requirements.txt
frontend/
  src/
    components/
    lib/
    pages/
    types/
  package.json
README.md
.env.example
```

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`.

Demo login:

- Email: `demo@budgetai.ph`
- Password: `password123`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

If the API is hosted elsewhere, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

## OCR Behavior

The scanner accepts a user-provided image upload. The backend attempts to read text with Tesseract via `pytesseract`. If Tesseract is not installed or OCR fails, the app returns a realistic mock parsed SLoan example so the confirmation and save workflow remains testable.

OCR results are never auto-saved. The user must review and press **Save Loan**.

## Limitations

- No paid AI APIs are required
- No bank, GCash, Maya, or BPI auto-sync
- No banking app scraping
- OCR quality depends on local Tesseract availability and screenshot clarity
- SQLite is intended for local demo and portfolio usage

## Future Improvements

- Optional OpenAI, Gemini, or Ollama integration
- SMS or email import
- CSV import
- Export monthly reports as PDF
- PostgreSQL migration
- Bank integrations only through official approved APIs
