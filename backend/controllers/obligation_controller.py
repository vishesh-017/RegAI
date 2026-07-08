from fastapi import APIRouter, Depends
from core.security import get_current_user
from services.obligation_service import ObligationService
from dtos import ObligationResponse
from typing import List

router = APIRouter()
obligation_service = ObligationService()

@router.get("/circular/{circular_id}", response_model=List[ObligationResponse])
async def get_obligations_by_circular(circular_id: str, user=Depends(get_current_user)):
    return await obligation_service.get_obligations_by_circular(circular_id)

@router.patch("/{obligation_id}/status")
async def update_obligation_status(obligation_id: str, status: str, user=Depends(get_current_user)):
    return await obligation_service.update_obligation_status(obligation_id, status)
