import React from "react";

function SignImage({ src, alt = "Indian Sign Language" }) {
  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: "220px",
        height: "220px",
        objectFit: "contain",
        borderRadius: "10px",
      }}
    />
  );
}

export default SignImage;