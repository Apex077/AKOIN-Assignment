/* ──────────────────────────────────────────────────────────────────────────
   script.js — Institute of Digital Risk
   Vanilla JS only. No dependencies.
   ────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── 1. Dynamic copyright year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── 2. Sticky nav — add .scrolled class + shadow ── */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ── 3. Mobile nav toggle ── */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── 4. Smooth scrolling for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── 5. Reveal-on-scroll (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            // Stagger children within the same parent
            const delay = getSiblingDelay(entry.target) * 80;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /** Return the 0-based sibling index of el among siblings that also have .reveal */
  function getSiblingDelay(el) {
    const parent   = el.parentElement;
    if (!parent) return 0;
    const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
    return siblings.indexOf(el);
  }

  /* ── 6. Active nav link highlighting on scroll ── */
  const sections  = document.querySelectorAll('main section[id]');
  const navLinks  = document.querySelectorAll('.nav-link:not(.nav-link--cta)');
  const navH      = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;

  if (sections.length && navLinks.length) {
    const activateLink = () => {
      let currentId = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - navH - 10) {
          currentId = section.id;
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === currentId);
      });
    };

    window.addEventListener('scroll', activateLink, { passive: true });
    activateLink();
  }

  /* ── 7. Contact form handler ── */
  const form    = document.getElementById('interest-form');
  const success = document.getElementById('form-success');
  const submit  = document.getElementById('form-submit');

  if (form && success && submit) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic HTML5 validation check
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Simulate submission (replace with real fetch/API call as needed)
      submit.disabled = true;
      submit.textContent = 'Sending…';

      setTimeout(() => {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        form.reset();
        submit.disabled = false;
        submit.textContent = 'Send Message';

        // Auto-hide success after 6 seconds
        setTimeout(() => { success.hidden = true; }, 6000);
      }, 900);
    });
  }

  /* ── 8. Add active style rule via JS ── */
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: #ff6600 !important; }`;
  document.head.appendChild(style);

})();
