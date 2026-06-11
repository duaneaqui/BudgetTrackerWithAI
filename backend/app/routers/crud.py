from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models
from ..auth import get_current_user
from ..database import get_db


def crud_router(prefix: str, tag: str, model, create_schema, out_schema):
    router = APIRouter(prefix=prefix, tags=[tag])

    @router.get("", response_model=list[out_schema])
    def list_items(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
        return db.query(model).filter(model.user_id == user.id).order_by(model.id.desc()).all()

    @router.post("", response_model=out_schema)
    def create_item(payload: create_schema, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
        item = model(**payload.model_dump(), user_id=user.id)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @router.put("/{item_id}", response_model=out_schema)
    def update_item(item_id: int, payload: create_schema, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
        item = db.query(model).filter(model.id == item_id, model.user_id == user.id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Record not found")
        for key, value in payload.model_dump().items():
            setattr(item, key, value)
        db.commit()
        db.refresh(item)
        return item

    @router.delete("/{item_id}")
    def delete_item(item_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
        item = db.query(model).filter(model.id == item_id, model.user_id == user.id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Record not found")
        db.delete(item)
        db.commit()
        return {"ok": True}

    return router
