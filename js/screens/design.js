import { register } from '../router.js?v=3';
import { Btn, Field, TextareaField, Chip, KpiCard, ListItem, AppBar, BottomNav, Fab, InfoRow, ProgressBar, ConfirmationDialog, EmptyState } from '../components.js?v=3';
import { design as D, byId, formatINR as fmt } from '../data.js?v=3';

/* ============================= DASHBOARD ============================= */
register('design/dashboard', () => ({
  appBarHtml: AppBar({ type: 'root', title: 'Design' }),
  bottomNavHtml: BottomNav({ company: 'design', active: 'dashboard' }),
  bodyClass: 'no-top-pad',
  body: `
    <div class="kpi-row">
      ${KpiCard({ label: 'Active Projects', value: String(D.projects.length), delta: '2 due this month' })}
      ${KpiCard({ label: 'Outstanding', value: fmt(totalOutstanding()), delta: '3 customers' })}
      ${KpiCard({ label: 'Pending Work', value: '6 tasks', delta: 'across 3 projects' })}
    </div>
    <div class="card elevated">
      <p class="t-title m0">Financial summary</p>
      ${InfoRow('Payments received', fmt(totalReceived()), 'success')}
      ${InfoRow('Outstanding', fmt(totalOutstanding()), 'warning')}
      ${InfoRow('Employee salary expense', fmt(D.employees.reduce((s, e) => s + e.salary, 0)))}
      ${InfoRow('General expenses', fmt(48000))}
      ${InfoRow('Estimated profit', fmt(totalValue() - totalExpenses()), 'success')}
    </div>
    <p class="t-heading m0">Project overview</p>
    <div class="card-list">
      ${D.projects.map((p) => ListItem({
        initials: p.name.slice(0, 2).toUpperCase(), title: p.name,
        subtitle: `Stage: ${D.stages[p.stageIndex]}`, trailing: fmt(p.value - p.received) + ' due',
        route: `design/projects/${p.id}`,
      })).join('')}
    </div>
    <p class="t-heading m0">Quick actions</p>
    <div class="pill-row">
      <button class="pill" data-route="design/projects/new">+ Project</button>
      <button class="pill" data-route="design/payments">+ Expense</button>
      <button class="pill" data-route="design/payments">+ Payment</button>
      <button class="pill" data-route="design/customers">Customers</button>
    </div>
  `,
}));
function totalValue() { return D.projects.reduce((s, p) => s + p.value, 0); }
function totalReceived() { return D.projects.reduce((s, p) => s + p.received, 0); }
function totalOutstanding() { return totalValue() - totalReceived(); }
function totalExpenses() { return D.projects.reduce((s, p) => s + p.expenses, 0) + D.employees.reduce((s, e) => s + e.salary, 0); }

/* ============================= CUSTOMERS ============================= */
register('design/customers', () => ({
  appBarHtml: AppBar({ type: 'root', title: 'Customers' }),
  fabHtml: Fab({ route: 'design/customers/new' }),
  bodyClass: 'no-top-pad',
  body: `<div class="card-list">
    ${D.customers.map((c) => {
      const proj = c.projectId ? byId(D.projects, c.projectId) : null;
      const due = proj ? fmt(proj.value - proj.received) + ' due' : '₹0 due';
      return ListItem({ initials: c.initials, title: c.name, subtitle: `${proj ? proj.name : 'No active project'} · ${due}`, route: `design/customers/${c.id}` });
    }).join('')}
  </div>`,
}));

register('design/customers/new', () => customerForm(null));
function customerForm(c) {
  return {
    appBarHtml: AppBar({ type: 'detail', title: c ? 'Edit Customer' : 'Add Customer', back: 'design/customers' }),
    bodyClass: 'no-top-pad',
    body: `
      ${Field({ label: 'Customer name', value: c ? c.name : '', helper: 'Required' })}
      ${Field({ label: 'Phone number', value: c ? c.phone : '' })}
      ${Field({ label: 'Email (optional)', value: c ? c.email : '' })}
      ${TextareaField({ label: 'Address / notes', value: c ? c.address : '' })}
      ${Btn({ label: 'Save Customer', route: 'design/customer-saved' })}
    `,
  };
}
register('design/customer-saved', () => ({ bg: 'transparent', body: ConfirmationDialog({ title: 'Customer Saved', body: 'The customer has been saved and is ready to be linked to a design project.', doneRoute: 'design/customers' }) }));

