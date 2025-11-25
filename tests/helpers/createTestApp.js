import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const ROOT_DIR = path.dirname(fileURLToPath(new URL('../../main.js', import.meta.url)));
const MAIN_PATH = path.join(ROOT_DIR, 'main.js');

const BASE_HTML = `
<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <title>Tesbihat Test Host</title>
    <meta name="theme-color" content="#556b2f" />
    <link rel="manifest" href="manifest.webmanifest" />
  </head>
  <body>
    <div class="app"></div>
  </body>
</html>
`;

function stubMatchMedia(window) {
  if (typeof window.matchMedia === 'function') {
    return;
  }
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false;
    },
  });
}

export function createTestApp() {
  const dom = new JSDOM(BASE_HTML, {
    url: 'https://tesbihat.local/',
    pretendToBeVisual: true,
    runScripts: 'dangerously',
  });

  const { window } = dom;
  stubMatchMedia(window);

  // Prevent scroll related helpers from crashing in JSDOM.
  window.HTMLElement.prototype.scrollIntoView = function scrollIntoView() {};

  window.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Avoid executing DOMContentLoaded handlers while testing pure helpers.
  const { document } = window;
  const originalAddEventListener = document.addEventListener.bind(document);
  document.addEventListener = function addEventListener(type, listener, options) {
    if (type === 'DOMContentLoaded') {
      return;
    }
    return originalAddEventListener(type, listener, options);
  };

  const scriptContent = readFileSync(MAIN_PATH, 'utf8');
  const instrumentedScript = `${scriptContent}\n;window.__TEST_STATE__ = typeof state !== 'undefined' ? state : undefined;`;
  window.eval(instrumentedScript);

  return {
    window,
    cleanup() {
      dom.window.close();
    },
  };
}
