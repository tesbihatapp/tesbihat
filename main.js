const COUNTER_STORAGE_KEY = 'tesbihat:counters';
const DUA_STORAGE_KEY = 'tesbihat:duas';
const THEME_STORAGE_KEY = 'tesbihat:theme';
const DUA_SOURCE_STORAGE_KEY = 'tesbihat:dua-source';
const FONT_SCALE_STORAGE_KEY = 'tesbihat:font-scale';
const FONT_SCALE_MIN = 0.85;
const FONT_SCALE_MAX = 1.3;
const FONT_SCALE_STEP = 0.05;

const NAME_SECTIONS = [
  {
    start: 'Tercümân-ı İsm-i A’zam Duâsı:',
    end: 'Sonra eller yukarı kaldırılır ve şöyle duâ edilir:',
  },
  {
    start: 'İsm-i A’zam Duâsı:',
    end: 'Sonra eller yukarı kaldırılır ve şöyle duâ edilir:',
  },
];

const PRAYER_CONFIG = {
  sabah: { label: 'Sabah', markdown: 'sabah.md', supportsDua: true },
  ogle: { label: 'Öğle', markdown: 'OgleTesbihat.md', supportsDua: true },
  ikindi: { label: 'İkindi', markdown: 'IkindiTesbihat.md', supportsDua: true },
  aksam: { label: 'Akşam', markdown: 'AksamTesbihat.md', supportsDua: true },
  yatsi: { label: 'Yatsı', markdown: 'YatsiTesbihat.md', supportsDua: true },
};

const DUA_SOURCES = {
  birkirikdilekce: { label: 'Bir Kırık Dilekçe', path: 'BirKirikDilekce.txt' },
};

const MANUAL_NAME_MEANINGS = {
  allah: 'Bütün güzel isimlerin sahibi olan yüce Allah\'ın özel ismidir.',
  atuf: 'Kullarına şefkat ve merhametle muamele eden, çok yumuşak davranan.',
  azim: 'Azameti sonsuz, yücelikte eşi olmayan.',
  burhan: 'Hakikati apaçık ortaya koyan delil sahibi.',
  cemil: 'Mutlak güzellik sahibi, güzelliği her şeyi kuşatan.',
  deyyan: 'Hüküm günü hesap soran, yaptıkların karşılığını veren.',
  ehad: 'Tek olan, zâtında eşi ve benzeri bulunmayan.',
  eman: 'Kendisine sığınanları emniyete alan, tam güven kaynağı.',
  ferd: 'Tek olan, parçalanması ve bölünmesi mümkün olmayan.',
  habib: 'Kullarını seven ve sevilen, sevgisi sonsuz olan.',
  hannan: 'Çok şefkatli ve yumuşak davranan.',
  halik: 'Yoktan var eden, tüm varlıkları yaratıp şekillendiren.',
  kadim: 'Başlangıcı olmayan, ezelden beri var olan.',
  karib: 'Kullarına çok yakın olan, dualara icabet eden.',
  kefil: 'Kullarını himayesine alan, her şeyin sorumluluğunu üstlenen.',
  kafi: 'Her kuluna kâfi gelen, ihtiyaçlarını karşılayan.',
  kahir: 'Her şey üzerinde üstün kudret sahibi, dilediğini hükmü altına alan.',
  mahmud: 'Her daim övülen, her türlü hamde layık olan.',
  maruf: 'Kulları tarafından iyiliğiyle bilinen, tanınan.',
  mennan: 'Nimetleri karşılıksız ve bol bol veren.',
  mubin: 'Her şeyi apaçık ortaya koyan, açıklığı ile kendini gösteren.',
  mucemmil: 'Güzellikleri ortaya çıkaran, varlıkları güzelleştiren.',
  mufaddil: 'Lütuf ve fazilet ihsan eden, üstünlük bahşeden.',
  muhsin: 'Yaptığı her işi en güzel şekilde yapan, ihsan eden.',
  mukim: 'Varlıkları yerli yerinde tutan, dilediğini ikamet ettiren.',
  munim: 'Tüm nimetleri veren, ihsanı bitmeyen.',
  mustean: 'Yardımına güvenilen, kendisinden yardım istenen.',
  mutahhir: 'Günahları ve gönülleri arındıran, temizleyen.',
  muteal: 'Yücelerde yüce olan, hiçbir şeyin erişemediği.',
  muzhir: 'Gizli olanı ortaya çıkaran, aşikâr kılan.',
  muafi: 'Afiyet veren, sıhhate kavuşturan.',
  subhan: 'Her türlü noksanlıktan münezzeh, pak olan.',
  sultan: 'Mutlak kudret ve hâkimiyet sahibi.',
  sadikalvadi: 'Vaadinde asla yanılmayan, sözünde duran.',
  satir: 'Ayıpları örten, kusurları gizleyen.',
  tahir: 'Zâtı ve fiilleriyle tertemiz olan.',
  vitr: 'Tek olan, dengi bulunmayan.',
  safi: 'Şifa veren, hastalara sağlık bahşeden.',
  sahid: 'Her şeye şahit olan, hiçbir şeyi gözden kaçırmayan.',
  allam: 'Her şeyi en ince ayrıntısına kadar bilen.',
  rahmanu: 'Dünyada tüm varlıklara merhamet eden.',
  rahimu: 'Ahirette müminlere özel rahmette bulunan.',
  kerim: 'Cömertliği sonsuz olan, ikramı bol.',
  kerimu: 'Cömertliği sonsuz olan, ikramı bol.',
  mucib: 'Dualara icabet eden, karşılık veren.',
  mucibu: 'Dualara icabet eden, karşılık veren.',
  muheymin: 'Her şeyi gözetleyip koruyan.',
  muktedir: 'Her istediğini gerçekleştiren mutlak kudret sahibi.',
  rahman: 'Dünyada bütün yaratılmışlara merhamet eden.',
  rahim: 'Ahirette müminlere sonsuz rahmet eden.',
  rauf: 'Kullarına karşı çok şefkatli olan.',
  samed: 'Her varlığın muhtaç olduğu, fakat kendisi hiçbir şeye muhtaç olmayan.',
  samedu: 'Her varlığın muhtaç olduğu, fakat kendisi hiçbir şeye muhtaç olmayan.',
  selam: 'Kullarını selamete çıkaran, her türlü kusurdan uzak.',
  semi: 'Her şeyi işiten.',
  settar: 'Ayıp ve kusurları örten.',
  tevvab: 'Tövbeleri çokça kabul eden.',
  vedud: 'Kullarını seven ve sevilen.',
  vehhab: 'Karşılıksız hibeler veren.',
  varis: 'Her şey yok olduktan sonra baki kalan.',
  zahir: 'Varlığı apaçık olan.',
  ahir: 'Sonu olmayan, ebedi.',
  gaffar: 'Günahları çokça örten.',
  gafur: 'Bağışlaması bol olan.',
  ganiyy: 'Hiçbir şeye muhtaç olmayan.',
  sehid: 'Her şeye şahit olan.',
  alim: 'Her şeyi bilen.',
  azim: 'Azameti sonsuz olan.',
};

