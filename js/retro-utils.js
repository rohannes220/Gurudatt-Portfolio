// Retro Utility Functions

// Create floating pixel background
export function createPixelBackground() {
  const container = document.getElementById('pixelBg');
  if (!container) return;

  const pixelCount = 30;
  const colors = ['#ff006e', '#00d9ff', '#ffbe0b', '#06ffa5'];

  for (let i = 0; i < pixelCount; i++) {
    const pixel = document.createElement('div');
    pixel.style.position = 'absolute';
    pixel.style.width = '8px';
    pixel.style.height = '8px';
    pixel.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    pixel.style.left = `${Math.random() * 100}%`;
    pixel.style.top = `${Math.random() * 100}%`;
    pixel.style.opacity = '0.3';
    pixel.style.animation = `float-pixel ${5 + Math.random() * 10}s linear infinite`;
    pixel.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(pixel);
  }

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-pixel {
      0% {
        transform: translateY(0) translateX(0) rotate(0deg);
      }
      25% {
        transform: translateY(-50px) translateX(20px) rotate(90deg);
      }
      50% {
        transform: translateY(-100px) translateX(0) rotate(180deg);
      }
      75% {
        transform: translateY(-50px) translateX(-20px) rotate(270deg);
      }
      100% {
        transform: translateY(0) translateX(0) rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
}

// Animate floating coins
export function animateCoins() {
  const container = document.getElementById('floatingCoins');
  if (!container) return;

  setInterval(() => {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.textContent = '🪙';
    coin.style.left = `${Math.random() * 100}%`;
    coin.style.top = '100%';

    container.appendChild(coin);

    setTimeout(() => {
      coin.remove();
    }, 2000);
  }, 3000);
}

// Smooth scroll for anchor links
export function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Debounce function for performance
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Play retro sound (visual feedback)
export function playRetroSound(element) {
  element.style.filter = 'brightness(1.5)';
  element.style.transform = 'scale(0.95)';

  setTimeout(() => {
    element.style.filter = 'brightness(1)';
    element.style.transform = 'scale(1)';
  }, 100);
}

// Create screen shake effect
export function screenShake(duration = 500) {
  const body = document.body;
  body.style.animation = `shake ${duration}ms ease-in-out`;

  setTimeout(() => {
    body.style.animation = '';
  }, duration);

  // Add shake animation if not exists
  if (!document.getElementById('shake-animation')) {
    const style = document.createElement('style');
    style.id = 'shake-animation';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Format score with leading zeros
export function formatScore(score, digits = 6) {
  return score.toString().padStart(digits, '0');
}

// Random retro color
export function getRandomRetroColor() {
  const colors = ['#ff006e', '#00d9ff', '#ffbe0b', '#06ffa5'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Check if element is in viewport
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Initialize smooth scroll
smoothScroll();