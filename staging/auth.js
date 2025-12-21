(() => {
  const FIREBASE_SDK_VERSION = '10.12.0';
  let authPromise = null;
  let currentUser = undefined;
  let listenerAttached = false;
  let redirectHandled = false;
  const listeners = new Set();

  const getFirebaseConfig = () => {
    const config = typeof window !== 'undefined' ? window.FIREBASE_CONFIG : null;
    if (!config || typeof config !== 'object') {
      return null;
    }
    const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
    const hasAll = required.every((key) => typeof config[key] === 'string' && config[key].trim());
    return hasAll ? config : null;
  };

  const isConfigured = () => Boolean(getFirebaseConfig());

  const ensureAuth = async () => {
    if (authPromise) {
      return authPromise;
    }

    authPromise = (async () => {
      const config = getFirebaseConfig();
      if (!config) {
        throw new Error('Firebase config not found.');
      }

      const [appModule, authModule] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-auth.js`),
      ]);

      const { initializeApp, getApps, getApp } = appModule;
      const app = getApps().length ? getApp() : initializeApp(config);
      const auth = authModule.getAuth(app);

      if (!redirectHandled) {
        redirectHandled = true;
        try {
          await authModule.getRedirectResult(auth);
        } catch (_error) {
          // Ignore redirect completion errors; user can retry via popup.
        }
      }

      if (!listenerAttached) {
        listenerAttached = true;
        authModule.onAuthStateChanged(auth, (user) => {
          currentUser = user || null;
          listeners.forEach((handler) => {
            try {
              handler(currentUser);
            } catch (error) {
              console.warn('Auth state listener failed.', error);
            }
          });
        });
      }

      return { app, auth, appModule, authModule };
    })();

    return authPromise;
  };

  const onAuthStateChanged = (handler) => {
    if (typeof handler !== 'function') {
      return () => {};
    }
    listeners.add(handler);
    if (currentUser !== undefined) {
      handler(currentUser || null);
    }
    ensureAuth().catch(() => {});
    return () => listeners.delete(handler);
  };

  const signInWithGoogle = async () => {
    const { auth, authModule } = await ensureAuth();
    const provider = new authModule.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      return await authModule.signInWithPopup(auth, provider);
    } catch (error) {
      const code = error && error.code ? error.code : '';
      if ([
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request',
        'auth/unauthorized-domain',
      ].includes(code)) {
        await authModule.signInWithRedirect(auth, provider);
        return null;
      }
      throw error;
    }
  };

  const signOut = async () => {
    const { auth, authModule } = await ensureAuth();
    await authModule.signOut(auth);
  };

  const getCurrentUser = () => currentUser || null;

  window.SyncAuth = {
    ensureAuth,
    onAuthStateChanged,
    signInWithGoogle,
    signOut,
    getCurrentUser,
    isConfigured,
  };
})();
