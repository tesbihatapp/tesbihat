import { describe, expect, it } from 'vitest';
import { createTestApp } from './helpers/createTestApp.js';

describe('shouldAnnotateWord', () => {
  it('accepts names that begin with an uppercase letter', () => {
    const { window, cleanup } = createTestApp();
    expect(window.shouldAnnotateWord('Kuddûs')).toBe(true);
    expect(window.shouldAnnotateWord('Selâm')).toBe(true);
    expect(window.shouldAnnotateWord('Âlim')).toBe(true);
    cleanup();
  });

  it('rejects lowercase or symbol-prefixed words', () => {
    const { window, cleanup } = createTestApp();
    expect(window.shouldAnnotateWord('mutahhir')).toBe(false);
    expect(window.shouldAnnotateWord('selâm')).toBe(false);
    expect(window.shouldAnnotateWord('es-Selam')).toBe(false);
    cleanup();
  });
});

describe('name utilities', () => {
  it('canonicalizeName strips accents and non-letter characters', () => {
    const { window, cleanup } = createTestApp();
    expect(window.canonicalizeName('El-Kuddûs')).toBe('elkuddus');
    expect(window.canonicalizeName("Zü'l-Celâl")).toBe('zulcelal');
    cleanup();
  });

  it('registerNameVariants populates canonical and u-variants', () => {
    const { window, cleanup } = createTestApp();
    const state = window.__TEST_STATE__;
    state.nameLookup = new Map();
    state.nameKeys = new Map();
    state.missingNames = new Set();

    window.registerNameVariants('El-Kuddûs', 'Mukaddes');

    expect(state.nameLookup.get('elkuddus')).toBe('Mukaddes');
    expect(state.nameLookup.get('kuddus')).toBe('Mukaddes');
    expect(state.nameLookup.get('kuddusu')).toBe('Mukaddes');
    expect(state.nameKeys.get('kuddus')).toBe('El-Kuddûs');
    cleanup();
  });

  it('resolveNameMeaning returns entries for extended forms', () => {
    const { window, cleanup } = createTestApp();
    const state = window.__TEST_STATE__;
    state.nameLookup = new Map();
    state.nameKeys = new Map();
    state.missingNames = new Set();
    window.registerNameVariants('Er-Rahmân', 'Merhametlilerin En Merhametlisi');

    expect(window.resolveNameMeaning('Rahmân')).toBe('Merhametlilerin En Merhametlisi');
    expect(window.resolveNameMeaning('Er-Rahmânu')).toBe('Merhametlilerin En Merhametlisi');
    cleanup();
  });
});
