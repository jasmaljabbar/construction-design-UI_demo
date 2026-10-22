// Sample data — realistic Indian construction/design business, demonstration only.
// No backend. Mutations here are in-memory and reset on page reload.

export function formatINR(n) {
  const neg = n < 0;
  n = Math.abs(Math.round(n));
  const s = n.toString();
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3;
  return (neg ? '-' : '') + '₹' + grouped;
}

export const state = {
  theme: 'light',
  currentCompany: null, // 'construction' | 'design'
  online: true,
};

export const construction = {
  customers: [
    { id: 'c1', initials: 'AR', name: 'Abdul Rahman', phone: '+91 98470 12345', email: 'abdul.rahman@email.com', address: 'Near Meppadi town, Wayanad', projectId: 'p1' },
    { id: 'c2', initials: 'PN', name: 'Prakash Nair', phone: '+91 94470 88221', email: 'prakash.nair@email.com', address: 'Kalpetta, Wayanad', projectId: 'p2' },
    { id: 'c3', initials: 'SB', name: 'Sulthan Traders Pvt Ltd', phone: '+91 80860 44110', email: 'accounts@sulthantraders.in', address: 'Sulthan Bathery, Wayanad', projectId: 'p3' },
    { id: 'c4', initials: 'KM', name: 'Kunjumon M.', phone: '+91 90480 33210', email: '', address: 'Mananthavady, Wayanad', projectId: null },
  ],
  projects: [
    {
      id: 'p1', name: 'Villa Construction — Meppadi', location: 'Meppadi, Wayanad', customerId: 'c1',
      status: 'On Track', statusTone: 'success', start: '02 Aug 2026', target: '15 Dec 2026',
      originalContract: 2860000, variations: 140000, received: 2080000, materialsRentalsWages: 1940000,
      progress: 0.68,
    },
    {
      id: 'p2', name: 'Residential — Kalpetta', location: 'Kalpetta, Wayanad', customerId: 'c2',
      status: 'Materials Pending', statusTone: 'warning', start: '20 Sep 2026', target: '02 Jan 2027',
      originalContract: 1450000, variations: 0, received: 1040000, materialsRentalsWages: 620000,
      progress: 0.72,
    },
    {
      id: 'p3', name: 'Commercial Building — Sulthan Bathery', location: 'Sulthan Bathery, Wayanad', customerId: 'c3',
      status: 'Delayed', statusTone: 'error', start: '05 Jun 2026', target: '20 Nov 2026',
      originalContract: 8150000, variations: 0, received: 7640000, materialsRentalsWages: 7430000,
      progress: 0.94,
    },
  ],
  employees: [
    { id: 'e1', initials: 'MA', name: 'Muhammed Ali', role: 'Mason', defaultDailyWage: 850, defaultPieceRate: null, pendingWages: 15300, joined: '14 Mar 2024' },
    { id: 'e2', initials: 'RK', name: 'Rajesh Kumar', role: 'Block work specialist', defaultDailyWage: null, defaultPieceRate: 12, pieceUnit: 'block', pendingWages: 5040, joined: '02 Jan 2025' },
    { id: 'e3', initials: 'AB', name: 'Abdul Rahman K.', role: 'Helper', defaultDailyWage: 600, defaultPieceRate: null, pendingWages: 7200, joined: '19 Jul 2025' },
    { id: 'e4', initials: 'SN', name: 'Suresh Nambiar', role: 'Electrician', defaultDailyWage: 900, defaultPieceRate: null, pendingWages: 3600, joined: '11 Feb 2024' },
  ],
  assignments: [
    { employeeId: 'e1', projectId: 'p1', date: '10 Oct 2026', mode: 'daily', amount: 850 },
    { employeeId: 'e2', projectId: 'p1', date: '10 Oct 2026', mode: 'piece', qty: 35, unit: 'block', rate: 12, amount: 420 },
    { employeeId: 'e3', projectId: 'p1', date: '10 Oct 2026', mode: 'daily', amount: 600 },
  ],
  materials: [
    { id: 'm1', item: 'Cement (OPC 53) & Steel bars', supplier: 'Wayanad Building Materials', projectId: 'p1', qty: '120 bags + 2.4 tonnes', unitPrice: 420, transport: 2500, loading: 1600, total: 84500, status: 'Paid', statusTone: 'success' },
    { id: 'm2', item: 'Red clay bricks', supplier: 'Kalpetta Brick Works', projectId: 'p2', qty: '8,000 nos', total: 56000, status: 'Unpaid', statusTone: 'warning' },
    { id: 'm3', item: 'Sand & aggregate', supplier: 'Sulthan Bathery Quarry', projectId: 'p3', qty: '12 loads', total: 108000, status: 'Paid', statusTone: 'success' },
  ],
  rentals: [
    { id: 'r1', equipment: 'JCB Excavator 3DX', supplier: 'Wayanad Earthmovers', projectId: 'p1', dailyRate: 2800, start: '28 Sep 2026', expectedReturn: '12 Oct 2026', actualReturn: null, days: 13, total: 36400, paid: 24400, status: 'Active', statusTone: 'warning',
      usage: [
        { project: 'Villa Construction', from: '28 Sep', to: '05 Oct', amount: 19600 },
        { project: 'Residential, Kalpetta', from: '06 Oct', to: '10 Oct', amount: 14000, transferred: true },
        { project: 'Villa Construction', from: '11 Oct', to: 'ongoing', amount: 2800 },
      ] },
    { id: 'r2', equipment: 'Concrete Mixer (10/7)', supplier: 'Kalpetta Equipment Rentals', projectId: 'p2', dailyRate: 900, start: '02 Oct 2026', expectedReturn: '11 Oct 2026', actualReturn: '11 Oct 2026', days: 9, total: 8100, paid: 8100, status: 'Completed', statusTone: 'success', usage: [] },
    { id: 'r3', equipment: 'Scaffolding set (500 sq ft)', supplier: 'Sulthan Bathery Scaffolds', projectId: 'p3', dailyRate: 60, start: '15 Aug 2026', expectedReturn: '22 Oct 2026', actualReturn: null, days: 67, total: 4020, paid: 3000, status: 'Active', statusTone: 'warning', usage: [] },
  ],
  expenses: [
    { id: 'x1', category: 'Transportation', amount: 9000, date: '10 Oct 2026', allocation: 'equal', projects: ['p1', 'p2', 'p3'] },
  ],
  payments: [
    { id: 'pay1', projectId: 'p1', date: '10 Oct 2026', method: 'Bank transfer', amount: 200000 },
    { id: 'pay2', projectId: 'p1', date: '22 Sep 2026', method: 'Cash', amount: 300000 },
    { id: 'pay3', projectId: 'p1', date: '05 Sep 2026', method: 'Bank transfer', amount: 500000 },
    { id: 'pay4', projectId: 'p1', date: '02 Aug 2026', method: 'Advance · Bank transfer', amount: 1080000 },
  ],
  variations: [
    { id: 'v1', projectId: 'p1', description: 'Extra bathroom tiling — upgraded finish', amount: 140000, status: 'Approved', statusTone: 'success', date: 'Approved 12 Sep 2026' },
    { id: 'v2', projectId: 'p1', description: 'Additional retaining wall — site requested', amount: 85000, status: 'Pending', statusTone: 'warning', date: 'Pending owner approval' },
  ],
  fundTransfers: [
    { id: 'f1', from: 'Villa Construction', to: 'Residential, Kalpetta', amount: 30000, returned: 10000, outstanding: 20000, date: '10 Oct 2026' },
    { id: 'f2', from: 'Commercial Building', to: 'Villa Construction', amount: 50000, returned: 50000, outstanding: 0, date: '18 Sep 2026' },
  ],
  withdrawals: [
    { id: 'w1', date: '01 Oct 2026', amount: 25000, repaid: false },
    { id: 'w2', date: '15 Aug 2026', amount: 15000, repaid: true, repaidDate: '30 Aug 2026' },
  ],
};

