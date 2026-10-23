import { register } from '../router.js?v=3';
import { Btn, Field, Chip, KpiCard, ListItem, AppBar, BottomNav, Fab, InfoRow, ConfirmationDialog } from '../components.js?v=3';
import { construction as C, byId, formatINR as fmt } from '../data.js?v=3';

/* ============================= EMPLOYEE DIRECTORY ============================= */
register('construction/employees', () => ({
  appBarHtml: AppBar({ type: 'root', title: 'Employees' }),
  bottomNavHtml: BottomNav({ company: 'construction', active: 'employees' }),
  fabHtml: Fab({ route: 'construction/employees/new' }),
  bodyClass: 'no-top-pad',
  body: `
    <div class="kpi-row">
      ${KpiCard({ label: 'Active Employees', value: String(C.employees.length) })}
      ${KpiCard({ label: 'Pending Wages', value: fmt(C.employees.reduce((s, e) => s + e.pendingWages, 0)) })}
    </div>
    <div class="card-list">
      ${C.employees.map((e) => ListItem({
        initials: e.initials, title: e.name,
        subtitle: e.defaultDailyWage ? `${e.role} · daily wage default ${fmt(e.defaultDailyWage)}/day` : `${e.role} · ${fmt(e.defaultPieceRate)}/${e.pieceUnit} default`,
        trailing: `${fmt(e.pendingWages)} pending`, route: `construction/employees/${e.id}`,
      })).join('')}
    </div>
  `,
}));

register('construction/employees/new', () => employeeForm(null));
register('construction/employees/:id/edit', ({ id }) => employeeForm(byId(C.employees, id)));
function employeeForm(e) {
  return {
    appBarHtml: AppBar({ type: 'detail', title: e ? 'Edit Employee' : 'Add Employee', back: 'construction/employees' }),
    bodyClass: 'no-top-pad',
    body: `
      ${Field({ label: 'Full name', value: e ? e.name : '', helper: 'Required' })}
      ${Field({ label: 'Phone number', value: '' })}
      ${Field({ label: 'Role / trade', value: e ? e.role : '' })}
      ${Field({ label: 'Default daily wage (₹)', value: e && e.defaultDailyWage ? e.defaultDailyWage : '', helper: 'Used when assignment is Daily Wage mode' })}
      ${Field({ label: 'Default piece rate (optional)', value: e && e.defaultPieceRate ? e.defaultPieceRate : '', helper: 'e.g. ₹12 per block — can differ by job' })}
      ${Field({ label: 'Weekly pay cycle', value: 'Monday – Sunday' })}
      ${Btn({ label: 'Save Employee', route: 'construction/employee-saved' })}
    `,
  };
}
register('construction/employee-saved', () => ({
  bg: 'transparent',
  body: ConfirmationDialog({ title: 'Employee Saved', body: 'The employee profile has been saved and is ready for daily assignments.', doneRoute: 'construction/employees' }),
}));

register('construction/employees/:id', ({ id }) => {
  const e = byId(C.employees, id);
  if (!e) return { body: '<p>Not found</p>' };
  return {
    appBarHtml: AppBar({ type: 'detail', title: e.name, back: 'construction/employees' }),
    bodyClass: 'no-top-pad',
    body: `
      <div class="card elevated" style="flex-direction:row;align-items:center;gap:16px;">
        <span class="badge-sq" style="border-radius:999px;background:var(--color-brand-primary);color:#fff;">${e.initials}</span>
        <span><p class="t-title m0">${e.name}</p><p class="t-caption-sec" style="margin:2px 0 0;">${e.role} · Active · joined ${e.joined}</p></span>
      </div>
      <p class="t-label-sec m0">Default rates</p>
      <div class="card">
        ${InfoRow('Default daily wage', e.defaultDailyWage ? fmt(e.defaultDailyWage) + ' / day' : 'Not set — assigned per task')}
        ${InfoRow('Default piece rate', e.defaultPieceRate ? fmt(e.defaultPieceRate) + ' / ' + e.pieceUnit : 'Not set — assigned per task')}
        ${InfoRow('Weekly pay preference', 'Monday – Sunday')}
      </div>
      <p class="t-label-sec m0">Pending wages</p>
      <div class="card">${InfoRow('This week', fmt(e.pendingWages), 'warning')}</div>
      <p class="t-label-sec m0">Recent work history</p>
      <div class="card">
        ${InfoRow('Villa Construction — daily wage · 10 Oct', fmt(e.defaultDailyWage || 0))}
        ${InfoRow('Villa Construction — daily wage · 09 Oct', fmt(e.defaultDailyWage || 0))}
      </div>
      ${Btn({ label: 'Record Wage Payment', route: 'construction/wages/settlement' })}
      ${Btn({ label: 'Edit Employee', route: `construction/employees/${e.id}/edit`, style: 'outline' })}
    `,
  };
});

