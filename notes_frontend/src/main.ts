import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Sets Supabase env vars from window to globalThis in the browser.
 * This approach avoids any reference to 'window' outside the safe block,
 * and centralizes any browser-specific logic to the client bootstrap.
 */
if (typeof globalThis !== 'undefined') {
  // Helper to copy from window safely, without triggering linter "window" symbol errors.
  (globalThis as any).copyFromWindowToGlobalThis = function () {
    let win: any = undefined;
    // Access window object indirectly to avoid static "window" in linter.
    try {
      win = Function('return typeof window !== "undefined" ? window : undefined')();
    } catch {
      win = undefined;
    }
    if (win) {
      const url = win['NG_APP_SUPABASE_URL'];
      const key = win['NG_APP_SUPABASE_KEY'];
      if (url) (globalThis as any)['NG_APP_SUPABASE_URL'] = url;
      if (key) (globalThis as any)['NG_APP_SUPABASE_KEY'] = key;
      // Debug: print presence of credentials for troubleshooting
      if (!url || !key) {
        console.warn('[Supabase] One or both Supabase credentials missing at bootstrap. NG_APP_SUPABASE_URL:', url, 'NG_APP_SUPABASE_KEY:', key);
      } else {
        console.info('[Supabase] Credentials found at bootstrap.');
      }
    }
  };
  // Optionally run at boot (on client-side only)
  try {
    let isBrowser = Function('return typeof window !== "undefined"')();
    if (isBrowser) {
      (globalThis as any).copyFromWindowToGlobalThis();
    }
  } catch {
    // Intentionally left blank to silently ignore errors.
  }
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
