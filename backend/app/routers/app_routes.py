from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from .. import models, schemas
from ..auth import get_current_user
from ..database import get_db
from ..services.analytics import dashboard, monthly_insights
from ..services.ocr import parse_upload

router = APIRouter()


@router.get("/dashboard", response_model=schemas.DashboardSummary)
def get_dashboard(month: int | None = None, year: int | None = None, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return dashboard(db, user.id, year=year, month=month)


@router.get("/insights/monthly", response_model=schemas.InsightResponse)
def insights(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    return monthly_insights(db, user.id)


@router.post("/ocr/loan-screenshot", response_model=schemas.OcrLoanResult)
async def loan_screenshot(file: UploadFile = File(...), user: models.User = Depends(get_current_user)):
    return await parse_upload(file)
