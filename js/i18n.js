/* ============================================================
   i18n — 6 languages: en, es, fr, de, it, pt
   Static nodes use data-i18n / data-i18n-title; dynamic strings
   go through MT_I18n.t(key, vars).
   ============================================================ */
(function (global) {
  'use strict';

  const SUPPORTED = ['en', 'es', 'fr', 'de', 'it', 'pt'];
  const LABELS = {
    en: 'English', es: 'Español', fr: 'Français',
    de: 'Deutsch', it: 'Italiano', pt: 'Português'
  };
  const STORE_KEY = 'mt.lang.v1';

  let current = 'es';
  const listeners = [];

  function detect() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved && SUPPORTED.indexOf(saved) >= 0) return saved;
    } catch (e) { /* private mode */ }
    const nav = (navigator.languages || [navigator.language || 'es']);
    for (let i = 0; i < nav.length; i++) {
      const code = String(nav[i]).slice(0, 2).toLowerCase();
      if (SUPPORTED.indexOf(code) >= 0) return code;
    }
    return 'es';
  }

  function locale(lang) {
    const l = lang || current;
    return (global.MT_Locales && (global.MT_Locales[l] || global.MT_Locales.en)) || {};
  }

  function t(key, vars) {
    const loc = locale();
    let str = loc[key];
    if (str == null) {
      const en = (global.MT_Locales && global.MT_Locales.en) || {};
      str = en[key];
    }
    if (str == null) return key;
    if (vars) {
      str = str.replace(/\{(\w+)\}/g, function (m, name) {
        return vars[name] != null ? String(vars[name]) : m;
      });
    }
    return str;
  }

  function apply() {
    const loc = locale();
    document.documentElement.lang = current;
    document.documentElement.dir = loc.__dir || 'ltr';
    document.body.setAttribute('data-lang', current);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const v = t(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      const v = t(el.getAttribute('data-i18n-title'));
      if (v != null) el.setAttribute('title', v);
    });
    document.title = t('brand') + ' · ' + t('tagline');
    fillSelectors();
  }

  function fillSelectors() {
    ['lang-select', 'set-lang'].forEach(function (id) {
      const sel = document.getElementById(id);
      if (!sel) return;
      const keep = sel.value || current;
      sel.innerHTML = '';
      SUPPORTED.forEach(function (code) {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = LABELS[code];
        sel.appendChild(opt);
      });
      sel.value = keep;
      if (!sel.value) sel.value = current;
    });
  }

  function set(lang) {
    if (SUPPORTED.indexOf(lang) < 0) return;
    current = lang;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* ignore */ }
    apply();
    listeners.forEach(function (fn) { try { fn(lang); } catch (e) { console.error(e); } });
  }

  function onChange(fn) { listeners.push(fn); }

  global.MT_I18n = {
    SUPPORTED: SUPPORTED,
    LABELS: LABELS,
    get current() { return current; },
    init: function () { current = detect(); apply(); },
    locale: locale,
    t: t,
    set: set,
    apply: apply,
    onChange: onChange
  };
})(typeof window !== 'undefined' ? window : globalThis);
