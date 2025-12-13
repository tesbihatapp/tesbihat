const COUNTER_STORAGE_KEY = 'tesbihat:counters';
const DUA_STORAGE_KEY = 'tesbihat:duas';
const DUA_STORAGE_VERSION = 2;
const THEME_STORAGE_KEY = 'tesbihat:theme';
const DUA_SOURCE_STORAGE_KEY = 'tesbihat:dua-source';
const LANGUAGE_STORAGE_KEY = 'tesbihat:language';
const DUA_ARABIC_STORAGE_KEY = 'tesbihat:dua-arabic';
const DUA_FAVORITES_STORAGE_KEY = 'tesbihat:dua-favorites';
const DUA_FAVORITES_VERSION = 1;
const ZIKIR_STORAGE_KEY = 'tesbihat:zikirs';
const ZIKIR_STORAGE_VERSION = 1;
const UCAYLAR_TRACKER_STORAGE_KEY = 'tesbihat:ucaylar-tracker';
const UCAYLAR_TRACKER_STORAGE_VERSION = 1;
const SHARED_DUA_LAST_ROOM_STORAGE_KEY = 'tesbihat:shared-dua:last-room';
const SHARED_DUA_ROUTE_PREFIX = '#/shared/';
const SHARED_DUA_FIREBASE_SDK_VERSION = '10.12.0';
const COMPLETION_STORAGE_KEY = 'tesbihat:completions';
const COMPLETION_STORAGE_VERSION = 1;
const TRANSLATION_VISIBILITY_STORAGE_KEY = 'tesbihat:translations-visible';
const COMPLETION_RETENTION_DAYS = 365;
const FONT_SCALE_STORAGE_KEY = 'tesbihat:font-scale';
const PERSONAL_DUA_ENABLED_STORAGE_KEY = 'tesbihat:personal-dua-enabled';
const PERSONAL_DUA_TEXT_STORAGE_KEY = 'tesbihat:personal-dua-text';
const FONT_SCALE_MIN = 0.85;
const FONT_SCALE_MAX = 1.3;
const FONT_SCALE_STEP = 0.05;
const CEVSEN_FONT_SCALE_STORAGE_KEY = 'tesbihat:cevsen-font-scale';
const CEVSEN_VISIBILITY_STORAGE_KEY = 'tesbihat:cevsen-visibility';
const HOME_STATS_COLLAPSED_STORAGE_KEY = 'tesbihat:home-stats-collapsed';
const CEVSEN_FONT_SCALE_MIN = 0.75;
const CEVSEN_FONT_SCALE_MAX = 1.6;
const CEVSEN_FONT_SCALE_STEP = 0.05;
const CEVSEN_FONT_SCALE_DEFAULT = {
  arabic: 1,
  transliteration: 1,
  meaning: 1,
};
const CEVSEN_VISIBILITY_DEFAULT = {
  arabic: true,
  transliteration: true,
  meaning: true,
};
const IMPORTANCE_SOURCE_PATH = 'TesbihatinOnemi.txt';
const INSTALL_PROMPT_STORAGE_KEY = 'tesbihat:install-dismissed';
const INSTALL_PROMPT_DELAY = 24 * 60 * 60 * 1000;
const DEFAULT_LANGUAGE = 'tr';
const DEFAULT_SHOW_ARABIC_DUAS = true;
const DEFAULT_SHOW_TRANSLATIONS = false;
const DEFAULT_ZIKIR_VIEW = 'list';
const TRACKED_PRAYERS = ['sabah', 'ogle', 'ikindi', 'aksam', 'yatsi'];
const TRACKED_PRAYER_SET = new Set(TRACKED_PRAYERS);
const LANGUAGE_OPTIONS = ['tr', 'ar'];
let duaRepository = null;
let zikirDefaultsPromise = null;
let sharedDuaFirebasePromise = null;
const FEATURES_SOURCE_PATH = 'HomeFeatures.md';
const ZIKIR_DEFAULTS_PATH = 'zikir-defaults.json';
const UCAYLAR_BASE_PATH = 'uc-aylar';
const UCAYLAR_MONTHS = {
  recep: { key: 'recep', label: 'Recep', manifestPath: `${UCAYLAR_BASE_PATH}/recep/manifest.json` },
  saban: { key: 'saban', label: 'Şaban', manifestPath: `${UCAYLAR_BASE_PATH}/saban/manifest.json` },
  ramazan: { key: 'ramazan', label: 'Ramazan', manifestPath: `${UCAYLAR_BASE_PATH}/ramazan/manifest.json` },
};

const UCAYLAR_RAMAZAN_DEFAULT_FIELD_ID = 'teravih';
const UCAYLAR_DEFAULTS_VERSION = 2;

// Üç Aylar (Hijri) tarih aralıkları.
// Not: Bu aralıklar Gregoryen (YYYY-MM-DD) olarak tutulur ve aylar yıl sınırını aşabilir.
// Karşılaştırmalarda timezone kaynaklı gün kaymasını önlemek için Date.UTC kullanıyoruz.
const UCAYLAR_DATE_RANGES = {
  2025: {
    recep: { start: '2025-12-21', end: '2026-01-19' },
    saban: { start: '2026-01-20', end: '2026-02-18' },
    ramazan: { start: '2026-02-19', end: '2026-03-19' },
  },
};

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

const DEFAULT_THEME_ID = 'evergreen';
const DEFAULT_THEME_MODE = 'light';

const BASE_THEME_TOKENS = {
  light: {
    'surface-color': '#f9f6ee',
    'surface-elevated': '#ffffff',
    'surface-muted': '#f1ecd9',
    'surface-hero': 'linear-gradient(160deg, #76885b 0%, #556b2f 100%)',
    'text-color': '#2b2b2b',
    'muted-text': '#5f5a4c',
    'accent-color': '#556b2f',
    'accent-contrast': '#f9f6ee',
    'meta-theme-color': '#556b2f',
    'border-color': 'rgba(85, 107, 47, 0.18)',
    'shadow-soft': '0 10px 35px rgba(71, 88, 39, 0.12)',
    'shadow-soft-hover': '0 18px 45px rgba(71, 88, 39, 0.18)',
    'card-shadow': '0 10px 32px rgba(24, 50, 115, 0.14)',
    'card-shadow-hover': '0 18px 45px rgba(24, 50, 115, 0.18)',
    'counter-shadow': '0 16px 30px rgba(31, 84, 255, 0.25)',
    'counter-shadow-complete': '0 22px 48px rgba(40, 177, 120, 0.35)',
    'counter-complete-bg': 'linear-gradient(145deg, #22c55e 0%, #16a34a 100%)',
    'counter-complete-text': '#22c55e',
    'tooltip-bg': 'rgba(255, 255, 255, 0.98)',
    'tooltip-text': '#2b2b2b',
    'tooltip-border': 'rgba(85, 107, 47, 0.2)',
    'tooltip-shadow': '0 18px 40px rgba(24, 50, 115, 0.25)',
    'name-badge-bg': 'rgba(133, 150, 104, 0.28)',
    'name-badge-color': '#2b3b23',
    'name-badge-hover-bg': 'rgba(133, 150, 104, 0.35)',
    'surface-overlay': 'rgba(133, 150, 104, 0.14)',
    'surface-overlay-strong': 'rgba(133, 150, 104, 0.2)',
    'accent-soft-bg': 'rgba(133, 150, 104, 0.18)',
    'accent-soft-hover': 'rgba(133, 150, 104, 0.28)',
    'tab-active-bg': '#ffffff',
    'tab-active-text': '#1b3ca6',
    'tab-inactive-bg': 'rgba(255, 255, 255, 0.15)',
    'tab-inactive-hover': 'rgba(255, 255, 255, 0.25)',
    'tab-inactive-text': 'rgba(255, 255, 255, 0.8)',
    'highlight-overlay': 'linear-gradient(140deg, rgba(85, 107, 47, 0.14) 0%, rgba(85, 107, 47, 0.05) 100%)',
    'install-border': 'rgba(85, 107, 47, 0.38)',
    'install-background': 'rgba(133, 150, 104, 0.12)',
    'icon-button-bg': 'rgba(255, 255, 255, 0.18)',
    'icon-button-hover': 'rgba(255, 255, 255, 0.28)',
    'counter-reset-bg': 'rgba(133, 150, 104, 0.18)',
    'counter-reset-hover': 'rgba(133, 150, 104, 0.28)',
    'focus-outline': 'rgba(255, 255, 255, 0.85)',
    'action-button-bg': 'rgba(95, 123, 255, 0.16)',
    'action-button-hover': 'rgba(95, 123, 255, 0.26)',
    'hero-subtitle-color': 'rgba(255, 255, 255, 0.8)',
  },
  dark: {
    'surface-color': '#1c1c1a',
    'surface-elevated': '#232320',
    'surface-muted': '#181816',
    'surface-hero': 'linear-gradient(160deg, #3a3b32 0%, #2c2d25 100%)',
    'text-color': '#edece9',
    'muted-text': '#b7b6ac',
    'accent-color': '#c2cbaa',
    'accent-contrast': '#1c1c1a',
    'meta-theme-color': '#232320',
    'border-color': 'rgba(194, 203, 170, 0.22)',
    'shadow-soft': '0 14px 40px rgba(10, 11, 8, 0.5)',
    'shadow-soft-hover': '0 18px 50px rgba(10, 11, 8, 0.6)',
    'card-shadow': '0 14px 35px rgba(2, 8, 20, 0.48)',
    'card-shadow-hover': '0 20px 48px rgba(2, 8, 20, 0.58)',
    'counter-shadow': '0 16px 30px rgba(0, 0, 0, 0.35)',
    'counter-shadow-complete': '0 22px 48px rgba(26, 122, 89, 0.42)',
    'counter-complete-bg': 'linear-gradient(145deg, #1fb975 0%, #158856 100%)',
    'counter-complete-text': '#4ce9a0',
    'tooltip-bg': 'rgba(28, 29, 24, 0.96)',
    'tooltip-text': '#edece9',
    'tooltip-border': 'rgba(194, 203, 170, 0.28)',
    'tooltip-shadow': '0 18px 40px rgba(0, 0, 0, 0.55)',
    'name-badge-bg': 'rgba(194, 203, 170, 0.28)',
    'name-badge-color': '#1c1c1a',
    'name-badge-hover-bg': 'rgba(194, 203, 170, 0.34)',
    'surface-overlay': 'rgba(194, 203, 170, 0.1)',
    'surface-overlay-strong': 'rgba(194, 203, 170, 0.16)',
    'accent-soft-bg': 'rgba(194, 203, 170, 0.18)',
    'accent-soft-hover': 'rgba(194, 203, 170, 0.28)',
    'tab-active-bg': 'rgba(255, 255, 255, 0.18)',
    'tab-active-text': '#0e1010',
    'tab-inactive-bg': 'rgba(255, 255, 255, 0.08)',
    'tab-inactive-hover': 'rgba(255, 255, 255, 0.14)',
    'tab-inactive-text': 'rgba(255, 255, 255, 0.85)',
    'highlight-overlay': 'linear-gradient(140deg, rgba(194, 203, 170, 0.18) 0%, rgba(194, 203, 170, 0.08) 100%)',
    'install-border': 'rgba(194, 203, 170, 0.32)',
    'install-background': 'rgba(194, 203, 170, 0.16)',
    'icon-button-bg': 'rgba(255, 255, 255, 0.14)',
    'icon-button-hover': 'rgba(255, 255, 255, 0.22)',
    'counter-reset-bg': 'rgba(194, 203, 170, 0.2)',
    'counter-reset-hover': 'rgba(194, 203, 170, 0.32)',
    'focus-outline': 'rgba(255, 255, 255, 0.75)',
    'action-button-bg': 'rgba(255, 255, 255, 0.12)',
    'action-button-hover': 'rgba(255, 255, 255, 0.18)',
    'hero-subtitle-color': 'rgba(255, 255, 255, 0.82)',
  },
};

const THEME_PRESETS = [
  {
    id: 'evergreen',
    label: 'Evergreen',
    description: 'Doğanın sakin yeşilleri',
    light: {
      surfaceColor: '#f9f6ee',
      surfaceElevated: '#ffffff',
      surfaceMuted: '#f1ecd9',
      heroGradient: 'linear-gradient(160deg, #76885b 0%, #556b2f 100%)',
      textColor: '#2b2b2b',
      mutedText: '#5f5a4c',
      accent: '#556b2f',
      accentContrast: '#f9f6ee',
      borderColor: 'rgba(85, 107, 47, 0.18)',
      themeColor: '#556b2f',
    },
    dark: {
      surfaceColor: '#1c1c1a',
      surfaceElevated: '#232320',
      surfaceMuted: '#181816',
      heroGradient: 'linear-gradient(160deg, #3a3b32 0%, #2c2d25 100%)',
      textColor: '#edece9',
      mutedText: '#b7b6ac',
      accent: '#c2cbaa',
      accentContrast: '#1c1c1a',
      borderColor: 'rgba(194, 203, 170, 0.22)',
      tooltipBg: 'rgba(28, 29, 24, 0.96)',
      tooltipText: '#edece9',
      tooltipBorder: 'rgba(194, 203, 170, 0.28)',
      themeColor: '#232320',
    },
  },
  {
    id: 'sunrise',
    label: 'Sunrise',
    description: 'Sıcak gün doğumu',
    light: {
      surfaceColor: '#fff6ef',
      surfaceElevated: '#ffffff',
      surfaceMuted: '#fde4d6',
      heroGradient: 'linear-gradient(160deg, #fbd0aa 0%, #f1787c 100%)',
      textColor: '#43221f',
      mutedText: '#84514c',
      accent: '#f1787c',
      accentContrast: '#fffaf7',
      borderColor: 'rgba(241, 120, 124, 0.22)',
      heroSubtitleColor: 'rgba(255, 255, 255, 0.9)',
      themeColor: '#f1787c',
    },
    dark: {
      surfaceColor: '#2c1f24',
      surfaceElevated: '#35252a',
      surfaceMuted: '#23161a',
      heroGradient: 'linear-gradient(160deg, #7f3138 0%, #b95455 100%)',
      textColor: '#f9e1de',
      mutedText: '#d59a93',
      accent: '#f39c8f',
      accentContrast: '#1f1113',
      borderColor: 'rgba(243, 156, 143, 0.28)',
      heroSubtitleColor: 'rgba(255, 255, 255, 0.82)',
      themeColor: '#35252a',
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    description: 'Serin deniz esintisi',
    light: {
      surfaceColor: '#edf6fb',
      surfaceElevated: '#ffffff',
      surfaceMuted: '#dceff7',
      heroGradient: 'linear-gradient(160deg, #86d1ee 0%, #397ad1 100%)',
      textColor: '#17324a',
      mutedText: '#4b6d8a',
      accent: '#2f88d1',
      accentContrast: '#f1f9ff',
      borderColor: 'rgba(47, 136, 209, 0.22)',
      themeColor: '#2f88d1',
    },
    dark: {
      surfaceColor: '#10202c',
      surfaceElevated: '#152a3a',
      surfaceMuted: '#0c1924',
      heroGradient: 'linear-gradient(160deg, #1f4f7a 0%, #2f88c7 100%)',
      textColor: '#dbefff',
      mutedText: '#98c5df',
      accent: '#4fbffc',
      accentContrast: '#07111b',
      borderColor: 'rgba(79, 191, 252, 0.28)',
      themeColor: '#152a3a',
    },
  },
  {
    id: 'desert',
    label: 'Desert',
    description: 'Gün batımı kum tonları',
    light: {
      surfaceColor: '#fff6e8',
      surfaceElevated: '#ffffff',
      surfaceMuted: '#f4e1c7',
      heroGradient: 'linear-gradient(160deg, #e8c391 0%, #c4934b 100%)',
      textColor: '#4d3923',
      mutedText: '#83684a',
      accent: '#c2853b',
      accentContrast: '#fffbf1',
      borderColor: 'rgba(194, 133, 59, 0.22)',
      themeColor: '#c2853b',
    },
    dark: {
      surfaceColor: '#251c12',
      surfaceElevated: '#312317',
      surfaceMuted: '#1e140c',
      heroGradient: 'linear-gradient(160deg, #7b5022 0%, #b98237 100%)',
      textColor: '#f6e8d4',
      mutedText: '#d1b48f',
      accent: '#d79b4f',
      accentContrast: '#120c05',
      borderColor: 'rgba(215, 155, 79, 0.3)',
      themeColor: '#312317',
    },
  },
  {
    id: 'rose',
    label: 'Rose',
    description: 'Zarif gül pembesi',
    light: {
      surfaceColor: '#fef2f6',
      surfaceElevated: '#ffffff',
      surfaceMuted: '#f8dceb',
      heroGradient: 'linear-gradient(160deg, #f4a6c5 0%, #cf6ec7 100%)',
      textColor: '#431f3a',
      mutedText: '#7d4d6a',
      accent: '#cf6ec7',
      accentContrast: '#fff6fb',
      borderColor: 'rgba(207, 110, 199, 0.22)',
      themeColor: '#cf6ec7',
    },
    dark: {
      surfaceColor: '#281627',
      surfaceElevated: '#331b32',
      surfaceMuted: '#1f1020',
      heroGradient: 'linear-gradient(160deg, #7a3771 0%, #b65aa5 100%)',
      textColor: '#fce5f5',
      mutedText: '#d4a2c7',
      accent: '#f19fd6',
      accentContrast: '#1b0b1a',
      borderColor: 'rgba(241, 159, 214, 0.28)',
      themeColor: '#331b32',
    },
  },
  {
    id: 'orchard',
    label: 'Orchard',
    description: 'Canlı bahçe tonları',
    light: {
      surfaceColor: '#f3f7f2',
      surfaceElevated: '#ffffff',
      surfaceMuted: '#e0f0e2',
      heroGradient: 'linear-gradient(160deg, #9ad593 0%, #4f9e6b 100%)',
      textColor: '#23402e',
      mutedText: '#4e6d51',
      accent: '#4f9e6b',
      accentContrast: '#f5fbf4',
      borderColor: 'rgba(79, 158, 107, 0.22)',
      themeColor: '#4f9e6b',
    },
    dark: {
      surfaceColor: '#132018',
      surfaceElevated: '#1d2d22',
      surfaceMuted: '#0e1a13',
      heroGradient: 'linear-gradient(160deg, #2f6d47 0%, #4ca777 100%)',
      textColor: '#ddeecc',
      mutedText: '#93c4a7',
      accent: '#7bd195',
      accentContrast: '#0a140f',
      borderColor: 'rgba(123, 209, 149, 0.3)',
      themeColor: '#1d2d22',
    },
  },
  {
    id: 'ember',
    label: 'Ember',
    description: 'Sıcak ateş tonları',
    light: {
      surfaceColor: '#fff3ed',
      surfaceElevated: '#ffffff',
      surfaceMuted: '#fde1d3',
      heroGradient: 'linear-gradient(160deg, #ffb17a 0%, #e7603b 100%)',
      textColor: '#4a261d',
      mutedText: '#865345',
      accent: '#e7603b',
      accentContrast: '#fff7f2',
      borderColor: 'rgba(231, 96, 59, 0.22)',
      themeColor: '#e7603b',
    },
    dark: {
      surfaceColor: '#2b1b16',
      surfaceElevated: '#361f19',
      surfaceMuted: '#1f120e',
      heroGradient: 'linear-gradient(160deg, #8a3828 0%, #d1613a 100%)',
      textColor: '#f9dfd5',
      mutedText: '#d49988',
      accent: '#ff9369',
      accentContrast: '#180d0a',
      borderColor: 'rgba(255, 147, 105, 0.3)',
      themeColor: '#361f19',
    },
  },
  {
    id: 'mist',
    label: 'Mist',
    description: 'Yumuşak gri-mavi',
    light: {
      surfaceColor: '#f4f6fb',
      surfaceElevated: '#ffffff',
      surfaceMuted: '#e4e9f3',
      heroGradient: 'linear-gradient(160deg, #b9c7e6 0%, #7d93c7 100%)',
      textColor: '#273247',
      mutedText: '#55607a',
      accent: '#7d93c7',
      accentContrast: '#f7f9ff',
      borderColor: 'rgba(125, 147, 199, 0.22)',
      themeColor: '#7d93c7',
    },
    dark: {
      surfaceColor: '#161b26',
      surfaceElevated: '#1f2633',
      surfaceMuted: '#111622',
      heroGradient: 'linear-gradient(160deg, #374366 0%, #6282c1 100%)',
      textColor: '#e2e9ff',
      mutedText: '#9fb1d6',
      accent: '#8ea4e8',
      accentContrast: '#0c111f',
      borderColor: 'rgba(142, 164, 232, 0.28)',
      themeColor: '#1f2633',
    },
  },
  {
    id: 'aurora',
    label: 'Aurora',
    description: 'Kuzey ışıkları hissi',
    light: {
      surfaceColor: '#f3f6ff',
      surfaceElevated: '#ffffff',
      surfaceMuted: '#e4ecfb',
      heroGradient: 'linear-gradient(160deg, #a2b4ff 0%, #4cc7c0 100%)',
      textColor: '#1f2d4a',
      mutedText: '#4a5f7f',
      accent: '#4cc7c0',
      accentContrast: '#f6fffe',
      borderColor: 'rgba(76, 199, 192, 0.22)',
      themeColor: '#4cc7c0',
    },
    dark: {
      surfaceColor: '#101825',
      surfaceElevated: '#172231',
      surfaceMuted: '#0b1521',
      heroGradient: 'linear-gradient(160deg, #364f9b 0%, #2daaa4 100%)',
      textColor: '#def4f4',
      mutedText: '#9bc9c8',
      accent: '#70f1e9',
      accentContrast: '#071117',
      borderColor: 'rgba(112, 241, 233, 0.35)',
      themeColor: '#172231',
    },
  },
  {
    id: 'sapphire',
    label: 'Sapphire',
    description: 'Derin mavi tonları',
    light: {
      surfaceColor: '#eef2ff',
      surfaceElevated: '#ffffff',
      surfaceMuted: '#dfe6ff',
      heroGradient: 'linear-gradient(160deg, #8aa6ff 0%, #3f66d4 100%)',
      textColor: '#1d2a4d',
      mutedText: '#4a5c86',
      accent: '#3f66d4',
      accentContrast: '#f2f5ff',
      borderColor: 'rgba(63, 102, 212, 0.22)',
      themeColor: '#3f66d4',
    },
    dark: {
      surfaceColor: '#101527',
      surfaceElevated: '#182035',
      surfaceMuted: '#0b1122',
      heroGradient: 'linear-gradient(160deg, #2f4ea0 0%, #3f73d4 100%)',
      textColor: '#dbe3ff',
      mutedText: '#93a6e6',
      accent: '#6f9bff',
      accentContrast: '#090e1a',
      borderColor: 'rgba(111, 155, 255, 0.34)',
      themeColor: '#182035',
    },
  },
];

const THEME_PRESET_MAP = new Map(THEME_PRESETS.map((preset) => [preset.id, preset]));

function isValidHex(value) {
  return typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

function hexToRgb(hex) {
  if (!isValidHex(hex)) {
    return null;
  }
  let value = hex.trim().replace('#', '');
  if (value.length === 3) {
    value = value.split('').map((char) => char + char).join('');
  }
  const numeric = Number.parseInt(value, 16);
  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255,
  };
}

function rgbToHex(r, g, b) {
  const toHex = (component) => Math.max(0, Math.min(255, Math.round(component))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixColors(colorA, colorB, ratio = 0.5) {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  if (!rgbA || !rgbB) {
    return colorA;
  }
  const clamped = Math.max(0, Math.min(1, ratio));
  const r = rgbA.r * (1 - clamped) + rgbB.r * clamped;
  const g = rgbA.g * (1 - clamped) + rgbB.g * clamped;
  const b = rgbA.b * (1 - clamped) + rgbB.b * clamped;
  return rgbToHex(r, g, b);
}

function toRgba(hex, alpha) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return '';
  }
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampedAlpha})`;
}

function deriveAlphaColor(color, alpha, fallback) {
  if (isValidHex(color)) {
    const value = toRgba(color, alpha);
    if (value) {
      return value;
    }
  }
  return fallback;
}

function createHighlightGradient(accent, mode, fallback) {
  if (!isValidHex(accent)) {
    return fallback;
  }
  const startAlpha = mode === 'dark' ? 0.24 : 0.14;
  const endAlpha = mode === 'dark' ? 0.12 : 0.05;
  const mixTarget = mode === 'dark' ? '#000000' : '#ffffff';
  const endColor = mixColors(accent, mixTarget, mode === 'dark' ? 0.4 : 0.6);
  const start = toRgba(accent, startAlpha);
  const end = toRgba(endColor, endAlpha);
  if (!start || !end) {
    return fallback;
  }
  return `linear-gradient(140deg, ${start} 0%, ${end} 100%)`;
}

function normalizeThemeSelection(selection) {
  const themeId = selection && THEME_PRESET_MAP.has(selection.themeId) ? selection.themeId : DEFAULT_THEME_ID;
  const mode = selection && selection.mode === 'dark' ? 'dark' : DEFAULT_THEME_MODE;
  return { themeId, mode };
}

function loadThemeSelection() {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) {
      return { themeId: DEFAULT_THEME_ID, mode: DEFAULT_THEME_MODE };
    }
    const parsed = JSON.parse(raw);
    return normalizeThemeSelection(parsed);
  } catch (error) {
    console.warn('Tema seçimi okunamadı, varsayılan kullanılacak.', error);
    return { themeId: DEFAULT_THEME_ID, mode: DEFAULT_THEME_MODE };
  }
}

function saveThemeSelection(selection) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(selection));
  } catch (error) {
    console.warn('Tema seçimi kaydedilemedi.', error);
  }
}

function updateMetaThemeColor(color) {
  const metaTag = document.querySelector('meta[name="theme-color"]');
  if (!metaTag || typeof color !== 'string') {
    return;
  }
  const value = color.trim();
  if (!value) {
    return;
  }

  try {
    if (metaTag.parentNode) {
      const replacement = metaTag.cloneNode(true);
      replacement.setAttribute('content', value);
      metaTag.parentNode.replaceChild(replacement, metaTag);
    } else {
      metaTag.setAttribute('content', value);
    }
  } catch (error) {
    metaTag.setAttribute('content', value);
  }
}

function ensureBaseManifest() {
  if (state.manifestPromise) {
    return state.manifestPromise;
  }

  const link = document.querySelector('link[rel="manifest"]');
  if (!link) {
    state.manifestPromise = Promise.resolve(null);
    return state.manifestPromise;
  }

  try {
    const href = link.getAttribute('href');
    if (!href) {
      state.manifestPromise = Promise.resolve(null);
      return state.manifestPromise;
    }
    const absolute = new URL(href, window.location.href).toString();
    state.manifestPromise = fetch(absolute, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Manifest okunamadı: ${absolute}`);
        }
        return response.json();
      })
      .then((json) => {
        state.manifestBase = json;
        return json;
      })
      .catch((error) => {
        console.warn('Manifest yüklenemedi, dinamik güncelleme atlanacak.', error);
        return null;
      });
    return state.manifestPromise;
  } catch (error) {
    console.warn('Manifest okunurken hata oluştu.', error);
    state.manifestPromise = Promise.resolve(null);
    return state.manifestPromise;
  }
}

function updateManifestThemeColor(themeColor, backgroundColor) {
  if (!isValidHex(themeColor)) {
    return;
  }

  ensureBaseManifest().then((baseManifest) => {
    if (!baseManifest) {
      return;
    }

    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      return;
    }

    const nextManifest = {
      ...baseManifest,
      theme_color: themeColor,
      background_color: isValidHex(backgroundColor) ? backgroundColor : baseManifest.background_color,
    };

    try {
      if (state.manifestBlobUrl) {
        URL.revokeObjectURL(state.manifestBlobUrl);
        state.manifestBlobUrl = null;
      }
    } catch (_error) {
      // ignore
    }

    try {
      const blob = new Blob([JSON.stringify(nextManifest)], { type: 'application/manifest+json' });
      const objectUrl = URL.createObjectURL(blob);
      manifestLink.setAttribute('href', objectUrl);
      state.manifestBlobUrl = objectUrl;
    } catch (error) {
      console.warn('Manifest güncellenemedi.', error);
    }
  });
}

const PRAYER_CONFIG = {
  home: { label: 'Anasayfa', homepage: true },
  sabah: {
    label: 'Sabah',
    markdown: { tr: 'sabah.md', ar: 'sabahCleanAR.md' },
    supportsDua: true,
  },
  ogle: {
    label: 'Öğle',
    markdown: { tr: 'OgleTesbihat.md', ar: 'oglenCleanAR.md' },
    supportsDua: true,
  },
  ikindi: {
    label: 'İkindi',
    markdown: { tr: 'IkindiTesbihat.md', ar: 'ikindiCleanAR.md' },
    supportsDua: true,
  },
  aksam: {
    label: 'Akşam',
    markdown: { tr: 'AksamTesbihat.md', ar: 'aksamCleanAR.md' },
    supportsDua: true,
  },
  yatsi: {
    label: 'Yatsı',
    markdown: { tr: 'YatsiTesbihat.md', ar: 'yatsiCleanAR.md' },
    supportsDua: true,
  },
  cevsen: {
    label: 'Cevşen-i Kebîr',
    cevsen: true,
  },
  zikirler: {
    label: 'Zikirler',
    zikirManager: true,
  },
  dualar: {
    label: 'Dualar',
    description: 'Dua içeriklerini görmek için seçim yapın.',
    items: [
      {
        id: 'aksam-yatsi-arasi-zikirler',
        label: 'Bediüzzaman hz.lerinin Akşam Yatsı Arası Okuduğu Zikirler',
        markdown: 'AksamYatsiZikirleri.md',
        disableNameAnnotations: true,
      },
      {
        id: 'gunluk-zikirler',
        label: 'Günlük Zikirler',
        markdown: 'GunlukZikirler.md',
        disableNameAnnotations: true,
      },
    ],
  },
  ucaylar: {
    label: 'Üç Aylar',
    description: 'Recep, Şaban ve Ramazan içerikleri ve çetele takibi.',
    items: [
      { id: 'recep', label: 'Recep', view: 'ucaylar-month', monthKey: 'recep' },
      { id: 'saban', label: 'Şaban', view: 'ucaylar-month', monthKey: 'saban' },
      { id: 'ramazan', label: 'Ramazan', view: 'ucaylar-month', monthKey: 'ramazan' },
    ],
  },
  ortakdua: {
    label: 'Ortak Dua',
    description: 'Ortak hatim ve Cevşen okuma odaları.',
    sharedDua: true,
  },
};

const CEVSEN_PARTS = [
  { id: 'part-1-10', label: '1-10', range: '1-10', path: 'cevsen/cevsen1-10.md' },
  { id: 'part-11-20', label: '11-20', range: '11-20', path: 'cevsen/cevsen11-20.md' },
  { id: 'part-21-30', label: '21-30', range: '21-30', path: 'cevsen/cevsen21-30.md' },
  { id: 'part-31-40', label: '31-40', range: '31-40', path: 'cevsen/cevsen31-40.md' },
  { id: 'part-41-50', label: '41-50', range: '41-50', path: 'cevsen/cevsen41-50.md' },
  { id: 'part-51-60', label: '51-60', range: '51-60', path: 'cevsen/cevsen51-60.md' },
  { id: 'part-61-70', label: '61-70', range: '61-70', path: 'cevsen/cevsen61-70.md' },
  { id: 'part-71-80', label: '71-80', range: '71-80', path: 'cevsen/cevsen71-80.md' },
  { id: 'part-81-90', label: '81-90', range: '81-90', path: 'cevsen/cevsen81-90.md' },
  { id: 'part-91-100', label: '91-100', range: '91-100', path: 'cevsen/cevsen91-100.md' },
  { id: 'part-prayer', label: 'Dua', isPrayer: true, path: 'cevsen/cevsen-prayer.md' },
];

const CEVSEN_PART_MAP = new Map(CEVSEN_PARTS.map((part) => [part.id, part]));

const HOME_QUICK_LINKS = [
  {
    id: 'cevsen',
    label: 'Cevşen',
    description: 'Bablar ve dua metni',
    icon: '📜',
  },
  {
    id: 'zikirler',
    label: 'Zikirler',
    description: 'Günlük zikirlere erişim',
    icon: '📿',
  },
  {
    id: 'dualar',
    label: 'Dualar',
    description: 'Dua arşivine göz at',
    icon: '🤲🏼',
  },
  {
    id: 'ucaylar',
    label: 'Üç Aylar',
    description: 'İçerikler ve çetele takibi',
    icon: '🌙',
  },
  {
    id: 'ortakdua',
    label: 'Ortak Dua',
    description: 'Ortak hatim ve Cevşen',
    icon: '🤝',
  },
];

const DUA_SOURCES = {
  birkirikdilekce: { label: 'Bir Kırık Dilekçe', path: 'BirKirikDilekce.txt' },
  kurandualari: { label: 'Kur\'an-ı Kerimden Dualar', path: 'KuranDualari.txt' },
  hadislerden: { label: 'Hadislerden Dualar', path: 'HadislerdenDualar.txt' },
  all: { label: 'Tüm Dualar', composite: true },
};

const DUA_SOURCE_ORDER = ['all', 'birkirikdilekce', 'kurandualari', 'hadislerden'];

const SINGLE_TOOLTIP_NAMES = new Set(['allah', 'rahman']);
const ARABIC_SCRIPT_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

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

const MANUAL_NAME_KEYS = {
  "allah": "Allah",
  "errahman": "Er-Rahmân",
  "errahmanu": "Er-Rahmân",
  "errahim": "Er-Rahîm",
  "errahimu": "Er-Rahîm",
  "elmelik": "El-Melik",
  "elmeliku": "El-Melik",
  "elkuddus": "El-Kuddûs",
  "elkuddusu": "El-Kuddûs",
  "esselam": "Es-Selâm",
  "esselamu": "Es-Selâm",
  "elmumin": "El-Mü'min",
  "elmuminu": "El-Mü'min",
  "elmuheymin": "El-Müheymin",
  "elmuheyminu": "El-Müheymin",
  "elaziz": "El-Azîz",
  "elazizu": "El-Azîz",
  "elcebbar": "El-Cebbâr",
  "elcebbaru": "El-Cebbâr",
  "elmutekebbir": "El-Mütekebbir",
  "elmutekebbiru": "El-Mütekebbir",
  "elhalik": "El-Hâlık",
  "elhaliku": "El-Hâlık",
  "elbari": "El-Bâri",
  "elbariu": "El-Bâri",
  "elmusavvir": "El-Musavvir",
  "elmusavviru": "El-Musavvir",
  "elgaffar": "El-Gaffâr",
  "elgaffaru": "El-Gaffâr",
  "elkahhar": "El-Kahhâr",
  "elkahharu": "El-Kahhâr",
  "elvehhab": "El-Vehhâb",
  "elvehhabu": "El-Vehhâb",
  "errezzak": "Er-Rezzâk",
  "errezzaku": "Er-Rezzâk",
  "elfettah": "El-Fettâh",
  "elfettahu": "El-Fettâh",
  "elalim": "El-Alîm",
  "elalimu": "El-Alîm",
  "elkabid": "El-Kâbıd",
  "elkabidu": "El-Kâbıd",
  "elbasit": "El-Bâsıt",
  "elbasitu": "El-Bâsıt",
  "elhafid": "El-Hâfıd",
  "elhafidu": "El-Hâfıd",
  "errafi": "Er-Râfi",
  "errafiu": "Er-Râfi",
  "elmuiz": "El-Mu'ız",
  "elmuizu": "El-Mu'ız",
  "elmuzil": "El-Müzil",
  "elmuzilu": "El-Müzil",
  "essemi": "Es-Semi",
  "essemiu": "Es-Semi",
  "elbasir": "El-Basîr",
  "elbasiru": "El-Basîr",
  "elhakem": "El-Hakem",
  "elhakemu": "El-Hakem",
  "eladl": "El-Adl",
  "eladlu": "El-Adl",
  "ellatif": "El-Latîf",
  "ellatifu": "El-Latîf",
  "elhabir": "El-Habîr",
  "elhabiru": "El-Habîr",
  "elhalim": "El-Halîm",
  "elhalimu": "El-Halîm",
  "elazim": "El-Azîm",
  "elazimu": "El-Azîm",
  "elgafur": "El-Gafûr",
  "elgafuru": "El-Gafûr",
  "essekur": "Eş-Şekûr",
  "essekuru": "Eş-Şekûr",
  "elaliyy": "El-Aliyy",
  "elaliyyu": "El-Aliyy",
  "elkebir": "El-Kebîr",
  "elkebiru": "El-Kebîr",
  "elhafiz": "El-Hafîz",
  "elhafizu": "El-Hafîz",
  "elmukit": "El-Mukît",
  "elmukitu": "El-Mukît",
  "elhasib": "El-Hasîb",
  "elhasibu": "El-Hasîb",
  "elcelil": "El-Celîl",
  "elcelilu": "El-Celîl",
  "elkerim": "El-Kerîm",
  "elkerimu": "El-Kerîm",
  "errakib": "Er-Rakîb",
  "errakibu": "Er-Rakîb",
  "elmucib": "El-Mucîb",
  "elmucibu": "El-Mucîb",
  "elvasi": "El-Vâsi",
  "elvasiu": "El-Vâsi",
  "elhakim": "El-Hakîm",
  "elhakimu": "El-Hakîm",
  "elvedud": "El-Vedûd",
  "elvedudu": "El-Vedûd",
  "elmecid": "El-Mecîd",
  "elmecidu": "El-Mecîd",
  "elbais": "El-Bâis",
  "elbaisu": "El-Bâis",
  "essehid": "Eş-Şehîd",
  "essehidu": "Eş-Şehîd",
  "elhakk": "El-Hakk",
  "elhakku": "El-Hakk",
  "elvekil": "El-Vekîl",
  "elvekilu": "El-Vekîl",
  "elkaviyy": "El-Kaviyy",
  "elkaviyyu": "El-Kaviyy",
  "elmetin": "El-Metîn",
  "elmetinu": "El-Metîn",
  "elveliyy": "El-Veliyy",
  "elveliyyu": "El-Veliyy",
  "elhamid": "El-Hamîd",
  "elhamidu": "El-Hamîd",
  "elmuhsi": "El-Muhsî",
  "elmuhsiu": "El-Muhsî",
  "elmubdi": "El-Mübdi",
  "elmubdiu": "El-Mübdi",
  "elmuid": "El-Muîd",
  "elmuidu": "El-Muîd",
  "elmuhyi": "El-Muhyî",
  "elmuhyiu": "El-Muhyî",
  "elmumit": "El-Mümît",
  "elmumitu": "El-Mümît",
  "elhayy": "El-Hayy",
  "elhayyu": "El-Hayy",
  "elkayyum": "El-Kayyûm",
  "elkayyumu": "El-Kayyûm",
  "elvacid": "El-Vâcid",
  "elvacidu": "El-Vâcid",
  "elmacid": "El-Macîd",
  "elmacidu": "El-Macîd",
  "elvahid": "El-Vâhid",
  "elvahidu": "El-Vâhid",
  "essamed": "Es-Samed",
  "essamedu": "Es-Samed",
  "elkadir": "El-Kâdir",
  "elkadiru": "El-Kâdir",
  "elmuktedir": "El-Muktedir",
  "elmuktediru": "El-Muktedir",
  "elmukaddim": "El-Mukaddim",
  "elmukaddimu": "El-Mukaddim",
  "elmuahhir": "El-Muahhir",
  "elmuahhiru": "El-Muahhir",
  "elevvel": "El-Evvel",
  "elevvelu": "El-Evvel",
  "elahir": "El-Âhir",
  "elahiru": "El-Âhir",
  "elzahir": "El-Zâhir",
  "elzahiru": "El-Zâhir",
  "elbatin": "El-Bâtın",
  "elbatinu": "El-Bâtın",
  "elvali": "El-Vâlî",
  "elvaliu": "El-Vâlî",
  "elmuteali": "El-Müteâlî",
  "elmutealiu": "El-Müteâlî",
  "elberr": "El-Berr",
  "elberru": "El-Berr",
  "ettevvab": "Et-Tevvâb",
  "ettevvabu": "Et-Tevvâb",
  "elmuntekim": "El-Müntekim",
  "elmuntekimu": "El-Müntekim",
  "elafuvv": "El-Afüvv",
  "elafuvvu": "El-Afüvv",
  "errauf": "Er-Raûf",
  "erraufu": "Er-Raûf",
  "malikulmulk": "Mâlik-ül Mülk",
  "malikulmulku": "Mâlik-ül Mülk",
  "zulcelalivelikram": "Zül-Celâli vel ikrâm",
  "zulcelalivelikramu": "Zül-Celâli vel ikrâm",
  "elmuksit": "El-Muksit",
  "elmuksitu": "El-Muksit",
  "elcami": "El-Câmi",
  "elcamiu": "El-Câmi",
  "elganiyy": "El-Ganiyy",
  "elganiyyu": "El-Ganiyy",
  "elmugni": "El-Mugnî",
  "elmugniu": "El-Mugnî",
  "elmani": "El-Mâni",
  "elmaniu": "El-Mâni",
  "eddarr": "Ed-Dârr",
  "eddarru": "Ed-Dârr",
  "ennafi": "En-Nâfi",
  "ennafiu": "En-Nâfi",
  "ennur": "En-Nûr",
  "ennuru": "En-Nûr",
  "elhadi": "El-Hâdî",
  "elhadiu": "El-Hâdî",
  "elbedi": "El-Bedî",
  "elbediu": "El-Bedî",
  "elbaki": "El-Bâkî",
  "elbakiu": "El-Bâkî",
  "elvaris": "El-Vâris",
  "elvarisu": "El-Vâris",
  "erresid": "Er-Reşîd",
  "erresidu": "Er-Reşîd",
  "essabur": "Es-Sabûr",
  "essaburu": "Es-Sabûr"
};

