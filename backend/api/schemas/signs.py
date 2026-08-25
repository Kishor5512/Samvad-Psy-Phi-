from typing import List, Optional

from pydantic import BaseModel


class SignMedia(BaseModel):
    gloss: str
    image: Optional[str] = None
    video: Optional[str] = None
    sector: Optional[str] = None


class SignSequenceResponse(BaseModel):
    glosses: List[str]
    signs: List[SignMedia]
    status: str = "success"