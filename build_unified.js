/**
 * build_unified.js — FINAL
 *
 * Strategy:
 *  - landing.html is READ-ONLY except 3 string patches (nav link, CTA button, footer links)
 *  - Portal CSS injected into </head> — all selectors scoped to #portal-section
 *  - Portal HTML injected BEFORE <footer> so it sits exactly where it belongs (above the footer, not below)
 *  - Excluded conflicting scripts (particle canvas, cursor)
 *  - Fixed IIFE missing bracket and hardcoded white backgrounds
 */

const fs   = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
const landingRaw = fs.readFileSync(path.join(dist, 'landing.html'), 'utf8');
const portalLines = fs.readFileSync(path.join(dist, 'index.html'), 'utf8').split(/\r?\n/);
const get = (lines, from, to) => lines.slice(from - 1, to).join('\n');

// ─────────────────────────────────────────────────────────────────────────────
// 1.  HEAD INJECTION (includes line 84 so IIFE closes properly)
// ─────────────────────────────────────────────────────────────────────────────
const headInject = `
  <!-- FA icons for portal -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- localStorage init required by portal JS module -->
  <script>
  ${get(portalLines, 41, 84)}
  </script>`;

// ─────────────────────────────────────────────────────────────────────────────
// 2.  PORTAL CSS (Green theme scoped to #portal-section)
// ─────────────────────────────────────────────────────────────────────────────
let portalCSS = `
  <style id="portal-green-theme">
    #portal-section {
      background: var(--near-black, #1F2E1C);
      padding: 0;
    }
    #portal-section .p-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 80px 48px 80px;
    }
    #portal-section .p-header {
      text-align: center;
      margin-bottom: 52px;
    }
    .ptabs {
      display: flex; gap: 6px; background: var(--surface);
      border: 1px solid var(--border); border-radius: 14px;
      padding: 8px; margin-bottom: 36px; flex-wrap: wrap; justify-content: center;
    }
    .ptab {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 22px; background: transparent; color: var(--text-2);
      border: 1px solid transparent; border-radius: 10px;
      font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 600;
      cursor: pointer; transition: all .25s ease; white-space: nowrap;
    }
    .ptab:hover { background: var(--surface-2); color: var(--text-1); }
    .ptab.active {
      background: var(--amber); color: var(--black); border-color: var(--amber);
      box-shadow: 0 0 24px rgba(143,188,143,.2);
    }
    #pcontent > .tab-pane { display: none; }
    #pcontent > .tab-pane.active { display: block; animation: pIn .35s ease-out; }
    @keyframes pIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

    #portal-section .glass-panel {
      background: rgba(38,58,35,.6) !important;
      color: var(--text-1) !important;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: 0 8px 36px rgba(0,0,0,.4);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    /* Fix table ratios and font sizes */
    #portal-section .panel-title {
      font-family: 'Inter',sans-serif; font-size: 1.2rem; font-weight: 800; color: var(--text-1);
      margin-bottom: .8rem; padding-bottom: .8rem; border-bottom: 1px solid var(--border);
    }
    #portal-section h3,#portal-section h4,#portal-section h5 { color:var(--text-1); font-family:'Inter',sans-serif; }
    #portal-section p,#portal-section li { color:var(--text-2); }
    #portal-section label { color:var(--text-2); font-weight:600; font-size:.9rem; }
    
    #portal-section .kpi-row { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    #portal-section .kpi-card { background: rgba(38,58,35,.65); border: 1px solid var(--border); border-radius: 14px; padding: 1.5rem 1rem; text-align: center; }
    #portal-section .kpi-value { font-size:2rem; font-weight:800; color:var(--amber); }
    #portal-section .kpi-label { font-size:.75rem; font-weight:700; text-transform:uppercase; color:var(--text-3); margin-top:8px; }

    #portal-section input:not([type=range]), #portal-section select, #portal-section textarea,
    #portal-section .param-field, #portal-section .app-input, #portal-section .search-input {
      background: rgba(0,0,0,.3) !important; border: 1px solid var(--border) !important; color: var(--text-1) !important;
      border-radius: 8px !important; font-family: 'Inter',sans-serif !important; font-size: .9rem !important; padding: 10px 14px !important;
    }
    #portal-section .search-btn, #portal-section .btn-send, #portal-section #btn-submit-search {
      background: var(--amber) !important; color: var(--black) !important; border: none !important; border-radius: 8px !important;
      font-weight: 700 !important; cursor: pointer !important; padding: 10px 18px !important;
    }
    
    /* Table tweaks */
    #portal-section .gastronomy-table { width:100%; border-collapse:collapse; font-size:.9rem; }
    #portal-section .gastronomy-table th {
      padding:14px 16px; font-size:.8rem; font-weight:700; text-transform:uppercase;
      color:var(--amber); border-bottom:2px solid var(--border);
    }
    #portal-section .gastronomy-table td { padding:12px 16px; border-bottom:1px solid var(--border); color:var(--text-2); }
    #portal-section .gastronomy-table tbody tr:hover td { background:rgba(143,188,143,.06); color:var(--text-1); }

    /* Modals & Toasts (No conflict) */
    .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:9000; display:none; align-items:center; justify-content:center; backdrop-filter:blur(6px); }
    .modal-backdrop.active { display:flex; }
    .modal-container { background:var(--surface,#263A23); border:1px solid var(--border); border-radius:18px; max-width:600px; width:90%; max-height:85vh; overflow-y:auto; box-shadow:0 32px 64px rgba(0,0,0,.6); }
    .modal-header { display:flex; justify-content:space-between; align-items:center; padding:1.2rem 1.5rem; border-bottom:1px solid var(--border); }
    .modal-title { color:var(--text-1,#F5F1E1); font-weight:800; font-size:1.1rem; }
    .btn-close-modal { background:transparent; color:var(--text-2); border:none; font-size:1.4rem; cursor:pointer; line-height:1; }
    .modal-body { padding:1.5rem; }
    
    #toast-container { position:fixed; bottom:24px; right:24px; z-index:10000; display:flex; flex-direction:column; gap:8px; }
    .toast { display:flex; align-items:center; gap:9px; padding:12px 18px; background:var(--surface,#263A23); border:1px solid var(--border); border-radius:10px; color:var(--text-1,#F5F1E1); font-size:.9rem; font-weight:600; box-shadow:0 10px 28px rgba(0,0,0,.4); opacity:0; transition:opacity .3s; }
    .toast.success .toast-dot { background:var(--amber,#8FBC8F); }
    .toast.error .toast-dot { background:#ef4444; }
    .toast-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

    /* Misc utilities */
    .badge-engine { padding:4px 12px; border-radius:100px; font-size:.8rem; font-weight:700; }
    .badge-engine.live { background:rgba(143,188,143,.12); color:var(--amber,#8FBC8F); border:1px solid rgba(143,188,143,.22); }
    
    /* ─────────────────────────────────────────────────────────────────────────────
       MISSING LANDING PAGE CSS (Restores the "About" Section side-by-side layout)
       ───────────────────────────────────────────────────────────────────────────── */
    .about-featured-grid { display: flex; justify-content: center; margin-bottom: 2rem; width: 100%; }
    .about-panel { display: none !important; }
    .about-title, .about-divider, .about-text { display: none !important; }
    .stats-banner { display: none !important; }
    .stat-card { background: rgba(0,0,0,0.15); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border); }
    .stat-number { font-size: 2.8rem; font-weight: 900; color: var(--text-1); }
    .stat-label { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--amber); letter-spacing: 0.1em; margin-top: 0.5rem; }
    .featured-box-card { position: relative; overflow: hidden; border-radius: 16px; min-height: 400px; display: flex; flex-direction: column; justify-content: flex-end; width: 100%; max-width: 800px; margin: 0 auto; }
    .featured-loading { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); z-index: 20; color: #fff; font-weight: 600; }
    .featured-img-overlay { position: absolute; inset: 0; z-index: 0; }
    .featured-box-bg-img { width: 100%; height: 100%; object-fit: cover; }
    .featured-box-content { position: relative; padding: 2.5rem; background: linear-gradient(to top, rgba(15,23,42,0.95), transparent); z-index: 10; }
    .featured-box-tag { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--amber); letter-spacing: 0.15em; margin-bottom: 0.75rem; }
    .featured-box-title { font-size: 2.2rem; font-weight: 900; color: #fff; line-height: 1.1; }

    /* Explore Cuisines Spacing & Layout (Restored) */
    #cuisine-carousel.cuisine-tabs-wrap { display: flex !important; flex-wrap: wrap !important; gap: 10px !important; border: none !important; margin: 0 !important; padding: 1rem 0 !important; overflow-x: auto !important; scrollbar-width: none !important; }
    #cuisine-carousel.cuisine-tabs-wrap::-webkit-scrollbar { display: none !important; }
    #cuisine-carousel .cuisine-tab { min-width: unset !important; width: auto !important; height: auto !important; position: static !important; overflow: visible !important; flex-shrink: unset !important; flex-direction: row !important; justify-content: flex-start !important; transform: none !important; box-shadow: none !important; background: transparent !important; border: 1px solid transparent !important; color: var(--text-2) !important; padding: 8px 16px !important; border-radius: 8px !important; font-weight: 600 !important; font-size: 0.95rem !important; transition: all 0.2s ease !important; display: inline-flex !important; align-items: center !important; gap: 8px !important; cursor: pointer !important; user-select: none !important; white-space: nowrap !important; }
    #cuisine-carousel .cuisine-tab::after, #cuisine-carousel .cuisine-tab::before { display: none !important; content: none !important; }
    #cuisine-carousel .cuisine-tab:hover { color: var(--text-1) !important; background: rgba(255, 255, 255, 0.08) !important; }
    #cuisine-carousel .cuisine-tab.active { background: var(--amber) !important; border-color: var(--amber) !important; color: var(--black) !important; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important; }
    /* Theme Overrides for the Portal Section to force Green instead of White */
    #portal-section {
      --bg-main: transparent !important;
      --bg-surface: rgba(0, 0, 0, 0.15) !important;
      --bg-panel: rgba(0, 0, 0, 0.25) !important;
      --bg-input: rgba(0, 0, 0, 0.35) !important;
      --border-color: rgba(255, 255, 255, 0.1) !important;
      --border-hover: rgba(255, 255, 255, 0.2) !important;
      --text-primary: #F0F4F0 !important;
      --text-secondary: #C8D8C8 !important;
      --text-muted: #8FBC8F !important;
      --amber: #8FBC8F !important;
      --black: #1A2715 !important;
      color: var(--text-primary) !important;
    }
    #portal-section #explorer-pane .search-tab-btn.active { background: var(--amber) !important; color: var(--black) !important; border-color: var(--amber) !important; box-shadow: 0 4px 12px rgba(143,188,143,0.2) !important; }
    #portal-section #explorer-pane input, #portal-section #explorer-pane select { background: var(--bg-input) !important; color: var(--text-primary) !important; border: 1px solid var(--border-color) !important; }
    #portal-section #explorer-pane .search-btn, #portal-section #explorer-pane .btn-send, #portal-section #explorer-pane .btn-action-panel#btn-submit-search {
      background: var(--amber) !important; color: var(--black) !important; border: none !important; border-radius: 8px !important;
      font-weight: 700 !important; cursor: pointer !important; padding: 10px 18px !important;
    }
  </style>
  <style id="portal-injected-styles">`;

