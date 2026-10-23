import { start } from './router.js?v=3';
import './screens/shared.js?v=3';
import './screens/construction-core.js?v=3';
import './screens/construction-people.js?v=3';
import './screens/construction-finance.js?v=3';
import './screens/design.js?v=3';
import './screens/presentation.js?v=3';

start('#/splash');

// Registering this only makes the prototype installable (PWA "Add to Home
// Screen"); it does not cache data or enable real offline use.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}
