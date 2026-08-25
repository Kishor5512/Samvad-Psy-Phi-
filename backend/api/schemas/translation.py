from typing import List, Optional

from pydantic import BaseModel


class TranslationRequest(BaseModel):
    text: str
    sector: Optional[str] = "general"


class TranslationResponse(BaseModel):
    text: str
    gloss: List[str]
    sector: str
    status: str = "success"