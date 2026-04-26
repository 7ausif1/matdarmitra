/**
 * @module translator
 * @description Gemini-powered Batch Translator for Matdar Mitra.
 */

import { getGeminiResponse } from './ai-service.js';

export function initTranslator() {
  const langSelector = document.getElementById('lang-selector');
  if (!langSelector) return;

  langSelector.addEventListener('change', async (e) => {
    const targetLang = e.target.options[e.target.selectedIndex].text;
    if (e.target.value === 'en') {
      window.location.reload();
      return;
    }
    await translatePageBatch(targetLang);
  });
}

async function translatePageBatch(language) {
  const overlay = document.createElement('div');
  overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.9); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif;";
  overlay.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div><p style="margin-top:1rem; font-weight:600; color:#000058;">Translating site to ${language}...</p>`;
  document.body.appendChild(overlay);

  try {
    const apiKey = window.GEMINI_API_KEY || "";
    if (!apiKey) {
      alert("Please add your Gemini API Key in the Assistant settings first!");
      document.body.removeChild(overlay);
      return;
    }

    // Collect all unique text from high-impact elements
    const elements = Array.from(document.querySelectorAll('h1, h2, .section-subtitle, .nav-links a, .hero-text p, .btn-primary'));
    const textToTranslate = elements.map(el => el.innerText.trim()).filter(t => t.length > 1);
    
    // Create a batch prompt
    const prompt = `Translate this list of UI strings into ${language}. 
    Return ONLY a JSON array of strings in the exact same order. 
    Do not include any numbering or explanations.
    Strings: ${JSON.stringify(textToTranslate)}`;

    const response = await getGeminiResponse(prompt, apiKey);
    
    // Parse the JSON array from Gemini
    try {
      const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const translatedArray = JSON.parse(cleanJson);

      if (Array.isArray(translatedArray)) {
        let i = 0;
        elements.forEach(el => {
          if (el.innerText.trim().length > 1) {
            el.innerText = translatedArray[i] || el.innerText;
            i++;
          }
        });
      }
    } catch (parseErr) {
      console.error("Failed to parse translation JSON:", response);
      alert("Translation failed. Gemini returned an invalid format. Please try again.");
    }

  } catch (error) {
    console.error("Translator Error:", error);
    alert(`Translation Error: ${error.message}`);
  } finally {
    document.body.removeChild(overlay);
  }
}
