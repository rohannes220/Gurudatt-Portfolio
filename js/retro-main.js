import { SkillGame } from './retro-game.js';
import { createPixelBackground, animateCoins } from './retro-utils.js';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Skill Game
  const canvas = document.getElementById('skillGameCanvas');
  if (canvas) {
    const skillGame = new SkillGame(canvas);
    skillGame.init();

    // Handle window resize
    window.addEventListener('resize', () => {
      skillGame.resize();
    });
  }

  // Create pixel background effect
  createPixelBackground();

  // Animate floating coins
  animateCoins();

  // Initialize coin counter animation
  animateCoinCounter();

  // Add scroll effects
  handleScrollEffects();

  // Add button sound effects (optional visual feedback)
  addButtonEffects();

  // Initialize skill badge interactions
  initSkillBadges();
});

// Animate coin counter
function animateCoinCounter() {
  const counter = document.getElementById('coinCounter');
  if (!counter) return;

  let count = 0;
  const target = 999;
  const duration = 2000;
  const increment = target / (duration / 16);

  function updateCounter() {
    count += increment;
    if (count < target) {
      counter.textContent = Math.floor(count);
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target;
    }
  }

  setTimeout(updateCounter, 500);
}

// Handle scroll effects for sections
function handleScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe skill cards and stat cards
  document.querySelectorAll('.skill-level-card, .stat-card, .contact-item-retro').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Add dynamic fade-in class
const style = document.createElement('style');
style.textContent = `
  .fade-in-up {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// Add button click effects
function addButtonEffects() {
  document.querySelectorAll('.retro-btn, .social-btn').forEach((button) => {
    button.addEventListener('click', function (e) {
      // Create particle effect
      createClickParticles(e.clientX, e.clientY);

      // Play sound effect visually (flash)
      this.style.filter = 'brightness(1.5)';
      setTimeout(() => {
        this.style.filter = 'brightness(1)';
      }, 100);
    });
  });
}

// Create particle explosion on click
function createClickParticles(x, y) {
  const colors = ['#ff006e', '#00d9ff', '#ffbe0b', '#06ffa5'];
  const particleCount = 8;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'pixel-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    const angle = (Math.PI * 2 * i) / particleCount;
    const distance = 50 + Math.random() * 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
}

// Initialize skill badge interactions
function initSkillBadges() {
  document.querySelectorAll('.skill-badge').forEach((badge) => {
    badge.addEventListener('click', function () {
      // Add collected animation
      this.classList.add('powerup-collected');

      // Create floating score
      const score = document.createElement('div');
      score.className = 'score-popup';
      score.textContent = '+100 XP';
      score.style.left = `${this.offsetLeft + this.offsetWidth / 2}px`;
      score.style.top = `${this.offsetTop}px`;

      this.parentElement.appendChild(score);

      setTimeout(() => {
        score.remove();
        this.classList.remove('powerup-collected');
      }, 1000);
    });
  });
}

// Add navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.retro-nav');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 8px 0 rgba(0, 0, 0, 0.5), 0 12px 30px rgba(255, 0, 110, 0.3)';
  } else {
    navbar.style.boxShadow = '0 8px 0 rgba(0, 0, 0, 0.3)';
  }
});