import { register } from '../router.js?v=2';
import { Btn, Field, AppBar, Banner, Chip } from '../components.js?v=2';

register('splash', () => ({
  bg: 'var(--color-brand-primary)',
  body: `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;text-align:center;">
      <div style="width:72px;height:72px;border-radius:16px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;">
        <span style="font:var(--text-heading);color:#fff;">C&amp;D</span>
      </div>
      <p style="font:var(--text-heading);color:#fff;margin:0;">Construction &amp; Design</p>
      <p style="font:var(--text-body);color:rgba(255,255,255,0.75);margin:0;">Business Manager</p>
      <p style="font:var(--text-caption);color:rgba(255,255,255,0.55);margin:0;">Loading…</p>
    </div>`,
}));

function loginScreen(errorMode) {
  return {
    body: `
      <div style="display:flex;flex-direction:column;align-items:flex-start;width:56px;height:56px;border-radius:12px;background:var(--color-brand-primary);justify-content:center;align-items:center;">
        <span style="font:var(--text-label);color:#fff;">C&amp;D</span>
      </div>
      <div>
        <p class="t-display m0">Welcome back</p>
        <p class="t-body-sec" style="margin:4px 0 0;">Sign in to manage your Construction and Design businesses.</p>
      </div>
      ${errorMode ? Banner('Sign-in failed. Check your email and password and try again.', 'error') : ''}
      ${Field({ label: 'Email', value: 'owner@business.com', helper: 'This device will stay signed in' })}
      ${Field({ label: 'Password', value: errorMode ? '•••••' : '••••••••••', type: 'password', state: errorMode ? 'error' : 'default', helper: errorMode ? 'Incorrect email or password' : 'Minimum 8 characters' })}
      ${Btn({ label: errorMode ? 'Try Again' : 'Sign In', route: errorMode ? 'login' : 'company-picker' })}
      <p class="t-caption-sec t-center" style="margin:0;">Single-owner access. Contact your developer if you need account recovery.</p>
    `,
    bodyClass: '',
  };
}
register('login', () => loginScreen(false));
register('login-error', () => loginScreen(true));

register('company-picker', () => ({
  body: `
    <p class="t-caption-sec m0">Signed in as Owner</p>
    <p class="t-display m0">Choose a workspace</p>
    <button class="card elevated" style="flex-direction:row;align-items:center;gap:16px;cursor:pointer;border:none;width:100%;text-align:left;" data-route="construction/dashboard">
      <span class="badge-sq" style="background:var(--color-brand-primary);color:#fff;">C</span>
      <span style="flex:1;">
        <p class="t-title m0">Construction</p>
        <p class="t-caption-sec" style="margin:2px 0 0;">3 active projects · ₹18,40,000 outstanding</p>
      </span>
      <span class="t-title t-body-sec">→</span>
    </button>
    <button class="card elevated" style="flex-direction:row;align-items:center;gap:16px;cursor:pointer;border:none;width:100%;text-align:left;" data-route="design/dashboard">
      <span class="badge-sq" style="background:var(--color-accent-secondary-bg);color:var(--color-brand-secondary);">D</span>
      <span style="flex:1;">
        <p class="t-title m0">Design</p>
        <p class="t-caption-sec" style="margin:2px 0 0;">3 active projects · ₹3,20,000 outstanding</p>
      </span>
      <span class="t-title t-body-sec">→</span>
    </button>
    ${Btn({ label: 'View Master Overview', route: 'master-overview', style: 'outline' })}
  `,
}));

register('master-overview', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Master Overview', back: 'company-picker' }),
  bodyClass: 'no-top-pad',
  body: `
    <p class="t-caption-sec m0">Figures are shown side by side for reference only. Balances are never combined between companies.</p>
    <p class="t-heading m0" style="color:var(--color-brand-primary);">Construction</p>
    <div class="kpi-row">
      ${require_KpiCardInline('Active Projects', '3')}
      ${require_KpiCardInline('Outstanding', '₹18,40,000')}
    </div>
    ${Btn({ label: 'Open Construction', route: 'construction/dashboard', style: 'outline' })}
    <p class="t-heading m0" style="color:var(--color-brand-secondary);">Design</p>
    <div class="kpi-row">
      ${require_KpiCardInline('Active Projects', '3')}
      ${require_KpiCardInline('Outstanding', '₹3,20,000')}
    </div>
    ${Btn({ label: 'Open Design', route: 'design/dashboard', style: 'outline' })}
  `,
}));
function require_KpiCardInline(label, value) {
  return `<div class="kpi-card"><span class="label">${label}</span><span class="value" style="font:var(--text-numeric-md)">${value}</span></div>`;
}

register('settings', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'Settings', back: 'company-picker' }),
  bodyClass: 'no-top-pad',
  body: `
    <div class="card elevated" style="flex-direction:row;align-items:center;gap:16px;">
      <span class="badge-sq" style="border-radius:999px;background:var(--color-brand-primary);color:#fff;">JJ</span>
      <span><p class="t-title m0">Jasmal Jabbar</p><p class="t-caption-sec" style="margin:2px 0 0;">Owner · Administrator</p></span>
    </div>
    <p class="t-label-sec m0">Company</p>
    <div class="card-list">
      <button class="list-item" data-route="construction/dashboard"><span class="main"><span class="title">Construction — company info</span></span><span class="trailing">›</span></button>
      <button class="list-item" data-route="design/dashboard"><span class="main"><span class="title">Design — company info</span></span><span class="trailing">›</span></button>
    </div>
    <p class="t-label-sec m0">Preferences</p>
    <div class="card-list">
      <div class="list-item"><span class="main"><span class="title">Currency</span></span><span class="trailing">INR (₹)</span></div>
      <div class="list-item"><span class="main"><span class="title">Date format</span></span><span class="trailing">DD/MM/YYYY</span></div>
      <div class="list-item"><span class="main"><span class="title">App theme</span></span><span class="trailing">Light</span></div>
    </div>
    <p class="t-label-sec m0">Data</p>
    <div class="card-list">
      <div class="list-item"><span class="main"><span class="title">Sync status</span></span><span class="trailing">Synced 2 min ago</span></div>
      <div class="list-item"><span class="main"><span class="title">Security</span></span><span class="trailing">PIN + biometric</span></div>
    </div>
    ${Btn({ label: 'Log Out', route: 'login', style: 'destructive' })}
    <p class="t-caption-sec t-center m0">Construction & Design Business Manager · v1.0.0 (MVP)</p>
  `,
}));

register('offline-states', () => ({
  appBarHtml: AppBar({ type: 'detail', title: 'System States', back: 'settings' }),
  bodyClass: 'no-top-pad',
  body: `
    <p class="t-heading m0">Sync &amp; connection states</p>
    ${Banner('Online · All changes saved', 'success')}
    ${Banner('Pending sync · 3 draft entries queued', 'warning')}
    ${Banner('Offline · Working from local data', 'neutral')}
    ${Banner('Sync failed · Tap to retry', 'error')}
    <p class="t-heading m0">Financial action while offline</p>
    <div class="card" style="border:1px solid var(--color-status-warning);">
      <p class="t-title m0">Record Customer Payment</p>
      <p class="t-body-sec m0">You are offline. This payment will be saved as a draft and marked Pending Sync — it will not appear as received until the server confirms it when you are back online.</p>
      ${Chip('Pending Sync', 'warning')}
    </div>
  `,
}));
