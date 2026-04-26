/**
 * @module quiz
 * @description Gamified quiz with shareable results, utilizing Matdar Mitra CSS.
 */
import { escapeHTML } from './security-utils.js';

export function scoreToTier(score, total) {
  const pct = Math.round((score / total) * 100);
  if (pct >= 80) return { emoji: '🏆', label: 'Civic Expert', pct };
  if (pct >= 60) return { emoji: '📘', label: 'Informed Voter', pct };
  return { emoji: '🌱', label: 'Keep learning!', pct };
}

export function renderQuiz(root, questions) {
  if (!root) return;
  let idx = 0;
  let score = 0;
  let answered = false;

  const render = () => {
    if (idx >= questions.length) return renderResults();

    const q = questions[idx];
    root.innerHTML = `
      <div class="mm-card glass">
        
        <!-- Progress Bar -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 6px; background-color: #edf2f7;" role="progressbar" aria-label="Quiz Progress" aria-valuenow="${idx}" aria-valuemin="0" aria-valuemax="${questions.length}">
          <div style="height: 100%; background-color: var(--color-saffron); width: ${(idx / questions.length) * 100}%; transition: width 0.5s ease-out;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 1.5rem; margin-top: 0.5rem;">
          <span>Question ${idx + 1} of ${questions.length}</span>
          <span style="font-weight: 600; color: var(--color-navy);">Score: ${score}</span>
        </div>
        
        <h3 class="mm-card-title" style="margin-bottom: 1.5rem;">${escapeHTML(q.question)}</h3>
        
        <div style="display: flex; flex-direction: column;" role="radiogroup" aria-label="Answer choices">
          ${q.options.map((opt, i) => `
            <button class="mm-quiz-opt"
                    data-idx="${i}" role="radio" aria-checked="false">
              ${escapeHTML(opt)}
            </button>
          `).join('')}
        </div>
        <div id="feedback" style="margin-top: 1.5rem;" aria-live="polite"></div>
      </div>
    `;
    answered = false;

    root.querySelectorAll('.mm-quiz-opt').forEach((btn) => {
      btn.addEventListener('click', () => handleAnswer(btn, q));
    });
  };

  const handleAnswer = (btn, q) => {
    if (answered) return;
    answered = true;
    const selected = Number(btn.dataset.idx);
    const correct = selected === q.correct;
    if (correct) score += 1;

    root.querySelectorAll('.mm-quiz-opt').forEach((b, i) => {
      b.disabled = true;
      b.setAttribute('aria-checked', i === selected ? 'true' : 'false');
      
      if (i === q.correct) {
        b.classList.add('is-correct');
      } else if (i === selected) {
        b.classList.add('is-wrong');
      } else {
        b.style.opacity = '0.5';
      }
    });

    root.querySelector('#feedback').innerHTML = `
      <div style="padding: 1rem; border-radius: 0.5rem; background-color: ${correct ? '#f0fff4' : '#fffaf0'}; border-left: 4px solid ${correct ? '#38a169' : '#dd6b20'};">
        <strong style="color: ${correct ? '#2f855a' : '#c05621'}; font-size: 1.125rem;">${correct ? '✓ Correct!' : '✗ Not quite.'}</strong>
        <p style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--color-text-muted);">${escapeHTML(q.explanation)}</p>
        <button id="next" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">
          ${idx + 1 < questions.length ? 'Next Question →' : 'See Results →'}
        </button>
      </div>
    `;
    
    root.querySelector('#next').addEventListener('click', () => { idx += 1; render(); });
  };

  const renderResults = () => {
    const tier = scoreToTier(score, questions.length);
    root.innerHTML = `
      <div class="mm-card glass" style="text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 1rem;" aria-hidden="true">${tier.emoji}</div>
        <h3 class="mm-card-title">${tier.label}</h3>
        <p class="mm-text-muted" style="margin-bottom: 2rem; font-size: 1.125rem;">You scored <strong style="color: var(--color-navy);">${score}/${questions.length}</strong> (${tier.pct}%)</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button id="retry" class="btn btn-secondary">Try Again</button>
          <button id="share" class="btn btn-primary">Share Result</button>
        </div>
      </div>
    `;

    root.querySelector('#retry').addEventListener('click', () => { idx = 0; score = 0; render(); });
    root.querySelector('#share').addEventListener('click', async () => {
      const text = `I scored ${score}/${questions.length} on Matdar Mitra's election knowledge quiz. Test yourself!`;
      try {
        if (navigator.share) {
          await navigator.share({ title: 'Matdar Mitra Quiz', text, url: location.href });
        } else {
          await navigator.clipboard.writeText(`${text} ${location.href}`);
          alert('Result copied to clipboard!');
        }
      } catch { /* user cancelled — no-op */ }
    });
  };

  render();
}
