const icons = {
  trophy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5v2a3 3 0 0 0 3 3m8-5h3v2a3 3 0 0 1-3 3M12 13v4m-4 3h8m-6-3h4"/></svg>',
  palette: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a2 2 0 0 1 0-4h3.5A5.5 5.5 0 0 0 21 8.5C21 5.5 17 3 12 3Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="10" cy="6.7" r=".8"/><circle cx="14.2" cy="6.5" r=".8"/><circle cx="17" cy="9.2" r=".8"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4C11 4 5 8 5 14a5 5 0 0 0 5 5c6 0 10-6 10-15Z"/><path d="M4 21c3-6 7-9 12-12"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13ZM6 14l1 2.9L10 18l-3 1.1L6 22l-1-2.9L2 18l3-1.1L6 14Z"/></svg>',
  image: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 17 5-4 3 3 3-2 5 4"/></svg>',
  music: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5a3 3 0 0 1 3-3h5v18H7a3 3 0 0 0-3 2V5Zm16 0a3 3 0 0 0-3-3h-5v18h5a3 3 0 0 1 3 2V5Z"/></svg>',
  brain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 4.5A3 3 0 0 0 4 6a3 3 0 0 0 0 6 3 3 0 0 0 2 5.8A3 3 0 0 0 12 17V6a3 3 0 0 0-2.5-1.5ZM14.5 4.5A3 3 0 0 1 20 6a3 3 0 0 1 0 6 3 3 0 0 1-2 5.8A3 3 0 0 1 12 17V6a3 3 0 0 1 2.5-1.5Z"/><path d="M8 9a3 3 0 0 1-4 3m12-3a3 3 0 0 0 4 3M9 15a3 3 0 0 0 3-3m3 3a3 3 0 0 1-3-3"/></svg>',
  grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  activity: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>',
  folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/></svg>'
};

const menuList = document.querySelector('#menuList');
const menuViewport = document.querySelector('#menuViewport');
const levelLabel = document.querySelector('#levelLabel');
const scrollThumb = document.querySelector('#scrollThumb');
const dial = document.querySelector('#dial');
const toast = document.querySelector('#toast');
const activityStage = document.querySelector('#activityStage');
const activityFrame = document.querySelector('#activityFrame');

let rootMenu;
let navigation = [];
let selectedIndex = 0;
let visualIndex = 0;
let clickTimer = null;
let wheelLocked = false;
let wheelAccumulator = 0;
let wheelResetTimer = null;
let lastMoveAt = 0;
let toastTimer = null;
let activityOpen = false;
let loopResetTimer = null;
let isLoopResetting = false;

const currentMenu = () => navigation[navigation.length - 1]?.menu || rootMenu;

function uniqueIds(menu, seen = new Set()) {
  if (!menu?.id || seen.has(menu.id)) throw new Error(`ID inválido o repetido: ${menu?.id || 'sin-id'}`);
  seen.add(menu.id);
  for (const item of menu.items || []) {
    if (!item.id || seen.has(item.id)) throw new Error(`ID inválido o repetido: ${item.id || 'sin-id'}`);
    seen.add(item.id);
    if (item.tipo === 'menu') uniqueIds({ ...item, id: `${item.id}__children` }, seen);
  }
}

function validateConfig(menu) {
  const ids = new Set();
  const visit = (node) => {
    if (!node.id || ids.has(node.id)) throw new Error(`ID inválido o repetido: ${node.id || 'sin-id'}`);
    ids.add(node.id);
    if (!['menu', 'actividad'].includes(node.tipo)) throw new Error(`Tipo no válido en ${node.id}`);
    if (node.tipo === 'menu') (node.items || []).forEach(visit);
    if (node.tipo === 'actividad' && !node.ruta) throw new Error(`Falta ruta en ${node.id}`);
  };
  visit(menu);
}

function iconFor(item) {
  return icons[item.icono] || icons[item.tipo === 'menu' ? 'folder' : 'activity'];
}

