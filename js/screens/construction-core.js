import { register } from '../router.js?v=2';
import { Btn, Field, TextareaField, Chip, KpiCard, ListItem, AppBar, BottomNav, Fab, Tabs, EmptyState, ConfirmationDialog, InfoRow, ProgressBar, esc } from '../components.js?v=2';
import { construction as C, byId, formatINR as fmt } from '../data.js?v=2';

const BACK_DASH = 'construction/dashboard';

/* ============================= DASHBOARD ============================= */
register('construction/dashboard', () => ({
  appBarHtml: AppBar({ type: 'root', title: 'Construction' }),
  bottomNavHtml: BottomNav({ company: 'construction', active: 'dashboard' }),
  bodyClass: 'no-top-pad',
  body: `
    <div class="kpi-row">
      ${KpiCard({ label: 'Active Projects', value: String(C.projects.length), delta: '▲ 1 this month' })}
      ${KpiCard({ label: 'Outstanding', value: fmt(totalOutstanding()), delta: '5 customers' })}
      ${KpiCard({ label: 'Pending Wages', value: fmt(totalPendingWages()), delta: `${C.employees.length} employees` })}
    </div>
    <div class="card elevated">
      <p class="t-title m0">Financial summary</p>
      ${ProgressBar(totalReceived() / totalContract())}
      ${InfoRow('Contract value', fmt(totalContract()))}
      ${InfoRow('Received', fmt(totalReceived()), 'success')}
      ${InfoRow('Outstanding', fmt(totalOutstanding()), 'warning')}
      ${InfoRow('Recorded expenses', fmt(totalCosts()))}
      ${InfoRow('Estimated margin', fmt(totalContract() - totalCosts()), 'success')}
    </div>
    <p class="t-heading m0">Project overview</p>
    <div class="card-list">
      ${C.projects.map((p) => ListItem({
        initials: p.name.slice(0, 2).toUpperCase(), title: p.name,
        subtitle: `${p.status} · due ${p.target}`, trailing: fmt(p.originalContract + p.variations - p.received) + ' due',
        route: `construction/projects/${p.id}/overview`,
      })).join('')}
    </div>
    <p class="t-heading m0">Quick actions</p>
    <div class="pill-row">
      <button class="pill" data-route="construction/projects/new">+ Project</button>
      <button class="pill" data-route="construction/expenses/new">+ Expense</button>
      <button class="pill" data-route="construction/payments/new">+ Payment</button>
      <button class="pill" data-route="construction/assignments/new">+ Assignment</button>
      <button class="pill" data-route="construction/customers">Customers</button>
    </div>
    <p class="t-heading m0">Recent activity</p>
    <div class="card-list">
      ${ListItem({ initials: '₹', title: 'Customer payment received', subtitle: 'Villa Construction, Meppadi · Today', trailing: '+₹2,00,000', route: 'construction/payments' })}
      ${ListItem({ initials: 'M', title: 'Cement & steel purchase', subtitle: 'Residential, Kalpetta · Yesterday', trailing: '-₹84,500', route: 'construction/materials' })}
      ${ListItem({ initials: 'R', title: 'Excavator rental payment', subtitle: 'Commercial, Sulthan Bathery · 2 days ago', trailing: '-₹12,000', route: 'construction/rentals' })}
    </div>
  `,
}));

function totalContract() { return C.projects.reduce((s, p) => s + p.originalContract + p.variations, 0); }
function totalReceived() { return C.projects.reduce((s, p) => s + p.received, 0); }
function totalOutstanding() { return totalContract() - totalReceived(); }
function totalCosts() { return C.projects.reduce((s, p) => s + p.materialsRentalsWages, 0); }
function totalPendingWages() { return C.employees.reduce((s, e) => s + e.pendingWages, 0); }