const state = {
  appRoot: null,
  counters: loadCounters(),
  themeSelection: loadThemeSelection(),
  currentPrayer: 'home',
  duaSource: loadSelectedDuaSource(),
  duaCache: {},
  duaState: null,
  duaStates: new Map(),
  duas: [],
  duaSourceSelect: null,
  duaResetButton: null,
  showArabicDuas: loadDuaArabicPreference(),
  showTranslations: loadTranslationVisibility(),
  language: loadLanguageSelection(),
  zikirRepository: null,
  zikirDefaults: null,
  zikirs: [],
  zikirUI: null,
  zikirView: DEFAULT_ZIKIR_VIEW,
  completionData: loadCompletionData(),
  completionButtons: new Map(),
  fontScale: loadFontScale(),
  ucaylar: {
    data: loadUcAylarData(),
  },
  sharedDua: {
    ui: null,
    pendingRoomId: null,
    lastRoomId: loadSharedDuaLastRoomId(),
  },
  names: null,
  tooltipElement: null,
  activeTooltipTarget: null,
  nameLookup: new Map(),
  nameKeys: new Map(),
  missingNames: new Set(),
  importanceMessages: null,
  activeImportanceMessage: null,
  installPromptEvent: null,
  installPromptVisible: false,
  themeOptionElements: new Map(),
  manifestBase: null,
  manifestBlobUrl: null,
  manifestPromise: null,
  duaUI: null,
  personalDuaEnabled: loadPersonalDuaEnabled(),
  personalDuaText: loadPersonalDuaText(),
  personalDuaEditing: false,
  duaMode: 'predefined',
  duaFavorites: loadDuaFavorites(),
  duaFavoritesLookup: new Set(),
  duaFavoritesList: [],
  duaFavoritesIndex: 0,
  homeFeaturesHtml: null,
  languageToggleButtons: new Map(),
  cevsen: {
    activePartId: null,
    lastPartId: null,
    fontScale: loadCevsenFontScale(),
    visibility: loadCevsenVisibility(),
    partCache: new Map(),
    root: null,
    viewContainer: null,
    toolbar: null,
    settings: null,
  },
  homeStats: {
    card: null,
    container: null,
    toggle: null,
    collapsed: loadHomeStatsCollapsed(),
  },
  scrollTopButton: null,
  translationToggle: null,
  contentToolbar: {
    root: null,
    languageButtons: new Map(),
  },
};

rebuildDuaFavoritesState();

if (state.personalDuaEnabled) {
  state.duaMode = 'personal';
}

