/**
 * @module assistant
 * @description India election FAQ assistant with Gemini AI integration.
 */
import { escapeHTML } from './security-utils.js';
import { getGeminiResponse } from './ai-service.js';

// Fallback FAQ for offline/no-key scenarios
const FAQ = [
  { q: ['register', 'registration', 'enroll', 'form 6'],
    a: 'To register as a voter in India, fill Form 6 at voterportal.eci.gov.in, the NVSP (nvsp.in), or via the Voter Helpline app.' },
  { q: ['evm', 'electronic voting machine', 'voting machine'],
    a: 'An EVM (Electronic Voting Machine) is a secure, standalone device used to record votes electronically.' },
  { q: ['vvpat', 'paper slip', 'paper trail'],
    a: 'VVPAT stands for Voter Verifiable Paper Audit Trail. It allows you to verify your vote via a printed slip.' },
  { q: ['nota', 'none of the above'],
    a: 'NOTA allows you to reject all candidates in an election while still participating.' }
];

// Use global key set by app.js or empty fallback
let API_KEY = window.GEMINI_API_KEY || "";

function findFAQ(question) {
  const lower = question.toLowerCase();
  return FAQ.find((item) => item.q.some((kw) => lower.includes(kw)));
}

export function renderAssistant(root) {
  if (!root) return;

  root.innerHTML = `
    <div class="mm-card glass mm-chat-window" style="padding: 0;">
      
      <!-- Chat Header -->
      <div style="background-color: var(--color-navy); padding: 1rem 1.5rem; color: white; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-saffron);"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <div>
            <div style="font-weight: 600;">Matdar Mitra AI</div>
            <div style="font-size: 0.75rem; color: rgba(255,255,255,0.7);">Powered by Google Gemini</div>
          </div>
        </div>
        <button id="asst-config" title="Settings" style="background: none; border: none; color: white; cursor: pointer; opacity: 0.7;">
          <span class="material-icons-outlined" style="font-size: 20px;">settings</span>
        </button>
      </div>

      <!-- Chat History -->
      <div id="chat-history" style="flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; background-color: var(--color-paper); min-height: 300px; max-height: 400px;">
        <div class="mm-chat-bubble ai">
          Namaste! I'm your Matdar Mitra assistant. Ask me anything about the Indian election process!
        </div>
      </div>

      <!-- Suggestions -->
      <div style="padding: 0 1.5rem 1rem; background-color: var(--color-paper); border-top: 1px solid var(--color-border);">
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;" id="suggestions">
          ${['How do I register?', 'What is VVPAT?', 'Are EVMs secure?']
            .map((s) => `<button class="mm-suggest-btn">${escapeHTML(s)}</button>`).join('')}
        </div>
      </div>

      <!-- Input Area -->
      <div style="padding: 1rem 1.5rem; background-color: white; border-top: 1px solid var(--color-border); display: flex; gap: 0.75rem; align-items: center;">
        <input id="asst-input" type="text" maxlength="200"
               style="flex: 1; border: 1px solid var(--color-border); padding: 0.75rem 1rem; border-radius: 2rem; font-family: inherit; font-size: 0.875rem; outline: none; transition: border-color 0.2s;"
               placeholder="Type your question here..." />
        <button id="asst-send" aria-label="Send Message" style="background-color: var(--color-navy); color: white; width: 3rem; height: 3rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; border: none;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>

      <!-- Config Modal -->
      <div id="asst-modal" style="display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.95); z-index: 10; padding: 2rem; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
        <h4 style="margin-bottom: 1rem;">Gemini API Configuration</h4>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">Enter your Google Cloud API Key to enable smart AI responses.</p>
        <input id="asst-api-key" type="password" placeholder="Enter API Key" value="${API_KEY}" style="width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--color-border); margin-bottom: 1rem;" />
        <div style="display: flex; gap: 1rem;">
          <button id="asst-save-config" class="btn btn-primary" style="padding: 0.5rem 1rem;">Save Key</button>
          <button id="asst-close-modal" class="btn" style="padding: 0.5rem 1rem; background: var(--color-border);">Close</button>
        </div>
      </div>
    </div>
  `;

  const input = root.querySelector('#asst-input');
  const sendBtn = root.querySelector('#asst-send');
  const history = root.querySelector('#chat-history');
  const modal = root.querySelector('#asst-modal');
  const configBtn = root.querySelector('#asst-config');
  const saveKeyBtn = root.querySelector('#asst-save-config');
  const closeBtn = root.querySelector('#asst-close-modal');
  const apiKeyInput = root.querySelector('#asst-api-key');

  const appendMessage = (text, isUser) => {
    const wrapper = document.createElement('div');
    wrapper.className = `mm-chat-bubble ${isUser ? 'user' : 'ai'}`;
    wrapper.innerHTML = isUser ? escapeHTML(text) : text;
    history.appendChild(wrapper);
    history.scrollTop = history.scrollHeight;
    return wrapper;
  };

  const appendLoading = () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'mm-chat-bubble ai';
    wrapper.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    history.appendChild(wrapper);
    history.scrollTop = history.scrollHeight;
    return wrapper;
  };

  const ask = async (raw) => {
    const question = raw.trim();
    if (!question) return;

    input.value = '';
    appendMessage(question, true);

    const loader = appendLoading();

    try {
      // Re-check API_KEY in case it was updated via UI or set globally
      const currentKey = API_KEY || window.GEMINI_API_KEY;
      if (currentKey) {
        const response = await getGeminiResponse(question, currentKey);
        loader.innerHTML = `<strong>Answer:</strong> ${escapeHTML(response)}<div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--color-text-muted); border-top: 1px solid var(--color-border); padding-top: 0.5rem;">Source: Matdar Mitra AI (Gemini 1.5 Flash)</div>`;
      } else {
        const hit = findFAQ(question);
        setTimeout(() => {
          if (hit) {
            loader.innerHTML = `<strong>Answer:</strong> ${escapeHTML(hit.a)}<div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--color-text-muted); border-top: 1px solid var(--color-border); padding-top: 0.5rem;">Source: ECI Local FAQ</div>`;
          } else {
            loader.innerHTML = `I don't have a specific answer. Try asking about registration or EVMs, or configure the Gemini API Key for smart answers.`;
          }
        }, 600);
      }
    } catch (error) {
      loader.innerHTML = `<span style="color: red;">Error: ${escapeHTML(error.message)}</span>`;
    }
  };

  // Event Listeners
  sendBtn.addEventListener('click', () => ask(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') ask(input.value); });
  
  configBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
  closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  saveKeyBtn.addEventListener('click', () => {
    API_KEY = apiKeyInput.value.trim();
    window.GEMINI_API_KEY = API_KEY;
    modal.style.display = 'none';
  });

  root.querySelectorAll('.mm-suggest-btn').forEach((b) => {
    b.addEventListener('click', () => { ask(b.textContent); });
  });
}
