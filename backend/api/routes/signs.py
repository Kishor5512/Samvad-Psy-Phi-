from fastapi import APIRouter, Query

from backend.api.schemas.signs import (
    SignMedia,
    SignSequenceResponse,
)
from backend.services.sign_service import sign_service


router = APIRouter(
    prefix="/signs",
    tags=["Signs"],
)


@router.get("/{gloss}", response_model=SignMedia)
def get_sign(
    gloss: str,
    sector: str = Query(default="general"),
):

    return sign_service.get_sign(
        gloss=gloss,
        sector=sector,
    )


@router.get(
    "",
    response_model=SignSequenceResponse,
)
def get_sign_sequence(
    glosses: str = Query(...),
    sector: str = Query(default="general"),
):

    gloss_list = [
        item.strip()
        for item in glosses.split(",")
        if item.strip()
    ]

    signs = sign_service.get_sequence(
        glosses=gloss_list,
        sector=sector,
    )

    return {
        "glosses": gloss_list,
        "signs": signs,
        "status": "success",
    }