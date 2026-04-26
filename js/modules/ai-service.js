/**
 * @module ai-service
 * @description Ultra-Robust Integration with Google Gemini API for Matdar Mitra.
 */

export async function getGeminiResponse(prompt, apiKey) {
  if (!apiKey) throw new Error('API Key is missing.');

  const SYSTEM_PROMPT = `You are "Matdar Mitra", an expert Indian Election Assistant. Provide accurate, non-partisan info based on ECI guidelines.`;
  
  // Exhaustive list of models and versions to try
  const attempts = [
    { model: 'gemini-1.5-flash', version: 'v1beta' },
    { model: 'gemini-1.5-flash-001', version: 'v1beta' },
    { model: 'gemini-1.5-flash-002', version: 'v1beta' },
    { model: 'gemini-1.5-flash-latest', version: 'v1beta' },
    { model: 'gemini-1.5-pro', version: 'v1beta' },
    { model: 'gemini-pro', version: 'v1beta' },
    { model: 'gemini-1.5-flash', version: 'v1' }
  ];

  let lastError = null;

  for (const attempt of attempts) {
    try {
      const url = `https://generativelanguage.googleapis.com/${attempt.version}/models/${attempt.model}:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${prompt}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const err = await response.json();
        console.warn(`Attempt failed for ${attempt.model}:`, err.error?.message);
        lastError = err.error?.message;
      }
    } catch (e) {
      lastError = e.message;
    }
  }

  throw new Error(`AI Connection Failed: ${lastError}. Please verify your API Key in Google AI Studio.`);
}
