import { describe, expect, it } from 'vitest';
import { createTestApp } from './helpers/createTestApp.js';

function mountMinimalDuaUI(window) {
  const { document } = window;
  const card = document.createElement('article');
  const modeToggle = document.createElement('div');
  const predefined = document.createElement('button');
  const personal = document.createElement('button');
  const saved = document.createElement('button');
  modeToggle.append(predefined, personal, saved);

  const title = document.createElement('h2');
  const subtitle = document.createElement('div');
  const body = document.createElement('div');
  const actions = document.createElement('div');
  const newButton = document.createElement('button');
  const okButton = document.createElement('button');
  const resetButton = document.createElement('button');
  actions.append(newButton, okButton, resetButton);
  const favoriteButton = document.createElement('button');

  card.append(modeToggle, title, subtitle, body, actions, favoriteButton);
  document.body.appendChild(card);

  const state = window.__TEST_STATE__;
  state.duaUI = {
    card,
    modeToggle,
    modeButtons: {
      predefined,
      personal,
      saved,
    },
    title,
    subtitle,
    body,
    actions,
    newButton,
    okButton,
    resetButton,
    favoriteButton,
  };

  state.duaSource = 'all';
  state.duas = ['Test dua'];
  state.duaCache = { all: ['Test dua'] };
  state.duaState = {
    sourceId: 'all',
    total: 1,
    remaining: [0],
    current: 0,
    cycles: 0,
  };
  state.duaFavoritesList = [];
  state.duaFavoritesLookup = new Set();
  state.duaFavoritesIndex = 0;
}

describe('saved dua mode availability', () => {
  it('stays accessible when personal dua is disabled and no favorites exist', () => {
    const { window, cleanup } = createTestApp();
    mountMinimalDuaUI(window);
    const state = window.__TEST_STATE__;
    state.personalDuaEnabled = false;
    state.duaMode = 'saved';

    window.refreshDuaUI();

    expect(state.duaMode).toBe('saved');
    expect(state.duaUI.modeToggle.hidden).toBe(false);
    expect(state.duaUI.modeButtons.saved.disabled).toBe(false);
    expect(state.duaUI.body.textContent).toContain('Kaydedilen duanız bulunmuyor');
    cleanup();
  });

  it('does not clear favorites when switching modes', () => {
    const { window, cleanup } = createTestApp();
    mountMinimalDuaUI(window);
    const state = window.__TEST_STATE__;
    state.duaFavoritesList = [{ sourceId: 'all', index: 0 }];
    state.duaFavoritesLookup = new Set(['all:0']);

    state.duaMode = 'saved';
    window.refreshDuaUI();

    state.duaMode = 'predefined';
    window.refreshDuaUI();

    expect(state.duaFavoritesList.length).toBe(1);
    expect(state.duaFavoritesLookup.has('all:0')).toBe(true);
    cleanup();
  });
});