/* ============================= CUSTOMERS ============================= */
register('construction/customers', () => {
  if (C.customers.length === 0) {
    return {
      appBarHtml: AppBar({ type: 'root', title: 'Customers' }),
      body: EmptyState({ icon: '👤', title: 'No customers yet', body: 'Add a customer to start creating projects and recording payments for them.', btnLabel: 'Add Customer', btnRoute: 'construction/customers/new' }),
    };
  }
  return {
    appBarHtml: AppBar({ type: 'root', title: 'Customers' }),
    fabHtml: Fab({ route: 'construction/customers/new' }),
    bodyClass: 'no-top-pad',
    body: `
      <div class="search-box"><span>🔍</span><input placeholder="Search customers" /></div>
      <div class="card-list">
        ${C.customers.map((c) => {
          const proj = c.projectId ? byId(C.projects, c.projectId) : null;
          const due = proj ? fmt(proj.originalContract + proj.variations - proj.received) + ' due' : '₹0 due';
          return ListItem({ initials: c.initials, title: c.name, subtitle: `${proj ? proj.name : 'No active project'} · ${due}`, route: `construction/customers/${c.id}` });
        }).join('')}
      </div>
    `,
  };
});

register('construction/customers/new', () => customerForm(null));
register('construction/customers/:id/edit', ({ id }) => customerForm(byId(C.customers, id)));
function customerForm(c) {
  return {
    appBarHtml: AppBar({ type: 'detail', title: c ? 'Edit Customer' : 'Add Customer', back: 'construction/customers' }),
    bodyClass: 'no-top-pad',
    body: `
      ${Field({ label: 'Customer name', value: c ? c.name : '', helper: 'Required', placeholder: 'e.g. Abdul Rahman' })}
      ${Field({ label: 'Phone number', value: c ? c.phone : '', helper: 'Used for call & WhatsApp updates' })}
      ${Field({ label: 'Email (optional)', value: c ? c.email : '' })}
      ${TextareaField({ label: 'Address / notes', value: c ? c.address : '' })}
      ${Btn({ label: 'Save Customer', route: 'construction/customer-saved' })}
    `,
  };
}

register('construction/customer-saved', () => ({
  bg: 'transparent',
  body: ConfirmationDialog({ title: 'Customer Saved', body: 'The customer has been saved and is ready to be linked to a project.', doneRoute: 'construction/customers' }),
}));

register('construction/customers/:id', ({ id }) => {
  const c = byId(C.customers, id);
  if (!c) return { body: '<p>Not found</p>' };
  const proj = c.projectId ? byId(C.projects, c.projectId) : null;
  return {
    appBarHtml: AppBar({ type: 'detail', title: c.name, back: 'construction/customers' }),
    bodyClass: 'no-top-pad',
    body: `
      <div class="card elevated" style="flex-direction:row;align-items:center;gap:16px;">
        <span class="badge-sq" style="border-radius:999px;background:var(--color-brand-primary);color:#fff;">${c.initials}</span>
        <span><p class="t-title m0">${c.name}</p><p class="t-caption-sec" style="margin:2px 0 0;">${c.phone}${c.email ? ' · ' + c.email : ''}</p></span>
      </div>
      ${proj ? `
        <p class="t-label-sec m0">Outstanding balance</p>
        <div class="card">
          <p class="t-body-emphasis m0" style="color:var(--color-status-warning);font:var(--text-body-emphasis)">${fmt(proj.originalContract + proj.variations - proj.received)} due of ${fmt(proj.originalContract + proj.variations)} contracted</p>
        </div>
        <p class="t-label-sec m0">Projects</p>
        <div class="card-list">
          ${ListItem({ initials: proj.name.slice(0, 2).toUpperCase(), title: proj.name, subtitle: `${proj.status} · started ${proj.start}`, route: `construction/projects/${proj.id}/overview` })}
        </div>
        <p class="t-label-sec m0">Recent payments</p>
        <div class="card-list">
          ${C.payments.filter((p) => p.projectId === proj.id).slice(0, 3).map((p) => `
            <div class="list-item"><span class="main"><span class="title">${p.date}</span></span><span class="trailing" style="display:flex;align-items:center;gap:8px;">${fmt(p.amount)} ${Chip('Success', 'success')}</span></div>
          `).join('')}
        </div>
      ` : `<div class="card"><p class="t-body-sec m0">No project linked to this customer yet.</p></div>`}
      ${Btn({ label: 'Edit Customer', route: `construction/customers/${c.id}/edit`, style: 'outline' })}
    `,
  };
});

