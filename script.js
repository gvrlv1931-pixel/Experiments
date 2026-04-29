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
// PERSONALISE: update this list with your own roles / taglines.
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
    el.style.transitionDelay = `${(i % 4) * 60}ms`;
    revealObserver.observe(el);
  });
}

initReveal();

/* ─── Projects "show more" toggle ────────────────────────────── */
const extraCards  = document.querySelectorAll('.project-card[data-featured="false"]');
const toggleWrap  = document.getElementById('projectsToggleWrap');
const toggleBtn   = document.getElementById('projectsToggle');

if (extraCards.length > 0) {
  toggleWrap.style.display = 'block';
  let shown = false;

  toggleBtn.addEventListener('click', () => {
    shown = !shown;
    extraCards.forEach(card => {
      card.classList.toggle('visible', shown);
      if (shown) {
        // Trigger reveal animation for newly visible cards
        setTimeout(() => revealObserver.observe(card), 10);
      }
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

  const data = Object.fromEntries(new FormData(contactForm));

  /*
   * PERSONALISE: Replace the block below with your preferred sending
   * mechanism, for example:
   *
   *   Formspree:
   *     fetch('https://formspree.io/f/YOUR_ID', { method:'POST',
   *       headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) })
   *
   *   EmailJS:
   *     emailjs.send('SERVICE_ID', 'TEMPLATE_ID', data)
   *
   * The current code just simulates a successful send for demo purposes.
   */
  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    // ── swap this fetch for your real endpoint ──
    await new Promise(resolve => setTimeout(resolve, 900)); // demo delay
    // await fetch('https://formspree.io/f/YOUR_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });

    formStatus.textContent = 'Message sent! I\'ll get back to you soon.';
    formStatus.className = 'form-status success';
    contactForm.reset();
  } catch {
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
    { id: 'name',    msg: 'Please enter your name.',          test: v => v.trim().length >= 2 },
    { id: 'email',   msg: 'Please enter a valid email.',      test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
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

// Clear error state on input
contactForm.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => {
    el.classList.remove('invalid');
    el.nextElementSibling.textContent = '';
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  });
});

/* ─── Active nav link on scroll ──────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));