register('design/customers/:id', ({ id }) => {
  const c = byId(D.customers, id);
  if (!c) return { body: '<p>Not found</p>' };
  const proj = c.projectId ? byId(D.projects, c.projectId) : null;
  return {
    appBarHtml: AppBar({ type: 'detail', title: c.name, back: 'design/customers' }),
    bodyClass: 'no-top-pad',
    body: `
      <div class="card elevated" style="flex-direction:row;align-items:center;gap:16px;">
        <span class="badge-sq" style="border-radius:999px;background:var(--color-brand-secondary);color:#fff;">${c.initials}</span>
        <span><p class="t-title m0">${c.name}</p><p class="t-caption-sec" style="margin:2px 0 0;">${c.phone}${c.email ? ' · ' + c.email : ''}</p></span>
      </div>
      ${proj ? `
        <p class="t-label-sec m0">Projects</p>
        <div class="card-list">${ListItem({ initials: proj.name.slice(0, 2).toUpperCase(), title: proj.name, subtitle: `Stage: ${D.stages[proj.stageIndex]}`, route: `design/projects/${proj.id}` })}</div>
        <p class="t-label-sec m0">Outstanding</p>
        <div class="card">${InfoRow('Balance due', fmt(proj.value - proj.received), 'warning')}</div>
      ` : `<div class="card"><p class="t-body-sec m0">No project linked yet.</p></div>`}
      ${Btn({ label: 'Edit Customer', route: `design/customers/${c.id}`, style: 'outline' })}
    `,
  };
});

/* ============================= PROJECTS ============================= */
register('design/projects', () => ({
  appBarHtml: AppBar({ type: 'root', title: 'Design Projects' }),
  bottomNavHtml: BottomNav({ company: 'design', active: 'projects' }),
  fabHtml: Fab({ route: 'design/projects/new' }),
  bodyClass: 'no-top-pad',
  body: D.projects.map((p) => `
    <button class="card" style="width:100%;border:none;text-align:left;cursor:pointer;" data-route="design/projects/${p.id}">
      <div class="row between">
        <span><p class="t-body-emphasis m0">${p.name}</p><p class="t-caption-sec" style="margin:2px 0 0;">${byId(D.customers, p.customerId)?.name || ''}</p></span>
        ${Chip(D.stages[p.stageIndex], 'info')}
      </div>
      <p class="t-caption-sec m0">${fmt(p.value)} value · ${p.value === p.received ? 'fully paid' : fmt(p.value - p.received) + ' due'}</p>
    </button>
  `).join(''),
}));

register('design/projects/new', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Create Design Project', back: 'design/projects' }),
  bodyClass: 'no-top-pad',
  body: `
    ${Field({ label: 'Project name', value: '', helper: 'Required', placeholder: 'e.g. Residence Interior — Thavinjal' })}
    ${Field({ label: 'Customer', value: '', helper: 'Tap to search existing customers' })}
    ${Field({ label: 'Brief / description', value: '' })}
    <div class="field-row">${Field({ label: 'Start date', value: '', helper: '📅' })}${Field({ label: 'Agreed value (₹)', value: '' })}</div>
    ${Field({ label: 'Initial stage', value: 'New Project' })}
    ${Btn({ label: 'Save Project', route: 'design/project-saved' })}
  `,
}));
register('design/project-saved', () => ({ bg: 'transparent', body: ConfirmationDialog({ title: 'Project Saved', body: 'The design project has been created at stage New Project.', doneRoute: 'design/projects/dp1' }) }));

register('design/projects/:id', ({ id }) => {
  const p = byId(D.projects, id);
  if (!p) return { body: '<p>Not found</p>' };
  return {
    appBarHtml: AppBar({ type: 'detail', title: p.name.split(' — ')[0], back: 'design/projects' }),
    bodyClass: 'no-top-pad',
    body: `
      <div class="card">
        <p class="t-title m0">${p.name}</p>
        <p class="t-caption-sec m0">${byId(D.customers, p.customerId)?.name || ''} · Started ${p.start}</p>
      </div>
      <p class="t-label-sec m0">Project stage</p>
      <div class="card">
        ${D.stages.map((s, i) => {
          const done = i < p.stageIndex, active = i === p.stageIndex;
          const bg = done ? 'var(--color-status-success)' : active ? 'var(--color-brand-secondary)' : 'var(--color-border-default)';
          const fg = done || active ? '#fff' : 'var(--color-text-secondary)';
          return `
          <div class="row" style="padding:6px 0;">
            <span style="width:24px;height:24px;border-radius:999px;background:${bg};color:${fg};display:flex;align-items:center;justify-content:center;font:var(--text-label);flex-shrink:0;">${done ? '✓' : i + 1}</span>
            <span style="flex:1;font:${active ? 'var(--text-body-emphasis)' : 'var(--text-body)'};color:${active ? 'var(--color-brand-secondary)' : done ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'};">${s}</span>
            ${active ? Chip('Current', 'info') : ''}
          </div>`;
        }).join('')}
      </div>
      ${Btn({ label: 'Update Stage', route: `design/projects/${p.id}/next-stage`, style: 'secondary' })}
      <p class="t-label-sec m0">Financial summary</p>
      <div class="card">
        ${InfoRow('Agreed value', fmt(p.value))}
        ${InfoRow('Received', fmt(p.received), 'success')}
        ${InfoRow('Outstanding', fmt(p.value - p.received), 'warning')}
        ${InfoRow('Expenses allocated', fmt(p.expenses))}
      </div>
    `,
  };
});

