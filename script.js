'use strict';

/* ─── Sticky nav ──────────────────────────────────────────────── */
const navHeader = document.querySelector('.nav-header');
window.addEventListener('scroll', () => {
  navHeader.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─── Mobile nav toggle ───────────────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  navLinks.classList.toggle('open', !open);
  document.body.style.overflow = open ? '' : 'hidden';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── Hero role cycle ─────────────────────────────────────────── */
const roles = [
  'Systems Designer',
  'Social Entrepreneur',
  'Circular Economy Builder',
  'Problem Solver',
];

const roleCycle = document.getElementById('roleCycle');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  const current = roles[roleIndex];
  if (!deleting) {
    roleCycle.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
    setTimeout(typeRole, 60);
  } else {
    roleCycle.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRole, 300);
      return;
    }
    setTimeout(typeRole, 35);
  }
}

setTimeout(typeRole, 800);

/* ─── Bio expand/collapse ─────────────────────────────────────── */
const bioBtn  = document.querySelector('.bio-read-more');
const bioText = document.querySelector('.bio-text');

if (bioBtn && bioText) {
  bioBtn.addEventListener('click', () => {
    const isOpen = bioText.classList.toggle('open');
    bioBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ─── Collapsible experience cards ───────────────────────────── */
document.querySelectorAll('.card-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.timeline-card');
    const body = card.querySelector('.collapsible-body');
    const isOpen = !body.classList.contains('collapsed');
    body.classList.toggle('collapsed', isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* ─── Awards toggle ───────────────────────────────────────────── */
const awardsToggle = document.querySelector('.awards-toggle');
const awardsList   = document.getElementById('awardsList');

if (awardsToggle && awardsList) {
  awardsToggle.addEventListener('click', () => {
    const isOpen = !awardsList.classList.contains('collapsed');
    awardsList.classList.toggle('collapsed', isOpen);
    awardsToggle.setAttribute('aria-expanded', String(!isOpen));
    awardsToggle.textContent = isOpen ? 'Show Awards' : 'Hide Awards';
  });
}

/* ─── Stat counters ───────────────────────────────────────────── */
function animateCounter(el, target, duration) {
  const d = duration || 1400;
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / d, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

const statsRow = document.querySelector('.stats-row');
if (statsRow) {
  const so = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      so.disconnect();
      statsRow.classList.add('counting');
      statsRow.querySelectorAll('.stat-number[data-target]').forEach((el, i) => {
        setTimeout(() => animateCounter(el, parseInt(el.dataset.target, 10)), i * 160 + 120);
      });
    }
  }, { threshold: 0.5 });
  so.observe(statsRow);
}

/* ─── Scroll-reveal ───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

function initReveal() {
  const targets = [
    '.timeline-card',
    '.project-card',
    '.skill-group',
    '.cert-card',
    '.about-facts',
    '.about-body',
  ].join(', ');

  document.querySelectorAll(targets).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 60 + 'ms';
    revealObserver.observe(el);
  });
}

initReveal();

/* ─── Projects "show more" toggle ────────────────────────────── */
const extraCards = document.querySelectorAll('.project-card[data-featured="false"]');
const toggleWrap = document.getElementById('projectsToggleWrap');
const toggleBtn  = document.getElementById('projectsToggle');

if (extraCards.length > 0) {
  toggleWrap.style.display = 'block';
  let shown = false;
  toggleBtn.addEventListener('click', () => {
    shown = !shown;
    extraCards.forEach(card => {
      card.classList.toggle('visible', shown);
      if (shown) setTimeout(() => revealObserver.observe(card), 10);
    });
    toggleBtn.textContent = shown ? 'Show fewer projects' : 'Show more projects';
  });
}

/* ─── Footer year ─────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── Contact form ────────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    await new Promise(resolve => setTimeout(resolve, 900));
    formStatus.textContent = "Message sent! I'll get back to you soon.";
    formStatus.className = 'form-status success';
    contactForm.reset();
  } catch (_) {
    formStatus.textContent = 'Something went wrong. Please try emailing directly.';
    formStatus.className = 'form-status error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});

function validateForm() {
  let valid = true;
  const rules = [
    { id: 'name',    msg: 'Please enter your name.',            test: v => v.trim().length >= 2 },
    { id: 'email',   msg: 'Please enter a valid email.',        test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'message', msg: 'Message must be at least 10 chars.', test: v => v.trim().length >= 10 },
  ];
  rules.forEach(({ id, msg, test }) => {
    const field = document.getElementById(id);
    const error = field.nextElementSibling;
    const ok = test(field.value);
    field.classList.toggle('invalid', !ok);
    error.textContent = ok ? '' : msg;
    if (!ok) valid = false;
  });
  return valid;
}

contactForm.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => {
    el.classList.remove('invalid');
    el.nextElementSibling.textContent = '';
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  });
});

/* ─── Project expand/collapse ─────────────────────────────────── */
document.querySelectorAll('.project-expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const details = btn.nextElementSibling;
    const isOpen = !details.classList.contains('collapsed');
    details.classList.toggle('collapsed', isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    btn.firstElementChild.style.transform = isOpen ? '' : 'rotate(-180deg)';
  });
});

/* ─── Book shelf marquee ──────────────────────────────────────── */
const booksShelf = document.getElementById('booksShelf');
if (booksShelf) {
  booksShelf.innerHTML += booksShelf.innerHTML;
}

/* ─── Modules toggle (education) ─────────────────────────────── */
document.querySelectorAll('.modules-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const list = btn.nextElementSibling;
    const isOpen = !list.classList.contains('collapsed');
    list.classList.toggle('collapsed', isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    btn.classList.toggle('open', !isOpen);
  });
});

/* ─── Active nav link on scroll ──────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));
