from core.database import db

class CircularRepository:
    async def create(self, title: str):
        return await db.circular.create(
            data={"title": title}
        )

    async def get_all(self):
        return await db.circular.find_many(
            order={"uploadDate": "desc"}
        )

    async def get_by_id(self, circular_id: str):
        return await db.circular.find_unique(
            where={"id": circular_id},
            include={"obligations": True}
        )