register('design/projects/:id/next-stage', ({ id }) => {
  const p = byId(D.projects, id);
  if (p && p.stageIndex < D.stages.length - 1) p.stageIndex += 1;
  return { bg: 'transparent', body: ConfirmationDialog({ title: 'Stage Updated', body: `Now at: ${D.stages[p.stageIndex]}.`, doneRoute: `design/projects/${id}` }) };
});

/* ============================= EMPLOYEES ============================= */
register('design/employees', () => ({
  appBarHtml: AppBar({ type: 'root', title: 'Employees' }),
  bottomNavHtml: BottomNav({ company: 'design', active: 'employees' }),
  fabHtml: Fab({ route: 'design/employees/new' }),
  bodyClass: 'no-top-pad',
  body: `<div class="card-list">
    ${D.employees.map((e) => ListItem({ initials: e.initials, title: e.name, subtitle: `${e.role} · ${fmt(e.salary)}/month`, trailing: `${fmt(e.pending)} pending`, route: `design/employees/${e.id}` })).join('')}
  </div>`,
}));

register('design/employees/new', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Add Employee', back: 'design/employees' }),
  bodyClass: 'no-top-pad',
  body: `
    ${Field({ label: 'Full name', value: '', helper: 'Required' })}
    ${Field({ label: 'Phone number', value: '' })}
    ${Field({ label: 'Role', value: '' })}
    ${Field({ label: 'Monthly salary (₹)', value: '' })}
    ${Field({ label: 'Pay cycle', value: '1st of every month' })}
    ${Btn({ label: 'Save Employee', route: 'design/employee-saved' })}
  `,
}));
register('design/employee-saved', () => ({ bg: 'transparent', body: ConfirmationDialog({ title: 'Employee Saved', body: 'The employee profile has been saved.', doneRoute: 'design/employees' }) }));

register('design/employees/:id', ({ id }) => {
  const e = byId(D.employees, id);
  if (!e) return { body: '<p>Not found</p>' };
  return {
    appBarHtml: AppBar({ type: 'detail', title: e.name, back: 'design/employees' }),
    bodyClass: 'no-top-pad',
    body: `
      <div class="card elevated" style="flex-direction:row;align-items:center;gap:16px;">
        <span class="badge-sq" style="border-radius:999px;background:var(--color-brand-primary);color:#fff;">${e.initials}</span>
        <span><p class="t-title m0">${e.name}</p><p class="t-caption-sec" style="margin:2px 0 0;">${e.role} · Active · joined ${e.joined}</p></span>
      </div>
      <p class="t-label-sec m0">Salary details</p>
      <div class="card">
        ${InfoRow('Monthly salary', fmt(e.salary))}
        ${InfoRow('Pay cycle', '1st of every month')}
        ${InfoRow('This month', e.pending ? fmt(e.pending) + ' pending' : 'Paid', e.pending ? 'warning' : 'success')}
      </div>
      <p class="t-label-sec m0">Project assignments</p>
      <div class="card-list">
        ${e.assignments.map((a) => `<div class="list-item"><span class="main"><span class="title">${a.project}</span><span class="subtitle">Allocated ${a.pct}% of time</span></span><span class="trailing">›</span></div>`).join('') || '<p class="t-body-sec" style="padding:16px;">No active assignments.</p>'}
      </div>
      ${Btn({ label: 'Record Salary Payment', route: 'design/salary-settlement' })}
    `,
  };
});

register('design/salary-settlement', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Salary Settlement', back: 'design/employees' }),
  bodyClass: 'no-top-pad',
  body: `
    ${Field({ label: 'Month', value: 'October 2026' })}
    ${D.employees.map((e) => `
      <div class="card">
        <p class="t-body-emphasis m0">${e.name}</p>
        <p class="t-caption-sec m0">${e.role}</p>
        <hr class="divider" />
        ${InfoRow('Monthly salary', fmt(e.salary))}
        ${InfoRow('Already paid', fmt(e.paid), 'success')}
        ${InfoRow('Pending balance', fmt(e.pending), 'warning')}
        ${Btn({ label: 'Record Payment', route: 'design/salary-paid', style: 'secondary' })}
      </div>
    `).join('')}
  `,
}));
register('design/salary-paid', () => ({ bg: 'transparent', body: ConfirmationDialog({ title: 'Salary Payment Recorded', body: 'The salary payment has been recorded for this employee.', doneRoute: 'design/employees' }) }));