/* ============================= DAILY ASSIGNMENT ============================= */
register('construction/assignments/new', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Daily Work Assignment', back: 'construction/dashboard' }),
  bodyClass: 'no-top-pad',
  body: `
    ${Field({ label: 'Date', value: 'Friday, 10 Oct 2026', helper: '📅 Tap to change' })}
    ${Field({ label: 'Project', value: 'Villa Construction — Meppadi', helper: 'Tap to switch project' })}
    <p class="t-label-sec m0">Employees &amp; payment mode</p>
    ${assignmentRow('MA', 'Muhammed Ali', 'daily', '₹850 for the day · confirmed')}
    ${assignmentRow('RK', 'Rajesh Kumar', 'piece', '35 blocks × ₹12 = ₹420')}
    ${assignmentRow('AB', 'Abdul Rahman K.', 'daily', '₹600 for the day · confirmed')}
    <button class="row" style="background:none;border:none;cursor:pointer;color:var(--color-brand-secondary);font:var(--text-body-emphasis);padding:0;">+ Add another employee</button>
    ${Btn({ label: 'Save Assignments', route: 'construction/wages/settlement' })}
  `,
}));

function assignmentRow(initials, name, mode, detail) {
  return `
  <div class="card tight">
    <div class="row">
      <span class="badge-sq" style="width:36px;height:36px;border-radius:999px;background:var(--color-accent-secondary-bg);color:var(--color-brand-secondary);font:var(--text-label);">${initials}</span>
      <span class="t-body-emphasis" style="flex:1;">${name}</span>
    </div>
    <div class="row" data-toggle-group>
      <button class="pill${mode === 'daily' ? ' active' : ''}" data-toggle>Daily Wage</button>
      <button class="pill${mode === 'piece' ? ' active' : ''}" data-toggle>Piece Rate</button>
    </div>
    <p class="t-caption-sec m0">${detail}</p>
  </div>`;
}

/* ============================= WEEKLY SETTLEMENT ============================= */
register('construction/wages/settlement', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Weekly Settlement', back: 'construction/employees' }),
  bodyClass: 'no-top-pad',
  body: `
    ${Field({ label: 'Week', value: '06 Oct – 12 Oct 2026' })}
    ${settlementCard('MA', 'Muhammed Ali', ['Villa Construction · 5 days daily wage · ₹850/day', 'Residential, Kalpetta · 1 day daily wage · ₹850/day'], 5100, 850, 4250)}
    ${settlementCard('RK', 'Rajesh Kumar', ['Villa Construction · 420 blocks × ₹12', 'No daily-wage days this week'], 5040, 0, 5040)}
  `,
}));
function settlementCard(initials, name, lines, earned, paid, pending) {
  return `
  <div class="card">
    <div class="row">
      <span class="badge-sq" style="width:36px;height:36px;border-radius:999px;background:var(--color-accent-secondary-bg);color:var(--color-brand-secondary);font:var(--text-label);">${initials}</span>
      <span class="t-body-emphasis" style="flex:1;">${name}</span>
    </div>
    ${lines.map((l) => `<p class="t-caption-sec m0">${l}</p>`).join('')}
    <hr class="divider" />
    ${InfoRow('Total earned', fmt(earned))}
    ${InfoRow('Already paid', fmt(paid), 'success')}
    ${InfoRow('Pending balance', fmt(pending), 'warning')}
    ${Btn({ label: 'Record Payment', route: 'construction/payment-recorded', style: 'secondary' })}
  </div>`;
}
