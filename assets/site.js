const menu = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
const languagePicker = document.querySelector('[data-language-picker]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const themeColor = document.querySelector('meta[name="theme-color"]');
const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  themeToggle?.setAttribute('aria-pressed', String(theme === 'light'));
  if (themeColor) themeColor.content = theme === 'light' ? '#f4f4ef' : '#0b0c0c';
};
applyTheme(document.documentElement.dataset.theme || 'dark');
themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('ersan-theme', next); } catch {}
});
languagePicker?.querySelector('summary')?.addEventListener('click', () => {
  nav?.classList.remove('is-open');
  menu?.setAttribute('aria-expanded', 'false');
});
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', String(open));
  languagePicker?.removeAttribute('open');
});
nav?.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    nav.classList.remove('is-open');
    menu?.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('[data-language-link]').forEach((link) => {
  link.addEventListener('click', () => {
    try { localStorage.setItem('ersan-language', link.dataset.locale); } catch {}
  });
});
document.addEventListener('click', (event) => {
  if (languagePicker?.open && !languagePicker.contains(event.target)) languagePicker.removeAttribute('open');
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  languagePicker?.removeAttribute('open');
  nav?.classList.remove('is-open');
  menu?.setAttribute('aria-expanded', 'false');
});

const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
filters.forEach((button) => button.addEventListener('click', () => {
  filters.forEach((item) => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  cards.forEach((card) => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));

const artDialog = document.querySelector('[data-art-dialog]');
if (artDialog) {
  const image = artDialog.querySelector('img');
  const caption = artDialog.querySelector('[data-art-caption]');
  document.querySelectorAll('[data-open-art]').forEach((button) => button.addEventListener('click', () => {
    image.src = button.dataset.image;
    image.alt = button.dataset.caption;
    caption.textContent = button.dataset.caption;
    artDialog.showModal();
  }));
  artDialog.addEventListener('click', (event) => { if (event.target === artDialog) artDialog.close(); });
}

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const revealItems = document.querySelectorAll('[data-reveal], .section-head, .feature-card, .principle-grid article, .timeline article, .note-list > a, .site-card, .poster-item, .logo-item, .contact-list > a');
  revealItems.forEach((item) => item.classList.add('reveal-ready'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealItems.forEach((item) => observer.observe(item));

  const spotlight = document.querySelector('[data-spotlight]');
  if (spotlight && matchMedia('(pointer:fine)').matches) {
    spotlight.addEventListener('pointermove', (event) => {
      const box = spotlight.getBoundingClientRect();
      spotlight.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
      spotlight.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
    });
  }

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--scroll-progress', `${max > 0 ? (scrollY / max) * 100 : 0}%`);
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const previewObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-playing', entry.isIntersecting));
  }, { threshold: 0.58 });
  document.querySelectorAll('.site-gallery .browser-viewport:has(img)').forEach((item) => previewObserver.observe(item));

  const portrait = document.querySelector('[data-motion-portrait]');
  if (portrait && matchMedia('(pointer:fine)').matches) {
    portrait.addEventListener('pointermove', (event) => {
      const box = portrait.getBoundingClientRect();
      portrait.style.setProperty('--portrait-x', `${((event.clientX - box.left) / box.width - .5) * 8}deg`);
      portrait.style.setProperty('--portrait-y', `${((event.clientY - box.top) / box.height - .5) * -8}deg`);
    });
    portrait.addEventListener('pointerleave', () => {
      portrait.style.setProperty('--portrait-x', '0deg');
      portrait.style.setProperty('--portrait-y', '0deg');
    });
  }

  document.querySelectorAll('[data-motion-card]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--card-x', `${event.clientX - box.left}px`);
      card.style.setProperty('--card-y', `${event.clientY - box.top}px`);
    });
  });

  const visualCollage = document.querySelector('[data-visual-collage]');
  if (visualCollage && matchMedia('(pointer:fine)').matches) {
    visualCollage.addEventListener('pointermove', (event) => {
      const box = visualCollage.getBoundingClientRect();
      visualCollage.style.setProperty('--collage-x', `${((event.clientX - box.left) / box.width - .5) * 18}px`);
      visualCollage.style.setProperty('--collage-y', `${((event.clientY - box.top) / box.height - .5) * 14}px`);
    });
    visualCollage.addEventListener('pointerleave', () => {
      visualCollage.style.setProperty('--collage-x', '0px');
      visualCollage.style.setProperty('--collage-y', '0px');
    });
  }

  const visualHero = document.querySelector('[data-visual-hero]');
  if (visualHero && matchMedia('(pointer:fine)').matches) {
    visualHero.addEventListener('pointermove', (event) => {
      const box = visualHero.getBoundingClientRect();
      visualHero.style.setProperty('--hero-art-x', `${((event.clientX - box.left) / box.width - .5) * 24}px`);
      visualHero.style.setProperty('--hero-art-y', `${((event.clientY - box.top) / box.height - .5) * 18}px`);
    });
    visualHero.addEventListener('pointerleave', () => {
      visualHero.style.setProperty('--hero-art-x', '0px');
      visualHero.style.setProperty('--hero-art-y', '0px');
    });
  }

  const aboutPortrait = document.querySelector('[data-about-portrait]');
  if (aboutPortrait && matchMedia('(pointer:fine)').matches) {
    aboutPortrait.addEventListener('pointermove', (event) => {
      const box = aboutPortrait.getBoundingClientRect();
      aboutPortrait.style.setProperty('--about-x', `${((event.clientX - box.left) / box.width - .5) * 5}deg`);
      aboutPortrait.style.setProperty('--about-y', `${((event.clientY - box.top) / box.height - .5) * -5}deg`);
    });
    aboutPortrait.addEventListener('pointerleave', () => {
      aboutPortrait.style.setProperty('--about-x', '0deg');
      aboutPortrait.style.setProperty('--about-y', '0deg');
    });
  }

  document.querySelectorAll('[data-visual-card]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--visual-card-x', `${event.clientX - box.left}px`);
      card.style.setProperty('--visual-card-y', `${event.clientY - box.top}px`);
    });
  });

  const canvas = document.querySelector('[data-motion-field]');
  if (canvas) {
    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let points = [];
    let pointer = { x: -1000, y: -1000 };
    const resizeField = () => {
      const box = canvas.getBoundingClientRect();
      const scale = Math.min(devicePixelRatio || 1, 1.5);
      width = Math.max(1, box.width);
      height = Math.max(1, box.height);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const count = width < 700 ? 22 : 48;
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .32,
        vy: (Math.random() - .5) * .32,
        size: Math.random() * 1.7 + .7
      }));
    };
    const hero = canvas.closest('.hero');
    hero?.addEventListener('pointermove', (event) => {
      const box = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    });
    hero?.addEventListener('pointerleave', () => { pointer = { x: -1000, y: -1000 }; });
    const drawField = () => {
      context.clearRect(0, 0, width, height);
      const light = document.documentElement.dataset.theme === 'light';
      context.fillStyle = light ? 'rgba(0,109,103,.48)' : 'rgba(201,238,143,.64)';
      context.strokeStyle = light ? 'rgba(0,109,103,.11)' : 'rgba(140,215,204,.13)';
      points.forEach((point, index) => {
        const dx = point.x - pointer.x;
        const dy = point.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 130 && distance > 0) {
          point.vx += (dx / distance) * .012;
          point.vy += (dy / distance) * .012;
        }
        point.vx *= .995;
        point.vy *= .995;
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
        context.beginPath();
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fill();
        for (let otherIndex = index + 1; otherIndex < points.length; otherIndex++) {
          const other = points[otherIndex];
          const lineDistance = Math.hypot(point.x - other.x, point.y - other.y);
          if (lineDistance > 128) continue;
          context.globalAlpha = 1 - lineDistance / 128;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
        context.globalAlpha = 1;
      });
      requestAnimationFrame(drawField);
    };
    resizeField();
    new ResizeObserver(resizeField).observe(canvas);
    drawField();
  }
}
