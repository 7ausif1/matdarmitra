/**
 * @module simulator
 * @description EVM + VVPAT polling-booth simulator using Vanilla CSS.
 */
import { escapeHTML } from './security-utils.js';

const FICTIONAL_CANDIDATES = [
  { id: 'c1', name: 'Candidate A', party: 'Fictional Green Party', color: '#138808' },
  { id: 'c2', name: 'Candidate B', party: 'Fictional Blue Party', color: '#000080' },
  { id: 'c3', name: 'Candidate C', party: 'Fictional Orange Party', color: '#FF9933' },
  { id: 'none', name: 'NOTA', party: 'None Of The Above', color: '#e53e3e' }
];

const getCandidateIcon = (c) => {
  if (c.id === 'none') {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="${c.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
      </svg>`;
  }
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="${c.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>`;
};

const STEP_LABELS = ['ID Check', 'Indelible Ink', 'Cast Vote', 'VVPAT Check', 'Done'];
const STEP_KEYS   = ['id', 'ink', 'evm', 'vvpat', 'done'];

function renderProgress(step) {
  return `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; font-size: 0.75rem;" role="list" aria-label="Progress">
      ${STEP_LABELS.map((label, i) => {
        const active = STEP_KEYS.indexOf(step) >= i;
        const current = STEP_KEYS[i] === step;
        return `<div style="flex: 1; text-align: center;" role="listitem">
          <div style="width: 2rem; height: 2rem; border-radius: 9999px; margin: 0 auto 0.25rem; display: flex; align-items: center; justify-content: center; font-weight: 700; ${active ? 'background-color: var(--color-primary); color: white;' : 'background-color: #e2e8f0; color: var(--color-text-muted);'}"
            aria-current="${current ? 'step' : 'false'}">${i + 1}</div>
          <div style="${active ? 'color: var(--color-primary); font-weight: 600;' : 'color: var(--color-text-muted);'}">${escapeHTML(label)}</div>
        </div>`;
      }).join('')}
    </div>`;
}

export function renderSimulator(root) {
  if (!root) return;

  const state = { step: 'id', choice: null, isVoting: false };

  const stepRenderers = {
    id: () => `
      <h3 class="mm-card-title">Step 1 — Identity Verification</h3>
      <p class="mm-text-muted" style="margin-bottom: 1rem;">The Polling Officer checks your name on the electoral roll and verifies your identity using your <strong>EPIC (Voter ID)</strong> or one of 11 alternate documents.</p>
      <div style="background-color: var(--color-paper); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1rem;">
        <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.25rem;">Acceptable documents (any ONE):</div>
        <div style="font-size: 0.875rem;">EPIC · Aadhaar · Passport · Driving Licence · PAN Card · Service ID with photo · MGNREGA job card · Bank/Post Office passbook with photo · Health insurance smart card · Pension document with photo · Official ID cards issued to MPs/MLAs/MLCs</div>
      </div>
      <button id="show-id" class="btn btn-primary" style="width: 100%;">
        Show EPIC to Polling Officer →
      </button>`,

    ink: () => `
      <h3 class="mm-card-title">Step 2 — Indelible Ink</h3>
      <p class="mm-text-muted" style="margin-bottom: 1rem;">A mark of indelible ink is applied to your left index finger. This prevents anyone from voting twice — the ink lasts several days and cannot be washed off.</p>
      
      <div style="display: flex; justify-content: center; margin: 1.5rem 0;">
        <svg width="120" height="120" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <!-- Hand from SVGrepo (pointing-up-finger) -->
          <g transform="translate(1 1)">
            <path d="M417.254,178.2c-9.387,0-18.773,3.413-25.6,8.533V178.2c0-23.893-18.773-42.667-42.667-42.667
              c-9.387,0-18.773,3.413-25.6,8.533c0-23.893-18.773-42.667-42.667-42.667c-9.387,0-18.773,3.413-25.6,8.533V41.667
              C255.121,17.773,236.347-1,212.454-1s-42.667,18.773-42.667,42.667v193.707c-18.773-32.427-62.293-48.64-95.573-36.693
              c-4.267,0.853-7.68,3.413-11.947,5.973c-12.8,8.533-11.947,19.627-11.947,23.04c-0.853,5.12,0,5.973,11.947,19.627
              c14.507,17.067,46.08,52.907,65.707,88.747c1.707,1.707,24.747,39.253,50.347,67.413v22.187c0,46.933,38.4,85.333,85.333,85.333
              h85.333c36.693,0,75.093-30.72,83.627-66.56c2.56-10.24,5.12-17.92,8.533-21.333c8.533-10.24,18.773-34.133,18.773-65.707V220.867
              C459.921,196.973,441.147,178.2,417.254,178.2z" 
              fill="#EBC1A4" stroke="#1A202C" stroke-width="8" stroke-linejoin="round"/>
            
            <!-- Ink Mark (Violet Line) -->
            <path d="M212 15 L212 110" stroke="#4c1d95" stroke-width="12" stroke-linecap="round" />
          </g>
        </svg>
      </div>

      <button id="apply-ink" class="btn btn-primary" style="width: 100%;">
        Receive ink mark →
      </button>`,

    evm: () => `
      <h3 class="mm-card-title">Step 3 — Electronic Voting Machine</h3>
      <p class="mm-text-muted" style="margin-bottom: 1rem;">Press the blue button next to your chosen candidate. A red light will glow to confirm your press.</p>
      <div class="mm-evm-housing" role="radiogroup" aria-label="EVM Ballot Unit (fictional candidates)">
        ${FICTIONAL_CANDIDATES.map((c, i) => `
          <button class="mm-evm-btn evm-anim-item"
                  data-id="${escapeHTML(c.id)}" role="radio" aria-checked="false"
                  aria-label="Button ${i + 1}: ${escapeHTML(c.name)} of ${escapeHTML(c.party)}">
            <div class="mm-evm-serial">${(i + 1).toString().padStart(2, '0')}</div>
            <div class="mm-evm-candidate-area">
              <div>
                <div class="mm-evm-name">${escapeHTML(c.name)}</div>
                <div class="mm-evm-party">${escapeHTML(c.party)}</div>
              </div>
              <div class="mm-evm-symbol" aria-hidden="true">${getCandidateIcon(c)}</div>
            </div>
            <div class="mm-evm-controls">
              <div class="mm-evm-led"></div>
              <div class="mm-evm-blue-btn"></div>
            </div>
          </button>
        `).join('')}
      </div>`,

    vvpat: () => {
      const picked = FICTIONAL_CANDIDATES.find((c) => c.id === state.choice);
      return `
        <h3 class="mm-card-title">Step 4 — VVPAT Verification</h3>
        <p class="mm-text-muted" style="margin-bottom: 1.5rem;">The VVPAT machine prints a paper slip showing your choice. It is visible for <strong>7 seconds</strong> before dropping into a sealed box. Check that your vote was recorded correctly.</p>
        
        <!-- Animated Printer Container -->
        <div style="width: 260px; margin: 0 auto 2rem; position: relative; background: #e2e8f0; padding: 1rem; border-radius: 0.5rem 0.5rem 0 0; border: 2px solid #cbd5e1; border-bottom: none;">
          <!-- Printer Slot (Dark Box) -->
          <div style="height: 12px; background: #1a202c; border-radius: 6px; position: absolute; bottom: -6px; left: 1rem; right: 1rem; z-index: 10; box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);"></div>
          
          <!-- Hidden overflow container for the slipping animation -->
          <div style="overflow: hidden; position: absolute; top: 100%; left: 2rem; right: 2rem; height: 300px; z-index: 5;">
            <!-- The Paper Slip itself -->
            <div style="background: white; border: 1px solid #e2e8f0; padding: 1.5rem 1rem; font-family: monospace; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; color: var(--color-text-muted); font-size: 0.65rem; margin-bottom: 1rem; border-bottom: 1px dashed #cbd5e1; padding-bottom: 0.5rem;">VVPAT SLIP (FICTIONAL)</div>
              <div style="text-align: center; font-size: 2rem; margin-bottom: 0.5rem; height: 2.5rem; width: 2.5rem; margin: 0 auto;" aria-hidden="true">${getCandidateIcon(picked)}</div>
              <div style="text-align: center; font-weight: 700; font-size: 1.25rem;">${escapeHTML(picked.name)}</div>
              <div style="text-align: center; color: var(--color-text-muted); font-size: 0.875rem;">${escapeHTML(picked.party)}</div>
              <div style="text-align: center; color: var(--color-text-muted); font-size: 0.65rem; margin-top: 1rem; border-top: 1px dashed #cbd5e1; padding-top: 0.5rem;">Serial: 001<br>${new Date().toLocaleDateString('en-IN')}</div>
            </div>
          </div>
          
          <div style="text-align: center; font-weight: 600; color: #4a5568;">VVPAT MACHINE</div>
        </div>
        
        <!-- Space to account for absolute slip -->
        <div style="height: 250px;"></div>

        <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
          <button id="confirm-vvpat" class="btn btn-primary" style="flex: 1;">
            ✓ Slip matches my choice
          </button>
          <button id="mismatch-vvpat" class="btn btn-secondary" style="flex: 1;">
            ✗ Slip does NOT match
          </button>
        </div>`;
    },

    done: () => {
      const picked = FICTIONAL_CANDIDATES.find((c) => c.id === state.choice);
      return `
        <div style="text-align: center; padding: 1rem 0;">
          <div style="font-size: 3.5rem; color: var(--color-primary); margin-bottom: 1.5rem;" aria-hidden="true">
            <span class="material-icons-outlined" style="font-size: inherit;">check_circle</span>
          </div>
          <h3 style="font-weight: 800; color: var(--color-primary); font-size: 1.5rem; margin-bottom: 0.75rem;">Vote Successfully Cast</h3>
          <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">Your vote for <strong>${escapeHTML(picked.name)}</strong> is now recorded on the EVM and the paper slip is sealed inside the VVPAT box.</p>
          <div style="background-color: var(--color-paper); border-left: 4px solid var(--color-primary); text-align: left; padding: 1.5rem; margin: 1.5rem 0; font-size: 0.95rem; border-radius: var(--radius-sm);">
            <strong style="color: var(--color-primary); display: block; margin-bottom: 0.5rem;">What happens next?</strong>
            <ul style="list-style-type: none; padding-left: 0; margin-top: 0.5rem; color: var(--color-text-muted); display: flex; flex-direction: column; gap: 0.75rem;">
              <li><span style="color: var(--color-primary); margin-right: 0.5rem;">•</span> After polling closes, the EVM is sealed with signatures from candidate agents</li>
              <li><span style="color: var(--color-primary); margin-right: 0.5rem;">•</span> It is transported under armed escort to a strongroom</li>
              <li><span style="color: var(--color-primary); margin-right: 0.5rem;">•</span> On counting day, totals are announced round-by-round in the presence of agents</li>
              <li><span style="color: var(--color-primary); margin-right: 0.5rem;">•</span> VVPAT slips from 5 random booths per segment are hand-counted to cross-check</li>
            </ul>
          </div>
          <button id="reset" class="btn btn-primary">Try Again</button>
        </div>`;
    },

    mismatch: () => `
      <div style="text-align: center; padding: 1rem 0;">
        <div style="font-size: 3.5rem; color: #d97706; margin-bottom: 1.5rem;" aria-hidden="true">
          <span class="material-icons-outlined" style="font-size: inherit;">warning</span>
        </div>
        <h3 style="font-weight: 800; color: #d97706; font-size: 1.5rem; margin-bottom: 0.75rem;">Report to Presiding Officer</h3>
        <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">If the VVPAT slip does not match your choice, you have the right to complain to the Presiding Officer under <strong>Rule 49MA</strong>.</p>
        <div style="background-color: #fffbeb; border-left: 4px solid #d97706; text-align: left; padding: 1.5rem; margin: 1.5rem 0; font-size: 0.95rem; border-radius: var(--radius-sm);">
          <strong style="color: #d97706; display: block; margin-bottom: 0.5rem;">The 49MA Process:</strong>
          <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 0.75rem; color: var(--color-text-muted);">
            <li><span style="color: #d97706; margin-right: 0.5rem;">•</span> Submit a written declaration regarding the mismatch</li>
            <li><span style="color: #d97706; margin-right: 0.5rem;">•</span> Cast a test vote in the presence of the Presiding Officer</li>
            <li><span style="color: #d97706; margin-right: 0.5rem;">•</span> If true, polling is stopped; if false, you may face prosecution</li>
          </ul>
        </div>
        <button id="reset" class="btn btn-primary">Try Again</button>
      </div>`
  };

  const render = () => {
    const body = (stepRenderers[state.step] || stepRenderers.id)();
    root.innerHTML = `
      <div class="sim-wrapper" style="max-width: 42rem; margin: 0 auto;">
        ${state.step !== 'mismatch' ? renderProgress(state.step) : ''}
        <div class="mm-card glass">${body}</div>
        <div class="mm-text-muted" style="text-align: center; margin-top: 0.75rem;">
          For educational use only. Candidates and parties shown are fictional.
        </div>
      </div>`;
    wire();
  };

  const advance = (to) => { state.step = to; render(); };

  const wire = () => {
    root.querySelector('#show-id')?.addEventListener('click', () => advance('ink'));
    root.querySelector('#apply-ink')?.addEventListener('click', () => advance('evm'));
    root.querySelectorAll('.mm-evm-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (state.isVoting) return;
        state.isVoting = true;
        btn.classList.add('is-voted');
        state.choice = btn.dataset.id;
        
        // Wait 1.2s so the user sees the red LED
        setTimeout(() => {
          state.isVoting = false;
          advance('vvpat');
        }, 1200);
      });
    });
    root.querySelector('#confirm-vvpat')?.addEventListener('click', () => advance('done'));
    root.querySelector('#mismatch-vvpat')?.addEventListener('click', () => advance('mismatch'));
    root.querySelector('#reset')?.addEventListener('click', () => {
      state.step = 'id';
      state.choice = null;
      render();
    });
  };

  render();
}