/* ============================= PAYMENTS & EXPENSES ============================= */
register('design/payments', () => {
  const p = byId(D.projects, 'dp1');
  return {
    appBarHtml: AppBar({ type: 'detail', title: 'Payments & Expenses', back: 'design/dashboard' }),
    bodyClass: 'no-top-pad',
    body: `
      <div class="card">
        <p class="t-title m0">${p.name}</p>
        ${InfoRow('Agreed value', fmt(p.value))}
        ${InfoRow('Received', fmt(p.received), 'success')}
        ${InfoRow('Outstanding', fmt(p.value - p.received), 'warning')}
      </div>
      <p class="t-label-sec m0">Customer installments</p>
      <div class="card">
        ${D.payments.filter((pay) => pay.projectId === 'dp1').map((pay) => InfoRow(pay.date + (pay.note ? ` (${pay.note})` : ''), fmt(pay.amount), 'success')).join('')}
        ${Btn({ label: 'Add Installment', route: 'design/payment-saved', style: 'secondary' })}
      </div>
      <p class="t-label-sec m0">Project expenses</p>
      <div class="card">
        ${D.expenses.filter((x) => x.projectId === 'dp1').map((x) => InfoRow(x.label, fmt(x.amount))).join('')}
        ${Btn({ label: 'Add Expense', route: 'design/expense-saved', style: 'secondary' })}
      </div>
    `,
  };
});
register('design/payment-saved', () => ({ bg: 'transparent', body: ConfirmationDialog({ title: 'Installment Recorded', body: 'The customer installment has been recorded.', doneRoute: 'design/payments' }) }));
register('design/expense-saved', () => ({ bg: 'transparent', body: ConfirmationDialog({ title: 'Expense Recorded', body: 'The project expense has been recorded.', doneRoute: 'design/payments' }) }));

/* ============================= REPORTS ============================= */
register('design/reports', () => ({
  appBarHtml: AppBar({ type: 'root', title: 'Reports' }),
  bottomNavHtml: BottomNav({ company: 'design', active: 'finances' }),
  bodyClass: 'no-top-pad',
  body: `<div class="card-list">
    ${ListItem({ initials: '▤', title: 'Project performance', subtitle: 'Stage progress and timelines', route: 'design/projects' })}
    ${ListItem({ initials: '▤', title: 'Payments report', subtitle: 'Installments received vs outstanding', route: 'design/payments' })}
    ${ListItem({ initials: '▤', title: 'Expenses report', subtitle: 'Salary + general + project costs', route: 'design/payments' })}
    ${ListItem({ initials: '▤', title: 'Outstanding balances', subtitle: 'By customer and project', route: 'design/customers' })}
    ${ListItem({ initials: '▤', title: 'Estimated profitability', subtitle: 'Revenue minus cost by project', route: 'design/reports/profitability' })}
  </div>`,
}));

register('design/reports/profitability', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Profitability', back: 'design/reports' }),
  bodyClass: 'no-top-pad',
  body: `
    <div class="pill-row"><span class="pill">📅 This quarter</span><span class="pill">All projects</span></div>
    <div class="card">
      <p class="t-title m0">Estimated margin by project</p>
      ${D.projects.map((p) => {
        const margin = p.value - p.expenses;
        const pct = Math.max(0.05, margin / p.value);
        return `<p class="t-caption-sec m0">${p.name} — ${Math.round(pct * 100)}% margin</p>${ProgressBar(pct, true)}`;
      }).join('')}
    </div>
    <p class="t-label-sec m0">Report rows</p>
    <div class="card-list">
      ${D.projects.map((p) => `
        <div style="padding:8px 16px;">
          <p class="t-body-emphasis m0">${p.name}</p>
          <div class="row between"><span class="t-caption-sec">Revenue ${fmt(p.value)} · Cost ${fmt(p.expenses)}</span><span class="t-body-emphasis" style="color:var(--color-status-success)">+${fmt(p.value - p.expenses)}</span></div>
        </div>
      `).join('')}
    </div>
    ${Btn({ label: 'Export as PDF', route: 'design/reports/profitability', style: 'outline' })}
  `,
}));
