from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes.recognition import router as recognition_router
from backend.api.routes.speech import router as speech_router
from backend.api.routes.translation import router as translation_router
from backend.api.routes.signs import router as signs_router

app = FastAPI(
    title="SAMVAAD API",
    description="Digital Public Infrastructure & Edge AI Communication Framework for ISL",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recognition_router, prefix="/api")
app.include_router(speech_router, prefix="/api")
app.include_router(translation_router, prefix="/api")
app.include_router(signs_router, prefix="/api")


@app.get("/")
def root():
    return {
        "service": "SAMVAAD",
        "status": "running",
        "version": "0.1.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "samvaad-backend",
    }