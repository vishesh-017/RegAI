from repositories.circular_repository import CircularRepository

class CircularService:
    def __init__(self):
        self.repo = CircularRepository()

    async def get_all_circulars(self):
        return await self.repo.get_all()

    async def get_circular(self, circular_id: str):
        return await self.repo.get_by_id(circular_id)
