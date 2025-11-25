import { describe, expect, it } from 'vitest';
import { createTestApp } from './helpers/createTestApp.js';

describe('translation block helpers', () => {
  it('wraps translation markers into structured blocks', () => {
    const { window, cleanup } = createTestApp();
    const root = window.document.createElement('div');
    root.innerHTML = `
      <p>|tercume|</p>
      <p>Tercüme içeriği</p>
      <p>|/tercume|</p>
    `;

    window.processTranslationBlocks(root);
    const block = root.querySelector('.translation-block');
    expect(block).not.toBeNull();
    expect(block.dataset.translationBlock).toBe('true');
    expect(block.textContent).toContain('Tercüme içeriği');
    expect(block.getAttribute('role')).toBe('group');
    cleanup();
  });

  it('removes stray start markers without end marker', () => {
    const { window, cleanup } = createTestApp();
    const root = window.document.createElement('div');
    root.innerHTML = `
      <p>|tercume|</p>
      <p>Devam eden içerik</p>
    `;

    window.processTranslationBlocks(root);
    expect(root.querySelector('.translation-block')).toBeNull();
    expect(root.textContent).toContain('Devam eden içerik');
    expect(root.textContent).not.toContain('|tercume|');
    cleanup();
  });

  it('toggles translation block visibility based on state', () => {
    const { window, cleanup } = createTestApp();
    const host = window.document.createElement('div');
    const block = window.document.createElement('div');
    block.dataset.translationBlock = 'true';
    host.append(block);

    const state = window.__TEST_STATE__;
    state.appRoot = window.document.querySelector('.app');
    state.showTranslations = false;
    window.applyTranslationVisibility(host);
    expect(block.hidden).toBe(true);
    expect(block.getAttribute('aria-hidden')).toBe('true');
    expect(state.appRoot.dataset.showTranslations).toBe('false');

    state.showTranslations = true;
    window.applyTranslationVisibility(host);
    expect(block.hidden).toBe(false);
    expect(block.getAttribute('aria-hidden')).toBe('false');
    expect(block.classList.contains('translation-block--visible')).toBe(true);
    cleanup();
  });
});
