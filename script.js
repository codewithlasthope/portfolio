const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navMenu.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'A') {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('click', (e) => {
  if (!navMenu || !menuToggle) return;
  const isClickInside = navMenu.contains(e.target) || menuToggle.contains(e.target);
  if (!isClickInside) {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', id);
  });
});

// Projects rendering via localStorage
const STORAGE_KEY = 'portfolio.projects';

function loadProjectsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  const projects = loadProjectsFromStorage();
  if (!projects.length) return; // keep fallback cards

  grid.innerHTML = '';
  for (const p of projects) {
    const article = document.createElement('article');
    article.className = 'card project';

    let coverHtml = '';
    if (p.imageUrl && p.imageUrl.trim()) {
      coverHtml = `<div class="cover" style="height:auto;aspect-ratio:16/9;overflow:hidden;">\n<img src="${p.imageUrl}" alt="${p.title || 'Project'} screenshot" style="width:100%;height:auto;display:block;">\n</div>`;
    } else {
      const accent = Number(p.accent) || 1;
      coverHtml = `<div class="cover" data-accent="${accent}"></div>`;
    }

    const safe = (v) => (v == null ? '' : String(v));
    const title = safe(p.title);
    const desc = safe(p.description);
    const live = safe(p.liveUrl);
    const code = safe(p.codeUrl);

    const actions = [];
    if (live) actions.push(`<a class="btn sm" href="${live}" target="_blank" rel="noopener">Live</a>`);
    if (code) actions.push(`<a class="btn sm outline" href="${code}" target="_blank" rel="noopener">Code</a>`);

    article.innerHTML = `
      ${coverHtml}
      <div class="card-body">
        <h3>${title || 'Untitled Project'}</h3>
        <p>${desc || ''}</p>
        <div class="card-actions">${actions.join(' ')}</div>
      </div>
    `;
    grid.appendChild(article);
  }
}

// Render on load
try { renderProjects(); } catch (_) {}
