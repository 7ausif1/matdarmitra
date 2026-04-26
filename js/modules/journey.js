/**
 * @module journey
 * @description Renders the 5-stage voter's journey as a horizontal grid with a detail panel.
 */

export function renderJourney(container, detailPanel, steps) {
  if (!container || !detailPanel || !steps) return;

  try {
    container.innerHTML = '';
    
    // Render the 5 horizontal cards
    steps.forEach((step, index) => {
      const isFirst = index === 0;
      const stepNumber = index + 1;
      
      const card = document.createElement('button');
      card.className = `mm-card glass journey-step-card ${isFirst ? 'active' : ''}`;
      card.setAttribute('aria-label', `View details for Stage ${stepNumber}: ${step.title}`);
      card.style.display = 'block';
      card.style.width = '100%';
      card.style.textAlign = 'left';
      card.style.cursor = 'pointer';
      card.style.border = 'none';
      card.style.padding = '1.5rem';

      card.innerHTML = `
        <div class="journey-step-icon" style="background-color: ${isFirst ? 'var(--color-saffron)' : 'var(--color-navy)'};">
          <span class="material-icons-outlined" style="color: white; font-size: 1.5rem;">${step.icon}</span>
        </div>
        <h3 class="mm-card-title" style="font-size: 1rem; margin-bottom: 0.5rem; color: ${isFirst ? 'var(--color-navy)' : 'var(--color-ink)'};">
          <span style="color: var(--color-saffron-dark); font-size: 0.8rem; display: block; margin-bottom: 0.2rem; text-transform: uppercase;">STAGE ${stepNumber}</span>
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
    <div class="journey-detail-panel">
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
  

}
