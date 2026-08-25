from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from backend.services.speech_service import speech_service


router = APIRouter(
    prefix="/speech",
    tags=["Speech"],
)


@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
):

    suffix = Path(audio.filename or ".wav").suffix

    with NamedTemporaryFile(delete=False, suffix=suffix) as temp:
        temp.write(await audio.read())
        temp_path = temp.name

    result = speech_service.transcribe(temp_path)

    if result["status"].startswith("asr_error"):
        raise HTTPException(
            status_code=500,
            detail=result["status"],
        )

    return result


@router.post("/synthesize")
async def synthesize_speech(text: str):

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty.",
        )

    result = speech_service.synthesize(text)

    if result["audio"] is None:
        return result

    return FileResponse(
        result["audio"],
        media_type="audio/wav",
        filename="samvaad_response.wav",
    )