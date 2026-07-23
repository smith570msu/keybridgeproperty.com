/**
 * Keybridge Properties — main.js
 * No external dependencies. Pure vanilla JS.
 *
 * OWNER: Fill in these constants before launch.
 * Leave empty to disable (tags will not fire).
 */
const FORM_ENDPOINT = 'https://services.leadconnectorhq.com/hooks/j794bCglqnNGvhcOeHug/webhook-trigger/4367eb1c-1e4e-4ef8-a3d5-b4ed768728e0';
const GA4_ID       = 'G-QTRJKES4GX';
const ADS_ID       = ''; // e.g. 'AW-XXXXXXXXXX'
const META_PIXEL_ID = ''; // e.g. '123456789012345'

// Phone per business card: (248) 890-1427.
// Old site used (248) 268-0909 — confirm before launch.

/* ============================================================
   TRACKING (fires only when IDs are set)
   ============================================================ */
function initTracking() {
  if (GA4_ID) {
    const s = document.createElement('script');
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA4_ID);
  }

  if (ADS_ID) {
    // <!-- Google Ads conversion tag slot — uncomment and fill ADS_ID -->
  }

  if (META_PIXEL_ID) {
    // <!-- Meta Pixel slot — uncomment and fill META_PIXEL_ID -->
  }
}

function trackEvent(name, params = {}) {
  if (typeof gtag === 'function') gtag('event', name, params);
  if (typeof fbq === 'function') fbq('track', name, params);
}

/* ============================================================
   HEADER SCROLL BEHAVIOR
   ============================================================ */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   TEL / MAILTO TRACKING
   ============================================================ */
function initLinkTracking() {
  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.addEventListener('click', () => trackEvent('phone_click', { phone: a.href }));
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.addEventListener('click', () => trackEvent('email_click', { email: a.href }));
  });
}

/* ============================================================
   HERO ANIMATIONS
   ============================================================ */
function initHeroAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const targets = [
    '.hero-eyebrow',
    '.hero-h1',
    '.hero-subhead',
    '.hero-chips',
    '.hero-founder',
    '.offer-form-card',
  ];

  targets.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.animationDelay = `${i * 0.12}s`;
    el.classList.add('anim-in');
  });

  // Hero bridge arc draw
  setTimeout(() => drawArc('hero-arc', 1200), targets.length * 120 + 300);

  // Ambient icon drift
  initAmbientDrift();
}

/* ============================================================
   BRIDGE ARC DRAW (SVG stroke-dashoffset)
   ============================================================ */
function drawArc(id, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.style.strokeDashoffset = '0';
    return;
  }
  const len = el.getTotalLength ? el.getTotalLength() : 600;
  el.style.strokeDasharray = len;
  el.style.strokeDashoffset = len;
  el.style.transition = `stroke-dashoffset ${duration}ms ease-out`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.strokeDashoffset = '0';
    });
  });
}

/* ============================================================
   AMBIENT HERO DRIFT
   ============================================================ */
