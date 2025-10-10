const COUNTER_STORAGE_KEY = 'tesbihat:counters';
const DUA_STORAGE_KEY = 'tesbihat:duas';
const THEME_STORAGE_KEY = 'tesbihat:theme';
const DUA_SOURCE_STORAGE_KEY = 'tesbihat:dua-source';

const PRAYER_CONFIG = {
  sabah: { label: 'Sabah', markdown: 'sabah.md', supportsDua: true },
  ogle: { label: 'Öğle', markdown: null, supportsDua: false },
  ikindi: { label: 'İkindi', markdown: null, supportsDua: false },
  aksam: { label: 'Akşam', markdown: null, supportsDua: false },
  yatsi: { label: 'Yatsı', markdown: null, supportsDua: false },
};

const DUA_SOURCES = {
  birkirikdilekce: { label: 'Bir Kırık Dilekçe', path: 'BirKirikDilekce.txt' },
};

const state = {
  counters: loadCounters(),
  theme: loadTheme(),
  currentPrayer: 'sabah',
  duaSource: loadSelectedDuaSource(),
  duaCache: {},
  duaState: null,
  duas: [],
};

document.addEventListener('DOMContentLoaded', () => {
  const appRoot = document.querySelector('.app');
  if (!appRoot) {
    return;
  }

  applyTheme(appRoot, state.theme);
  attachThemeToggle(appRoot);
  attachSettingsToggle(appRoot);
  initPrayerTabs(appRoot);
  initDuaSourceSelector(appRoot);

  setActivePrayer(state.currentPrayer);
});

function initPrayerTabs(appRoot) {
  const tabs = Array.from(appRoot.querySelectorAll('.prayer-tab'));
  if (!tabs.length) {
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const prayerId = tab.dataset.prayer;
      if (!prayerId || prayerId === state.currentPrayer) {
        return;
      }
      setActivePrayer(prayerId);
    });
  });
}

