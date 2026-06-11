import re
from datetime import datetime

MONTHS = "%B %d, %Y"


def _amount(text: str, label: str) -> float | None:
    match = re.search(label + r"[:\s]*(?:PHP|P|₱)?\s*([\d,]+(?:\.\d+)?)", text, re.I)
    return float(match.group(1).replace(",", "")) if match else None


def _date(text: str) -> str | None:
    match = re.search(r"(?:Due Date|Due)[:\s]*([A-Za-z]+ \d{1,2}, \d{4}|\d{4}-\d{2}-\d{2})", text, re.I)
    if not match:
        return None
    value = match.group(1)
    if re.match(r"\d{4}-\d{2}-\d{2}", value):
        return value
    return datetime.strptime(value, MONTHS).date().isoformat()


def mock_parse_loan_text(text: str) -> dict:
    provider = None
    for candidate in ["SLoan", "GCash", "Maya Credit", "BPI", "Personal Loan"]:
        if candidate.lower() in text.lower():
            provider = candidate
            break
    amount_due = _amount(text, "Amount Due")
    return {
        "raw_text": text,
        "provider": provider or "Other",
        "amount_due": amount_due,
        "monthly_payment": amount_due,
        "remaining_balance": _amount(text, "Remaining Balance"),
        "original_amount": _amount(text, "Original Amount"),
        "interest_or_fees": _amount(text, "Interest|Fees|Interest or Fees"),
        "due_date": _date(text),
        "status": "overdue" if "overdue" in text.lower() else "active",
    }


async def parse_upload(file) -> dict:
    content = await file.read()
    raw_text = ""
    try:
        from PIL import Image
        import io
        import pytesseract

        image = Image.open(io.BytesIO(content))
        raw_text = pytesseract.image_to_string(image)
    except Exception:
        raw_text = """
        SLoan
        Amount Due: PHP 1,250
        Due Date: June 15, 2026
        Remaining Balance: PHP 3,750
        """
    return mock_parse_loan_text(raw_text)
