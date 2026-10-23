import { register } from '../router.js?v=3';
import { Btn, Fab } from '../components.js?v=3';

const SLIDES = ['title', 'two-companies', 'construction', 'design', 'safety'];

function dots(active) {
  return `<div class="row" style="justify-content:center;gap:6px;">${SLIDES.map((s) => `<span style="width:${s === active ? 20 : 6}px;height:6px;border-radius:999px;background:${s === active ? 'var(--color-brand-secondary)' : 'rgba(148,163,184,0.5)'};transition:width .2s;"></span>`).join('')}</div>`;
}

// Next/Restart is a bottom-right FAB (same component + position as the "+"
// FAB used everywhere else in the app), so it never scrolls out of reach
// without taking over the whole bottom edge. Progress dots stay inline,
// right under the heading, so they're visible without scrolling too.
register('presentation/title', () => ({
  bg: 'var(--color-brand-primary)',
  bodyClass: 'centered',
  fabHtml: Fab({ route: 'presentation/two-companies', label: '→' }),
  body: `
    <p class="t-label-sec" style="color:rgba(255,255,255,0.6);">CONSTRUCTION &amp; DESIGN BUSINESS MANAGER</p>
    <p class="t-display" style="color:#fff;">One owner. Two businesses. One simple app.</p>
    <p class="t-body" style="color:rgba(255,255,255,0.8);">Android app for managing Construction and Design projects, staff, materials, rentals and money — kept completely separate, always clear.</p>
    <p class="t-caption-sec" style="color:rgba(255,255,255,0.5);">Prepared for approval · demonstration data shown throughout</p>
    ${dots('title')}
  `,
}));

register('presentation/two-companies', () => ({
  fabHtml: Fab({ route: 'presentation/construction', label: '→' }),
  body: `
    <p class="t-display m0">Two businesses, always kept separate</p>
    ${dots('two-companies')}
    <div class="card elevated">
      <div class="badge-sq" style="background:var(--color-brand-primary);color:#fff;">C</div>
      <p class="t-title m0">Construction</p>
      <p class="t-caption-sec m0">• Projects, customers, employees</p>
      <p class="t-caption-sec m0">• Daily wages &amp; piece-rate work</p>
      <p class="t-caption-sec m0">• Materials, rentals, fund transfers</p>
    </div>
    <div class="card elevated">
      <div class="badge-sq" style="background:var(--color-accent-secondary-bg);color:var(--color-brand-secondary);">D</div>
      <p class="t-title m0">Design</p>
      <p class="t-caption-sec m0">• Separate projects &amp; customers</p>
      <p class="t-caption-sec m0">• Visual stage timeline</p>
      <p class="t-caption-sec m0">• Salaries &amp; project expenses</p>
    </div>
    <p class="t-body-emphasis m0" style="color:var(--color-brand-primary);">No money ever moves between the two companies. A master overview shows both side by side.</p>
  `,
}));

register('presentation/construction', () => ({
  fabHtml: Fab({ route: 'presentation/design', label: '→' }),
  body: `
    <p class="t-display m0">Construction workspace</p>
    ${dots('construction')}
    <p class="t-body-sec m0">• Live financial dashboard</p>
    <p class="t-body-sec m0">• Flexible daily wage / piece-rate pay</p>
    <p class="t-body-sec m0">• Weekly wage settlement with history</p>
    <p class="t-body-sec m0">• Material purchases with full landed cost</p>
    <p class="t-body-sec m0">• Equipment rentals, transferable between sites</p>
    <p class="t-body-sec m0">• Inter-project fund transfer tracking</p>
    <p class="t-caption-sec m0">Scenario: customer → project → daily work → material cost → payment → profitability.</p>
    ${Btn({ label: 'See it live →', route: 'construction/dashboard', style: 'secondary' })}
  `,
}));

register('presentation/design', () => ({
  fabHtml: Fab({ route: 'presentation/safety', label: '→' }),
  body: `
    <p class="t-display m0">Design workspace</p>
    ${dots('design')}
    <p class="t-body-sec m0">• Separate customers &amp; projects</p>
    <p class="t-body-sec m0">• Visual project-stage timeline</p>
    <p class="t-body-sec m0">• Customisable stages per job</p>
    <p class="t-body-sec m0">• Employee salaries &amp; assignments</p>
    <p class="t-body-sec m0">• Customer installments tracked</p>
    <p class="t-body-sec m0">• Expense and profitability reports</p>
    <p class="t-caption-sec m0">Stages: New → Started → Initial Design → Customer Review → Revision → Final Design → Completed.</p>
    ${Btn({ label: 'See it live →', route: 'design/dashboard', style: 'secondary' })}
  `,
}));

register('presentation/safety', () => ({
  bg: 'var(--color-brand-primary)',
  fabHtml: Fab({ route: 'presentation/title', label: '↻' }),
  body: `
    <p class="t-display" style="color:#fff;">Built to be trustworthy with money</p>
    ${dots('safety')}
    <p class="t-body" style="color:rgba(255,255,255,0.85);">• Offline drafts are always marked Pending Sync — never shown as confirmed</p>
    <p class="t-body" style="color:rgba(255,255,255,0.85);">• Original contract values are preserved; only approved variations change totals</p>
    <p class="t-body" style="color:rgba(255,255,255,0.85);">• Personal withdrawals are tracked separately from project cost</p>
    <p class="t-body" style="color:rgba(255,255,255,0.85);">• One owner login — simple by design</p>
    <p class="t-caption-sec" style="color:rgba(255,255,255,0.6);">Ready for customer approval, then Flutter + Firebase development.</p>
  `,
}));
