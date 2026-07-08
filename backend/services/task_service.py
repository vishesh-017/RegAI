from repositories.task_repository import TaskRepository

class TaskService:
    def __init__(self):
        self.repo = TaskRepository()

    async def get_all_tasks(self):
        return await self.repo.get_all()

    async def update_task_status(self, task_id: str, status: str):
        return await self.repo.update_status(task_id, status)
