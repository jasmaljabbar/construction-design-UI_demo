// Tiny hash router. Screens register a path pattern (":id" segments supported)
// and a render(params) function returning { appBar, bottomNav, fab, body, bodyClass, bg }.

const routes = [];

export function register(pattern, render) {
  const segments = pattern.split('/').filter(Boolean);
  routes.push({ pattern, segments, render });
}

function match(hashPath) {
  const pathSegments = hashPath.split('/').filter(Boolean);
  for (const r of routes) {
    if (r.segments.length !== pathSegments.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < r.segments.length; i++) {
      const rs = r.segments[i];
      const ps = pathSegments[i];
      if (rs.startsWith(':')) { params[rs.slice(1)] = decodeURIComponent(ps); }
      else if (rs !== ps) { ok = false; break; }
    }
    if (ok) return { route: r, params };
  }
  return null;
}

const root = document.getElementById('phone-root');
const routeLabel = document.getElementById('route-label');

// Tracks whether the next render should slide in as "forward" (new screen,
// slides from the right) or "back" (returning screen, slides from the left).
// Set by the click handler below based on whether the trigger was a back arrow.
let navDirection = 'forward';

export function renderCurrent() {
  const hash = location.hash || '#/splash';
  const path = hash.replace(/^#/, '').split('?')[0]; // ignore query strings for matching
  const found = match(path);
  if (!found) {
    root.innerHTML = `<div class="screen"><div class="screen-body centered"><p class="t-title">Screen not found</p><p class="t-body-sec">${hash}</p></div></div>`;
    return;
  }
  const result = found.route.render(found.params) || {};
  const { appBarHtml = '', bottomNavHtml = '', fabHtml = '', body = '', bodyClass = '', bg = '' } = result;
  root.innerHTML = `
    <div class="screen slide-in-${navDirection}" style="${bg ? `background:${bg}` : ''}">
      ${appBarHtml}
      <div class="screen-body ${bodyClass}">${body}</div>
      ${fabHtml}
      ${bottomNavHtml}
    </div>`;
  navDirection = 'forward'; // reset to default until the next back-arrow tap
  root.scrollTop = 0;
  const bodyEl = root.querySelector('.screen-body');
  if (bodyEl) bodyEl.scrollTop = 0;
  if (routeLabel) routeLabel.textContent = hash;
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', renderCurrent);

document.addEventListener('click', (e) => {
  const navEl = e.target.closest('[data-route]');
  if (navEl) {
    const r = navEl.getAttribute('data-route');
    if (r) {
      navDirection = navEl.hasAttribute('data-back') ? 'back' : 'forward';
      location.hash = r;
    }
    return;
  }
  const toggleEl = e.target.closest('[data-toggle]');
  if (toggleEl) {
    const group = toggleEl.closest('[data-toggle-group]');
    if (group) {
      group.querySelectorAll('[data-toggle]').forEach((el) => el.classList.remove('active'));
      toggleEl.classList.add('active');
    }
  }
});

export function start(defaultRoute = '#/splash') {
  if (!location.hash) location.hash = defaultRoute;
  else renderCurrent();
}
