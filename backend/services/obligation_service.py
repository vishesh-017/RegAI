from repositories.obligation_repository import ObligationRepository

class ObligationService:
    def __init__(self):
        self.repo = ObligationRepository()

    async def create_obligation(self, circular_id: str, data: dict):
        return await self.repo.create(circular_id, data)

    async def get_obligations_by_circular(self, circular_id: str):
        return await self.repo.get_by_circular(circular_id)

    async def update_obligation_status(self, obligation_id: str, status: str):
        return await self.repo.update_status(obligation_id, status)
