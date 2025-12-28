import { startBackgroundSnake } from './src/easteregg/snake.js';

const state = {
  content: null,
  carousels: {
    experience: { index: 0, items: [] },
    projects: { index: 0, items: [] },
    education: { index: 0, items: [] }
  },
  activeTab: 'education'
};

const selectors = {
  title: document.getElementById('title-bar-text'),
  name: document.getElementById('profile-name'),
  tagline: document.getElementById('profile-tagline'),
  contactLinks: document.getElementById('contact-links'),
  status: document.getElementById('status-bar'),
  tabs: {
    experience: document.getElementById('tab-experience'),
    projects: document.getElementById('tab-projects'),
    education: document.getElementById('tab-education')
  },
  panels: {
    experience: document.getElementById('panel-experience'),
    projects: document.getElementById('panel-projects'),
    education: document.getElementById('panel-education')
  },
  cards: {
    experience: document.getElementById('experience-card'),
    projects: document.getElementById('projects-card'),
    education: document.getElementById('education-card')
  },
  indicators: {
    experience: document.getElementById('experience-indicator'),
    projects: document.getElementById('projects-indicator'),
    education: document.getElementById('education-indicator')
  }
};

document.addEventListener('DOMContentLoaded', () => {
  init();
});

async function init() {
  startBackgroundSnake();
  try {
    const content = await loadContent();
    state.content = content;
    hydrateIdentity(content);
    setupTabs();
    setupCarousels(content);
    updateStatus(content.statusText ?? '');
  } catch (error) {
    console.error('Failed to load content:', error);
    updateStatus('Content failed to load. Check content.json path.');
  }
}

async function loadContent() {
  const response = await fetch('./content.json');
  if (!response.ok) {
    throw new Error('Unable to fetch content.json');
  }
  return response.json();
}

function hydrateIdentity(content) {
  selectors.title.textContent = `Portfolio`;
  selectors.name.textContent = content.name;
  selectors.tagline.textContent = content.tagline;
  selectors.contactLinks.innerHTML = '';

  Object.entries(content.contacts || {}).forEach(([key, value]) => {
    if (!value) return;
    const link = document.createElement('a');
    link.href = key === 'email' ? `mailto:${value}` : value;
    link.target = key === 'email' ? '_self' : '_blank';
    link.rel = key === 'email' ? '' : 'noreferrer noopener';
    link.textContent = formatContactLabel(key);
    selectors.contactLinks.appendChild(link);
  });
}

function setupTabs() {
  Object.entries(selectors.tabs).forEach(([key, button]) => {
    button.addEventListener('click', () => switchTab(key));
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        switchTab(key);
      }
    });
  });
}

function switchTab(target) {
  if (!selectors.tabs[target]) return;
  state.activeTab = target;

  Object.entries(selectors.tabs).forEach(([key, button]) => {
    const isActive = key === target;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', isActive);
    button.tabIndex = isActive ? 0 : -1;
  });

  Object.entries(selectors.panels).forEach(([key, panel]) => {
    const isActive = key === target;
    panel.hidden = !isActive;
  });

  selectors.tabs[target].focus();
}

function setupCarousels(content) {
  state.carousels.experience.items = content.experience || [];
  state.carousels.projects.items = content.projects || [];
  state.carousels.education.items = content.education || [];

  renderCard('experience');
  renderCard('projects');
  renderCard('education');

  document.querySelectorAll('.carousel .control').forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.type;
      const direction = button.dataset.action === 'next' ? 1 : -1;
      shiftCarousel(type, direction);
    });
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const type = button.dataset.type;
        const direction = button.dataset.action === 'next' ? 1 : -1;
        shiftCarousel(type, direction);
      }
    });
  });

  Object.entries(selectors.panels).forEach(([type, panel]) => {
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        shiftCarousel(type, -1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        shiftCarousel(type, 1);
      }
    });
  });
}

function shiftCarousel(type, direction) {
  const carousel = state.carousels[type];
  if (!carousel || carousel.items.length === 0) return;

  carousel.index = (carousel.index + direction + carousel.items.length) % carousel.items.length;
  renderCard(type);
}

