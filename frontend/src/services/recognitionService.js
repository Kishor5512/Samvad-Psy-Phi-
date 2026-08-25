const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function recognizeSign(frameBlob) {
  if (!frameBlob) {
    throw new Error("No frame provided.");
  }

  const formData = new FormData();

  formData.append(
    "frame",
    frameBlob,
    "isl-frame.jpg"
  );

  const response = await fetch(
    `${API_BASE_URL}/api/recognition`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Recognition request failed: ${response.status}`
    );
  }

  return response.json();
}