/* ============================= PROJECTS LIST ============================= */
register('construction/projects', () => {
  if (C.projects.length === 0) {
    return {
      appBarHtml: AppBar({ type: 'root', title: 'Projects' }),
      body: EmptyState({ icon: '+', title: 'No projects yet', body: 'Create your first construction project to start tracking work, materials, rentals and payments.', btnLabel: 'Create Project', btnRoute: 'construction/projects/new' }),
    };
  }
  return {
    appBarHtml: AppBar({ type: 'root', title: 'Projects' }),
    fabHtml: Fab({ route: 'construction/projects/new' }),
    bodyClass: 'no-top-pad',
    body: `
      <div class="search-box"><span>🔍</span><input placeholder="Search projects or location" /></div>
      <div class="pill-row" data-toggle-group>
        <button class="pill active" data-toggle>All</button>
        <button class="pill" data-toggle>Active</button>
        <button class="pill" data-toggle>Completed</button>
      </div>
      ${C.projects.map((p) => `
        <button class="card elevated" style="width:100%;border:none;text-align:left;cursor:pointer;" data-route="construction/projects/${p.id}/overview">
          <div class="row between">
            <span><p class="t-title m0">${p.name}</p><p class="t-caption-sec" style="margin:2px 0 0;">${byId(C.customers, p.customerId)?.name || ''} · started ${p.start}</p></span>
            ${Chip(p.status, p.statusTone)}
          </div>
          ${ProgressBar(p.progress, true)}
          <p class="t-body-sec m0">${fmt(p.originalContract + p.variations)} contracted · ${fmt(p.originalContract + p.variations - p.received)} due</p>
        </button>
      `).join('')}
    `,
  };
});

register('construction/projects/new', () => projectForm(null));
register('construction/projects/:id/edit', ({ id }) => projectForm(byId(C.projects, id)));
function projectForm(p) {
  return {
    appBarHtml: AppBar({ type: 'detail', title: p ? 'Edit Project' : 'Create Project', back: 'construction/projects' }),
    bodyClass: 'no-top-pad',
    body: `
      ${Field({ label: 'Project name', value: p ? p.name : '', helper: 'Required' })}
      ${Field({ label: 'Location', value: p ? p.location : '' })}
      ${Field({ label: 'Customer', value: p ? byId(C.customers, p.customerId)?.name : '', helper: 'Tap to search existing customers' })}
      <div class="field-row">
        ${Field({ label: 'Start date', value: p ? p.start : '', helper: '📅' })}
        ${Field({ label: 'Target date', value: p ? p.target : '', helper: '📅' })}
      </div>
      ${Field({ label: 'Agreed contract value (₹)', value: p ? p.originalContract.toLocaleString('en-IN') : '', helper: 'Original contract amount — locked after approval' })}
      ${TextareaField({ label: 'Notes (optional)', value: '' })}
      ${Btn({ label: 'Save Project', route: 'construction/project-saved' })}
    `,
  };
}

register('construction/project-saved', () => ({
  bg: 'transparent',
  body: ConfirmationDialog({ title: 'Project Saved', body: 'Villa Construction — Meppadi has been created and is ready for assignments.', doneRoute: 'construction/projects/p1/overview' }),
}));

/* ============================= PROJECT DETAIL (tabs) ============================= */
const TAB_DEFS = [
  { key: 'overview', label: 'Overview' },
  { key: 'employees', label: 'Employees' },
  { key: 'materials', label: 'Materials' },
  { key: 'rentals', label: 'Rentals' },
  { key: 'payments', label: 'Payments' },
];

for (const tab of TAB_DEFS) {
  register(`construction/projects/:id/${tab.key}`, ({ id }) => projectDetail(id, tab.key));
}

