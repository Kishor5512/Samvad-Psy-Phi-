# =============================================================================
# OFFLINE ARCHITECTURE NOTE:
# True offline support would live in the frontend's service worker (caching
# last-fetched /api/signs responses via the Cache API or IndexedDB), not in this
# backend. The backend itself requires connectivity to reach staff devices and
# route ISL queries in real time.
# =============================================================================

import logging
import random
import uuid
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Configure logging for live hackathon debugging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("samvaad_backend")

app = FastAPI(
    title="SAMVAAD ISL Accessibility Backend",
    description="Integration layer for Indian Sign Language (ISL) public service counter system.",
    version="1.0.0"
)

# CORS wide open for local dev (Member 2 frontend calls)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# HARDCODED DATA STRUCTURES
# -----------------------------------------------------------------------------
SIGN_REPOSITORY: Dict[str, Dict[str, Dict[str, str]]] = {
    "healthcare": {
        "WHERE_HURT": {
            "text": "Where does it hurt?",
            "video": "/videos/healthcare/where_does_it_hurt.mp4"
        },
        "ALLERGIES": {
            "text": "Do you have any allergies?",
            "video": "/videos/healthcare/allergies.mp4"
        },
        "PLEASE_SIT": {
            "text": "Please sit here",
            "video": "/videos/healthcare/please_sit_here.mp4"
        },
        "TAKE_MEDICINE": {
            "text": "Take this medicine",
            "video": "/videos/healthcare/take_medicine.mp4"
        },
        "NEED_AMBULANCE": {
            "text": "Do you need an ambulance?",
            "video": "/videos/healthcare/need_ambulance.mp4"
        }
    },
    "banking": {
        "FILL_FORM": {
            "text": "Please fill this form",
            "video": "/videos/banking/fill_form.mp4"
        },
        "DEPOSIT_WITHDRAWAL": {
            "text": "Deposit or withdrawal?",
            "video": "/videos/banking/deposit_withdrawal.mp4"
        },
        "ACCOUNT_NUMBER": {
            "text": "Your account number, please",
            "video": "/videos/banking/account_number.mp4"
        },
        "PLEASE_SIGN": {
            "text": "Please sign here",
            "video": "/videos/banking/please_sign_here.mp4"
        },
        "BALANCE_READY": {
            "text": "Your balance is ready",
            "video": "/videos/banking/balance_ready.mp4"
        }
    }
}

SECTOR_MAP: Dict[str, str] = {
    "PHC001": "healthcare",
    "BANK001": "banking"
}

# In-memory session store
SESSIONS: Dict[str, Dict[str, Any]] = {}


# -----------------------------------------------------------------------------
# REQUEST / RESPONSE MODELS
# -----------------------------------------------------------------------------
class SessionCreateRequest(BaseModel):
    service_id: str = Field(..., json_schema_extra={"example": "PHC001"})

class SessionCreateResponse(BaseModel):
    session_id: str
    sector: str

class RecognitionRequest(BaseModel):
    session_id: str
    landmark_sequence: Optional[Any] = None

class RecognitionResponse(BaseModel):
    sign: str
    text: str
    confidence: float

class TranslationRequest(BaseModel):
    session_id: str
    text: Optional[str] = None
    audio_base64: Optional[str] = None

class SignDetail(BaseModel):
    gloss: str
    text: str
    video: str

class TranslationResponse(BaseModel):
    gloss_sequence: List[str]
    signs: List[SignDetail]


# -----------------------------------------------------------------------------
# ENDPOINTS
# -----------------------------------------------------------------------------
@app.get("/")
def root():
    """Root endpoint welcoming API users and pointing to docs."""
    return {
        "message": "SAMVAAD ISL Accessibility Backend API Server is running!",
        "status": "online",
        "docs_url": "http://127.0.0.1:8000/docs",
        "health_check": "http://127.0.0.1:8000/api/health"
    }


@app.get("/api/health")
def health_check():
    """Health check endpoint for service status verification."""
    return {"status": "ok"}


@app.post("/api/session", response_model=SessionCreateResponse, status_code=status.HTTP_201_CREATED)
def create_session(payload: SessionCreateRequest):
    """
    Creates an active session bound to a sector via service_id.
    Returns session_id (UUID4) and assigned sector.
    """
    service_id = payload.service_id.strip()
    if service_id not in SECTOR_MAP:
        logger.warning(f"Session creation failed: Unknown service_id '{service_id}'")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service ID '{service_id}' not found in SECTOR_MAP. Valid IDs: {list(SECTOR_MAP.keys())}"
        )

    sector = SECTOR_MAP[service_id]
    session_id = str(uuid.uuid4())
    SESSIONS[session_id] = {
        "session_id": session_id,
        "service_id": service_id,
        "sector": sector
    }

    logger.info(f"Session created successfully: session_id={session_id}, sector={sector}, service_id={service_id}")
    return {"session_id": session_id, "sector": sector}