const state = {
  counters: loadCounters(),
  theme: loadTheme(),
  currentPrayer: 'sabah',
  duaSource: loadSelectedDuaSource(),
  duaCache: {},
  duaState: null,
  duas: [],
  fontScale: loadFontScale(),
  names: null,
  tooltipElement: null,
  activeTooltipTarget: null,
  nameLookup: new Map(),
  missingNames: new Set(),
};

document.addEventListener('DOMContentLoaded', () => {
  const appRoot = document.querySelector('.app');
  if (!appRoot) {
    return;
  }

  applyTheme(appRoot, state.theme);
  applyFontScale(state.fontScale);
  attachThemeToggle(appRoot);
  attachSettingsToggle(appRoot);
  initPrayerTabs(appRoot);
  initDuaSourceSelector(appRoot);
  attachFontScaleControls(appRoot);
  attachSettingsActions(appRoot);
  registerServiceWorker();

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
    if (isActive && typeof tab.scrollIntoView === 'function') {
      tab.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
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
    await ensureNamesLoaded();
    annotateNames(content);
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
  hideNameTooltip();
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

function attachFontScaleControls(appRoot) {
  const decreaseButton = appRoot.querySelector('.text-decrease');
  const increaseButton = appRoot.querySelector('.text-increase');

  if (!decreaseButton || !increaseButton) {
    return;
  }

  const updateButtons = () => {
    decreaseButton.disabled = state.fontScale <= FONT_SCALE_MIN + 0.001;
    increaseButton.disabled = state.fontScale >= FONT_SCALE_MAX - 0.001;
  };

  const commitScale = (nextScale) => {
    state.fontScale = nextScale;
    applyFontScale(nextScale);
    localStorage.setItem(FONT_SCALE_STORAGE_KEY, String(nextScale));
    updateButtons();
  };

  decreaseButton.addEventListener('click', () => {
    const next = clamp(
      Number.parseFloat((state.fontScale - FONT_SCALE_STEP).toFixed(2)),
      FONT_SCALE_MIN,
      FONT_SCALE_MAX,
    );
    commitScale(next);
  });

  increaseButton.addEventListener('click', () => {
    const next = clamp(
      Number.parseFloat((state.fontScale + FONT_SCALE_STEP).toFixed(2)),
      FONT_SCALE_MIN,
      FONT_SCALE_MAX,
    );
    commitScale(next);
  });

  updateButtons();
}

async function ensureNamesLoaded() {
  if (state.names) {
    return;
  }
  try {
    const response = await fetch('names.json');
    if (!response.ok) {
      throw new Error('İsimler alınamadı.');
    }
    const data = await response.json();
    state.names = data;
    state.nameLookup = new Map();
    state.missingNames = new Set();

    Object.entries(data).forEach(([raw, meaning]) => {
      registerNameVariants(raw, meaning);
    });

    Object.entries(MANUAL_NAME_MEANINGS).forEach(([canonical, meaning]) => {
      if (!state.nameLookup.has(canonical)) {
        state.nameLookup.set(canonical, meaning);
      }
    });
  } catch (error) {
    console.warn('Esma bilgileri yüklenemedi.', error);
    state.names = null;
    state.nameLookup = new Map();
  }
}

function annotateNames(container) {
  if (!state.names || !state.nameLookup) {
    return;
  }

  const textNodes = collectNameEligibleNodes(container);
  textNodes.forEach((node) => wrapNamesInTextNode(node));
}

function wrapNamesInTextNode(node) {
  const text = node.nodeValue;
  if (!text) {
    return;
  }

  const fragment = document.createDocumentFragment();
  const regex = /([\p{L}’'`\-]+)/gu;
  let lastIndex = 0;
  let matched = false;

  let match;
  while ((match = regex.exec(text)) !== null) {
    const word = match[1];
    const start = match.index;
    const end = regex.lastIndex;

    if (start > lastIndex) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
    }

    const cleaned = word.trim();
    const meaning = resolveNameMeaning(cleaned);

    if (meaning) {
      fragment.appendChild(createNameBadge(cleaned, meaning));
      matched = true;
    } else {
      fragment.appendChild(document.createTextNode(word));
    }

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  if (matched) {
    node.parentNode.replaceChild(fragment, node);
  }
}

function createNameBadge(name, meaning) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'name-badge';
  button.textContent = name;
  button.dataset.name = name;
  button.dataset.meaning = meaning;
  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleNameTooltip(button);
  });
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleNameTooltip(button);
    }
  });

  return button;
}

