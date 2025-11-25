import { describe, expect, it } from 'vitest';
import { createTestApp } from './helpers/createTestApp.js';

describe('markdown helpers', () => {
  it('normalises translation markers with consistent spacing', () => {
    const { window, cleanup } = createTestApp();
    const input = 'Metin|tercume|\nİçerik|/tercume|Bitiş';
    const normalised = window.normaliseTranslationMarkers(input);
    expect(normalised).toContain('\n\n|tercume|\n\n');
    expect(normalised).toContain('\n\n|/tercume|\n\n');
    cleanup();
  });

  it('injects auto counters only for sizeable repetitions', () => {
    const { window, cleanup } = createTestApp();
    const markdown = [
      '**Subhanallah (33 defa)**',
      'Zikre devam edin.',
      'Diğer zikir (3 defa)',
    ].join('\n');

    const result = window.injectAutoCounters(markdown);
    expect(result).toContain('(counter:33)');
    expect(result).not.toContain('(counter:3)');
    cleanup();
  });

  it('avoids injecting counters when unnecessary', () => {
    const { window, cleanup } = createTestApp();
    const markdown = [
      'Kısa zikir (5 defa)',
      'Tekrar (12 defa)',
      '(counter:12)',
      'Uzun zikir (20 defa)',
      'Araya başka satır girer',
      'Yeni zikir (25 defa)',
    ].join('\n');

    const result = window.injectAutoCounters(markdown);
    const lines = result.split('\n');
    const counter12Count = lines.filter((line) => line.includes('(counter:12)')).length;
    const counter20Count = lines.filter((line) => line.includes('(counter:20)')).length;

    expect(result).not.toContain('(counter:5)');
    expect(counter12Count).toBe(1);
    expect(counter20Count).toBe(1);
    expect(result).toContain('(counter:25)');
    expect(result).toContain('Uzun zikir (20 defa)\n(counter:20)');
    cleanup();
  });
});
