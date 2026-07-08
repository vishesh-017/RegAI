import json
from abc import ABC, abstractmethod

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


class MockAIService(AIService):
    async def extract_obligations(self, circular_id: str):
        # Engine 1: Understand - Mock extraction
        return [
            {
                "rule_id": "SEBI/2026/01",
                "obligation": "Ensure quarterly compliance reports are filed by the 15th of the subsequent month.",
                "applies_to": "Stock Brokers",
                "department": "Compliance",
                "deadline": "2026-10-15",
                "priority": "High",
                "penalty": "Suspension of trading privileges",
                "confidence_score": 0.95,
                "source_page": 2,
                "source_paragraph": "Section 4.1: Reporting Requirements"
            }
        ]

    async def compare_circulars(self, old_circular_id: str, new_circular_id: str):
        # Engine 2: Identify - Mock comparison
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
        # Engine 3: Act - Mock task generation
        return [
            {
                "title": "Configure storage for AI audit logs",
                "owner": "IT Security Lead",
                "department": "IT Security",
                "priority": "High",
                "due_date": "2026-08-01"
            },
            {
                "title": "Update KYC processing SOPs",
                "owner": "Compliance Officer",
                "department": "Compliance",
                "priority": "Medium",
                "due_date": "2026-08-15"
            }
        ]

def get_ai_service() -> AIService:
    # In production, check environment variables to return MockAIService, OpenAIService, GeminiService, etc.
    return MockAIService()