document.addEventListener('DOMContentLoaded', () => {
  const appRoot = document.querySelector('.app');
  if (!appRoot) {
    return;
  }

  if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
    console.info('[Tesbihat] Yerel önizleme için bir sunucu kullanın: `npx serve .` veya `python3 -m http.server 3000` → http://localhost:3000');
  }

  state.appRoot = appRoot;
  document.documentElement.setAttribute('lang', state.language === 'ar' ? 'ar' : 'tr');
  appRoot.dataset.appLanguage = state.language;
  appRoot.dataset.currentPrayer = state.currentPrayer;
  appRoot.dataset.showTranslations = state.showTranslations ? 'true' : 'false';
  applyTheme(appRoot, state.themeSelection);
  applyFontScale(state.fontScale);
  attachThemeToggle(appRoot);
  attachSettingsToggle(appRoot);
  initThemeSelector();
  initLanguageToggle();
  attachHomeNavigation(appRoot);
  attachHeroQuickLinks(appRoot);
  initPrayerTabs(appRoot);
  initDuaSourceSelector();
  initCompletionStatsView();
  initDuaArabicToggle();
  initPersonalDuaSettings();
  attachFontScaleControls(appRoot);
  attachSettingsActions();
  registerInstallPromptHandlers();
  initScrollTopButton();

  const sharedRoomId = parseSharedDuaRoomIdFromLocation();
  if (sharedRoomId) {
    state.sharedDua.pendingRoomId = sharedRoomId;
    state.currentPrayer = 'ortakdua';
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', () => {
      const nextRoomId = parseSharedDuaRoomIdFromLocation();
      if (!nextRoomId) {
        return;
      }
      state.sharedDua.pendingRoomId = nextRoomId;
      if (state.currentPrayer === 'ortakdua') {
        const content = document.getElementById('content');
        if (content) {
          renderSharedDua(content);
        }
        return;
      }
      setActivePrayer('ortakdua');
    });
  }

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
  if (!appRoot) {
    return;
  }
  const tabs = Array.from(appRoot.querySelectorAll('.prayer-tab'));

  tabs.forEach((tab) => {
    const isActive = tab.dataset.prayer === prayerId;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    if (isActive && typeof tab.scrollIntoView === 'function') {
      tab.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
  });

  const quickLinks = Array.from(appRoot.querySelectorAll('[data-hero-link]'));
  quickLinks.forEach((link) => {
    const isActive = link.dataset.prayer === prayerId;
    link.classList.toggle('is-active', isActive);
    link.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  appRoot.dataset.currentPrayer = prayerId;

  state.currentPrayer = config ? prayerId : 'sabah';

  loadPrayerContent(state.currentPrayer);

  const event = new CustomEvent('prayerchange', { detail: { prayerId: state.currentPrayer } });
  document.dispatchEvent(event);
}

async function loadPrayerContent(prayerId) {
  const content = document.getElementById('content');
  if (!content) {
    return;
  }

  const config = PRAYER_CONFIG[prayerId];
  if (!config || !config.cevsen) {
    closeCevsenSettings({ immediate: true });
    if (state.cevsen) {
      state.cevsen.root = null;
      state.cevsen.viewContainer = null;
      state.cevsen.toolbar = null;
    }
  }
  if (!config || !config.sharedDua) {
    cleanupSharedDuaUI();
  }

  if (!config) {
    content.innerHTML = `<div class="card">Seçtiğiniz vakit bulunamadı.</div>`;
    return;
  }

  if (config.homepage) {
    await renderHomePage(content);
    return;
  }

  if (config.cevsen) {
    await renderCevsen(content, config);
    return;
  }

  if (config.zikirManager) {
    await renderZikirManager(content);
    return;
  }

  if (config.sharedDua) {
    await renderSharedDua(content);
    return;
  }

  if (Array.isArray(config.items)) {
    renderPrayerCollection(content, prayerId, config);
    return;
  }

  content.innerHTML = `<div class="loading">İçerik yükleniyor…</div>`;

  const markdownPath = resolveMarkdownPath(config.markdown, state.language);

  if (!markdownPath) {
    content.innerHTML = `
      <article class="card">
        <h2>${config.label} Tesbihatı</h2>
        <p>Bu vakte ait içerik yakında eklenecek.</p>
      </article>
    `;
    return;
  }

  try {
    const markdown = await fetchText(markdownPath);
    renderTesbihat(content, markdown);

    await ensureNamesLoaded();
    annotateNames(content);
    setupCounters(content, prayerId);

    if (config.supportsDua) {
      await changeDuaSource(state.duaSource, { persist: false, refresh: false });
      setupDuaSection(content, state.duas, state.duaSource);
    }

    renderPrayerCompletionCard(content, prayerId);
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

function renderPrayerCollection(container, prayerId, config) {
  hideNameTooltip();
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'collection-wrapper';

  const introCard = document.createElement('article');
  introCard.className = 'card collection-intro';

  const heading = document.createElement('h2');
  heading.className = 'collection-intro__title';
  heading.textContent = config.label;

  introCard.append(heading);

  if (config.description) {
    const description = document.createElement('p');
    description.className = 'collection-intro__description';
    description.textContent = config.description;
    introCard.append(description);
  }

  wrapper.append(introCard);

  const list = document.createElement('div');
  list.className = 'collection-list';

  if (Array.isArray(config.items) && config.items.length > 0) {
    config.items.forEach((item) => {
      const itemCard = document.createElement('article');
      itemCard.className = 'card collection-card';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'collection-card__button';
      button.addEventListener('click', () => {
        renderPrayerCollectionItem(container, prayerId, config, item);
      });

      const title = document.createElement('span');
      title.className = 'collection-card__title';
      title.textContent = item.label;

      const icon = document.createElement('span');
      icon.className = 'collection-card__icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '>';

      button.append(title, icon);
      itemCard.append(button);
      list.append(itemCard);
    });
  } else {
    const emptyCard = document.createElement('article');
    emptyCard.className = 'card collection-empty';
    emptyCard.textContent = 'Bu bölüm için henüz içerik eklenmedi.';
    list.append(emptyCard);
  }

  wrapper.append(list);

  if (prayerId === 'ucaylar') {
    wrapper.append(buildUcAylarSummaryCard());
  }

  container.append(wrapper);
}

function buildUcAylarSummaryCard() {
  const card = document.createElement('article');
  card.className = 'card ucaylar-summary';
  card.dataset.disableTooltips = 'true';

  const title = document.createElement('h3');
  title.textContent = 'Üç Aylar Tablosu';

  const description = document.createElement('p');
  description.className = 'muted';
  description.textContent = 'Sezon aralıklarına göre hesaplanan toplam puanlar.';

  const todayKey = getTodayKey();
  const recepRange = selectClosestUcAylarRange('recep', todayKey);
  const sabanRange = selectClosestUcAylarRange('saban', todayKey);
  const ramazanRange = selectClosestUcAylarRange('ramazan', todayKey);

  const recepTotal = recepRange ? calculateUcAylarRangePoints('recep', recepRange, { createMissing: false }) : 0;
  const sabanTotal = sabanRange ? calculateUcAylarRangePoints('saban', sabanRange, { createMissing: false }) : 0;
  const ramazanTotal = ramazanRange ? calculateUcAylarRangePoints('ramazan', ramazanRange, { createMissing: false }) : 0;
  const grandTotal = recepTotal + sabanTotal + ramazanTotal;

  const table = document.createElement('table');
  table.className = 'stats-table ucaylar-summary__table';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Ay</th><th>Toplam puan</th></tr>';
  table.append(thead);

  const tbody = document.createElement('tbody');
  tbody.innerHTML = `
    <tr><th scope="row">Recep</th><td>${formatUcAylarPoints(recepTotal)}</td></tr>
    <tr><th scope="row">Şaban</th><td>${formatUcAylarPoints(sabanTotal)}</td></tr>
    <tr><th scope="row">Ramazan</th><td>${formatUcAylarPoints(ramazanTotal)}</td></tr>
  `;
  table.append(tbody);

  const tfoot = document.createElement('tfoot');
  tfoot.innerHTML = `<tr><th scope="row">Toplam Üç Aylar</th><td>${formatUcAylarPoints(grandTotal)}</td></tr>`;
  table.append(tfoot);

  const hint = document.createElement('p');
  hint.className = 'stats-hint';
  const recepText = recepRange ? `${recepRange.start} → ${recepRange.end}` : 'tanımsız';
  const sabanText = sabanRange ? `${sabanRange.start} → ${sabanRange.end}` : 'tanımsız';
  const ramazanText = ramazanRange ? `${ramazanRange.start} → ${ramazanRange.end}` : 'tanımsız';
  hint.textContent = `Aralıklar: Recep ${recepText} • Şaban ${sabanText} • Ramazan ${ramazanText}`;

  card.append(title, description, table, hint);
  return card;
}

async function renderPrayerCollectionItem(container, prayerId, config, item) {
  hideNameTooltip();
  container.innerHTML = '';

  if (item && item.view === 'ucaylar-month' && item.monthKey) {
    renderUcAylarMonthView(container, item.monthKey, { parentPrayerId: prayerId, parentConfig: config });
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'collection-detail';

  const headerCard = document.createElement('article');
  headerCard.className = 'card collection-detail__header';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'collection-back button-pill secondary';
  backButton.textContent = `${config && config.label ? config.label : 'Liste'} listesine dön`;
  backButton.addEventListener('click', () => {
    renderPrayerCollection(container, prayerId, config);
  });

  const title = document.createElement('h2');
  title.className = 'collection-detail__title';
  title.textContent = item.label;

  headerCard.append(backButton, title);

  wrapper.append(headerCard);

  const contentCard = document.createElement('article');
  contentCard.className = 'card collection-detail__content';
  contentCard.innerHTML = `<div class="loading">İçerik yükleniyor…</div>`;

  const markdownPath = resolveMarkdownPath(item.markdown, state.language);

  wrapper.append(contentCard);

  container.append(wrapper);

  try {
    if (!markdownPath) {
      throw new Error('İçerik dosyası bulunamadı.');
    }
    const markdown = await fetchText(markdownPath);
    renderTesbihat(contentCard, markdown);
    if (!item.disableNameAnnotations) {
      await ensureNamesLoaded();
      annotateNames(contentCard);
    }
    setupCounters(contentCard, `${prayerId}-${item.id || 'item'}`);
  } catch (error) {
    console.error('Dua içeriği yüklenirken hata oluştu.', error);
    contentCard.innerHTML = `
      <p>İçerik yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
    `;
  }
}

function renderUcAylarMonthView(container, monthKey, options = {}) {
  hideNameTooltip();
  container.innerHTML = '';

  const month = UCAYLAR_MONTHS[monthKey];
  const parentPrayerId = options.parentPrayerId || 'ucaylar';
  const parentConfig = options.parentConfig || PRAYER_CONFIG[parentPrayerId] || PRAYER_CONFIG.ucaylar;
  const initialTab = options.initialTab === 'tracker' ? 'tracker' : 'content';

  if (!month) {
    container.innerHTML = `
      <article class="card">
        <h2>Üç Aylar</h2>
        <p>Seçilen ay bulunamadı.</p>
      </article>
    `;
    return;
  }

  const root = document.createElement('div');
  root.className = 'ucaylar-month';

  const headerCard = document.createElement('article');
  headerCard.className = 'card ucaylar-month__header';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'button-pill secondary';
  backButton.textContent = 'Üç Aylar listesine dön';
  backButton.addEventListener('click', () => {
    renderPrayerCollection(container, parentPrayerId, parentConfig);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  const title = document.createElement('h2');
  title.className = 'ucaylar-month__title';
  title.textContent = month.label;

  headerCard.append(backButton, title);
  root.append(headerCard);

  const tabs = document.createElement('div');
  tabs.className = 'ucaylar-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.innerHTML = `
    <button type="button" class="ucaylar-tab is-active" data-ucaylar-tab="content" aria-pressed="true">İçerikler</button>
    <button type="button" class="ucaylar-tab" data-ucaylar-tab="tracker" aria-pressed="false">Çetele</button>
  `;

  const panels = document.createElement('div');
  panels.className = 'ucaylar-panels';
  panels.innerHTML = `
    <div class="ucaylar-panel" data-ucaylar-panel="content"></div>
    <div class="ucaylar-panel" data-ucaylar-panel="tracker" hidden></div>
  `;

  root.append(tabs, panels);
  container.append(root);

  const tabButtons = Array.from(root.querySelectorAll('[data-ucaylar-tab]'));
  const contentPanel = root.querySelector('[data-ucaylar-panel="content"]');
  const trackerPanel = root.querySelector('[data-ucaylar-panel="tracker"]');

  const setTab = (nextTab) => {
    if (state.ucaylar) {
      state.ucaylar.activeMonthKey = monthKey;
      state.ucaylar.activeMonthTab = nextTab;
    }
    tabButtons.forEach((button) => {
      const isActive = button.dataset.ucaylarTab === nextTab;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    if (contentPanel) contentPanel.hidden = nextTab !== 'content';
    if (trackerPanel) trackerPanel.hidden = nextTab !== 'tracker';

    if (nextTab === 'content') {
      renderUcAylarContentPanel(contentPanel, monthKey);
    } else {
      renderUcAylarTrackerPanel(trackerPanel, monthKey);
    }
  };

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => setTab(button.dataset.ucaylarTab));
  });

  setTab(initialTab);
}

function renderUcAylarContentPanel(panel, monthKey) {
  const month = UCAYLAR_MONTHS[monthKey];
  if (!panel || !month) {
    return;
  }
  panel.innerHTML = `
    <article class="card">
      <h3>${month.label} içerikleri</h3>
      <p class="muted">İçerik listesi yükleniyor…</p>
    </article>
  `;

  loadUcAylarMonthManifest(monthKey)
    .then((manifest) => {
      renderUcAylarContentList(panel, monthKey, manifest);
    })
    .catch((error) => {
      console.warn('Üç Aylar manifest yüklenemedi.', error);
      panel.innerHTML = `
        <article class="card">
          <h3>İçerikler yüklenemedi</h3>
          <p>Bu ayın içerik listesi yüklenirken bir sorun yaşandı.</p>
        </article>
      `;
    });
}

async function loadUcAylarMonthManifest(monthKey) {
  const month = UCAYLAR_MONTHS[monthKey];
  if (!month) {
    throw new Error('Ay bulunamadı.');
  }
  const response = await fetch(month.manifestPath, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Manifest okunamadı: ${month.manifestPath}`);
  }
  return response.json();
}

function renderUcAylarContentList(panel, monthKey, manifest) {
  const month = UCAYLAR_MONTHS[monthKey];
  const items = manifest && Array.isArray(manifest.items) ? manifest.items : [];

  panel.innerHTML = '';

  const intro = document.createElement('article');
  intro.className = 'card';
  intro.innerHTML = `
    <h3>${(manifest && manifest.title) || (month ? month.label : 'İçerikler')}</h3>
    <p class="muted">Okumak istediğiniz başlığı seçin.</p>
  `;
  panel.append(intro);

  const list = document.createElement('div');
  list.className = 'collection-list';

  if (!items.length) {
    const empty = document.createElement('article');
    empty.className = 'card collection-empty';
    empty.textContent = 'Bu ay için henüz içerik eklenmedi.';
    list.append(empty);
    panel.append(list);
    return;
  }

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card collection-card';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'collection-card__button';
    button.addEventListener('click', () => {
      renderUcAylarContentDetail(panel, monthKey, manifest, item);
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    const title = document.createElement('span');
    title.className = 'collection-card__title';
    title.textContent = item.title || item.id || 'İçerik';

    const icon = document.createElement('span');
    icon.className = 'collection-card__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '>';

    button.append(title, icon);
    card.append(button);
    list.append(card);
  });

  panel.append(list);
}

function renderUcAylarContentDetail(panel, monthKey, manifest, item) {
  const month = UCAYLAR_MONTHS[monthKey];
  if (!panel || !item) {
    return;
  }

  panel.innerHTML = '';

  const headerCard = document.createElement('article');
  headerCard.className = 'card collection-detail__header';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'collection-back button-pill secondary';
  backButton.textContent = 'İçerik listesine dön';
  backButton.addEventListener('click', () => {
    renderUcAylarContentList(panel, monthKey, manifest);
  });

  const title = document.createElement('h3');
  title.className = 'collection-detail__title';
  title.textContent = item.title || item.id || (month ? month.label : 'İçerik');

  headerCard.append(backButton, title);
  panel.append(headerCard);

  const contentCard = document.createElement('article');
  contentCard.className = 'card collection-detail__content';
  contentCard.innerHTML = `<div class="loading">İçerik yükleniyor…</div>`;
  panel.append(contentCard);

  const monthBase = `${UCAYLAR_BASE_PATH}/${monthKey}/`;
  const markdownPath = item.markdown ? `${monthBase}${item.markdown}` : null;

  if (!markdownPath) {
    contentCard.innerHTML = `<p>İçerik dosyası bulunamadı.</p>`;
    return;
  }

  fetchText(markdownPath)
    .then(async (markdown) => {
      renderTesbihat(contentCard, markdown);
      await ensureNamesLoaded();
      annotateNames(contentCard);
      setupCounters(contentCard, `ucaylar-${monthKey}-${item.id || 'item'}`);
    })
    .catch((error) => {
      console.warn('Üç Aylar içeriği yüklenemedi.', error);
      contentCard.innerHTML = `<p>İçerik yüklenirken bir hata oluştu.</p>`;
    });
}

function renderUcAylarTrackerPanel(panel, monthKey) {
  const month = UCAYLAR_MONTHS[monthKey];
  if (!panel || !month) {
    return;
  }

  const storedDateKey = isValidDateKey(panel.dataset.ucaylarDate) ? panel.dataset.ucaylarDate : null;
  const todayKey = getTodayKey();
  const initialManageOpen = panel.dataset.ucaylarManageOpen === 'true';

  panel.dataset.ucaylarManageOpen = initialManageOpen ? 'true' : 'false';

  const root = document.createElement('div');
  root.className = 'ucaylar-tracker';

  const toolbarCard = document.createElement('article');
  toolbarCard.className = 'card ucaylar-tracker__toolbar';
  toolbarCard.innerHTML = `
    <div class="ucaylar-tracker__toolbar-row">
      <div class="ucaylar-tracker__heading">
        <h3>${month.label} çetelesi</h3>
        <p class="muted">Günlük girişleri kaydedip puanları takip edebilirsiniz.</p>
        <p class="muted" data-ucaylar-range></p>
      </div>
      <div class="ucaylar-tracker__actions">
        <label class="ucaylar-tracker__date">
          <span class="ucaylar-tracker__date-label">Tarih</span>
          <div class="ucaylar-tracker__date-control" role="group" aria-label="Tarih seçimi">
            <button type="button" class="button-pill secondary ucaylar-date-nav" data-ucaylar-prev aria-label="Önceki gün">‹</button>
            <input type="date" class="ucaylar-tracker__date-input" data-ucaylar-date>
            <button type="button" class="button-pill secondary ucaylar-date-nav" data-ucaylar-next aria-label="Sonraki gün">›</button>
          </div>
        </label>
        <button type="button" class="button-pill secondary" data-ucaylar-manage-toggle>Alanları Yönet</button>
      </div>
    </div>
    <div class="ucaylar-tracker__totals">
      <div class="ucaylar-total">
        <span class="ucaylar-total__label">Gün toplam puan</span>
        <strong class="ucaylar-total__value" data-ucaylar-day-total>0</strong>
      </div>
      <div class="ucaylar-total">
        <span class="ucaylar-total__label">Ay toplam puan</span>
        <strong class="ucaylar-total__value" data-ucaylar-month-total>0</strong>
      </div>
    </div>
  `;

  const managerOverlay = document.createElement('div');
  managerOverlay.className = 'settings-overlay ucaylar-field-overlay';
  managerOverlay.hidden = !initialManageOpen;
  managerOverlay.innerHTML = `
    <div class="settings-sheet card ucaylar-field-sheet" role="dialog" aria-modal="true" aria-labelledby="ucaylar-fields-title">
      <header class="settings-sheet__header">
        <h2 id="ucaylar-fields-title">Alanları yönet</h2>
        <button type="button" class="settings-close" data-ucaylar-fields-close aria-label="Alan yönetimini kapat">✕</button>
      </header>
      <p class="settings-sheet__intro">Etiket, puan, gizleme, tür ve sıralamayı buradan düzenleyin.</p>
      <div class="settings-sheet__content ucaylar-field-sheet__content">
        <section class="settings-section">
          <div class="ucaylar-field-manager__list" data-ucaylar-field-manager-list></div>
        </section>
        <section class="settings-section">
          <div class="ucaylar-field-manager__add">
            <h3>Yeni alan ekle</h3>
            <form class="ucaylar-field-manager__form" data-ucaylar-field-form novalidate>
              <label>
                <span>Etiket</span>
                <input type="text" name="label" autocomplete="off" required>
              </label>
              <label>
                <span>Tür</span>
                <select name="type">
                  <option value="checkbox">Onay kutusu</option>
                  <option value="number">Sayı</option>
                </select>
              </label>
              <label>
                <span>Puan</span>
                <input type="number" name="points" step="0.1" min="0" value="5">
              </label>
              <label>
                <span>Adım (sayı için)</span>
                <input type="number" name="step" step="1" min="1" value="1">
              </label>
              <button type="submit" class="settings-action-button">Ekle</button>
            </form>
          </div>
        </section>
      </div>
      <footer class="ucaylar-field-footer">
        <p class="settings-hint ucaylar-field-footer__status" data-ucaylar-field-status hidden></p>
        <div class="ucaylar-field-footer__actions">
          <button type="button" class="settings-action-button secondary" data-ucaylar-fields-reset disabled>Değişiklikleri Sıfırla</button>
          <button type="button" class="settings-action-button" data-ucaylar-fields-save disabled>Kaydet</button>
        </div>
      </footer>
      <div class="ucaylar-confirm-overlay" data-ucaylar-confirm hidden>
        <div class="ucaylar-confirm-sheet card" role="dialog" aria-modal="true" aria-labelledby="ucaylar-confirm-title">
          <h3 id="ucaylar-confirm-title">Alanı sil</h3>
          <p>Bu alan silinecek ve geçmiş kayıtlarınızdan kaldırılacak. Emin misiniz?</p>
          <div class="ucaylar-confirm__actions">
            <button type="button" class="settings-action-button secondary" data-ucaylar-confirm-cancel>İptal</button>
            <button type="button" class="settings-action-button" data-ucaylar-confirm-delete>Sil</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const fieldsCard = document.createElement('article');
  fieldsCard.className = 'card ucaylar-tracker__fields';
  fieldsCard.innerHTML = `<div class="ucaylar-tracker__fields-inner" data-ucaylar-fields></div>`;

  root.append(toolbarCard, fieldsCard);
  panel.innerHTML = '';
  panel.append(root);
  panel.append(managerOverlay);

  const dateInput = root.querySelector('[data-ucaylar-date]');
  const prevButton = root.querySelector('[data-ucaylar-prev]');
  const nextButton = root.querySelector('[data-ucaylar-next]');
  const manageToggle = root.querySelector('[data-ucaylar-manage-toggle]');
  const dayTotalEl = root.querySelector('[data-ucaylar-day-total]');
  const monthTotalEl = root.querySelector('[data-ucaylar-month-total]');
  const rangeInfoEl = root.querySelector('[data-ucaylar-range]');
  const fieldsContainer = root.querySelector('[data-ucaylar-fields]');
  const managerClose = managerOverlay.querySelector('[data-ucaylar-fields-close]');
  const managerList = managerOverlay.querySelector('[data-ucaylar-field-manager-list]');
  const managerForm = managerOverlay.querySelector('[data-ucaylar-field-form]');
  const managerSaveButton = managerOverlay.querySelector('[data-ucaylar-fields-save]');
  const managerResetButton = managerOverlay.querySelector('[data-ucaylar-fields-reset]');
  const managerStatus = managerOverlay.querySelector('[data-ucaylar-field-status]');
  const confirmBox = managerOverlay.querySelector('[data-ucaylar-confirm]');
  const confirmCancel = managerOverlay.querySelector('[data-ucaylar-confirm-cancel]');
  const confirmDelete = managerOverlay.querySelector('[data-ucaylar-confirm-delete]');

  let activeDateKey = storedDateKey || todayKey;
  let activeRange = null;
  let saveTimer = null;

  const updateRangeInfo = () => {
    if (!rangeInfoEl) {
      return;
    }
    if (activeRange) {
      rangeInfoEl.textContent = `Geçerli aralık: ${activeRange.start} → ${activeRange.end}`;
      return;
    }
    const knownRanges = listUcAylarRangesForMonth(monthKey);
    rangeInfoEl.textContent = knownRanges.length ? 'Bu yıl için tarih aralığı tanımlı değil.' : 'Bu ay için tarih aralığı tanımlı değil.';
  };

  const applyActiveRange = () => {
    if (dateInput) {
      if (activeRange) {
        dateInput.min = activeRange.start;
        dateInput.max = activeRange.end;
        const clamped = clampDateKeyToRange(activeDateKey, activeRange);
        if (clamped !== activeDateKey) {
          activeDateKey = clamped;
        }
      } else {
        dateInput.removeAttribute('min');
        dateInput.removeAttribute('max');
      }
      dateInput.value = activeDateKey;
    }
    panel.dataset.ucaylarDate = activeDateKey;
    updateRangeInfo();
  };

  const resolveRangeForDateKey = (dateKey) => {
    const contained = getUcAylarRangeForDate(monthKey, dateKey);
    if (contained) {
      return contained;
    }
    const year = Number.parseInt(dateKey.slice(0, 4), 10);
    if (!Number.isFinite(year)) {
      return null;
    }
    return getUcAylarRangeForStartYear(monthKey, year);
  };

  // Üç Aylar ayları için öncelik: bugüne en yakın tanımlı aralık.
  activeRange = selectClosestUcAylarRange(monthKey, todayKey) || resolveRangeForDateKey(activeDateKey);

  // Varsayılan tarih: (1) daha önce seçili tarih aralık içindeyse onu koru,
  // (2) bugün aralık içindeyse bugün,
  // (3) değilse bugünü aralığa clamp ederek en yakın sınır.
  if (activeRange) {
    if (storedDateKey && isDateKeyInRange(storedDateKey, activeRange)) {
      activeDateKey = storedDateKey;
    } else if (isDateKeyInRange(todayKey, activeRange)) {
      activeDateKey = todayKey;
    } else {
      activeDateKey = clampDateKeyToRange(todayKey, activeRange);
    }
  } else {
    activeDateKey = storedDateKey || todayKey;
  }

  applyActiveRange();

  if (dateInput) {
    dateInput.value = activeDateKey;
    dateInput.addEventListener('change', () => {
      const next = dateInput.value;
      if (!isValidDateKey(next)) {
        dateInput.value = activeDateKey;
        return;
      }
      activeDateKey = next;
      // Aralık tanımlıysa dışarı çıkan seçimi clamp et.
      applyActiveRange();
      if (activeRange && !isDateKeyInRange(activeDateKey, activeRange)) {
        activeDateKey = clampDateKeyToRange(activeDateKey, activeRange);
        applyActiveRange();
      }
      renderFields();
      updateTotals();
      updateNavButtons();
    });
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const updateNavButtons = () => {
    if (!prevButton && !nextButton) {
      return;
    }
    if (!activeRange) {
      if (prevButton) prevButton.disabled = false;
      if (nextButton) nextButton.disabled = false;
      return;
    }
    const currentUtcMs = dateKeyToUtcMs(activeDateKey);
    if (!Number.isFinite(currentUtcMs)) {
      if (prevButton) prevButton.disabled = true;
      if (nextButton) nextButton.disabled = true;
      return;
    }
    if (prevButton) prevButton.disabled = currentUtcMs <= activeRange.startUtcMs;
    if (nextButton) nextButton.disabled = currentUtcMs >= activeRange.endUtcMs;
  };

  const shiftActiveDateBy = (deltaDays) => {
    const currentUtcMs = dateKeyToUtcMs(activeDateKey);
    if (!Number.isFinite(currentUtcMs)) {
      return;
    }
    const nextKey = utcMsToDateKey(currentUtcMs + deltaDays * dayMs);
    if (!isValidDateKey(nextKey)) {
      return;
    }
    activeDateKey = nextKey;
    if (activeRange) {
      activeDateKey = clampDateKeyToRange(activeDateKey, activeRange);
    }
    applyActiveRange();
    renderFields();
    updateTotals();
    updateNavButtons();
  };

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (prevButton.disabled) {
        return;
      }
      shiftActiveDateBy(-1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (nextButton.disabled) {
        return;
      }
      shiftActiveDateBy(1);
    });
  }

  const closeManagerOverlay = () => {
    closeDeleteConfirm();
    managerOverlay.hidden = true;
    panel.dataset.ucaylarManageOpen = 'false';
  };

  const openManagerOverlay = () => {
    managerOverlay.hidden = false;
    panel.dataset.ucaylarManageOpen = 'true';
    renderManager();
    const firstInput = managerOverlay.querySelector('input, select, button');
    if (firstInput && typeof firstInput.focus === 'function') {
      firstInput.focus();
    }
  };

  if (managerClose) {
    managerClose.addEventListener('click', closeManagerOverlay);
  }

  managerOverlay.addEventListener('click', (event) => {
    if (event.target === managerOverlay) {
      closeManagerOverlay();
    }
  });

  managerOverlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (confirmBox && !confirmBox.hidden) {
        closeDeleteConfirm();
        return;
      }
      closeManagerOverlay();
    }
  });

  if (manageToggle) {
    manageToggle.addEventListener('click', () => {
      openManagerOverlay();
    });
  }

  const scheduleSave = () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
    saveTimer = setTimeout(() => {
      saveTimer = null;
      saveUcAylarData(state.ucaylar.data);
    }, 200);
  };

  const getActiveYear = () => Number.parseInt(activeDateKey.split('-')[0], 10);

  const setManagerStatus = (message) => {
    if (!managerStatus) {
      return;
    }
    if (!message) {
      managerStatus.hidden = true;
      managerStatus.textContent = '';
      return;
    }
    managerStatus.hidden = false;
    managerStatus.textContent = message;
  };

  const cloneFields = (fields) => (Array.isArray(fields) ? fields.map((field) => ({ ...field })) : []);
  const normalizeDraftFields = (fields) => cloneFields(fields).map((field) => normalizeUcAylarField(field)).filter(Boolean);

  const listConfigYears = () => {
    if (!activeRange) {
      const year = getActiveYear();
      return Number.isFinite(year) ? [year] : [];
    }
    const years = new Set();
    iterateDateKeysInRange(activeRange).forEach((dateKey) => {
      const year = Number.parseInt(dateKey.slice(0, 4), 10);
      if (Number.isFinite(year)) {
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => a - b);
  };

  const baseConfigYear = activeRange ? Number.parseInt(activeRange.start.slice(0, 4), 10) : getActiveYear();
  const persistedConfigTracker = Number.isFinite(baseConfigYear) ? ensureDefaultUcAylarTracker(baseConfigYear, monthKey) : ensureDefaultUcAylarTracker(getActiveYear(), monthKey);

  let persistedFieldsSnapshot = cloneFields(persistedConfigTracker.fields);
  let persistedRemovedDefaultsSnapshot = normalizeUcAylarRemovedDefaultFieldIds(persistedConfigTracker.removedDefaultFieldIds);
  let draftFields = cloneFields(persistedFieldsSnapshot);
  let draftRemovedDefaults = new Set(persistedRemovedDefaultsSnapshot);
  let draftDirty = false;
  let pendingDeleteFieldId = null;

  const setDraftDirty = (dirty) => {
    draftDirty = Boolean(dirty);
    if (managerSaveButton) {
      managerSaveButton.disabled = !draftDirty;
    }
    if (managerResetButton) {
      managerResetButton.disabled = !draftDirty;
    }
  };

  const getFieldPoints = (field) => (field && field.type === 'checkbox' ? field.pointsWhenDone : field.pointsPerUnit);
  const setFieldPoints = (field, points) => {
    const normalizedPoints = Number.isFinite(Number(points)) ? Math.max(0, Number(points)) : 0;
    if (!field) {
      return;
    }
    if (field.type === 'checkbox') {
      field.pointsWhenDone = normalizedPoints;
      return;
    }
    field.pointsPerUnit = normalizedPoints;
    if (!Number.isFinite(Number(field.step)) || Number(field.step) < 1) {
      field.step = 1;
    }
  };

  const closeDeleteConfirm = () => {
    pendingDeleteFieldId = null;
    if (confirmBox) {
      confirmBox.hidden = true;
    }
  };

  const openDeleteConfirm = (fieldId) => {
    pendingDeleteFieldId = fieldId;
    if (confirmBox) {
      confirmBox.hidden = false;
    }
  };

  if (confirmCancel) {
    confirmCancel.addEventListener('click', closeDeleteConfirm);
  }

  if (confirmDelete) {
    confirmDelete.addEventListener('click', () => {
      const fieldId = pendingDeleteFieldId;
      closeDeleteConfirm();
      if (!fieldId) {
        return;
      }
      const remaining = draftFields.filter((field) => field && field.id !== fieldId);
      if (remaining.length === draftFields.length) {
        return;
      }
      draftFields = remaining;
      if (monthKey === 'ramazan' && fieldId === UCAYLAR_RAMAZAN_DEFAULT_FIELD_ID) {
        draftRemovedDefaults.add(UCAYLAR_RAMAZAN_DEFAULT_FIELD_ID);
      }
      setDraftDirty(true);
      renderManager();
      setManagerStatus('Silme işlemi kaydedilmek üzere hazır.');
    });
  }

  if (managerResetButton) {
    managerResetButton.addEventListener('click', () => {
      draftFields = cloneFields(persistedFieldsSnapshot);
      draftRemovedDefaults = new Set(persistedRemovedDefaultsSnapshot);
      setDraftDirty(false);
      closeDeleteConfirm();
      renderManager();
      setManagerStatus('Değişiklikler sıfırlandı.');
      window.setTimeout(() => setManagerStatus(''), 2000);
    });
  }

  const applyDraftToTrackers = () => {
    const years = listConfigYears();
    if (!years.length) {
      return;
    }

    const nextFields = normalizeDraftFields(draftFields);
    const nextFieldMap = new Map(nextFields.map((field) => [field.id, field]));

    years.forEach((year) => {
      const tracker = ensureDefaultUcAylarTracker(year, monthKey);
      const beforeFields = Array.isArray(tracker.fields) ? tracker.fields.map((field) => normalizeUcAylarField(field)).filter(Boolean) : [];
      const beforeFieldMap = new Map(beforeFields.map((field) => [field.id, field]));

      // Silinen alanlar: entry.values'tan temizle
      beforeFields.forEach((field) => {
        if (!field || !field.id) {
          return;
        }
        if (!nextFieldMap.has(field.id)) {
          removeFieldFromEntries(tracker.entries, field.id);
        }
      });

      // Tür değişimi: entry.values içinde değerleri dönüştür
      nextFields.forEach((field) => {
        const previous = beforeFieldMap.get(field.id);
        if (!previous) {
          return;
        }
        if (previous.type !== field.type) {
          convertFieldValuesForTypeChange(tracker.entries, field.id, previous.type, field.type);
        }
      });

      // Alanları override et
      tracker.fields = cloneFields(nextFields);
      tracker.removedDefaultFieldIds = Array.from(draftRemovedDefaults).sort();

      // Alan tiplerine göre değerleri normalize et + artık kullanılmayan fieldId'leri düşür
      const currentFieldMap = new Map(tracker.fields.map((field) => [field.id, field]));
      Object.values(tracker.entries || {}).forEach((entry) => {
        if (!entry || typeof entry !== 'object') {
          return;
        }
        const values = entry.values && typeof entry.values === 'object' ? entry.values : {};
        entry.values = normalizeUcAylarEntryValues(values, currentFieldMap);
      });
    });

    saveUcAylarData(state.ucaylar.data);
    // Kaydettikten sonra snapshot güncelle
    const refreshed = Number.isFinite(baseConfigYear) ? ensureDefaultUcAylarTracker(baseConfigYear, monthKey) : ensureDefaultUcAylarTracker(getActiveYear(), monthKey);
    persistedFieldsSnapshot = cloneFields(refreshed.fields);
    persistedRemovedDefaultsSnapshot = normalizeUcAylarRemovedDefaultFieldIds(refreshed.removedDefaultFieldIds);
    draftFields = cloneFields(persistedFieldsSnapshot);
    draftRemovedDefaults = new Set(persistedRemovedDefaultsSnapshot);
    setDraftDirty(false);
    closeDeleteConfirm();
    renderFields();
    updateTotals();
  };

  if (managerSaveButton) {
    managerSaveButton.addEventListener('click', () => {
      if (!draftDirty) {
        return;
      }
      applyDraftToTrackers();
      renderManager();
      setManagerStatus('Değişiklikler kaydedildi.');
      window.setTimeout(() => setManagerStatus(''), 2500);
    });
  }

  const renderFields = () => {
    if (!fieldsContainer) {
      return;
    }

    const year = getActiveYear();
    const tracker = ensureDefaultUcAylarTracker(year, monthKey);
    const entry = ensureUcAylarEntry(tracker, activeDateKey);
    const visibleFields = tracker.fields.filter((field) => !field.hidden);

    fieldsContainer.innerHTML = '';

    if (!visibleFields.length) {
      fieldsContainer.innerHTML = `<p class="muted">Görüntülenecek alan yok. “Alanları Yönet” bölümünden alan ekleyebilirsiniz.</p>`;
      return;
    }

    visibleFields.forEach((field) => {
      const row = document.createElement('div');
      row.className = 'ucaylar-field';
      row.dataset.fieldId = field.id;

      const label = document.createElement('div');
      label.className = 'ucaylar-field__label';
      label.textContent = field.label;

      const inputWrap = document.createElement('div');
      inputWrap.className = 'ucaylar-field__input';

      const pointsWrap = document.createElement('div');
      pointsWrap.className = 'ucaylar-field__points';

      const pointsBadge = document.createElement('span');
      pointsBadge.className = 'points-badge';
      pointsBadge.textContent = formatUcAylarPoints(0);
      pointsWrap.append(pointsBadge);

      if (field.type === 'checkbox') {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = Boolean(entry.values[field.id]);
        input.addEventListener('change', () => {
          entry.values[field.id] = input.checked;
          pointsBadge.textContent = formatUcAylarPoints(calculateFieldPoints(field, input.checked));
          updateTotals();
          scheduleSave();
        });
        inputWrap.append(input);
        pointsBadge.textContent = formatUcAylarPoints(calculateFieldPoints(field, input.checked));
      } else {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.step = String(field.step || 1);
        const rawValue = entry.values[field.id];
        const numericValue = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : 0;
        input.value = numericValue ? String(numericValue) : '';
        input.addEventListener('input', () => {
          const parsed = Number.parseFloat(input.value);
          const nextValue = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
          entry.values[field.id] = nextValue;
          pointsBadge.textContent = formatUcAylarPoints(calculateFieldPoints(field, nextValue));
          updateTotals();
          scheduleSave();
        });
        inputWrap.append(input);
        pointsBadge.textContent = formatUcAylarPoints(calculateFieldPoints(field, numericValue));
      }

      row.append(label, inputWrap, pointsWrap);
      fieldsContainer.append(row);
    });
  };

  const renderManager = () => {
    if (!managerList) {
      return;
    }
    managerList.innerHTML = '';
    closeDeleteConfirm();
    setManagerStatus(draftDirty ? 'Kaydedilmemiş değişiklikler var.' : '');

    draftFields.forEach((field, index) => {
      const item = document.createElement('div');
      item.className = 'ucaylar-field-edit';
      item.dataset.fieldId = field.id;

      const labelInput = document.createElement('input');
      labelInput.type = 'text';
      labelInput.value = field.label;
      labelInput.className = 'ucaylar-field-edit__label';
      labelInput.addEventListener('input', () => {
        const nextLabel = labelInput.value.trim();
        field.label = nextLabel || field.label;
        setDraftDirty(true);
      });

      const typeSelect = document.createElement('select');
      typeSelect.className = 'ucaylar-field-edit__type';
      typeSelect.innerHTML = `
        <option value="checkbox">Onay</option>
        <option value="number">Sayı</option>
      `;
      typeSelect.value = field.type === 'number' ? 'number' : 'checkbox';
      typeSelect.addEventListener('change', () => {
        const nextType = typeSelect.value === 'number' ? 'number' : 'checkbox';
        const previousType = field.type === 'number' ? 'number' : 'checkbox';
        if (previousType === nextType) {
          return;
        }
        const points = getFieldPoints(field);
        field.type = nextType;
        setFieldPoints(field, points);
        setDraftDirty(true);
        renderManager();
      });

      const pointsInput = document.createElement('input');
      pointsInput.type = 'number';
      pointsInput.min = '0';
      pointsInput.step = '0.1';
      pointsInput.value = String(getFieldPoints(field));
      pointsInput.className = 'ucaylar-field-edit__points';
      pointsInput.addEventListener('input', () => {
        const parsed = Number.parseFloat(pointsInput.value);
        const nextPoints = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
        setFieldPoints(field, nextPoints);
        setDraftDirty(true);
      });

      const hiddenToggle = document.createElement('label');
      hiddenToggle.className = 'ucaylar-field-edit__hidden';
      hiddenToggle.innerHTML = `<input type="checkbox"> <span>Gizle</span>`;
      const hiddenInput = hiddenToggle.querySelector('input');
      if (hiddenInput) {
        hiddenInput.checked = Boolean(field.hidden);
        hiddenInput.addEventListener('change', () => {
          field.hidden = hiddenInput.checked;
          setDraftDirty(true);
        });
      }

      const moveUp = document.createElement('button');
      moveUp.type = 'button';
      moveUp.className = 'button-pill secondary';
      moveUp.textContent = '↑';
      moveUp.disabled = index === 0;
      moveUp.addEventListener('click', () => {
        if (index <= 0) return;
        const next = draftFields.slice();
        const temp = next[index - 1];
        next[index - 1] = next[index];
        next[index] = temp;
        draftFields = next;
        setDraftDirty(true);
        renderManager();
      });

      const moveDown = document.createElement('button');
      moveDown.type = 'button';
      moveDown.className = 'button-pill secondary';
      moveDown.textContent = '↓';
      moveDown.disabled = index === draftFields.length - 1;
      moveDown.addEventListener('click', () => {
        if (index >= draftFields.length - 1) return;
        const next = draftFields.slice();
        const temp = next[index + 1];
        next[index + 1] = next[index];
        next[index] = temp;
        draftFields = next;
        setDraftDirty(true);
        renderManager();
      });

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'button-pill secondary ucaylar-field-edit__delete';
      deleteButton.textContent = '🗑️';
      deleteButton.setAttribute('aria-label', 'Alanı sil');
      deleteButton.addEventListener('click', () => openDeleteConfirm(field.id));

      const meta = document.createElement('div');
      meta.className = 'ucaylar-field-edit__meta';
      meta.append(typeSelect, pointsInput, hiddenToggle, moveUp, moveDown, deleteButton);

      item.append(labelInput, meta);
      managerList.append(item);
    });
  };

  const updateTotals = () => {
    const year = getActiveYear();
    const tracker = ensureDefaultUcAylarTracker(year, monthKey);
    const entry = ensureUcAylarEntry(tracker, activeDateKey);
    const dayPoints = calculateDayPoints(tracker.fields, entry.values);
    if (dayTotalEl) dayTotalEl.textContent = formatUcAylarPoints(dayPoints);

    try {
      const monthPoints = activeRange ? calculateUcAylarRangePoints(monthKey, activeRange) : calculateMonthPoints(tracker, year);
      if (monthTotalEl) monthTotalEl.textContent = formatUcAylarPoints(monthPoints);
    } catch (error) {
      console.warn('Üç Aylar toplam puan hesaplanamadı.', error);
      if (monthTotalEl) monthTotalEl.textContent = '0';
    }
  };

  if (managerForm) {
    managerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const label = String(formData.get('label') || '').trim();
      const type = String(formData.get('type') || 'checkbox');
      const points = Number.parseFloat(String(formData.get('points') || '5'));
      const step = Number.parseInt(String(formData.get('step') || '1'), 10);

      if (!label) {
        return;
      }

      const field = createUcAylarField({
        label,
        type: type === 'number' ? 'number' : 'checkbox',
        points: Number.isFinite(points) ? Math.max(0, points) : 0,
        step: Number.isFinite(step) ? Math.max(1, step) : 1,
      });

      draftFields.push(field);
      setDraftDirty(true);

      form.reset();
      const labelInput = form.querySelector('input[name="label"]');
      if (labelInput) {
        labelInput.focus();
      }

      renderManager();
      setManagerStatus('Yeni alan eklendi (kaydetmek için Kaydet’e basın).');
    });
  }

  renderFields();
  if (initialManageOpen) {
    renderManager();
  }
  updateTotals();
  updateNavButtons();
}

function loadUcAylarData() {
  const empty = { version: UCAYLAR_TRACKER_STORAGE_VERSION, trackers: {} };
  try {
    const raw = localStorage.getItem(UCAYLAR_TRACKER_STORAGE_KEY);
    if (!raw) {
      return empty;
    }
    const parsed = JSON.parse(raw);
    return migrateUcAylarData(parsed);
  } catch (error) {
    console.warn('Üç Aylar çetele verisi okunamadı, sıfırlanacak.', error);
    return empty;
  }
}

function saveUcAylarData(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  try {
    localStorage.setItem(UCAYLAR_TRACKER_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Üç Aylar çetele verisi kaydedilemedi.', error);
  }
}

function migrateUcAylarData(data, options = {}) {
  const source = options && options.source === 'import' ? 'import' : 'local';
  const empty = { version: UCAYLAR_TRACKER_STORAGE_VERSION, trackers: {} };
  if (!data || typeof data !== 'object') {
    return empty;
  }

  const version = Number.isFinite(Number(data.version)) ? Number(data.version) : 0;
  const trackers = data.trackers && typeof data.trackers === 'object' ? data.trackers : {};

  if (version === UCAYLAR_TRACKER_STORAGE_VERSION) {
    const normalized = { version: UCAYLAR_TRACKER_STORAGE_VERSION, trackers: {} };
    Object.entries(trackers).forEach(([key, tracker]) => {
      const monthKey = extractUcAylarMonthKeyFromTrackerKey(key);
      const normalizedTracker = normalizeUcAylarTracker(tracker);
      applyUcAylarMonthDefaults(normalizedTracker, monthKey, { source });
      normalized.trackers[key] = normalizedTracker;
    });
    return normalized;
  }

  if (version === 0) {
    const normalized = { version: UCAYLAR_TRACKER_STORAGE_VERSION, trackers: {} };
    Object.entries(trackers).forEach(([key, tracker]) => {
      const monthKey = extractUcAylarMonthKeyFromTrackerKey(key);
      const normalizedTracker = normalizeUcAylarTracker(tracker);
      applyUcAylarMonthDefaults(normalizedTracker, monthKey, { source });
      normalized.trackers[key] = normalizedTracker;
    });
    return normalized;
  }

  return empty;
}

function extractUcAylarMonthKeyFromTrackerKey(key) {
  if (typeof key !== 'string') {
    return '';
  }
  const separatorIndex = key.indexOf('-');
  if (separatorIndex <= 0) {
    return '';
  }
  return key.slice(separatorIndex + 1);
}

function normalizeUcAylarRemovedDefaultFieldIds(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  const cleaned = value
    .filter((entry) => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter(Boolean);
  return Array.from(new Set(cleaned)).sort();
}

function applyUcAylarMonthDefaults(tracker, monthKey, options = {}) {
  if (!tracker || typeof tracker !== 'object') {
    return;
  }

  if (options.source !== 'import') {
    const currentVersion = Number.isFinite(Number(tracker.defaultsVersion)) ? Number(tracker.defaultsVersion) : 0;
    if (currentVersion < UCAYLAR_DEFAULTS_VERSION) {
      upgradeUcAylarDefaultsV2(tracker);
      tracker.defaultsVersion = UCAYLAR_DEFAULTS_VERSION;
    }
  }

  if (!Array.isArray(tracker.removedDefaultFieldIds)) {
    tracker.removedDefaultFieldIds = normalizeUcAylarRemovedDefaultFieldIds(tracker.removedDefaultFieldIds);
  } else {
    tracker.removedDefaultFieldIds = normalizeUcAylarRemovedDefaultFieldIds(tracker.removedDefaultFieldIds);
  }

  if (monthKey !== 'ramazan') {
    return;
  }

  const dismissed = new Set(tracker.removedDefaultFieldIds);
  const hasTeravih = Array.isArray(tracker.fields) && tracker.fields.some((field) => field && field.id === UCAYLAR_RAMAZAN_DEFAULT_FIELD_ID);
  if (hasTeravih || dismissed.has(UCAYLAR_RAMAZAN_DEFAULT_FIELD_ID)) {
    return;
  }

  // Import sırasında alanlar "override" edilir: dosyada Teravih yoksa otomatik eklemeyelim.
  if (options.source === 'import') {
    tracker.removedDefaultFieldIds = Array.from(new Set([...tracker.removedDefaultFieldIds, UCAYLAR_RAMAZAN_DEFAULT_FIELD_ID])).sort();
    return;
  }

  if (!Array.isArray(tracker.fields)) {
    tracker.fields = createDefaultUcAylarFields();
  }
  tracker.fields.push({
    id: UCAYLAR_RAMAZAN_DEFAULT_FIELD_ID,
    label: 'Teravih',
    type: 'checkbox',
    hidden: false,
    pointsWhenDone: 100,
  });
}

function upgradeUcAylarDefaultsV2(tracker) {
  if (!tracker || typeof tracker !== 'object' || !Array.isArray(tracker.fields)) {
    return;
  }

  const fieldsById = new Map(tracker.fields.map((field) => [field && field.id, field]));

  const updateLabel = (fieldId, nextLabel) => {
    const field = fieldsById.get(fieldId);
    if (!field || typeof field !== 'object') {
      return;
    }
    field.label = nextLabel;
  };

  const updateTypeToNumber = (fieldId) => {
    const field = fieldsById.get(fieldId);
    if (!field || typeof field !== 'object') {
      return;
    }
    const fromType = field.type === 'number' ? 'number' : 'checkbox';
    if (fromType === 'number') {
      field.type = 'number';
      field.step = Number.isFinite(Number(field.step)) ? Math.max(1, Number(field.step)) : 1;
      return;
    }

    const carriedPoints = Number.isFinite(Number(field.pointsWhenDone)) ? Math.max(0, Number(field.pointsWhenDone)) : 0;
    field.type = 'number';
    field.pointsPerUnit = carriedPoints;
    field.step = Number.isFinite(Number(field.step)) ? Math.max(1, Number(field.step)) : 1;

    if (tracker.entries && typeof tracker.entries === 'object') {
      convertFieldValuesForTypeChange(tracker.entries, fieldId, 'checkbox', 'number');
    }
  };

  // Etiket düzeltmeleri
  updateLabel('kuran', 'Kur’an-ı Kerim');
  updateLabel('zikir', 'Zikir');
  updateLabel('kucuk-cevsen', 'Küçük Cevşen (Bab)');

  // Tip değişimleri (varsayılanı sayı yapmak istediklerimiz)
  updateTypeToNumber('kucuk-cevsen');
  updateTypeToNumber('tesbihat');
  updateTypeToNumber('tevhidname');
  updateTypeToNumber('kulubuddaria');

  const zikir = fieldsById.get('zikir');
  if (zikir && typeof zikir === 'object' && zikir.type === 'number') {
    if (!Number.isFinite(Number(zikir.step)) || Number(zikir.step) < 1) {
      zikir.step = 100;
    }
  }
}

function normalizeUcAylarTracker(tracker) {
  const normalized = {
    fields: createDefaultUcAylarFields(),
    entries: {},
    removedDefaultFieldIds: [],
  };

  if (!tracker || typeof tracker !== 'object') {
    return normalized;
  }

  normalized.removedDefaultFieldIds = normalizeUcAylarRemovedDefaultFieldIds(tracker.removedDefaultFieldIds);
  normalized.defaultsVersion = Number.isFinite(Number(tracker.defaultsVersion)) ? Number(tracker.defaultsVersion) : 0;

  if (Array.isArray(tracker.fields) && tracker.fields.length) {
    normalized.fields = tracker.fields.map((field) => normalizeUcAylarField(field)).filter(Boolean);
    if (!normalized.fields.length) {
      normalized.fields = createDefaultUcAylarFields();
    }
  }

  const fieldMap = new Map(normalized.fields.map((field) => [field.id, field]));

  if (tracker.entries && typeof tracker.entries === 'object') {
    Object.entries(tracker.entries).forEach(([dateKey, entry]) => {
      if (!isValidDateKey(dateKey) || !entry || typeof entry !== 'object') {
        return;
      }
      const values = entry.values && typeof entry.values === 'object' ? entry.values : {};
      normalized.entries[dateKey] = { values: normalizeUcAylarEntryValues(values, fieldMap) };
    });
  }

  return normalized;
}

function normalizeUcAylarEntryValues(values, fieldMap) {
  const normalized = {};
  if (!values || typeof values !== 'object' || !(fieldMap instanceof Map)) {
    return normalized;
  }
  Object.entries(values).forEach(([fieldId, rawValue]) => {
    const field = fieldMap.get(fieldId);
    if (!field) {
      return;
    }
    const normalizedValue = normalizeUcAylarValueForField(field, rawValue);
    if (typeof normalizedValue === 'undefined') {
      return;
    }
    normalized[fieldId] = normalizedValue;
  });
  return normalized;
}

function normalizeUcAylarValueForField(field, value) {
  if (!field) {
    return undefined;
  }
  if (field.type === 'checkbox') {
    if (value === true) return true;
    if (value === false) return false;
    if (typeof value === 'number') return value > 0;
    if (typeof value === 'string') {
      const lowered = value.trim().toLowerCase();
      return lowered === 'true' || lowered === '1' || lowered === 'on' || lowered === 'yes';
    }
    return Boolean(value);
  }

  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }
  return parsed;
}

function normalizeUcAylarField(field) {
  if (!field || typeof field !== 'object') {
    return null;
  }
  const type = field.type === 'number' ? 'number' : 'checkbox';
  const id = typeof field.id === 'string' && field.id.trim() ? field.id.trim() : createUcAylarFieldId(field.label || 'alan');
  const label = typeof field.label === 'string' && field.label.trim() ? field.label.trim() : 'Alan';
  const hidden = Boolean(field.hidden);
  const step = type === 'number' && Number.isFinite(Number(field.step)) ? Math.max(1, Number(field.step)) : 1;

  if (type === 'checkbox') {
    const pointsWhenDone = Number.isFinite(Number(field.pointsWhenDone)) ? Math.max(0, Number(field.pointsWhenDone)) : 5;
    return { id, label, type, hidden, pointsWhenDone };
  }

  const pointsPerUnit = Number.isFinite(Number(field.pointsPerUnit)) ? Math.max(0, Number(field.pointsPerUnit)) : 1;
  return { id, label, type, hidden, pointsPerUnit, step };
}

function getUcAylarTrackerKey(year, monthKey) {
  return `${year}-${monthKey}`;
}

function ensureDefaultUcAylarTracker(year, monthKey) {
  const data = state.ucaylar.data || { version: UCAYLAR_TRACKER_STORAGE_VERSION, trackers: {} };
  if (!state.ucaylar.data) {
    state.ucaylar.data = data;
  }
  if (!data.trackers || typeof data.trackers !== 'object') {
    data.trackers = {};
  }

  const key = getUcAylarTrackerKey(year, monthKey);
  let tracker = data.trackers[key];
  if (!tracker || typeof tracker !== 'object') {
    tracker = {
      fields: createDefaultUcAylarFields(),
      entries: {},
      removedDefaultFieldIds: [],
      defaultsVersion: UCAYLAR_DEFAULTS_VERSION,
    };
    applyUcAylarMonthDefaults(tracker, monthKey, { source: 'local' });
    data.trackers[key] = tracker;
    saveUcAylarData(data);
    return tracker;
  }

  // Önemli: Burada tracker objesini her çağrıda "clone" etmiyoruz.
  // Aksi halde UI event handler'larının kapattığı referanslar (entry/field) güncellenmez
  // ve toplamlar doğru hesaplanamaz.
  if (!Array.isArray(tracker.fields) || tracker.fields.length === 0) {
    tracker.fields = createDefaultUcAylarFields();
  }
  if (!tracker.entries || typeof tracker.entries !== 'object') {
    tracker.entries = {};
  } else {
    Object.values(tracker.entries).forEach((entry) => {
      if (!entry || typeof entry !== 'object') {
        return;
      }
      if (!entry.values || typeof entry.values !== 'object') {
        entry.values = {};
      }
    });
  }

  applyUcAylarMonthDefaults(tracker, monthKey, { source: 'local' });
  data.trackers[key] = tracker;
  return tracker;
}

function ensureUcAylarEntry(tracker, dateKey) {
  if (!tracker.entries || typeof tracker.entries !== 'object') {
    tracker.entries = {};
  }
  let entry = tracker.entries[dateKey];
  if (!entry || typeof entry !== 'object') {
    entry = { values: {} };
    tracker.entries[dateKey] = entry;
    return entry;
  }
  if (!entry.values || typeof entry.values !== 'object') {
    entry.values = {};
  }
  return entry;
}

function calculateFieldPoints(field, value) {
  if (!field) {
    return 0;
  }
  if (field.type === 'checkbox') {
    return value ? Number(field.pointsWhenDone) || 0 : 0;
  }
  const numeric = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return numeric * (Number(field.pointsPerUnit) || 0);
}

function calculateDayPoints(fields, values) {
  if (!Array.isArray(fields) || !values || typeof values !== 'object') {
    return 0;
  }
  return fields.reduce((total, field) => total + calculateFieldPoints(field, values[field.id]), 0);
}

function calculateUcAylarRangePoints(monthKey, range, options = {}) {
  const normalized = normalizeUcAylarRange(range);
  if (!normalized) {
    return 0;
  }

  const createMissing = options.createMissing !== false;

  // Storage şeması değişmeden (yıl bazlı tracker) range toplamı:
  // Range içindeki her gün için ilgili takvimin yıl tracker'ından puanı ekle.
  const byYearCache = new Map();
  let total = 0;
  iterateDateKeysInRange(normalized).forEach((dateKey) => {
    const year = Number.parseInt(dateKey.slice(0, 4), 10);
    if (!Number.isFinite(year)) {
      return;
    }
    let tracker = byYearCache.get(year);
    if (!tracker) {
      if (createMissing) {
        tracker = ensureDefaultUcAylarTracker(year, monthKey);
      } else {
        const key = getUcAylarTrackerKey(year, monthKey);
        const candidate = state.ucaylar && state.ucaylar.data && state.ucaylar.data.trackers ? state.ucaylar.data.trackers[key] : null;
        tracker = candidate && typeof candidate === 'object' ? normalizeUcAylarTracker(candidate) : null;
      }
      byYearCache.set(year, tracker);
    }
    if (!tracker) {
      return;
    }
    const entry = tracker && tracker.entries ? tracker.entries[dateKey] : null;
    if (!entry || typeof entry !== 'object') {
      return;
    }
    const values = entry.values && typeof entry.values === 'object' ? entry.values : {};
    total += calculateDayPoints(tracker.fields, values);
  });
  return total;
}

function calculateMonthPoints(tracker, year) {
  if (!tracker || !tracker.entries || typeof tracker.entries !== 'object') {
    return 0;
  }
  const prefix = `${year}-`;
  return Object.entries(tracker.entries).reduce((total, [dateKey, entry]) => {
    if (!dateKey.startsWith(prefix) || !entry || typeof entry !== 'object') {
      return total;
    }
    const values = entry.values && typeof entry.values === 'object' ? entry.values : {};
    return total + calculateDayPoints(tracker.fields, values);
  }, 0);
}

function convertFieldValuesForTypeChange(entriesByDate, fieldId, fromType, toType) {
  if (!entriesByDate || typeof entriesByDate !== 'object' || !fieldId) {
    return;
  }
  if (fromType === toType) {
    return;
  }

  Object.values(entriesByDate).forEach((entry) => {
    if (!entry || typeof entry !== 'object') {
      return;
    }
    if (!entry.values || typeof entry.values !== 'object') {
      entry.values = {};
    }

    const raw = entry.values[fieldId];
    const numeric = typeof raw === 'number' ? raw : Number.parseFloat(String(raw));
    const normalizedNumber = Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
    const normalizedBoolean = raw === true
      || raw === 1
      || raw === '1'
      || (typeof raw === 'string' && raw.trim().toLowerCase() === 'true');

    if (fromType === 'checkbox' && toType === 'number') {
      if (normalizedBoolean) {
        entry.values[fieldId] = 1;
      } else {
        delete entry.values[fieldId];
      }
      return;
    }

    if (fromType === 'number' && toType === 'checkbox') {
      if (normalizedNumber > 0) {
        entry.values[fieldId] = true;
      } else {
        delete entry.values[fieldId];
      }
      return;
    }

    // Fallback: normalize by target type.
    if (toType === 'checkbox') {
      entry.values[fieldId] = normalizedNumber > 0;
      if (!entry.values[fieldId]) {
        delete entry.values[fieldId];
      }
      return;
    }

    if (toType === 'number') {
      if (normalizedNumber > 0) {
        entry.values[fieldId] = normalizedNumber;
      } else {
        delete entry.values[fieldId];
      }
    }
  });
}

function removeFieldFromEntries(entriesByDate, fieldId) {
  if (!entriesByDate || typeof entriesByDate !== 'object' || !fieldId) {
    return;
  }
  Object.values(entriesByDate).forEach((entry) => {
    if (!entry || typeof entry !== 'object') {
      return;
    }
    if (!entry.values || typeof entry.values !== 'object') {
      return;
    }
    delete entry.values[fieldId];
  });
}

function formatUcAylarPoints(points) {
  const value = Number.isFinite(Number(points)) ? Number(points) : 0;
  const rounded = Math.round(value * 10) / 10;
  if (Math.abs(rounded - Math.round(rounded)) < 0.001) {
    return String(Math.round(rounded));
  }
  return rounded.toFixed(1);
}

function createUcAylarFieldId(label) {
  const source = typeof label === 'string' ? label : 'alan';
  const normalized = source
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const suffix = Math.random().toString(16).slice(2, 6);
  return `uc-${normalized || 'alan'}-${suffix}`;
}

function createUcAylarField({ label, type, points, step }) {
  const id = createUcAylarFieldId(label);
  const safeLabel = typeof label === 'string' ? label.trim() : 'Alan';
  if (type === 'number') {
    return {
      id,
      label: safeLabel || 'Alan',
      type: 'number',
      hidden: false,
      pointsPerUnit: Number.isFinite(points) ? points : 1,
      step: Number.isFinite(step) ? Math.max(1, step) : 1,
    };
  }
  return {
    id,
    label: safeLabel || 'Alan',
    type: 'checkbox',
    hidden: false,
    pointsWhenDone: Number.isFinite(points) ? points : 5,
  };
}

function createDefaultUcAylarFields() {
  return [
    { id: 'kuran', label: 'Kur’an-ı Kerim', type: 'number', hidden: false, pointsPerUnit: 10, step: 1 },
    { id: 'meal', label: 'Meal', type: 'number', hidden: false, pointsPerUnit: 1, step: 1 },
    { id: 'risale', label: 'Risale', type: 'number', hidden: false, pointsPerUnit: 1, step: 1 },
    { id: 'pirlanta', label: 'Pırlanta', type: 'number', hidden: false, pointsPerUnit: 1, step: 1 },
    { id: 'buyuk-cevsen', label: 'Büyük Cevşen', type: 'number', hidden: false, pointsPerUnit: 1, step: 1 },
    { id: 'kucuk-cevsen', label: 'Küçük Cevşen (Bab)', type: 'number', hidden: false, pointsPerUnit: 5, step: 1 },
    { id: 'duha', label: 'Duha', type: 'checkbox', hidden: false, pointsWhenDone: 5 },
    { id: 'evvabin', label: 'Evvabin', type: 'checkbox', hidden: false, pointsWhenDone: 5 },
    { id: 'teheccut', label: 'Teheccüt', type: 'checkbox', hidden: false, pointsWhenDone: 5 },
    { id: 'hacet', label: 'Hacet', type: 'checkbox', hidden: false, pointsWhenDone: 5 },
    { id: 'oruc', label: 'Oruç', type: 'checkbox', hidden: false, pointsWhenDone: 10 },
    { id: 'zikir', label: 'Zikir', type: 'number', hidden: false, pointsPerUnit: 0.05, step: 100 },
    { id: 'dinleme', label: 'Dinleme', type: 'number', hidden: false, pointsPerUnit: 0.2, step: 5 },
    { id: 'tesbihat', label: 'Tesbihat', type: 'number', hidden: false, pointsPerUnit: 5, step: 1 },
    { id: 'tevhidname', label: 'Tevhidname', type: 'number', hidden: false, pointsPerUnit: 5, step: 1 },
    { id: 'kulubuddaria', label: 'Kulubüddaria', type: 'number', hidden: false, pointsPerUnit: 5, step: 1 },
  ];
}

async function renderCevsen(container, config) {
  hideNameTooltip();
  closeCevsenSettings({ immediate: true });

  const viewState = state.cevsen;
  if (!viewState) {
    return;
  }

  container.innerHTML = '';

  const root = document.createElement('div');
  root.className = 'cevsen-screen';
  root.innerHTML = `
    <header class="card cevsen-toolbar">
      <div class="cevsen-toolbar__left">
        <button type="button" class="button-pill secondary cevsen-toolbar__back" data-cevsen-back hidden>Bölümlere dön</button>
        <div class="cevsen-toolbar__titles">
          <h2 class="cevsen-toolbar__title"></h2>
          <p class="cevsen-toolbar__subtitle"></p>
        </div>
      </div>
      <button type="button" class="button-pill cevsen-toolbar__settings" data-cevsen-settings aria-label="Cevşen metin ayarlarını aç" hidden>
        <span class="cevsen-toolbar__settings-icon" aria-hidden="true">⚙️</span>
        <span class="cevsen-toolbar__settings-label">Ayarlar</span>
      </button>
    </header>
    <div class="cevsen-view" data-cevsen-view></div>
  `;

  container.append(root);

  viewState.root = root;
  viewState.viewContainer = root.querySelector('[data-cevsen-view]');
  viewState.toolbar = {
    root: root.querySelector('.cevsen-toolbar'),
    title: root.querySelector('.cevsen-toolbar__title'),
    subtitle: root.querySelector('.cevsen-toolbar__subtitle'),
    backButton: root.querySelector('[data-cevsen-back]'),
    settingsButton: root.querySelector('[data-cevsen-settings]'),
  };

  applyCevsenFontScale(root);
  applyCevsenVisibility(root);

  const backButton = viewState.toolbar.backButton;
  if (backButton) {
    backButton.addEventListener('click', () => {
      viewState.activePartId = null;
      updateCevsenView();
    });
  }

  const settingsButton = viewState.toolbar.settingsButton;
  if (settingsButton) {
    settingsButton.addEventListener('click', () => {
      const settings = ensureCevsenSettings();
      viewState.settings = settings;
      settings.show();
    });
  }

  if (!viewState.settings || !viewState.settings.overlay || !viewState.settings.overlay.isConnected) {
    viewState.settings = ensureCevsenSettings();
  }

  return updateCevsenView();
}

async function updateCevsenView() {
  const viewState = state.cevsen;
  if (!viewState || !viewState.root || !viewState.viewContainer || !viewState.toolbar) {
    return;
  }

  const { backButton, settingsButton, title, subtitle } = viewState.toolbar;

  if (!viewState.activePartId) {
    if (backButton) {
      backButton.hidden = true;
    }
    if (settingsButton) {
      settingsButton.hidden = true;
    }
    if (title) {
      title.textContent = 'Cevşen-i Kebîr';
    }
    if (subtitle) {
      subtitle.textContent = 'Okumak istediğiniz bab aralığını seçin.';
    }
    renderCevsenSelection(viewState.viewContainer);
    applyCevsenVisibility();
    return;
  }

  const part = CEVSEN_PART_MAP.get(viewState.activePartId);
  if (!part) {
    viewState.activePartId = null;
    await updateCevsenView();
    return;
  }

  if (backButton) {
    backButton.hidden = false;
  }
  if (settingsButton) {
    settingsButton.hidden = false;
    settingsButton.disabled = false;
  }
  if (title) {
    title.textContent = getCevsenPartTitle(part);
  }
  if (subtitle) {
    subtitle.textContent = getCevsenPartSubtitle(part);
  }

  await renderCevsenPartView(viewState.viewContainer, part);
}

function renderCevsenSelection(target) {
  const viewState = state.cevsen;
  if (!target) {
    return;
  }

  closeCevsenSettings();

  target.innerHTML = '';

  const info = document.createElement('p');
  info.className = 'cevsen-selection__info';
  info.textContent = 'Babları okumak için aralıklardan birini seçin.';
  target.append(info);

  const list = document.createElement('div');
  list.className = 'cevsen-part-list';

  const lastPartId = viewState ? viewState.lastPartId : null;

  CEVSEN_PARTS.forEach((part) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cevsen-part-button';
    button.dataset.partId = part.id;

    const label = document.createElement('span');
    label.className = 'cevsen-part-button__label';
    label.textContent = part.label;

    const hint = document.createElement('span');
    hint.className = 'cevsen-part-button__hint';
    hint.textContent = part.isPrayer ? 'Kapanış duaları' : `Bab ${part.range || part.label}`;

    button.append(label, hint);

    if (lastPartId === part.id) {
      button.classList.add('is-active');
    }

    button.addEventListener('click', () => {
      if (viewState) {
        viewState.activePartId = part.id;
      }
      updateCevsenView();
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    list.append(button);
  });

  target.append(list);
  applyCevsenVisibility();
}

async function renderCevsenPartView(target, part) {
  const viewState = state.cevsen;
  if (!target || !part) {
    return;
  }

  if (viewState) {
    viewState.lastPartId = part.id;
  }

  const loadingCard = document.createElement('article');
  loadingCard.className = 'card cevsen-loading';
  loadingCard.innerHTML = '<p class="cevsen-loading__text">İçerik yükleniyor…</p>';

  target.innerHTML = '';
  target.append(loadingCard);

  try {
    if (part.isPrayer) {
      const prayer = await loadCevsenPrayerData(part);
      target.innerHTML = '';
      if (!prayer) {
        const empty = document.createElement('article');
        empty.className = 'card cevsen-empty';
        empty.innerHTML = `
          <h3>Dua metni henüz hazır değil</h3>
          <p>Bu bölüme ait içerik eklendiğinde burada görüntülenecek.</p>
        `;
        target.append(empty);
      } else {
        const card = buildCevsenPrayerCard(prayer);
        target.append(card);
      }
      applyCevsenFontScale(viewState ? viewState.root : null);
      applyCevsenVisibility(viewState ? viewState.root : null);
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0 });
      }
      return;
    }

    const data = await loadCevsenPartData(part);
    target.innerHTML = '';

    if (!Array.isArray(data.sections) || data.sections.length === 0) {
      const emptyCard = document.createElement('article');
      emptyCard.className = 'card cevsen-empty';
      emptyCard.innerHTML = `
        <h3>İçerik henüz hazır değil</h3>
        <p>Bu bölüme ait metin eklendiğinde burada görüntülenecek.</p>
      `;
      target.append(emptyCard);
      applyCevsenFontScale(viewState ? viewState.root : null);
      applyCevsenVisibility(viewState ? viewState.root : null);
      return;
    }

    data.sections.forEach((section, index) => {
      const card = buildCevsenBabCard(section, index);
      target.append(card);
    });

    applyCevsenFontScale(viewState ? viewState.root : null);
    applyCevsenVisibility(viewState ? viewState.root : null);

    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0 });
    }
  } catch (error) {
    console.error('Cevşen içeriği yüklenemedi.', error);
    target.innerHTML = '';
    const errorCard = document.createElement('article');
    errorCard.className = 'card cevsen-error';
    errorCard.innerHTML = `
      <h3>İçerik yüklenemedi</h3>
      <p>İlgili dosya henüz eklenmemiş olabilir. Lütfen daha sonra tekrar deneyin.</p>
    `;
    target.append(errorCard);
    applyCevsenFontScale(viewState ? viewState.root : null);
    applyCevsenVisibility(viewState ? viewState.root : null);
  }
}

function getCevsenPartTitle(part) {
  if (!part) {
    return 'Cevşen-i Kebîr';
  }
  if (part.isPrayer) {
    return 'Kapanış Duaları';
  }
  if (part.range) {
    return `Bab ${part.range}`;
  }
  if (part.label) {
    return part.label;
  }
  return 'Cevşen-i Kebîr';
}

function getCevsenPartSubtitle(part) {
  if (!part) {
    return 'Babları okumak için aralık seçin.';
  }
  if (part.isPrayer) {
    return 'Cevşen-i Kebîr duasının Arapça metni, transkripsiyonu ve mealini birlikte okuyun.';
  }
  return 'Aralık içindeki babların Arapça metni, okunuşu ve mealini aşağıdan takip edebilirsiniz.';
}

async function loadCevsenPartData(part) {
  const viewState = state.cevsen;
  if (!viewState) {
    return { intro: [], sections: [] };
  }

  const cache = viewState.partCache;
  if (cache && cache.has(part.id)) {
    return cache.get(part.id);
  }

  if (!part.path) {
    const empty = { intro: [], sections: [] };
    if (cache) {
      cache.set(part.id, empty);
    }
    return empty;
  }

  const raw = await fetchText(part.path);
  const parsed = parseCevsenMarkdown(raw);
  if (cache) {
    cache.set(part.id, parsed);
  }
  return parsed;
}

async function loadCevsenPrayerData(part) {
  const viewState = state.cevsen;
  if (!viewState) {
    return null;
  }

  const cache = viewState.partCache;
  if (cache && cache.has(part.id)) {
    return cache.get(part.id);
  }

  if (!part.path) {
    if (cache) {
      cache.set(part.id, null);
    }
    return null;
  }

  const raw = await fetchText(part.path);
  const normalised = raw.replace(/\r\n/g, '\n').trim();
  if (!normalised) {
    if (cache) {
      cache.set(part.id, null);
    }
    return null;
  }

  const segments = normalised
    .split(/\n{2,}/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  let subtitle = null;
  let title = null;
  let arabic = null;
  const remainder = [];

  while (segments.length && (!subtitle || !title || !arabic)) {
    const current = segments.shift();
    if (!subtitle) {
      subtitle = current;
    } else if (!title) {
      title = current;
    } else if (!arabic) {
      arabic = current;
    }
  }

  remainder.push(...segments);

  let transliterationSegments = [];
  let meaningSegments = [];
  if (remainder.length) {
    const meaningStartIndex = remainder.findIndex((segment) => /^Ey\s/i.test(segment));
    if (meaningStartIndex === -1) {
      transliterationSegments = remainder.slice(0, 1);
      meaningSegments = remainder.slice(1);
    } else {
      transliterationSegments = remainder.slice(0, meaningStartIndex);
      meaningSegments = remainder.slice(meaningStartIndex);
    }
  }

  const transliteration = transliterationSegments.join('\n\n').trim();
  const meaning = meaningSegments.join('\n\n').trim();

  const result = {
    title: title || 'Cevşen Duası',
    subtitle: subtitle || 'Cevşen-i Kebîr',
    arabic: normaliseCevsenArabic(arabic || ''),
    transliteration,
    meaning,
  };

  if (cache) {
    cache.set(part.id, result);
  }

  return result;
}

function parseCevsenMarkdown(input) {
  if (typeof input !== 'string' || !input.trim()) {
    return { intro: [], sections: [] };
  }

  const normalised = input.replace(/\r\n/g, '\n');
  const lines = normalised.split('\n').map((line) => line.trim());
  const intro = [];
  const sections = [];
  let currentSection = null;
  let buffer = [];

  const flushEntry = () => {
    if (!currentSection) {
      buffer = [];
      return;
    }
    const cleaned = buffer.map((line) => line.trim()).filter(Boolean);
    if (!cleaned.length) {
      buffer = [];
      return;
    }
    const [arabic = '', transliteration = '', ...rest] = cleaned;
    const meaning = rest.join(' ');
    currentSection.items.push({
      arabic: normaliseCevsenArabic(arabic),
      transliteration,
      meaning,
    });
    buffer = [];
  };

  lines.forEach((line) => {
    if (!line) {
      return;
    }

    if (line.includes('⸻') || /^[\-\u2012-\u2015_\u2500-\u2501]+$/u.test(line)) {
      flushEntry();
      return;
    }

    if (/^\d{1,3}\.\s*Bab/i.test(line)) {
      flushEntry();
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { title: line, items: [] };
      return;
    }

    if (!currentSection) {
      intro.push(line);
      return;
    }

    buffer.push(line);
  });

  flushEntry();
  if (currentSection) {
    sections.push(currentSection);
  }

  return { intro, sections };
}

function normaliseCevsenArabic(text) {
  if (typeof text !== 'string' || !text) {
    return text;
  }
  return text.replace(/\u06EA/g, '\u0656');
}

function buildCevsenBabCard(section, index) {
  const card = document.createElement('article');
  card.className = 'card cevsen-bab';
  card.dataset.index = String(index + 1);

  const header = document.createElement('header');
  header.className = 'cevsen-bab__header';
  const badge = document.createElement('span');
  badge.className = 'cevsen-bab__badge';
  badge.textContent = section && section.title ? section.title : `${index + 1}. Bab`;
  header.append(badge);
  card.append(header);

  const body = document.createElement('div');
  body.className = 'cevsen-bab__body';

  const items = Array.isArray(section && section.items) ? section.items : [];
  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'cevsen-bab__empty';
    empty.textContent = 'Bu baba ait satırlar henüz eklenmedi.';
    body.append(empty);
  } else {
    items.forEach((item) => {
      const entry = document.createElement('div');
      entry.className = 'cevsen-entry';

      if (item.arabic) {
        const arabic = document.createElement('p');
        arabic.className = 'cevsen-entry__arabic';
        arabic.textContent = item.arabic;
        arabic.setAttribute('dir', 'rtl');
        arabic.setAttribute('lang', 'ar');
        entry.append(arabic);
      }

      if (item.transliteration) {
        const transliteration = document.createElement('p');
        transliteration.className = 'cevsen-entry__transliteration';
        transliteration.textContent = item.transliteration;
        entry.append(transliteration);
      }

      if (item.meaning) {
        const meaning = document.createElement('p');
        meaning.className = 'cevsen-entry__meaning';
        meaning.textContent = item.meaning;
        meaning.setAttribute('lang', 'tr');
        entry.append(meaning);
      }

      body.append(entry);
    });
  }

  card.append(body);
  return card;
}

function buildCevsenPrayerCard(prayer) {
  const card = document.createElement('article');
  card.className = 'card cevsen-prayer';

  if (prayer.subtitle || prayer.title) {
    const header = document.createElement('header');
    header.className = 'cevsen-prayer__header';
    if (prayer.subtitle) {
      const subtitle = document.createElement('span');
      subtitle.className = 'cevsen-prayer__eyebrow';
      subtitle.textContent = prayer.subtitle;
      header.append(subtitle);
    }
    if (prayer.title) {
      const title = document.createElement('h3');
      title.className = 'cevsen-prayer__title';
      title.textContent = prayer.title;
      header.append(title);
    }
    card.append(header);
  }

  const entry = document.createElement('div');
  entry.className = 'cevsen-entry';

  if (prayer.arabic) {
    const arabic = document.createElement('p');
    arabic.className = 'cevsen-entry__arabic';
    arabic.setAttribute('dir', 'rtl');
    arabic.setAttribute('lang', 'ar');
    arabic.textContent = normaliseCevsenArabic(prayer.arabic);
    entry.append(arabic);
  }

  if (prayer.transliteration) {
    const transliteration = document.createElement('p');
    transliteration.className = 'cevsen-entry__transliteration';
    transliteration.textContent = prayer.transliteration;
    entry.append(transliteration);
  }

  if (prayer.meaning) {
    const meaning = document.createElement('p');
    meaning.className = 'cevsen-entry__meaning';
    meaning.textContent = prayer.meaning;
    meaning.setAttribute('lang', 'tr');
    entry.append(meaning);
  }

  card.append(entry);
  return card;
}

function normaliseCevsenFontScale(scale) {
  const result = {
    arabic: CEVSEN_FONT_SCALE_DEFAULT.arabic,
    transliteration: CEVSEN_FONT_SCALE_DEFAULT.transliteration,
    meaning: CEVSEN_FONT_SCALE_DEFAULT.meaning,
  };

  if (!scale || typeof scale !== 'object') {
    return result;
  }

  Object.keys(result).forEach((key) => {
    const value = Number.parseFloat(scale[key]);
    if (Number.isFinite(value)) {
      result[key] = clamp(value, CEVSEN_FONT_SCALE_MIN, CEVSEN_FONT_SCALE_MAX);
    }
  });

  return result;
}

function applyCevsenFontScale(root = state.cevsen && state.cevsen.root) {
  if (!state.cevsen) {
    return;
  }
  const target = root || state.cevsen.root;
  if (!target) {
    return;
  }

  const scale = normaliseCevsenFontScale(state.cevsen.fontScale);
  state.cevsen.fontScale = scale;

  target.style.setProperty('--cevsen-arabic-scale', String(scale.arabic));
  target.style.setProperty('--cevsen-transliteration-scale', String(scale.transliteration));
  target.style.setProperty('--cevsen-meaning-scale', String(scale.meaning));
}

function adjustCevsenFontScale(type, delta) {
  if (!type || typeof delta !== 'number') {
    return false;
  }
  const viewState = state.cevsen;
  if (!viewState) {
    return false;
  }

  const current = normaliseCevsenFontScale(viewState.fontScale);
  const currentValue = Number.isFinite(current[type]) ? current[type] : CEVSEN_FONT_SCALE_DEFAULT[type] || 1;
  const nextValue = clamp(Number.parseFloat((currentValue + delta).toFixed(3)), CEVSEN_FONT_SCALE_MIN, CEVSEN_FONT_SCALE_MAX);

  if (Math.abs(nextValue - currentValue) < 0.001) {
    viewState.fontScale = current;
    return false;
  }

  const updated = { ...current, [type]: Number.parseFloat(nextValue.toFixed(2)) };
  viewState.fontScale = updated;
  saveCevsenFontScale(updated);
  applyCevsenFontScale();
  return true;
}

function resetCevsenFontScale() {
  const viewState = state.cevsen;
  if (!viewState) {
    return;
  }
  const baseline = normaliseCevsenFontScale(CEVSEN_FONT_SCALE_DEFAULT);
  viewState.fontScale = baseline;
  saveCevsenFontScale(baseline);
  applyCevsenFontScale();
}

function toggleCevsenVisibility(type) {
  if (!type || !(type in CEVSEN_VISIBILITY_DEFAULT)) {
    return;
  }
  const viewState = state.cevsen;
  if (!viewState) {
    return;
  }

  const current = normaliseCevsenVisibility(viewState.visibility);
  const next = { ...current, [type]: !current[type] };
  viewState.visibility = next;
  saveCevsenVisibility(next);
  applyCevsenVisibility();
}

function applyCevsenVisibility(root = state.cevsen && state.cevsen.root) {
  const viewState = state.cevsen;
  if (!viewState) {
    return;
  }

  const target = root || viewState.root;
  if (!target) {
    return;
  }

  const visibility = normaliseCevsenVisibility(viewState.visibility);
  viewState.visibility = visibility;

  target.classList.toggle('cevsen-hide-arabic', !visibility.arabic);
  target.classList.toggle('cevsen-hide-transliteration', !visibility.transliteration);
  target.classList.toggle('cevsen-hide-meaning', !visibility.meaning);

  const entries = target.querySelectorAll('.cevsen-entry');
  entries.forEach((entry) => {
    const hasArabic = visibility.arabic && entry.querySelector('.cevsen-entry__arabic');
    const hasTransliteration = visibility.transliteration && entry.querySelector('.cevsen-entry__transliteration');
    const hasMeaning = visibility.meaning && entry.querySelector('.cevsen-entry__meaning');
    entry.hidden = !hasArabic && !hasTransliteration && !hasMeaning;
  });
}

function normaliseCevsenVisibility(value) {
  const result = {
    arabic: Boolean(CEVSEN_VISIBILITY_DEFAULT.arabic),
    transliteration: Boolean(CEVSEN_VISIBILITY_DEFAULT.transliteration),
    meaning: Boolean(CEVSEN_VISIBILITY_DEFAULT.meaning),
  };

  if (!value || typeof value !== 'object') {
    return result;
  }

  Object.keys(result).forEach((key) => {
    if (key in value) {
      result[key] = value[key] !== false;
    }
  });

  return result;
}

function ensureCevsenSettings() {
  const viewState = state.cevsen;
  if (viewState && viewState.settings && viewState.settings.overlay && viewState.settings.overlay.isConnected) {
    return viewState.settings;
  }

  const overlay = document.createElement('div');
  overlay.className = 'cevsen-settings-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="cevsen-settings" role="dialog" aria-modal="true" aria-labelledby="cevsen-settings-title">
      <header class="cevsen-settings__header">
        <h2 id="cevsen-settings-title">Metin ayarları</h2>
        <button type="button" class="cevsen-settings__close" aria-label="Cevşen metin ayarlarını kapat">✕</button>
      </header>
      <div class="cevsen-settings__content">
        <div class="cevsen-font-row" data-font-type="arabic">
          <div class="cevsen-font-row__info">
            <span class="cevsen-font-row__label">Arapça</span>
          </div>
          <div class="cevsen-font-row__controls">
            <button type="button" class="cevsen-visibility-button" data-visibility-toggle aria-pressed="true">Gizle</button>
            <div class="cevsen-size-buttons">
              <button type="button" class="cevsen-font-button" data-font-action="decrease" aria-label="Arapça metni küçült">−</button>
              <button type="button" class="cevsen-font-button" data-font-action="increase" aria-label="Arapça metni büyüt">+</button>
            </div>
          </div>
        </div>
        <div class="cevsen-font-row" data-font-type="transliteration">
          <div class="cevsen-font-row__info">
            <span class="cevsen-font-row__label">Transkripsiyon</span>
          </div>
          <div class="cevsen-font-row__controls">
            <button type="button" class="cevsen-visibility-button" data-visibility-toggle aria-pressed="true">Gizle</button>
            <div class="cevsen-size-buttons">
              <button type="button" class="cevsen-font-button" data-font-action="decrease" aria-label="Transkripsiyon metnini küçült">−</button>
              <button type="button" class="cevsen-font-button" data-font-action="increase" aria-label="Transkripsiyon metnini büyüt">+</button>
            </div>
          </div>
        </div>
        <div class="cevsen-font-row" data-font-type="meaning">
          <div class="cevsen-font-row__info">
            <span class="cevsen-font-row__label">Türkçe</span>
          </div>
          <div class="cevsen-font-row__controls">
            <button type="button" class="cevsen-visibility-button" data-visibility-toggle aria-pressed="true">Gizle</button>
            <div class="cevsen-size-buttons">
              <button type="button" class="cevsen-font-button" data-font-action="decrease" aria-label="Türkçe metni küçült">−</button>
              <button type="button" class="cevsen-font-button" data-font-action="increase" aria-label="Türkçe metni büyüt">+</button>
            </div>
          </div>
        </div>
      </div>
      <footer class="cevsen-settings__footer">
        <button type="button" class="button-pill secondary" data-cevsen-reset>Varsayılana dön</button>
      </footer>
    </div>
  `;

  document.body.append(overlay);

  const panel = overlay.querySelector('.cevsen-settings');
  const closeButton = overlay.querySelector('.cevsen-settings__close');
  const resetButton = overlay.querySelector('[data-cevsen-reset]');

  const updateControls = () => {
    const scale = normaliseCevsenFontScale(state.cevsen ? state.cevsen.fontScale : null);
    if (state.cevsen) {
      state.cevsen.fontScale = scale;
    }
    const visibility = normaliseCevsenVisibility(state.cevsen ? state.cevsen.visibility : null);
    if (state.cevsen) {
      state.cevsen.visibility = visibility;
    }

    const rows = panel.querySelectorAll('[data-font-type]');
    rows.forEach((row) => {
      const type = row.dataset.fontType;
      const value = scale[type] || 1;
      const increase = row.querySelector('[data-font-action="increase"]');
      const decrease = row.querySelector('[data-font-action="decrease"]');
      if (increase) {
        increase.disabled = value >= CEVSEN_FONT_SCALE_MAX - 0.001;
      }
      if (decrease) {
        decrease.disabled = value <= CEVSEN_FONT_SCALE_MIN + 0.001;
      }
      const visibilityButton = row.querySelector('[data-visibility-toggle]');
      if (visibilityButton) {
        const isVisible = visibility[type] !== false;
        visibilityButton.textContent = isVisible ? 'Gizle' : 'Göster';
        visibilityButton.setAttribute('aria-pressed', String(isVisible));
        visibilityButton.classList.toggle('is-active', isVisible);
      }
    });
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      hide();
    }
  };

  const show = () => {
    if (!overlay.hidden) {
      updateControls();
      return;
    }
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('is-visible'));
    document.body.classList.add('cevsen-settings-open');
    document.addEventListener('keydown', handleKeydown);
    updateControls();
  };

  const hide = (immediate = false) => {
    if (overlay.hidden) {
      return;
    }
    overlay.classList.remove('is-visible');
    const finalize = () => {
      overlay.hidden = true;
      document.body.classList.remove('cevsen-settings-open');
      document.removeEventListener('keydown', handleKeydown);
    };
    if (immediate) {
      finalize();
    } else {
      setTimeout(finalize, 200);
    }
  };

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      hide();
    }
  });

  if (panel) {
    panel.addEventListener('click', (event) => {
      const visibilityButton = event.target.closest('[data-visibility-toggle]');
      if (visibilityButton) {
        const row = visibilityButton.closest('[data-font-type]');
        if (row) {
          const type = row.dataset.fontType;
          toggleCevsenVisibility(type);
          updateControls();
        }
        event.preventDefault();
        return;
      }

      const actionButton = event.target.closest('[data-font-action]');
      if (!actionButton) {
        return;
      }
      const row = actionButton.closest('[data-font-type]');
      if (!row) {
        return;
      }
      const type = row.dataset.fontType;
      if (actionButton.dataset.fontAction === 'increase') {
        adjustCevsenFontScale(type, CEVSEN_FONT_SCALE_STEP);
      } else if (actionButton.dataset.fontAction === 'decrease') {
        adjustCevsenFontScale(type, -CEVSEN_FONT_SCALE_STEP);
      }
      updateControls();
      event.preventDefault();
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', () => hide());
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetCevsenFontScale();
      updateControls();
    });
  }

  const settings = {
    overlay,
    panel,
    show,
    hide,
    update: updateControls,
  };

  if (state.cevsen) {
    state.cevsen.settings = settings;
  }

  return settings;
}

