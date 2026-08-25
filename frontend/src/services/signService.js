const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";

export async function getSigns(
  gloss,
  sector = "general"
) {
  if (!gloss) {
    return [];
  }

  const response = await fetch(
    `${API_BASE_URL}/api/signs?gloss=${encodeURIComponent(
      gloss
    )}&sector=${encodeURIComponent(sector)}`
  );

  if (!response.ok) {
    throw new Error(
      `Sign lookup failed: ${response.status}`
    );
  }

  return response.json();
}