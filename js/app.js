/*
 * msuliq.github.io - client script
 *
 * Responsibilities:
 *   - Theme toggle (dark default, persisted in localStorage)
 *   - Email obfuscation (assemble mailto on click; never in HTML source)
 *   - GA4 event tracking via data-track attributes (delegated)
 *   - Scroll-depth tracking (25/50/75/100, fired once each)
 *   - Section-visibility tracking (IntersectionObserver, fired once each)
 *   - GitHub stars fetch with localStorage cache (1h TTL)
 */

(function () {
  'use strict';

  // ─── UTM capture ─────────────────────────────────────────────────────────
  // Read utm_* params off the landing URL once per session, store them in
  // sessionStorage, and attach them to every tracked event afterwards.
  // This is how we attribute interviews/clicks to a specific CV variant
  // or LinkedIn campaign - tag your outbound links and the source flows
  // through GA4 automatically.
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var utmStored = {};
  try {
    var raw = sessionStorage.getItem('utm');
    if (raw) utmStored = JSON.parse(raw) || {};
  } catch (e) {}

  try {
    var qs = new URLSearchParams(window.location.search);
    var fresh = {};
    var hasFresh = false;
    UTM_KEYS.forEach(function (k) {
      var v = qs.get(k);
      if (v) { fresh[k] = v; hasFresh = true; }
    });
    if (hasFresh) {
      utmStored = fresh;
      sessionStorage.setItem('utm', JSON.stringify(fresh));
    }
  } catch (e) {}

  // ─── Theme toggle ────────────────────────────────────────────────────────
  // The initial theme is set inline in <head> before paint to avoid FOUC.
  // This handler only flips it on user interaction.
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var html = document.documentElement;
      var isDark = html.classList.contains('dark');
      if (isDark) {
        html.classList.remove('dark');
        try { localStorage.setItem('theme', 'light'); } catch (e) {}
        track('theme_toggle', { theme: 'light' });
      } else {
        html.classList.add('dark');
        try { localStorage.setItem('theme', 'dark'); } catch (e) {}
        track('theme_toggle', { theme: 'dark' });
      }
    });
  }

  // ─── Email obfuscation ───────────────────────────────────────────────────
  // The local-part and domain are stored as base64 in data-* attributes so
  // naive scrapers (regex on the HTML source, simple `mailto:` matchers)
  // never see a complete address. The full address is assembled only on
  // click. The +alias suffix is set per page so we can route variants.
  document.querySelectorAll('[data-email]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      try {
        var local  = atob(el.getAttribute('data-local'));
        var domain = atob(el.getAttribute('data-domain'));
        var alias  = el.getAttribute('data-alias') || '';
        var addr   = alias ? local + '+' + alias + '@' + domain
                           : local + '@' + domain;
        var subject = el.getAttribute('data-subject') || '';
        var url = 'mailto:' + addr +
                  (subject ? '?subject=' + encodeURIComponent(subject) : '');
        window.location.href = url;
      } catch (err) {
        // Fail silently - better than throwing in front of the user.
      }
    });
  });

  // ─── GA4 event tracking via data-track attributes ────────────────────────
  // Any element with `data-track` fires a GA4 event on click. Conventions:
  //   data-track          → event name (e.g. "cta", "outbound", "resume_download")
  //   data-track-label    → human-readable label (e.g. "book_intro")
  //   data-track-location → where on the page the click happened (e.g. "hero")
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    var name = el.getAttribute('data-track');
    track(name, {
      label: el.getAttribute('data-track-label') || '',
      location: el.getAttribute('data-track-location') || '',
      variant: document.documentElement.getAttribute('data-variant') || 'canonical',
      destination: el.getAttribute('href') || ''
    });
  });

  // ─── Scroll-depth tracking ───────────────────────────────────────────────
  // Fires `scroll_depth` once for each of 25/50/75/100% thresholds.
  var depthsFired = {};
  var thresholds = [25, 50, 75, 100];
  function onScroll() {
    var doc = document.documentElement;
    var scrollTop = window.pageYOffset || doc.scrollTop;
    var max = (doc.scrollHeight - doc.clientHeight) || 1;
    var pct = Math.min(100, Math.round((scrollTop / max) * 100));
    for (var i = 0; i < thresholds.length; i++) {
      var t = thresholds[i];
      if (pct >= t && !depthsFired[t]) {
        depthsFired[t] = true;
        track('scroll_depth', {
          percent: t,
          variant: document.documentElement.getAttribute('data-variant') || 'canonical'
        });
      }
    }
  }
  // Throttle with requestAnimationFrame to keep this off the main thread.
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ─── Section visibility tracking ─────────────────────────────────────────
  // Each <section id="..."> fires `section_view` the first time at least
  // 50% of it enters the viewport. Useful to see which parts of the page
  // recruiters actually read.
  if ('IntersectionObserver' in window) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        if (!id || seen[id]) return;
        seen[id] = true;
        track('section_view', {
          section: id,
          variant: document.documentElement.getAttribute('data-variant') || 'canonical'
        });
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('main section[id]').forEach(function (s) {
      io.observe(s);
    });
  }

  // ─── GitHub stars (cached in localStorage, 1h TTL) ───────────────────────
  // For each .stars[data-stars-for="owner/repo"] node we either pull a
  // fresh count from the cache or fetch it from the public API. On
  // success we reveal the badge. On failure (rate limit, network) we
  // simply leave it hidden - graceful degradation.
  var STARS_TTL_MS = 60 * 60 * 1000; // 1 hour
  document.querySelectorAll('[data-stars-for]').forEach(function (el) {
    var repo = el.getAttribute('data-stars-for');
    if (!repo) return;

    var cacheKey = 'gh_stars_' + repo;
    try {
      var raw = localStorage.getItem(cacheKey);
      if (raw) {
        var cached = JSON.parse(raw);
        if (cached && (Date.now() - cached.ts) < STARS_TTL_MS) {
          showStars(el, cached.count);
          return;
        }
      }
    } catch (e) { /* ignore */ }

    fetch('https://api.github.com/repos/' + repo, {
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then(function (r) {
        if (!r.ok) throw new Error('GitHub API ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var count = data.stargazers_count || 0;
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ count: count, ts: Date.now() }));
        } catch (e) { /* ignore quota */ }
        showStars(el, count);
      })
      .catch(function () { /* leave hidden on failure */ });
  });

  function showStars(el, count) {
    var span = el.querySelector('.stars-count');
    if (span) span.textContent = formatStars(count);
    el.classList.remove('hidden');
    el.classList.add('inline-flex');
  }

  function formatStars(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  // ─── track() helper ──────────────────────────────────────────────────────
  // Pushes both directly to gtag (GA4) and to dataLayer (so GTM can pick it
  // up). Auto-merges any captured UTM params so every event carries
  // attribution. If neither gtag nor dataLayer is loaded yet, no-op.
  function track(name, params) {
    var merged = Object.assign({}, utmStored, params || {});
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, merged);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, merged));
    } catch (e) { /* swallow */ }
  }

  // Expose for ad-hoc use from inline scripts if ever needed.
  window.__siteTrack = track;
})();
