/**
 * @module ai-service
 * @description Ultra-Robust Integration with Google Gemini API for Matdar Mitra.
 */

export async function getGeminiResponse(prompt, apiKey) {
  if (!apiKey) throw new Error('API Key is missing.');

  // The most exhaustive list of model paths for different regions/key types
  const attempts = [
    { m: 'gemini-1.5-flash', v: 'v1beta' },
    { m: 'gemini-1.5-flash-latest', v: 'v1beta' },
    { m: 'gemini-1.5-flash-8b', v: 'v1beta' },
    { m: 'gemini-1.5-flash', v: 'v1' },
    { m: 'gemini-pro', v: 'v1beta' },
    { m: 'gemini-1.5-pro', v: 'v1beta' }
  ];

  let lastError = "All models returned 404. Please check if 'Generative Language API' is enabled in Google Cloud Console.";

  for (const attempt of attempts) {
    try {
      const url = `https://generativelanguage.googleapis.com/${attempt.v}/models/${attempt.m}:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else {
        const err = await response.json();
        console.warn(`Model ${attempt.m} failed:`, err.error?.message);
        lastError = err.error?.message;
      }
    } catch (e) {
      lastError = e.message;
    }
  }

  throw new Error(lastError);
}
