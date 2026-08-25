import React, { useState } from "react";

import TextInput from "../../components/ProviderInput/TextInput";
import SpeechInput from "../../components/ProviderInput/SpeechInput";

import SignSequence from "../../components/SignDisplay/SignSequence";

import { translateToSigns } from "../../services/translationService";
import { getSigns } from "../../services/signService";

function ProviderMode() {
  const [message, setMessage] = useState("");
  const [sector, setSector] = useState("healthcare");

  const [signs, setSigns] = useState([]);

  const [status, setStatus] = useState(
    "Enter a message"
  );

  const processMessage = async (text) => {
    if (!text) {
      return;
    }

    setMessage(text);
    setStatus("Processing message...");
    setSigns([]);

    try {
      const translation =
        await translateToSigns(
          text,
          sector
        );

      console.log(
        "Translation result:",
        translation
      );

      const gloss =
        translation.gloss ||
        translation.glosses;

      if (!gloss) {
        setStatus(
          "No sign translation returned."
        );
        return;
      }

      setStatus("Loading ISL signs...");

      const signResult =
        await getSigns(gloss, sector);

      console.log(
        "Sign result:",
        signResult
      );

      const signList =
        signResult.signs ||
        signResult;

      setSigns(
        Array.isArray(signList)
          ? signList
          : []
      );

      setStatus("Signs ready");
    } catch (error) {
      console.error(error);

      setStatus(
        "Translation service is not available yet."
      );
    }
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

        <h2>Provider Mode</h2>

        <p>
          Communicate with the Deaf citizen using
          text, speech and Indian Sign Language.
        </p>
      </header>

      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <label
            htmlFor="sector"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Service Sector
          </label>

          <select
            id="sector"
            value={sector}
            onChange={(event) =>
              setSector(event.target.value)
            }
            style={{
              padding: "10px",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            <option value="healthcare">
              Healthcare
            </option>

            <option value="banking">
              Banking
            </option>

            <option value="government">
              Government
            </option>

            <option value="education">
              Education
            </option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gap: "25px",
          }}
        >
          <TextInput
            onSubmit={processMessage}
          />

          <div
            style={{
              textAlign: "center",
            }}
          >
            <p>OR</p>

            <SpeechInput
              onSpeechResult={processMessage}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            borderRadius: "10px",
            background: "#f5f5f5",
          }}
        >
          <h3>Status</h3>

          <p>{status}</p>

          {message && (
            <>
              <h3>Provider Message</h3>

              <p>{message}</p>
            </>
          )}
        </div>

        <div
          style={{
            marginTop: "30px",
          }}
        >
          <h3>ISL Response</h3>

          <SignSequence signs={signs} />
        </div>
      </section>
    </main>
  );
}

export default ProviderMode;