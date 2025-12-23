(() => {
  const META_PATH = 'assets/quran/meta.json';
  const MAP_PATH = 'assets/quran/surah_page_map.json';
  const PAGES_BASE_PATH = 'assets/quran/pages';
  const FAVORITES_KEY = 'tesbihat:quran:favorites';
  const LAST_PAGE_KEY = 'tesbihat:quran:last-page';

  const DEFAULT_META = {
    totalPages: 605,
    minPage: 0,
    maxPage: 604,
    naming: '3-digit',
    format: 'png',
  };

  const state = {
    meta: { ...DEFAULT_META },
    surahs: [],
    page: 0,
    favorites: new Set(),
    ui: null,
    prefetchCache: new Map(),
    mapLoaded: false,
  };

  const getStorage = () => {
    try {
      return window.localStorage;
    } catch (_error) {
      return null;
    }
  };

  const storage = getStorage();

  const setStoredValue = (key, value) => {
    if (!storage) {
      return;
    }
    if (window.SyncStorage && typeof window.SyncStorage.setSyncItem === 'function') {
      window.SyncStorage.setSyncItem(key, value);
      return;
    }
    storage.setItem(key, JSON.stringify(value));
  };

  const getStoredValue = (key) => {
    if (!storage) {
      return null;
    }
    const raw = storage.getItem(key);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  };

  const clampPage = (value) => {
    if (!Number.isFinite(value)) {
      return null;
    }
    const min = state.meta.minPage;
    const max = state.meta.maxPage;
    return Math.min(Math.max(value, min), max);
  };

  const padPage = (page) => String(page).padStart(3, '0');

  const buildPageSrc = (page, padded = true) => {
    const name = padded ? padPage(page) : String(page);
    return `${PAGES_BASE_PATH}/${name}.${state.meta.format}`;
  };

  const loadMeta = async () => {
    try {
      const response = await fetch(META_PATH);
      if (!response.ok) {
        return;
      }
      const meta = await response.json();
      if (!meta || typeof meta !== 'object') {
        return;
      }
      state.meta = {
        ...state.meta,
        totalPages: Number.isFinite(meta.totalPages) ? meta.totalPages : state.meta.totalPages,
        minPage: Number.isFinite(meta.minPage) ? meta.minPage : state.meta.minPage,
        maxPage: Number.isFinite(meta.maxPage) ? meta.maxPage : state.meta.maxPage,
        naming: typeof meta.naming === 'string' ? meta.naming : state.meta.naming,
        format: typeof meta.format === 'string' ? meta.format : state.meta.format,
      };
    } catch (_error) {
      // fallback to defaults
    }
  };

  const loadSurahMap = async () => {
    if (state.mapLoaded) {
      return;
    }
    state.mapLoaded = true;
    try {
      const response = await fetch(MAP_PATH);
      if (!response.ok) {
        return;
      }
      const map = await response.json();
      if (map && Array.isArray(map.surahs)) {
        state.surahs = map.surahs.filter((item) => item && Number.isFinite(item.page));
      }
    } catch (_error) {
      state.surahs = [];
    }
  };

  const loadFavorites = () => {
    const stored = getStoredValue(FAVORITES_KEY);
    if (!Array.isArray(stored)) {
      state.favorites = new Set();
      return;
    }
    const filtered = stored
      .map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isFinite(value) && value >= state.meta.minPage && value <= state.meta.maxPage);
    state.favorites = new Set(filtered);
  };

  const persistFavorites = () => {
    const values = Array.from(state.favorites.values()).sort((a, b) => a - b);
    setStoredValue(FAVORITES_KEY, values);
  };

  const loadStoredPage = () => {
    const stored = getStoredValue(LAST_PAGE_KEY);
    const page = Number.isFinite(stored) ? stored : Number.parseInt(stored, 10);
    return clampPage(page);
  };

  const persistPage = (page) => {
    setStoredValue(LAST_PAGE_KEY, page);
  };

  const readPageFromUrl = () => {
    try {
      const url = new URL(window.location.href);
      const value = url.searchParams.get('p');
      if (!value) {
        return null;
      }
      const parsed = Number.parseInt(value, 10);
      return clampPage(parsed);
    } catch (_error) {
      return null;
    }
  };

  const updateUrl = (page) => {
    if (!window.history || typeof window.history.replaceState !== 'function') {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('p', String(page));
    if (!url.pathname.includes('/quran')) {
      const base = url.pathname.endsWith('/')
        ? url.pathname
        : url.pathname.replace(/\/[^/]*$/, '/');
      url.pathname = `${base}quran`;
    }
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const setStatus = (message, options = {}) => {
    const status = state.ui?.status;
    if (!status) {
      return;
    }
    if (!message) {
      status.hidden = true;
      status.textContent = '';
      return;
    }
    status.hidden = false;
    status.innerHTML = '';
    const text = document.createElement('span');
    text.textContent = message;
    status.append(text);
    if (options.retry) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'button-pill secondary';
      button.textContent = 'Tekrar dene';
      button.addEventListener('click', () => {
        setPage(state.page);
      });
      status.append(button);
    }
  };

  const prefetchPage = (page) => {
    if (!Number.isFinite(page)) {
      return;
    }
    const clamped = clampPage(page);
    if (clamped === null) {
      return;
    }
    if (state.prefetchCache.has(clamped)) {
      return;
    }
    const image = new Image();
    let triedFallback = false;
    const primary = buildPageSrc(clamped, true);
    const fallback = buildPageSrc(clamped, false);
    image.onload = () => {
      state.prefetchCache.set(clamped, image);
    };
    image.onerror = () => {
      if (!triedFallback && fallback !== primary) {
        triedFallback = true;
        image.src = fallback;
      }
    };
    image.src = primary;
  };

  const prunePrefetch = (page) => {
    const keep = new Set([page - 1, page + 1]);
    Array.from(state.prefetchCache.keys()).forEach((key) => {
      if (!keep.has(key)) {
        state.prefetchCache.delete(key);
      }
    });
  };

  const updateFavoritesUI = () => {
    const ui = state.ui;
    if (!ui) {
      return;
    }
    const isFavorite = state.favorites.has(state.page);
    if (ui.favoriteButton) {
      ui.favoriteButton.textContent = isFavorite ? '★' : '☆';
      ui.favoriteButton.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
      ui.favoriteButton.setAttribute('aria-label', isFavorite ? 'Favoriden çıkar' : 'Favoriye ekle');
    }
    if (ui.favoritesList) {
      const items = Array.from(state.favorites.values()).sort((a, b) => a - b);
      ui.favoritesList.innerHTML = '';
      if (!items.length) {
        const empty = document.createElement('p');
        empty.className = 'quran-empty';
        empty.textContent = 'Henüz favori eklenmedi.';
        ui.favoritesList.append(empty);
      } else {
        items.forEach((page) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'quran-chip';
          if (page === state.page) {
            button.classList.add('is-active');
          }
          button.textContent = String(page);
          button.addEventListener('click', () => {
            setPage(page);
          });
          ui.favoritesList.append(button);
        });
      }
    }
  };

  const updateToolbarUI = () => {
    const ui = state.ui;
    if (!ui) {
      return;
    }
    if (ui.pageInput) {
      ui.pageInput.value = String(state.page);
    }
    if (ui.pageMeta) {
      ui.pageMeta.textContent = `Sayfa ${state.page} / ${state.meta.maxPage}`;
    }
    if (ui.prevButton) {
      ui.prevButton.disabled = state.page <= state.meta.minPage;
    }
    if (ui.nextButton) {
      ui.nextButton.disabled = state.page >= state.meta.maxPage;
    }
  };

  const renderPageImage = (page) => {
    const ui = state.ui;
    if (!ui || !ui.image) {
      return;
    }
    setStatus('Sayfa yükleniyor...');
    const img = ui.image;
    const primary = buildPageSrc(page, true);
    const fallback = buildPageSrc(page, false);
    let triedFallback = false;

    img.onload = () => {
      setStatus('');
    };

    img.onerror = () => {
      if (!triedFallback && fallback !== primary) {
        triedFallback = true;
        img.src = fallback;
        return;
      }
      setStatus('Sayfa yüklenemedi.', { retry: true });
    };

    img.src = primary;
  };

  const setPage = (page) => {
    const clamped = clampPage(page);
    if (clamped === null) {
      setStatus(`Sayfa numarası ${state.meta.minPage}-${state.meta.maxPage} aralığında olmalı.`);
      return;
    }
    state.page = clamped;
    updateToolbarUI();
    updateFavoritesUI();
    renderPageImage(clamped);
    persistPage(clamped);
    updateUrl(clamped);
    prunePrefetch(clamped);
    prefetchPage(clamped - 1);
    prefetchPage(clamped + 1);
  };

  const updateSurahResults = (query) => {
    const ui = state.ui;
    if (!ui || !ui.surahResults) {
      return;
    }
    const normalized = (query || '').trim().toLowerCase();
    ui.surahResults.innerHTML = '';

    const matches = state.surahs.filter((surah) => {
      const idMatch = String(surah.id).includes(normalized);
      const nameTr = (surah.name_tr || '').toLowerCase();
      const nameAr = (surah.name_ar || '').toLowerCase();
      return normalized.length === 0 || idMatch || nameTr.includes(normalized) || nameAr.includes(normalized);
    }).slice(0, 20);

    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'quran-empty';
      empty.textContent = 'Eşleşen sure bulunamadı.';
      ui.surahResults.append(empty);
      return;
    }

    matches.forEach((surah) => {
      const row = document.createElement('div');
      row.className = 'quran-surah-item';
      const label = document.createElement('span');
      const nameTr = surah.name_tr ? `${surah.name_tr}` : '';
      const nameAr = surah.name_ar ? ` (${surah.name_ar})` : '';
      label.textContent = `${surah.id}. ${nameTr}${nameAr}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `Sayfa ${surah.page}`;
      button.addEventListener('click', () => {
        setPage(Number.parseInt(surah.page, 10));
      });
      row.append(label, button);
      ui.surahResults.append(row);
    });
  };

  const renderQuranPage = async (container) => {
    if (!container) {
      return;
    }

    await loadMeta();
    loadFavorites();

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'quran-page card';
    wrapper.innerHTML = `
      <header class="quran-toolbar">
        <div class="quran-toolbar__group">
          <button type="button" class="button-pill secondary" data-quran-prev aria-label="Önceki sayfa">←</button>
          <button type="button" class="button-pill secondary" data-quran-next aria-label="Sonraki sayfa">→</button>
        </div>
        <div class="quran-toolbar__goto">
          <label class="sr-only" for="quran-page-input">Sayfa</label>
          <input id="quran-page-input" class="quran-page-input" type="number" inputmode="numeric" min="${state.meta.minPage}" max="${state.meta.maxPage}" />
          <button type="button" class="button-pill" data-quran-go>Git</button>
        </div>
        <button type="button" class="button-pill secondary" data-quran-favorite aria-pressed="false">☆</button>
      </header>
      <p class="quran-page-meta" data-quran-meta></p>
      <div class="quran-view">
        <div class="quran-image-shell">
          <img class="quran-image" alt="Kur'an sayfası" loading="lazy" decoding="async">
          <div class="quran-image-status" data-quran-status hidden></div>
        </div>
      </div>
      <div class="quran-controls">
        <button type="button" class="button-pill secondary" data-quran-favorites-toggle>Favoriler</button>
        <button type="button" class="button-pill secondary" data-quran-surah-toggle>Sureye git</button>
      </div>
      <div class="quran-panel" data-quran-favorites hidden>
        <div class="quran-panel__header">
          <h3 class="quran-panel__title">Favoriler</h3>
          <button type="button" class="button-pill secondary" data-quran-clear>Temizle</button>
        </div>
        <div class="quran-favorites-list" data-quran-favorites-list></div>
      </div>
      <div class="quran-panel" data-quran-surah hidden>
        <div class="quran-panel__header">
          <h3 class="quran-panel__title">Sureye git</h3>
        </div>
        <div class="quran-surah-search">
          <input class="quran-surah-input" type="search" placeholder="Sure adı veya numarası" data-quran-surah-input>
        </div>
        <div class="quran-surah-results" data-quran-surah-results></div>
      </div>
    `;

    container.appendChild(wrapper);

    const ui = {
      prevButton: wrapper.querySelector('[data-quran-prev]'),
      nextButton: wrapper.querySelector('[data-quran-next]'),
      pageInput: wrapper.querySelector('#quran-page-input'),
      goButton: wrapper.querySelector('[data-quran-go]'),
      favoriteButton: wrapper.querySelector('[data-quran-favorite]'),
      favoritesToggle: wrapper.querySelector('[data-quran-favorites-toggle]'),
      surahToggle: wrapper.querySelector('[data-quran-surah-toggle]'),
      favoritesPanel: wrapper.querySelector('[data-quran-favorites]'),
      favoritesList: wrapper.querySelector('[data-quran-favorites-list]'),
      clearButton: wrapper.querySelector('[data-quran-clear]'),
      surahPanel: wrapper.querySelector('[data-quran-surah]'),
      surahInput: wrapper.querySelector('[data-quran-surah-input]'),
      surahResults: wrapper.querySelector('[data-quran-surah-results]'),
      status: wrapper.querySelector('[data-quran-status]'),
      image: wrapper.querySelector('.quran-image'),
      pageMeta: wrapper.querySelector('[data-quran-meta]'),
    };

    state.ui = ui;

    ui.prevButton?.addEventListener('click', () => {
      setPage(state.page - 1);
    });

    ui.nextButton?.addEventListener('click', () => {
      setPage(state.page + 1);
    });

    const applyInputPage = () => {
      const value = Number.parseInt(ui.pageInput?.value, 10);
      setPage(value);
    };

    ui.goButton?.addEventListener('click', applyInputPage);
    ui.pageInput?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        applyInputPage();
      }
    });

    ui.favoriteButton?.addEventListener('click', () => {
      if (state.favorites.has(state.page)) {
        state.favorites.delete(state.page);
      } else {
        state.favorites.add(state.page);
      }
      persistFavorites();
      updateFavoritesUI();
    });

    ui.favoritesToggle?.addEventListener('click', () => {
      if (!ui.favoritesPanel) {
        return;
      }
      const isHidden = ui.favoritesPanel.hidden;
      ui.favoritesPanel.hidden = !isHidden;
    });

    ui.surahToggle?.addEventListener('click', async () => {
      if (!ui.surahPanel) {
        return;
      }
      if (ui.surahPanel.hidden) {
        await loadSurahMap();
        updateSurahResults(ui.surahInput?.value || '');
      }
      ui.surahPanel.hidden = !ui.surahPanel.hidden;
    });

    ui.surahInput?.addEventListener('input', (event) => {
      const value = event.target.value || '';
      updateSurahResults(value);
    });

    ui.clearButton?.addEventListener('click', () => {
      state.favorites.clear();
      persistFavorites();
      updateFavoritesUI();
    });

    const initialPage = readPageFromUrl();
    const storedPage = loadStoredPage();
    setPage(initialPage ?? storedPage ?? state.meta.minPage);
  };

  const refreshFromStorage = () => {
    if (!state.ui) {
      return;
    }
    loadFavorites();
    updateFavoritesUI();
    const storedPage = loadStoredPage();
    if (storedPage !== null && storedPage !== state.page) {
      setPage(storedPage);
    }
  };

  window.QuranPage = {
    render: renderQuranPage,
    refreshFromStorage,
  };
})();
