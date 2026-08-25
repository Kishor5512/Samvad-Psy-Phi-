from fastapi import APIRouter, HTTPException

from backend.api.schemas.translation import (
    TranslationRequest,
    TranslationResponse,
)
from backend.services.nlp_service import nlp_service


router = APIRouter(
    prefix="/translation",
    tags=["Translation"],
)


@router.post("", response_model=TranslationResponse)
def translate_to_isl(request: TranslationRequest):

    result = nlp_service.text_to_gloss(
        text=request.text,
        sector=request.sector or "general",
    )

    if result["status"].startswith("nlp_error"):
        raise HTTPException(
            status_code=500,
            detail=result["status"],
        )

    return TranslationResponse(**result)