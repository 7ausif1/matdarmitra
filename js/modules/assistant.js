/**
 * @module assistant
 * @description India election FAQ assistant with a sleek, premium UI.
 */
import { escapeHTML } from './security-utils.js';

const FAQ = [
  { q: ['register', 'registration', 'enroll', 'form 6'],
    a: 'To register as a voter in India, fill Form 6 at voterportal.eci.gov.in, the NVSP (nvsp.in), or via the Voter Helpline app. You can also submit Form 6 on paper to your local Booth Level Officer (BLO). You must be 18 or older on 1 January of the qualifying year. Keep proof of age and proof of address ready.' },
  { q: ['id', 'epic', 'voter id', 'identity', 'identification'],
    a: 'Your main voter ID is the EPIC (Electoral Photo Identity Card) issued by the ECI. On polling day, if you don\'t have your EPIC, you can use any ONE of 11 alternate documents: Aadhaar, Passport, Driving Licence, PAN Card, Service ID with photo, MGNREGA job card, bank/post office passbook with photo, health insurance smart card, pension document with photo, or official ID issued to MPs/MLAs/MLCs.' },
  { q: ['evm', 'electronic voting machine', 'voting machine'],
    a: 'An EVM (Electronic Voting Machine) has two parts — a Control Unit operated by the polling officer and a Ballot Unit where you press the button for your chosen candidate. EVMs are manufactured by BEL and ECIL and are standalone devices with no internet, Wi-Fi, or Bluetooth connectivity. Each EVM also has a VVPAT attached.' },
  { q: ['vvpat', 'paper slip', 'paper trail'],
    a: 'VVPAT stands for Voter Verifiable Paper Audit Trail. When you cast your vote on the EVM, the VVPAT prints a slip showing the candidate\'s name, serial number, and symbol. The slip is visible through a glass window for 7 seconds, then drops into a sealed box. VVPAT slips from 5 random polling stations per Assembly segment are mandatorily hand-counted on counting day.' },
  { q: ['nota', 'none of the above'],
    a: 'NOTA (None Of The Above) is an option on every EVM, introduced following the Supreme Court ruling in PUCL v. Union of India (2013). It lets you formally reject all candidates while still recording your participation. NOTA votes are counted but do not affect the winner — the candidate with the most votes still wins.' },
  { q: ['secure', 'security', 'tamper', 'hack'],
    a: 'Indian EVMs are standalone (no internet/Bluetooth/Wi-Fi), one-time programmable, and sealed in multiple layers with candidate agents\' signatures. EVMs are randomised twice before polling, stored in strongrooms with 24×7 CCTV, and the VVPAT paper trail allows physical verification. The Supreme Court has upheld the EVM+VVPAT system multiple times.' },
  { q: ['count', 'counting', 'result', 'tally'],
    a: 'Counting happens on a fixed date announced by the ECI. Postal ballots are counted first, then EVM votes are tallied round by round. Each round\'s totals are publicly announced. VVPAT slips from 5 randomly selected polling stations per Assembly segment are mandatorily hand-counted and matched against the EVM count before results are declared.' },
  { q: ['mcc', 'model code', 'code of conduct'],
    a: 'The Model Code of Conduct (MCC) is a set of ECI guidelines that take effect the moment elections are announced. Ruling parties cannot announce new schemes, transfer officials without ECI approval, or use state resources for campaigning. All parties must avoid hate speech, caste/communal appeals, and violation of campaign-silence periods.' },
  { q: ['nri', 'overseas', 'abroad'],
    a: 'NRI voters (Indian citizens living abroad) can register using Form 6A. However, as of now, NRI voters must be physically present at their registered polling station in India to vote — proxy and postal voting for general NRIs is under consideration but not yet implemented.' },
  { q: ['postal', 'absentee'],
    a: 'Postal ballots are available for service voters (armed forces, paramilitary, government employees on election duty), persons on election duty, electors in preventive detention, and since 2020, electors aged 80+ or with disabilities (optional, on prior request via Form 12D).' },
  { q: ['phases', 'schedule', 'when'],
    a: 'The Lok Sabha (general) election is usually conducted in multiple phases over several weeks for security and logistical reasons. State Assembly elections may be single-phase or multi-phase. Exact schedules are announced by the ECI through press conferences and published at eci.gov.in.' },
  { q: ['symbol', 'party symbol'],
    a: 'Every registered political party in India has an election symbol allotted by the ECI. Recognised national and state parties have reserved symbols; unrecognised parties and independents pick from a list of free symbols. Symbols help voters identify candidates, especially in multilingual and low-literacy contexts.' },
  { q: ['eci', 'election commission'],
    a: 'The Election Commission of India (ECI) is an independent constitutional body established under Article 324. It conducts elections to Parliament, State Legislatures, and the offices of President and Vice-President. It consists of the Chief Election Commissioner and two Election Commissioners.' },
  { q: ['booth', 'polling station'],
    a: 'You can find your assigned polling station at electoralsearch.eci.gov.in by entering your name and details, or via your EPIC number. The Voter Helpline app also shows your booth. Each polling station typically serves about 1,200–1,500 voters.' },
  { q: ['complaint', 'cvigil', 'mcc violation'],
    a: 'The cVIGIL app lets any citizen report MCC violations with a photo or video, geo-tagged and timestamped. The ECI commits to action within 100 minutes. You can also file complaints through the Voter Helpline (1950) or at eci.gov.in.' }
];