function renderCard(type) {
  const carousel = state.carousels[type];
  const cardSlot = selectors.cards[type];
  const indicator = selectors.indicators[type];

  if (!carousel || !cardSlot || !indicator) return;

  cardSlot.innerHTML = '';

  if (carousel.items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.textContent = 'No items to display yet.';
    cardSlot.appendChild(empty);
    indicator.textContent = '0 / 0';
    return;
  }

  const item = carousel.items[carousel.index];
  let card;
  if (type === 'experience') {
    card = buildExperienceCard(item);
  } else if (type === 'projects') {
    card = buildProjectCard(item);
  } else {
    card = buildEducationCard(item);
  }
  cardSlot.appendChild(card);
  indicator.textContent = `${carousel.index + 1} / ${carousel.items.length}`;
}

function buildExperienceCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = item.role;
  card.appendChild(title);

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = `${item.company} · ${item.dates}`;
  card.appendChild(meta);

  if (Array.isArray(item.highlights)) {
    const list = document.createElement('ul');
    item.highlights.forEach((highlight) => {
      const li = document.createElement('li');
      li.textContent = highlight;
      list.appendChild(li);
    });
    card.appendChild(list);
  }

  if (Array.isArray(item.tags) && item.tags.length) {
    const tags = document.createElement('div');
    tags.className = 'tags';
    item.tags.forEach((tagText) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = tagText;
      tags.appendChild(tag);
    });
    card.appendChild(tags);
  }

  return card;
}

function buildProjectCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = item.name;
  card.appendChild(title);

  const summary = document.createElement('p');
  summary.className = 'meta';
  summary.textContent = item.summary;
  card.appendChild(summary);

  if (Array.isArray(item.highlights)) {
    const list = document.createElement('ul');
    item.highlights.forEach((highlight) => {
      const li = document.createElement('li');
      li.textContent = highlight;
      list.appendChild(li);
    });
    card.appendChild(list);
  }

  const linksWrap = document.createElement('div');
  linksWrap.className = 'links';

  if (item.links?.github) {
    linksWrap.appendChild(createLink('GitHub', item.links.github));
  }

  if (item.links?.demo) {
    linksWrap.appendChild(createLink('Demo', item.links.demo));
  }

  if (linksWrap.children.length) {
    card.appendChild(linksWrap);
  }

  if (Array.isArray(item.tags) && item.tags.length) {
    const tags = document.createElement('div');
    tags.className = 'tags';
    item.tags.forEach((tagText) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = tagText;
      tags.appendChild(tag);
    });
    card.appendChild(tags);
  }

  return card;
}

function buildEducationCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = item.degree || item.title || 'Education';
  card.appendChild(title);

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = `${item.institution || ''}${item.dates ? ` · ${item.dates}` : ''}`;
  card.appendChild(meta);

  if (Array.isArray(item.highlights)) {
    const list = document.createElement('ul');
    item.highlights.forEach((highlight) => {
      const li = document.createElement('li');
      li.textContent = highlight;
      list.appendChild(li);
    });
    card.appendChild(list);
  }

  if (Array.isArray(item.tags) && item.tags.length) {
    const tags = document.createElement('div');
    tags.className = 'tags';
    item.tags.forEach((tagText) => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = tagText;
      tags.appendChild(tag);
    });
    card.appendChild(tags);
  }

  return card;
}

function createLink(label, href) {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.target = '_blank';
  anchor.rel = 'noreferrer noopener';
  anchor.textContent = label;
  return anchor;
}

function formatContactLabel(key) {
  const labels = {
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn'
  };
  return labels[key] || key.replace(/(^|\s)([a-z])/gi, (match, space, letter) => `${space}${letter.toUpperCase()}`);
}

function updateStatus(message) {
  if (!selectors.status) return;
  if (message) {
    selectors.status.textContent = message;
    selectors.status.style.display = 'flex';
    selectors.status.removeAttribute('aria-hidden');
  } else {
    selectors.status.textContent = '';
    selectors.status.style.display = 'none';
    selectors.status.setAttribute('aria-hidden', 'true');
  }
}