function closeCevsenSettings(options = {}) {
  const settings = state.cevsen && state.cevsen.settings;
  if (!settings || typeof settings.hide !== 'function') {
    return;
  }
  const immediate = options && typeof options.immediate === 'boolean' ? options.immediate : false;
  settings.hide(immediate);
}

async function renderHomePage(container) {
  hideNameTooltip();
  container.innerHTML = `<div class="loading">İçerik yükleniyor…</div>`;

  try {
    const layout = document.createElement('div');
    layout.className = 'home-screen';

    layout.append(buildHomeQuickLinks());
    layout.append(buildHomeStatsCard());

    const highlight = await createHomeHighlightCard();
    if (highlight) {
      layout.append(highlight);
    }

    const features = await createHomeFeaturesCard();
    if (features) {
      layout.append(features);
    }

    const installBanner = buildInstallBanner();
    if (installBanner) {
      layout.append(installBanner);
    }

    if (!highlight) {
      layout.append(buildHomeFallbackCard());
    }

    container.innerHTML = '';
    container.append(layout);
    updateHomeStatsView();
    updateHomeInstallBanner();
  } catch (error) {
    console.error('Anasayfa hazırlanırken hata oluştu.', error);
    container.innerHTML = `
      <article class="card">
        <h2>İçerik yüklenemedi</h2>
        <p>Lütfen sayfayı yenileyip tekrar deneyin.</p>
      </article>
    `;
  }
}

// ---------------------------------------------------------------------------
// Ortak Dua (Firebase)
// ---------------------------------------------------------------------------

function cleanupSharedDuaUI() {
  const ui = state.sharedDua && state.sharedDua.ui;
  if (!ui) {
    return;
  }
  if (Array.isArray(ui.unsubscribers)) {
    ui.unsubscribers.forEach((unsubscribe) => {
      try {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      } catch (_error) {
        // ignore
      }
    });
  }
  state.sharedDua.ui = null;
}

function normaliseSharedDuaRoomId(roomId) {
  if (!roomId || typeof roomId !== 'string') {
    return null;
  }
  const trimmed = roomId.trim();
  if (!trimmed) {
    return null;
  }
  // Firestore auto IDs are URL safe, but user might paste with whitespace.
  if (!/^[A-Za-z0-9_-]{8,}$/.test(trimmed)) {
    return null;
  }
  return trimmed;
}

function parseSharedDuaRoomIdFromLocation() {
  if (typeof window === 'undefined' || !window.location) {
    return null;
  }

  const hash = typeof window.location.hash === 'string' ? window.location.hash : '';
  if (hash && hash.startsWith(SHARED_DUA_ROUTE_PREFIX)) {
    const remainder = hash.slice(SHARED_DUA_ROUTE_PREFIX.length);
    const firstSegment = remainder.split('/')[0];
    const decoded = firstSegment ? decodeURIComponent(firstSegment) : '';
    const normalised = normaliseSharedDuaRoomId(decoded);
    if (normalised) {
      return normalised;
    }
  }

  try {
    const params = new URLSearchParams(window.location.search || '');
    const shared = params.get('shared');
    const room = params.get('room');
    if ((shared === '1' || shared === 'true') && room) {
      const decoded = decodeURIComponent(room);
      return normaliseSharedDuaRoomId(decoded);
    }
  } catch (_error) {
    // ignore
  }

  return null;
}

function getSharedDuaBaseUrl() {
  if (typeof window === 'undefined' || !window.location) {
    return '';
  }
  const origin = window.location.origin || '';
  const pathname = window.location.pathname || '/';
  const basePath = pathname.endsWith('/index.html') ? pathname.slice(0, -'/index.html'.length) : pathname;
  return `${origin}${basePath}`;
}

function buildSharedDuaShareLink(roomId) {
  const base = getSharedDuaBaseUrl();
  return `${base}${SHARED_DUA_ROUTE_PREFIX}${encodeURIComponent(roomId)}`;
}

function setSharedDuaHash(roomId) {
  if (typeof window === 'undefined' || !window.location || !window.history) {
    return;
  }
  const normalised = normaliseSharedDuaRoomId(roomId);
  if (!normalised) {
    return;
  }
  const nextUrl = `${window.location.pathname}${window.location.search}${SHARED_DUA_ROUTE_PREFIX}${encodeURIComponent(normalised)}`;
  window.history.replaceState(null, '', nextUrl);
}

function clearSharedDuaHash() {
  if (typeof window === 'undefined' || !window.location || !window.history) {
    return;
  }
  if (!window.location.hash || !window.location.hash.startsWith(SHARED_DUA_ROUTE_PREFIX)) {
    return;
  }
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

async function copyTextToClipboard(text) {
  const payload = typeof text === 'string' ? text : '';
  if (!payload) {
    return false;
  }

  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(payload);
      return true;
    }
  } catch (_error) {
    // fallback below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = payload;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.append(textarea);
    textarea.select();
    const ok = document.execCommand && document.execCommand('copy');
    textarea.remove();
    return Boolean(ok);
  } catch (_error) {
    return false;
  }
}

function getSharedDuaFirebaseConfig() {
  const config = typeof window !== 'undefined' ? window.FIREBASE_CONFIG : null;
  if (!config || typeof config !== 'object') {
    return null;
  }

  const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const hasAll = required.every((key) => typeof config[key] === 'string' && config[key].trim());
  if (!hasAll) {
    return null;
  }

  return config;
}

