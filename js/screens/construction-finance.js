import { register } from '../router.js?v=2';
import { Btn, Field, TextareaField, Chip, ListItem, AppBar, BottomNav, Fab, InfoRow, ProgressBar, Banner, ConfirmationDialog } from '../components.js?v=2';
import { construction as C, byId, formatINR as fmt } from '../data.js?v=2';

/* ============================= MATERIALS ============================= */
register('construction/materials', () => ({
  appBarHtml: AppBar({ type: 'root', title: 'Materials' }),
  bottomNavHtml: BottomNav({ company: 'construction', active: 'finances' }),
  fabHtml: Fab({ route: 'construction/materials/new' }),
  bodyClass: 'no-top-pad',
  body: C.materials.map((m) => `
    <div class="card">
      <div class="row between">
        <span class="t-body-emphasis" style="flex:1;">${m.item}</span>
        ${Chip(m.status, m.statusTone)}
      </div>
      <div class="row between"><span class="t-caption-sec">${byId(C.projects, m.projectId)?.name || ''} · ${m.qty}</span><span class="t-body-emphasis">${fmt(m.total)}</span></div>
    </div>
  `).join(''),
}));

register('construction/materials/new', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Add Purchase', back: 'construction/materials' }),
  bodyClass: 'no-top-pad',
  body: `
    ${Field({ label: 'Supplier', value: 'Wayanad Building Materials', helper: 'Tap to search suppliers' })}
    ${Field({ label: 'Material name', value: 'Cement (OPC 53)' })}
    <div class="field-row">${Field({ label: 'Quantity', value: '120' })}${Field({ label: 'Unit', value: 'Bags' })}</div>
    ${Field({ label: 'Unit price (₹)', value: '420', helper: '120 × ₹420 = ₹50,400' })}
    ${Field({ label: 'Transportation charge (₹)', value: '2,500' })}
    ${Field({ label: 'Loading & unloading (₹)', value: '1,600' })}
    <div class="card">${InfoRow('Total purchase cost', fmt(54500))}</div>
    ${Field({ label: 'Project allocation', value: 'Villa Construction — Meppadi' })}
    ${Field({ label: 'Payment status', value: 'Unpaid', helper: 'Tap to mark as paid' })}
    ${Btn({ label: 'Save Purchase', route: 'construction/purchase-saved' })}
  `,
}));
register('construction/purchase-saved', () => ({ bg: 'transparent', body: ConfirmationDialog({ title: 'Purchase Saved', body: 'The material purchase has been recorded and allocated to the project.', doneRoute: 'construction/materials' }) }));

/* ============================= RENTALS ============================= */
register('construction/rentals', () => ({
  appBarHtml: AppBar({ type: 'root', title: 'Rentals' }),
  bottomNavHtml: BottomNav({ company: 'construction', active: 'finances' }),
  fabHtml: Fab({ route: 'construction/rentals/new' }),
  bodyClass: 'no-top-pad',
  body: `
    <div class="pill-row" data-toggle-group>
      <button class="pill active" data-toggle>Active</button>
      <button class="pill" data-toggle>Completed</button>
    </div>
    ${C.rentals.map((r) => `
      <button class="card" style="width:100%;border:none;text-align:left;cursor:pointer;" data-route="construction/rentals/${r.id}">
        <p class="t-body-emphasis m0">${r.equipment}</p>
        <p class="t-caption-sec m0">${r.supplier} · ${byId(C.projects, r.projectId)?.name || ''}</p>
        <p class="t-caption-sec m0">Since ${r.start} · ${r.days} days · ${fmt(r.dailyRate)}/day</p>
        <div class="row between"><span class="t-body-sec">${fmt(r.total)} total</span><span class="t-body-emphasis" style="color:${r.paid >= r.total ? 'var(--color-status-success)' : 'var(--color-status-warning)'}">${r.paid >= r.total ? 'Fully paid' : fmt(r.total - r.paid) + ' due'}</span></div>
      </button>
    `).join('')}
  `,
}));

