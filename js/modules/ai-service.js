/**
 * @module ai-service
 * @description Robust Integration with Google Gemini API for Matdar Mitra.
 */

export async function getGeminiResponse(prompt, apiKey) {
  if (!apiKey) throw new Error('API Key is missing.');

  // Using the most stable endpoint and model for AI Studio keys
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
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
      throw new Error(err.error?.message || 'API Error');
    }
  } catch (e) {
    // Fallback to v1beta if v1 fails (some older keys prefer this)
    if (e.message.includes('not found')) {
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const fbResp = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
        })
      });
      if (fbResp.ok) {
        const fbData = await fbResp.json();
        return fbData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
    }
    throw e;
  }
}
