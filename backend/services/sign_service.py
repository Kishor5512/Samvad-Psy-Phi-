import json
from pathlib import Path
from typing import Any, Dict, List


class SignService:

    def __init__(self):

        self.repository_root = Path("sign-repository")

        self.metadata_file = (
            self.repository_root
            / "metadata"
            / "signs.json"
        )

        self.metadata: Dict[str, Any] = {}

        self._load_metadata()

    def _load_metadata(self):

        if not self.metadata_file.exists():
            self.metadata = {}
            return

        try:

            with open(
                self.metadata_file,
                "r",
                encoding="utf-8",
            ) as file:

                self.metadata = json.load(file)

        except (json.JSONDecodeError, OSError):

            self.metadata = {}

    def get_sign(
        self,
        gloss: str,
        sector: str = "general",
    ) -> Dict[str, Any]:

        normalized = gloss.strip().upper()

        image_path = (
            self.repository_root
            / "images"
            / sector
            / f"{normalized.lower()}.png"
        )

        video_path = (
            self.repository_root
            / "videos"
            / sector
            / f"{normalized.lower()}.mp4"
        )

        return {
            "gloss": normalized,
            "image": self._public_path(image_path),
            "video": self._public_path(video_path),
            "sector": sector,
        }

    def get_sequence(
        self,
        glosses: List[str],
        sector: str = "general",
    ) -> List[Dict[str, Any]]:

        return [
            self.get_sign(
                gloss=gloss,
                sector=sector,
            )
            for gloss in glosses
        ]

    @staticmethod
    def _public_path(path: Path):

        if path.exists():
            return "/" + path.as_posix()

        return None


sign_service = SignService()