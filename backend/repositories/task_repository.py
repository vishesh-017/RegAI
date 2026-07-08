from core.database import db

class TaskRepository:
    async def create(self, data: dict):
        return await db.task.create(data=data)

    async def get_all(self):
        return await db.task.find_many(order={"createdAt": "desc"})

    async def update_status(self, task_id: str, status: str):
        return await db.task.update(
            where={"id": task_id},
            data={"status": status}
        )
