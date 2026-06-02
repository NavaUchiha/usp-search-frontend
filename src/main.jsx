import React from 'react';
import ReactDOM from 'react-dom/client';
import SearchComponent from './components/SearchComponent.jsx';

// Default mount point — host page provides <div id="usp-search-root">.
// To mount elsewhere, call window.USPSearch.mount(elementOrId) manually.
const DEFAULT_MOUNT_ID = 'usp-search-root';

function mount(target = DEFAULT_MOUNT_ID) {
  const el =
    typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) {
    console.warn(
      `[usp-search] Mount target ${
        typeof target === 'string' ? `#${target}` : ''
      } not found — call window.USPSearch.mount(el) once the element exists.`
    );
    return null;
  }
  const root = ReactDOM.createRoot(el);
  root.render(<SearchComponent />);
  return root;
}

// Auto-mount once the DOM is ready, if the default container exists.
function autoMount() {
  const el = document.getElementById(DEFAULT_MOUNT_ID);
  if (el) mount(el);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoMount);
} else {
  autoMount();
}

// Expose for explicit mounting / remounting.
if (typeof window !== 'undefined') {
  window.USPSearch = { mount };
}

export { mount };
