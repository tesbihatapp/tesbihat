(() => {
  const META_PATH = 'assets/quran/meta.json';
  const MAP_PATH = 'assets/quran/surah_page_map.json';
  const PAGES_BASE_PATH = 'assets/quran/pages';
  const FAVORITES_KEY = 'tesbihat:quran:favorites';
  const LAST_PAGE_KEY = 'tesbihat:quran:last-page';
  const ZOOM_KEY = 'tesbihat:quran:zoom';
  const MIN_USER_SCALE = 1;
  const MAX_USER_SCALE = 4;
  const ZOOM_STEP = 0.25;

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
    lightbox: null,
    lightboxBaseScale: 1,
    lightboxUserScale: 1,
    lightboxTranslate: { x: 0, y: 0 },
    gesture: {
      pointers: new Map(),
      startDistance: 0,
      startUserScale: 1,
      startEffectiveScale: 1,
      startMidpoint: { x: 0, y: 0 },
      startTranslate: { x: 0, y: 0 },
      startPan: { x: 0, y: 0 },
    },
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

  const persistZoom = (value) => {
    if (!Number.isFinite(value)) {
      return;
    }
    setStoredValue(ZOOM_KEY, value);
  };

  const storedZoom = getStoredValue(ZOOM_KEY);
  if (Number.isFinite(storedZoom) && storedZoom > 0) {
    state.lightboxUserScale = storedZoom;
  }

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

  const ensureLightbox = () => {
    if (state.lightbox && state.lightbox.root && state.lightbox.root.isConnected) {
      return state.lightbox;
    }
    const overlay = document.createElement('div');
    overlay.className = 'quran-lightbox';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="quran-lightbox__toolbar">
        <div class="quran-toolbar__group">
          <button type="button" class="button-pill secondary" data-quran-zoom-out>−</button>
          <span class="quran-lightbox__zoom" data-quran-zoom-label>100%</span>
          <button type="button" class="button-pill secondary" data-quran-zoom-in>+</button>
          <button type="button" class="button-pill secondary" data-quran-zoom-reset>1:1</button>
        </div>
        <button type="button" class="button-pill secondary" data-quran-lightbox-close>✕</button>
      </div>
      <div class="quran-lightbox__body">
        <div class="quran-lightbox__frame">
          <div class="quran-lightbox__viewer" data-quran-lightbox-viewer>
            <div class="quran-lightbox__pan" data-quran-lightbox-pan>
              <div class="quran-lightbox__content" data-quran-lightbox-content>
                <img class="quran-lightbox__image" alt="Kur'an sayfası" decoding="async" draggable="false">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const lightbox = {
      root: overlay,
      image: overlay.querySelector('.quran-lightbox__image'),
      zoomLabel: overlay.querySelector('[data-quran-zoom-label]'),
      zoomIn: overlay.querySelector('[data-quran-zoom-in]'),
      zoomOut: overlay.querySelector('[data-quran-zoom-out]'),
      zoomReset: overlay.querySelector('[data-quran-zoom-reset]'),
      close: overlay.querySelector('[data-quran-lightbox-close]'),
      viewer: overlay.querySelector('[data-quran-lightbox-viewer]'),
      pan: overlay.querySelector('[data-quran-lightbox-pan]'),
      content: overlay.querySelector('[data-quran-lightbox-content]'),
      bound: false,
    };

    const closeLightbox = () => {
      overlay.hidden = true;
      document.body.classList.remove('quran-lightbox-open');
    };

    lightbox.close?.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeLightbox();
      }
    });

    state.lightbox = lightbox;
    return lightbox;
  };

  const clampValue = (value, min, max) => {
    if (!Number.isFinite(value)) {
      return Number.isFinite(min) ? min : 0;
    }
    let next = value;
    if (Number.isFinite(min)) {
      next = Math.max(next, min);
    }
    if (Number.isFinite(max)) {
      next = Math.min(next, max);
    }
    return next;
  };

  const getLightboxEffectiveScale = (userScale = state.lightboxUserScale) => {
    const baseScale = Number.isFinite(state.lightboxBaseScale) && state.lightboxBaseScale > 0
      ? state.lightboxBaseScale
      : 1;
    return baseScale * userScale;
  };

  const getViewerRect = () => {
    const lightbox = state.lightbox;
    if (!lightbox || !lightbox.viewer) {
      return null;
    }
    return lightbox.viewer.getBoundingClientRect();
  };

  const toViewerCoords = (point) => {
    const rect = getViewerRect();
    if (!rect) {
      return { x: 0, y: 0 };
    }
    return {
      x: point.x - (rect.left + rect.width / 2),
      y: point.y - (rect.top + rect.height / 2),
    };
  };

  const updateLightboxBaseScale = () => {
    const lightbox = state.lightbox;
    if (!lightbox || !lightbox.viewer || !lightbox.image || !lightbox.content) {
      return false;
    }
    const naturalWidth = lightbox.image.naturalWidth;
    const naturalHeight = lightbox.image.naturalHeight;
    const viewerWidth = lightbox.viewer.clientWidth;
    if (!naturalWidth || !naturalHeight || !viewerWidth) {
      return false;
    }
    const baseScale = viewerWidth / naturalWidth;
    if (!Number.isFinite(baseScale) || baseScale <= 0) {
      return false;
    }
    state.lightboxBaseScale = baseScale;
    lightbox.content.style.width = `${naturalWidth}px`;
    lightbox.content.style.height = `${naturalHeight}px`;
    return true;
  };

  const clampLightboxTranslate = (translate, effectiveScale) => {
    const lightbox = state.lightbox;
    if (!lightbox || !lightbox.viewer || !lightbox.image) {
      return translate;
    }
    const naturalWidth = lightbox.image.naturalWidth;
    const naturalHeight = lightbox.image.naturalHeight;
    const viewerWidth = lightbox.viewer.clientWidth;
    const viewerHeight = lightbox.viewer.clientHeight;
    if (!naturalWidth || !naturalHeight || !viewerWidth || !viewerHeight) {
      return translate;
    }
    const scale = Number.isFinite(effectiveScale) && effectiveScale > 0 ? effectiveScale : 1;
    const scaledWidth = naturalWidth * scale;
    const scaledHeight = naturalHeight * scale;
    const maxPanX = Math.max(0, (scaledWidth - viewerWidth) / 2);
    const maxPanY = Math.max(0, (scaledHeight - viewerHeight) / 2);
    const nextTranslate = translate || { x: 0, y: 0 };
    return {
      x: clampValue(nextTranslate.x, -maxPanX, maxPanX),
      y: clampValue(nextTranslate.y, -maxPanY, maxPanY),
    };
  };

  const applyLightboxTransform = () => {
    const lightbox = state.lightbox;
    if (!lightbox) {
      return;
    }
    const effectiveScale = getLightboxEffectiveScale();
    if (lightbox.pan) {
      lightbox.pan.style.transform = `translate(-50%, -50%) translate(${state.lightboxTranslate.x}px, ${state.lightboxTranslate.y}px)`;
    }
    if (lightbox.content) {
      lightbox.content.style.transform = `scale(${effectiveScale})`;
    }
    if (lightbox.zoomLabel) {
      lightbox.zoomLabel.textContent = `${Math.round(state.lightboxUserScale * 100)}%`;
    }
  };

  const applyLightboxState = (nextUserScale, nextTranslate, options = {}) => {
    const min = Object.prototype.hasOwnProperty.call(options, 'min') ? options.min : MIN_USER_SCALE;
    const max = Object.prototype.hasOwnProperty.call(options, 'max') ? options.max : MAX_USER_SCALE;
    const scaleValue = Number.isFinite(nextUserScale) ? nextUserScale : state.lightboxUserScale;
    const clampedScale = clampValue(scaleValue, min, max);
    state.lightboxUserScale = Number(clampedScale.toFixed(3));
    const translateValue = nextTranslate ?? state.lightboxTranslate;
    const effectiveScale = getLightboxEffectiveScale(state.lightboxUserScale);
    state.lightboxTranslate = clampLightboxTranslate({
      x: Number.isFinite(translateValue.x) ? translateValue.x : 0,
      y: Number.isFinite(translateValue.y) ? translateValue.y : 0,
    }, effectiveScale);
    applyLightboxTransform();
    if (options.persist) {
      persistZoom(state.lightboxUserScale);
    }
  };

  const refreshLightboxLayout = (options = {}) => {
    const lightbox = state.lightbox;
    if (!lightbox || lightbox.root.hidden) {
      return;
    }
    if (!updateLightboxBaseScale()) {
      return;
    }
    if (options.resetPan) {
      state.lightboxTranslate = { x: 0, y: 0 };
    }
    applyLightboxState(state.lightboxUserScale, state.lightboxTranslate, {
      min: MIN_USER_SCALE,
      max: MAX_USER_SCALE,
      persist: false,
    });
  };

  const getDistance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

  const getMidpoint = (a, b) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const updatePointer = (event) => {
    state.gesture.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  };

  const removePointer = (event) => {
    state.gesture.pointers.delete(event.pointerId);
  };

  const handlePointerDown = (event) => {
    const lightbox = state.lightbox;
    if (!lightbox || lightbox.root.hidden) {
      return;
    }
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    try {
      (lightbox.viewer || event.target).setPointerCapture(event.pointerId);
    } catch (_error) {
      // ignore
    }
    updatePointer(event);
    const points = Array.from(state.gesture.pointers.values());
    if (points.length === 1) {
      state.gesture.startPan = { x: event.clientX, y: event.clientY };
      state.gesture.startTranslate = { ...state.lightboxTranslate };
    } else if (points.length >= 2) {
      const [p1, p2] = points;
      state.gesture.startDistance = getDistance(p1, p2);
      state.gesture.startUserScale = state.lightboxUserScale;
      state.gesture.startEffectiveScale = getLightboxEffectiveScale(state.lightboxUserScale);
      state.gesture.startMidpoint = toViewerCoords(getMidpoint(p1, p2));
      state.gesture.startTranslate = { ...state.lightboxTranslate };
    }
  };

  const handlePointerMove = (event) => {
    const lightbox = state.lightbox;
    if (!lightbox || lightbox.root.hidden) {
      return;
    }
    if (!state.gesture.pointers.has(event.pointerId)) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    updatePointer(event);
    const points = Array.from(state.gesture.pointers.values());
    if (points.length >= 2) {
      const [p1, p2] = points;
      const distance = getDistance(p1, p2);
      if (state.gesture.startDistance > 0) {
        const ratio = distance / state.gesture.startDistance;
        const nextUserScale = clampValue(state.gesture.startUserScale * ratio, MIN_USER_SCALE, MAX_USER_SCALE);
        const midpoint = toViewerCoords(getMidpoint(p1, p2));
        const startScale = state.gesture.startEffectiveScale || getLightboxEffectiveScale(state.gesture.startUserScale);
        let nextTranslate = state.lightboxTranslate;
        if (startScale > 0) {
          nextTranslate = {
            x: midpoint.x - ((state.gesture.startMidpoint.x - state.gesture.startTranslate.x) / startScale) * getLightboxEffectiveScale(nextUserScale),
            y: midpoint.y - ((state.gesture.startMidpoint.y - state.gesture.startTranslate.y) / startScale) * getLightboxEffectiveScale(nextUserScale),
          };
        }
        applyLightboxState(nextUserScale, nextTranslate, {
          min: MIN_USER_SCALE,
          max: MAX_USER_SCALE,
          persist: false,
        });
      }
      return;
    }
    if (points.length === 1) {
      if (state.lightboxUserScale <= MIN_USER_SCALE) {
        return;
      }
      const deltaX = event.clientX - state.gesture.startPan.x;
      const deltaY = event.clientY - state.gesture.startPan.y;
      const nextTranslate = {
        x: state.gesture.startTranslate.x + deltaX,
        y: state.gesture.startTranslate.y + deltaY,
      };
      applyLightboxState(state.lightboxUserScale, nextTranslate, {
        min: MIN_USER_SCALE,
        max: MAX_USER_SCALE,
        persist: false,
      });
    }
  };

  const handlePointerUp = (event) => {
    const lightbox = state.lightbox;
    if (!lightbox || lightbox.root.hidden) {
      return;
    }
    removePointer(event);
    if (state.gesture.pointers.size === 1) {
      const [remaining] = Array.from(state.gesture.pointers.values());
      state.gesture.startPan = { x: remaining.x, y: remaining.y };
      state.gesture.startTranslate = { ...state.lightboxTranslate };
    }
    if (state.gesture.pointers.size === 0) {
      if (state.lightboxUserScale <= MIN_USER_SCALE) {
        state.lightboxTranslate = { x: 0, y: 0 };
        applyLightboxTransform();
      }
      persistZoom(state.lightboxUserScale);
    }
  };

  const handleWheelZoom = (event) => {
    const lightbox = state.lightbox;
    if (!lightbox || lightbox.root.hidden) {
      return;
    }
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    const rect = getViewerRect();
    if (!rect) {
      return;
    }
    const pivot = {
      x: event.clientX - (rect.left + rect.width / 2),
      y: event.clientY - (rect.top + rect.height / 2),
    };
    const zoomFactor = Math.exp(-event.deltaY * 0.002);
    const nextUserScale = clampValue(state.lightboxUserScale * zoomFactor, MIN_USER_SCALE, MAX_USER_SCALE);
    const startScale = getLightboxEffectiveScale(state.lightboxUserScale);
    if (startScale <= 0) {
      return;
    }
    const nextScale = getLightboxEffectiveScale(nextUserScale);
    const nextTranslate = {
      x: pivot.x - ((pivot.x - state.lightboxTranslate.x) / startScale) * nextScale,
      y: pivot.y - ((pivot.y - state.lightboxTranslate.y) / startScale) * nextScale,
    };
    applyLightboxState(nextUserScale, nextTranslate, {
      min: MIN_USER_SCALE,
      max: MAX_USER_SCALE,
      persist: true,
    });
  };

  const setLightboxImageSrc = (page) => {
    const lightbox = state.lightbox;
    if (!lightbox || !lightbox.image) {
      return;
    }
    const primary = buildPageSrc(page, true);
    const fallback = buildPageSrc(page, false);
    let triedFallback = false;
    let readyHandled = false;

    const handleReady = () => {
      if (readyHandled) {
        return;
      }
      readyHandled = true;
      requestAnimationFrame(() => {
        refreshLightboxLayout();
      });
    };

    lightbox.image.onload = () => {
      handleReady();
    };
    lightbox.image.onerror = () => {
      if (!triedFallback && fallback !== primary) {
        triedFallback = true;
        lightbox.image.src = fallback;
        return;
      }
    };
    lightbox.image.src = primary;
    if (lightbox.image.decode) {
      lightbox.image.decode().then(handleReady).catch(() => {});
    }
  };

  const openLightbox = () => {
    const lightbox = ensureLightbox();
    if (!lightbox || !lightbox.image) {
      return;
    }
    lightbox.root.hidden = false;
    document.body.classList.add('quran-lightbox-open');
    state.gesture.pointers.clear();
    state.lightboxTranslate = { x: 0, y: 0 };
    applyLightboxState(state.lightboxUserScale, state.lightboxTranslate, {
      min: MIN_USER_SCALE,
      max: MAX_USER_SCALE,
      persist: false,
    });
    setLightboxImageSrc(state.page);
    requestAnimationFrame(() => {
      refreshLightboxLayout();
    });
  };

  const updateLightboxImage = () => {
    const lightbox = state.lightbox;
    if (!lightbox || lightbox.root.hidden || !lightbox.image) {
      return;
    }
    state.lightboxTranslate = { x: 0, y: 0 };
    applyLightboxState(state.lightboxUserScale, state.lightboxTranslate, {
      min: MIN_USER_SCALE,
      max: MAX_USER_SCALE,
      persist: false,
    });
    setLightboxImageSrc(state.page);
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
    updateLightboxImage();
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
    const lightbox = ensureLightbox();

    if (lightbox && !lightbox.bound) {
      lightbox.zoomIn?.addEventListener('click', () => {
        applyLightboxState(state.lightboxUserScale + ZOOM_STEP, null, {
          min: MIN_USER_SCALE,
          max: MAX_USER_SCALE,
          persist: true,
        });
      });
      lightbox.zoomOut?.addEventListener('click', () => {
        applyLightboxState(state.lightboxUserScale - ZOOM_STEP, null, {
          min: MIN_USER_SCALE,
          max: MAX_USER_SCALE,
          persist: true,
        });
      });
      lightbox.zoomReset?.addEventListener('click', () => {
        updateLightboxBaseScale();
        const baseScale = state.lightboxBaseScale;
        const targetScale = baseScale > 0 ? 1 / baseScale : 1;
        applyLightboxState(targetScale, { x: 0, y: 0 }, {
          min: 0.1,
          max: null,
          persist: true,
        });
      });
      lightbox.viewer?.addEventListener('pointerdown', handlePointerDown);
      lightbox.viewer?.addEventListener('pointermove', handlePointerMove);
      lightbox.viewer?.addEventListener('pointerup', handlePointerUp);
      lightbox.viewer?.addEventListener('pointercancel', handlePointerUp);
      lightbox.viewer?.addEventListener('pointerleave', handlePointerUp);
      lightbox.viewer?.addEventListener('wheel', handleWheelZoom, { passive: false });
      window.addEventListener('resize', () => {
        refreshLightboxLayout();
      });
      lightbox.bound = true;
    }

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

    ui.image?.addEventListener('click', () => {
      openLightbox();
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
