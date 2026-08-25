import React, { useState } from "react";

function SpeechInput({ onSpeechResult }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      onSpeechResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  if (!supported) {
    return (
      <div>
        Speech recognition is not supported in this
        browser. Please use text input.
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startListening}
      disabled={listening}
      style={{
        padding: "12px 24px",
        borderRadius: "8px",
        border: "none",
        cursor: listening
          ? "not-allowed"
          : "pointer",
        fontSize: "16px",
      }}
    >
      {listening
        ? "Listening..."
        : "🎤 Speak Message"}
    </button>
  );
}

export default SpeechInput;