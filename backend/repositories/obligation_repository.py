from core.database import db

class ObligationRepository:
    async def create(self, circular_id: str, data: dict):
        return await db.obligation.create(
            data={
                "circularId": circular_id,
                **data
            }
        )

    async def get_by_circular(self, circular_id: str):
        return await db.obligation.find_many(
            where={"circularId": circular_id}
        )

    async def update_status(self, obligation_id: str, status: str):
        return await db.obligation.update(
            where={"id": obligation_id},
            data={"status": status}
        )
