/**
 * Matdar Mitra - Main Application Logic
 */

import { renderJourney } from './modules/journey.js';
import { renderSimulator } from './modules/simulator.js';
import { renderSecurity } from './modules/security.js';
import { renderQuiz } from './modules/quiz.js';
import { renderAssistant } from './modules/assistant.js';
import { initMaps } from './modules/maps.js';

// Hardcoded keys for Hackathon Submission
// Maps key from Google Cloud
const GOOGLE_API_KEY = "AIzaSyD-YqlVlfD4jbkvNI3d5mWIGetGLmfYdXI";
// Gemini key from Google AI Studio
const GEMINI_API_KEY = "AIzaSyDLhCicizu1YK2SYH42T61-JW1bmVUGdxA";

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

    // Initialize Simulator
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
      // Pass the dedicated Gemini key to assistant
      window.GEMINI_API_KEY = GEMINI_API_KEY;
      renderAssistant(assistantContainer);
    }

    // Initialize Maps (Booth Finder)
    const mapRoot = document.getElementById('map-root');
    if (mapRoot) {
      initMaps(mapRoot, GOOGLE_API_KEY);
    }
    
  } catch (err) {
    console.error("Failed to load application data:", err);
  }
}

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
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (!menuBtn || !navLinks) return;
  menuBtn.addEventListener('click', () => {
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
