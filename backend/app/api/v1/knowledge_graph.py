from fastapi import APIRouter
from pydantic import BaseModel
from app.services.knowledge_graph.graph_service import KnowledgeGraphService

router = APIRouter()


class CypherQueryRequest(BaseModel):
    query: str


@router.get("/query")
def get_graph_subgraph(watershed_code: str = "KABINI-SUBBASIN-01"):
    return KnowledgeGraphService.get_subgraph(watershed_code)


@router.post("/cypher")
def execute_cypher_query(req: CypherQueryRequest):
    return KnowledgeGraphService.execute_cypher(req.query)
