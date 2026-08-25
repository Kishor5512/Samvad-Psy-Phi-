import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        SAMVAAD
      </h1>

      <h2>
        Indian Sign Language Communication Platform
      </h2>

      <p
        style={{
          maxWidth: "600px",
          fontSize: "18px",
          lineHeight: "1.6",
        }}
      >
        Enabling accessible communication between Deaf citizens
        and service providers using Indian Sign Language and
        Edge AI.
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <button
          onClick={() => navigate("/citizen")}
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Citizen Mode
        </button>

        <button
          onClick={() => navigate("/provider")}
          style={{
            padding: "15px 30px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Provider Mode
        </button>
      </div>
    </div>
  );
}

export default Landing;