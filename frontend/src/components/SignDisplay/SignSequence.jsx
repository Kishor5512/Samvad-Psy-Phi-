import React from "react";

import SignImage from "./SignImage";

function SignSequence({ signs = [] }) {
  if (!signs.length) {
    return (
      <div
        style={{
          padding: "30px",
          textAlign: "center",
          borderRadius: "10px",
          background: "#f5f5f5",
        }}
      >
        <p>No sign sequence available.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      {signs.map((sign, index) => (
        <div
          key={`${sign.gloss || "sign"}-${index}`}
          style={{
            textAlign: "center",
          }}
        >
          <SignImage
            src={sign.image}
            alt={
              sign.label ||
              sign.gloss ||
              "ISL sign"
            }
          />

          <p>
            {sign.label || sign.gloss}
          </p>
        </div>
      ))}
    </div>
  );
}

export default SignSequence;