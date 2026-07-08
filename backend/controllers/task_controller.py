from fastapi import APIRouter, Depends
from core.security import get_current_user
from services.task_service import TaskService
from dtos import TaskResponse, TaskCreateRequest
from typing import List

router = APIRouter()
task_service = TaskService()

@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreateRequest, user=Depends(get_current_user)):
    return await task_service.repo.create(task.dict(exclude_unset=True))

@router.get("/", response_model=List[TaskResponse])
async def list_tasks(user=Depends(get_current_user)):
    return await task_service.get_all_tasks()

@router.patch("/{task_id}/status")
async def update_task_status(task_id: str, status: str, user=Depends(get_current_user)):
    return await task_service.update_task_status(task_id, status)