function initAmbientDrift() {
  const chips = document.querySelectorAll('.ambient-chip');
  if (!chips.length) return;

  chips.forEach((chip, i) => {
    const duration = 8000 + i * 2000;
    const delay = i * 1200;
    chip.style.animation = `drift ${duration}ms ${delay}ms ease-in-out infinite alternate`;
  });

  if (!document.getElementById('drift-style')) {
    const style = document.createElement('style');
    style.id = 'drift-style';
    style.textContent = `
      @keyframes drift {
        from { transform: translateY(0); }
        to   { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const els = document.querySelectorAll('.reveal');

  if (reducedMotion) {
    els.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add('revealed'), Number(delay));
      observer.unobserve(el);
    });
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));
}

/* ============================================================
   STAT COUNTERS
   ============================================================ */
function initStatCounters() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el = entry.target;
      const target = el.dataset.target;
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const isNumeric = !isNaN(parseInt(target));

      if (reducedMotion || !isNumeric) {
        el.textContent = prefix + target + suffix;
        return;
      }

      const end = parseInt(target);
      const duration = 1400;
      const start = performance.now();

      const easeOut = t => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const val = Math.round(easeOut(progress) * end);
        el.textContent = prefix + val + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + end + suffix;
      };

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.3 });

  stats.forEach(el => observer.observe(el));
}

/* ============================================================
   HOW IT WORKS ARC (scroll-triggered draw)
   ============================================================ */
function initStepsArc() {
  const arc = document.getElementById('steps-arc');
  if (!arc) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const len = arc.getTotalLength ? arc.getTotalLength() : 400;
  arc.style.strokeDasharray = len;
  arc.style.strokeDashoffset = len;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      arc.style.transition = 'stroke-dashoffset 1.4s ease-out';
      arc.style.strokeDashoffset = '0';
    });
  }, { threshold: 0.4 });

  const wrapper = document.querySelector('.steps-wrapper');
  if (wrapper) observer.observe(wrapper);
}

/* ============================================================
   MOBILE STICKY BAR (show after hero form passes viewport)
   ============================================================ */
function initMobileBar() {
  const bar = document.querySelector('.mobile-bar');
  const form = document.querySelector('.offer-form-card');
  if (!bar || !form) return;

  // Bar starts hidden via CSS; we only handle the logic
  const observer = new IntersectionObserver((entries) => {
    const inView = entries[0].isIntersecting;
    if (!inView) {
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  }, { threshold: 0 });

  observer.observe(form);
}

/* ============================================================
   OFFER FORM
   ============================================================ */
function initForm() {
  const form = document.getElementById('offer-form-el');
  if (!form) return;

  const formBody    = form.querySelector('.form-fields-wrapper');
  const successEl   = form.querySelector('.form-success');
  const errorEl     = form.querySelector('.form-error-msg');
  const honeypot    = form.querySelector('.hp-field input');
  const loadTime    = Date.now();

  // Enable "Get My Offer" only once every required field is filled and valid.
  // Driven by the `required` attributes in the HTML (all fields except address).
  const submitBtn      = document.getElementById('form-submit-btn');
  const requiredInputs = [...form.querySelectorAll('input[required]')];
  function fieldOk(inp) {
    const v = inp.value.trim();
    if (!v) return false;
    if (inp.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (inp.type === 'tel')   return v.replace(/\D/g, '').length >= 10;
    return true;
  }
  function updateSubmitState() {
    if (submitBtn) submitBtn.disabled = !requiredInputs.every(fieldOk);
  }
  form.addEventListener('input', updateSubmitState);
  updateSubmitState();

  // Basic client-side validation
  function validate() {
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    let valid = true;

    if (email && email.value.trim()) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      email.style.borderColor = emailOk ? '' : '#dc2626';
      if (!emailOk) valid = false;
    }

    if (phone && phone.value.trim()) {
      const stripped = phone.value.replace(/\D/g, '');
      const phoneOk = stripped.length >= 10;
      phone.style.borderColor = phoneOk ? '' : '#dc2626';
      if (!phoneOk) valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot && honeypot.value) return;

    // Minimum time check (< 3s = bot)
    if (Date.now() - loadTime < 3000) return;

    if (!validate()) return;

    if (!FORM_ENDPOINT) {
      // No endpoint set — show success for demo purposes
      showSuccess();
      return;
    }

    const data = new FormData(form);
    // Remove honeypot from submission
    data.delete('hp_name');

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        showSuccess();
        trackEvent('form_submit', { form: 'offer_form' });
        // Redirect to thank-you page if it exists
        setTimeout(() => {
          window.location.href = '/thank-you/';
        }, 800);
      } else {
        showError();
      }
    } catch {
      showError();
    }
  });

  function showSuccess() {
    if (formBody) formBody.style.display = 'none';
    if (errorEl) errorEl.classList.remove('visible');
    if (successEl) successEl.classList.add('visible');
  }

  function showError() {
    if (errorEl) errorEl.classList.add('visible');
  }
}

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTracking();
  initHeader();
  initLinkTracking();
  initHeroAnimations();
  initScrollReveal();
  initStatCounters();
  initStepsArc();
  initMobileBar();
  initForm();
  initSmoothScroll();
});