function findFAQ(question) {
  const lower = question.toLowerCase();
  return FAQ.find((item) => item.q.some((kw) => lower.includes(kw)));
}

export function renderAssistant(root) {
  if (!root) return;

  root.innerHTML = `
    <div class="mm-card glass mm-chat-window" style="padding: 0;">
      
      <!-- Chat Header -->
      <div style="background-color: var(--color-navy); padding: 1rem 1.5rem; color: white; display: flex; align-items: center; gap: 0.75rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-saffron);"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <div>
          <div style="font-weight: 600;">Matdar Mitra AI</div>
          <div style="font-size: 0.75rem; color: rgba(255,255,255,0.7);">Always online to help</div>
        </div>
      </div>

      <!-- Chat History -->
      <div id="chat-history" style="flex: 1; padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; background-color: var(--color-paper);">
        <!-- Greeting -->
        <div class="mm-chat-bubble ai">
          Namaste! I'm your Matdar Mitra assistant. Ask me any question about the Indian election process!
        </div>
      </div>

      <!-- Suggestions -->
      <div style="padding: 0 1.5rem 1rem; background-color: var(--color-paper); border-top: 1px solid var(--color-border);">
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;" id="suggestions">
          ${['How do I register?', 'What is VVPAT?', 'Are EVMs secure?', 'What is NOTA?']
            .map((s) => `<button class="mm-suggest-btn">${escapeHTML(s)}</button>`).join('')}
        </div>
      </div>

      <!-- Input Area -->
      <div style="padding: 1rem 1.5rem; background-color: white; border-top: 1px solid var(--color-border); display: flex; gap: 0.75rem;">
        <input id="asst-input" type="text" maxlength="200"
               style="flex: 1; border: 1px solid var(--color-border); padding: 0.75rem 1rem; border-radius: 2rem; font-family: inherit; font-size: 0.875rem; outline: none; transition: border-color 0.2s;"
               placeholder="Type your question here..." />
        <button id="asst-send" style="background-color: var(--color-navy); color: white; width: 3rem; height: 3rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; border: none; outline: none;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: -2px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  `;

  const input = root.querySelector('#asst-input');
  const sendBtn = root.querySelector('#asst-send');
  const history = root.querySelector('#chat-history');

  // Input focus effect
  input.addEventListener('focus', () => input.style.borderColor = 'var(--color-navy)');
  input.addEventListener('blur', () => input.style.borderColor = 'var(--color-border)');
  
  // Send button hover
  sendBtn.addEventListener('mouseover', () => sendBtn.style.transform = 'scale(1.05)');
  sendBtn.addEventListener('mouseout', () => sendBtn.style.transform = 'scale(1)');

  const appendMessage = (text, isUser) => {
    const wrapper = document.createElement('div');
    wrapper.className = `mm-chat-bubble ${isUser ? 'user' : 'ai'}`;
    
    // Animate message appearing
    wrapper.style.opacity = '0';
    wrapper.style.transform = 'translateY(10px)';
    wrapper.style.transition = 'opacity 0.3s, transform 0.3s';
    
    wrapper.innerHTML = isUser ? escapeHTML(text) : text;
    
    history.appendChild(wrapper);
    history.scrollTop = history.scrollHeight;
    
    // Trigger animation
    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'translateY(0)';
    });
  };

  const ask = (raw) => {
    const question = raw.trim();
    if (!question) return;

    input.value = '';
    appendMessage(question, true);

    // Simulate network delay for AI feel
    setTimeout(() => {
      const hit = findFAQ(question);
      if (hit) {
        appendMessage(`<strong>Answer:</strong> ${escapeHTML(hit.a)}<div style="margin-top: 0.5rem; font-size: 0.75rem; color: #718096; border-top: 1px solid var(--color-border); padding-top: 0.5rem;">Source: ECI knowledge base.</div>`, false);
      } else {
        appendMessage(`I don't have a specific answer for that yet. Try asking about: registration, EPIC, EVM, VVPAT, NOTA, security, or counting.<div style="margin-top: 0.5rem; font-size: 0.75rem; color: #718096; border-top: 1px solid var(--color-border); padding-top: 0.5rem;">Official resource: <a style="color: var(--color-saffron); font-weight: 600;" href="https://eci.gov.in">eci.gov.in</a></div>`, false);
      }
    }, 600);
  };

  sendBtn.addEventListener('click', () => ask(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') ask(input.value); });
  
  root.querySelectorAll('.mm-suggest-btn').forEach((b) => {
    b.addEventListener('click', () => { ask(b.textContent); });
  });
}