register('construction/rentals/new', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Add Rental', back: 'construction/rentals' }),
  bodyClass: 'no-top-pad',
  body: `
    ${Field({ label: 'Equipment', value: 'JCB Excavator 3DX' })}
    ${Field({ label: 'Rental supplier', value: 'Wayanad Earthmovers' })}
    <div class="field-row">${Field({ label: 'Daily rate (₹)', value: '2,800' })}${Field({ label: 'Billing unit', value: 'Per day' })}</div>
    ${Field({ label: 'Pickup date', value: '28 Sep 2026', helper: '📅' })}
    ${Field({ label: 'Expected return date', value: '12 Oct 2026', helper: '📅' })}
    ${Field({ label: 'Assign to project', value: 'Villa Construction — Meppadi' })}
    ${Btn({ label: 'Start Rental', route: 'construction/rental-saved' })}
  `,
}));
register('construction/rental-saved', () => ({ bg: 'transparent', body: ConfirmationDialog({ title: 'Rental Started', body: 'The equipment rental has been recorded and assigned to the project.', doneRoute: 'construction/rentals' }) }));

register('construction/rentals/:id', ({ id }) => {
  const r = byId(C.rentals, id);
  if (!r) return { body: '<p>Not found</p>' };
  return {
    appBarHtml: AppBar({ type: 'detail', title: r.equipment, back: 'construction/rentals' }),
    bodyClass: 'no-top-pad',
    body: `
      <div class="card elevated">
        <div class="row between"><span class="t-title m0">${r.equipment}</span>${Chip(r.status, r.statusTone)}</div>
        <p class="t-caption-sec m0">${r.supplier} · ${byId(C.projects, r.projectId)?.name || ''}</p>
      </div>
      <p class="t-label-sec m0">Rental details</p>
      <div class="card">
        ${InfoRow('Rental start', r.start)}
        ${InfoRow('Expected return', r.expectedReturn)}
        ${InfoRow('Actual return', r.actualReturn || 'Not yet returned')}
        ${InfoRow('Daily rate', fmt(r.dailyRate) + '/day')}
        ${InfoRow('Chargeable days so far', r.days + ' days')}
        ${InfoRow('Calculated amount', fmt(r.total))}
        ${InfoRow('Amount paid', fmt(r.paid), 'success')}
        ${InfoRow('Pending balance', fmt(r.total - r.paid), 'warning')}
      </div>
      ${r.usage.length ? `
        <p class="t-label-sec m0">Usage by project</p>
        <div class="card">${r.usage.map((u) => InfoRow(`${u.project} · ${u.from} – ${u.to}${u.transferred ? ' (transferred)' : ''}`, fmt(u.amount))).join('')}</div>
      ` : ''}
      <div class="btn-row">
        ${Btn({ label: 'Transfer Project', route: `construction/rentals/${r.id}`, style: 'outline', full: true })}
        ${Btn({ label: 'Mark Returned', route: `construction/rentals/${r.id}`, style: 'secondary', full: true })}
      </div>
      ${Btn({ label: 'Record Rental Payment', route: 'construction/payment-recorded' })}
    `,
  };
});