// Extract only the specific layout styles needed for the portal from index.html
const indexHtmlContent = require('fs').readFileSync('dist/index.html', 'utf8');
const bodyMatches = indexHtmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let portalHtml = bodyMatches[1];

// Remove <script> tags from portalHtml to prevent duplicate execution errors
portalHtml = portalHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

const safeMatches = indexHtmlContent.match(/(#explorer-pane|\.table-footer-controls)[^{]*\{[^}]*\}/g);
if (safeMatches) {
  portalCSS += '\n/* INLINE OVERRIDES */\n' + safeMatches.join('\n');
}

// Extract base structural CSS from Vite's compiled output
const cssFiles = require('fs').readdirSync('dist/assets').filter(f => f.endsWith('.css'));
if (cssFiles.length > 0) {
  const baseCss = require('fs').readFileSync('dist/assets/' + cssFiles[0], 'utf8');
  const baseMatches = baseCss.match(/\.(?:search|param|nutrition|table|gastronomy|footer|rows-per|pagination|btn-arrow|goto|hidable|featured-loading|loading-spinner)[a-zA-Z0-9_-]*[^{]*\{[^}]*\}/g);
  if (baseMatches) {
    portalCSS += '\n/* BASE STRUCTURAL CSS */\n' + baseMatches.join('\n');
  }
}

portalCSS += `\n</style>`;

// ─────────────────────────────────────────────────────────────────────────────
// 3.  PORTAL HTML SECTION
// ─────────────────────────────────────────────────────────────────────────────
let panesHTML = `\n${get(portalLines, 1784, 2572)}\n${get(portalLines, 2577, 3168)}\n${get(portalLines, 3173, 3241)}\n${get(portalLines, 3246, 3976)}\n`;

// Remove original style tags from panesHTML since we've already extracted and scoped them above
panesHTML = panesHTML.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');

const portalSection = `
  <section id="portal-section">
    <div class="p-inner">
      <div class="p-header">
        <div class="section-label reveal" style="justify-content:center;">RecipeDB2 Portal</div>
        <h2 class="section-heading reveal reveal-delay-1">Full Database Access</h2>
        <p class="reveal reveal-delay-2" style="max-width:580px;margin:0 auto;color:var(--text-2);font-size:1rem;line-height:1.7;">
          Search 128,942 recipes, analyse nutrition, test API endpoints, and explore food science.
        </p>
      </div>

      <div class="ptabs" id="ptab-bar">
        <button class="ptab active" data-ptab="explorer-pane">Recipe Portal</button>
        <button class="ptab" data-ptab="analytics-pane">Analytics & Planner</button>
        <button class="ptab" data-ptab="playground-pane">API Console</button>
        <button class="ptab" data-ptab="lab-pane">Food Science Lab</button>
      </div>

      <div id="pcontent">
        ${panesHTML}
      </div>
    </div>
  </section>`;

// ─────────────────────────────────────────────────────────────────────────────
// 4.  SCRIPTS
// ─────────────────────────────────────────────────────────────────────────────
const portalScripts = `
  <!-- Portal modals -->
${get(portalLines, 4022, 4068)}
${get(portalLines, 4070, 4179)}
  <div id="toast-container"></div>

  <!-- Portal logic (toast, map, heatmap, canvas, stability, settings) -->
${get(portalLines, 4185, 4738)}
${get(portalLines, 4740, 4974)}

  <script>
    (function () {
      var tabs  = document.querySelectorAll('.ptab');
      var panes = document.querySelectorAll('#pcontent > .tab-pane');
      if (panes.length) panes[0].classList.add('active');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var tid = tab.getAttribute('data-ptab');
          tabs.forEach(function(t){ t.classList.remove('active'); });
          panes.forEach(function(p){ p.classList.remove('active'); });
          tab.classList.add('active');
          var target = document.getElementById(tid);
          if (target) target.classList.add('active');
        });
      });
      
      var searchTabs = document.querySelectorAll('.search-tab-btn');
      var searchPanes = document.querySelectorAll('.search-tab-pane');
      searchTabs.forEach(function (tab) {
        tab.addEventListener('click', function (e) {
          e.preventDefault();
          var tid = tab.getAttribute('data-search-tab');
          searchTabs.forEach(function(t){ t.classList.remove('active'); });
          searchPanes.forEach(function(p){ p.classList.remove('active'); });
          tab.classList.add('active');
          var target = document.getElementById(tid);
          if (target) target.classList.add('active');
        });
      });
      if (typeof resizeCanvasGlobal === 'function') setTimeout(resizeCanvasGlobal,100);
    })();
  <\/script>

  <script>
    (function () {
      var loaded = false;
      var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !loaded) {
          loaded = true;
          var s = document.createElement('script');
          s.type  = 'module';
          s.crossOrigin = '';
          s.src   = '/assets/index-B6lYJ60e.js?v=4';
          document.head.appendChild(s);
        }
      }, { rootMargin: '400px' });
      var el = document.getElementById('portal-section');
      if (el) obs.observe(el);
    })();
  <\/script>

  <!-- Hidden stubs -->
  <div style="display:none !important;" aria-hidden="true">
    <div id="brand-home"></div>
    <button id="tab-btn-explorer" class="nav-tab active" data-tab="explorer-pane"></button>
    <button id="tab-btn-analytics" class="nav-tab" data-tab="analytics-pane"></button>
    <button id="tab-btn-playground" class="nav-tab" data-tab="playground-pane"></button>
    <span id="current-engine-badge" class="badge-engine live">Live Server</span>
    <button id="btn-open-settings"></button>
    <div id="cuisine-carousel"></div>
    <input type="range" id="slide-cal" min="100" max="1500" value="800">
    <input type="range" id="slide-carbs" min="10" max="400" value="120">
    <input type="range" id="slide-protein" min="5" max="120" value="30">
    <input type="range" id="slide-fat" min="5" max="150" value="60">
    <span id="val-slide-cal"></span><span id="val-slide-carbs"></span>
    <span id="val-slide-protein"></span><span id="val-slide-fat"></span>
    <div id="planner-results-container"></div>
  </div>`;

// ─────────────────────────────────────────────────────────────────────────────
// 5.  ASSEMBLE
// ─────────────────────────────────────────────────────────────────────────────
let html = landingRaw;

// Head injection
html = html.replace('</head>', headInject + '\n' + portalCSS + '\n</head>');

// Nav links
html = html.replace(
  '<a href="index.html" class="nav-cta">Launch App \u2192</a>',
  '<a href="#portal-section" class="nav-cta" onclick="event.preventDefault();document.getElementById(\'portal-section\').scrollIntoView({behavior:\'smooth\'})">Launch App \u2193</a>'
);
html = html.replace(
  '<a href="index.html" class="btn-primary" style="font-size:18px;padding:18px 44px;">',
  '<a href="#portal-section" class="btn-primary" style="font-size:18px;padding:18px 44px;" onclick="event.preventDefault();document.getElementById(\'portal-section\').scrollIntoView({behavior:\'smooth\'})">'
);
html = html.replace(
  '<span>Launch Recipe<span style="color: #8FBC8F;">DB2</span> Portal \u2192</span>',
  '<span>Launch Recipe<span style="color: #8FBC8F;">DB2</span> Portal \u2193</span>'
);

// We need to inject the portal *BEFORE* the footer, NOT at the end of the body!
// The footer starts with <footer
html = html.replace(/<footer([^>]*)>/, portalSection + '\n' + portalScripts + '\n<footer$1>');
fs.writeFileSync(path.join(dist, 'landing.html'), html);
console.log('✓ landing.html built successfully.');
