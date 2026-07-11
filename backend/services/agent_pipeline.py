import os
from dotenv import load_dotenv
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.graph import StateGraph, END
from core.database import db

load_dotenv()

# Setup Gemini model using system GOOGLE_API_KEY
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.1
)

# -------------------------------------------------------------
# Structured Pydantic Output Definitions
# -------------------------------------------------------------
class ObligationItem(BaseModel):
    rule_id: str = Field(description="Unique reference rule ID or section citation in the circular document")
    description: str = Field(description="The compliance obligation description or command details")
    applies_to: str = Field(description="Target entities this applies to, e.g. Stock Brokers, Mutual Funds")
    department: str = Field(description="Operational department responsible: Compliance, IT Security, Risk Management, Operations, Finance")
    priority: str = Field(description="Critical, High, Medium, or Low severity classification")
    deadline: Optional[str] = Field(description="Compliance deadline target date in YYYY-MM-DD format if specified")
    penalty: Optional[str] = Field(description="Penalty descriptions or fines for non-compliance")
    confidence_score: float = Field(description="Confidence rating of the AI extraction between 0.0 and 1.0")
    source_page: Optional[int] = Field(description="PDF Page number where the obligation was found")
    source_paragraph: Optional[str] = Field(description="Key clause or paragraph section text")

class ObligationExtraction(BaseModel):
    obligations: List[ObligationItem] = Field(description="List of extracted regulatory obligations")

class GapStatus(BaseModel):
    gap_status: str = Field(description="Either 'gap' (no existing compliance control exists) or 'covered'")
    reasoning: str = Field(description="Auditable explanation of why this control is categorized as gap or covered")

# -------------------------------------------------------------
# LangGraph Agent State Definition
# -------------------------------------------------------------
class AgentState(BaseModel):
    circular_id: str
    circular_title: str
    text_content: str
    extracted_obligations: List[Dict[str, Any]] = []
    gap_analysis_results: Dict[str, Any] = {}
    tasks_generated: List[Dict[str, Any]] = []

# -------------------------------------------------------------
# Graph Nodes Execution Flow
# -------------------------------------------------------------
async def extract_obligations_node(state: AgentState) -> Dict[str, Any]:
    """Node 1: Extract obligations and classify departments using structured Gemini LLM output"""
    print(f"Ingesting Circular text: {state.circular_title}...")
    
    prompt = f"""
    You are the BrahmOS Compliance AI parser. Analyze the following SEBI Circular text and extract all operational compliance obligations.
    
    For each extracted obligation, identify:
    - Rule Reference ID or clause
    - Description of what needs to be done
    - Target groups (applies to)
    - Responsible department (Risk Management, Compliance, IT Security, Operations, Finance)
    - Priority class (Critical, High, Medium, Low)
    - Target deadline (YYYY-MM-DD) if any
    - Penalty if specified
    - The source page and paragraph
    
    Circular Text:
    {state.text_content}
    """
    
    structured_llm = llm.with_structured_output(ObligationExtraction)
    result = await structured_llm.ainvoke([HumanMessage(content=prompt)])
    
    extracted_list = []
    for obs in result.obligations:
        extracted_list.append(obs.dict())
        
    return {"extracted_obligations": extracted_list}

async def gap_analysis_node(state: AgentState) -> Dict[str, Any]:
    """Node 2: Compare obligations against existing controls in the Task table"""
    results = {}
    
    # Query all completed tasks to represent "existing controls"
    existing_tasks = await db.task.find_many(
        where={"status": "DONE"}
    )
    
    existing_desc = "\n".join([f"- Task: {t.title} [Dept: {t.department}]" for t in existing_tasks])
    
    structured_llm = llm.with_structured_output(GapStatus)
    
    for obs in state.extracted_obligations:
        prompt = f"""
        Compare the following SEBI obligation to our existing compliance task list to identify if it is covered or represents an operational gap.
        
        New Obligation:
        - Title: {obs['rule_id']}
        - Description: {obs['description']}
        - Department: {obs['department']}
        
        Existing Active Controls:
        {existing_desc if existing_desc else 'No active controls configured.'}
        
        Determine if there is a gap or if it is already covered.
        """
        
        comparison = await structured_llm.ainvoke([HumanMessage(content=prompt)])
        results[obs['rule_id']] = {
            "status": comparison.gap_status,
            "reasoning": comparison.reasoning
        }
        
    return {"gap_analysis_results": results}

async def generate_tasks_node(state: AgentState) -> Dict[str, Any]:
    """Node 3: Deterministically create tasks for detected gaps"""
    tasks_to_create = []
    for obs in state.extracted_obligations:
        rule_id = obs['rule_id']
        gap_info = state.gap_analysis_results.get(rule_id, {"status": "gap"})
        
        if gap_info.get("status") == "gap":
            # Map values to BrahmOS Task model
            tasks_to_create.append({
                "title": f"Action Plan: Implement controls for {obs['rule_id']} - {obs['description'][:60]}...",
                "owner": f"{obs['department']} Manager",
                "department": obs['department'],
                "priority": obs['priority'],
                "obligation_id": rule_id
            })
            
    return {"tasks_generated": tasks_to_create}

# -------------------------------------------------------------
# LangGraph Workflow Construction
# -------------------------------------------------------------
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("extract_obligations", extract_obligations_node)
workflow.add_node("gap_analysis", gap_analysis_node)
workflow.add_node("generate_tasks", generate_tasks_node)

# Define transitions
workflow.set_entry_point("extract_obligations")
workflow.add_edge("extract_obligations", "gap_analysis")
workflow.add_edge("gap_analysis", "generate_tasks")
workflow.add_edge("generate_tasks", END)

# Compile graph
agent_pipeline = workflow.compile()
print("LangGraph Compliance Agent Pipeline Compiled Successfully!")
