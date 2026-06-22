// ===== INTERSECTION OBSERVER — Fade In =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.room-section, .material-card, .plan-card, .spec').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Add visible class
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// ===== FURNITURE HOVER TOOLTIP =====
document.querySelectorAll('.furniture').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.zIndex = '10';
  });
  el.addEventListener('mouseleave', () => {
    el.style.zIndex = '1';
  });
});

// ===== NAVBAR ACTIVE LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--accent)';
    }
  });
});

// ===== ROOM VISUAL ANIMATION - Pulse furniture =====
setInterval(() => {
  const items = document.querySelectorAll('.furniture');
  if (items.length === 0) return;
  const random = items[Math.floor(Math.random() * items.length)];
  random.style.borderColor = 'rgba(0,212,255,0.9)';
  random.style.background = 'rgba(0,212,255,0.12)';
  setTimeout(() => {
    random.style.borderColor = '';
    random.style.background = '';
  }, 800);
}, 1500);

// ===== COLOR CHIP TOOLTIP =====
document.querySelectorAll('.color-chip').forEach(chip => {
  chip.title = chip.style.background;
});

console.log('%c[XXNB26] HI-TECH DESIGN LOADED', 'color: #00d4ff; font-family: monospace; font-size: 14px;');
