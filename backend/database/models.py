from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from backend.database.database import Base


class CommunicationSession(Base):

    __tablename__ = "communication_sessions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    sector = Column(
        String(100),
        nullable=True,
    )

    citizen_id = Column(
        String(100),
        nullable=True,
    )

    provider_id = Column(
        String(100),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class ConversationMessage(Base):

    __tablename__ = "conversation_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    session_id = Column(
        Integer,
        nullable=False,
        index=True,
    )

    sender = Column(
        String(20),
        nullable=False,
    )

    input_type = Column(
        String(30),
        nullable=False,
    )

    input_text = Column(
        Text,
        nullable=True,
    )

    output_text = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )