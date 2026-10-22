// Reusable render helpers — mirror the Figma component library.
// Every function returns an HTML string. Navigation is wired via data-route
// attributes; a single delegated click listener in router.js handles them.

export function Btn({ label, route, style = 'primary', full = true, disabled = false, action = '' }) {
  const cls = `btn btn-${style}${full ? '' : ' auto-width'}`;
  const attrs = disabled ? 'disabled' : `data-route="${route || ''}" ${action ? `data-action="${action}"` : ''}`;
  return `<button class="${cls}" ${attrs}>${label}</button>`;
}

export function Field({ label, value = '', helper = '', type = 'text', state = 'default', placeholder = '', id = '' }) {
  const stateCls = state !== 'default' ? ` ${state}` : '';
  const idAttr = id ? `id="${id}"` : '';
  return `
  <div class="field${stateCls}">
    <span class="label">${label}</span>
    <div class="box">
      <input ${idAttr} type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${state === 'disabled' ? 'disabled' : ''} />
    </div>
    ${helper ? `<span class="helper">${helper}</span>` : ''}
  </div>`;
}

export function TextareaField({ label, value = '', helper = '' }) {
  return `
  <div class="field">
    <span class="label">${label}</span>
    <div class="box textarea"><textarea>${esc(value)}</textarea></div>
    ${helper ? `<span class="helper">${helper}</span>` : ''}
  </div>`;
}

export function Chip(label, tone = 'neutral') {
  return `<span class="chip chip-${tone}">${label}</span>`;
}

export function KpiCard({ label, value, delta = '' }) {
  return `
  <div class="kpi-card">
    <span class="label">${label}</span>
    <span class="value">${value}</span>
    ${delta ? `<span class="delta">${delta}</span>` : ''}
  </div>`;
}

export function ListItem({ initials, title, subtitle, trailing = '›', route = '', avatarGlyph = '' }) {
  return `
  <button class="list-item" ${route ? `data-route="${route}"` : ''}>
    <span class="avatar">${avatarGlyph || initials}</span>
    <span class="main">
      <span class="title">${title}</span>
      <span class="subtitle">${subtitle}</span>
    </span>
    <span class="trailing">${trailing}</span>
  </button>`;
}

export function AppBar({ type = 'root', title = '', back = '' }) {
  if (type === 'root') {
    return `
    <div class="app-bar root">
      <button class="icon-btn" data-route="#/company-picker" data-back aria-label="Switch workspace">≡</button>
      <span class="title">${title}</span>
      <button class="icon-btn" data-route="#/settings" aria-label="Settings">⋮</button>
    </div>`;
  }
  return `
  <div class="app-bar detail">
    <button class="icon-btn" data-route="${back}" data-back aria-label="Back">←</button>
    <span class="title">${title}</span>
    <button class="icon-btn" aria-label="More">⋮</button>
  </div>`;
}

export function BottomNav({ company, active }) {
  const base = company === 'design' ? 'design' : 'construction';
  const tabs = [
    { key: 'dashboard', glyph: '▦', label: 'Dashboard', route: `#/${base}/dashboard` },
    { key: 'projects', glyph: '▤', label: 'Projects', route: `#/${base}/projects` },
    { key: 'employees', glyph: '◍', label: 'Employees', route: `#/${base}/employees` },
    { key: 'finances', glyph: '₹', label: 'Finances', route: `#/${base}/reports` },
    { key: 'more', glyph: '⋯', label: 'More', route: `#/settings` },
  ];
  return `
  <div class="bottom-nav">
    ${tabs.map((t) => `
      <button class="tab${t.key === active ? ' active' : ''}" data-route="${t.route}">
        <span class="glyph">${t.glyph}</span>
        <span>${t.label}</span>
      </button>`).join('')}
  </div>`;
}

export function Fab({ route, label = '+' }) {
  return `<button class="fab" data-route="${route}">${label}</button>`;
}

export function Tabs(items, activeKey, routeFor) {
  return `
  <div class="tabs">
    ${items.map((it) => `
      <button class="tab-item${it.key === activeKey ? ' active' : ''}" data-route="${routeFor(it.key)}">
        <span class="label">${it.label}</span>
        <span class="underline" style="width:${it.label.length * 7 + 4}px"></span>
      </button>`).join('')}
  </div>`;
}

export function EmptyState({ icon = '+', title, body, btnLabel, btnRoute }) {
  return `
  <div class="screen-body centered" style="gap:16px;">
    <div class="state-icon">${icon}</div>
    <p class="t-title m0">${title}</p>
    <p class="t-body-sec m0">${body}</p>
    ${Btn({ label: btnLabel, route: btnRoute, full: false })}
  </div>`;
}

export function ConfirmationDialog({ title, body, doneRoute, doneLabel = 'Done' }) {
  return `
  <div class="dialog-overlay">
    <div class="dialog-card">
      <div class="dialog-icon">✓</div>
      <p class="t-heading m0">${title}</p>
      <p class="t-body-sec m0">${body}</p>
      ${Btn({ label: doneLabel, route: doneRoute })}
    </div>
  </div>`;
}

export function InfoRow(label, value, tone = '') {
  return `<div class="info-row"><span class="k">${label}</span><span class="v${tone ? ' ' + tone : ''}">${value}</span></div>`;
}

export function ProgressBar(pct, thin = false) {
  return `<div class="progress-track${thin ? ' thin' : ''}"><div class="progress-fill" style="width:${Math.round(pct * 100)}%"></div></div>`;
}

export function Banner(text, tone = 'neutral') {
  return `<div class="banner ${tone}"><span>●</span><span>${text}</span></div>`;
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