/* ============================= GENERAL EXPENSES ============================= */
register('construction/expenses/new', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Add Expense', back: 'construction/dashboard' }),
  bodyClass: 'no-top-pad',
  body: `
    ${Field({ label: 'Category', value: 'Transportation', helper: 'Transport · Travel · Food · General purchase · Misc' })}
    ${Field({ label: 'Amount (₹)', value: '9,000' })}
    ${Field({ label: 'Date', value: '10 Oct 2026', helper: '📅' })}
    <p class="t-label-sec m0">Allocation method</p>
    <div class="pill-row" data-toggle-group>
      <button class="pill" data-toggle>One project</button>
      <button class="pill active" data-toggle>Split equally</button>
      <button class="pill" data-toggle>By %</button>
      <button class="pill" data-toggle>Manual</button>
      <button class="pill" data-toggle>Overhead</button>
    </div>
    <div class="card">
      <p class="t-body-emphasis m0">Allocation preview</p>
      ${C.projects.map((p) => InfoRow(p.name, fmt(9000 / C.projects.length))).join('')}
      <hr class="divider" />
      ${InfoRow('Total company cash outflow', fmt(9000), 'success')}
    </div>
    ${Btn({ label: 'Confirm Split & Save', route: 'construction/expense-saved' })}
  `,
}));
register('construction/expense-saved', () => ({ bg: 'transparent', body: ConfirmationDialog({ title: 'Expense Saved', body: 'The expense has been split and recorded across the selected projects.', doneRoute: 'construction/dashboard' }) }));

/* ============================= CUSTOMER PAYMENTS ============================= */
register('construction/payments', () => {
  const p = byId(C.projects, 'p1');
  return {
    appBarHtml: AppBar({ type: 'detail', title: 'Customer Payments', back: 'construction/dashboard' }),
    bodyClass: 'no-top-pad',
    body: `
      <div class="card">
        <p class="t-title m0">${p.name}</p>
        ${ProgressBar(p.received / (p.originalContract + p.variations))}
        ${InfoRow('Project value', fmt(p.originalContract + p.variations))}
        ${InfoRow('Received', fmt(p.received), 'success')}
        ${InfoRow('Outstanding', fmt(p.originalContract + p.variations - p.received), 'warning')}
      </div>
      <p class="t-label-sec m0">Installment history</p>
      <div class="card-list">
        ${C.payments.filter((pay) => pay.projectId === 'p1').map((pay) => `
          <div class="list-item"><span class="main"><span class="title">${pay.date}</span><span class="subtitle">${pay.method}</span></span><span class="trailing" style="color:var(--color-status-success)">${fmt(pay.amount)}</span></div>
        `).join('')}
      </div>
      ${Btn({ label: 'Add Payment', route: 'construction/payments/new' })}
    `,
  };
});

register('construction/payments/new', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Add Payment', back: 'construction/payments' }),
  bodyClass: 'no-top-pad',
  body: `
    ${Field({ label: 'Project', value: 'Villa Construction — Meppadi' })}
    ${Field({ label: 'Amount received (₹)', value: '2,00,000' })}
    ${Field({ label: 'Date', value: '10 Oct 2026', helper: '📅' })}
    ${Field({ label: 'Payment method', value: 'Bank transfer', helper: 'Cash · Bank transfer · UPI · Cheque' })}
    ${Field({ label: 'Reference / notes', value: 'NEFT — receipt attached' })}
    <div class="card" style="border:1px solid var(--color-status-warning);">
      <p class="t-caption-sec m0">This is a financial confirmation step — requires connectivity. Draft entries made offline are saved as Pending Sync until confirmed.</p>
    </div>
    ${Btn({ label: 'Confirm Payment Received', route: 'construction/payment-recorded' })}
  `,
}));
register('construction/payment-recorded', () => ({ bg: 'transparent', body: ConfirmationDialog({ title: 'Payment Recorded', body: '₹2,00,000 received for Villa Construction — Meppadi. Outstanding balance updated.', doneRoute: 'construction/payments' }) }));

