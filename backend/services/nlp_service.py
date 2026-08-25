from typing import Any, Dict, List


class NLPService:

    def __init__(self):
        self._gloss_generator = None
        self._load_gloss_generator()

    def _load_gloss_generator(self):

        try:
            from nlp.gloss.gloss_generator import generate_gloss

            self._gloss_generator = generate_gloss

        except (ImportError, AttributeError):
            self._gloss_generator = None

    def text_to_gloss(
        self,
        text: str,
        sector: str = "general",
    ) -> Dict[str, Any]:

        if not text.strip():
            return {
                "text": text,
                "gloss": [],
                "sector": sector,
                "status": "empty_text",
            }

        if self._gloss_generator is None:

            # Temporary fallback.
            # Replace when Member 3's implementation is ready.
            gloss = [
                word.upper()
                for word in text.split()
                if word.strip()
            ]

            return {
                "text": text,
                "gloss": gloss,
                "sector": sector,
                "status": "fallback",
            }

        try:

            gloss_result = self._gloss_generator(
                text=text,
                sector=sector,
            )

            if isinstance(gloss_result, list):
                gloss = gloss_result
            else:
                gloss = gloss_result.get("gloss", [])

            return {
                "text": text,
                "gloss": gloss,
                "sector": sector,
                "status": "success",
            }

        except Exception as exc:

            return {
                "text": text,
                "gloss": [],
                "sector": sector,
                "status": f"nlp_error: {str(exc)}",
            }


nlp_service = NLPService()