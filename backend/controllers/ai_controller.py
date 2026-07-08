from fastapi import APIRouter, Depends
from core.security import get_current_user
from services.ai_service import get_ai_service

router = APIRouter()

@router.post("/extract-obligations/{circular_id}")
async def extract_obligations(circular_id: str, user=Depends(get_current_user)):
    ai_service = get_ai_service()
    obligations = await ai_service.extract_obligations(circular_id)
    return {"message": "Obligations extracted successfully", "data": obligations}

@router.post("/compare-circulars")
async def compare_circulars(old_circular_id: str, new_circular_id: str, user=Depends(get_current_user)):
    ai_service = get_ai_service()
    comparison = await ai_service.compare_circulars(old_circular_id, new_circular_id)
    return {"message": "Comparison complete", "data": comparison}

@router.post("/generate-tasks/{obligation_id}")
async def generate_tasks(obligation_id: str, user=Depends(get_current_user)):
    ai_service = get_ai_service()
    tasks = await ai_service.generate_tasks(obligation_id)
    return {"message": "Tasks generated", "data": tasks}
