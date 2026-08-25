from typing import Any, Dict, List


class RecognitionService:
    """
    Adapter for Member 1's Edge AI recognition pipeline.

    Member 1 can later replace the internal implementation with:

        MediaPipe
        -> preprocessing
        -> ONNX
        -> classifier
        -> confidence

    The backend interface remains unchanged.
    """

    def __init__(self):
        self.model_loaded = False
        self._recognizer = None

        self._try_load_recognizer()

    def _try_load_recognizer(self):
        """
        Attempt to import Member 1's inference implementation.

        We deliberately don't crash the backend if the model
        is not available yet.
        """

        try:
            from edge_ai.recognition.inference import recognize

            self._recognizer = recognize
            self.model_loaded = True

        except (ImportError, AttributeError):
            self._recognizer = None
            self.model_loaded = False

    def recognize(
        self,
        landmarks: List[Any],
        sequence_id: str | None = None,
    ) -> Dict[str, Any]:

        if not landmarks:
            return {
                "sign": "UNKNOWN",
                "confidence": 0.0,
                "text": None,
                "sequence_id": sequence_id,
                "status": "no_landmarks",
            }

        if self._recognizer is None:
            return {
                "sign": "UNKNOWN",
                "confidence": 0.0,
                "text": None,
                "sequence_id": sequence_id,
                "status": "model_not_loaded",
            }

        try:
            result = self._recognizer(landmarks)

            sign = result.get("sign", "UNKNOWN")
            confidence = float(result.get("confidence", 0.0))

            return {
                "sign": sign,
                "confidence": confidence,
                "text": result.get("text", sign),
                "sequence_id": sequence_id,
                "status": "success",
            }

        except Exception as exc:
            return {
                "sign": "UNKNOWN",
                "confidence": 0.0,
                "text": None,
                "sequence_id": sequence_id,
                "status": f"inference_error: {str(exc)}",
            }


recognition_service = RecognitionService()