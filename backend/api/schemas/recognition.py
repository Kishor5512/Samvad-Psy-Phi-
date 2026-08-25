from typing import Any, List, Optional

from pydantic import BaseModel, Field


class RecognitionRequest(BaseModel):
    """
    Request from frontend/edge client.

    landmarks should normally contain the output produced
    by Member 1's MediaPipe + preprocessing pipeline.
    """

    landmarks: List[Any] = Field(default_factory=list)

    sequence_id: Optional[str] = None

    sector: Optional[str] = None


class RecognitionResponse(BaseModel):
    sign: str
    confidence: float
    text: Optional[str] = None
    sequence_id: Optional[str] = None
    status: str = "success"