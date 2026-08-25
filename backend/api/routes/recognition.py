from fastapi import APIRouter, HTTPException

from backend.api.schemas.recognition import (
    RecognitionRequest,
    RecognitionResponse,
)
from backend.services.recognition_service import recognition_service


router = APIRouter(
    prefix="/recognition",
    tags=["Recognition"],
)


@router.post("", response_model=RecognitionResponse)
def recognize_sign(request: RecognitionRequest):

    result = recognition_service.recognize(
        landmarks=request.landmarks,
        sequence_id=request.sequence_id,
    )

    if result["status"].startswith("inference_error"):
        raise HTTPException(
            status_code=500,
            detail=result["status"],
        )

    return RecognitionResponse(**result)