from fastapi import APIRouter, Depends
from core.security import get_current_user
from services.circular_service import CircularService
from dtos import CircularResponse
from typing import List

router = APIRouter()
circular_service = CircularService()

@router.post("/", response_model=CircularResponse)
async def create_circular(title: str, user=Depends(get_current_user)):
    return await circular_service.repo.create(title=title)

@router.get("/", response_model=List[CircularResponse])
async def list_circulars(user=Depends(get_current_user)):
    return await circular_service.get_all_circulars()

@router.get("/{circular_id}")
async def get_circular(circular_id: str, user=Depends(get_current_user)):
    return await circular_service.get_circular(circular_id)
