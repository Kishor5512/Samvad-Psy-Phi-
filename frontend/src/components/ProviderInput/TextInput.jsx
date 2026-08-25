import React, { useState } from "react";

function TextInput({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanedText = text.trim();

    if (!cleanedText) {
      return;
    }

    onSubmit(cleanedText);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
      }}
    >
      <label
        htmlFor="provider-message"
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "bold",
        }}
      >
        Type your message
      </label>

      <textarea
        id="provider-message"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type a message for the citizen..."
        rows={4}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          resize: "vertical",
          fontSize: "16px",
        }}
      />

      <button
        type="submit"
        disabled={!text.trim()}
        style={{
          marginTop: "12px",
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          cursor: text.trim()
            ? "pointer"
            : "not-allowed",
          fontSize: "16px",
        }}
      >
        Convert to Sign Language
      </button>
    </form>
  );
}

export default TextInput;