@app.post("/api/recognition", response_model=RecognitionResponse)
def recognize_sign(payload: RecognitionRequest):
    """
    Ingests landmark sequence (Citizen camera mode) and returns recognized sign/phrase.
    """
    if not payload.session_id or payload.session_id not in SESSIONS:
        logger.warning(f"Recognition failed: invalid session_id '{payload.session_id}'")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid or expired session_id '{payload.session_id}'. Please create a session first via /api/session."
        )

    session = SESSIONS[payload.session_id]
    sector = session["sector"]
    sector_phrases = SIGN_REPOSITORY.get(sector, {})

    # =========================================================================
    # SWAP-IN POINT #1: Member 1 ISL Recognition Model Drop-In Point
    # =========================================================================
    # When Member 1's recognition model is ready, replace this mock block with:
    #   result = recognize(payload.landmark_sequence)  # returns {"sign": str, "confidence": float}
    #   sign_gloss = result["sign"]
    #   confidence = result["confidence"]
    #   sign_text = sector_phrases.get(sign_gloss, {}).get("text", "Unknown sign")
    # -------------------------------------------------------------------------
    sign_gloss, phrase_data = random.choice(list(sector_phrases.items()))
    sign_text = phrase_data["text"]
    confidence = round(random.uniform(0.85, 0.98), 2)
    # =========================================================================

    logger.info(
        f"Recognition processed [Session: {payload.session_id} | Sector: {sector}]: "
        f"sign='{sign_gloss}', text='{sign_text}', confidence={confidence}"
    )

    return {
        "sign": sign_gloss,
        "text": sign_text,
        "confidence": confidence
    }


@app.post("/api/translation", response_model=TranslationResponse)
def translate_text(payload: TranslationRequest):
    """
    Translates staff speech/text (Provider mode) into ISL gloss sequence and video references.
    """
    if not payload.session_id or payload.session_id not in SESSIONS:
        logger.warning(f"Translation failed: invalid session_id '{payload.session_id}'")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid or expired session_id '{payload.session_id}'. Please create a session first via /api/session."
        )

    session = SESSIONS[payload.session_id]
    sector = session["sector"]
    sector_phrases = SIGN_REPOSITORY.get(sector, {})

    # =========================================================================
    # SWAP-IN POINT #2: Member 3 ASR + NLP Text-to-Sign Drop-In Point
    # =========================================================================
    # When Member 3's ASR + text_to_sign model pipeline is ready, replace with:
    #   text_input = process_asr(payload.audio_base64) if payload.audio_base64 else payload.text
    #   gloss_keys = text_to_sign(text_input)  # returns list[str] of gloss keys
    # -------------------------------------------------------------------------
    matched_gloss = None
    matched_data = None

    if payload.text and payload.text.strip():
        search_query = payload.text.strip().lower()
        for gloss_key, data in sector_phrases.items():
            phrase_text = data["text"].lower()
            if search_query in phrase_text or phrase_text in search_query:
                matched_gloss = gloss_key
                matched_data = data
                break

    # Fallback to the first phrase in sector so it never 500s
    if not matched_gloss:
        matched_gloss, matched_data = next(iter(sector_phrases.items()))

    gloss_sequence = [matched_gloss]
    signs = [{
        "gloss": matched_gloss,
        "text": matched_data["text"],
        "video": matched_data["video"]
    }]
    # =========================================================================

    logger.info(
        f"Translation processed [Session: {payload.session_id} | Sector: {sector}]: "
        f"input='{payload.text}', matched_gloss='{matched_gloss}'"
    )

    return {
        "gloss_sequence": gloss_sequence,
        "signs": signs
    }


@app.get("/api/signs/{gloss}", response_model=SignDetail)
def get_sign(gloss: str, session_id: str = Query(..., description="Active session ID")):
    """
    Looks up details for a single sign by gloss key within the session's active sector.
    """
    if not session_id or session_id not in SESSIONS:
        logger.warning(f"Sign lookup failed: invalid session_id '{session_id}'")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid or expired session_id '{session_id}'. Please create a session first via /api/session."
        )

    session = SESSIONS[session_id]
    sector = session["sector"]
    sector_phrases = SIGN_REPOSITORY.get(sector, {})

    gloss_key_found = None
    for key in sector_phrases:
        if key.upper() == gloss.strip().upper():
            gloss_key_found = key
            break

    if not gloss_key_found:
        logger.warning(f"Sign lookup 404: gloss '{gloss}' not found in sector '{sector}'")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Gloss '{gloss}' not found in sector '{sector}'. Available glosses: {list(sector_phrases.keys())}"
        )

    data = sector_phrases[gloss_key_found]
    return {
        "gloss": gloss_key_found,
        "text": data["text"],
        "video": data["video"]
    }
