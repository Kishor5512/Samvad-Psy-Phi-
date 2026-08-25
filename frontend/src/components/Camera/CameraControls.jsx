import React from "react";

function CameraControls({
  isCapturing,
  onStart,
  onStop,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginTop: "20px",
      }}
    >
      {!isCapturing ? (
        <button
          onClick={onStart}
          style={{
            padding: "12px 25px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Start Recognition
        </button>
      ) : (
        <button
          onClick={onStop}
          style={{
            padding: "12px 25px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Stop Recognition
        </button>
      )}
    </div>
  );
}

export default CameraControls;