/**
 * @module security
 * @description Renders safeguard cards explaining EVM and VVPAT security using premium Matdar Mitra CSS.
 */
import { escapeHTML } from './security-utils.js';

export function renderSecurity(root, items) {
  const sidebar = document.getElementById('security-sidebar');
  const detail = document.getElementById('security-detail');
  
  if (!sidebar || !detail) return;

  let activeIndex = 0;

  const renderDetail = (index) => {
    const item = items[index];
    detail.innerHTML = `
      <div>
        <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem;">
          <div class="sidebar-icon" style="width: 4rem; height: 4rem; font-size: 2rem; background-color: var(--color-primary); color: white;">
            <span class="material-icons-outlined">${item.icon}</span>
          </div>
          <div>
            <h3 style="font-size: 2rem; color: var(--color-primary); font-weight: 800; margin: 0;">${escapeHTML(item.title)}</h3>
            <div style="color: var(--color-saffron-dark); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.875rem;">Verified Safeguard</div>
          </div>
        </div>
        
        <p style="font-size: 1.25rem; line-height: 1.8; color: #4a5568; margin-bottom: 2.5rem;">
          ${escapeHTML(item.description)}
        </p>
        
        <div style="background-color: var(--color-paper); padding: 2rem; border-radius: 1rem; border-left: 4px solid var(--color-primary);">
          <h4 style="color: var(--color-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            How it works technically:
          </h4>
          <p style="color: #4a5568; line-height: 1.6;">${escapeHTML(item.howItWorks)}</p>
        </div>
      </div>
    `;
  };

  const renderSidebar = () => {
    sidebar.innerHTML = items.map((item, index) => `
      <button class="mm-sidebar-item ${index === activeIndex ? 'active' : ''}" data-index="${index}">
        <div class="sidebar-icon"><span class="material-icons-outlined" style="font-size: 1.25rem;">${item.icon}</span></div>
        <div style="font-weight: 700; color: ${index === activeIndex ? 'var(--color-primary)' : 'rgba(0, 0, 128, 0.8)'};">${escapeHTML(item.title)}</div>
      </button>
    `).join('');

    sidebar.querySelectorAll('.mm-sidebar-item').forEach(btn => {
      btn.addEventListener('click', () => {
        activeIndex = parseInt(btn.dataset.index);
        renderSidebar();
        renderDetail(activeIndex);
      });
    });
  };

  renderSidebar();
  renderDetail(activeIndex);
}
