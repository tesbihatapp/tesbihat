(() => {
  const FIREBASE_SDK_VERSION = '10.12.0';
  const SCHEMA_VERSION = 1;
  const SYNC_DEBOUNCE_MS = 1000;
  const CLIENT_ID_STORAGE_KEY = 'tesbihat:clientId';
  const DEBUG_SYNC = Boolean(window.DEBUG_SYNC);

  const syncState = {
    user: null,
    db: null,
    fs: null,
    docRef: null,
    started: false,
    ready: false,
    initializing: false,
    cloudExists: false,
    unsubscribe: null,
    pushTimer: null,
    isApplyingRemote: false,
    localChangeEnabled: false,
    hasHydrated: false,
    clientId: null,
    lastUploadMs: 0,
    lastUploadPayloadString: '',
    ui: null,
  };

  const logSync = (message) => {
    if (DEBUG_SYNC && typeof console !== 'undefined') {
      console.info(message);
    }
  };

  const getSyncModules = () => {
    if (!window.SyncAuth || !window.SyncStorage) {
      return null;
    }
    return { auth: window.SyncAuth, storage: window.SyncStorage };
  };

  const ensureFirestore = async () => {
    const modules = getSyncModules();
    if (!modules) {
      throw new Error('Sync modules could not be loaded.');
    }
    const { app } = await modules.auth.ensureAuth();
    const firestoreModule = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`);
    const db = firestoreModule.getFirestore(app);
    return { db, fs: firestoreModule };
  };

  const toMillis = (value) => {
    if (!value) {
      return 0;
    }
    if (typeof value.toMillis === 'function') {
      return value.toMillis();
    }
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === 'number') {
      return value;
    }
    return 0;
  };

  const getClientId = () => {
    try {
      const stored = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY);
      if (stored) {
        return stored;
      }
      const generated = (window.crypto && typeof window.crypto.randomUUID === 'function')
        ? window.crypto.randomUUID()
        : `client_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, generated);
      return generated;
    } catch (_error) {
      return `client_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    }
  };

  const sortForStringify = (value) => {
    if (Array.isArray(value)) {
      return value.map(sortForStringify);
    }
    if (value && typeof value === 'object') {
      const sorted = {};
      Object.keys(value).sort().forEach((key) => {
        sorted[key] = sortForStringify(value[key]);
      });
      return sorted;
    }
    return value;
  };

  const stableStringify = (value) => {
    try {
      return JSON.stringify(sortForStringify(value));
    } catch (_error) {
      return '';
    }
  };

  const buildDocRef = (uid) => {
    const env = window.__ENV__ || 'prod';
    const path = `users/${uid}/appData/${env}`;
    return syncState.fs.doc(syncState.db, path);
  };

  const setStatus = (message, status = 'info') => {
    const ui = syncState.ui;
    if (!ui || !ui.status) {
      return;
    }
    if (!message) {
      ui.status.hidden = true;
      ui.status.textContent = '';
      ui.status.dataset.status = '';
      return;
    }
    ui.status.hidden = false;
    ui.status.textContent = message;
    ui.status.dataset.status = status;
  };

  const setUserLabel = (user) => {
    const ui = syncState.ui;
    if (!ui || !ui.userLabel) {
      return;
    }
    if (!user) {
      ui.userLabel.hidden = true;
      ui.userLabel.textContent = '';
      return;
    }
    const email = user.email || user.displayName || user.uid;
    ui.userLabel.hidden = false;
    ui.userLabel.textContent = `Signed in as: ${email}`;
  };

  const showSyncModal = ({ title, message, actions }) => new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'sync-modal-overlay';
    overlay.innerHTML = `
      <div class="sync-modal card" role="dialog" aria-modal="true" aria-labelledby="sync-modal-title">
        <header class="sync-modal__header">
          <h2 id="sync-modal-title">${title}</h2>
        </header>
        <div class="sync-modal__body">
          <p>${message}</p>
        </div>
        <div class="sync-modal__actions"></div>
      </div>
    `;

    const actionsContainer = overlay.querySelector('.sync-modal__actions');
    const cleanup = (value) => {
      overlay.remove();
      document.body.classList.remove('sync-modal-open');
      resolve(value);
    };

    actions.forEach((action) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'settings-action-button';
      if (action.tone === 'secondary') {
        button.classList.add('secondary');
      }
      button.textContent = action.label;
      button.addEventListener('click', () => cleanup(action.id));
      actionsContainer.appendChild(button);
    });

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        // Force an explicit choice to avoid accidental dismissal.
        event.preventDefault();
      }
    });

    document.body.appendChild(overlay);
    document.body.classList.add('sync-modal-open');
    const firstButton = actionsContainer.querySelector('button');
    if (firstButton) {
      firstButton.focus();
    }
  });

  const migratePayload = (payload, fromVersion) => {
    const startingVersion = Number.isFinite(fromVersion) ? fromVersion : 1;
    let nextPayload = payload && typeof payload === 'object' ? payload : {};
    let version = startingVersion;

    while (version < SCHEMA_VERSION) {
      // Add migration steps here when schemaVersion changes.
      version += 1;
    }

    return { payload: nextPayload, version };
  };

  const resolveStableId = (item) => {
    if (!item || typeof item !== 'object') {
      return null;
    }
    if (item.id !== undefined && item.id !== null) {
      return String(item.id);
    }
    if (item.key !== undefined && item.key !== null) {
      return String(item.key);
    }
    return null;
  };

  const mergeArrays = (cloud, local) => {
    const cloudIds = cloud.map(resolveStableId);
    const localIds = local.map(resolveStableId);
    const hasStableIds = cloudIds.every((id) => id) && localIds.every((id) => id);
    if (!hasStableIds) {
      return cloud;
    }
    const merged = [];
    const seen = new Set();
    cloud.forEach((item, index) => {
      const id = cloudIds[index];
      if (id && !seen.has(id)) {
        seen.add(id);
        merged.push(item);
      }
    });
    local.forEach((item, index) => {
      const id = localIds[index];
      if (id && !seen.has(id)) {
        seen.add(id);
        merged.push(item);
      }
    });
    return merged;
  };

  const mergeValues = (cloudValue, localValue) => {
    if (Array.isArray(cloudValue) && Array.isArray(localValue)) {
      return mergeArrays(cloudValue, localValue);
    }

    if (typeof cloudValue === 'number' && typeof localValue === 'number') {
      return Math.max(cloudValue, localValue);
    }

    if (
      cloudValue && localValue
      && typeof cloudValue === 'object'
      && typeof localValue === 'object'
      && !Array.isArray(cloudValue)
      && !Array.isArray(localValue)
    ) {
      const merged = { ...cloudValue };
      Object.keys(localValue).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(cloudValue, key)) {
          merged[key] = mergeValues(cloudValue[key], localValue[key]);
        } else {
          merged[key] = localValue[key];
        }
      });
      return merged;
    }

    return localValue;
  };

  const mergePayloads = (cloudPayload, localPayload) => {
    const cloudData = cloudPayload && typeof cloudPayload === 'object' ? cloudPayload : {};
    const localData = localPayload && typeof localPayload === 'object' ? localPayload : {};
    const merged = { ...cloudData };

    Object.keys(localData).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(cloudData, key)) {
        merged[key] = mergeValues(cloudData[key], localData[key]);
      } else {
        merged[key] = localData[key];
      }
    });

    return merged;
  };

  const applyCloudToLocal = (payload, updatedAt) => {
    const modules = getSyncModules();
    if (!modules) {
      return;
    }
    const { storage } = modules;
    syncState.isApplyingRemote = true;
    try {
      storage.withSuppressedLocalChanges(() => {
        storage.applyLocalPayload(payload);
        storage.setLocalUpdatedAt(updatedAt || Date.now());
      });
    } finally {
      syncState.isApplyingRemote = false;
    }

    if (typeof window.refreshAppFromStorage === 'function') {
      window.refreshAppFromStorage();
    } else if (typeof window.location?.reload === 'function') {
      window.location.reload();
    }
  };

  const createCloudDoc = async (payload) => {
    if (!syncState.docRef) {
      return;
    }
    await syncState.fs.setDoc(syncState.docRef, {
      schemaVersion: SCHEMA_VERSION,
      initializedAt: syncState.fs.serverTimestamp(),
      updatedAt: syncState.fs.serverTimestamp(),
      clientId: syncState.clientId,
      payload: payload || {},
    });
    syncState.cloudExists = true;
    recordUpload(payload);
  };

  const updateCloudDoc = async (payload) => {
    if (!syncState.docRef) {
      return;
    }
    if (!syncState.cloudExists) {
      await createCloudDoc(payload);
      return;
    }
    await syncState.fs.setDoc(syncState.docRef, {
      schemaVersion: SCHEMA_VERSION,
      updatedAt: syncState.fs.serverTimestamp(),
      clientId: syncState.clientId,
      payload: payload || {},
    }, { merge: true });
    recordUpload(payload);
  };

  const recordUpload = (payload) => {
    syncState.lastUploadMs = Date.now();
    syncState.lastUploadPayloadString = stableStringify(payload || {});
  };

  const markHydrated = () => {
    if (!syncState.hasHydrated) {
      syncState.hasHydrated = true;
      syncState.localChangeEnabled = true;
    }
  };

  const isNoopPayload = (payload) => {
    const modules = getSyncModules();
    if (!modules) {
      return false;
    }
    const localPayload = modules.storage.buildLocalPayload();
    const localString = stableStringify(localPayload);
    const remoteString = stableStringify(payload || {});
    return remoteString && remoteString === localString;
  };

  const scheduleCloudPush = () => {
    if (!syncState.ready || !syncState.user || syncState.isApplyingRemote || !syncState.localChangeEnabled) {
      return;
    }
    if (syncState.pushTimer) {
      window.clearTimeout(syncState.pushTimer);
      logSync('SYNC: upload skipped (debounced/nochange)');
    }
    syncState.pushTimer = window.setTimeout(async () => {
      syncState.pushTimer = null;
      try {
        const payload = window.SyncStorage.buildLocalPayload();
        const payloadString = stableStringify(payload);
        if (payloadString && payloadString === syncState.lastUploadPayloadString) {
          logSync('SYNC: upload skipped (debounced/nochange)');
          return;
        }
        await updateCloudDoc(payload);
      } catch (error) {
        console.warn('Cloud write failed.', error);
        setStatus('Cloud write failed. Check your connection.', 'error');
      }
    }, SYNC_DEBOUNCE_MS);
  };

  const startListener = () => {
    if (!syncState.docRef || !syncState.fs) {
      return;
    }
    if (syncState.unsubscribe) {
      syncState.unsubscribe();
      logSync('SYNC: listener detached');
    }
    syncState.unsubscribe = syncState.fs.onSnapshot(syncState.docRef, (snapshot) => {
      if (!snapshot.exists()) {
        markHydrated();
        return;
      }
      const data = snapshot.data() || {};
      const migrated = migratePayload(data.payload || {}, data.schemaVersion);
      if (migrated.version !== data.schemaVersion) {
        updateCloudDoc(migrated.payload).catch(() => {});
      }
      const cloudUpdatedAt = toMillis(data.updatedAt);
      const docClientId = data.clientId || '';

      if (docClientId && docClientId === syncState.clientId && syncState.lastUploadMs && cloudUpdatedAt <= syncState.lastUploadMs) {
        logSync('SYNC: snapshot ignored (noop/echo)');
        markHydrated();
        return;
      }

      const modules = getSyncModules();
      const localPayload = modules ? modules.storage.buildLocalPayload() : {};
      const localString = stableStringify(localPayload);
      const remoteString = stableStringify(migrated.payload);
      if (remoteString && remoteString === localString) {
        logSync('SYNC: snapshot ignored (noop/echo)');
        markHydrated();
        return;
      }

      const localUpdatedAt = window.SyncStorage.getLocalUpdatedAt();
      if (cloudUpdatedAt <= localUpdatedAt) {
        markHydrated();
        return;
      }

      applyCloudToLocal(migrated.payload, cloudUpdatedAt);
      markHydrated();
    }, (error) => {
      console.warn('Sync listener error.', error);
      setStatus('Sync connection lost.', 'error');
    });
    logSync('SYNC: listener attached');
  };

  const stopListener = () => {
    if (syncState.unsubscribe) {
      syncState.unsubscribe();
      syncState.unsubscribe = null;
      logSync('SYNC: listener detached');
    }
    if (syncState.pushTimer) {
      window.clearTimeout(syncState.pushTimer);
      syncState.pushTimer = null;
    }
  };

  const handleInitialSync = async (user) => {
    const modules = getSyncModules();
    if (!modules) {
      return;
    }
    const { storage } = modules;
    const docSnap = await syncState.fs.getDoc(syncState.docRef);
    const localPayload = storage.buildLocalPayload();
    const hasLocal = storage.hasLocalPayload(localPayload);

    if (!docSnap.exists()) {
      syncState.cloudExists = false;
      const choice = await showSyncModal({
        title: 'Sync setup',
        message: 'Choose which data to use',
        actions: [
          { id: 'upload', label: 'Use this device data (upload to cloud)' },
          { id: 'fresh', label: 'Start fresh (empty cloud)', tone: 'secondary' },
        ],
      });

      if (choice === 'fresh') {
        await createCloudDoc({});
        if (!isNoopPayload({})) {
          applyCloudToLocal({}, Date.now());
        }
      } else {
        await createCloudDoc(hasLocal ? localPayload : {});
      }

      storage.setLinkedUid(user.uid);
      return;
    }

    syncState.cloudExists = true;
    const data = docSnap.data() || {};
    const migrated = migratePayload(data.payload || {}, data.schemaVersion);
    const cloudUpdatedAt = toMillis(data.updatedAt);
    const linkedUid = storage.getLinkedUid();

    if (hasLocal && linkedUid !== user.uid) {
      const choice = await showSyncModal({
        title: 'Sync setup',
        message: 'Choose which data to use',
        actions: [
          { id: 'cloud', label: 'Use Cloud (overwrite this device)' },
          { id: 'device', label: 'Use This Device (overwrite cloud)', tone: 'secondary' },
          { id: 'merge', label: 'Merge (recommended)' },
        ],
      });

      if (choice === 'cloud') {
        if (!isNoopPayload(migrated.payload)) {
          applyCloudToLocal(migrated.payload, cloudUpdatedAt);
        }
      } else if (choice === 'device') {
        await updateCloudDoc(localPayload);
        storage.setLocalUpdatedAt(Date.now());
      } else {
        const merged = mergePayloads(migrated.payload, localPayload);
        await updateCloudDoc(merged);
        if (!isNoopPayload(merged)) {
          applyCloudToLocal(merged, Date.now());
        }
      }

      storage.setLinkedUid(user.uid);
      return;
    }

    if (linkedUid !== user.uid) {
      storage.setLinkedUid(user.uid);
    }
    if (!isNoopPayload(migrated.payload)) {
      applyCloudToLocal(migrated.payload, cloudUpdatedAt);
    }
  };

  const startSyncForUser = async (user) => {
    if (!user || !user.uid || syncState.initializing || syncState.started) {
      return;
    }

    syncState.initializing = true;
    syncState.started = true;
    syncState.user = user;
    syncState.clientId = getClientId();
    syncState.localChangeEnabled = false;
    syncState.hasHydrated = false;
    syncState.lastUploadMs = 0;
    syncState.lastUploadPayloadString = '';
    setStatus('Sync is preparing...');

    try {
      const { db, fs } = await ensureFirestore();
      syncState.db = db;
      syncState.fs = fs;
      syncState.docRef = buildDocRef(user.uid);
      await handleInitialSync(user);
      startListener();
      syncState.ready = true;
      setStatus('Sync is on.', 'success');
    } catch (error) {
      console.warn('Sync start failed.', error);
      setStatus('Sync could not start. Check Firebase settings.', 'error');
      syncState.started = false;
      syncState.localChangeEnabled = false;
      syncState.hasHydrated = false;
    } finally {
      syncState.initializing = false;
    }
  };

  const stopSync = () => {
    syncState.ready = false;
    syncState.started = false;
    syncState.user = null;
    syncState.docRef = null;
    syncState.localChangeEnabled = false;
    syncState.hasHydrated = false;
    syncState.lastUploadMs = 0;
    syncState.lastUploadPayloadString = '';
    stopListener();
    setStatus('Sync is off.');
  };

  const downloadFromCloud = async () => {
    if (!syncState.user || !syncState.docRef) {
      return;
    }
    const confirmed = window.confirm('Cloud data will overwrite this device. Continue?');
    if (!confirmed) {
      return;
    }
    try {
      const snap = await syncState.fs.getDoc(syncState.docRef);
      if (!snap.exists()) {
        setStatus('No cloud data found.', 'error');
        return;
      }
      const data = snap.data() || {};
      const migrated = migratePayload(data.payload || {}, data.schemaVersion);
      const updatedAt = toMillis(data.updatedAt) || Date.now();
      if (!isNoopPayload(migrated.payload)) {
        applyCloudToLocal(migrated.payload, updatedAt);
      }
      setStatus('Downloaded from cloud.', 'success');
    } catch (error) {
      console.warn('Cloud download failed.', error);
      setStatus('Cloud download failed.', 'error');
    }
  };

  const uploadToCloud = async () => {
    if (!syncState.user || !syncState.docRef) {
      return;
    }
    const confirmed = window.confirm('This device will overwrite cloud data. Continue?');
    if (!confirmed) {
      return;
    }
    try {
      const payload = window.SyncStorage.buildLocalPayload();
      await updateCloudDoc(payload);
      window.SyncStorage.setLocalUpdatedAt(Date.now());
      setStatus('Uploaded to cloud.', 'success');
    } catch (error) {
      console.warn('Cloud upload failed.', error);
      setStatus('Cloud upload failed.', 'error');
    }
  };

  const initSyncSettings = () => {
    const section = document.querySelector('[data-sync-settings]');
    if (!section) {
      return;
    }

    const ui = {
      signIn: section.querySelector('[data-sync-signin]'),
      signOut: section.querySelector('[data-sync-signout]'),
      userLabel: section.querySelector('[data-sync-user]'),
      status: section.querySelector('[data-sync-status]'),
      advanced: section.querySelector('[data-sync-advanced]'),
      download: section.querySelector('[data-sync-download]'),
      upload: section.querySelector('[data-sync-upload]'),
    };
    syncState.ui = ui;

    const modules = getSyncModules();
    if (!modules || !modules.auth.isConfigured()) {
      if (ui.signIn) {
        ui.signIn.disabled = true;
      }
      setStatus('Firebase config not found. Sync disabled.', 'error');
      return;
    }

    if (ui.signIn) {
      ui.signIn.addEventListener('click', async () => {
        setStatus('Signing in with Google...');
        try {
          await modules.auth.signInWithGoogle();
        } catch (error) {
          console.warn('Google sign-in failed.', error);
          setStatus('Google sign-in failed. Please try again.', 'error');
        }
      });
    }

    if (ui.signOut) {
      ui.signOut.addEventListener('click', async () => {
        try {
          await modules.auth.signOut();
        } catch (error) {
          console.warn('Sign-out failed.', error);
          setStatus('Sign-out failed.', 'error');
        }
      });
    }

    if (ui.download) {
      ui.download.addEventListener('click', () => {
        downloadFromCloud();
      });
    }

    if (ui.upload) {
      ui.upload.addEventListener('click', () => {
        uploadToCloud();
      });
    }

    modules.storage.onLocalChange(() => {
      if (syncState.isApplyingRemote || !syncState.localChangeEnabled) {
        return;
      }
      scheduleCloudPush();
    });

    modules.auth.onAuthStateChanged((user) => {
      if (ui.signIn) {
        ui.signIn.hidden = Boolean(user);
      }
      if (ui.signOut) {
        ui.signOut.hidden = !user;
      }
      if (ui.advanced) {
        ui.advanced.hidden = !user;
      }
      setUserLabel(user);

      if (user) {
        startSyncForUser(user);
      } else {
        stopSync();
      }
    });
  };

  window.SyncEngine = {
    initSyncSettings,
    downloadFromCloud,
    uploadToCloud,
  };
})();
