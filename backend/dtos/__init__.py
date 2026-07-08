from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CircularResponse(BaseModel):
    id: str
    title: str
    uploadDate: datetime
    status: str

class ObligationResponse(BaseModel):
    id: str
    ruleId: str
    description: str
    appliesTo: str
    department: str
    deadline: Optional[str]
    priority: str
    penalty: Optional[str]
    confidenceScore: float
    sourcePage: Optional[int]
    sourceParagraph: Optional[str]
    status: str

class TaskCreateRequest(BaseModel):
    title: str
    owner: str
    department: str
    priority: str
    dueDate: Optional[datetime] = None
    obligationId: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    title: str
    owner: str
    department: str
    priority: str
    dueDate: Optional[datetime]
    status: str
    createdAt: datetime