async function ensureSharedDuaFirebase() {
  if (sharedDuaFirebasePromise) {
    return sharedDuaFirebasePromise;
  }

  sharedDuaFirebasePromise = (async () => {
    const config = getSharedDuaFirebaseConfig();
    if (!config) {
      throw new Error('Firebase yapılandırması bulunamadı. Lütfen firebase-config.js dosyasını doldurun.');
    }

    const [appModule, authModule, firestoreModule] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${SHARED_DUA_FIREBASE_SDK_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${SHARED_DUA_FIREBASE_SDK_VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${SHARED_DUA_FIREBASE_SDK_VERSION}/firebase-firestore.js`),
    ]);

    const { initializeApp, getApps, getApp } = appModule;
    const { getAuth, signInAnonymously } = authModule;

    const app = getApps().length ? getApp() : initializeApp(config);
    const auth = getAuth(app);

    let user = auth.currentUser;
    if (!user) {
      const result = await signInAnonymously(auth);
      user = result.user;
    }
    if (!user || !user.uid) {
      throw new Error('Oturum açılamadı.');
    }

    const db = firestoreModule.getFirestore(app);
    return {
      uid: user.uid,
      db,
      fs: firestoreModule,
    };
  })();

  return sharedDuaFirebasePromise;
}

function buildSharedDuaPartsDefinition(roomType, hatimMode, totalParts) {
  const resolvedTotal = Math.max(0, Math.floor(totalParts || 0));
  const parts = [];

  if (roomType === 'cevsen') {
    // 100 bab → 5'li gruplar = 20 parça.
    for (let index = 1; index <= 20; index += 1) {
      const start = (index - 1) * 5 + 1;
      const end = Math.min(index * 5, 100);
      parts.push({ id: String(index), index, label: `Bab ${start}-${end}` });
    }
    return parts;
  }

  if (roomType === 'hatim' && hatimMode === 'cuz') {
    for (let index = 1; index <= 30; index += 1) {
      parts.push({ id: String(index), index, label: `Cüz ${index}` });
    }
    return parts;
  }

  for (let index = 1; index <= resolvedTotal; index += 1) {
    parts.push({ id: String(index), index, label: `Sayfa ${index}` });
  }
  return parts;
}

async function createSharedDuaRoom(options) {
  const { db, fs, uid } = await ensureSharedDuaFirebase();

  const roomType = options && options.type === 'cevsen' ? 'cevsen' : 'hatim';
  const hatimMode = roomType === 'hatim' && options && options.hatimMode === 'page' ? 'page' : 'cuz';
  const maxClaimsPerUser = clamp(Math.floor(options && options.maxClaimsPerUser ? options.maxClaimsPerUser : 1), 1, 5);
  const name = options && typeof options.name === 'string' ? options.name.trim() : '';

  const totalParts = roomType === 'cevsen'
    ? 20
    : hatimMode === 'page'
      ? Math.max(1, Math.floor(options && options.totalParts ? options.totalParts : 604))
      : 30;

  const roomsCol = fs.collection(db, 'rooms');
  const roomRef = fs.doc(roomsCol);
  const roomId = roomRef.id;

  const roomPayload = {
    type: roomType,
    hatimMode: roomType === 'hatim' ? hatimMode : null,
    totalParts,
    createdAt: fs.serverTimestamp(),
    createdBy: uid,
    name,
    maxClaimsPerUser,
    members: { [uid]: true },
    claimCounts: { [uid]: 0 },
    status: 'active',
  };

  await fs.setDoc(roomRef, roomPayload);

  const parts = buildSharedDuaPartsDefinition(roomType, hatimMode, totalParts);
  const chunkSize = 450; // Firestore batch limit: 500

  for (let offset = 0; offset < parts.length; offset += chunkSize) {
    const batch = fs.writeBatch(db);
    const slice = parts.slice(offset, offset + chunkSize);
    slice.forEach((part) => {
      const partRef = fs.doc(fs.collection(db, 'rooms', roomId, 'parts'), part.id);
      batch.set(partRef, {
        index: part.index,
        label: part.label,
        state: 'available',
        claimedBy: null,
        claimedAt: null,
        doneBy: null,
        doneAt: null,
      });
    });
    await batch.commit();
  }

  saveSharedDuaLastRoomId(roomId);
  return roomId;
}

async function joinSharedDuaRoom(roomId) {
  const { db, fs, uid } = await ensureSharedDuaFirebase();
  const normalised = normaliseSharedDuaRoomId(roomId);
  if (!normalised) {
    throw new Error('Oda kodu geçersiz.');
  }
  const roomRef = fs.doc(db, 'rooms', normalised);
  await fs.updateDoc(roomRef, { [`members.${uid}`]: true });
  saveSharedDuaLastRoomId(normalised);
  return normalised;
}

async function sharedDuaClaimPart(roomId, partId) {
  const { db, fs, uid } = await ensureSharedDuaFirebase();
  const normalised = normaliseSharedDuaRoomId(roomId);
  const resolvedPartId = String(partId || '').trim();
  if (!normalised || !resolvedPartId) {
    throw new Error('Parça bulunamadı.');
  }

  const roomRef = fs.doc(db, 'rooms', normalised);
  const partRef = fs.doc(db, 'rooms', normalised, 'parts', resolvedPartId);

  await fs.runTransaction(db, async (transaction) => {
    const roomSnap = await transaction.get(roomRef);
    if (!roomSnap.exists()) {
      throw new Error('Oda bulunamadı.');
    }
    const room = roomSnap.data() || {};
    const maxClaims = clamp(Math.floor(room.maxClaimsPerUser || 1), 1, 5);
    const current = room.claimCounts && typeof room.claimCounts[uid] === 'number' ? room.claimCounts[uid] : 0;
    if (current >= maxClaims) {
      throw new Error(`En fazla ${maxClaims} parça alabilirsiniz.`);
    }

    const partSnap = await transaction.get(partRef);
    if (!partSnap.exists()) {
      throw new Error('Parça bulunamadı.');
    }
    const part = partSnap.data() || {};
    if (part.state !== 'available') {
      throw new Error('Bu parça artık uygun değil.');
    }

    transaction.update(partRef, {
      state: 'claimed',
      claimedBy: uid,
      claimedAt: fs.serverTimestamp(),
      doneBy: null,
      doneAt: null,
    });

    transaction.update(roomRef, {
      [`claimCounts.${uid}`]: current + 1,
    });
  });
}

async function sharedDuaReleasePart(roomId, partId) {
  const { db, fs, uid } = await ensureSharedDuaFirebase();
  const normalised = normaliseSharedDuaRoomId(roomId);
  const resolvedPartId = String(partId || '').trim();
  if (!normalised || !resolvedPartId) {
    throw new Error('Parça bulunamadı.');
  }

  const roomRef = fs.doc(db, 'rooms', normalised);
  const partRef = fs.doc(db, 'rooms', normalised, 'parts', resolvedPartId);

  await fs.runTransaction(db, async (transaction) => {
    const roomSnap = await transaction.get(roomRef);
    if (!roomSnap.exists()) {
      throw new Error('Oda bulunamadı.');
    }
    const partSnap = await transaction.get(partRef);
    if (!partSnap.exists()) {
      throw new Error('Parça bulunamadı.');
    }
    const part = partSnap.data() || {};
    if (part.state !== 'claimed' || part.claimedBy !== uid) {
      throw new Error('Bu parçayı yalnızca alan kişi bırakabilir.');
    }

    transaction.update(partRef, {
      state: 'available',
      claimedBy: null,
      claimedAt: null,
      doneBy: null,
      doneAt: null,
    });

    const room = roomSnap.data() || {};
    const current = room.claimCounts && typeof room.claimCounts[uid] === 'number' ? room.claimCounts[uid] : 0;
    transaction.update(roomRef, { [`claimCounts.${uid}`]: Math.max(0, current - 1) });
  });
}

async function sharedDuaMarkDone(roomId, partId) {
  const { db, fs, uid } = await ensureSharedDuaFirebase();
  const normalised = normaliseSharedDuaRoomId(roomId);
  const resolvedPartId = String(partId || '').trim();
  if (!normalised || !resolvedPartId) {
    throw new Error('Parça bulunamadı.');
  }

  const roomRef = fs.doc(db, 'rooms', normalised);
  const partRef = fs.doc(db, 'rooms', normalised, 'parts', resolvedPartId);

  await fs.runTransaction(db, async (transaction) => {
    const roomSnap = await transaction.get(roomRef);
    if (!roomSnap.exists()) {
      throw new Error('Oda bulunamadı.');
    }
    const partSnap = await transaction.get(partRef);
    if (!partSnap.exists()) {
      throw new Error('Parça bulunamadı.');
    }
    const part = partSnap.data() || {};
    if (part.state !== 'claimed' || part.claimedBy !== uid) {
      throw new Error('Bu parçayı yalnızca alan kişi tamamlayabilir.');
    }

    transaction.update(partRef, {
      state: 'done',
      doneBy: uid,
      doneAt: fs.serverTimestamp(),
    });

    const room = roomSnap.data() || {};
    const current = room.claimCounts && typeof room.claimCounts[uid] === 'number' ? room.claimCounts[uid] : 0;
    transaction.update(roomRef, { [`claimCounts.${uid}`]: Math.max(0, current - 1) });
  });
}

async function sharedDuaClaimNextAvailable(roomId, parts) {
  const normalised = normaliseSharedDuaRoomId(roomId);
  if (!normalised) {
    throw new Error('Oda kodu geçersiz.');
  }

  const list = Array.isArray(parts) ? parts.slice() : [];
  list.sort((a, b) => Math.floor(a && a.index ? a.index : 0) - Math.floor(b && b.index ? b.index : 0));
  const candidates = list.filter((part) => part && part.state === 'available' && part.id);
  if (!candidates.length) {
    throw new Error('Uygun parça bulunamadı.');
  }

  let lastError = null;
  const attempts = Math.min(candidates.length, 6);
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await sharedDuaClaimPart(normalised, candidates[attempt].id);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }
  throw new Error('Parça alınamadı.');
}

function computeSharedDuaProgress(parts) {
  const list = Array.isArray(parts) ? parts : [];
  let done = 0;
  let claimed = 0;
  let available = 0;
  list.forEach((part) => {
    const state = part && typeof part.state === 'string' ? part.state : 'available';
    if (state === 'done') done += 1;
    else if (state === 'claimed') claimed += 1;
    else available += 1;
  });
  return { done, claimed, available, total: list.length };
}

function formatSharedDuaPercent(done, total) {
  const resolvedTotal = Math.max(0, Math.floor(total || 0));
  if (!resolvedTotal) {
    return '0';
  }
  const resolvedDone = Math.max(0, Math.floor(done || 0));
  return String(Math.round((resolvedDone / resolvedTotal) * 100));
}

async function renderSharedDua(container) {
  hideNameTooltip();
  cleanupSharedDuaUI();
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'collection-wrapper shared-dua';
  container.append(wrapper);

  const pending = state.sharedDua && state.sharedDua.pendingRoomId ? state.sharedDua.pendingRoomId : null;
  if (pending) {
    state.sharedDua.pendingRoomId = null;
    renderSharedDuaRoom(wrapper, pending);
    return;
  }

  const fromUrl = parseSharedDuaRoomIdFromLocation();
  if (fromUrl) {
    renderSharedDuaRoom(wrapper, fromUrl);
    return;
  }

  renderSharedDuaHome(wrapper);
}

function renderSharedDuaHome(wrapper) {
  wrapper.innerHTML = '';

  const introCard = document.createElement('article');
  introCard.className = 'card collection-intro';
  introCard.innerHTML = `
    <h2 class="collection-intro__title">Ortak Dua</h2>
    <p class="collection-intro__description">Ortak hatim veya Cevşen okuma odaları oluşturun ve katılın.</p>
  `;
  wrapper.append(introCard);

  const list = document.createElement('div');
  list.className = 'collection-list';

  const card = (title, description, icon) => {
    const el = document.createElement('article');
    el.className = 'card shared-dua-card';
    el.innerHTML = `
      <div class="shared-dua-card__header">
        <div class="shared-dua-card__icon" aria-hidden="true">${icon}</div>
        <div class="shared-dua-card__title-wrap">
          <h3 class="shared-dua-card__title">${title}</h3>
          <p class="shared-dua-card__description muted">${description}</p>
        </div>
      </div>
      <div class="shared-dua-card__actions">
        <button type="button" class="button-pill" data-shared-create>Yeni Oda Oluştur</button>
      </div>
    `;
    return el;
  };

  const hatimCard = card('Ortak Hatim', 'Cüz veya sayfa bazında hatim paylaşımı.', '📖');
  hatimCard.querySelector('[data-shared-create]')?.addEventListener('click', () => {
    renderSharedDuaCreate(wrapper, 'hatim');
  });
  list.append(hatimCard);

  const cevsenCard = card('Ortak Cevşen', 'Cevşen-i Kebîr bablarını 5’li gruplar halinde paylaşın.', '📜');
  cevsenCard.querySelector('[data-shared-create]')?.addEventListener('click', () => {
    renderSharedDuaCreate(wrapper, 'cevsen');
  });
  list.append(cevsenCard);

  const joinCard = document.createElement('article');
  joinCard.className = 'card shared-dua-join';
  joinCard.innerHTML = `
    <h3>Odaya Katıl</h3>
    <p class="muted">Paylaşılan bağlantıyı açabilir veya oda kodunu buraya yapıştırabilirsiniz.</p>
    <form class="zikir-form shared-dua-join__form" data-shared-join-form>
      <label class="zikir-form__label">
        Oda kodu
        <input type="text" autocomplete="off" inputmode="text" placeholder="Örn: AbCdEfGh12" data-shared-room-id />
      </label>
      <div class="zikir-form__row">
        <button type="submit" class="button-pill secondary">Katıl</button>
      </div>
      <p class="zikir-form__message" data-shared-join-message hidden></p>
    </form>
  `;

  const joinForm = joinCard.querySelector('[data-shared-join-form]');
  const joinInput = joinCard.querySelector('[data-shared-room-id]');
  const joinMessage = joinCard.querySelector('[data-shared-join-message]');

  const setJoinMessage = (status, message) => {
    if (!joinMessage) {
      return;
    }
    if (!message) {
      joinMessage.hidden = true;
      joinMessage.textContent = '';
      joinMessage.removeAttribute('data-status');
      return;
    }
    joinMessage.hidden = false;
    joinMessage.textContent = message;
    if (status) {
      joinMessage.dataset.status = status;
    } else {
      joinMessage.removeAttribute('data-status');
    }
  };

  if (joinForm) {
    joinForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      setJoinMessage('', '');
      const value = joinInput && typeof joinInput.value === 'string' ? joinInput.value : '';
      const roomId = normaliseSharedDuaRoomId(value);
      if (!roomId) {
        setJoinMessage('error', 'Lütfen geçerli bir oda kodu girin.');
        return;
      }
      const submitButton = joinForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
      }
      try {
        setSharedDuaHash(roomId);
        await joinSharedDuaRoom(roomId);
        renderSharedDuaRoom(wrapper, roomId);
      } catch (error) {
        console.warn('Odaya katılım başarısız.', error);
        setJoinMessage('error', error && error.message ? error.message : 'Odaya katılırken bir sorun yaşandı.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  if (state.sharedDua && state.sharedDua.lastRoomId) {
    const last = normaliseSharedDuaRoomId(state.sharedDua.lastRoomId);
    if (last) {
      const lastCard = document.createElement('article');
      lastCard.className = 'card shared-dua-last';
      lastCard.innerHTML = `
        <h3>Son oda</h3>
        <p class="muted">${last}</p>
        <div class="shared-dua-card__actions">
          <button type="button" class="button-pill secondary" data-shared-last-open>Odayı Aç</button>
        </div>
      `;
      lastCard.querySelector('[data-shared-last-open]')?.addEventListener('click', () => {
        setSharedDuaHash(last);
        renderSharedDuaRoom(wrapper, last);
      });
      list.append(lastCard);
    }
  }

  list.append(joinCard);
  wrapper.append(list);
}

function renderSharedDuaCreate(wrapper, roomType) {
  wrapper.innerHTML = '';

  const headerCard = document.createElement('article');
  headerCard.className = 'card collection-detail__header';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'collection-back button-pill secondary';
  backButton.textContent = 'Ortak Dua’ya dön';
  backButton.addEventListener('click', () => {
    clearSharedDuaHash();
    renderSharedDuaHome(wrapper);
  });

  const title = document.createElement('h3');
  title.className = 'collection-detail__title';
  title.textContent = roomType === 'cevsen' ? 'Ortak Cevşen odası oluştur' : 'Ortak Hatim odası oluştur';

  headerCard.append(backButton, title);
  wrapper.append(headerCard);

  const formCard = document.createElement('article');
  formCard.className = 'card shared-dua-create';

  const hasFirebaseConfig = Boolean(getSharedDuaFirebaseConfig());
  if (!hasFirebaseConfig) {
    const warn = document.createElement('p');
    warn.className = 'muted';
    warn.textContent = 'Firebase yapılandırması bulunamadı. Bu özelliği kullanmak için `firebase-config.js` dosyasını doldurun.';
    formCard.append(warn);
  }

  const form = document.createElement('form');
  form.className = 'zikir-form';
  form.innerHTML = `
    ${roomType === 'hatim' ? `
      <label class="zikir-form__label">
        Hatim türü
        <select data-shared-hatim-mode>
          <option value="cuz">Cüzlü Hatim (30)</option>
          <option value="page">Sayfalı Hatim</option>
        </select>
      </label>
      <label class="zikir-form__label" data-shared-pages-wrap hidden>
        Toplam sayfa
        <input type="number" min="1" step="1" value="604" inputmode="numeric" data-shared-total-pages />
      </label>
    ` : ''}
    <label class="zikir-form__label">
      Oda adı (opsiyonel)
      <input type="text" autocomplete="off" placeholder="Örn: Sabah hatmi" data-shared-room-name />
    </label>
    <label class="zikir-form__label">
      Kişi başı maksimum parça
      <select data-shared-max-claims>
        <option value="1" selected>1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </label>
    <div class="zikir-form__row">
      <button type="submit" class="button-pill">Odayı Oluştur</button>
    </div>
    <p class="zikir-form__message" data-shared-create-message hidden></p>
  `;

  const modeSelect = form.querySelector('[data-shared-hatim-mode]');
  const pagesWrap = form.querySelector('[data-shared-pages-wrap]');
  const totalPagesInput = form.querySelector('[data-shared-total-pages]');
  const message = form.querySelector('[data-shared-create-message]');

  const setMessage = (status, text) => {
    if (!message) {
      return;
    }
    if (!text) {
      message.hidden = true;
      message.textContent = '';
      message.removeAttribute('data-status');
      return;
    }
    message.hidden = false;
    message.textContent = text;
    if (status) {
      message.dataset.status = status;
    } else {
      message.removeAttribute('data-status');
    }
  };

  const syncMode = () => {
    if (!modeSelect || !pagesWrap) {
      return;
    }
    const isPage = modeSelect.value === 'page';
    pagesWrap.hidden = !isPage;
  };

  if (modeSelect) {
    modeSelect.addEventListener('change', syncMode);
    syncMode();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('', '');

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const nameInput = form.querySelector('[data-shared-room-name]');
      const maxClaimsSelect = form.querySelector('[data-shared-max-claims]');
      const hatimMode = modeSelect && modeSelect.value === 'page' ? 'page' : 'cuz';
      const maxClaims = maxClaimsSelect ? Number.parseInt(maxClaimsSelect.value, 10) : 1;
      const roomName = nameInput && typeof nameInput.value === 'string' ? nameInput.value : '';
      const totalPages = totalPagesInput ? Number.parseInt(totalPagesInput.value, 10) : 604;

      const roomId = await createSharedDuaRoom({
        type: roomType,
        hatimMode,
        totalParts: hatimMode === 'page' ? totalPages : undefined,
        name: roomName,
        maxClaimsPerUser: maxClaims,
      });

      setSharedDuaHash(roomId);
      renderSharedDuaRoom(wrapper, roomId);
    } catch (error) {
      console.error('Oda oluşturma başarısız.', error);
      setMessage('error', error && error.message ? error.message : 'Oda oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });

  formCard.append(form);
  wrapper.append(formCard);
}

function renderSharedDuaRoom(wrapper, roomId) {
  const normalised = normaliseSharedDuaRoomId(roomId);
  if (!normalised) {
    wrapper.innerHTML = `
      <article class="card">
        <h2>Oda bulunamadı</h2>
        <p class="muted">Bağlantı veya oda kodu geçersiz görünüyor.</p>
      </article>
    `;
    return;
  }

  wrapper.innerHTML = '';

  const headerCard = document.createElement('article');
  headerCard.className = 'card collection-detail__header';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'collection-back button-pill secondary';
  backButton.textContent = 'Ortak Dua’ya dön';
  backButton.addEventListener('click', () => {
    cleanupSharedDuaUI();
    clearSharedDuaHash();
    renderSharedDuaHome(wrapper);
  });

  const title = document.createElement('h3');
  title.className = 'collection-detail__title';
  title.textContent = 'Oda yükleniyor…';

  headerCard.append(backButton, title);
  wrapper.append(headerCard);

  const roomCard = document.createElement('article');
  roomCard.className = 'card shared-dua-room';
  roomCard.innerHTML = `<p class="muted">Oturum açılıyor ve oda bilgileri yükleniyor…</p>`;
  wrapper.append(roomCard);

  const ui = {
    roomId: normalised,
    uid: null,
    unsubscribers: [],
    room: null,
    parts: [],
  };
  state.sharedDua.ui = ui;

  const renderError = (headline, message) => {
    title.textContent = 'Ortak Dua';
    roomCard.innerHTML = `
      <h3>${headline}</h3>
      <p class="muted">${message}</p>
    `;
  };

  const renderRoom = () => {
    const room = ui.room || {};
    const parts = Array.isArray(ui.parts) ? ui.parts : [];
    const progress = computeSharedDuaProgress(parts);

    const name = room && typeof room.name === 'string' ? room.name.trim() : '';
    const roomType = room && room.type === 'cevsen' ? 'cevsen' : 'hatim';
    const roomLabel = roomType === 'cevsen' ? 'Ortak Cevşen' : 'Ortak Hatim';
    title.textContent = name ? `${roomLabel}: ${name}` : `${roomLabel} odası`;

    const shareLink = buildSharedDuaShareLink(ui.roomId);

    const claimedByMe = parts.filter((part) => part && part.state === 'claimed' && part.claimedBy === ui.uid);
    const completed = progress.total > 0 && progress.done === progress.total;

    roomCard.innerHTML = `
      <div class="shared-dua-room__top">
        <div class="shared-dua-room__meta">
          <p class="shared-dua-room__code"><strong>Oda kodu:</strong> <span>${ui.roomId}</span></p>
          <p class="shared-dua-room__progress">${progress.done} / ${progress.total} tamamlandı (%${formatSharedDuaPercent(progress.done, progress.total)})</p>
          ${completed ? '<p class="shared-dua-room__complete">Bu oda tamamlandı.</p>' : ''}
        </div>
        <div class="shared-dua-room__share">
          <button type="button" class="button-pill secondary" data-shared-copy-link>Bağlantıyı kopyala</button>
          <p class="zikir-form__message" data-shared-copy-status hidden></p>
        </div>
      </div>

      <div class="shared-dua-room__actions">
        <button type="button" class="button-pill" data-shared-claim-next>Uygun parçayı al</button>
      </div>

      <div class="shared-dua-room__section" data-shared-my-claims>
        <h4>Benim parçalarım</h4>
        ${claimedByMe.length ? '' : '<p class="muted">Henüz aldığınız bir parça yok.</p>'}
        <div class="shared-dua-claims" data-shared-claims-list></div>
      </div>

      <div class="shared-dua-room__section">
        <h4>Tüm parçalar</h4>
        <div class="shared-dua-parts" data-shared-parts></div>
      </div>
    `;

    const copyButton = roomCard.querySelector('[data-shared-copy-link]');
    const copyStatus = roomCard.querySelector('[data-shared-copy-status]');
    const setCopyStatus = (status, message) => {
      if (!copyStatus) {
        return;
      }
      if (!message) {
        copyStatus.hidden = true;
        copyStatus.textContent = '';
        copyStatus.removeAttribute('data-status');
        return;
      }
      copyStatus.hidden = false;
      copyStatus.textContent = message;
      if (status) {
        copyStatus.dataset.status = status;
      } else {
        copyStatus.removeAttribute('data-status');
      }
    };

    if (copyButton) {
      copyButton.addEventListener('click', async () => {
        setCopyStatus('', '');
        const ok = await copyTextToClipboard(shareLink);
        if (ok) {
          setCopyStatus('success', 'Bağlantı kopyalandı.');
          window.setTimeout(() => setCopyStatus('', ''), 2000);
        } else {
          setCopyStatus('error', 'Bağlantı kopyalanamadı.');
        }
      });
    }

    const claimNextButton = roomCard.querySelector('[data-shared-claim-next]');
    if (claimNextButton) {
      claimNextButton.disabled = completed || progress.total === 0;
      claimNextButton.addEventListener('click', async () => {
        if (claimNextButton.disabled) {
          return;
        }
        claimNextButton.disabled = true;
        try {
          await sharedDuaClaimNextAvailable(ui.roomId, parts);
        } catch (error) {
          console.warn('Parça alınamadı.', error);
          setCopyStatus('error', error && error.message ? error.message : 'Parça alınamadı.');
          window.setTimeout(() => setCopyStatus('', ''), 2500);
        } finally {
          claimNextButton.disabled = completed || progress.total === 0;
        }
      });
    }

    const claimsList = roomCard.querySelector('[data-shared-claims-list]');
    if (claimsList) {
      claimsList.innerHTML = '';
      const fragment = document.createDocumentFragment();
      claimedByMe.forEach((part) => {
        const row = document.createElement('div');
        row.className = 'shared-dua-claim';
        row.innerHTML = `
          <div class="shared-dua-claim__label">${part.label || `Parça ${part.index}`}</div>
          <div class="shared-dua-claim__actions">
            <button type="button" class="button-pill secondary" data-shared-release>Bırak</button>
            <button type="button" class="button-pill" data-shared-done>Tamamla</button>
          </div>
        `;
        const releaseButton = row.querySelector('[data-shared-release]');
        const doneButton = row.querySelector('[data-shared-done]');
        if (releaseButton) {
          releaseButton.addEventListener('click', async () => {
            releaseButton.disabled = true;
            doneButton && (doneButton.disabled = true);
            try {
              await sharedDuaReleasePart(ui.roomId, part.id);
            } catch (error) {
              console.warn('Parça bırakılamadı.', error);
              setCopyStatus('error', error && error.message ? error.message : 'Parça bırakılamadı.');
              window.setTimeout(() => setCopyStatus('', ''), 2500);
            } finally {
              releaseButton.disabled = false;
              doneButton && (doneButton.disabled = false);
            }
          });
        }
        if (doneButton) {
          doneButton.addEventListener('click', async () => {
            releaseButton && (releaseButton.disabled = true);
            doneButton.disabled = true;
            try {
              await sharedDuaMarkDone(ui.roomId, part.id);
            } catch (error) {
              console.warn('Parça tamamlanamadı.', error);
              setCopyStatus('error', error && error.message ? error.message : 'Parça tamamlanamadı.');
              window.setTimeout(() => setCopyStatus('', ''), 2500);
            } finally {
              releaseButton && (releaseButton.disabled = false);
              doneButton.disabled = false;
            }
          });
        }
        fragment.append(row);
      });
      claimsList.append(fragment);
    }

    const partsContainer = roomCard.querySelector('[data-shared-parts]');
    if (partsContainer) {
      partsContainer.innerHTML = '';
      const fragment = document.createDocumentFragment();

      parts.forEach((part) => {
        const stateValue = part && typeof part.state === 'string' ? part.state : 'available';
        const isMine = stateValue === 'claimed' && part.claimedBy === ui.uid;

        const item = document.createElement('div');
        item.className = `shared-dua-part shared-dua-part--${stateValue}${isMine ? ' is-mine' : ''}`;

        const statusLabel = stateValue === 'done' ? 'Tamamlandı' : stateValue === 'claimed' ? 'Alındı' : 'Uygun';

        item.innerHTML = `
          <div class="shared-dua-part__header">
            <div class="shared-dua-part__label">${part.label || `Parça ${part.index}`}</div>
            <div class="shared-dua-part__status">${statusLabel}</div>
          </div>
          <div class="shared-dua-part__actions"></div>
        `;

        const actions = item.querySelector('.shared-dua-part__actions');
        if (actions) {
          if (stateValue === 'available') {
            const claim = document.createElement('button');
            claim.type = 'button';
            claim.className = 'button-pill secondary shared-dua-part__button';
            claim.textContent = 'Al';
            claim.addEventListener('click', async () => {
              claim.disabled = true;
              try {
                await sharedDuaClaimPart(ui.roomId, part.id);
              } catch (error) {
                console.warn('Parça alınamadı.', error);
                setCopyStatus('error', error && error.message ? error.message : 'Parça alınamadı.');
                window.setTimeout(() => setCopyStatus('', ''), 2500);
              } finally {
                claim.disabled = false;
              }
            });
            actions.append(claim);
          } else if (isMine) {
            const release = document.createElement('button');
            release.type = 'button';
            release.className = 'button-pill secondary shared-dua-part__button';
            release.textContent = 'Bırak';

            const done = document.createElement('button');
            done.type = 'button';
            done.className = 'button-pill shared-dua-part__button';
            done.textContent = 'Tamamla';

            release.addEventListener('click', async () => {
              release.disabled = true;
              done.disabled = true;
              try {
                await sharedDuaReleasePart(ui.roomId, part.id);
              } catch (error) {
                console.warn('Parça bırakılamadı.', error);
                setCopyStatus('error', error && error.message ? error.message : 'Parça bırakılamadı.');
                window.setTimeout(() => setCopyStatus('', ''), 2500);
              } finally {
                release.disabled = false;
                done.disabled = false;
              }
            });

            done.addEventListener('click', async () => {
              release.disabled = true;
              done.disabled = true;
              try {
                await sharedDuaMarkDone(ui.roomId, part.id);
              } catch (error) {
                console.warn('Parça tamamlanamadı.', error);
                setCopyStatus('error', error && error.message ? error.message : 'Parça tamamlanamadı.');
                window.setTimeout(() => setCopyStatus('', ''), 2500);
              } finally {
                release.disabled = false;
                done.disabled = false;
              }
            });

            actions.append(release, done);
          }
        }

        fragment.append(item);
      });

      partsContainer.append(fragment);
    }
  };

  (async () => {
    try {
      const { db, fs, uid } = await ensureSharedDuaFirebase();
      ui.uid = uid;

      // Odaya katılım (members.<uid>=true) + "son oda" kaydı.
      await joinSharedDuaRoom(ui.roomId);

      const roomRef = fs.doc(db, 'rooms', ui.roomId);
      const partsQuery = fs.query(fs.collection(db, 'rooms', ui.roomId, 'parts'), fs.orderBy('index'));

      const unsubRoom = fs.onSnapshot(roomRef, (snapshot) => {
        if (!snapshot.exists()) {
          ui.room = null;
          renderError('Oda bulunamadı', 'Bu oda silinmiş veya erişime kapatılmış olabilir.');
          return;
        }
        ui.room = { id: snapshot.id, ...snapshot.data() };
        renderRoom();
      }, (error) => {
        console.error('Oda dinleyicisi hatası.', error);
        renderError('Oda yüklenemedi', error && error.message ? error.message : 'Oda bilgileri alınamadı.');
      });

      const unsubParts = fs.onSnapshot(partsQuery, (snapshot) => {
        ui.parts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        renderRoom();
      }, (error) => {
        console.error('Parça dinleyicisi hatası.', error);
        renderError('Parçalar yüklenemedi', error && error.message ? error.message : 'Parça listesi alınamadı.');
      });

      ui.unsubscribers.push(unsubRoom, unsubParts);
    } catch (error) {
      console.error('Ortak Dua oda açılışı başarısız.', error);
      renderError('Ortak Dua kullanılamıyor', error && error.message ? error.message : 'Bu özellik şu anda kullanılamıyor.');
    }
  })();
}

async function renderZikirManager(container) {
  hideNameTooltip();
  container.innerHTML = `<div class="loading">Zikirler yükleniyor…</div>`;
  state.zikirUI = null;
  state.zikirView = DEFAULT_ZIKIR_VIEW;

  try {
    await ensureZikirRepositoryReady();
    const ui = buildZikirShell();
    state.zikirUI = ui;
    container.innerHTML = '';
    container.append(ui.root);
    refreshZikirState();
    refreshZikirUI();
  } catch (error) {
    console.error('Zikir yöneticisi hazırlanırken hata oluştu.', error);
    container.innerHTML = `
      <article class="card">
        <h2>Zikirler yüklenemedi</h2>
        <p>Lütfen sayfayı yeniledikten sonra tekrar deneyin.</p>
      </article>
    `;
  }
}


function buildZikirShell() {
  const root = document.createElement('div');
  root.className = 'zikir-shell';
  root.innerHTML = `
    <div class="zikir-tabs" role="tablist">
      <button type="button" class="zikir-tab is-active" data-zikir-tab="list" aria-pressed="true">Zikirler</button>
      <button type="button" class="zikir-tab" data-zikir-tab="manage" aria-pressed="false">Zikir ayarları</button>
    </div>
    <div class="zikir-panels">
      <div class="zikir-panel" data-zikir-panel="list"></div>
      <div class="zikir-panel" data-zikir-panel="manage" hidden></div>
    </div>
  `;

  const tabButtons = Array.from(root.querySelectorAll('[data-zikir-tab]'));
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setZikirView(button.dataset.zikirTab);
    });
  });

  const listPanel = root.querySelector('[data-zikir-panel="list"]');
  const managePanelWrapper = root.querySelector('[data-zikir-panel="manage"]');

  listPanel.innerHTML = `
    <article class="card zikir-reader">
      <header class="zikir-reader__header">
        <div class="zikir-reader__heading">
          <h2>Günlük zikirler</h2>
          <p>Seçtiğiniz zikirleri buradan okuyabilirsiniz.</p>
        </div>
        <button type="button" class="button-pill secondary" data-zikir-open-manage>Zikir ayarları</button>
      </header>
      <div class="zikir-preview__body" data-zikir-preview></div>
    </article>
  `;

  const openManageButton = listPanel.querySelector('[data-zikir-open-manage]');
  if (openManageButton) {
    openManageButton.addEventListener('click', () => setZikirView('manage'));
  }

  const managePanel = buildZikirManagePanel();
  managePanelWrapper.append(managePanel.root);

  return {
    root,
    tabButtons,
    panels: {
      list: listPanel,
      manage: managePanelWrapper,
    },
    previewContainer: listPanel.querySelector('[data-zikir-preview]'),
    manage: managePanel,
    listContainer: managePanel.listContainer,
    listEmpty: managePanel.listEmpty,
    form: managePanel.form,
    formMessage: managePanel.formMessage,
    titleInput: managePanel.titleInput,
    contentInput: managePanel.contentInput,
    countInput: managePanel.countInput,
  };
}

function buildZikirManagePanel() {
  const root = document.createElement('div');
  root.className = 'zikir-manage';
  root.innerHTML = `
    <div class="zikir-manage__toolbar">
      <button type="button" class="button-pill secondary" data-zikir-open-list>Okuma ekranına dön</button>
    </div>
    <div class="zikir-manage__grid">
      <article class="card zikir-card zikir-card--list" data-disable-tooltips="true">
        <header class="zikir-card__header">
          <h2>Zikir listesi</h2>
          <p>Zikirleri görünürlük ve sıralama tercihlerine göre düzenleyin.</p>
        </header>
        <div class="zikir-list" data-zikir-list>
          <div class="zikir-list__items" data-zikir-items></div>
          <p class="zikir-list__empty" data-zikir-empty hidden>Henüz zikir eklenmedi.</p>
        </div>
      </article>

      <article class="card zikir-card zikir-card--form">
        <header class="zikir-card__header">
          <h2>Yeni zikir ekle</h2>
          <p>Başlık ve metin girerek listeye yeni bir zikir ekleyebilirsiniz.</p>
        </header>
        <form class="zikir-form" data-zikir-form novalidate>
          <label class="zikir-form__label">
            <span>Başlık</span>
            <input type="text" name="title" maxlength="160" autocomplete="off" required />
          </label>
          <label class="zikir-form__label">
            <span>İçerik (Markdown destekli)</span>
            <textarea name="content" rows="6" required></textarea>
          </label>
          <div class="zikir-form__row">
            <label class="zikir-form__label zikir-form__label--inline">
              <span>Tekrar sayısı</span>
              <input type="number" name="count" min="1" max="10000" inputmode="numeric" placeholder="İsteğe bağlı" />
            </label>
            <button type="submit" class="button-pill">Zikri ekle</button>
            <button type="reset" class="button-pill secondary">Temizle</button>
          </div>
          <p class="zikir-form__hint">İçerikte Arapça metin, anlam veya açıklama ekleyebilirsiniz. Tekrar sayısı girerseniz sayaç otomatik oluşturulur.</p>
          <p class="zikir-form__message" data-zikir-form-message hidden></p>
        </form>
      </article>
    </div>
  `;

  const listContainer = root.querySelector('[data-zikir-items]');
  const listEmpty = root.querySelector('[data-zikir-empty]');
  const form = root.querySelector('[data-zikir-form]');
  const formMessage = root.querySelector('[data-zikir-form-message]');
  const titleInput = form.querySelector('input[name="title"]');
  const contentInput = form.querySelector('textarea[name="content"]');
  const countInput = form.querySelector('input[name="count"]');
  const openListButton = root.querySelector('[data-zikir-open-list]');

  if (openListButton) {
    openListButton.addEventListener('click', () => setZikirView('list'));
  }

  listContainer.addEventListener('click', handleZikirListAction);
  form.addEventListener('submit', handleZikirFormSubmit);
  form.addEventListener('reset', () => {
    if (formMessage) {
      formMessage.hidden = true;
      formMessage.textContent = '';
      formMessage.removeAttribute('data-status');
    }
  });

  return {
    root,
    listContainer,
    listEmpty,
    form,
    formMessage,
    titleInput,
    contentInput,
    countInput,
  };
}

function refreshZikirState() {
  if (!state.zikirRepository) {
    state.zikirs = [];
    return;
  }
  state.zikirs = getZikirItems({ includeHidden: true });
}

function refreshZikirUI() {
  const ui = state.zikirUI;
  if (!ui) {
    return;
  }

  renderZikirList(ui.manage.listContainer, ui.manage.listEmpty);
  renderZikirPreview(ui.previewContainer).catch((error) => {
    console.error('Zikir önizlemesi hazırlanamadı.', error);
    if (ui.previewContainer) {
      ui.previewContainer.innerHTML = '<p class="zikir-preview__empty">Zikirler görüntülenemedi. Lütfen daha sonra tekrar deneyin.</p>';
    }
  });

  setZikirView(state.zikirView);
}

function setZikirView(view) {
  const normalized = view === 'manage' ? 'manage' : DEFAULT_ZIKIR_VIEW;
  state.zikirView = normalized;

  const ui = state.zikirUI;
  if (!ui) {
    return;
  }

  Object.entries(ui.panels).forEach(([key, panel]) => {
    if (!panel) {
      return;
    }
    panel.hidden = key !== normalized;
  });

  ui.tabButtons.forEach((button) => {
    const isActive = button.dataset.zikirTab === normalized;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function renderZikirList(container, emptyElement) {
  if (!container || !state.zikirs) {
    return;
  }

  container.innerHTML = '';
  const items = state.zikirs;

  if (!items.length) {
    if (emptyElement) {
      emptyElement.hidden = false;
    }
    return;
  }

  if (emptyElement) {
    emptyElement.hidden = true;
  }

  items.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'zikir-item';
    row.dataset.zikirId = item.id;
    if (item.type === 'custom') {
      row.dataset.zikirCustom = 'true';
    }
    if (!item.visible) {
      row.classList.add('is-hidden');
    }

    const info = document.createElement('div');
    info.className = 'zikir-item__info';

    const title = document.createElement('span');
    title.className = 'zikir-item__title';
    title.textContent = item.title || 'Adsız zikir';
    info.append(title);

    if (item.type === 'custom') {
      const badge = document.createElement('span');
      badge.className = 'zikir-item__badge';
      badge.textContent = 'Özel';
      info.append(badge);
    }

    if (!item.visible) {
      const badge = document.createElement('span');
      badge.className = 'zikir-item__badge zikir-item__badge--muted';
      badge.textContent = 'Gizli';
      info.append(badge);
    }

    const controls = document.createElement('div');
    controls.className = 'zikir-item__actions';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'zikir-item__button';
    toggle.dataset.action = 'toggle';
    toggle.textContent = item.visible ? 'Gizle' : 'Göster';
    controls.append(toggle);

    const upButton = document.createElement('button');
    upButton.type = 'button';
    upButton.className = 'zikir-item__button';
    upButton.dataset.action = 'move-up';
    upButton.textContent = 'Yukarı';
    upButton.disabled = index === 0;
    controls.append(upButton);

    const downButton = document.createElement('button');
    downButton.type = 'button';
    downButton.className = 'zikir-item__button';
    downButton.dataset.action = 'move-down';
    downButton.textContent = 'Aşağı';
    downButton.disabled = index === items.length - 1;
    controls.append(downButton);

    if (item.type === 'custom') {
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'zikir-item__button zikir-item__button--danger';
      removeButton.dataset.action = 'remove';
      removeButton.textContent = 'Sil';
      controls.append(removeButton);
    }

    row.append(info, controls);
    container.append(row);
  });
}

async function renderZikirPreview(container) {
  if (!container) {
    return;
  }

  container.innerHTML = '';
  const visibleItems = getZikirItems({ includeHidden: false });

  if (!visibleItems.length) {
    container.innerHTML = '<p class="zikir-preview__empty">Görünür zikir bulunmuyor. Zikir ayarlarından seçim yapabilirsiniz.</p>';
    return;
  }

  visibleItems.forEach((item) => {
    const section = document.createElement('section');
    section.className = 'zikir-preview__item';
    section.dataset.zikirId = item.id;

    const content = document.createElement('div');
    content.className = 'zikir-preview__content';
    renderTesbihat(content, item.markdown);

    const placeholders = content.querySelectorAll('.counter-placeholder');
    placeholders.forEach((placeholder, index) => {
      placeholder.dataset.counterKey = `zikir-${item.id}-${index + 1}`;
    });

    section.append(content);
    container.append(section);
    setupCounters(section, `zikir-${item.id}`);
  });

  try {
    await ensureNamesLoaded();
    annotateNames(container);
  } catch (error) {
    console.warn('Zikir isim açıklamaları uygulanamadı.', error);
  }
}

function handleZikirListAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const row = button.closest('[data-zikir-id]');
  if (!row || !action) {
    return;
  }

  const zikirId = row.dataset.zikirId;
  if (!zikirId) {
    return;
  }

  switch (action) {
    case 'toggle':
      toggleZikirVisibility(zikirId);
      break;
    case 'move-up':
      moveZikir(zikirId, -1);
      break;
    case 'move-down':
      moveZikir(zikirId, 1);
      break;
    case 'remove':
      removeCustomZikir(zikirId);
      break;
    default:
      break;
  }
}

function handleZikirFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget instanceof HTMLFormElement ? event.currentTarget : null;
  if (!form) {
    return;
  }

  const titleInput = form.querySelector('input[name="title"]');
  const contentInput = form.querySelector('textarea[name="content"]');
  const countInput = form.querySelector('input[name="count"]');
  const messageElement = form.querySelector('[data-zikir-form-message]');

  const title = titleInput?.value.trim() || '';
  const content = contentInput?.value.trim() || '';
  const countValue = countInput?.value.trim() || '';
  const hasCount = countValue.length > 0;
  const repeatCount = hasCount ? Number.parseInt(countValue, 10) : null;

  if (!title) {
    updateZikirFormMessage(messageElement, 'error', 'Başlık alanı boş bırakılamaz.');
    titleInput?.focus();
    return;
  }

  if (!content) {
    updateZikirFormMessage(messageElement, 'error', 'İçerik alanı boş bırakılamaz.');
    contentInput?.focus();
    return;
  }

  if (hasCount && (!Number.isFinite(repeatCount) || repeatCount <= 0)) {
    updateZikirFormMessage(messageElement, 'error', 'Tekrar sayısı için geçerli bir sayı girin.');
    countInput?.focus();
    return;
  }

  try {
    addCustomZikir({
      title,
      content,
      repeatCount: hasCount ? repeatCount : null,
    });
    form.reset();
    updateZikirFormMessage(messageElement, 'success', `"${title}" zikri listeye eklendi.`);
  } catch (error) {
    console.error('Zikir eklenirken hata oluştu.', error);
    updateZikirFormMessage(messageElement, 'error', error.message || 'Zikir eklenemedi. Lütfen tekrar deneyin.');
  }
}

function updateZikirFormMessage(element, status, message) {
  if (!element) {
    return;
  }
  element.hidden = false;
  element.textContent = message;
  element.dataset.status = status;
}

async function ensureZikirRepositoryReady() {
  if (state.zikirRepository) {
    return state.zikirRepository;
  }

  const defaults = await ensureZikirDefaults();
  const stored = loadStoredZikirRepository();
  const repository = mergeZikirRepository(defaults, stored);
  state.zikirDefaults = defaults;
  state.zikirRepository = repository;
  refreshZikirState();
  return repository;
}

async function ensureZikirDefaults() {
  if (Array.isArray(state.zikirDefaults) && state.zikirDefaults.length > 0) {
    return state.zikirDefaults;
  }

  if (!zikirDefaultsPromise) {
    zikirDefaultsPromise = fetchText(ZIKIR_DEFAULTS_PATH)
      .then((raw) => JSON.parse(raw))
      .catch((error) => {
        zikirDefaultsPromise = null;
        throw error;
      });
  }

  const defaults = await zikirDefaultsPromise;
  state.zikirDefaults = Array.isArray(defaults) ? defaults : [];
  return state.zikirDefaults;
}

function loadStoredZikirRepository() {
  try {
    const raw = localStorage.getItem(ZIKIR_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (error) {
    console.warn('Zikir ayarları okunamadı, varsayılanlar kullanılacak.', error);
  }
  return null;
}

function mergeZikirRepository(defaults, stored) {
  const repository = createDefaultZikirRepository(defaults);

  if (!stored || typeof stored !== 'object') {
    return repository;
  }

  const storedItems = stored.items && typeof stored.items === 'object' ? stored.items : {};
  const customItems = [];

  Object.values(storedItems).forEach((item) => {
    if (!item || typeof item !== 'object' || !item.id) {
      return;
    }

    if (item.type === 'custom') {
      customItems.push(item);
      return;
    }

    if (repository.items[item.id]) {
      repository.items[item.id].visible = item.visible !== false;
    }
  });

  customItems.forEach((item) => {
    repository.items[item.id] = {
      id: item.id,
      title: item.title || 'Özel zikir',
      markdown: item.markdown || '',
      visible: item.visible !== false,
      type: 'custom',
      createdAt: item.createdAt || null,
    };
  });

  const storedOrder = Array.isArray(stored.order) ? stored.order.filter((id) => repository.items[id]) : [];
  const remaining = Object.keys(repository.items).filter((id) => !storedOrder.includes(id));
  repository.order = storedOrder.concat(remaining);

  if (Number.isFinite(stored.nextCustomIndex)) {
    repository.nextCustomIndex = Math.max(1, Number.parseInt(stored.nextCustomIndex, 10));
  }

  return repository;
}

function createDefaultZikirRepository(defaults) {
  const items = {};
  const order = [];

  const sorted = Array.isArray(defaults) ? [...defaults] : [];
  sorted.sort((a, b) => {
    const left = Number.isFinite(a?.order) ? a.order : 0;
    const right = Number.isFinite(b?.order) ? b.order : 0;
    return left - right;
  });

  sorted.forEach((item, index) => {
    if (!item || !item.id) {
      return;
    }
    items[item.id] = {
      id: item.id,
      title: item.title || `Zikir ${index + 1}`,
      markdown: item.markdown || '',
      visible: item.visible !== false,
      type: 'core',
    };
    order.push(item.id);
  });

  return {
    version: ZIKIR_STORAGE_VERSION,
    items,
    order,
    nextCustomIndex: 1,
  };
}

function persistZikirRepository() {
  if (!state.zikirRepository) {
    return;
  }

  try {
    const payload = {
      version: ZIKIR_STORAGE_VERSION,
      items: state.zikirRepository.items,
      order: state.zikirRepository.order,
      nextCustomIndex: state.zikirRepository.nextCustomIndex || 1,
    };
    localStorage.setItem(ZIKIR_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('Zikir ayarları kaydedilemedi.', error);
  }
}

function getZikirItems({ includeHidden = true } = {}) {
  const repository = state.zikirRepository;
  if (!repository) {
    return [];
  }

  const items = [];
  const order = Array.isArray(repository.order) ? repository.order : Object.keys(repository.items);

  order.forEach((id) => {
    const item = repository.items[id];
    if (!item) {
      return;
    }
    if (!includeHidden && item.visible === false) {
      return;
    }
    items.push({ ...item });
  });

  return items;
}

function toggleZikirVisibility(zikirId) {
  const repository = state.zikirRepository;
  if (!repository || !repository.items[zikirId]) {
    return;
  }
  repository.items[zikirId].visible = !repository.items[zikirId].visible;
  persistZikirRepository();
  refreshZikirState();
  refreshZikirUI();
}

function moveZikir(zikirId, direction) {
  const repository = state.zikirRepository;
  if (!repository || !Array.isArray(repository.order) || !repository.items[zikirId]) {
    return;
  }

  const currentIndex = repository.order.indexOf(zikirId);
  if (currentIndex === -1) {
    return;
  }

  const targetIndex = currentIndex + direction;
  if (targetIndex < 0 || targetIndex >= repository.order.length) {
    return;
  }

  const [entry] = repository.order.splice(currentIndex, 1);
  repository.order.splice(targetIndex, 0, entry);
  persistZikirRepository();
  refreshZikirState();
  refreshZikirUI();
}

function removeCustomZikir(zikirId) {
  const repository = state.zikirRepository;
  if (!repository) {
    return;
  }

  const item = repository.items[zikirId];
  if (!item || item.type !== 'custom') {
    return;
  }

  const confirmed = window.confirm(`"${item.title || 'Bu zikir'}" kaydını silmek istediğinize emin misiniz?`);
  if (!confirmed) {
    return;
  }

  delete repository.items[zikirId];
  repository.order = repository.order.filter((id) => id !== zikirId);
  persistZikirRepository();
  refreshZikirState();
  refreshZikirUI();
}

function addCustomZikir({ title, content, repeatCount }) {
  const repository = state.zikirRepository;
  if (!repository) {
    throw new Error('Zikir listesi henüz hazır değil.');
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  if (!trimmedTitle) {
    throw new Error('Başlık gerekli.');
  }
  if (!trimmedContent) {
    throw new Error('İçerik gerekli.');
  }

  let counter = null;
  if (Number.isFinite(repeatCount) && repeatCount > 0) {
    counter = Math.min(10000, Math.max(1, Math.floor(repeatCount)));
  }

  const heading = `### **${trimmedTitle}**${counter ? ` (${counter} defa)` : ''}`;
  const segments = [heading, trimmedContent];

  if (counter && !/\(counter:\s*\d+\)/i.test(trimmedContent)) {
    segments.push(`(counter:${counter})`);
  }

  const markdown = segments.filter(Boolean).join('\n\n').trim();
  const id = generateCustomZikirId(repository);

  repository.items[id] = {
    id,
    title: trimmedTitle,
    markdown,
    visible: true,
    type: 'custom',
    createdAt: new Date().toISOString(),
  };
  repository.order.push(id);
  repository.nextCustomIndex = (repository.nextCustomIndex || 1) + 1;

  persistZikirRepository();
  refreshZikirState();
  refreshZikirUI();
}

function generateCustomZikirId(repository) {
  const counter = repository.nextCustomIndex || 1;
  const timestamp = Date.now().toString(36);
  return `custom-${timestamp}-${counter}`;
}

function loadCompletionData() {
  try {
    const raw = localStorage.getItem(COMPLETION_STORAGE_KEY);
    if (!raw) {
      return createEmptyCompletionData();
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const records = parsed.records && typeof parsed.records === 'object' ? parsed.records : parsed;
      return sanitiseCompletionData(records);
    }
  } catch (error) {
    console.warn('Tesbihat tamamlanma bilgileri okunamadı, sıfırlanacak.', error);
  }
  return createEmptyCompletionData();
}

function createEmptyCompletionData() {
  return {
    version: COMPLETION_STORAGE_VERSION,
    records: {},
  };
}

function sanitiseCompletionData(records) {
  const repository = createEmptyCompletionData();
  if (!records || typeof records !== 'object') {
    return repository;
  }

  Object.entries(records).forEach(([prayerId, value]) => {
    if (!value || typeof value !== 'object') {
      return;
    }
    const record = {};
    Object.keys(value).forEach((dateKey) => {
      if (isValidDateKey(dateKey)) {
        record[dateKey] = Number.isFinite(value[dateKey]) ? value[dateKey] : null;
      }
    });
    pruneCompletionRecord(record);
    repository.records[prayerId] = record;
  });

  return repository;
}

function ensureCompletionData() {
  if (!state.completionData) {
    state.completionData = loadCompletionData();
  }
  return state.completionData;
}

function persistCompletionData() {
  try {
    const repository = ensureCompletionData();
    localStorage.setItem(COMPLETION_STORAGE_KEY, JSON.stringify({
      version: COMPLETION_STORAGE_VERSION,
      records: repository.records,
    }));
  } catch (error) {
    console.warn('Tesbihat tamamlanma bilgileri kaydedilemedi.', error);
  }
}

function resetCompletionData() {
  state.completionData = createEmptyCompletionData();
  persistCompletionData();
  state.completionButtons.forEach((_entry, prayerId) => {
    updateCompletionButtonUI(prayerId);
  });
  updateCompletionStatsView();
}

function markPrayerCompleted(prayerId) {
  const repository = ensureCompletionData();
  const today = getTodayKey();
  if (!repository.records[prayerId]) {
    repository.records[prayerId] = {};
  }
  const record = repository.records[prayerId];
  if (record[today]) {
    return false;
  }
  record[today] = Date.now();
  pruneCompletionRecord(record);
  persistCompletionData();
  return true;
}

function isPrayerCompletedToday(prayerId) {
  const repository = ensureCompletionData();
  const record = repository.records[prayerId];
  if (!record) {
    return false;
  }
  return Boolean(record[getTodayKey()]);
}

function getPrayerCompletionDates(prayerId) {
  const repository = ensureCompletionData();
  const record = repository.records[prayerId] || {};
  return Object.keys(record).filter(isValidDateKey);
}

function getLastCompletionDate(prayerId) {
  const dates = getPrayerCompletionDates(prayerId);
  if (!dates.length) {
    return null;
  }
  dates.sort((a, b) => (a > b ? -1 : 1));
  return dates[0];
}

function getCompletionCountForRange(prayerId, dayRange) {
  const dates = getPrayerCompletionDates(prayerId);
  if (!dates.length) {
    return 0;
  }
  const today = new Date();
  let count = 0;
  dates.forEach((dateKey) => {
    if (!isValidDateKey(dateKey)) {
      return;
    }
    const date = parseDateKey(dateKey);
    if (!Number.isFinite(date.getTime())) {
      return;
    }
    const diff = calculateDayDifference(today, date);
    if (diff <= dayRange - 1) {
      count += 1;
    }
  });
  return count;
}

function pruneCompletionRecord(record, retentionDays = COMPLETION_RETENTION_DAYS) {
  if (!record || typeof record !== 'object') {
    return;
  }
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - retentionDays);
  Object.keys(record).forEach((dateKey) => {
    if (!isValidDateKey(dateKey)) {
      delete record[dateKey];
      return;
    }
    const entryDate = parseDateKey(dateKey);
    if (entryDate < cutoff) {
      delete record[dateKey];
    }
  });
}

function getTodayKey() {
  return formatDateKey(new Date());
}

function dateKeyToUtcMs(dateKey) {
  if (!isValidDateKey(dateKey)) {
    return Number.NaN;
  }
  const [year, month, day] = dateKey.split('-').map((part) => Number.parseInt(part, 10));
  return Date.UTC(year, month - 1, day);
}

function utcMsToDateKey(utcMs) {
  const date = new Date(utcMs);
  if (!Number.isFinite(date.getTime())) {
    return '';
  }
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeUcAylarRange(range) {
  if (!range || typeof range !== 'object') {
    return null;
  }
  const start = typeof range.start === 'string' ? range.start : '';
  const end = typeof range.end === 'string' ? range.end : '';
  if (!isValidDateKey(start) || !isValidDateKey(end)) {
    return null;
  }
  const startUtcMs = dateKeyToUtcMs(start);
  const endUtcMs = dateKeyToUtcMs(end);
  if (!Number.isFinite(startUtcMs) || !Number.isFinite(endUtcMs)) {
    return null;
  }
  if (startUtcMs <= endUtcMs) {
    return { start, end, startUtcMs, endUtcMs };
  }
  return { start: end, end: start, startUtcMs: endUtcMs, endUtcMs: startUtcMs };
}

function isDateKeyInRange(dateKey, range) {
  const normalized = normalizeUcAylarRange(range);
  if (!normalized) {
    return false;
  }
  const utcMs = dateKeyToUtcMs(dateKey);
  if (!Number.isFinite(utcMs)) {
    return false;
  }
  return utcMs >= normalized.startUtcMs && utcMs <= normalized.endUtcMs;
}

function clampDateKeyToRange(dateKey, range) {
  const normalized = normalizeUcAylarRange(range);
  if (!normalized) {
    return dateKey;
  }
  const utcMs = dateKeyToUtcMs(dateKey);
  if (!Number.isFinite(utcMs)) {
    return normalized.start;
  }
  if (utcMs < normalized.startUtcMs) {
    return normalized.start;
  }
  if (utcMs > normalized.endUtcMs) {
    return normalized.end;
  }
  return dateKey;
}

function getUcAylarRangeForDate(monthKey, dateKey) {
  if (!monthKey || !isValidDateKey(dateKey)) {
    return null;
  }
  const utcMs = dateKeyToUtcMs(dateKey);
  if (!Number.isFinite(utcMs)) {
    return null;
  }

  const seasons = UCAYLAR_DATE_RANGES && typeof UCAYLAR_DATE_RANGES === 'object' ? UCAYLAR_DATE_RANGES : {};
  const seasonEntries = Object.entries(seasons);
  for (const [seasonYearRaw, season] of seasonEntries) {
    if (!season || typeof season !== 'object') {
      continue;
    }
    const range = normalizeUcAylarRange(season[monthKey]);
    if (!range) {
      continue;
    }
    if (utcMs >= range.startUtcMs && utcMs <= range.endUtcMs) {
      return { ...range, seasonYear: Number.parseInt(seasonYearRaw, 10) || null };
    }
  }
  return null;
}

function listUcAylarRangesForMonth(monthKey) {
  const seasons = UCAYLAR_DATE_RANGES && typeof UCAYLAR_DATE_RANGES === 'object' ? UCAYLAR_DATE_RANGES : {};
  return Object.entries(seasons)
    .map(([seasonYearRaw, season]) => {
      if (!season || typeof season !== 'object') {
        return null;
      }
      const range = normalizeUcAylarRange(season[monthKey]);
      if (!range) {
        return null;
      }
      return { ...range, seasonYear: Number.parseInt(seasonYearRaw, 10) || null };
    })
    .filter(Boolean);
}

function getUcAylarRangeForStartYear(monthKey, year) {
  if (!monthKey || !Number.isFinite(Number(year))) {
    return null;
  }
  const targetYear = Number(year);
  const ranges = listUcAylarRangesForMonth(monthKey);
  const matching = ranges.filter((range) => Number.parseInt(range.start.slice(0, 4), 10) === targetYear);
  if (!matching.length) {
    return null;
  }
  if (matching.length === 1) {
    return matching[0];
  }
  return matching.sort((a, b) => a.startUtcMs - b.startUtcMs)[0];
}

function selectClosestUcAylarRange(monthKey, referenceDateKey) {
  const ranges = listUcAylarRangesForMonth(monthKey);
  if (!ranges.length) {
    return null;
  }

  const referenceUtcMs = dateKeyToUtcMs(isValidDateKey(referenceDateKey) ? referenceDateKey : getTodayKey());
  if (!Number.isFinite(referenceUtcMs)) {
    return ranges[0];
  }

  const upcoming = ranges
    .filter((range) => range.startUtcMs >= referenceUtcMs)
    .sort((a, b) => a.startUtcMs - b.startUtcMs);
  if (upcoming.length) {
    return upcoming[0];
  }

  const past = ranges.slice().sort((a, b) => b.endUtcMs - a.endUtcMs);
  return past[0] || null;
}

function iterateDateKeysInRange(range) {
  const normalized = normalizeUcAylarRange(range);
  if (!normalized) {
    return [];
  }
  const keys = [];
  const dayMs = 24 * 60 * 60 * 1000;
  for (let utcMs = normalized.startUtcMs; utcMs <= normalized.endUtcMs; utcMs += dayMs) {
    keys.push(utcMsToDateKey(utcMs));
  }
  return keys;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(key) {
  if (!isValidDateKey(key)) {
    return new Date(NaN);
  }
  const [year, month, day] = key.split('-').map((part) => Number.parseInt(part, 10));
  return new Date(year, month - 1, day);
}

function calculateDayDifference(dateA, dateB) {
  const start = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
  const end = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
  const diff = start.getTime() - end.getTime();
  return Math.round(diff / (24 * 60 * 60 * 1000));
}

function isValidDateKey(key) {
  return typeof key === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(key);
}

function formatDateForDisplay(dateKey) {
  if (!isValidDateKey(dateKey)) {
    return '';
  }
  const date = parseDateKey(dateKey);
  if (!Number.isFinite(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

async function createHomeHighlightCard() {
  try {
    const messages = await ensureImportanceMessages();
    if (!messages.length) {
      return null;
    }
    const message = pickRandomImportanceMessage(messages);
    if (!message) {
      return null;
    }
    return buildHomeHighlightCard(message);
  } catch (error) {
    console.warn('Tesbihat önemi mesajları hazırlanırken hata oluştu.', error);
    return null;
  }
}

async function createHomeFeaturesCard() {
  try {
    const html = await ensureHomeFeaturesHtml();
    if (!html) {
      return null;
    }

    const card = document.createElement('article');
    card.className = 'card home-features';
    card.dataset.disableTooltips = 'true';
    card.innerHTML = html;
    return card;
  } catch (error) {
    console.warn('Uygulama özellikleri hazırlanırken hata oluştu.', error);
    return null;
  }
}

function buildHomeFallbackCard() {
  const card = document.createElement('article');
  card.className = 'card home-fallback';
  card.innerHTML = `
    <h2>Hoş geldiniz</h2>
    <p>Günün tesbihatlarına yukarıdaki sekmelerden ulaşabilirsiniz.</p>
  `;
  return card;
}

function buildHomeQuickLinks() {
  const card = document.createElement('article');
  card.className = 'card home-quick-links';
  card.dataset.disableTooltips = 'true';

  const header = document.createElement('div');
  header.className = 'home-quick-links__header';

  const title = document.createElement('h2');
  title.className = 'home-quick-links__title';
  title.textContent = 'Hızlı gezin';

  header.append(title);
  card.append(header);

  const list = document.createElement('div');
  list.className = 'home-quick-links__grid';

  HOME_QUICK_LINKS.forEach((link) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'home-quick-link';
    button.dataset.quickLink = link.id;
    button.addEventListener('click', () => handleHomeQuickLinkClick(link.id));

    const icon = document.createElement('span');
    icon.className = 'home-quick-link__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = link.icon;

    const text = document.createElement('span');
    text.className = 'home-quick-link__text';
    text.innerHTML = `<strong>${link.label}</strong><span>${link.description}</span>`;

    button.append(icon, text);
    list.append(button);
  });

  card.append(list);
  return card;
}

function handleHomeQuickLinkClick(prayerId) {
  if (!prayerId) {
    return;
  }
  setActivePrayer(prayerId);
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function buildHomeStatsCard() {
  const card = document.createElement('article');
  card.className = 'card home-stats';
  card.dataset.disableTooltips = 'true';

  const header = document.createElement('header');
  header.className = 'home-stats__header';

  const heading = document.createElement('div');
  heading.className = 'home-stats__heading';

  const title = document.createElement('h2');
  title.className = 'home-stats__title';
  title.textContent = 'Tesbihat istatistikleri';

  const description = document.createElement('p');
  description.className = 'home-stats__description';
  description.textContent = 'Günlük tamamlanma durumunuzu buradan takip edebilirsiniz.';

  heading.append(title, description);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'home-stats__toggle';
  toggle.innerHTML = `
    <span class="home-stats__toggle-icon" aria-hidden="true">⌄</span>
    <span class="home-stats__toggle-label">Gizle</span>
  `;

  header.append(heading, toggle);
  card.append(header);

  const content = document.createElement('div');
  const contentId = `home-stats-${Date.now().toString(36)}`;
  content.className = 'home-stats__content';
  content.dataset.homeStatsContent = 'true';
  content.id = contentId;
  toggle.setAttribute('aria-controls', contentId);
  card.append(content);

  state.homeStats.card = card;
  state.homeStats.container = content;
  state.homeStats.toggle = toggle;

  toggle.addEventListener('click', () => {
    toggleHomeStatsCollapse();
  });

  updateHomeStatsCollapseUI();
  return card;
}

function updateHomeStatsCollapseUI() {
  const statsState = state.homeStats;
  if (!statsState || !statsState.card || !statsState.toggle) {
    return;
  }
  const { card, toggle, container, collapsed } = statsState;
  card.classList.toggle('is-collapsed', Boolean(collapsed));
  if (container) {
    container.hidden = Boolean(collapsed);
  }
  const label = toggle.querySelector('.home-stats__toggle-label');
  if (label) {
    label.textContent = collapsed ? 'Göster' : 'Gizle';
  }
  toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
}

function toggleHomeStatsCollapse() {
  if (!state.homeStats) {
    return;
  }
  const next = !state.homeStats.collapsed;
  state.homeStats.collapsed = next;
  saveHomeStatsCollapsed(next);
  updateHomeStatsCollapseUI();
  if (!next) {
    updateHomeStatsView();
  }
}

function updateHomeStatsView() {
  const statsState = state.homeStats;
  if (!statsState || !statsState.container) {
    return;
  }
  renderCompletionStats(statsState.container);
}

function buildInstallBanner() {
  if (isStandaloneMode()) {
    return null;
  }

  const isIos = isIosSafari();
  const hasDeferredPrompt = Boolean(state.installPromptEvent);
  const shouldShowIosHint = isIos && !shouldSuppressInstallPrompt();

  if (!state.installPromptVisible && !shouldShowIosHint) {
    return null;
  }

  const card = document.createElement('article');
  card.className = 'card install-banner';

  const title = document.createElement('h2');
  title.className = 'install-banner__title';
  title.textContent = 'Ana ekrana ekle';

  const description = document.createElement('p');
  description.className = 'install-banner__description';

  if (isIos) {
    description.innerHTML = `Paylaş simgesine dokunup <strong>Ana Ekrana Ekle</strong> seçeneğini kullanın.`;
  } else {
    description.textContent = 'Uygulamayı ana ekranınıza ekleyerek daha hızlı erişin.';
  }

  const actions = document.createElement('div');
  actions.className = 'install-banner__actions';

  if (!isIos && hasDeferredPrompt) {
    const installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.className = 'button-pill';
    installButton.textContent = 'Şimdi ekle';
    installButton.addEventListener('click', async () => {
      try {
        const promptEvent = state.installPromptEvent;
        if (!promptEvent) {
          return;
        }
        promptEvent.prompt();
        const result = await promptEvent.userChoice;
        if (result.outcome === 'accepted') {
          dismissInstallPrompt({ installed: true });
        } else {
          dismissInstallPrompt();
        }
      } catch (error) {
        console.error('Ana ekrana ekleme başarısız oldu.', error);
        dismissInstallPrompt();
      }
    });
    actions.append(installButton);
  } else if (isIos) {
    const hint = document.createElement('div');
    hint.className = 'install-banner__hint';
    hint.innerHTML = 'Paylaş → <strong>Ana Ekrana Ekle</strong>';
    actions.append(hint);
  }

  const dismissButton = document.createElement('button');
  dismissButton.type = 'button';
  dismissButton.className = 'button-pill secondary';
  dismissButton.textContent = 'Daha sonra';
  dismissButton.addEventListener('click', () => dismissInstallPrompt());

  actions.append(dismissButton);

  card.append(title, description, actions);
  return card;
}

function updateHomeInstallBanner() {
  const homeContainer = document.querySelector('.home-screen');
  if (!homeContainer) {
    return;
  }
  const existingBanner = homeContainer.querySelector('.install-banner');
  if (existingBanner) {
    existingBanner.remove();
  }
  const banner = buildInstallBanner();
  if (banner) {
    const fallbackNode = homeContainer.querySelector('.home-fallback');
    if (fallbackNode) {
      fallbackNode.before(banner);
    } else {
      homeContainer.append(banner);
    }
  }
}

function renderTesbihat(container, markdownText) {
  hideNameTooltip();
  const prepared = markdownText
    .replace(/\r\n/g, '\n')
    .replace(/\u06EA/g, '\u0656');
  const withTranslatedMarkers = normaliseTranslationMarkers(prepared);
  const withAutoCounters = injectAutoCounters(withTranslatedMarkers);
  const normalised = withAutoCounters
    .replace(/\*\*\(counter:(\d+)\)\*\*/g, '(counter:$1)')
    .replace(/\(counter:(\d+)\)/g, (_match, count) => `<span class="counter-placeholder" data-counter-target="${count}"></span>`);

  const html = DOMPurify.sanitize(marked.parse(normalised, { mangle: false, headerIds: false }));
  const temp = document.createElement('div');
  temp.innerHTML = html;

  processTranslationBlocks(temp);

  const hasTranslations = Boolean(temp.querySelector('[data-translation-block]'));
  container.innerHTML = '';

  const toolbar = createContentToolbar({ hasTranslations });
  if (toolbar) {
    container.append(toolbar);
  }

  while (temp.firstChild) {
    container.append(temp.firstChild);
  }

  enhanceArabicText(container);
  applyTranslationVisibility(container);
}

function normaliseTranslationMarkers(markdown) {
  if (typeof markdown !== 'string') {
    return '';
  }

  let result = markdown.replace(/\s*\|tercume\|\s*/g, '\n\n|tercume|\n\n');
  result = result.replace(/\s*\|\/tercume\|\s*/g, '\n\n|/tercume|\n\n');
  result = result.replace(/\n{3,}/g, '\n\n');
  return result;
}

function injectAutoCounters(markdown) {
  const lines = markdown.split('\n');
  const result = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    result.push(line);

    if (!line || line.includes('(counter:')) {
      continue;
    }

    const match = line.match(/\(\s*(\d+)\s*(?:defa)?\)\D*$/i);
    if (!match) {
      continue;
    }

    const value = Number.parseInt(match[1], 10);
    if (!Number.isFinite(value) || value < 7) {
      continue;
    }

    const nextLine = lines[index + 1];
    if (nextLine && /^\s*\(counter:\s*\d+\)/i.test(nextLine)) {
      continue;
    }

    let lookaheadIndex = index + 1;
    let hasExistingCounter = false;
    while (lookaheadIndex < lines.length) {
      const lookaheadLine = lines[lookaheadIndex];
      if (!lookaheadLine.trim()) {
        lookaheadIndex += 1;
        continue;
      }
      if (/^#{2,}\s/.test(lookaheadLine) || /^-{3,}\s*$/.test(lookaheadLine)) {
        break;
      }
      if (lookaheadLine.includes('(counter:')) {
        hasExistingCounter = true;
        break;
      }
      lookaheadIndex += 1;
    }

    if (hasExistingCounter) {
      continue;
    }

    result.push(`(counter:${value})`);
  }

  return result.join('\n');
}

function processTranslationBlocks(root) {
  if (!root) {
    return;
  }

  let startMarker = findTranslationStartMarker(root);
  while (startMarker) {
    convertTranslationBlock(startMarker);
    startMarker = findTranslationStartMarker(root);
  }
}

function createContentToolbar({ hasTranslations } = {}) {
  const toolbar = document.createElement('div');
  toolbar.className = 'content-toolbar';
  toolbar.dataset.contentToolbar = 'true';

  const card = document.createElement('div');
  card.className = 'content-toolbar__card';

  const segmented = document.createElement('div');
  segmented.className = 'content-toolbar__segmented';
  segmented.setAttribute('role', 'group');
  segmented.setAttribute('aria-label', 'Metin dili');

  const trButton = createContentToolbarLanguageButton('tr', 'Türkçe');
  const arButton = createContentToolbarLanguageButton('ar', 'Arapça');

  segmented.append(trButton, arButton);
  card.append(segmented);

  state.contentToolbar = {
    root: toolbar,
    languageButtons: new Map([
      ['tr', trButton],
      ['ar', arButton],
    ]),
  };

  trButton.addEventListener('click', () => changeLanguage('tr'));
  arButton.addEventListener('click', () => changeLanguage('ar'));

  updateContentToolbarLanguageUI();

  if (hasTranslations) {
    createTranslationAction(card);
  } else {
    state.translationToggle = null;
  }

  toolbar.append(card);
  return toolbar;
}

function createContentToolbarLanguageButton(language, labelText) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'content-toolbar__chip';
  button.dataset.toolbarLanguage = language;
  button.textContent = labelText;
  button.setAttribute('aria-pressed', 'false');
  return button;
}

function createTranslationAction(parent) {
  if (!parent) {
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'content-toolbar__toggle';
  button.dataset.translationToggle = 'true';
  button.addEventListener('click', handleTranslationToggleClick);

  const icon = document.createElement('span');
  icon.className = 'content-toolbar__toggle-icon';
  icon.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.className = 'content-toolbar__toggle-label';

  button.append(icon, label);
  parent.append(button);

  state.translationToggle = { button, icon, label };
  updateTranslationToggleUI();
}

function updateContentToolbarLanguageUI() {
  const toolbar = state.contentToolbar;
  if (!toolbar || !(toolbar.languageButtons instanceof Map)) {
    return;
  }

  toolbar.languageButtons.forEach((button, language) => {
    if (!button) {
      return;
    }
    const isActive = language === state.language;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function findTranslationStartMarker(root) {
  const candidates = root.querySelectorAll('p, div, blockquote, li');
  for (let index = 0; index < candidates.length; index += 1) {
    const node = candidates[index];
    if (isTranslationMarker(node, '|tercume|')) {
      return node;
    }
  }
  return null;
}

function isTranslationMarker(node, markerText) {
  if (!node) {
    return false;
  }
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue && node.nodeValue.trim() === markerText;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const text = node.textContent || '';
    return text.trim() === markerText;
  }
  return false;
}

function convertTranslationBlock(startMarker) {
  if (!startMarker || !startMarker.parentNode) {
    return;
  }

  const nodesToWrap = [];
  let hasContent = false;
  let endMarker = null;
  let current = startMarker.nextSibling;

  while (current) {
    if (isTranslationMarker(current, '|tercume|')) {
      break;
    }
    if (isTranslationMarker(current, '|/tercume|')) {
      endMarker = current;
      break;
    }
    if (current.nodeType === Node.TEXT_NODE) {
      nodesToWrap.push(current);
      if (current.nodeValue && current.nodeValue.trim()) {
        hasContent = true;
      }
    } else {
      nodesToWrap.push(current);
      hasContent = true;
    }
    current = current.nextSibling;
  }

  if (!endMarker) {
    startMarker.remove();
    return;
  }

  if (!hasContent) {
    startMarker.remove();
    endMarker.remove();
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'translation-block';
  wrapper.dataset.translationBlock = 'true';
  wrapper.dataset.translationLabel = 'Tercüme';
  wrapper.setAttribute('role', 'group');
  wrapper.setAttribute('aria-label', 'Tercüme');

  nodesToWrap.forEach((node) => {
    wrapper.append(node);
  });

  startMarker.replaceWith(wrapper);
  endMarker.remove();
}

function applyTranslationVisibility(root = document.getElementById('content')) {
  if (state.appRoot) {
    state.appRoot.dataset.showTranslations = state.showTranslations ? 'true' : 'false';
  }

  const toggle = state.translationToggle;
  if (toggle && (!toggle.button || !toggle.button.isConnected)) {
    state.translationToggle = null;
  }

  if (!root) {
    updateTranslationToggleUI();
    return;
  }

  const blocks = root.querySelectorAll('[data-translation-block]');
  blocks.forEach((block) => {
    block.hidden = !state.showTranslations;
    block.setAttribute('aria-hidden', state.showTranslations ? 'false' : 'true');
    block.classList.toggle('translation-block--visible', state.showTranslations);
    block.classList.toggle('translation-block--hidden', !state.showTranslations);
  });

  updateTranslationToggleUI();
}

function updateTranslationToggleUI() {
  const toggle = state.translationToggle;
  if (!toggle || !toggle.button || !toggle.label) {
    return;
  }
  const show = !!state.showTranslations;
  toggle.label.textContent = show ? 'Tercümeyi Gizle' : 'Tercümeyi Göster';
  toggle.button.setAttribute('aria-pressed', show ? 'true' : 'false');
  toggle.button.setAttribute('aria-label', show ? 'Tercümeyi Gizle' : 'Tercümeyi Göster');
  toggle.button.classList.toggle('is-active', show);
  if (toggle.icon) {
    toggle.icon.textContent = show ? '📖' : '📜';
  }
}

function handleTranslationToggleClick(event) {
  if (event) {
    event.preventDefault();
  }
  state.showTranslations = !state.showTranslations;
  saveTranslationVisibility(state.showTranslations);
  applyTranslationVisibility(document.getElementById('content'));
}

function enhanceArabicText(root) {
  if (!root) {
    return;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current;

  while ((current = walker.nextNode())) {
    const value = current.nodeValue;
    if (!value || !ARABIC_SCRIPT_REGEX.test(value)) {
      continue;
    }

    const blockAncestor = findArabicBlockAncestor(current.parentElement);
    if (!blockAncestor || blockAncestor.classList.contains('arabic-text')) {
      continue;
    }

    if (blockAncestor.closest('.counter-card')) {
      continue;
    }

    blockAncestor.classList.add('arabic-text');
    if (!blockAncestor.hasAttribute('dir')) {
      blockAncestor.setAttribute('dir', 'rtl');
    }
  }
}

function findArabicBlockAncestor(element) {
  while (element) {
    if (element.matches && element.matches('p, blockquote, li, div, h1, h2, h3, h4, h5, h6')) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

async function ensureImportanceMessages() {
  if (Array.isArray(state.importanceMessages)) {
    return state.importanceMessages;
  }

  try {
    const raw = await fetchText(IMPORTANCE_SOURCE_PATH);
    const normalised = raw.replace(/\r\n/g, '\n');
    const parts = normalised
      .split(/\s*-split-\s*/g)
      .map((part) => part.trim())
      .filter(Boolean);

    state.importanceMessages = parts;
  } catch (error) {
    console.warn('Tesbihat önemi metinleri yüklenemedi.', error);
    state.importanceMessages = [];
  }

  return state.importanceMessages;
}

async function ensureHomeFeaturesHtml() {
  if (typeof state.homeFeaturesHtml === 'string') {
    return state.homeFeaturesHtml;
  }

  try {
    const raw = await fetchText(FEATURES_SOURCE_PATH);
    const normalised = raw.replace(/\r\n/g, '\n');
    const html = DOMPurify.sanitize(marked.parse(normalised, { mangle: false, headerIds: false }));
    state.homeFeaturesHtml = html;
    return html;
  } catch (error) {
    console.warn('Uygulama özellikleri yüklenemedi.', error);
    state.homeFeaturesHtml = '';
    return '';
  }
}

function pickRandomImportanceMessage(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * messages.length);
  const text = messages[index];
  state.activeImportanceMessage = { index, text };
  return text;
}

function buildHomeHighlightCard(message) {
  if (!message) {
    return null;
  }

  const card = document.createElement('article');
  card.className = 'card home-highlight';
  card.dataset.disableTooltips = 'true';

  const label = document.createElement('span');
  label.className = 'home-highlight__eyebrow';
  label.textContent = 'Tesbihâtın Önemi';
  card.append(label);

  const segments = message
    .split(/\r?\n/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const quote = document.createElement('blockquote');
  quote.className = 'home-highlight__quote';
  quote.textContent = segments[0] || message.trim();
  card.append(quote);

  if (segments.length > 1) {
    segments.slice(1).forEach((segment) => {
      const paragraph = document.createElement('p');
      paragraph.className = 'home-highlight__note';
      paragraph.textContent = segment;
      card.append(paragraph);
    });
  }

  return card;
}

function setupCounters(container, prayerId) {
  const counterNodes = Array.from(container.querySelectorAll('.counter-placeholder'));

  counterNodes.forEach((node, index) => {
    const target = Number.parseInt(node.dataset.counterTarget, 10) || 0;
    const customKey = typeof node.dataset.counterKey === 'string' && node.dataset.counterKey.trim();
    const counterKey = customKey || `${prayerId}-${index + 1}`;
    const savedValue = Number.isFinite(state.counters[counterKey]) ? state.counters[counterKey] : 0;
    state.counters[counterKey] = savedValue;

    const wrapper = document.createElement('article');
    wrapper.className = 'card counter-card';
    wrapper.dataset.counterId = counterKey;
    wrapper.dataset.counterTarget = Number.isFinite(target) ? String(target) : '';

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

    const applyValue = (nextValue) => {
      currentValue = nextValue;
      state.counters[counterKey] = currentValue;
      saveCounters();
      updateCounterUI(wrapper, currentValue, target);
    };

    const increment = () => {
      if (target > 0 && currentValue >= target) {
        return;
      }
      const nextValue = currentValue + 1;
      applyValue(nextValue);
      const hapticType = target > 0 && nextValue >= target ? 'complete' : 'increment';
      triggerCounterHaptic(hapticType);
    };

    const reset = () => {
      if (currentValue === 0) {
        triggerCounterHaptic('soft');
        return;
      }
      applyValue(0);
      triggerCounterHaptic('reset');
    };

    const bindTapInteraction = (element, action) => {
      let handledByTouch = false;
      let touchStartX = null;
      let touchStartY = null;

      const clearTouchState = () => {
        touchStartX = null;
        touchStartY = null;
      };

      element.addEventListener('click', () => {
        if (handledByTouch) {
          handledByTouch = false;
          return;
        }
        action();
      });

      element.addEventListener('touchstart', (event) => {
        if (event.touches.length === 1) {
          touchStartX = event.touches[0].clientX;
          touchStartY = event.touches[0].clientY;
          handledByTouch = false;
        }
      }, { passive: true });

      element.addEventListener('touchmove', (event) => {
        if (touchStartX === null || touchStartY === null) {
          return;
        }
        const touch = event.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);
        if (deltaX < 10 && deltaY < 10) {
          event.preventDefault();
        } else {
          clearTouchState();
        }
      }, { passive: false });

      element.addEventListener('touchend', (event) => {
        if (touchStartX === null || touchStartY === null) {
          return;
        }
        const touch = event.changedTouches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);
        if (deltaX < 10 && deltaY < 10) {
          event.preventDefault();
          handledByTouch = true;
          action();
        }
        clearTouchState();
      }, { passive: false });

      element.addEventListener('touchcancel', () => {
        clearTouchState();
      });
    };

    bindTapInteraction(displayButton, increment);
    bindTapInteraction(resetButton, reset);
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

function resetPrayerCounters(prayerId, options = {}) {
  if (!prayerId) {
    return;
  }

  const prefix = `${prayerId}-`;
  let changed = false;

  Object.keys(state.counters).forEach((key) => {
    if (!key.startsWith(prefix)) {
      return;
    }
    if (state.counters[key] !== 0) {
      state.counters[key] = 0;
      changed = true;
    }
  });

  if (changed) {
    saveCounters();
  }

  const root = options.container || document.getElementById('content');
  if (!root) {
    return;
  }

  const nodes = root.querySelectorAll(`[data-counter-id^="${prefix}"]`);
  nodes.forEach((wrapper) => {
    const targetValue = Number.parseInt(wrapper.dataset.counterTarget || '0', 10);
    updateCounterUI(wrapper, 0, Number.isFinite(targetValue) ? targetValue : 0);
  });
}

function setupDuaSection(container, duas, sourceId) {
  if (!duas.length) {
    if (state.duaUI?.card && state.duaUI.card.isConnected) {
      state.duaUI.card.remove();
    }
    state.duaUI = null;
    return;
  }

  const anchor = findAnchorParagraph(container, 'Akabinde namaz duâsı yapılır.');
  if (!anchor) {
    if (state.duaUI?.card && state.duaUI.card.isConnected) {
      state.duaUI.card.remove();
    }
    state.duaUI = null;
    return;
  }

  const existingCard = state.duaUI?.card && state.duaUI.card.isConnected ? state.duaUI.card : null;
  let card = existingCard;
  let modeToggle;
  let modeButtons;
  let title;
  let subtitle;
  let body;
  let newButton;
  let okButton;
  let resetButton;
  let actions;
  let favoriteButton;

  if (!card) {
    card = document.createElement('article');
    card.className = 'card dua-card';
    card.dataset.showArabic = state.showArabicDuas ? 'true' : 'false';

    modeToggle = document.createElement('div');
    modeToggle.className = 'dua-mode-toggle';

    const predefinedButton = document.createElement('button');
    predefinedButton.type = 'button';
    predefinedButton.className = 'dua-mode-toggle__option';
    predefinedButton.dataset.mode = 'predefined';
    predefinedButton.textContent = 'Hazır dualar';

    const personalButton = document.createElement('button');
    personalButton.type = 'button';
    personalButton.className = 'dua-mode-toggle__option';
    personalButton.dataset.mode = 'personal';
    personalButton.textContent = 'Kişisel dua';

    const savedButton = document.createElement('button');
    savedButton.type = 'button';
    savedButton.className = 'dua-mode-toggle__option';
    savedButton.dataset.mode = 'saved';
    savedButton.textContent = 'Kaydedilenler';

    modeToggle.append(predefinedButton, personalButton, savedButton);

    const header = document.createElement('div');
    header.className = 'dua-header';

    const headerMain = document.createElement('div');
    headerMain.className = 'dua-header__main';

    title = document.createElement('h2');
    title.className = 'dua-title';

    subtitle = document.createElement('div');
    subtitle.className = 'dua-subtitle';

    headerMain.append(title, subtitle);

    const headerActions = document.createElement('div');
    headerActions.className = 'dua-header__actions';

    favoriteButton = document.createElement('button');
    favoriteButton.type = 'button';
    favoriteButton.className = 'dua-favorite-toggle';
    favoriteButton.setAttribute('aria-label', 'Kaydedilenlere ekle');
    favoriteButton.innerHTML = '<span class="dua-favorite-toggle__icon" aria-hidden="true">☆</span>';

    headerActions.append(favoriteButton);
    header.append(headerMain, headerActions);

    body = document.createElement('div');
    body.className = 'dua-body';
    body.setAttribute('aria-live', 'polite');

    actions = document.createElement('div');
    actions.className = 'dua-actions';

    newButton = document.createElement('button');
    newButton.className = 'button-pill secondary';
    newButton.type = 'button';
    newButton.textContent = 'Yeni dua getir';

    okButton = document.createElement('button');
    okButton.className = 'button-pill';
    okButton.type = 'button';
    okButton.textContent = 'Okudum';

    resetButton = document.createElement('button');
    resetButton.className = 'button-pill secondary';
    resetButton.type = 'button';
    resetButton.textContent = 'Baştan başlat';
    resetButton.hidden = true;

    actions.append(newButton, okButton, resetButton);
    card.append(modeToggle, header, body, actions);

    newButton.addEventListener('click', handleDuaNewClick);
    okButton.addEventListener('click', handleDuaOkClick);
    resetButton.addEventListener('click', handleDuaResetClick);

    predefinedButton.addEventListener('click', () => {
      if (state.duaMode !== 'predefined') {
        state.duaMode = 'predefined';
        state.personalDuaEditing = false;
        refreshDuaUI();
      }
    });

    personalButton.addEventListener('click', () => {
      if (!state.personalDuaEnabled) {
        window.alert('Kişisel dua özelliğini ayarlardan etkinleştirebilirsiniz.');
        return;
      }
      if (state.duaMode !== 'personal') {
        state.duaMode = 'personal';
        state.personalDuaEditing = false;
        refreshDuaUI();
      }
    });

    savedButton.addEventListener('click', () => {
      if (state.duaMode !== 'saved') {
        state.duaMode = 'saved';
        state.personalDuaEditing = false;
        if (state.duaFavoritesList.length === 0) {
          state.duaFavoritesIndex = 0;
        }
        refreshDuaUI();
      }
    });

    favoriteButton.addEventListener('click', handleDuaFavoriteToggle);

    modeButtons = {
      predefined: predefinedButton,
      personal: personalButton,
      saved: savedButton,
    };
  } else {
    card.dataset.showArabic = state.showArabicDuas ? 'true' : 'false';
    modeToggle = state.duaUI.modeToggle;
    modeButtons = state.duaUI.modeButtons;
    title = state.duaUI.title;
    subtitle = state.duaUI.subtitle;
    body = state.duaUI.body;
    newButton = state.duaUI.newButton;
    okButton = state.duaUI.okButton;
    resetButton = state.duaUI.resetButton;
    actions = state.duaUI.actions;
    favoriteButton = state.duaUI.favoriteButton;
    favoriteButton?.removeEventListener('click', handleDuaFavoriteToggle);
    favoriteButton?.addEventListener('click', handleDuaFavoriteToggle);
  }

  card.dataset.duaSource = sourceId;
  anchor.after(card);

  state.duaUI = {
    card,
    modeToggle,
    modeButtons,
    title,
    subtitle,
    body,
    newButton,
    okButton,
    resetButton,
    actions,
    favoriteButton,
    anchor,
    container,
  };

  refreshDuaUI();
}

function renderPrayerCompletionCard(container, prayerId) {
  if (!container || !TRACKED_PRAYER_SET.has(prayerId)) {
    return;
  }

  const existing = container.querySelector('[data-completion-card]');
  if (existing) {
    existing.remove();
  }

  const card = document.createElement('article');
  card.className = 'card completion-card';
  card.dataset.completionCard = 'true';

  const body = document.createElement('div');
  body.className = 'completion-card__body';

  const textBlock = document.createElement('div');
  textBlock.className = 'completion-card__text';

  const title = document.createElement('h2');
  title.className = 'completion-card__title';
  title.textContent = 'Tesbihatı tamamladım';

  const description = document.createElement('p');
  description.className = 'completion-card__description';
  description.textContent = 'Bugünkü okumanızı tamamladığınızda kaydedin; günlük takibiniz güncel kalsın.';

  textBlock.append(title, description);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button-pill completion-card__button';
  button.dataset.completionButton = prayerId;
  button.addEventListener('click', () => handleCompletionButtonClick(prayerId));

  body.append(textBlock, button);

  const status = document.createElement('p');
  status.className = 'completion-card__status';

  card.append(body, status);
  container.append(card);

  state.completionButtons.set(prayerId, { button, status, card });
  updateCompletionButtonUI(prayerId);
}

function updateCompletionButtonUI(prayerId) {
  const entry = state.completionButtons.get(prayerId);
  if (!entry) {
    return;
  }

  const completedToday = isPrayerCompletedToday(prayerId);
  const lastDate = getLastCompletionDate(prayerId);

  if (entry.button) {
    entry.button.disabled = completedToday;
    entry.button.textContent = completedToday ? 'Bugün tamamlandı' : 'Tesbihatı tamamladım';
    entry.button.setAttribute('aria-pressed', completedToday ? 'true' : 'false');
  }

  if (entry.status) {
    entry.status.textContent = formatCompletionStatus(completedToday, lastDate);
  }
}

function handleCompletionButtonClick(prayerId) {
  const completed = markPrayerCompleted(prayerId);
  if (!completed) {
    updateCompletionButtonUI(prayerId);
    return;
  }
  resetPrayerCounters(prayerId);
  updateCompletionButtonUI(prayerId);
  updateCompletionStatsView();
}

function formatCompletionStatus(completedToday, lastDate) {
  if (completedToday) {
    return 'Bugünkü tamamlanma kaydedildi.';
  }
  if (lastDate) {
    const formatted = formatDateForDisplay(lastDate);
    return `Son tamamlanma: ${formatted}`;
  }
  return 'Henüz kayıtlı tamamlanma bulunmuyor.';
}

function buildCompletionSummary() {
  const items = TRACKED_PRAYERS.map((prayerId) => {
    const label = PRAYER_CONFIG[prayerId]?.label || prayerId;
    const today = isPrayerCompletedToday(prayerId) ? 1 : 0;
    const last7 = getCompletionCountForRange(prayerId, 7);
    const last30 = getCompletionCountForRange(prayerId, 30);
    return { prayerId, label, today, last7, last30 };
  });

  const totals = items.reduce((accumulator, item) => {
    accumulator.today += item.today;
    accumulator.last7 += item.last7;
    accumulator.last30 += item.last30;
    return accumulator;
  }, { today: 0, last7: 0, last30: 0 });

  return { items, totals };
}

function renderCompletionStats(container) {
  if (!container) {
    return;
  }

  const { items, totals } = buildCompletionSummary();
  container.innerHTML = '';

  const hasData = items.some((item) => item.today > 0 || item.last7 > 0 || item.last30 > 0);
  if (!hasData) {
    const empty = document.createElement('p');
    empty.className = 'stats-empty';
    empty.textContent = 'Henüz tamamlanma kaydı bulunmuyor. Bugünkü tesbihatları işaretlediğinizde burada görünecek.';
    container.append(empty);
  }

  const table = document.createElement('table');
  table.className = 'stats-table';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Vakit</th><th>Bugün</th><th>Son 7 gün</th><th>Son 30 gün</th></tr>';
  table.append(thead);

  const tbody = document.createElement('tbody');
  items.forEach((item) => {
    const row = document.createElement('tr');
    const todayCell = document.createElement('td');
    todayCell.className = 'stats-status';
    todayCell.innerHTML = renderCompletionStatusIcon(Boolean(item.today));

    row.innerHTML = `
      <th scope="row">${item.label}</th>
      <td class="stats-status-placeholder"></td>
      <td>${formatNumber(item.last7)}</td>
      <td>${formatNumber(item.last30)}</td>
    `;
    row.querySelector('.stats-status-placeholder').replaceWith(todayCell);
    tbody.append(row);
  });
  table.append(tbody);

  const tfoot = document.createElement('tfoot');
  const totalRow = document.createElement('tr');
  const totalsComplete = totals.today >= TRACKED_PRAYERS.length;
  const totalTodayCell = document.createElement('td');
  totalTodayCell.className = 'stats-status';
  const totalLabel = `${formatNumber(totals.today)}/${TRACKED_PRAYERS.length}`;
  totalTodayCell.innerHTML = `<span class="stats-status__text">${totalLabel}</span>`;

  totalRow.innerHTML = `
    <th scope="row">Toplam</th>
    <td class="stats-status-placeholder"></td>
    <td>${formatNumber(totals.last7)}</td>
    <td>${formatNumber(totals.last30)}</td>
  `;
  totalRow.querySelector('.stats-status-placeholder').replaceWith(totalTodayCell);
  tfoot.append(totalRow);
  table.append(tfoot);

  container.append(table);

  const hint = document.createElement('p');
  hint.className = 'stats-hint';
  hint.textContent = 'Tamamlanmalar yerel saate göre kaydedilir ve son 365 günlük geçmiş saklanır.';
  container.append(hint);
}

function renderCompletionStatusIcon(isComplete, fallbackText = '') {
  const textPart = fallbackText ? `<span class="stats-status__text">${fallbackText}</span>` : '';
  if (isComplete) {
    return `<span class="stats-status__icon stats-status__icon--ok" aria-label="Tamamlandı">✔</span>${textPart}`;
  }
  return `<span class="stats-status__icon stats-status__icon--miss" aria-label="Eksik">✕</span>${textPart}`;
}

function updateCompletionStatsView() {
  updateHomeStatsView();
}

const COUNTER_HAPTIC_PATTERNS = {
  increment: 12,
  complete: [0, 18, 40, 18],
  reset: [0, 16, 36, 16],
  soft: 8,
};

function triggerCounterHaptic(type = 'soft') {
  try {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
      return;
    }
    const pattern = COUNTER_HAPTIC_PATTERNS[type] ?? COUNTER_HAPTIC_PATTERNS.soft;
    if (pattern) {
    navigator.vibrate(pattern);
    }
  } catch (error) {
    console.warn('Haptic tetiklenemedi.', error);
  }
}

function initScrollTopButton() {
  if (state.scrollTopButton) {
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'scroll-top-button';
  button.setAttribute('aria-label', 'En üste dön');
  button.innerHTML = '<span aria-hidden="true">↑</span>';

  button.addEventListener('click', () => {
    triggerCounterHaptic('soft');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const host = state.appRoot || document.body;
  host.append(button);
  state.scrollTopButton = button;

  let lastKnownScroll = window.scrollY || 0;
  let ticking = false;

  const handleScroll = () => {
    lastKnownScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollTopVisibility(lastKnownScroll);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function updateScrollTopVisibility(scrollPosition) {
  const button = state.scrollTopButton;
  if (!button) {
    return;
  }

  const threshold = Math.max(window.innerHeight * 0.8, 480);
  const shouldShow = scrollPosition > threshold;
  button.classList.toggle('is-visible', shouldShow);
  button.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
}

function handleDuaNewClick() {
  if (state.duaMode === 'saved') {
    showNextFavorite(1);
    return;
  }

  if (!state.duaState || state.duaState.remaining.length === 0) {
    return;
  }
  const picked = pickRandomFrom(state.duaState.remaining);
  state.duaState.current = picked;
  saveDuaState();
  refreshDuaUI();
  focusDuaCardTop();
}

function handleDuaOkClick() {
  if (state.duaMode === 'saved') {
    const entry = getCurrentFavoriteEntry();
    if (!entry) {
      return;
    }
    toggleDuaFavorite(entry.sourceId, entry.index);
    updateDuaModeToggleUI();
    refreshDuaUI();
    focusDuaCardTop();
    return;
  }

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
    refreshDuaUI();
    focusDuaCardTop();
    return;
  }

  state.duaState.current = pickRandomFrom(remaining);
  saveDuaState();
  refreshDuaUI();
  focusDuaCardTop();
}

function handleDuaResetClick() {
  const total = state.duas.length;
  if (!total) {
    return;
  }

  const sourceId = state.duaSource;
  const cycles = state.duaState ? state.duaState.cycles : 0;
  const nextState = resetDuaState(total, sourceId, cycles);
  if (nextState.remaining.length > 0) {
    nextState.current = pickRandomFrom(nextState.remaining);
    saveDuaState();
  } else {
    saveDuaState();
  }
  refreshDuaUI();
  focusDuaCardTop();
}

function focusDuaCardTop() {
  const ui = state.duaUI;
  if (!ui || !ui.card) {
    return;
  }
  const header = ui.card.querySelector('.dua-header');
  const target = header || ui.card;
  if (typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (typeof target.focus === 'function') {
    target.focus();
  }
}

function refreshDuaUI() {
  const ui = state.duaUI;
  if (!ui || !ui.card) {
    return;
  }

  if (!ui.card.isConnected) {
    state.duaUI = null;
    return;
  }

  const sourceId = state.duaSource;
  if (!state.personalDuaEnabled && state.duaMode === 'personal') {
    state.duaMode = 'predefined';
    state.personalDuaEditing = false;
  }

  updateDuaModeToggleUI();

  const isPersonalMode = state.personalDuaEnabled && state.duaMode === 'personal';
  const isSavedMode = state.duaMode === 'saved';
  const label = isPersonalMode
    ? 'Kişisel Dua'
    : isSavedMode
      ? 'Kaydedilen Dualar'
      : (DUA_SOURCES[sourceId]?.label || 'Dualar');

  ui.title.textContent = label;
  ui.card.dataset.duaSource = isPersonalMode ? 'personal' : (isSavedMode ? 'saved' : sourceId);
  updateDuaArabicVisibility();

  if (isPersonalMode) {
    if (ui.actions) {
      ui.actions.hidden = true;
    }
    ui.subtitle.textContent = 'Kişisel duanız';
    renderPersonalDua(ui.body);
    updateFavoriteToggleUI();
    return;
  }

  if (ui.actions) {
    ui.actions.hidden = state.duaMode === 'saved' && state.duaFavoritesList.length === 0;
  }
  state.personalDuaEditing = false;

  if (!state.duaState || state.duaState.sourceId !== sourceId) {
    ui.subtitle.textContent = 'Dualar yükleniyor…';
    ui.body.innerHTML = '<p>Dualar yükleniyor…</p>';
    ui.newButton.disabled = true;
    ui.okButton.disabled = true;
    ui.resetButton.hidden = true;
    ui.resetButton.disabled = true;
    return;
  }

  updateDuaSubtitle(ui.subtitle);
  updateDuaBody(ui.body);
  updateDuaButtons(ui.newButton, ui.okButton, ui.resetButton);
  updateFavoriteToggleUI();
}

function updateDuaSubtitle(subtitle) {
  if (!subtitle) {
    return;
  }

  if (state.personalDuaEnabled && state.duaMode === 'personal') {
    subtitle.textContent = 'Kişisel duanız';
    return;
  }

  if (state.duaMode === 'saved') {
    const total = state.duaFavoritesList.length;
    if (!total) {
      subtitle.textContent = 'Henüz kaydedilen dua bulunmuyor.';
      return;
    }
    const index = Math.min(Math.max(state.duaFavoritesIndex, 0), total - 1);
    const entry = state.duaFavoritesList[index];
    const sourceId = entry?.sourceId;
    const label = DUA_SOURCES[sourceId]?.label || 'Hazır dualar';
    const positionText = `${formatNumber(index + 1)} / ${formatNumber(total)}`;
    subtitle.textContent = `${positionText} · Kaynak: ${label}`;
    return;
  }

  if (!state.duaState) {
    return;
  }

  const total = state.duaState.total;
  const remaining = state.duaState.remaining.length;
  const cycles = state.duaState.cycles;
  const label = DUA_SOURCES[state.duaState.sourceId]?.label || 'Dualar';

  if (remaining === 0) {
    const times = Math.max(1, cycles);
    subtitle.textContent = `${label} ${formatNumber(times)} kere tamamladınız.`;
    return;
  }

  subtitle.textContent = `Kalan dua: ${formatNumber(remaining)} / ${formatNumber(total)}`;
}

function updateDuaBody(body) {
  if (!body) {
    return;
  }

  if (state.personalDuaEnabled && state.duaMode === 'personal') {
    renderPersonalDua(body);
    return;
  }

  if (state.duaMode === 'saved') {
    const favorites = state.duaFavoritesList;
    if (!favorites.length) {
      body.innerHTML = '<p>Kaydedilen duanız bulunmuyor. Sevdiğiniz duaları kaydetmek için yıldız simgesine dokunabilirsiniz.</p>';
      return;
    }
    const entry = getCurrentFavoriteEntry();
    if (!entry) {
      body.innerHTML = '<p>Kaydedilen dualar yüklenemedi.</p>';
      return;
    }

    const sourceId = entry.sourceId;
    const index = entry.index;
    const sourceList = state.duaCache[sourceId];

    if (!sourceList) {
      body.innerHTML = '<p>Dualar yükleniyor…</p>';
      loadDuaSourceData(sourceId)
        .then(() => {
          if (state.duaMode === 'saved') {
            refreshDuaUI();
          }
        })
        .catch((error) => {
          console.error('Kaydedilen dua yüklenemedi.', error);
        });
      return;
    }

    const duaText = sourceList[index];
    if (!duaText) {
      body.innerHTML = '<p>Bu kayıt artık mevcut değil.</p>';
      return;
    }

    body.innerHTML = DOMPurify.sanitize(marked.parse(duaText));
    return;
  }

  if (!state.duaState) {
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
  if (!newButton || !okButton || !resetButton) {
    return;
  }

  if (state.duaMode === 'saved') {
    const total = state.duaFavoritesList.length;
    newButton.textContent = 'Sonraki duayı göster';
    newButton.disabled = total <= 1;
    okButton.textContent = 'Kaydı kaldır';
    okButton.disabled = total === 0;
    resetButton.hidden = true;
    resetButton.disabled = true;
    return;
  }

  if (!state.duaState) {
    newButton.disabled = true;
    okButton.disabled = true;
    resetButton.hidden = true;
    resetButton.disabled = true;
    return;
  }

  newButton.textContent = 'Yeni dua getir';
  okButton.textContent = 'Okudum';
  resetButton.textContent = 'Baştan başlat';

  const remaining = state.duaState.remaining.length;
  const isComplete = remaining === 0;

  newButton.disabled = isComplete;
  okButton.disabled = isComplete || state.duaState.current === null;
  resetButton.hidden = !isComplete;
  resetButton.disabled = !isComplete;
}

function getCurrentFavoriteEntry() {
  if (!Array.isArray(state.duaFavoritesList) || state.duaFavoritesList.length === 0) {
    return null;
  }
  const index = Math.min(Math.max(state.duaFavoritesIndex, 0), state.duaFavoritesList.length - 1);
  return state.duaFavoritesList[index] || null;
}

function updateFavoriteToggleUI() {
  const ui = state.duaUI;
  if (!ui || !ui.favoriteButton) {
    return;
  }

  const button = ui.favoriteButton;
  const icon = button.querySelector('.dua-favorite-toggle__icon');

  let targetSource = null;
  let targetIndex = null;
  let disabled = false;

  if (state.duaMode === 'personal') {
    disabled = true;
  } else if (state.duaMode === 'saved') {
    const entry = getCurrentFavoriteEntry();
    if (entry) {
      targetSource = entry.sourceId;
      targetIndex = entry.index;
    } else {
      disabled = true;
    }
  } else if (state.duaState && state.duaState.current !== null) {
    targetSource = state.duaState.sourceId;
    targetIndex = state.duaState.current;
  } else {
    disabled = true;
  }

  const isFavorite = !disabled && isDuaFavorite(targetSource, targetIndex);

  button.disabled = disabled;
  button.classList.toggle('is-active', isFavorite);
  button.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
  button.setAttribute('aria-label', isFavorite ? 'Kaydedilenlerden çıkar' : 'Kaydedilenlere ekle');
  button.title = isFavorite ? 'Kaydedilenlerden çıkar' : 'Kaydedilenlere ekle';
  if (icon) {
    icon.textContent = isFavorite ? '★' : '☆';
  }

  button.dataset.favoriteSource = targetSource || '';
  button.dataset.favoriteIndex = Number.isInteger(targetIndex) ? String(targetIndex) : '';
}

function handleDuaFavoriteToggle() {
  if (state.duaMode === 'personal') {
    return;
  }

  let sourceId = null;
  let index = null;

  if (state.duaMode === 'saved') {
    const entry = getCurrentFavoriteEntry();
    if (!entry) {
      return;
    }
    ({ sourceId, index } = entry);
  } else if (state.duaState && state.duaState.current !== null) {
    sourceId = state.duaState.sourceId;
    index = state.duaState.current;
  }

  if (!sourceId || !Number.isInteger(index)) {
    return;
  }

  toggleDuaFavorite(sourceId, index);
  updateFavoriteToggleUI();
  triggerCounterHaptic('soft');

  if (state.duaMode === 'saved') {
    refreshDuaUI();
  }
}

function showNextFavorite(step = 1) {
  const list = state.duaFavoritesList;
  if (!Array.isArray(list) || list.length <= 1) {
    return;
  }
  const length = list.length;
  state.duaFavoritesIndex = (state.duaFavoritesIndex + step + length) % length;
  triggerCounterHaptic('soft');
  refreshDuaUI();
  focusDuaCardTop();
}

function updateDuaModeToggleUI() {
  const ui = state.duaUI;
  if (!ui || !ui.modeToggle || !ui.modeButtons) {
    return;
  }

  const personalEnabled = Boolean(state.personalDuaEnabled);
  ui.modeToggle.hidden = false;

  const personalButton = ui.modeButtons.personal;
  if (personalButton) {
    personalButton.hidden = !personalEnabled;
    personalButton.disabled = !personalEnabled;
  }

  const savedButton = ui.modeButtons.saved;
  if (savedButton) {
    const hasFavorites = state.duaFavoritesList.length > 0;
    savedButton.disabled = false;
    savedButton.classList.remove('is-disabled');
    savedButton.setAttribute('aria-disabled', 'false');
    savedButton.dataset.hasFavorites = hasFavorites ? 'true' : 'false';
    savedButton.title = hasFavorites
      ? 'Kaydedilen duaları göster'
      : 'Kaydedilen dualarınızı burada görebilirsiniz.';
  }

  Object.entries(ui.modeButtons).forEach(([mode, button]) => {
    if (!button || button.hidden) {
      return;
    }
    const isActive = state.duaMode === mode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function renderPersonalDua(body) {
  if (!body) {
    return;
  }

  const contentText = (state.personalDuaText || '').trim();
  body.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'personal-dua';

  if (state.personalDuaEditing) {
    const textarea = document.createElement('textarea');
    textarea.className = 'personal-dua__textarea';
    textarea.rows = 6;
    textarea.value = state.personalDuaText;
    wrapper.append(textarea);

    const actions = document.createElement('div');
    actions.className = 'personal-dua__actions';

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'button-pill';
    saveButton.textContent = 'Kaydet';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'button-pill secondary';
    cancelButton.textContent = 'Vazgeç';

    actions.append(saveButton, cancelButton);
    wrapper.append(actions);

    saveButton.addEventListener('click', () => {
      savePersonalDuaText(textarea.value);
      state.personalDuaEditing = false;
      refreshDuaUI();
    });

    cancelButton.addEventListener('click', () => {
      state.personalDuaEditing = false;
      refreshDuaUI();
    });

    body.append(wrapper);
    textarea.focus();
    return;
  }

  if (contentText) {
    const content = document.createElement('div');
    content.className = 'personal-dua__content';
    content.innerHTML = DOMPurify.sanitize(marked.parse(contentText, { mangle: false, headerIds: false }));
    wrapper.append(content);
  } else {
    const empty = document.createElement('p');
    empty.className = 'personal-dua__empty';
    empty.textContent = 'Henüz kişisel dua eklenmedi.';
    wrapper.append(empty);
  }

  const hint = document.createElement('p');
  hint.className = 'personal-dua__hint';
  hint.textContent = 'Bu dua yalnızca cihazınızda saklanır.';
  wrapper.append(hint);

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'button-pill';
  editButton.textContent = contentText ? 'Dua metnini düzenle' : 'Dua ekle';
  editButton.addEventListener('click', () => {
    state.personalDuaEditing = true;
    refreshDuaUI();
  });
  wrapper.append(editButton);

  body.append(wrapper);
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

  let list = [];

  if (config.composite) {
    const baseSources = Object.entries(DUA_SOURCES)
      .filter(([, item]) => item && item.path);
    const results = await Promise.all(
      baseSources.map(([id]) => loadDuaSourceData(id)),
    );
    list = [];
    baseSources.forEach(([id, item], index) => {
      const entries = results[index] || [];
      const label = item.label || id;
      entries.forEach((dua) => {
        list.push(`**${label}**\n\n${dua}`);
      });
    });
  } else if (config.path) {
    const raw = await fetchText(config.path);
    list = sanitiseDuas(raw);
  }

  state.duaCache[sourceId] = list;
  return list;
}

function sanitiseDuas(raw) {
  if (!raw) {
    return [];
  }

  const clean = raw.replace(/\ufeff/g, '');
  const normalised = clean.replace(/[\u2013\u2014]\s*split\s*[\u2013\u2014]/gi, '-split-');
  return normalised
    .split(/-split-/i)
    .map((entry) => entry.trim())
    .map((entry) => entry.replace(/^\d+\.\s*/, ''))
    .map(enrichDuaEntryWithArabic)
    .filter((entry) => entry.length > 0);
}

function enrichDuaEntryWithArabic(entry) {
  if (!entry || entry.indexOf('AR:') === -1) {
    return entry;
  }

  const lines = entry.split(/\r?\n/);
  const turkishLines = [];
  const arabicLines = [];
  let parsingArabic = false;

  lines.forEach((originalLine) => {
    const line = originalLine;
    if (/^\s*AR\s*:/i.test(line)) {
      parsingArabic = true;
      const remainder = line.replace(/^\s*AR\s*:\s*/, '').trim();
      if (remainder) {
        arabicLines.push(remainder);
      }
      return;
    }

    if (parsingArabic) {
      const trimmed = line.trim();
      if (!trimmed) {
        arabicLines.push('');
        return;
      }

      if (ARABIC_SCRIPT_REGEX.test(line) || /^[\u200c\u200f\u061C•*.,;:!?()\-\s]+$/.test(trimmed)) {
        arabicLines.push(trimmed);
        return;
      }

      parsingArabic = false;
    }

    turkishLines.push(originalLine);
  });

  const trimmedArabicLines = [...arabicLines];
  while (trimmedArabicLines.length > 0 && !trimmedArabicLines[trimmedArabicLines.length - 1]) {
    trimmedArabicLines.pop();
  }

  const hasArabic = trimmedArabicLines.some((line) => line && line.trim().length > 0);
  if (!hasArabic) {
    return turkishLines.join('\n').trim();
  }

  const turkish = turkishLines.join('\n').trim();
  const arabicHtml = trimmedArabicLines
    .map((line) => escapeHtml(line.trim()))
    .join('<br>');

  const parts = [];
  if (arabicHtml) {
    parts.push(`<div class="dua-arabic-block arabic-text" dir="rtl" data-dua-arabic>${arabicHtml}</div>`);
  }
  if (turkish) {
    parts.push(turkish);
  }

  return parts.join('\n\n').trim();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensureDuaState(total, sourceId) {
  const repository = ensureDuaRepository();
  let stored = repository.states[sourceId];
  let needsPersist = false;

  if (!stored) {
    stored = createFreshDuaState(total, sourceId, 0);
    repository.states[sourceId] = stored;
    needsPersist = true;
  } else if (stored.total !== total) {
    stored = createFreshDuaState(total, sourceId, stored.cycles || 0);
    repository.states[sourceId] = stored;
    needsPersist = true;
  } else {
    const sanitised = sanitizeStoredDuaState(stored, total, sourceId);
    if (sanitised !== stored) {
      repository.states[sourceId] = sanitised;
      stored = sanitised;
      needsPersist = true;
    }
  }

  if (stored.current === null && stored.remaining.length > 0) {
    stored.current = pickRandomFrom(stored.remaining);
    needsPersist = true;
  }

  repository.current = sourceId;
  state.duaStates.set(sourceId, stored);
  state.duaState = stored;

  if (needsPersist) {
    persistDuaRepository();
  }

  return stored;
}

function ensureDuaRepository() {
  if (duaRepository) {
    return duaRepository;
  }

  try {
    const raw = localStorage.getItem(DUA_STORAGE_KEY);
    if (!raw) {
      duaRepository = createEmptyDuaRepository();
      return duaRepository;
    }

    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === DUA_STORAGE_VERSION && parsed.states && typeof parsed.states === 'object') {
      duaRepository = {
        version: DUA_STORAGE_VERSION,
        current: parsed.current || null,
        states: parsed.states,
      };
      return duaRepository;
    }

    if (parsed && typeof parsed === 'object' && parsed.total !== undefined) {
      const legacySource = parsed.sourceId || 'birkirikdilekce';
      const migrated = sanitizeStoredDuaState(parsed, parsed.total, legacySource);
      duaRepository = createEmptyDuaRepository();
      duaRepository.states[legacySource] = migrated;
      duaRepository.current = legacySource;
      persistDuaRepository();
      return duaRepository;
    }
  } catch (error) {
    console.warn('Dua depolama bilgisi okunamadı, sıfırlanıyor.', error);
  }

  duaRepository = createEmptyDuaRepository();
  return duaRepository;
}

function createEmptyDuaRepository() {
  return { version: DUA_STORAGE_VERSION, current: null, states: {} };
}

function createFreshDuaState(total, sourceId, existingCycles = 0) {
  return {
    remaining: Array.from({ length: total }, (_value, index) => index),
    cycles: Math.max(0, Math.floor(existingCycles || 0)),
    current: null,
    total,
    sourceId,
  };
}

function sanitizeStoredDuaState(stored, total, sourceId) {
  if (!stored || typeof stored !== 'object') {
    return createFreshDuaState(total, sourceId, 0);
  }

  const seen = new Set();
  const remaining = [];

  if (Array.isArray(stored.remaining)) {
    stored.remaining.forEach((idx) => {
      if (Number.isInteger(idx) && idx >= 0 && idx < total && !seen.has(idx)) {
        seen.add(idx);
        remaining.push(idx);
      }
    });
  }

  remaining.sort((a, b) => a - b);

  const cycles = Math.max(0, Math.floor(stored.cycles || 0));
  let current = Number.isInteger(stored.current) ? stored.current : null;

  if (current !== null && (!seen.has(current) || current < 0 || current >= total)) {
    current = null;
  }

  if (!remaining.length && total > 0) {
    // keep completion status but ensure structure is valid
    current = null;
  }

  return {
    remaining,
    cycles,
    current,
    total,
    sourceId,
  };
}

function persistDuaRepository() {
  try {
    const repository = ensureDuaRepository();
    localStorage.setItem(DUA_STORAGE_KEY, JSON.stringify({
      version: DUA_STORAGE_VERSION,
      current: repository.current,
      states: repository.states,
    }));
  } catch (error) {
    console.warn('Dua durumu kaydedilemedi.', error);
  }
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

function loadSharedDuaLastRoomId() {
  try {
    const raw = localStorage.getItem(SHARED_DUA_LAST_ROOM_STORAGE_KEY);
    return raw && typeof raw === 'string' ? raw : null;
  } catch (_error) {
    return null;
  }
}

function saveSharedDuaLastRoomId(roomId) {
  if (!roomId || typeof roomId !== 'string') {
    return;
  }
  state.sharedDua.lastRoomId = roomId;
  try {
    localStorage.setItem(SHARED_DUA_LAST_ROOM_STORAGE_KEY, roomId);
  } catch (error) {
    console.warn('Son oda bilgisi kaydedilemedi.', error);
  }
}

function saveCounters() {
  localStorage.setItem(COUNTER_STORAGE_KEY, JSON.stringify(state.counters));
}

function saveDuaState() {
  if (!state.duaState) {
    return;
  }
  const repository = ensureDuaRepository();
  repository.states[state.duaState.sourceId] = state.duaState;
  repository.current = state.duaState.sourceId;
  persistDuaRepository();
}

function resetDuaState(total, sourceId, existingCycles = 0) {
  const repository = ensureDuaRepository();
  const base = createFreshDuaState(total, sourceId, existingCycles);
  repository.states[sourceId] = base;
  repository.current = sourceId;
  state.duaState = base;
  state.duaStates.set(sourceId, base);
  persistDuaRepository();
  return base;
}

function resolveMarkdownPath(source, language) {
  if (!source) {
    return null;
  }
  if (typeof source === 'string') {
    return source;
  }
  if (typeof source === 'object') {
    const targetLanguage = language && typeof language === 'string' ? language : DEFAULT_LANGUAGE;
    if (typeof source[targetLanguage] === 'string') {
      return source[targetLanguage];
    }
    if (typeof source[DEFAULT_LANGUAGE] === 'string') {
      return source[DEFAULT_LANGUAGE];
    }
    const fallback = Object.values(source).find((value) => typeof value === 'string' && value);
    if (fallback) {
      return fallback;
    }
  }
  return null;
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

function applyTheme(appRoot, selection) {
  if (!appRoot) {
    return;
  }
  const normalized = normalizeThemeSelection(selection);
  const themePreset = THEME_PRESET_MAP.get(normalized.themeId) || THEME_PRESET_MAP.get(DEFAULT_THEME_ID);
  const modeConfig = themePreset?.[normalized.mode] || {};
  const baseTokens = { ...BASE_THEME_TOKENS[normalized.mode] };
  const tokens = { ...baseTokens };

  const overrideMap = {
    surfaceColor: 'surface-color',
    surfaceElevated: 'surface-elevated',
    surfaceMuted: 'surface-muted',
    heroGradient: 'surface-hero',
    textColor: 'text-color',
    mutedText: 'muted-text',
    accent: 'accent-color',
    accentContrast: 'accent-contrast',
    borderColor: 'border-color',
    tooltipBg: 'tooltip-bg',
    tooltipText: 'tooltip-text',
    tooltipBorder: 'tooltip-border',
    tooltipShadow: 'tooltip-shadow',
    nameBadgeBg: 'name-badge-bg',
    nameBadgeColor: 'name-badge-color',
    nameBadgeHoverBg: 'name-badge-hover-bg',
    surfaceOverlay: 'surface-overlay',
    surfaceOverlayStrong: 'surface-overlay-strong',
    accentSoftBg: 'accent-soft-bg',
    accentSoftHover: 'accent-soft-hover',
    tabActiveBg: 'tab-active-bg',
    tabActiveText: 'tab-active-text',
    tabInactiveBg: 'tab-inactive-bg',
    tabInactiveHover: 'tab-inactive-hover',
    tabInactiveText: 'tab-inactive-text',
    highlightOverlay: 'highlight-overlay',
    installBorder: 'install-border',
    installBackground: 'install-background',
    iconButtonBg: 'icon-button-bg',
    iconButtonHover: 'icon-button-hover',
    counterResetBg: 'counter-reset-bg',
    counterResetHover: 'counter-reset-hover',
    focusOutline: 'focus-outline',
    actionButtonBg: 'action-button-bg',
    actionButtonHover: 'action-button-hover',
    heroSubtitleColor: 'hero-subtitle-color',
    shadowSoft: 'shadow-soft',
    shadowSoftHover: 'shadow-soft-hover',
    cardShadow: 'card-shadow',
    cardShadowHover: 'card-shadow-hover',
    counterShadow: 'counter-shadow',
    counterShadowComplete: 'counter-shadow-complete',
    counterCompleteBg: 'counter-complete-bg',
    counterCompleteText: 'counter-complete-text',
    themeColor: 'meta-theme-color',
    scrollTopBg: 'scroll-top-bg',
    scrollTopColor: 'scroll-top-color',
  };

  Object.entries(overrideMap).forEach(([configKey, cssVar]) => {
    if (modeConfig[configKey] !== undefined) {
      tokens[cssVar] = modeConfig[configKey];
    }
  });

  if (!isValidHex(tokens['accent-color'])) {
    tokens['accent-color'] = baseTokens['accent-color'];
  }

  if (modeConfig.accentContrast) {
    tokens['accent-contrast'] = modeConfig.accentContrast;
  } else if (!tokens['accent-contrast']) {
    tokens['accent-contrast'] = normalized.mode === 'dark' ? '#0e1114' : '#ffffff';
  }

  tokens['border-color'] = modeConfig.borderColor || deriveAlphaColor(tokens['accent-color'], normalized.mode === 'dark' ? 0.32 : 0.22, tokens['border-color']);

  tokens['surface-overlay'] = modeConfig.surfaceOverlay || deriveAlphaColor(tokens['accent-color'], normalized.mode === 'dark' ? 0.16 : 0.14, tokens['surface-overlay']);
  tokens['surface-overlay-strong'] = modeConfig.surfaceOverlayStrong || deriveAlphaColor(tokens['accent-color'], normalized.mode === 'dark' ? 0.24 : 0.2, tokens['surface-overlay-strong']);
  tokens['accent-soft-bg'] = modeConfig.accentSoftBg || deriveAlphaColor(tokens['accent-color'], normalized.mode === 'dark' ? 0.2 : 0.18, tokens['accent-soft-bg']);
  tokens['accent-soft-hover'] = modeConfig.accentSoftHover || deriveAlphaColor(tokens['accent-color'], normalized.mode === 'dark' ? 0.3 : 0.26, tokens['accent-soft-hover']);
  tokens['counter-reset-bg'] = modeConfig.counterResetBg || tokens['accent-soft-bg'];
  tokens['counter-reset-hover'] = modeConfig.counterResetHover || tokens['accent-soft-hover'];
  tokens['install-border'] = modeConfig.installBorder || deriveAlphaColor(tokens['accent-color'], normalized.mode === 'dark' ? 0.45 : 0.38, tokens['install-border']);
  tokens['install-background'] = modeConfig.installBackground || deriveAlphaColor(tokens['accent-color'], normalized.mode === 'dark' ? 0.18 : 0.12, tokens['install-background']);
  tokens['action-button-bg'] = modeConfig.actionButtonBg || deriveAlphaColor(tokens['accent-color'], normalized.mode === 'dark' ? 0.24 : 0.18, tokens['action-button-bg']);
  tokens['action-button-hover'] = modeConfig.actionButtonHover || deriveAlphaColor(tokens['accent-color'], normalized.mode === 'dark' ? 0.32 : 0.26, tokens['action-button-hover']);

  if (!modeConfig.scrollTopBg) {
    if (isValidHex(tokens['accent-color'])) {
      const mixTarget = normalized.mode === 'dark' ? '#ffffff' : '#000000';
      const mixRatio = normalized.mode === 'dark' ? 0.28 : 0.18;
      const mixed = mixColors(tokens['accent-color'], mixTarget, mixRatio);
      tokens['scroll-top-bg'] = isValidHex(mixed) ? mixed : tokens['accent-color'];
    } else {
      tokens['scroll-top-bg'] = tokens['accent-color'];
    }
  } else {
    tokens['scroll-top-bg'] = modeConfig.scrollTopBg;
  }

  if (!modeConfig.scrollTopColor) {
    tokens['scroll-top-color'] = normalized.mode === 'dark' ? '#0d1116' : '#ffffff';
  } else {
    tokens['scroll-top-color'] = modeConfig.scrollTopColor;
  }

  if (!modeConfig.highlightOverlay) {
    const generatedHighlight = createHighlightGradient(tokens['accent-color'], normalized.mode, tokens['highlight-overlay']);
    if (generatedHighlight) {
      tokens['highlight-overlay'] = generatedHighlight;
    }
  }

  if (!modeConfig.nameBadgeBg) {
    tokens['name-badge-bg'] = deriveAlphaColor(tokens['accent-color'], normalized.mode === 'dark' ? 0.3 : 0.28, tokens['name-badge-bg']);
  }
  if (!modeConfig.nameBadgeHoverBg) {
    tokens['name-badge-hover-bg'] = deriveAlphaColor(tokens['accent-color'], normalized.mode === 'dark' ? 0.4 : 0.35, tokens['name-badge-hover-bg']);
  }
  if (!modeConfig.nameBadgeColor) {
    if (normalized.mode === 'dark') {
      tokens['name-badge-color'] = tokens['surface-color'];
    } else {
      const mixed = mixColors(tokens['accent-color'], '#202020', 0.25);
      tokens['name-badge-color'] = isValidHex(mixed) ? mixed : tokens['accent-color'];
    }
  }

  if (!modeConfig.surfaceColor) {
    tokens['surface-color'] = baseTokens['surface-color'];
  }

  if (!modeConfig.iconButtonBg) {
    tokens['icon-button-bg'] = deriveAlphaColor('#ffffff', normalized.mode === 'dark' ? 0.14 : 0.18, tokens['icon-button-bg']);
  }
  if (!modeConfig.iconButtonHover) {
    tokens['icon-button-hover'] = deriveAlphaColor('#ffffff', normalized.mode === 'dark' ? 0.22 : 0.28, tokens['icon-button-hover']);
  }

  if (!modeConfig.focusOutline) {
    tokens['focus-outline'] = deriveAlphaColor('#ffffff', normalized.mode === 'dark' ? 0.75 : 0.85, tokens['focus-outline']);
  }

  if (!modeConfig.tabActiveBg) {
    tokens['tab-active-bg'] = normalized.mode === 'dark'
      ? deriveAlphaColor('#ffffff', 0.18, tokens['tab-active-bg'])
      : (tokens['accent-contrast'] || tokens['surface-elevated']);
  }
  if (!modeConfig.tabActiveText) {
    tokens['tab-active-text'] = tokens['accent-color'];
  }
  if (!modeConfig.tabInactiveBg) {
    tokens['tab-inactive-bg'] = normalized.mode === 'dark'
      ? deriveAlphaColor('#ffffff', 0.08, tokens['tab-inactive-bg'])
      : deriveAlphaColor('#ffffff', 0.15, tokens['tab-inactive-bg']);
  }
  if (!modeConfig.tabInactiveHover) {
    tokens['tab-inactive-hover'] = normalized.mode === 'dark'
      ? deriveAlphaColor('#ffffff', 0.14, tokens['tab-inactive-hover'])
      : deriveAlphaColor('#ffffff', 0.24, tokens['tab-inactive-hover']);
  }
  if (!modeConfig.tabInactiveText) {
    tokens['tab-inactive-text'] = 'rgba(255, 255, 255, 0.85)';
  }

  if (!modeConfig.heroSubtitleColor) {
    tokens['hero-subtitle-color'] = normalized.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.82)'
      : 'rgba(255, 255, 255, 0.8)';
  }

  if (!tokens['meta-theme-color']) {
    if (normalized.mode === 'dark') {
      const candidate = modeConfig.surfaceColor || tokens['surface-color'];
      tokens['meta-theme-color'] = isValidHex(candidate) ? candidate : '#1c1c1a';
    } else {
      tokens['meta-theme-color'] = isValidHex(tokens['accent-color']) ? tokens['accent-color'] : '#556b2f';
    }
  }

  appRoot.dataset.theme = normalized.themeId;
  appRoot.dataset.mode = normalized.mode;
  document.documentElement.style.setProperty('color-scheme', normalized.mode);

  Object.entries(tokens).forEach(([cssVar, value]) => {
    if (typeof value === 'string') {
      appRoot.style.setProperty(`--${cssVar}`, value);
    }
  });

  const toggleIcon = appRoot.querySelector('.theme-toggle__icon');
  if (toggleIcon) {
    toggleIcon.textContent = normalized.mode === 'dark' ? '🌙' : '☀️';
  }

  state.themeSelection = normalized;
  saveThemeSelection(normalized);
  updateThemeSelectorUI(normalized.themeId);
  updateMetaThemeColor(tokens['meta-theme-color']);
  updateManifestThemeColor(tokens['meta-theme-color'], tokens['surface-color']);
}

function attachThemeToggle(appRoot) {
  const toggleButton = appRoot.querySelector('.theme-toggle');
  if (!toggleButton) {
    return;
  }

  toggleButton.addEventListener('click', () => {
    const nextMode = state.themeSelection.mode === 'dark' ? 'light' : 'dark';
    applyTheme(appRoot, { themeId: state.themeSelection.themeId, mode: nextMode });
  });
}

function attachSettingsToggle(appRoot) {
  const toggleButton = appRoot.querySelector('.settings-toggle');
  const overlay = document.querySelector('[data-settings]');
  const closeButtons = overlay ? overlay.querySelectorAll('[data-close-settings]') : null;
  const mainSheet = overlay?.querySelector('[data-settings-main]');

  if (!toggleButton || !overlay || !mainSheet) {
    return;
  }

  if (!mainSheet.hasAttribute('tabindex')) {
    mainSheet.setAttribute('tabindex', '-1');
  }

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSettings();
    }
  };

  const openSettings = () => {
    overlay.removeAttribute('hidden');
    document.body.classList.add('settings-open');
    document.addEventListener('keydown', handleKeydown);
    const focusTarget = closeButtons && closeButtons.length > 0 ? closeButtons[0] : mainSheet;
    window.requestAnimationFrame(() => {
      focusTarget?.focus?.();
    });
  };

  const closeSettings = () => {
    overlay.setAttribute('hidden', '');
    document.body.classList.remove('settings-open');
    document.removeEventListener('keydown', handleKeydown);
    window.requestAnimationFrame(() => {
      toggleButton.focus();
    });
  };

  toggleButton.addEventListener('click', () => {
    if (overlay.hasAttribute('hidden')) {
      openSettings();
    } else {
      closeSettings();
    }
  });

  closeButtons?.forEach((button) => {
    button.addEventListener('click', () => {
      closeSettings();
    });
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeSettings();
    }
  });
}

function resolveThemePreviewBackground(preset, mode) {
  const config = preset?.[mode];
  if (config?.heroGradient) {
    return config.heroGradient;
  }
  if (config?.accent && isValidHex(config.accent)) {
    const mixTarget = mode === 'dark' ? '#000000' : '#ffffff';
    const secondary = mixColors(config.accent, mixTarget, mode === 'dark' ? 0.35 : 0.55);
    return `linear-gradient(135deg, ${config.accent} 0%, ${secondary} 100%)`;
  }
  const base = BASE_THEME_TOKENS[mode];
  return base['surface-hero'] || base['accent-color'];
}

function initThemeSelector() {
  const accordion = document.querySelector('[data-theme-accordion]');
  const panel = document.querySelector('[data-theme-options]');

  if (!accordion || !panel) {
    return;
  }

  const initialExpanded = !panel.hasAttribute('hidden');

  const setExpanded = (expanded) => {
    accordion.classList.toggle('is-open', expanded);
    accordion.setAttribute('aria-expanded', String(expanded));
    if (expanded) {
      panel.classList.add('is-open');
      panel.removeAttribute('hidden');
    } else {
      panel.classList.remove('is-open');
      panel.setAttribute('hidden', '');
    }
  };

  setExpanded(initialExpanded);

  accordion.addEventListener('click', () => {
    const nextExpanded = !accordion.classList.contains('is-open');
    setExpanded(nextExpanded);
  });

  accordion.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      accordion.click();
    }
  });

  panel.innerHTML = '';
  state.themeOptionElements = new Map();

  THEME_PRESETS.forEach((preset) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'theme-option';
    option.dataset.themeId = preset.id;
    option.setAttribute('aria-pressed', 'false');
    option.setAttribute('aria-label', `${preset.label} temasını seç`);

    const accentColor = preset.light?.accent || preset.dark?.accent || BASE_THEME_TOKENS.light['accent-color'];
    if (isValidHex(accentColor)) {
      option.style.setProperty('--theme-option-accent', accentColor);
    }

    const swatch = document.createElement('div');
    swatch.className = 'theme-option__swatch';

    const lightTone = document.createElement('span');
    lightTone.className = 'theme-option__tone theme-option__tone--light';
    lightTone.style.background = resolveThemePreviewBackground(preset, 'light');

    const darkTone = document.createElement('span');
    darkTone.className = 'theme-option__tone theme-option__tone--dark';
    darkTone.style.background = resolveThemePreviewBackground(preset, 'dark');

    const accentChip = document.createElement('span');
    accentChip.className = 'theme-option__accent';
    if (isValidHex(accentColor)) {
      accentChip.style.background = accentColor;
    }

    swatch.append(lightTone, darkTone, accentChip);

    const info = document.createElement('div');
    info.className = 'theme-option__info';

    const title = document.createElement('span');
    title.className = 'theme-option__title';
    title.textContent = preset.label;
    info.append(title);

    if (preset.description) {
      const meta = document.createElement('span');
      meta.className = 'theme-option__meta';
      meta.textContent = preset.description;
      info.append(meta);
    }

    option.append(swatch, info);

    option.addEventListener('click', () => {
      if (state.themeSelection.themeId === preset.id) {
        return;
      }
      const root = state.appRoot || document.querySelector('.app');
      if (!root) {
        return;
      }
      applyTheme(root, { themeId: preset.id, mode: state.themeSelection.mode });
    });

    panel.append(option);
    state.themeOptionElements.set(preset.id, option);
  });

  updateThemeSelectorUI(state.themeSelection.themeId);
}

function initLanguageToggle() {
  const container = document.querySelector('.language-toggle');
  if (!container) {
    return;
  }

  const updateVisibility = () => {
    const currentPrayer = state.appRoot?.dataset.currentPrayer;
    const shouldHide = currentPrayer === 'zikirler';
    container.style.display = shouldHide ? 'none' : '';
  };

  const buttons = Array.from(container.querySelectorAll('[data-language]'));
  if (!buttons.length) {
    return;
  }

  state.languageToggleButtons = new Map();

  buttons.forEach((button) => {
    const option = resolveLanguage(button.dataset.language);
    state.languageToggleButtons.set(option, button);
    button.type = 'button';
    button.addEventListener('click', () => {
      changeLanguage(option);
    });
  });

  updateLanguageToggleUI(state.language);
  updateVisibility();

  document.addEventListener('prayerchange', updateVisibility);
}

function updateLanguageToggleUI(language) {
  if (!(state.languageToggleButtons instanceof Map)) {
    return;
  }
  state.languageToggleButtons.forEach((button, option) => {
    const isActive = option === language;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function updateThemeSelectorUI(selectedThemeId) {
  if (!(state.themeOptionElements instanceof Map)) {
    return;
  }

  state.themeOptionElements.forEach((button, id) => {
    const isActive = id === selectedThemeId;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function registerInstallPromptHandlers() {
  if (isStandaloneMode()) {
    return;
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    state.installPromptEvent = event;
    if (!shouldSuppressInstallPrompt()) {
      state.installPromptVisible = true;
      updateHomeInstallBanner();
    }
  });

  window.addEventListener('appinstalled', () => {
    state.installPromptEvent = null;
    state.installPromptVisible = false;
    localStorage.setItem(INSTALL_PROMPT_STORAGE_KEY, JSON.stringify({ dismissedAt: Date.now(), installed: true }));
    updateHomeInstallBanner();
  });
}

function isStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isIosSafari() {
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) && /safari/.test(ua);
}

function shouldSuppressInstallPrompt() {
  try {
    const record = JSON.parse(localStorage.getItem(INSTALL_PROMPT_STORAGE_KEY));
    if (!record || !record.dismissedAt) {
      return false;
    }
    return Date.now() - Number(record.dismissedAt) < INSTALL_PROMPT_DELAY;
  } catch (_error) {
    return false;
  }
}

function dismissInstallPrompt(record = {}) {
  localStorage.setItem(INSTALL_PROMPT_STORAGE_KEY, JSON.stringify({ dismissedAt: Date.now(), ...record }));
  state.installPromptVisible = false;
  state.installPromptEvent = null;
  updateHomeInstallBanner();
}

function attachHomeNavigation(appRoot) {
  const title = appRoot.querySelector('.hero__title');
  if (!title) {
    return;
  }

  title.classList.add('hero__title--link');
  title.setAttribute('role', 'button');
  title.setAttribute('tabindex', '0');

  const navigateHome = () => {
    hideNameTooltip();
    setActivePrayer('home');
  };

  title.addEventListener('click', navigateHome);
  title.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigateHome();
    }
  });
}

function attachHeroQuickLinks(appRoot) {
  const links = Array.from(appRoot.querySelectorAll('[data-hero-link]'));
  if (!links.length) {
    return;
  }

  links.forEach((link) => {
    const targetPrayer = link.dataset.prayer;
    if (!targetPrayer) {
      return;
    }

    if (!link.hasAttribute('type')) {
      link.setAttribute('type', 'button');
    }

    link.setAttribute('aria-pressed', link.classList.contains('is-active') ? 'true' : 'false');

    link.addEventListener('click', () => {
      if (targetPrayer === state.currentPrayer) {
        return;
      }
      setActivePrayer(targetPrayer);
    });
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
    state.nameKeys = new Map();
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
  const encounteredBySection = new Map();
  textNodes.forEach(({ node, sectionKey }) => {
    if (!sectionKey) {
      wrapNamesInTextNode(node, null);
      return;
    }
    let set = encounteredBySection.get(sectionKey);
    if (!set) {
      set = new Map();
      encounteredBySection.set(sectionKey, set);
    }
    wrapNamesInTextNode(node, set);
  });
}

function wrapNamesInTextNode(node, encountered) {
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
    if (!shouldAnnotateWord(cleaned)) {
      fragment.appendChild(document.createTextNode(word));
      lastIndex = end;
      continue;
    }
    const canonical = canonicalizeName(cleaned);
    const meaning = resolveNameMeaning(cleaned, canonical, encountered);

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

function shouldAnnotateWord(word) {
  // Kelime üstü tercümelerde yalnızca büyük harfle başlayan isimleri vurgula.
  if (!word) {
    return false;
  }
  const firstLetterMatch = word.match(/\p{L}/u);
  if (!firstLetterMatch) {
    return false;
  }
  const letter = firstLetterMatch[0];
  const upper = letter.toLocaleUpperCase('tr-TR');
  const lower = letter.toLocaleLowerCase('tr-TR');
  return letter === upper && upper !== lower;
}

function createNameBadge(name, meaning) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'name-badge';
  button.textContent = name;
  button.dataset.name = name;
  button.dataset.meaning = meaning;
  button.dataset.lookupKey = findLookupKey(name);
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
    if (
      parent
      && (
        parent.closest('.counter-card')
        || parent.closest('.name-badge')
        || parent.closest('[data-disable-tooltips="true"]')
        || parent.tagName === 'SCRIPT'
        || parent.tagName === 'STYLE'
      )
    ) {
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
      nodes.push({ node: current, sectionKey: activeSection.start });
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
      recordNameKey(canonical, rawName);
    }
    if (!canonical.endsWith('u') && !state.nameLookup.has(`${canonical}u`)) {
      state.nameLookup.set(`${canonical}u`, meaning);
      recordNameKey(`${canonical}u`, rawName);
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

function recordNameKey(canonical, fallback) {
  if (!canonical) {
    return;
  }
  if (!state.nameKeys) {
    state.nameKeys = new Map();
  }
  if (state.nameKeys.has(canonical)) {
    return;
  }
  const manual = MANUAL_NAME_KEYS[canonical];
  state.nameKeys.set(canonical, manual || fallback || canonical);
}

function findLookupKey(name) {
  if (!name) {
    return name;
  }
  const canonical = canonicalizeName(name);
  if (!canonical) {
    return name;
  }
  const fromMap = state.nameKeys?.get(canonical);
  if (fromMap) {
    return fromMap;
  }

  const manualDirect = MANUAL_NAME_KEYS[canonical];
  if (manualDirect) {
    recordNameKey(canonical, manualDirect);
    return manualDirect;
  }

  const trimmed = canonical.replace(/(u|a|i|e)$/i, '');
  if (trimmed) {
    const trimmedKey = state.nameKeys?.get(trimmed);
    if (trimmedKey) {
      recordNameKey(canonical, trimmedKey);
      return trimmedKey;
    }
    const manualTrimmed = MANUAL_NAME_KEYS[trimmed];
    if (manualTrimmed) {
      recordNameKey(canonical, manualTrimmed);
      return manualTrimmed;
    }
  }

  if (/u$/i.test(name)) {
    const baseName = name.slice(0, -1);
    const fallback = `El-${baseName}`;
    recordNameKey(canonical, fallback);
    return fallback;
  }

  return name;
}

function resolveNameMeaning(name, canonicalOverride, encountered) {
  if (!name) {
    return null;
  }
  const canonical = canonicalOverride || canonicalizeName(name);
  if (!canonical) {
    return null;
  }

  if (encountered && SINGLE_TOOLTIP_NAMES.has(canonical) && encountered.get(canonical)) {
    return null;
  }

  const direct = state.nameLookup.get(canonical);
  if (direct) {
    if (encountered && SINGLE_TOOLTIP_NAMES.has(canonical)) {
      encountered.set(canonical, true);
    }
    return direct;
  }

  const trimmed = canonical.replace(/(u|a|i|e)$/i, '');
  if (trimmed) {
    const trimmedMeaning = state.nameLookup.get(trimmed);
    if (trimmedMeaning) {
      if (encountered && SINGLE_TOOLTIP_NAMES.has(trimmed)) {
        encountered.set(trimmed, true);
      }
      return trimmedMeaning;
    }
    const manual = MANUAL_NAME_MEANINGS[trimmed];
    if (manual) {
      state.nameLookup.set(trimmed, manual);
      if (encountered && SINGLE_TOOLTIP_NAMES.has(trimmed)) {
        encountered.set(trimmed, true);
      }
      return manual;
    }
  }

  const manualDirect = MANUAL_NAME_MEANINGS[canonical];
  if (manualDirect) {
    state.nameLookup.set(canonical, manualDirect);
    if (encountered && SINGLE_TOOLTIP_NAMES.has(canonical)) {
      encountered.set(canonical, true);
    }
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
  const lookupKey = button.dataset.lookupKey || name;
  tooltip.innerHTML = `<strong>${lookupKey}</strong><p>${meaning}</p>`;
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

function initDuaSourceSelector() {
  const select = document.querySelector('#dua-source');
  if (!select) {
    return;
  }

  const options = DUA_SOURCE_ORDER.filter((id) => DUA_SOURCES[id]);
  select.innerHTML = '';
  options.forEach((id) => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = DUA_SOURCES[id]?.label || id;
    select.append(option);
  });

  const resolved = resolveDuaSourceId(state.duaSource);
  state.duaSource = resolved;
  select.value = resolved;
  select.disabled = false;

  select.addEventListener('change', async (event) => {
    const nextSource = event.target.value;
    await changeDuaSource(nextSource);
  });

  state.duaSourceSelect = select;
  updateSettingsDuaControls();
}

function initCompletionStatsView() {
  const resetButton = document.querySelector('[data-reset-stats]');
  if (!resetButton) {
    return;
  }
  resetButton.addEventListener('click', () => {
    const confirmed = window.confirm('Tüm tesbihat istatistiklerini sıfırlamak istediğinize emin misiniz?');
    if (!confirmed) {
      return;
    }
    resetCompletionData();
    window.alert('Tesbihat istatistikleri sıfırlandı.');
  });
}

function initDuaArabicToggle() {
  const toggle = document.querySelector('[data-toggle-dua-arabic]');
  if (!toggle) {
    return;
  }

  toggle.addEventListener('click', () => {
    setShowArabicDuas(!state.showArabicDuas);
  });

  updateDuaArabicToggleUI(toggle);
}

function updateDuaArabicToggleUI(element) {
  const toggle = element || document.querySelector('[data-toggle-dua-arabic]');
  if (!toggle) {
    return;
  }

  const show = Boolean(state.showArabicDuas);
  toggle.textContent = show ? 'Arapça metinleri gizle' : 'Arapça metinleri göster';
  toggle.setAttribute('aria-pressed', show ? 'true' : 'false');

  if (show) {
    toggle.classList.remove('secondary');
  } else if (!toggle.classList.contains('secondary')) {
    toggle.classList.add('secondary');
  }
  toggle.classList.toggle('is-active', show);
}

function setShowArabicDuas(nextValue, { persist = true, refresh = true } = {}) {
  const show = Boolean(nextValue);
  if (show === state.showArabicDuas) {
    return;
  }

  state.showArabicDuas = show;

  if (persist) {
    try {
      localStorage.setItem(DUA_ARABIC_STORAGE_KEY, show ? '1' : '0');
    } catch (error) {
      console.warn('Arapça dua tercihi kaydedilemedi.', error);
    }
  }

  updateDuaArabicToggleUI();
  updateDuaArabicVisibility();

  if (refresh) {
    refreshDuaUI();
  }
}

function updateDuaArabicVisibility() {
  const card = state.duaUI?.card;
  if (!card) {
    return;
  }
  card.dataset.showArabic = state.showArabicDuas ? 'true' : 'false';
}

function initPersonalDuaSettings() {
  const toggleButton = document.querySelector('[data-toggle-personal-dua]');
  const editButton = document.querySelector('[data-edit-personal-dua]');
  const editor = document.querySelector('[data-personal-dua-editor]');
  const textarea = document.querySelector('[data-personal-dua-text]');
  const saveButton = document.querySelector('[data-save-personal-dua]');
  const cancelButton = document.querySelector('[data-cancel-personal-dua]');

  if (!toggleButton || !textarea || !saveButton || !cancelButton || !editButton || !editor) {
    return;
  }

  toggleButton.addEventListener('click', () => {
    setPersonalDuaEnabled(!state.personalDuaEnabled);
  });

  editButton.addEventListener('click', () => {
    if (!state.personalDuaEnabled) {
      window.alert('Önce kişisel duayı etkinleştirin.');
      return;
    }
    editor.hidden = false;
    textarea.value = state.personalDuaText;
    textarea.focus();
  });

  saveButton.addEventListener('click', () => {
    savePersonalDuaText(textarea.value);
    editor.hidden = true;
    state.personalDuaEditing = false;
    refreshDuaUI();
  });

  cancelButton.addEventListener('click', () => {
    editor.hidden = true;
    textarea.value = state.personalDuaText;
  });

  updatePersonalDuaSettingsUI();
}

function updatePersonalDuaSettingsUI() {
  const toggleButton = document.querySelector('[data-toggle-personal-dua]');
  const editButton = document.querySelector('[data-edit-personal-dua]');
  const editor = document.querySelector('[data-personal-dua-editor]');
  const textarea = document.querySelector('[data-personal-dua-text]');

  if (!toggleButton || !editButton || !editor || !textarea) {
    return;
  }

  const enabled = Boolean(state.personalDuaEnabled);
  toggleButton.textContent = enabled ? 'Kişisel duayı gizle' : 'Kişisel duayı göster';
  toggleButton.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  toggleButton.classList.toggle('is-active', enabled);
  toggleButton.classList.toggle('secondary', !enabled);

  editButton.hidden = !enabled;
  if (!enabled) {
    editor.hidden = true;
  }

  if (!editor.hidden) {
    textarea.value = state.personalDuaText;
  }
}

function setPersonalDuaEnabled(nextValue, { persist = true, refresh = true } = {}) {
  const enabled = Boolean(nextValue);
  if (enabled === state.personalDuaEnabled) {
    return;
  }

  state.personalDuaEnabled = enabled;
  if (enabled) {
    state.duaMode = 'personal';
  } else {
    state.duaMode = 'predefined';
  }
  state.personalDuaEditing = false;

  if (persist) {
    try {
      localStorage.setItem(PERSONAL_DUA_ENABLED_STORAGE_KEY, enabled ? '1' : '0');
    } catch (error) {
      console.warn('Kişisel dua tercihi kaydedilemedi.', error);
    }
  }

  updatePersonalDuaSettingsUI();
  updateDuaModeToggleUI();

  if (refresh) {
    refreshDuaUI();
  }
}

function savePersonalDuaText(text, { persist = true } = {}) {
  const normalised = typeof text === 'string' ? text.replace(/\r\n/g, '\n') : '';
  state.personalDuaText = normalised;

  if (persist) {
    try {
      localStorage.setItem(PERSONAL_DUA_TEXT_STORAGE_KEY, normalised);
    } catch (error) {
      console.warn('Kişisel dua metni kaydedilemedi.', error);
    }
  }

  updatePersonalDuaSettingsUI();
}

async function changeDuaSource(nextSource, { persist = true, refresh = true } = {}) {
  const resolved = resolveDuaSourceId(nextSource);
  if (persist) {
    try {
      localStorage.setItem(DUA_SOURCE_STORAGE_KEY, resolved);
    } catch (error) {
      console.warn('Dua kaynağı tercihi saklanamadı.', error);
    }
  }

  state.duaSource = resolved;

  if (refresh) {
    refreshDuaUI();
  }

  const duas = await loadDuaSourceData(resolved);
  state.duas = duas;
  state.duaState = ensureDuaState(duas.length, resolved);

  if (refresh) {
    refreshDuaUI();
    updateSettingsDuaControls();
  }
}

async function changeLanguage(nextLanguage, { persist = true } = {}) {
  const resolved = resolveLanguage(nextLanguage);
  if (resolved === state.language) {
    updateLanguageToggleUI(resolved);
    return;
  }

  state.language = resolved;
  if (persist) {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, resolved);
    } catch (error) {
      console.warn('Dil tercihi kaydedilemedi.', error);
    }
  }

  updateLanguageToggleUI(resolved);
  updateContentToolbarLanguageUI();
  if (state.appRoot) {
    state.appRoot.dataset.appLanguage = resolved;
  }
  document.documentElement.setAttribute('lang', resolved === 'ar' ? 'ar' : 'tr');

  if (state.currentPrayer) {
    await loadPrayerContent(state.currentPrayer);
  }
}

function updateSettingsDuaControls() {
  const sourceId = resolveDuaSourceId(state.duaSource);
  const label = DUA_SOURCES[sourceId]?.label || 'Seçili dua kaynağı';

  if (state.duaSourceSelect) {
    state.duaSourceSelect.value = sourceId;
  }

  if (state.duaResetButton) {
    state.duaResetButton.textContent = `${label} ilerlemesini sıfırla`;
  }
}

function attachSettingsActions() {
  const resetButton = document.querySelector('[data-reset-dua]');
  const favoritesResetButton = document.querySelector('[data-reset-dua-favorites]');
  if (resetButton) {
    state.duaResetButton = resetButton;
    updateSettingsDuaControls();

    resetButton.addEventListener('click', async () => {
      if (resetButton.disabled) {
        return;
      }

      const label = DUA_SOURCES[state.duaSource]?.label || 'seçili dua kaynağı';
      const confirmed = window.confirm(`${label} okuma ilerlemesini sıfırlamak istiyor musunuz?`);
      if (!confirmed) {
        return;
      }

      resetButton.disabled = true;
      try {
        const duas = await loadDuaSourceData(state.duaSource);
        state.duas = duas;
        const nextState = resetDuaState(duas.length, state.duaSource, 0);
        if (nextState.remaining.length > 0) {
          nextState.current = pickRandomFrom(nextState.remaining);
          saveDuaState();
        } else {
          saveDuaState();
        }
        refreshDuaUI();
      } catch (error) {
        console.error('Dua ilerlemesi sıfırlanamadı.', error);
      } finally {
        resetButton.disabled = false;
      }
    });
  }

  if (favoritesResetButton) {
    favoritesResetButton.addEventListener('click', () => {
      if (!state.duaFavoritesList.length) {
        window.alert('Kaydedilen dua bulunmuyor.');
        return;
      }
      const confirmed = window.confirm('Kaydedilen duaları temizlemek istediğinize emin misiniz?');
      if (!confirmed) {
        return;
      }
      clearDuaFavorites();
      window.alert('Kaydedilen dualar temizlendi.');
      refreshDuaUI();
    });
  }

  attachUcAylarTransferControls();
}

function attachUcAylarTransferControls() {
  const exportButton = document.querySelector('[data-ucaylar-export]');
  const importTrigger = document.querySelector('[data-ucaylar-import-trigger]');
  const importFile = document.querySelector('[data-ucaylar-import-file]');
  const status = document.querySelector('[data-ucaylar-transfer-status]');

  const setStatus = (message) => {
    if (!status) {
      return;
    }
    if (!message) {
      status.hidden = true;
      status.textContent = '';
      return;
    }
    status.hidden = false;
    status.textContent = message;
  };

  const downloadJson = (filename, payload) => {
    try {
      const content = JSON.stringify(payload, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.warn('Dosya indirilemedi.', error);
      setStatus('Dosya indirilemedi. Lütfen tekrar deneyin.');
    }
  };

  const formatDateForFilename = (dateKey) => {
    if (!isValidDateKey(dateKey)) {
      return '';
    }
    return dateKey.split('-').join('');
  };

  if (exportButton) {
    exportButton.addEventListener('click', () => {
      const payload = loadUcAylarData();
      const todayKey = getTodayKey();
      const suffix = formatDateForFilename(todayKey) || 'backup';
      downloadJson(`tesbihat-ucaylar-backup-${suffix}.json`, payload);
      setStatus('Üç Aylar verisi indirildi.');
      window.setTimeout(() => setStatus(''), 2500);
    });
  }

  const refreshUcAylarIfActive = () => {
    if (state.currentPrayer !== 'ucaylar') {
      return;
    }
    const content = document.getElementById('content');
    if (!content) {
      return;
    }
    const monthKey = state.ucaylar && state.ucaylar.activeMonthKey ? state.ucaylar.activeMonthKey : null;
    const tab = state.ucaylar && state.ucaylar.activeMonthTab ? state.ucaylar.activeMonthTab : null;
    if (monthKey) {
      renderUcAylarMonthView(content, monthKey, { parentPrayerId: 'ucaylar', parentConfig: PRAYER_CONFIG.ucaylar, initialTab: tab === 'tracker' ? 'tracker' : 'content' });
      return;
    }
    renderPrayerCollection(content, 'ucaylar', PRAYER_CONFIG.ucaylar);
  };

  const handleImportFile = async (file) => {
    if (!file) {
      return;
    }
    setStatus('');

    try {
      let text = '';
      if (typeof file.text === 'function') {
        text = await file.text();
      } else {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(reader.error || new Error('Dosya okunamadı.'));
          reader.readAsText(file);
        });
      }
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Geçersiz JSON.');
      }
      if (typeof parsed.trackers !== 'object' || parsed.trackers === null) {
        throw new Error('Geçersiz veri: trackers bulunamadı.');
      }
      const migrated = migrateUcAylarData(parsed, { source: 'import' });
      state.ucaylar.data = migrated;
      saveUcAylarData(migrated);
      setStatus('Üç Aylar verisi içe aktarıldı.');
      refreshUcAylarIfActive();
      window.setTimeout(() => setStatus(''), 3500);
    } catch (error) {
      console.warn('Üç Aylar verisi içe aktarılamadı.', error);
      setStatus('İçe aktarma başarısız. Dosya biçimini kontrol edin.');
    }
  };

  if (importTrigger && importFile) {
    importTrigger.addEventListener('click', () => {
      setStatus('');
      importFile.value = '';
      importFile.click();
    });

    importFile.addEventListener('change', () => {
      const file = importFile.files && importFile.files[0] ? importFile.files[0] : null;
      handleImportFile(file);
    });
  }
}

function loadSelectedDuaSource() {
  const stored = localStorage.getItem(DUA_SOURCE_STORAGE_KEY);
  return resolveDuaSourceId(stored);
}

function loadDuaArabicPreference() {
  const stored = localStorage.getItem(DUA_ARABIC_STORAGE_KEY);
  if (stored === '0' || stored === 'false') {
    return false;
  }
  if (stored === '1' || stored === 'true') {
    return true;
  }
  return DEFAULT_SHOW_ARABIC_DUAS;
}

function createEmptyDuaFavorites() {
  return {
    version: DUA_FAVORITES_VERSION,
    items: {},
    order: [],
  };
}

function loadDuaFavorites() {
  try {
    const raw = localStorage.getItem(DUA_FAVORITES_STORAGE_KEY);
    if (!raw) {
      return createEmptyDuaFavorites();
    }
    const parsed = JSON.parse(raw);
    return normaliseDuaFavorites(parsed);
  } catch (error) {
    console.warn('Kaydedilen dualar yüklenemedi, varsayılan değerler kullanılacak.', error);
    return createEmptyDuaFavorites();
  }
}

function normaliseDuaFavorites(candidate) {
  const normalized = createEmptyDuaFavorites();
  if (!candidate || typeof candidate !== 'object') {
    return normalized;
  }

  const items = typeof candidate.items === 'object' && candidate.items !== null ? candidate.items : {};
  const order = Array.isArray(candidate.order) ? candidate.order : [];

  normalized.items = {};
  Object.entries(items).forEach(([sourceId, list]) => {
    if (!sourceId || !Array.isArray(list)) {
      return;
    }
    const deduped = Array.from(new Set(list.filter((value) => Number.isInteger(value) && value >= 0))).sort((a, b) => a - b);
    if (deduped.length > 0) {
      normalized.items[sourceId] = deduped;
    }
  });

  normalized.order = order
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({ sourceId: entry.sourceId, index: entry.index }))
    .filter((entry) => entry.sourceId && Number.isInteger(entry.index) && entry.index >= 0);

  normalized.version = DUA_FAVORITES_VERSION;
  return normalized;
}

function saveDuaFavorites() {
  try {
    localStorage.setItem(DUA_FAVORITES_STORAGE_KEY, JSON.stringify(state.duaFavorites));
  } catch (error) {
    console.warn('Kaydedilen dualar saklanamadı.', error);
  }
}

function rebuildDuaFavoritesState() {
  const previousEntry = state.duaFavoritesList && state.duaFavoritesList.length > 0
    ? state.duaFavoritesList[Math.min(state.duaFavoritesIndex, state.duaFavoritesList.length - 1)]
    : null;

  if (!state.duaFavorites || typeof state.duaFavorites !== 'object') {
    state.duaFavorites = createEmptyDuaFavorites();
  }

  state.duaFavorites = normaliseDuaFavorites(state.duaFavorites);

  const lookup = new Set();
  const list = [];

  state.duaFavorites.order.forEach((entry) => {
    if (!entry) {
      return;
    }
    const { sourceId, index } = entry;
    const key = buildDuaFavoriteKey(sourceId, index);
    if (!lookup.has(key) && state.duaFavorites.items[sourceId] && state.duaFavorites.items[sourceId].includes(index)) {
      lookup.add(key);
      list.push({ sourceId, index });
    }
  });

  Object.entries(state.duaFavorites.items).forEach(([sourceId, indices]) => {
    indices.forEach((index) => {
      const key = buildDuaFavoriteKey(sourceId, index);
      if (!lookup.has(key)) {
        lookup.add(key);
        list.push({ sourceId, index });
      }
    });
  });

  state.duaFavorites.order = list.map(({ sourceId, index }) => ({ sourceId, index }));
  state.duaFavoritesLookup = lookup;
  state.duaFavoritesList = list;

  if (!list.length) {
    state.duaFavoritesIndex = 0;
    return;
  }

  if (previousEntry) {
    const preservedIndex = list.findIndex((entry) => entry.sourceId === previousEntry.sourceId && entry.index === previousEntry.index);
    if (preservedIndex !== -1) {
      state.duaFavoritesIndex = preservedIndex;
      return;
    }
  }

  if (state.duaFavoritesIndex >= list.length) {
    state.duaFavoritesIndex = 0;
  }
}

function buildDuaFavoriteKey(sourceId, index) {
  return `${sourceId}:${index}`;
}

function isDuaFavorite(sourceId, index) {
  if (!sourceId || !Number.isInteger(index) || index < 0) {
    return false;
  }
  const key = buildDuaFavoriteKey(sourceId, index);
  return state.duaFavoritesLookup.has(key);
}

function toggleDuaFavorite(sourceId, index) {
  if (!sourceId || !Number.isInteger(index) || index < 0) {
    return;
  }

  if (!state.duaFavorites || typeof state.duaFavorites !== 'object') {
    state.duaFavorites = createEmptyDuaFavorites();
  }

  const key = buildDuaFavoriteKey(sourceId, index);
  const items = state.duaFavorites.items;
  const currentList = Array.isArray(items[sourceId]) ? items[sourceId] : [];
  const existingIndex = currentList.indexOf(index);
  let targetKey = null;

  if (existingIndex !== -1) {
    currentList.splice(existingIndex, 1);
    if (currentList.length) {
      items[sourceId] = currentList;
    } else {
      delete items[sourceId];
    }
    state.duaFavorites.order = state.duaFavorites.order.filter((entry) => buildDuaFavoriteKey(entry.sourceId, entry.index) !== key);
  } else {
    if (!items[sourceId]) {
      items[sourceId] = [];
    }
    items[sourceId].push(index);
    items[sourceId] = Array.from(new Set(items[sourceId].filter((value) => Number.isInteger(value) && value >= 0))).sort((a, b) => a - b);
    state.duaFavorites.order.push({ sourceId, index });
    targetKey = key;
  }

  state.duaFavorites.version = DUA_FAVORITES_VERSION;
  rebuildDuaFavoritesState();
  if (targetKey) {
    const newIndex = state.duaFavoritesList.findIndex((entry) => buildDuaFavoriteKey(entry.sourceId, entry.index) === targetKey);
    if (newIndex !== -1) {
      state.duaFavoritesIndex = newIndex;
    }
  }
  saveDuaFavorites();
  const ui = state.duaUI;
  if (ui) {
    updateDuaModeToggleUI();
    updateFavoriteToggleUI();
  }
}

function clearDuaFavorites() {
  state.duaFavorites = createEmptyDuaFavorites();
  rebuildDuaFavoritesState();
  saveDuaFavorites();
  if (state.duaMode === 'saved') {
    state.duaMode = 'predefined';
  }
  updateDuaModeToggleUI();
  updateFavoriteToggleUI();
}

function loadTranslationVisibility() {
  try {
    const stored = localStorage.getItem(TRANSLATION_VISIBILITY_STORAGE_KEY);
    if (stored === '1' || stored === 'true') {
      return true;
    }
    if (stored === '0' || stored === 'false') {
      return false;
    }
  } catch (error) {
    console.warn('Tercüme görünürlüğü tercihleri okunamadı.', error);
  }
  return DEFAULT_SHOW_TRANSLATIONS;
}

function loadLanguageSelection() {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return resolveLanguage(stored);
}

function resolveLanguage(candidate) {
  if (candidate && LANGUAGE_OPTIONS.includes(candidate)) {
    return candidate;
  }
  return DEFAULT_LANGUAGE;
}

function resolveDuaSourceId(candidate) {
  if (candidate && DUA_SOURCES[candidate]) {
    return candidate;
  }
  const fallback = DUA_SOURCE_ORDER.find((id) => DUA_SOURCES[id]);
  if (fallback) {
    return fallback;
  }
  const firstKey = Object.keys(DUA_SOURCES)[0];
  return firstKey || 'birkirikdilekce';
}

function loadCevsenVisibility() {
  try {
    const stored = localStorage.getItem(CEVSEN_VISIBILITY_STORAGE_KEY);
    if (!stored) {
      return normaliseCevsenVisibility(CEVSEN_VISIBILITY_DEFAULT);
    }
    const parsed = JSON.parse(stored);
    return normaliseCevsenVisibility(parsed);
  } catch (error) {
    console.warn('Cevşen görünürlük tercihleri yüklenemedi, varsayılana dönüldü.', error);
    return normaliseCevsenVisibility(CEVSEN_VISIBILITY_DEFAULT);
  }
}

function saveCevsenVisibility(visibility) {
  try {
    const normalised = normaliseCevsenVisibility(visibility);
    localStorage.setItem(CEVSEN_VISIBILITY_STORAGE_KEY, JSON.stringify(normalised));
  } catch (error) {
    console.warn('Cevşen görünürlük tercihleri kaydedilemedi.', error);
  }
}

function loadHomeStatsCollapsed() {
  try {
    const stored = localStorage.getItem(HOME_STATS_COLLAPSED_STORAGE_KEY);
    if (stored === '1') {
      return true;
    }
    if (stored === '0') {
      return false;
    }
  } catch (error) {
    console.warn('Anasayfa istatistik tercihleri okunamadı.', error);
  }
  return false;
}

function saveHomeStatsCollapsed(collapsed) {
  try {
    localStorage.setItem(HOME_STATS_COLLAPSED_STORAGE_KEY, collapsed ? '1' : '0');
  } catch (error) {
    console.warn('Anasayfa istatistik tercihleri kaydedilemedi.', error);
  }
}

function saveTranslationVisibility(visible) {
  try {
    localStorage.setItem(TRANSLATION_VISIBILITY_STORAGE_KEY, visible ? '1' : '0');
  } catch (error) {
    console.warn('Tercüme görünürlüğü kaydedilemedi.', error);
  }
}

function loadPersonalDuaEnabled() {
  try {
    const stored = localStorage.getItem(PERSONAL_DUA_ENABLED_STORAGE_KEY);
    if (stored === '1' || stored === 'true') {
      return true;
    }
    if (stored === '0' || stored === 'false') {
      return false;
    }
  } catch (error) {
    console.warn('Kişisel dua tercihi okunamadı.', error);
  }
  return false;
}

function loadPersonalDuaText() {
  try {
    const stored = localStorage.getItem(PERSONAL_DUA_TEXT_STORAGE_KEY);
    if (typeof stored === 'string') {
      return stored;
    }
  } catch (error) {
    console.warn('Kişisel dua metni okunamadı.', error);
  }
  return '';
}

function loadCevsenFontScale() {
  try {
    const stored = localStorage.getItem(CEVSEN_FONT_SCALE_STORAGE_KEY);
    if (!stored) {
      return normaliseCevsenFontScale(CEVSEN_FONT_SCALE_DEFAULT);
    }
    const parsed = JSON.parse(stored);
    return normaliseCevsenFontScale(parsed);
  } catch (error) {
    console.warn('Cevşen yazı boyutu tercihleri yüklenemedi, varsayılana dönüldü.', error);
    return normaliseCevsenFontScale(CEVSEN_FONT_SCALE_DEFAULT);
  }
}

function saveCevsenFontScale(scale) {
  try {
    const normalised = normaliseCevsenFontScale(scale);
    localStorage.setItem(CEVSEN_FONT_SCALE_STORAGE_KEY, JSON.stringify(normalised));
  } catch (error) {
    console.warn('Cevşen yazı boyutu tercihleri kaydedilemedi.', error);
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