/* ============================= VARIATION ORDERS ============================= */
register('construction/variations', () => {
  const p = byId(C.projects, 'p1');
  return {
    appBarHtml: AppBar({ type: 'detail', title: 'Variation Orders', back: 'construction/dashboard' }),
    bodyClass: 'no-top-pad',
    body: `
      <div class="card">
        <p class="t-title m0">${p.name}</p>
        ${InfoRow('Original contract', fmt(p.originalContract))}
        ${InfoRow('Approved additions', '+' + fmt(p.variations), 'success')}
        ${InfoRow('Revised contract value', fmt(p.originalContract + p.variations))}
      </div>
      <p class="t-label-sec m0">Revision history</p>
      ${C.variations.map((v) => `
        <div class="card tight">
          <div class="row between"><span class="t-body-emphasis" style="flex:1;">${v.description}</span>${Chip(v.status, v.statusTone)}</div>
          <p class="t-caption-sec m0">${v.date}</p>
          <div class="row between"><span></span><span class="t-body-emphasis" style="color:var(--color-status-success)">+${fmt(v.amount)}</span></div>
        </div>
      `).join('')}
      <p class="t-label-sec m0">Add additional work</p>
      ${Field({ label: 'Description', value: 'Additional retaining wall — site requested' })}
      ${Field({ label: 'Additional amount (₹)', value: '85,000' })}
      ${Field({ label: 'Approval status', value: 'Pending', helper: 'Draft · Pending · Approved · Rejected' })}
      ${Btn({ label: 'Save Variation', route: 'construction/variation-saved' })}
    `,
  };
});
register('construction/variation-saved', () => ({ bg: 'transparent', body: ConfirmationDialog({ title: 'Variation Saved', body: 'The additional work has been recorded and is pending approval.', doneRoute: 'construction/variations' }) }));

/* ============================= FUND MANAGEMENT ============================= */
register('construction/funds/transfer', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Fund Transfer', back: 'construction/funds/list' }),
  bodyClass: 'no-top-pad',
  body: `
    <div class="card" style="border:1px solid var(--color-status-warning);">
      <p class="t-caption-sec m0">This moves cash between construction projects only. It is not project income or an extra expense — it never crosses into the Design company.</p>
    </div>
    ${Field({ label: 'Source project (funds coming from)', value: 'Villa Construction — Meppadi', helper: 'Has available customer receipts' })}
    ${Field({ label: 'Destination project (funds used by)', value: 'Residential — Kalpetta' })}
    ${Field({ label: 'Transfer amount (₹)', value: '30,000' })}
    ${Field({ label: 'Date', value: '10 Oct 2026', helper: '📅' })}
    ${Field({ label: 'Reason', value: 'Urgent cement payment before price increase' })}
    ${Btn({ label: 'Record Transfer', route: 'construction/funds/list' })}
  `,
}));

register('construction/funds/list', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Fund Transfers', back: 'construction/dashboard' }),
  fabHtml: Fab({ route: 'construction/funds/transfer' }),
  bodyClass: 'no-top-pad',
  body: `
    ${C.fundTransfers.map((f) => `
      <div class="card">
        <p class="t-body-emphasis m0">${f.from} → ${f.to}</p>
        <p class="t-caption-sec m0">${f.date}</p>
        ${InfoRow('Transferred', fmt(f.amount))}
        ${InfoRow('Returned so far', fmt(f.returned), 'success')}
        ${InfoRow('Outstanding repayment', f.outstanding ? fmt(f.outstanding) : '₹0 — fully returned', f.outstanding ? 'warning' : 'success')}
        ${Btn({ label: 'Record Repayment', route: 'construction/funds/list', style: 'secondary' })}
      </div>
    `).join('')}
    <p class="t-label-sec m0">Personal withdrawals</p>
    <div class="card">
      ${C.withdrawals.map((w) => InfoRow(`${w.date}`, fmt(w.amount))).join('')}
      ${Btn({ label: 'New Withdrawal', route: 'construction/funds/withdrawal', style: 'outline' })}
    </div>
  `,
}));

