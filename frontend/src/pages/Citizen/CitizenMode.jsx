import React, { useRef, useState } from "react";

import CameraView from "../../components/Camera/CameraView";
import CameraControls from "../../components/Camera/CameraControls";

import { captureFrame } from "../../services/cameraService";
import { recognizeSign } from "../../services/recognitionService";

function CitizenMode() {
  const videoRef = useRef(null);
  const recognitionTimerRef = useRef(null);

  const [recognizing, setRecognizing] = useState(false);
  const [status, setStatus] = useState("Starting camera...");

  const [recognizedText, setRecognizedText] = useState("");
  const [confidence, setConfidence] = useState(0);

  const handleCameraReady = () => {
    setStatus("Camera ready");
  };

  const handleCameraError = (message) => {
    setStatus(message);
  };

  const handleVideoReady = (video) => {
    videoRef.current = video;
  };

  const recognizeCurrentFrame = async () => {
    try {
      if (!videoRef.current) {
        return;
      }

      const frame = await captureFrame(
        videoRef.current
      );

      const result = await recognizeSign(frame);

      console.log("Recognition result:", result);

      if (result.text) {
        setRecognizedText(result.text);
      }

      if (typeof result.confidence === "number") {
        setConfidence(result.confidence);
      }

      setStatus("Sign recognized");
    } catch (error) {
      console.error(error);

      setStatus(
        "Waiting for recognition service..."
      );
    }
  };

  const startRecognition = () => {
    setRecognizing(true);

    setStatus(
      "Recognition started — scanning signs..."
    );

    /*
     * Capture one frame every second.
     *
     * Later, this can be changed to a proper
     * landmark sequence pipeline.
     */
    recognitionTimerRef.current =
      setInterval(() => {
        recognizeCurrentFrame();
      }, 1000);
  };

  const stopRecognition = () => {
    setRecognizing(false);

    if (recognitionTimerRef.current) {
      clearInterval(
        recognitionTimerRef.current
      );

      recognitionTimerRef.current = null;
    }

    setStatus("Recognition stopped");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          maxWidth: "900px",
          margin: "0 auto 30px",
          textAlign: "center",
        }}
      >
        <h1>SAMVAAD</h1>

        <h2>Citizen Mode</h2>

        <p>
          Show your Indian Sign Language to communicate
          with the service provider.
        </p>
      </header>

      <section>
        <CameraView
          onCameraReady={handleCameraReady}
          onCameraError={handleCameraError}
          onVideoReady={handleVideoReady}
        />

        <CameraControls
          isCapturing={recognizing}
          onStart={startRecognition}
          onStop={stopRecognition}
        />

        <div
          style={{
            maxWidth: "900px",
            margin: "25px auto",
            padding: "20px",
            borderRadius: "10px",
            background: "#f5f5f5",
          }}
        >
          <h3>Status</h3>

          <p>{status}</p>

          <h3>Recognized Text</h3>

          <p>
            {recognizedText ||
              "No sign recognized yet."}
          </p>

          <h3>Confidence</h3>

          <p>
            {Math.round(confidence * 100)}%
          </p>
        </div>
      </section>
    </main>
  );
}

export default CitizenMode;