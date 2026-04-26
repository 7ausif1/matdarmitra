/**
 * @module journey
 * @description Renders the 5-stage voter's journey as a horizontal grid with a detail panel.
 */

export async function renderJourney() {
  const container = document.getElementById('journey-grid');
  const detailPanel = document.getElementById('journey-detail');
  if (!container || !detailPanel) return;

  try {
    const response = await fetch('./data/journey.json');
    if (!response.ok) throw new Error('Failed to load journey data');
    const steps = await response.json();

    container.innerHTML = '';
    
    // Render the 5 horizontal cards
    steps.forEach((step, index) => {
      const isFirst = index === 0;
      const stepNumber = index + 1;
      
      const card = document.createElement('div');
      // Added animate-on-scroll to animate the cards in
      card.className = `mm-card glass journey-step-card animate-on-scroll ${isFirst ? 'active' : ''}`;
      card.style.transitionDelay = `${index * 0.1}s`;

      card.innerHTML = `
        <div class="journey-step-icon" style="background-color: ${isFirst ? 'var(--color-saffron)' : 'var(--color-navy)'};">
          <i class="${step.icon}"></i>
        </div>
        <h3 class="mm-card-title" style="font-size: 1rem; margin-bottom: 0.5rem; color: ${isFirst ? 'var(--color-navy)' : 'var(--color-ink)'};">
          <span style="color: var(--color-saffron); font-size: 0.8rem; display: block; margin-bottom: 0.2rem; text-transform: uppercase;">STAGE ${stepNumber}</span>
          ${step.title}
        </h3>
        <p class="mm-text-muted" style="font-size: 0.75rem;">${step.tagline}</p>
      `;

      card.addEventListener('click', () => {
        // Remove active class from all
        document.querySelectorAll('.journey-step-card').forEach(c => {
          c.classList.remove('active');
          const icon = c.querySelector('.journey-step-icon');
          if(icon) icon.style.backgroundColor = 'var(--color-navy)';
          const title = c.querySelector('.mm-card-title');
          if(title) title.style.color = 'var(--color-ink)';
        });
        
        // Add active class to clicked
        card.classList.add('active');
        card.querySelector('.journey-step-icon').style.backgroundColor = 'var(--color-saffron)';
        card.querySelector('.mm-card-title').style.color = 'var(--color-navy)';

        renderDetailPanel(step, stepNumber, detailPanel);
      });

      container.appendChild(card);
    });

    // Render the initial detail panel (Stage 1)
    if (steps.length > 0) {
      renderDetailPanel(steps[0], 1, detailPanel);
    }

  } catch (error) {
    console.error('Error rendering journey:', error);
    container.innerHTML = '<p class="error">Failed to load journey timeline. Please try again later.</p>';
  }
}

function renderDetailPanel(step, stepNumber, panel) {
  panel.style.display = 'block';
  
  const safeguardsHtml = step.safeguards.map(sg => `<li>${sg}</li>`).join('');

  panel.innerHTML = `
    <div class="journey-detail-panel animate-on-scroll">
      <div class="journey-detail-header">
        <div style="width: 50px; height: 50px; background-color: var(--color-saffron); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold;">
          <i class="${step.icon}"></i>
        </div>
        <h3>${step.title}</h3>
      </div>
      
      <p class="journey-detail-desc">${step.description}</p>
      
      <div class="journey-safeguards-box">
        <h4><span style="color: var(--color-green);">✓</span> Key safeguards at this stage:</h4>
        <ul class="journey-safeguards-list">
          ${safeguardsHtml}
        </ul>
      </div>
      
      <div class="journey-source">Source: ${step.source}</div>
    </div>
  `;
  
  // Re-trigger the animation by adding the class since the observer only fires once on scroll
  setTimeout(() => {
    const detailPanelInner = panel.querySelector('.journey-detail-panel');
    if (detailPanelInner) {
      detailPanelInner.classList.add('is-visible');
    }
  }, 50);
}
