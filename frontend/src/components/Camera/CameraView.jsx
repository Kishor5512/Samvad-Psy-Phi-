import React, { useEffect, useRef, useState } from "react";

function CameraView({
  onCameraReady,
  onCameraError,
  onVideoReady,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is not supported by this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: {
            ideal: 1280,
          },
          height: {
            ideal: 720,
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        if (onVideoReady) {
         onVideoReady(videoRef.current);
         }
      }

      setCameraActive(true);

      if (onCameraReady) {
        onCameraReady(stream);
      }
    } catch (err) {
      console.error("Camera error:", err);

      let message = "Unable to access the camera.";

      if (err.name === "NotAllowedError") {
        message = "Camera permission was denied.";
      } else if (err.name === "NotFoundError") {
        message = "No camera was found.";
      } else if (err.name === "NotReadableError") {
        message = "Camera is already being used by another application.";
      }

      setError(message);
      setCameraActive(false);

      if (onCameraError) {
        onCameraError(message);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    setCameraActive(false);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          background: "#111",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
        />

        {cameraActive && (
          <div
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              padding: "8px 12px",
              background: "rgba(0, 0, 0, 0.65)",
              color: "white",
              borderRadius: "20px",
              fontSize: "14px",
            }}
          >
            ● Camera Active
          </div>
        )}

        {!cameraActive && !error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            Starting camera...
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: "15px",
            padding: "15px",
            borderRadius: "8px",
            background: "#fee",
          }}
        >
          <p>{error}</p>

          <button onClick={startCamera}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default CameraView;