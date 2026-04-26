/**
 * @module ai-service
 * @description Integration with Google Gemini API for the Matdar Mitra assistant.
 */

// Switching to gemini-pro (1.0) which has the highest compatibility across all API keys and regions
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * System prompt to give Gemini the context of an Indian Election Assistant.
 */
const SYSTEM_PROMPT = `
You are "Matdar Mitra", an expert AI assistant for the Indian Election process. 
Your goal is to provide accurate, non-partisan, and helpful information to Indian voters.
Base your answers on Election Commission of India (ECI) guidelines.

Key Context:
- EVMs are standalone, secure devices.
- VVPAT allows voters to verify their vote.
- Registration is via Form 6.
- MCC (Model Code of Conduct) ensures fair play.
- 12 identity documents are accepted (EPIC, Aadhaar, etc.).

Tone: Professional, helpful, and simplified. 
If you don't know an answer, refer the user to the official ECI website (eci.gov.in) or the Voter Helpline (1950).
Avoid political opinions or endorsing any specific party/candidate.
`;

/**
 * Sends a message to the Gemini API.
 * @param {string} prompt - User's question.
 * @param {string} apiKey - Google Cloud API Key.
 * @returns {Promise<string>} - AI Response.
 */
export async function getGeminiResponse(prompt, apiKey) {
  if (!apiKey) {
    throw new Error('API Key is missing. Please provide a valid Google Cloud API Key.');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${SYSTEM_PROMPT}\n\nUser Question: ${prompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch AI response');
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'I am sorry, I could not generate a response.';
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}