function projectDetail(id, activeTab) {
  const p = byId(C.projects, id);
  if (!p) return { body: '<p>Not found</p>' };
  const tabsHtml = Tabs(TAB_DEFS, activeTab, (key) => `construction/projects/${id}/${key}`);
  let content = '';
  if (activeTab === 'overview') {
    content = `
      <div class="card">
        <p class="t-title m0">Financial summary</p>
        ${InfoRow('Original contract', fmt(p.originalContract))}
        ${InfoRow('Approved variations', '+' + fmt(p.variations), 'success')}
        ${InfoRow('Revised contract value', fmt(p.originalContract + p.variations))}
        ${InfoRow('Received', fmt(p.received), 'success')}
        ${InfoRow('Outstanding', fmt(p.originalContract + p.variations - p.received), 'warning')}
        ${InfoRow('Materials + rentals + wages', fmt(p.materialsRentalsWages))}
        ${InfoRow('Estimated margin', fmt(p.originalContract + p.variations - p.materialsRentalsWages), 'success')}
      </div>
      ${Btn({ label: 'Edit Project', route: `construction/projects/${id}/edit`, style: 'outline' })}
      <p class="t-label-sec m0">Assigned employees</p>
      <div class="card-list">
        ${C.employees.slice(0, 2).map((e) => ListItem({ initials: e.initials, title: e.name, subtitle: e.defaultDailyWage ? `${e.role} · daily wage` : `${e.role}`, trailing: '' }))
          .join('')}
      </div>
      <p class="t-label-sec m0">Additional work</p>
      <div class="card">
        ${C.variations.filter((v) => v.projectId === id).map((v) => `
          <div class="row between"><span class="t-body m0">${v.description}</span><span class="t-body-emphasis" style="color:var(--color-status-success)">+${fmt(v.amount)}</span></div>
        `).join('') || '<p class="t-body-sec m0">No variations recorded.</p>'}
        ${Btn({ label: 'Manage Variations', route: `construction/variations?project=${id}`, style: 'outline' })}
      </div>
    `;
  } else if (activeTab === 'employees') {
    content = `<div class="card-list">${C.employees.map((e) => ListItem({ initials: e.initials, title: e.name, subtitle: e.defaultDailyWage ? `${e.role} · daily wage · ${fmt(e.defaultDailyWage)}/day` : `${e.role} · ${fmt(e.defaultPieceRate)}/${e.pieceUnit}`, trailing: fmt(e.pendingWages), route: `construction/employees/${e.id}` })).join('')}</div>`;
  } else if (activeTab === 'materials') {
    const rows = C.materials.filter((m) => m.projectId === id);
    content = `
      <div class="card-list">${rows.map((m) => `
        <div class="list-item"><span class="main"><span class="title">${m.item}</span><span class="subtitle">${m.qty}</span></span><span class="trailing" style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">${fmt(m.total)}${Chip(m.status, m.statusTone)}</span></div>
      `).join('') || '<p class="t-body-sec" style="padding:16px;">No materials recorded for this project yet.</p>'}</div>
      ${Btn({ label: 'View all material purchases', route: 'construction/materials', style: 'outline' })}
    `;
  } else if (activeTab === 'rentals') {
    const rows = C.rentals.filter((r) => r.projectId === id);
    content = `
      <div class="card-list">${rows.map((r) => `
        <div class="list-item"><span class="main"><span class="title">${r.equipment}</span><span class="subtitle">${r.supplier} · ${fmt(r.dailyRate)}/day</span></span><span class="trailing">${fmt(r.total)}</span></div>
      `).join('') || '<p class="t-body-sec" style="padding:16px;">No equipment rented for this project yet.</p>'}</div>
      ${Btn({ label: 'View all rentals', route: 'construction/rentals', style: 'outline' })}
    `;
  } else if (activeTab === 'payments') {
    const rows = C.payments.filter((pay) => pay.projectId === id);
    const received = rows.reduce((s, r) => s + r.amount, 0);
    content = `
      <div class="card"><p class="t-body-emphasis m0" style="color:var(--color-status-success)">${fmt(received)} received of ${fmt(p.originalContract + p.variations)}</p></div>
      <div class="card-list">${rows.map((pay) => `
        <div class="list-item"><span class="main"><span class="title">${pay.date}</span><span class="subtitle">${pay.method}</span></span><span class="trailing" style="color:var(--color-status-success)">${fmt(pay.amount)}</span></div>
      `).join('')}</div>
      ${Btn({ label: 'Add Payment', route: `construction/payments/new?project=${id}` })}
    `;
  }
  return {
    appBarHtml: AppBar({ type: 'detail', title: p.name.split(' — ')[0], back: 'construction/projects' }),
    bodyClass: 'no-top-pad',
    body: `${tabsHtml}${content}`,
  };
}
