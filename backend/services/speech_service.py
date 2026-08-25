from typing import Any, Dict


class SpeechService:

    def __init__(self):
        self._asr = None
        self._tts = None

        self._load_asr()
        self._load_tts()

    def _load_asr(self):

        try:
            from speech.asr.whisper_engine import transcribe

            self._asr = transcribe

        except (ImportError, AttributeError):
            self._asr = None

    def _load_tts(self):

        try:
            from speech.tts.piper_engine import synthesize

            self._tts = synthesize

        except (ImportError, AttributeError):
            self._tts = None

    def transcribe(self, audio_path: str) -> Dict[str, Any]:

        if self._asr is None:
            return {
                "text": "",
                "status": "asr_not_loaded",
            }

        try:
            text = self._asr(audio_path)

            return {
                "text": text,
                "status": "success",
            }

        except Exception as exc:
            return {
                "text": "",
                "status": f"asr_error: {str(exc)}",
            }

    def synthesize(self, text: str) -> Dict[str, Any]:

        if self._tts is None:
            return {
                "audio": None,
                "status": "tts_not_loaded",
            }

        try:
            audio_path = self._tts(text)

            return {
                "audio": audio_path,
                "status": "success",
            }

        except Exception as exc:
            return {
                "audio": None,
                "status": f"tts_error: {str(exc)}",
            }


speech_service = SpeechService()