function setActivePrayer(prayerId) {
  const config = PRAYER_CONFIG[prayerId];
  const appRoot = document.querySelector('.app');
  const tabs = Array.from(appRoot.querySelectorAll('.prayer-tab'));

  tabs.forEach((tab) => {
    const isActive = tab.dataset.prayer === prayerId;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  state.currentPrayer = config ? prayerId : 'sabah';

  loadPrayerContent(state.currentPrayer);
}

async function loadPrayerContent(prayerId) {
  const content = document.getElementById('content');
  if (!content) {
    return;
  }

  const config = PRAYER_CONFIG[prayerId];
  if (!config) {
    content.innerHTML = `<div class="card">Seçtiğiniz vakit bulunamadı.</div>`;
    return;
  }

  content.innerHTML = `<div class="loading">İçerik yükleniyor…</div>`;

  if (!config.markdown) {
    content.innerHTML = `
      <article class="card">
        <h2>${config.label} Tesbihatı</h2>
        <p>Bu vakte ait içerik yakında eklenecek.</p>
      </article>
    `;
    return;
  }

  try {
    const markdown = await fetchText(config.markdown);
    renderTesbihat(content, markdown);
    setupCounters(content, prayerId);

    if (config.supportsDua) {
      const duas = await loadDuaSourceData(state.duaSource);
      state.duas = duas;
      state.duaState = ensureDuaState(duas.length, state.duaSource);
      setupDuaSection(content, duas, state.duaSource);
    }
  } catch (error) {
    console.error('İçerik yüklenirken hata oluştu.', error);
    content.innerHTML = `
      <article class="card">
        <h2>${config.label} Tesbihatı</h2>
        <p>İçerik yüklenirken bir sorun yaşandı. Lütfen dosyayı yerel bir sunucu üzerinden açmayı deneyin (ör. <code>npx serve</code>).</p>
      </article>
    `;
  }
}

function renderTesbihat(container, markdownText) {
  const normalised = markdownText
    .replace(/\r\n/g, '\n')
    .replace(/\*\*\(counter:(\d+)\)\*\*/g, '(counter:$1)')
    .replace(/\(counter:(\d+)\)/g, (_match, count) => `<span class="counter-placeholder" data-counter-target="${count}"></span>`);

  const html = DOMPurify.sanitize(marked.parse(normalised, { mangle: false, headerIds: false }));
  container.innerHTML = html;
}

function setupCounters(container, prayerId) {
  const counterNodes = Array.from(container.querySelectorAll('.counter-placeholder'));

  counterNodes.forEach((node, index) => {
    const target = Number.parseInt(node.dataset.counterTarget, 10) || 0;
    const counterKey = `${prayerId}-${index + 1}`;
    const savedValue = Number.isFinite(state.counters[counterKey]) ? state.counters[counterKey] : 0;
    state.counters[counterKey] = savedValue;

    const wrapper = document.createElement('article');
    wrapper.className = 'card counter-card';
    wrapper.dataset.counterId = counterKey;

    const headerRow = document.createElement('div');
    headerRow.className = 'counter-header';

    const displayButton = document.createElement('button');
    displayButton.className = 'counter-display';
    displayButton.type = 'button';
    displayButton.textContent = savedValue;
    displayButton.title = 'Sayacı artır';

    headerRow.append(displayButton);

    const progress = document.createElement('div');
    progress.className = 'counter-progress';

    const resetButton = document.createElement('button');
    resetButton.className = 'counter-reset';
    resetButton.type = 'button';
    resetButton.textContent = 'Sıfırla';

    const actions = document.createElement('div');
    actions.className = 'counter-actions';
    actions.append(progress, resetButton);

    wrapper.append(headerRow, actions);

    const parentBlock = node.parentElement;
    if (parentBlock && ['P', 'LI', 'DIV'].includes(parentBlock.tagName)) {
      parentBlock.insertAdjacentElement('afterend', wrapper);
      node.remove();
      if (!parentBlock.textContent.trim()) {
        parentBlock.remove();
      }
    } else {
      node.replaceWith(wrapper);
    }

    let currentValue = savedValue;
    updateCounterUI(wrapper, currentValue, target);

    displayButton.addEventListener('click', () => {
      if (target > 0 && currentValue >= target) {
        return;
      }
      currentValue += 1;
      state.counters[counterKey] = currentValue;
      saveCounters();
      updateCounterUI(wrapper, currentValue, target);
    });

    resetButton.addEventListener('click', () => {
      currentValue = 0;
      state.counters[counterKey] = currentValue;
      saveCounters();
      updateCounterUI(wrapper, currentValue, target);
    });
  });
}

function updateCounterUI(wrapper, value, target) {
  const display = wrapper.querySelector('.counter-display');
  const progress = wrapper.querySelector('.counter-progress');
  const resetButton = wrapper.querySelector('.counter-reset');

  if (display) {
    display.textContent = value;
  }

  if (progress) {
    const formattedValue = formatNumber(value);
    const formattedTarget = formatNumber(target);
    const text = target > 0 ? `${formattedValue} / ${formattedTarget}` : formattedValue;
    progress.textContent = text;
  }

  wrapper.classList.toggle('counter-complete', target > 0 && value >= target);

  if (display) {
    display.disabled = target > 0 && value >= target;
  }

  if (resetButton) {
    resetButton.disabled = value === 0;
  }
}

function setupDuaSection(container, duas, sourceId) {
  if (!duas.length) {
    return;
  }

  const anchor = findAnchorParagraph(container, 'Akabinde namaz duâsı yapılır.');
  if (!anchor) {
    return;
  }

  const card = document.createElement('article');
  card.className = 'card dua-card';

  const header = document.createElement('div');
  header.className = 'dua-header';

  const title = document.createElement('h2');
  title.className = 'dua-title';
  const duaLabel = DUA_SOURCES[sourceId]?.label || 'Bir Kırık Dilekçe';
  title.textContent = duaLabel;

  const subtitle = document.createElement('div');
  subtitle.className = 'dua-subtitle';

  header.append(title, subtitle);

  const body = document.createElement('div');
  body.className = 'dua-body';
  body.setAttribute('aria-live', 'polite');

  const actions = document.createElement('div');
  actions.className = 'dua-actions';

  const newButton = document.createElement('button');
  newButton.className = 'button-pill secondary';
  newButton.type = 'button';
  newButton.textContent = 'Yeni dua getir';

  const okButton = document.createElement('button');
  okButton.className = 'button-pill';
  okButton.type = 'button';
  okButton.textContent = 'Okudum';

  const resetButton = document.createElement('button');
  resetButton.className = 'button-pill secondary';
  resetButton.type = 'button';
  resetButton.textContent = 'Baştan başlat';
  resetButton.hidden = true;

  actions.append(newButton, okButton, resetButton);
  card.append(header, body, actions);
  anchor.after(card);

  renderDuaCard();

  newButton.addEventListener('click', () => {
    if (!state.duaState || state.duaState.remaining.length === 0) {
      return;
    }
    const picked = pickRandomFrom(state.duaState.remaining);
    state.duaState.current = picked;
    saveDuaState();
    renderDuaCard();
  });

  okButton.addEventListener('click', () => {
    if (!state.duaState) {
      return;
    }

    const { current, remaining } = state.duaState;
    if (current === null) {
      return;
    }

    const idx = remaining.indexOf(current);
    if (idx !== -1) {
      remaining.splice(idx, 1);
    }

    if (remaining.length === 0) {
      state.duaState.cycles += 1;
      state.duaState.current = null;
      saveDuaState();
      renderDuaCard();
      return;
    }

    state.duaState.current = pickRandomFrom(remaining);
    saveDuaState();
    renderDuaCard();
  });

  resetButton.addEventListener('click', () => {
    state.duaState = resetDuaState(state.duas.length, sourceId, state.duaState ? state.duaState.cycles : 0);
    state.duaState.current = pickRandomFrom(state.duaState.remaining);
    saveDuaState();
    renderDuaCard();
  });

  function renderDuaCard() {
    updateDuaSubtitle(subtitle);
    updateDuaBody(body);
    updateDuaButtons(newButton, okButton, resetButton);
  }
}

function updateDuaSubtitle(subtitle) {
  if (!subtitle || !state.duaState) {
    return;
  }

  const total = state.duaState.total;
  const remaining = state.duaState.remaining.length;
  const cycles = state.duaState.cycles;

  if (remaining === 0) {
    const times = Math.max(1, cycles);
    subtitle.textContent = `Bir Kırık Dilekçeyi ${formatNumber(times)} kere tamamladınız.`;
    return;
  }

  subtitle.textContent = `Kalan dua: ${formatNumber(remaining)} / ${formatNumber(total)}`;
}

function updateDuaBody(body) {
  if (!body || !state.duaState) {
    return;
  }

  const { current, remaining } = state.duaState;

  if (remaining.length === 0) {
    body.innerHTML = `<p>Tüm duaları tamamladınız. Dilerseniz yeniden başlatabilirsiniz.</p>`;
    return;
  }

  if (current === null) {
    body.innerHTML = `<p>Rastgele bir dua getirmek için "Yeni dua getir" butonuna dokunun.</p>`;
    return;
  }

  const duaText = state.duas[current];
  body.innerHTML = DOMPurify.sanitize(marked.parse(duaText));
}

function updateDuaButtons(newButton, okButton, resetButton) {
  if (!state.duaState) {
    return;
  }

  const remaining = state.duaState.remaining.length;
  const isComplete = remaining === 0;

  newButton.disabled = isComplete;
  okButton.disabled = isComplete || state.duaState.current === null;
  resetButton.hidden = !isComplete;
  resetButton.disabled = !isComplete;
}

function findAnchorParagraph(container, text) {
  const elements = Array.from(container.querySelectorAll('p strong'));
  const match = elements.find((el) => el.textContent.trim().includes(text));
  return match ? match.parentElement : null;
}

async function loadDuaSourceData(sourceId) {
  if (state.duaCache[sourceId]) {
    return state.duaCache[sourceId];
  }

  const config = DUA_SOURCES[sourceId];
  if (!config) {
    return [];
  }

  const raw = await fetchText(config.path);
  const list = sanitiseDuas(raw);
  state.duaCache[sourceId] = list;
  return list;
}

function sanitiseDuas(raw) {
  if (!raw) {
    return [];
  }

  const clean = raw.replace(/\ufeff/g, '');
  return clean
    .split('-split-')
    .map((entry) => entry.trim())
    .map((entry) => entry.replace(/^\d+\.\s*/, ''))
    .filter((entry) => entry.length > 0);
}

function ensureDuaState(total, sourceId) {
  if (!state.duaState || state.duaState.total !== total || state.duaState.sourceId !== sourceId) {
    state.duaState = loadDuaState(total, sourceId);
  }

  if (state.duaState.current === null && state.duaState.remaining.length > 0) {
    state.duaState.current = pickRandomFrom(state.duaState.remaining);
    saveDuaState();
  }

  return state.duaState;
}

function loadCounters() {
  try {
    const raw = localStorage.getItem(COUNTER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn('Sayaçlar yüklenemedi, sıfırlanacak.', error);
    return {};
  }
}

function saveCounters() {
  localStorage.setItem(COUNTER_STORAGE_KEY, JSON.stringify(state.counters));
}

function loadDuaState(total, sourceId) {
  try {
    const raw = localStorage.getItem(DUA_STORAGE_KEY);
    if (!raw) {
      return resetDuaState(total, sourceId, 0);
    }

    const parsed = JSON.parse(raw);
    const remaining = Array.isArray(parsed.remaining) ? parsed.remaining : [];
    const validRemaining = remaining.filter((idx) => typeof idx === 'number' && idx >= 0 && idx < total);

    if (parsed.total !== total || parsed.sourceId !== sourceId || validRemaining.length === 0) {
      return resetDuaState(total, sourceId, Math.max(0, parsed.cycles || 0));
    }

    return {
      remaining: validRemaining,
      cycles: Math.max(0, Math.floor(parsed.cycles || 0)),
      current: typeof parsed.current === 'number' ? parsed.current : null,
      total,
      sourceId,
    };
  } catch (error) {
    console.warn('Dua durumu okunamadı, yeniden başlatılıyor.', error);
    return resetDuaState(total, sourceId, 0);
  }
}

function saveDuaState() {
  if (!state.duaState) {
    return;
  }

  const payload = {
    remaining: state.duaState.remaining,
    cycles: state.duaState.cycles,
    current: state.duaState.current,
    total: state.duaState.total,
    sourceId: state.duaState.sourceId,
  };

  localStorage.setItem(DUA_STORAGE_KEY, JSON.stringify(payload));
}

function resetDuaState(total, sourceId, existingCycles = 0) {
  const remaining = Array.from({ length: total }, (_value, index) => index);
  const base = {
    remaining,
    cycles: Math.max(0, Math.floor(existingCycles)),
    current: null,
    total,
    sourceId,
  };
  state.duaState = base;
  saveDuaState();
  return base;
}

function fetchText(path) {
  if (window.location.protocol === 'file:') {
    console.warn('Dosya protokolü üzerinden fetch yapılmaya çalışılıyor; yerel sunucu kullanılması önerilir.');
  }

  return fetch(path).then((response) => {
    if (!response.ok) {
      throw new Error(`İçerik alınamadı: ${path}`);
    }
    return response.text();
  });
}

function pickRandomFrom(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function formatNumber(value) {
  return new Intl.NumberFormat('tr-TR').format(value);
}

function loadTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
}

function applyTheme(appRoot, theme) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  appRoot.dataset.theme = nextTheme;

  const toggleIcon = appRoot.querySelector('.theme-toggle__icon');
  if (toggleIcon) {
    toggleIcon.textContent = nextTheme === 'dark' ? '🌙' : '☀️';
  }
}

function attachThemeToggle(appRoot) {
  const toggleButton = appRoot.querySelector('.theme-toggle');
  if (!toggleButton) {
    return;
  }

  toggleButton.addEventListener('click', () => {
    const currentTheme = appRoot.dataset.theme === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    state.theme = nextTheme;
    applyTheme(appRoot, nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}

function attachSettingsToggle(appRoot) {
  const toggleButton = appRoot.querySelector('.settings-toggle');
  const panel = appRoot.querySelector('[data-settings]');

  if (!toggleButton || !panel) {
    return;
  }

  toggleButton.addEventListener('click', () => {
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
  });
}

function initDuaSourceSelector(appRoot) {
  const select = appRoot.querySelector('#dua-source');
  if (!select) {
    return;
  }

  select.value = state.duaSource;

  select.addEventListener('change', async (event) => {
    const nextSource = event.target.value;
    if (!DUA_SOURCES[nextSource]) {
      return;
    }

    state.duaSource = nextSource;
    localStorage.setItem(DUA_SOURCE_STORAGE_KEY, nextSource);
    state.duaState = null;

    if (state.currentPrayer === 'sabah') {
      await loadPrayerContent('sabah');
    }
  });
}

function loadSelectedDuaSource() {
  const stored = localStorage.getItem(DUA_SOURCE_STORAGE_KEY);
  if (stored && DUA_SOURCES[stored]) {
    return stored;
  }
  return 'birkirikdilekce';
}
