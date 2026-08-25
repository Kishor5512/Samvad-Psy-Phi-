const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";

export async function translateToSigns(
  text,
  sector = "general"
) {
  if (!text || !text.trim()) {
    throw new Error("Text is required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/translation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.trim(),
        sector,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Translation failed: ${response.status}`
    );
  }

  return response.json();
}