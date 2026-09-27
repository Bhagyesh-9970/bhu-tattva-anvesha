from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag.assistant_service import RAGAssistantService

router = APIRouter()


class RAGQueryRequest(BaseModel):
    question: str
    watershed_id: int = 1


@router.post("/query")
def process_rag_question(req: RAGQueryRequest):
    return RAGAssistantService.process_query(req.question, req.watershed_id)
