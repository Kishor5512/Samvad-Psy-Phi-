# SAMVAAD — Indian Sign Language (ISL) Accessibility Backend

SAMVAAD is an AI-powered Indian Sign Language (ISL) accessibility bridge for public service counters in healthcare and banking sectors. This lightweight FastAPI backend acts as the core integration layer, connecting the citizen-facing ISL recognition camera view and the provider-facing speech/text translation interface with sector-specific gloss repositories, session management, and mock ML model fallbacks to enable instant, zero-blocker frontend development during hackathons.

---

## Quick Start

### 1. Installation
Install dependencies via pip:
```bash
pip install fastapi uvicorn pytest httpx
# or from requirements.txt
pip install -r requirements.txt
```

### 2. Running the Server
Run the FastAPI application locally on port 8000:
```bash
cd backend
uvicorn backend_main:app --reload --port 8000
```
Interactive API docs are accessible at: `http://localhost:8000/docs`

### 3. Running the Test Suite
Execute the unit tests:
```bash
pytest test_backend.py
```

---

## API Endpoints

- `GET /api/health` — Service health status check.
- `POST /api/session` — Creates a session bound to a sector (`PHC001` -> healthcare, `BANK001` -> banking).
- `POST /api/recognition` — Ingests camera landmarks & returns recognized sign, phrase text, and confidence score.
- `POST /api/translation` — Converts staff speech/text input into ISL gloss sequence and video references.
- `GET /api/signs/{gloss}?session_id=...` — Retrieves sign details (gloss, text, video URL) by gloss key.

---

## Team Integration & ML Swap-In Points

This backend contains two clearly marked drop-in points for model integration:

1. **SWAP-IN POINT #1 (`backend_main.py:167`)**: Replace mock landmark recognition with Member 1's real `recognize(landmark_sequence)` function call.
2. **SWAP-IN POINT #2 (`backend_main.py:214`)**: Replace mock keyword matching with Member 3's real ASR + `text_to_sign(text)` function call.

---

## Known Limitations / Next Steps

- **Offline Caching**: True offline support lives in the frontend service worker (caching last-fetched `/api/signs` responses via Cache API or IndexedDB), not in this backend, since the backend requires connectivity to reach staff devices in real time.