function renderMenu(preferredIndex = 0) {
  const menu = currentMenu();
  const items = menu.items || [];
  selectedIndex = Math.max(0, Math.min(preferredIndex, items.length - 1));
  visualIndex = items.length > 1 ? items.length + selectedIndex : selectedIndex;
  isLoopResetting = false;
  lastMoveAt = 0;
  window.clearTimeout(loopResetTimer);
  levelLabel.textContent = menu.nombre;
  levelLabel.title = navigation.length ? navigation.map((entry) => entry.menu.nombre).join(' / ') : menu.nombre;
  menuList.innerHTML = '';

  const copyCount = items.length > 1 ? 3 : 1;
  for (let copy = 0; copy < copyCount; copy += 1) {
    items.forEach((item, index) => {
      const button = document.createElement('button');
      const isAccessibleCopy = copyCount === 1 || copy === 1;
      button.className = 'menu-item';
      button.type = 'button';
      button.dataset.index = String(index);
      button.dataset.id = item.id;
      button.dataset.copy = String(copy);
      if (isAccessibleCopy) {
        button.role = 'menuitem';
        button.setAttribute('aria-label', `${item.nombre}. ${item.tipo === 'menu' ? 'Submenú' : 'Actividad'}`);
      } else {
        button.setAttribute('aria-hidden', 'true');
        button.tabIndex = -1;
      }
      button.innerHTML = `
        <span class="menu-item__icon">${iconFor(item)}</span>
        <span class="menu-item__name">${item.nombre}</span>
        <span class="menu-item__arrow" aria-hidden="true">›</span>
      `;
      button.addEventListener('click', handleDialClick);
      menuList.append(button);
    });
  }

  requestAnimationFrame(() => {
    fitMenuText();
    updateSelection(false);
  });
}

function cancelPendingClick() {
  if (clickTimer) window.clearTimeout(clickTimer);
  clickTimer = null;
}

function handleDialClick(event) {
  if (activityOpen) return;
  if (event?.detail === 0) return;
  event?.stopPropagation();
  cancelPendingClick();
  clickTimer = window.setTimeout(() => activateSelected(), 240);
}

function fitMenuText() {
  const count = currentMenu().items?.length || 0;
  if (!count) return;
  const middleOffset = count > 1 ? count : 0;
  const names = [...menuList.querySelectorAll('.menu-item__name')].slice(middleOffset, middleOffset + count);
  let size = Math.min(50, Math.max(24, dial.clientHeight * 0.05));
  const minimum = Math.max(18, dial.clientHeight * 0.026);
  menuList.style.setProperty('--menu-font-size', `${size}px`);
  while (size > minimum && names.some((name) => name.scrollWidth > name.clientWidth)) {
    size -= 1;
    menuList.style.setProperty('--menu-font-size', `${size}px`);
  }
}

function updateSelection(animate = true) {
  const items = [...menuList.children];
  menuList.classList.toggle('is-repositioning', !animate);
  items.forEach((item, index) => item.classList.toggle('is-selected', index === visualIndex));
  const selected = items[visualIndex];
  if (!selected) return;

  const selectedCenter = selected.offsetTop + selected.offsetHeight / 2;
  const viewportCenter = menuViewport.clientHeight / 2;
  menuList.style.transform = `translateY(${viewportCenter - selectedCenter}px)`;
  const count = currentMenu().items?.length || 0;
  const focusIndex = count > 1 ? count + selectedIndex : selectedIndex;
  items[focusIndex]?.focus({ preventScroll: true });

  const ratio = count <= 1 ? 0 : selectedIndex / (count - 1);
  const thumbPercent = Math.max(22, Math.min(48, 100 / Math.max(count, 2)));
  scrollThumb.style.height = `${thumbPercent}%`;
  scrollThumb.style.top = `${ratio * (100 - thumbPercent)}%`;

  sessionStorage.setItem(`dial:${currentMenu().id}`, String(selectedIndex));
  if (!animate) {
    void menuList.offsetHeight;
    menuList.classList.remove('is-repositioning');
  }
}

