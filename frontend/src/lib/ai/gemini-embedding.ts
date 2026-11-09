/**
 * Google Gemini Embedding API Client for Cloudflare Workers & Next.js Edge.
 * Generates 1536-dimensional multilingual embeddings via gemini-embedding-2.
 */

export async function generateGeminiEmbedding(
  text: string,
  apiKey: string,
  modelName = 'gemini-embedding-2',
  dimension = 1536
): Promise<number[]> {
  const cleanKey = (apiKey || '').trim();
  if (!cleanKey || cleanKey.startsWith('PASTE_YOUR_')) {
    throw new Error('GEMINI_API_KEY is not configured or still has placeholder value.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:embedContent?key=${cleanKey}`;

  const requestBody = {
    model: `models/${modelName}`,
    content: {
      parts: [{ text: text.trim() }],
    },
    outputDimensionality: dimension,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gemini Embedding API error (HTTP ${response.status}): ${errorText.slice(0, 300)}`
    );
  }

  const data = (await response.json()) as any;
  const values = data?.embedding?.values;

  if (!values || !Array.isArray(values) || values.length === 0) {
    throw new Error('Gemini Embedding API returned invalid or empty vector values.');
  }

  return values as number[];
}

