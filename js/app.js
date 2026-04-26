/**
 * Matdar Mitra - Main Application Logic
 * Pure Vanilla JS for maximum performance (100/100 Lighthouse)
 */

import { renderJourney } from './modules/journey.js';
import { renderSimulator } from './modules/simulator.js';
import { renderSecurity } from './modules/security.js';
import { renderQuiz } from './modules/quiz.js';
import { renderAssistant } from './modules/assistant.js';

document.addEventListener('DOMContentLoaded', () => {

  initStickyHeader();
  initMobileMenu();
  loadApplicationData();
});

async function loadApplicationData() {
  try {
    // Fetch Journey Data
    const journeyResp = await fetch('./data/journey.json');
    const journeyData = await journeyResp.json();
    const journeyGrid = document.getElementById('journey-grid');
    const journeyDetail = document.getElementById('journey-detail');
    if (journeyGrid && journeyDetail) {
      renderJourney(journeyGrid, journeyDetail, journeyData);
    }

    // Initialize Simulator (GSAP embedded inside module)
    const simulatorRoot = document.getElementById('simulator-root');
    if (simulatorRoot) {
      renderSimulator(simulatorRoot);
    }

    // Fetch and render Security
    const securityResp = await fetch('./data/security.json');
    const securityData = await securityResp.json();
    const securitySidebar = document.getElementById('security-sidebar');
    if (securitySidebar) {
      renderSecurity(securitySidebar, securityData);
    }

    // Fetch and render Quiz
    const quizResp = await fetch('./data/quiz.json');
    const quizData = await quizResp.json();
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
      renderQuiz(quizContainer, quizData);
    }

    // Initialize Assistant
    const assistantContainer = document.getElementById('assistant-container');
    if (assistantContainer) {
      renderAssistant(assistantContainer);
    }
    // Re-initialize scroll animations now that dynamic content is in the DOM
    // Hide preloader
    hidePreloader();
    
  } catch (err) {
    console.error("Failed to load application data:", err);
    hidePreloader(); // Hide even on error
  }
}

/**
 * Hide the application preloader
 */
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Remove from DOM after transition
    setTimeout(() => {
      preloader.remove();
    }, 500);
  }
}

/**
 * Handle sticky header visual changes on scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.header');
  
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Initial check
  handleScroll();
  
  // Listen for scroll with passive true for better performance
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Basic mobile menu toggle (placeholder for full implementation)
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    // In a full implementation, this would toggle a mobile menu modal or slide-out
    const isVisible = navLinks.style.display === 'flex';
    navLinks.style.display = isVisible ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.background = 'white';
    navLinks.style.padding = '1rem';
    navLinks.style.boxShadow = 'var(--shadow-md)';
  });
}