export const design = {
  customers: [
    { id: 'dc1', initials: 'TR', name: 'T.K. Rajendran', phone: '+91 94460 22110', email: 'tk.rajendran@email.com', address: 'Thavinjal, Wayanad', projectId: 'dp1' },
    { id: 'dc2', initials: 'OF', name: 'Greenline Offices Pvt Ltd', phone: '+91 80860 55120', email: 'accounts@greenlineoffices.in', address: 'Kalpetta, Wayanad', projectId: 'dp2' },
    { id: 'dc3', initials: 'BG', name: 'Bindu George', phone: '+91 97450 11980', email: 'bindu.george@email.com', address: 'Vythiri, Wayanad', projectId: 'dp3' },
  ],
  stages: ['New Project', 'Work Started', 'Initial Design', 'Customer Review', 'Revision', 'Final Design', 'Completed'],
  projects: [
    { id: 'dp1', name: 'Residence Interior — Thavinjal', customerId: 'dc1', stageIndex: 3, value: 650000, received: 470000, expenses: 85000, start: '15 Aug 2026' },
    { id: 'dp2', name: 'Office Fit-out — Kalpetta', customerId: 'dc2', stageIndex: 5, value: 920000, received: 920000, expenses: 414000, start: '03 Jun 2026' },
    { id: 'dp3', name: 'Boutique Villa — Vythiri', customerId: 'dc3', stageIndex: 2, value: 410000, received: 270000, expenses: 254000, start: '28 Sep 2026' },
  ],
  employees: [
    { id: 'de1', initials: 'AN', name: 'Anjali Nair', role: 'Interior Designer', salary: 32000, paid: 32000, pending: 0, joined: '01 Apr 2023', assignments: [{ project: 'Office Fit-out — Kalpetta', pct: 60 }] },
    { id: 'de2', initials: 'VK', name: 'Vishnu Kumar', role: 'Junior Architect', salary: 24000, paid: 0, pending: 24000, joined: '01 Feb 2025', assignments: [{ project: 'Office Fit-out — Kalpetta', pct: 60 }, { project: 'Boutique Villa — Vythiri', pct: 40 }] },
    { id: 'de3', initials: 'SP', name: 'Sreeja Pillai', role: 'Site Coordinator', salary: 20000, paid: 20000, pending: 0, joined: '12 Nov 2024', assignments: [] },
  ],
  payments: [
    { id: 'dpay1', projectId: 'dp1', date: '28 Sep 2026', amount: 200000 },
    { id: 'dpay2', projectId: 'dp1', date: '15 Aug 2026', amount: 270000, note: 'advance' },
  ],
  expenses: [
    { id: 'dx1', projectId: 'dp1', label: 'Material samples & mood boards', amount: 22000 },
    { id: 'dx2', projectId: 'dp1', label: 'Site visits & travel', amount: 8500 },
    { id: 'dx3', projectId: 'dp1', label: 'Allocated salary cost', amount: 54500 },
  ],
};

export function byId(arr, id) { return arr.find((x) => x.id === id); }