function collectNameEligibleNodes(root) {
  const nodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let activeSection = null;
  let current;

  while ((current = walker.nextNode())) {
    if (!current.nodeValue || !current.nodeValue.trim()) {
      continue;
    }

    const value = current.nodeValue;
    const parent = current.parentElement;
    if (parent && (parent.closest('.counter-card') || parent.closest('.name-badge') || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
      continue;
    }

    // check if current node contains any section start markers
    for (const section of NAME_SECTIONS) {
      if (value.includes(section.start)) {
        activeSection = section;
        break;
      }
    }

    if (activeSection && !NAME_SECTIONS.some((section) => value.includes(section.start))) {
      nodes.push(current);
    }

    if (activeSection && value.includes(activeSection.end)) {
      activeSection = null;
    }
  }

  return nodes;
}

function registerNameVariants(rawName, meaning) {
  const variants = new Set([rawName]);

  const withoutArticle = rawName.replace(/^(?:El|Er|Es|Et|Ed|Ez|En|Eş|Az|Â|Mâlik-ül|Zü’l|Zül|Zu’l)\s*-?/i, '');
  variants.add(withoutArticle);
  variants.add(withoutArticle.replace(/[-’'`]/g, ' '));
  variants.add(withoutArticle.replace(/[-’'`\s]/g, ''));

  variants.forEach((variant) => {
    const canonical = canonicalizeName(variant);
    if (!canonical) {
      return;
    }
    if (!state.nameLookup.has(canonical)) {
      state.nameLookup.set(canonical, meaning);
    }
    if (!canonical.endsWith('u') && !state.nameLookup.has(`${canonical}u`)) {
      state.nameLookup.set(`${canonical}u`, meaning);
    }
  });
}

function canonicalizeName(value) {
  if (!value) {
    return '';
  }
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
}

function resolveNameMeaning(name) {
  if (!name) {
    return null;
  }
  const canonical = canonicalizeName(name);
  if (!canonical) {
    return null;
  }

  const direct = state.nameLookup.get(canonical);
  if (direct) {
    return direct;
  }

  const trimmed = canonical.replace(/(u|a|i|e)$/i, '');
  if (trimmed) {
    const trimmedMeaning = state.nameLookup.get(trimmed);
    if (trimmedMeaning) {
      return trimmedMeaning;
    }
    const manual = MANUAL_NAME_MEANINGS[trimmed];
    if (manual) {
      state.nameLookup.set(trimmed, manual);
      return manual;
    }
  }

  const manualDirect = MANUAL_NAME_MEANINGS[canonical];
  if (manualDirect) {
    state.nameLookup.set(canonical, manualDirect);
    return manualDirect;
  }

  if (!state.missingNames.has(name)) {
    state.missingNames.add(name);
  }
  return null;
}

function toggleNameTooltip(button) {
  if (state.activeTooltipTarget === button) {
    hideNameTooltip();
    return;
  }

  const name = button.dataset.name;
  const meaning = button.dataset.meaning;
  if (!meaning) {
    return;
  }
  showNameTooltip(button, name, meaning);
}

function getNameTooltipElement() {
  if (state.tooltipElement) {
    return state.tooltipElement;
  }

  const tooltip = document.createElement('div');
  tooltip.className = 'name-tooltip';
  tooltip.hidden = true;
  const host = document.querySelector('.app') || document.body;
  host.appendChild(tooltip);

  document.addEventListener('pointerdown', (event) => {
    if (!state.tooltipElement || state.tooltipElement.hidden) {
      return;
    }
    if (state.activeTooltipTarget && (state.activeTooltipTarget === event.target || state.activeTooltipTarget.contains(event.target))) {
      return;
    }
    if (event.target === tooltip || tooltip.contains(event.target)) {
      return;
    }
    hideNameTooltip();
  });

  window.addEventListener('scroll', hideNameTooltip, true);
  window.addEventListener('resize', hideNameTooltip);

  state.tooltipElement = tooltip;
  return tooltip;
}

function showNameTooltip(button, name, meaning) {
  const tooltip = getNameTooltipElement();
  tooltip.innerHTML = `<strong>${name}</strong><p>${meaning}</p>`;
  tooltip.hidden = false;
  tooltip.classList.add('is-visible');
  tooltip.style.visibility = 'hidden';
  tooltip.style.left = '0px';
  tooltip.style.top = '0px';

  const rect = button.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const margin = 12;

  let top = rect.top - tooltipRect.height - margin;
  if (top < 12) {
    top = rect.bottom + margin;
  }

  let left = rect.left + (rect.width - tooltipRect.width) / 2;
  const maxLeft = window.innerWidth - tooltipRect.width - 12;
  if (left < 12) {
    left = 12;
  } else if (left > maxLeft) {
    left = maxLeft;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.visibility = 'visible';
  state.activeTooltipTarget = button;
}

function hideNameTooltip() {
  if (!state.tooltipElement) {
    return;
  }
  state.tooltipElement.hidden = true;
  state.tooltipElement.classList.remove('is-visible');
  state.activeTooltipTarget = null;
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

function attachSettingsActions(appRoot) {
  const resetButton = appRoot.querySelector('[data-reset-dua]');
  if (!resetButton) {
    return;
  }

  resetButton.addEventListener('click', async () => {
    if (resetButton.disabled) {
      return;
    }

    const confirmed = window.confirm('Bir Kırık Dilekçe okuma ilerlemesini sıfırlamak istiyor musunuz?');
    if (!confirmed) {
      return;
    }

    resetButton.disabled = true;
    try {
      const duas = await loadDuaSourceData(state.duaSource);
      state.duas = duas;
      resetDuaState(duas.length, state.duaSource, 0);

      const currentConfig = PRAYER_CONFIG[state.currentPrayer];
      if (currentConfig && currentConfig.supportsDua) {
        await loadPrayerContent(state.currentPrayer);
      }
    } catch (error) {
      console.error('Dua ilerlemesi sıfırlanamadı.', error);
    } finally {
      resetButton.disabled = false;
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

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .catch((error) => {
        console.warn('Servis çalışanı kaydedilemedi.', error);
      });
  }
}

function loadFontScale() {
  const stored = localStorage.getItem(FONT_SCALE_STORAGE_KEY);
  if (stored) {
    const parsed = Number.parseFloat(stored);
    if (!Number.isNaN(parsed)) {
      return clamp(parsed, FONT_SCALE_MIN, FONT_SCALE_MAX);
    }
  }
  return 1;
}

function applyFontScale(scale) {
  const clamped = clamp(scale, FONT_SCALE_MIN, FONT_SCALE_MAX);
  document.documentElement.style.setProperty('--font-scale', clamped);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
