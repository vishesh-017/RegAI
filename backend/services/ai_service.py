import json
import os
from abc import ABC, abstractmethod
from core.database import db
from services.agent_pipeline import agent_pipeline, AgentState

class AIService(ABC):
    @abstractmethod
    async def extract_obligations(self, circular_id: str):
        pass

    @abstractmethod
    async def compare_circulars(self, old_circular_id: str, new_circular_id: str):
        pass

    @abstractmethod
    async def generate_tasks(self, obligation_id: str):
        pass


class LangGraphAIService(AIService):
    async def extract_obligations(self, circular_id: str):
        # 1. Fetch circular details
        circular = await db.circular.find_unique(where={"id": circular_id})
        if not circular:
            raise ValueError(f"Circular with ID {circular_id} not found.")

        # Simulate read text from document URL or content fallback
        text_content = f"SEBI regulatory changes document for: {circular.title}. Intermediaries must configure storage and audit logs."
        
        # 2. Invoke LangGraph agent pipeline
        initial_state = AgentState(
            circular_id=circular.id,
            circular_title=circular.title,
            text_content=text_content
        )
        
        final_state = await agent_pipeline.ainvoke(initial_state.dict())
        extracted_obs = final_state.get("extracted_obligations", [])

        # 3. Store obligations in sqlite DB
        db_records = []
        for obs in extracted_obs:
            record = await db.obligation.create(
                data={
                    "circularId": circular_id,
                    "ruleId": obs["rule_id"],
                    "description": obs["description"],
                    "appliesTo": obs["applies_to"],
                    "department": obs["department"],
                    "deadline": obs.get("deadline"),
                    "priority": obs["priority"],
                    "penalty": obs.get("penalty"),
                    "confidenceScore": obs["confidence_score"],
                    "sourcePage": obs.get("source_page"),
                    "sourceParagraph": obs.get("source_paragraph"),
                    "status": "PENDING"
                }
            )
            db_records.append(record)

            # Log audit trail (Step 1)
            await db.auditlog.create(
                data={
                    "action": "OBLIGATION_INGESTED",
                    "targetId": record.id,
                    "userId": "system"
                }
            )

        # Update circular status
        await db.circular.update(
            where={"id": circular_id},
            data={"status": "COMPLETED"}
        )

        return db_records

    async def compare_circulars(self, old_circular_id: str, new_circular_id: str):
        # Engine 2: Identify - Gap Analysis Comparison
        return {
            "added_obligations": [
                {
                    "rule_id": "SEBI/2026/02",
                    "description": "Mandatory AI audit trail logs must be retained for 5 years."
                }
            ],
            "modified_obligations": [
                {
                    "rule_id": "SEBI/2025/11",
                    "old_deadline": "30 days",
                    "new_deadline": "15 days",
                    "impact": "Requires faster processing of KYC documents."
                }
            ],
            "removed_obligations": [],
            "affected_departments": ["Compliance", "IT Security"],
            "impact_summary": "High impact on IT operations due to new log retention rules."
        }

    async def generate_tasks(self, obligation_id: str):
        # Engine 3: Act - Task generation
        obligation = await db.obligation.find_unique(where={"id": obligation_id})
        if not obligation:
            raise ValueError(f"Obligation with ID {obligation_id} not found.")

        # Create task based on obligation properties
        task = await db.task.create(
            data={
                "title": f"Action Plan: Implement controls for {obligation.ruleId}",
                "owner": f"{obligation.department} Lead",
                "department": obligation.department,
                "priority": obligation.priority,
                "obligationId": obligation.id,
                "status": "TODO"
            }
        )

        # Log audit trail (Step 1)
        await db.auditlog.create(
            data={
                "action": "TASK_CREATED",
                "targetId": task.id,
                "userId": "system"
            }
        )

        return [task]


def get_ai_service() -> AIService:
    return LangGraphAIService()
