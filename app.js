const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Top navigation active state
const topNavLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
if (topNavLinks.length) {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  topNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPath);
  });
}

// Scroll reveal
if (reduceMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('on'));
} else {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// Mobile navigation
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const globalSidebar = document.querySelector('.global-sidebar');

if (hamburger) {
  hamburger.setAttribute('aria-expanded', 'false');

  function closeAll() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    if (navLinks) navLinks.classList.remove('open');
    if (globalSidebar) globalSidebar.classList.remove('open');
    document.body.classList.remove('menu-open');
  }

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    // Article pages: open sidebar. Hub/simple pages: open nav links.
    if (globalSidebar) {
      globalSidebar.classList.add('open');
    } else if (navLinks) {
      navLinks.classList.add('open');
    }
    document.body.classList.add('menu-open');
  }

  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    hamburger.classList.contains('open') ? closeAll() : openMenu();
  });

  document.addEventListener('click', e => {
    if (!hamburger.classList.contains('open')) return;
    const inside = (navLinks && navLinks.contains(e.target)) || (globalSidebar && globalSidebar.contains(e.target));
    if (!inside) closeAll();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) closeAll();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && hamburger.classList.contains('open')) closeAll();
  });

  // Close on nav link click (mobile)
  document.querySelectorAll('.nav-links a, .sidebar-nav a').forEach(a => {
    a.addEventListener('click', closeAll);
  });
}

// Active TOC link on scroll
const tocLinks = document.querySelectorAll('.toc-links a');
if (tocLinks.length) {
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
  const sections = Array.from(tocLinks)
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const onScroll = () => {
    let active = sections[0];
    sections.forEach(s => {
      if (window.scrollY + navH + 24 >= s.offsetTop) active = s;
    });
    tocLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + active.id));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Back to top
const btt = document.querySelector('.back-to-top');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
}

// FAQ Accordion
document.querySelectorAll('.faq-item .faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    if (!item) return;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});