function moveSelection(direction) {
  const count = currentMenu().items?.length || 0;
  if (!count || isLoopResetting) return;
  const now = performance.now();
  if (now - lastMoveAt < 180) return;
  lastMoveAt = now;
  selectedIndex = (selectedIndex + direction + count) % count;
  visualIndex += direction;
  updateSelection(true);

  if (count > 1 && (visualIndex < count || visualIndex >= count * 2)) {
    isLoopResetting = true;
    loopResetTimer = window.setTimeout(() => {
      visualIndex = count + selectedIndex;
      updateSelection(false);
      isLoopResetting = false;
    }, 320);
  }
}

function activateSelected() {
  cancelPendingClick();
  const menu = currentMenu();
  const item = menu.items?.[selectedIndex];
  if (!item) return;

  if (item.tipo === 'menu') {
    navigation.push({ menu: item, parentSelection: selectedIndex });
    const saved = Number(sessionStorage.getItem(`dial:${item.id}`));
    renderMenu(Number.isFinite(saved) ? saved : 0);
    return;
  }

  openActivity(item);
}

function openActivity(item) {
  activityOpen = true;
  activityFrame.src = `actividades/${encodeURIComponent(item.ruta)}/index.html`;
  activityStage.hidden = false;
  dial.classList.add('is-activity');
}

function closeActivity() {
  if (!activityOpen) return false;
  activityOpen = false;
  activityStage.hidden = true;
  activityFrame.src = 'about:blank';
  dial.classList.remove('is-activity');
  requestAnimationFrame(() => updateSelection(false));
  return true;
}

function goBack() {
  cancelPendingClick();
  if (closeActivity()) return;
  if (!navigation.length) {
    showToast('Ya estás en el menú principal');
    return;
  }
  const previous = navigation.pop();
  renderMenu(previous.parentSelection);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 1600);
}

dial.addEventListener('wheel', (event) => {
  event.preventDefault();
  if (activityOpen) return;
  wheelAccumulator += event.deltaY;
  window.clearTimeout(wheelResetTimer);
  wheelResetTimer = window.setTimeout(() => { wheelAccumulator = 0; }, 140);
  if (wheelLocked || Math.abs(wheelAccumulator) < 55) return;
  wheelLocked = true;
  moveSelection(wheelAccumulator > 0 ? 1 : -1);
  wheelAccumulator = 0;
  window.setTimeout(() => { wheelLocked = false; }, 220);
}, { passive: false });

dial.addEventListener('click', handleDialClick);

dial.addEventListener('dblclick', (event) => {
  event.preventDefault();
  cancelPendingClick();
  goBack();
});

window.addEventListener('keydown', (event) => {
  if (activityOpen && !['Escape', 'Backspace'].includes(event.key)) return;
  if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key)) {
    event.preventDefault();
    moveSelection(1);
  } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    moveSelection(-1);
  } else if (['Enter', ' '].includes(event.key)) {
    event.preventDefault();
    activateSelected();
  } else if (['Escape', 'Backspace'].includes(event.key)) {
    event.preventDefault();
    goBack();
  }
});

window.addEventListener('message', (event) => {
  if (event.source !== activityFrame.contentWindow) return;
  if (event.data?.type === 'dial:back') closeActivity();
});

window.addEventListener('resize', () => requestAnimationFrame(() => {
  fitMenuText();
  updateSelection(false);
}));

fetch('config/menu.json')
  .then((response) => {
    if (!response.ok) throw new Error('No se pudo cargar config/menu.json');
    return response.json();
  })
  .then((config) => {
    validateConfig(config);
    rootMenu = config;
    const saved = Number(sessionStorage.getItem(`dial:${config.id}`));
    renderMenu(Number.isFinite(saved) ? saved : 2);
  })
  .catch((error) => {
    levelLabel.textContent = 'Error de configuración';
    menuList.innerHTML = `<p style="padding:2rem;color:#ffb4c8">${error.message}</p>`;
  });
