from fastapi import APIRouter
from .circular_controller import router as circular_router
from .ai_controller import router as ai_router
from .task_controller import router as task_router
from .obligation_controller import router as obligation_router

router = APIRouter()

router.include_router(circular_router, prefix="/circulars", tags=["Circulars"])
router.include_router(obligation_router, prefix="/obligations", tags=["Obligations"])
router.include_router(ai_router, prefix="/ai", tags=["AI Engines"])
router.include_router(task_router, prefix="/tasks", tags=["Tasks"])
