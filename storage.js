(() => {
  const STORAGE_PREFIX = 'tesbihat:';
  const EXCLUDE_PREFIX = 'tesbihat:sync:';
  const EXTRA_KEYS = new Set(['sharedDisplayName']);
  const META_KEYS = new Set(['syncLinkedUid', 'syncLinkedAt', 'tesbihat:clientId']);
  const LOCAL_UPDATED_AT_KEY = 'tesbihat:sync:local-updated-at';

  const listeners = new Set();
  let suppressCount = 0;
  let patched = false;
  let rawSetItem = null;
  let rawRemoveItem = null;
  let rawClear = null;

  const getStorage = () => {
    try {
      return window.localStorage;
    } catch (_error) {
      return null;
    }
  };

  const storage = getStorage();

  const isSyncKey = (key) => {
    if (!key || typeof key !== 'string') {
      return false;
    }
    if (META_KEYS.has(key)) {
      return false;
    }
    if (key.startsWith(EXCLUDE_PREFIX)) {
      return false;
    }
    return key.startsWith(STORAGE_PREFIX) || EXTRA_KEYS.has(key);
  };

  const parseStoredValue = (raw) => {
    if (raw === null || raw === undefined) {
      return null;
    }
    if (typeof raw !== 'string') {
      return raw;
    }
    try {
      return JSON.parse(raw);
    } catch (_error) {
      return raw;
    }
  };

  const serializeValue = (value) => {
    if (value === undefined) {
      return null;
    }
    if (typeof value === 'string') {
      return value;
    }
    try {
      return JSON.stringify(value);
    } catch (_error) {
      return null;
    }
  };

  const listSyncKeys = () => {
    if (!storage) {
      return [];
    }
    const keys = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (isSyncKey(key)) {
        keys.push(key);
      }
    }
    return keys;
  };

  const buildLocalPayload = () => {
    const payload = {};
    if (!storage) {
      return payload;
    }
    const keys = listSyncKeys();
    keys.forEach((key) => {
      const raw = storage.getItem(key);
      const parsed = parseStoredValue(raw);
      if (parsed !== null) {
        payload[key] = parsed;
      }
    });
    return payload;
  };

  const hasLocalPayload = (payload) => {
    const data = payload && typeof payload === 'object' ? payload : buildLocalPayload();
    return Object.keys(data).length > 0;
  };

  const setItemRaw = (key, value) => {
    if (!storage || !rawSetItem) {
      return;
    }
    rawSetItem(key, value);
  };

  const removeItemRaw = (key) => {
    if (!storage || !rawRemoveItem) {
      return;
    }
    rawRemoveItem(key);
  };

  const getLocalUpdatedAt = () => {
    if (!storage) {
      return 0;
    }
    const raw = storage.getItem(LOCAL_UPDATED_AT_KEY);
    if (!raw) {
      return 0;
    }
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const setLocalUpdatedAt = (timestamp) => {
    if (!storage) {
      return;
    }
    const value = Number.isFinite(timestamp) ? String(Math.floor(timestamp)) : '0';
    setItemRaw(LOCAL_UPDATED_AT_KEY, value);
  };

  const withSuppressedLocalChanges = (fn) => {
    suppressCount += 1;
    try {
      fn();
    } finally {
      suppressCount = Math.max(0, suppressCount - 1);
    }
  };

  const notifyLocalChange = (key) => {
    if (suppressCount > 0) {
      return;
    }
    if (key && !isSyncKey(key)) {
      return;
    }
    setLocalUpdatedAt(Date.now());
    listeners.forEach((handler) => {
      try {
        handler(key);
      } catch (error) {
        console.warn('Sync local change listener failed.', error);
      }
    });
  };

  const applyLocalPayload = (payload) => {
    if (!storage) {
      return;
    }
    const entries = payload && typeof payload === 'object' ? payload : {};
    withSuppressedLocalChanges(() => {
      const existingKeys = listSyncKeys();
      existingKeys.forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(entries, key)) {
          storage.removeItem(key);
        }
      });

      Object.keys(entries).forEach((key) => {
        if (!isSyncKey(key)) {
          return;
        }
        const value = entries[key];
        if (value === undefined) {
          storage.removeItem(key);
          return;
        }
        const serialized = serializeValue(value);
        if (serialized === null) {
          storage.removeItem(key);
          return;
        }
        storage.setItem(key, serialized);
      });
    });
  };

  const setLinkedUid = (uid) => {
    if (!storage) {
      return;
    }
    storage.setItem('syncLinkedUid', uid || '');
    storage.setItem('syncLinkedAt', String(Date.now()));
  };

  const getLinkedUid = () => {
    if (!storage) {
      return '';
    }
    const value = storage.getItem('syncLinkedUid');
    return value || '';
  };

  const getLinkedAt = () => {
    if (!storage) {
      return 0;
    }
    const raw = storage.getItem('syncLinkedAt');
    if (!raw) {
      return 0;
    }
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const onLocalChange = (handler) => {
    if (typeof handler !== 'function') {
      return () => {};
    }
    listeners.add(handler);
    return () => listeners.delete(handler);
  };

  const patchStorage = () => {
    if (!storage || patched) {
      return;
    }
    rawSetItem = storage.setItem.bind(storage);
    rawRemoveItem = storage.removeItem.bind(storage);
    rawClear = storage.clear.bind(storage);

    storage.setItem = (key, value) => {
      rawSetItem(key, value);
      notifyLocalChange(key);
    };

    storage.removeItem = (key) => {
      rawRemoveItem(key);
      notifyLocalChange(key);
    };

    storage.clear = () => {
      const hadSyncKeys = listSyncKeys().length > 0;
      rawClear();
      if (hadSyncKeys) {
        notifyLocalChange(null);
      }
    };

    patched = true;
  };

  patchStorage();

  window.SyncStorage = {
    isSyncKey,
    buildLocalPayload,
    hasLocalPayload,
    applyLocalPayload,
    getLocalUpdatedAt,
    setLocalUpdatedAt,
    setLinkedUid,
    getLinkedUid,
    getLinkedAt,
    onLocalChange,
    withSuppressedLocalChanges,
  };
})();
