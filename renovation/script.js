/* ===== SCROLL REVEAL ===== */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.room-block,.phase,.material-card,.step,.budget-table tr').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  obs.observe(el);
});

/* ===== BEFORE/AFTER SLIDER EFFECT ===== */
document.querySelectorAll('.ba-render').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.borderColor = 'rgba(0,212,255,.5)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.borderColor = '';
  });
});

/* ===== RANDOM ELEMENT PULSE IN RENDERS ===== */
setInterval(() => {
  const els = document.querySelectorAll('.k-upper,.bt-tile-new,.h-mirror-new,.bd-bed,.tv-panel');
  if (!els.length) return;
  const r = els[Math.floor(Math.random() * els.length)];
  r.style.borderColor = 'rgba(0,212,255,.8)';
  r.style.background = 'rgba(0,212,255,.12)';
  setTimeout(() => { r.style.borderColor=''; r.style.background=''; }, 700);
}, 1800);

/* ===== BUDGET: animate prices ===== */
function animateCount(el, target, suffix='') {
  let current = 0;
  const step = Math.ceil(target / 50);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('ru') + suffix;
    if (current >= target) clearInterval(timer);
  }, 30);
}

const priceObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const text = e.target.textContent.replace(/[^\d]/g, '');
      const num = parseInt(text);
      if (num > 100) animateCount(e.target, num, e.target.classList.contains('total') ? ' USD' : '');
      priceObs.unobserve(e.target);
    }
  });
}, { threshold: .5 });

document.querySelectorAll('.price,.total').forEach(el => priceObs.observe(el));

console.log('%c[РЕМОНТ 43М²] HI-TECH PROJECT LOADED ✓', 'color:#00d4ff;font-family:monospace;font-size:13px');