register('construction/funds/withdrawal', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Personal Withdrawal', back: 'construction/funds/list' }),
  bodyClass: 'no-top-pad',
  body: `
    <div class="card"><p class="t-caption-sec m0">Recorded as an owner draw — never counted as a project expense. Keep it separate from construction costs.</p></div>
    ${Field({ label: 'Amount (₹)', value: '25,000' })}
    ${Field({ label: 'Date', value: '10 Oct 2026', helper: '📅' })}
    ${Field({ label: 'Source project (optional)', value: '', helper: 'Leave blank if drawn from general company cash' })}
    ${Field({ label: 'Note', value: 'Personal expense — not project related' })}
    ${Btn({ label: 'Record Withdrawal', route: 'construction/funds/list' })}
    <p class="t-label-sec m0">Withdrawal history</p>
    <div class="card-list">
      ${C.withdrawals.map((w) => `<div class="list-item"><span class="main"><span class="title">${w.date}</span><span class="subtitle">${w.repaid ? 'Repaid ' + w.repaidDate : 'Not yet repaid'}</span></span><span class="trailing">${fmt(w.amount)}</span></div>`).join('')}
    </div>
  `,
}));

/* ============================= REPORTS ============================= */
register('construction/reports', () => ({
  appBarHtml: AppBar({ type: 'root', title: 'Reports' }),
  bottomNavHtml: BottomNav({ company: 'construction', active: 'finances' }),
  bodyClass: 'no-top-pad',
  body: `
    <div class="card-list">
      ${ListItem({ initials: '▤', title: 'Project profitability', subtitle: 'Revenue, cost and margin by project', route: 'construction/reports/profitability' })}
      ${ListItem({ initials: '▤', title: 'Project expense breakdown', subtitle: 'Labour · materials · rentals · overhead', route: 'construction/reports' })}
      ${ListItem({ initials: '▤', title: 'Employee wage report', subtitle: 'Earnings, payments and pending balances', route: 'construction/wages/settlement' })}
      ${ListItem({ initials: '▤', title: 'Customer outstanding report', subtitle: 'Who owes what, by project', route: 'construction/payments' })}
      ${ListItem({ initials: '▤', title: 'Rental expense report', subtitle: 'Spend and dues by equipment & supplier', route: 'construction/rentals' })}
      ${ListItem({ initials: '▤', title: 'Material purchase report', subtitle: 'Spend by supplier and project', route: 'construction/materials' })}
      ${ListItem({ initials: '▤', title: 'Fund transfer report', subtitle: 'Inter-project funding and repayment status', route: 'construction/funds/list' })}
      ${ListItem({ initials: '▤', title: 'General expense report', subtitle: 'Overhead vs project-allocated spend', route: 'construction/expenses/new' })}
    </div>
  `,
}));

register('construction/reports/profitability', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Profitability', back: 'construction/reports' }),
  bodyClass: 'no-top-pad',
  body: `
    <div class="pill-row">
      <span class="pill">📅 Last 90 days</span>
      <span class="pill">All projects</span>
    </div>
    <div class="card">
      <p class="t-title m0">Estimated margin by project</p>
      ${C.projects.map((p) => {
        const margin = p.originalContract + p.variations - p.materialsRentalsWages;
        const pct = Math.max(0.05, margin / (p.originalContract + p.variations));
        return `<p class="t-caption-sec m0">${p.name} — ${Math.round(pct * 100)}% margin</p>${ProgressBar(pct, true)}`;
      }).join('')}
    </div>
    <p class="t-label-sec m0">Report rows</p>
    <div class="card-list">
      ${C.projects.map((p) => `
        <div style="padding:8px 16px;">
          <p class="t-body-emphasis m0">${p.name}</p>
          <div class="row between"><span class="t-caption-sec">Revenue ${fmt(p.originalContract + p.variations)} · Cost ${fmt(p.materialsRentalsWages)}</span><span class="t-body-emphasis" style="color:var(--color-status-success)">+${fmt(p.originalContract + p.variations - p.materialsRentalsWages)}</span></div>
        </div>
      `).join('')}
    </div>
    ${Btn({ label: 'Export as PDF', route: 'construction/reports/profitability', style: 'outline' })}
  `,
}));
