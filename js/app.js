import { start } from './router.js';
import './screens/shared.js';
import './screens/construction-core.js';
import './screens/construction-people.js';
import './screens/construction-finance.js';
import './screens/design.js';
import './screens/presentation.js';

start('#/splash');

// Registering this only makes the prototype installable (PWA "Add to Home
// Screen"); it does not cache data or enable real offline use.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}
