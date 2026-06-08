(function () {
  const a = document.createElement("link").relList;
  if (a && a.supports && a.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) o(s);
  new MutationObserver((s) => {
    for (const r of s)
      if (r.type === "childList")
        for (const u of r.addedNodes)
          u.tagName === "LINK" && u.rel === "modulepreload" && o(u);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(s) {
    const r = {};
    return (
      s.integrity && (r.integrity = s.integrity),
      s.referrerPolicy && (r.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (r.credentials = "include")
        : s.crossOrigin === "anonymous"
          ? (r.credentials = "omit")
          : (r.credentials = "same-origin"),
      r
    );
  }
  function o(s) {
    if (s.ep) return;
    s.ep = !0;
    const r = n(s);
    fetch(s.href, r);
  }
})();
const $ = {
    success: "true",
    message: "Sandbox Disabled",
    payload: { data: [] },
  },
  q = { success: "true", message: "Sandbox Disabled", payload: { data: {} } },
  G = { success: !0, message: "Sandbox Disabled", payload: {} },
  K = { success: "true", message: "Sandbox Disabled", payload: { data: [] } },
  A = {
    averageCaloriesByContinent: [
      { continent: "African", calories: 690 },
      { continent: "Asian", calories: 580 },
      { continent: "European", calories: 840 },
      { continent: "North American", calories: 920 },
      { continent: "Caribbean", calories: 480 },
    ],
    dietaryPrevalence: [
      { category: "Lacto-Veg", count: 24500 },
      { category: "Vegan", count: 8120 },
      { category: "Pescetarian", count: 12050 },
      { category: "Non-Veg", count: 73413 },
    ],
  },
  y = {
    get baseUrl() {
      let e = localStorage.getItem("recipedb_baseUrl");
      if (!e || e.includes("cosylab.iiitd.edu.in")) {
        e = "https://api.foodoscope.com";
        localStorage.setItem("recipedb_baseUrl", e);
      } else {
        try {
          const u = new URL(e);
          if (e !== u.origin) {
            e = u.origin;
            localStorage.setItem("recipedb_baseUrl", e);
          }
        } catch (_) {}
      }
      return e;
    },
    set baseUrl(e) {
      if (e) {
        try {
          const u = new URL(e);
          e = u.origin;
        } catch (_) {
          e = e.trim();
        }
      }
      localStorage.setItem("recipedb_baseUrl", e);
      clearApiCache();
    },
    get apiKey() {
      let e = localStorage.getItem("recipedb_apiKey");
      return (
        (!e ||
          e === "undefined" ||
          e === "null" ||
          e === "v5cwjQotMtbTnlq3-bV2VPotjdR-UJaLDNQzbRhGzky99D00" ||
          e === "YqC-5Yc3J3sfoFEZhFtLjPztv9uVh8juKqYhlE7_sSInaCj6" ||
          e === "CnLZys6hZiEzvl-aPlurxqyMKNUUdwuTzWsxjwd7ASIvKqLL" ||
          e === "ESL32hFBESL4RjiwN_0glmpSV9nBqlR4gdXKGF0ZOKWowzNc" ||
          e === "-BQKD4dXZR6WFf5pzP3icei3DvcBDE0KR--M6GdyIwp0UA5H" ||
          e === "B9T3fCoeHaRKdHvPUm5k_hzzVMb7-xxLXNXpkydXeZg5-K7n" ||
          e === "kvfuHfYLxZjFrnsHyfEc7Za-kjj0LH3hhaqxB8WI12qkTB7R" ||
          e === "k6Hprs-yAwqx4e7Lpovpe3z-V8cGHObIqnZryOsNGvzkXIpE" ||
          e === "NxsURcu19CM40-SpOsS_O53vS--skidnCNHzmv8KLsIHt9eM") &&
          ((e = "LgYd5lGemnqS9A7plQ0owVpkk_wcJKgCNOi80NIiHY79gVfz"),
          localStorage.setItem("recipedb_apiKey", e)),
        e
      );
    },
    set apiKey(e) {
      localStorage.setItem("recipedb_apiKey", e);
      clearApiCache();
    },
    get engine() {
      let e = localStorage.getItem("recipedb_engine");
      return (
        (!e || e === "mock") &&
          ((e = "live"), localStorage.setItem("recipedb_engine", "live")),
        e
      );
    },
    set engine(e) {
      localStorage.setItem("recipedb_engine", e);
    },
  };

const API_CACHE_PREFIX = "recipedb_api_cache_";
function getCachedResponse(url) {
  try {
    const cached = sessionStorage.getItem(API_CACHE_PREFIX + url);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.warn("Cache read error:", err);
  }
  return null;
}
function setCachedResponse(url, data) {
  try {
    sessionStorage.setItem(API_CACHE_PREFIX + url, JSON.stringify(data));
  } catch (err) {
    console.warn("Cache write error, clearing cache:", err);
    clearApiCache();
    try {
      sessionStorage.setItem(API_CACHE_PREFIX + url, JSON.stringify(data));
    } catch (e) {}
  }
}
function clearApiCache() {
  try {
    for (let idx = sessionStorage.length - 1; idx >= 0; idx--) {
      const key = sessionStorage.key(idx);
      if (key && key.startsWith(API_CACHE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    }
  } catch (err) {}
}

async function T({
  path: e,
  method: a = "GET",
  queryParams: n = {},
  description: o = "",
}) {
  const s = y.engine === "mock",
    r = performance.now(),
    u = new URL(`${y.baseUrl}${e}`);
  Object.entries(n).forEach(([g, h]) => {
    h != null && h !== "" && u.searchParams.append(g, h);
  });
  const p = u.toString();
  if (a === "GET" && !s) {
    const cached = getCachedResponse(p);
    if (cached) {
      console.log(`[API Cache Hit] ${p}`);
      return cached;
    }
  }
  const d = {};
  a !== "GET" && (d["Content-Type"] = "application/json");
  y.apiKey && (d.Authorization = `Bearer ${y.apiKey}`);
  let l = `curl -X ${a} "${p}"`;
  d["Content-Type"] && (l += ` \\\n  -H "Content-Type: ${d["Content-Type"]}"`);
  y.apiKey &&
    (l += ` \\
  -H "Authorization: Bearer ${y.apiKey.substring(0, 12)}..."`);
  const c = {
    url: p,
    method: a,
    curl: l,
    status: 200,
    statusText: "OK",
    headers: { "content-type": "application/json; charset=utf-8" },
    timeMs: 0,
    data: null,
    isMockUsed: s,
    error: null,
  };
  if (s)
    return (
      await new Promise((g) => setTimeout(g, 150 + Math.random() * 200)),
      (c.timeMs = Math.round(performance.now() - r)),
      (c.status = 200),
      (c.statusText = "OK (Mock Sandbox)"),
      (c.headers = {
        "x-sandbox-engine": "RecipeDB2 Sandbox Engine v1.0",
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-cache",
        date: new Date().toUTCString(),
      }),
      (c.data = F(e, n)),
      c
    );
  try {
    const g = await fetch(p, { method: a, headers: d }),
      h = performance.now();
    ((c.timeMs = Math.round(h - r)),
      (c.status = g.status),
      (c.statusText = g.statusText));
    const f = {};
    (g.headers.forEach((C, S) => {
      f[S] = C;
    }),
      (c.headers = f));
    const m = await g.text();
    try {
      c.data = JSON.parse(m);
    } catch {
      c.data = m;
    }
    if (a === "GET" && !s && g.status === 200) {
      setCachedResponse(p, c);
    }
    return c;
  } catch (g) {
    const h = performance.now();
    return (
      (c.timeMs = Math.round(h - r)),
      (c.status = 500),
      (c.statusText = "CORS/Network Error"),
      (c.error = g.message),
      (c.headers = {
        "x-error-cause":
          "CORS policy blocked direct access or endpoint is offline",
      }),
      console.warn("Live API request failed.", g),
      (c.isMockUsed = !1),
      (c.statusText = "CORS/Network Error"),
      (c.data = null),
      c
    );
  }
}
function F(e, a) {
  return { success: !1, message: "Mock sandbox disabled", payload: null };
}
const i = {
    currentTab: "explorer-pane",
    activeEndpoint: "recipesinfo",
    recipesList: [],
    allFetchedRecipes: [],
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    featuredRecipe: null,
    activeSearchTab: "tab-cuisine",
    sortKey: "Recipe_title",
    sortDirection: "asc",
    isSorted: !1,
    plannerTargets: { calories: 800, carbs: 120, protein: 30, fat: 60 },
    searchCache: null,
  },
  w = {
    recipesinfo: {
      name: "Recipe Info",
      path: "/recipe2-api/recipe/recipesinfo",
      method: "GET",
      description:
        "Retrieves a comprehensive list of all available recipes in the database.",
      params: [
        {
          key: "page",
          default: "1",
          type: "number",
          desc: "Filter by page number.",
        },
        {
          key: "limit",
          default: "10",
          type: "number",
          desc: "Number of recipes shown per page.",
        },
      ],
    },
    recipeofday: {
      name: "Recipe of Day",
      path: "/recipe2-api/recipe/recipeofday",
      method: "GET",
      description:
        'Returns a single, randomly selected recipe to be featured as the "Recipe of the Day".',
      params: [],
    },
    "with-ingredients-categories": {
      name: "Recipe with Exclusions",
      path: "/recipe2-api/recipe/recipe-day/with-ingredients-categories",
      method: "GET",
      description:
        "Generates a featured recipe of the day while excluding specific ingredients or categories.",
      params: [
        {
          key: "excludeIngredients",
          default: "water,flour",
          type: "text",
          desc: "Comma-separated ingredients to exclude.",
        },
        {
          key: "excludeCategories",
          default: "Dairy",
          type: "text",
          desc: "Comma-separated categories to exclude.",
        },
      ],
    },
    nutritioninfo: {
      name: "Recipe Nutrition Info",
      path: "/recipe2-api/recipe-nutri/nutritioninfo",
      method: "GET",
      description:
        "Provides detailed macronutrient details (calories, fat, protein, carbohydrates) for recipes.",
      params: [
        {
          key: "page",
          default: "1",
          type: "number",
          desc: "Filter by page number.",
        },
        {
          key: "limit",
          default: "10",
          type: "number",
          desc: "Number of items per page.",
        },
      ],
    },
  },
  t = {
    brandHome: document.getElementById("brand-home"),
    tabBtnExplorer: document.getElementById("tab-btn-explorer"),
    tabBtnAnalytics: document.getElementById("tab-btn-analytics"),
    tabBtnPlayground: document.getElementById("tab-btn-playground"),
    explorerPane: document.getElementById("explorer-pane"),
    analyticsPane: document.getElementById("analytics-pane"),
    playgroundPane: document.getElementById("playground-pane"),
    engineBadge: document.getElementById("current-engine-badge"),
    btnOpenSettings: document.getElementById("btn-open-settings"),
    cuisineCarousel: document.getElementById("cuisine-carousel"),
    modalSettings: document.getElementById("modal-settings"),
    btnCloseSettings: document.getElementById("btn-close-settings"),
    btnSaveSettings: document.getElementById("btn-save-settings"),
    settingBaseUrl: document.getElementById("setting-baseurl"),
    settingApiKey: document.getElementById("setting-apikey"),
    engineToggleGroup: document.getElementById("engine-toggle-group"),
    featuredRecipeContainer: document.getElementById(
      "featured-recipe-container",
    ),
    featuredTitle: document.getElementById("featured-title"),
    featuredTime: document.getElementById("featured-time"),
    featuredRegion: document.getElementById("featured-region"),
    featuredBadges: document.getElementById("featured-badges"),
    featuredImage: document.getElementById("featured-image"),
    searchTabBtns: document.querySelectorAll(".search-tab-btn"),
    searchTabPanes: document.querySelectorAll(".search-tab-pane"),
    btnSubmitSearch: document.getElementById("btn-submit-search"),
    searchRegion: document.getElementById("search-region"),
    searchCountry: document.getElementById("search-country"),
    searchTitle: document.getElementById("search-title"),
    searchIngUsed: document.getElementById("search-ing-used"),
    searchIngNotUsed: document.getElementById("search-ing-notused"),
    searchCatUsed: document.getElementById("search-cat-used"),
    searchCatNotUsed: document.getElementById("search-cat-notused"),
    searchNutCal: document.getElementById("search-nut-cal"),
    searchNutCarbs: document.getElementById("search-nut-carbs"),
    searchNutProtein: document.getElementById("search-nut-protein"),
    searchNutFat: document.getElementById("search-nut-fat"),
    valSearchCal: document.getElementById("val-search-cal"),
    valSearchCarbs: document.getElementById("val-search-carbs"),
    valSearchProtein: document.getElementById("val-search-protein"),
    valSearchFat: document.getElementById("val-search-fat"),
    advContinent: document.getElementById("adv-continent"),
    advRegion: document.getElementById("adv-region"),
    advCountry: document.getElementById("adv-country"),
    advTitle: document.getElementById("adv-title"),
    advIngUsed: document.getElementById("adv-ing-used"),
    advIngNotUsed: document.getElementById("adv-ing-notused"),
    advProcess: document.getElementById("adv-process"),
    advUtensil: document.getElementById("adv-utensil"),
    advShowNutri: document.getElementById("adv-show-nutri"),
    tableSearchInput: document.getElementById("table-search-input"),
    recipesDataTable: document.getElementById("recipes-data-table"),
    tableBodyContainer: document.getElementById("table-body-container"),
    resultsTableTitle: document.getElementById("results-table-title"),
    rowsSelector: document.getElementById("rows-selector"),
    footerItemCounter: document.getElementById("footer-item-counter"),
    btnNavFirst: document.getElementById("btn-nav-first"),
    btnNavPrev: document.getElementById("btn-nav-prev"),
    btnNavNext: document.getElementById("btn-nav-next"),
    btnNavLast: document.getElementById("btn-nav-last"),
    inputGotoPage: document.getElementById("input-goto-page"),
    modalRecipeDetail: document.getElementById("modal-recipe-detail"),
    btnCloseRecipe: document.getElementById("btn-close-recipe"),
    detModalTitle: document.getElementById("det-modal-title"),
    detTime: document.getElementById("det-time"),
    detServings: document.getElementById("det-servings"),
    detRegion: document.getElementById("det-region"),
    detUtensils: document.getElementById("det-utensils"),
    detProcesses: document.getElementById("det-processes"),
    detDietTags: document.getElementById("det-diet-tags"),
    detInstructions: document.getElementById("det-instructions"),
    detNutCal: document.getElementById("det-nut-cal"),
    detNutCarbs: document.getElementById("det-nut-carbs"),
    detNutProtein: document.getElementById("det-nut-protein"),
    detNutFat: document.getElementById("det-nut-fat"),
    detFillCal: document.getElementById("det-fill-cal"),
    detFillCarbs: document.getElementById("det-fill-carbs"),
    detFillProtein: document.getElementById("det-fill-protein"),
    detFillFat: document.getElementById("det-fill-fat"),
    caloriesBarChart: document.getElementById("calories-bar-chart"),
    dietaryProfileStats: document.getElementById("dietary-profile-stats"),
    slideCal: document.getElementById("slide-cal"),
    slideCarbs: document.getElementById("slide-carbs"),
    slideProtein: document.getElementById("slide-protein"),
    slideFat: document.getElementById("slide-fat"),
    valSlideCal: document.getElementById("val-slide-cal"),
    valSlideCarbs: document.getElementById("val-slide-carbs"),
    valSlideProtein: document.getElementById("val-slide-protein"),
    valSlideFat: document.getElementById("val-slide-fat"),
    plannerResults: document.getElementById("planner-results-container"),
    endpointSidebar: document.getElementById("endpoint-sidebar"),
    pgMethodTag: document.getElementById("pg-method-tag"),
    pgUrlInput: document.getElementById("pg-url-input"),
    pgBtnSend: document.getElementById("pg-btn-send"),
    pgParamsContainer: document.getElementById("pg-params-container"),
    pgParamsPanel: document.getElementById("pg-params-panel"),
    pgTabBtnResponse: document.getElementById("pg-tab-btn-response"),
    pgTabBtnHeaders: document.getElementById("pg-tab-btn-headers"),
    pgTabBtnCurl: document.getElementById("pg-tab-btn-curl"),
    consoleMetricStatus: document.getElementById("console-metric-status"),
    consoleMetricTime: document.getElementById("console-metric-time"),
    pgConsoleOutput: document.getElementById("pg-console-output"),
    pgBtnCopyCurl: document.getElementById("pg-btn-copy-curl"),
  };
document.addEventListener("DOMContentLoaded", () => {
  (V(), z(), Z(), H(), O(), j(), W(), E());
});
function V() {
  ((t.settingBaseUrl.value = y.baseUrl),
    (t.settingApiKey.value = y.apiKey),
    U(),
    t.engineToggleGroup.querySelectorAll(".toggle-option").forEach((a) => {
      a.getAttribute("data-engine") === y.engine
        ? a.classList.add("active")
        : a.classList.remove("active");
    }),
    I());
}
function U() {
  const e = y.engine === "mock";
  ((t.engineBadge.textContent = e ? "Mock Sandbox" : "Live Server"),
    (t.engineBadge.className = `badge-engine ${e ? "mock" : "live"}`));
}
function z() {
  (t.tabBtnExplorer.addEventListener("click", () => B("explorer-pane")),
    t.tabBtnAnalytics.addEventListener("click", () => B("analytics-pane")),
    t.tabBtnPlayground.addEventListener("click", () => B("playground-pane")),
    t.brandHome.addEventListener("click", () => B("explorer-pane")),
    t.cuisineCarousel &&
      t.cuisineCarousel.addEventListener("click", (a) => {
        const n = a.target.closest(".carousel-card");
        if (!n) return;
        (t.cuisineCarousel
          .querySelectorAll(".carousel-card")
          .forEach((s) => s.classList.remove("active")),
          n.classList.add("active"));
        const o = n.getAttribute("data-cuisine");
        Y(o);
      }),
    t.btnOpenSettings.addEventListener("click", () => D(t.modalSettings)),
    t.btnCloseSettings.addEventListener("click", () => k(t.modalSettings)),
    t.engineToggleGroup.addEventListener("click", (a) => {
      const n = a.target.closest(".toggle-option");
      n &&
        (t.engineToggleGroup
          .querySelectorAll(".toggle-option")
          .forEach((o) => o.classList.remove("active")),
        n.classList.add("active"));
    }),
    t.btnSaveSettings.addEventListener("click", () => {
      const a = t.engineToggleGroup.querySelector(".toggle-option.active"),
        n = a ? a.getAttribute("data-engine") : "live";
      ((y.engine = n),
        (y.baseUrl = t.settingBaseUrl.value.trim()),
        (y.apiKey = t.settingApiKey.value.trim()),
        U(),
        k(t.modalSettings),
        H(),
        O(),
        E(),
        R(),
        b("Configuration settings updated successfully", "success"));
    }),
    [t.modalSettings, t.modalRecipeDetail].forEach((a) => {
      a.addEventListener("click", (n) => {
        n.target === a && k(a);
      });
    }),
    t.btnCloseRecipe.addEventListener("click", () => k(t.modalRecipeDetail)),
    t.searchTabBtns.forEach((a) => {
      a.addEventListener("click", () => {
        (t.searchTabBtns.forEach((o) => o.classList.remove("active")),
          a.classList.add("active"));
        const n = a.getAttribute("data-search-tab");
        ((i.activeSearchTab = n),
          t.searchTabPanes.forEach((o) => {
            o.classList.toggle("active", o.id === n);
          }));
      });
    }),
    t.btnSubmitSearch.addEventListener("click", () => {
      J();
    }),
    t.searchNutCal.addEventListener("input", (a) => {
      t.valSearchCal.textContent = `${a.target.value} KCal`;
    }),
    t.searchNutCarbs.addEventListener("input", (a) => {
      t.valSearchCarbs.textContent = `${a.target.value}g`;
    }),
    t.searchNutProtein.addEventListener("input", (a) => {
      t.valSearchProtein.textContent = `${a.target.value}g`;
    }),
    t.searchNutFat.addEventListener("input", (a) => {
      t.valSearchFat.textContent = `${a.target.value}g`;
    }),
    t.advShowNutri.addEventListener("change", () => {
      I();
    }));
  let e;
  (t.tableSearchInput.addEventListener("input", () => {
    (clearTimeout(e),
      (e = setTimeout(() => {
        (t.tableSearchInput.value.trim() === "" &&
          ((i.isSorted = !1), (i.currentPage = 1)),
          v());
      }, 200)));
  }),
    t.recipesDataTable.querySelectorAll("thead th.sortable").forEach((a) => {
      a.addEventListener("click", () => {
        const n = a.getAttribute("data-sort");
        (i.sortKey === n
          ? (i.sortDirection = i.sortDirection === "asc" ? "desc" : "asc")
          : ((i.sortKey = n), (i.sortDirection = "asc")),
          t.recipesDataTable
            .querySelectorAll("thead th span.sort-icon")
            .forEach((o) => (o.opacity = "0.4")),
          x(),
          (i.currentPage = 1),
          v());
      });
    }),
    t.rowsSelector.addEventListener("change", (a) => {
      ((i.itemsPerPage = parseInt(a.target.value)), (i.currentPage = 1), v());
    }),
    t.btnNavFirst.addEventListener("click", () => {
      ((i.currentPage = 1), v());
    }),
    t.btnNavPrev.addEventListener("click", () => {
      i.currentPage > 1 && (i.currentPage--, v());
    }),
    t.btnNavNext.addEventListener("click", () => {
      i.currentPage < i.totalPages && (i.currentPage++, v());
    }),
    t.btnNavLast.addEventListener("click", () => {
      ((i.currentPage = i.totalPages), v());
    }),
    t.inputGotoPage.addEventListener("change", (a) => {
      const n = parseInt(a.target.value);
      n >= 1 && n <= i.totalPages && ((i.currentPage = n), v());
    }),
    t.slideCal.addEventListener("input", (a) => {
      ((i.plannerTargets.calories = parseInt(a.target.value)),
        (t.valSlideCal.textContent = `${i.plannerTargets.calories} kcal`),
        E());
    }),
    t.slideCarbs.addEventListener("input", (a) => {
      ((i.plannerTargets.carbs = parseInt(a.target.value)),
        (t.valSlideCarbs.textContent = `${i.plannerTargets.carbs}g`),
        E());
    }),
    t.slideProtein.addEventListener("input", (a) => {
      ((i.plannerTargets.protein = parseInt(a.target.value)),
        (t.valSlideProtein.textContent = `${i.plannerTargets.protein}g`),
        E());
    }),
    t.slideFat.addEventListener("input", (a) => {
      ((i.plannerTargets.fat = parseInt(a.target.value)),
        (t.valSlideFat.textContent = `${i.plannerTargets.fat}g`),
        E());
    }),
    t.pgBtnSend.addEventListener("click", X),
    t.pgTabBtnResponse.addEventListener("click", () => P("response")),
    t.pgTabBtnHeaders.addEventListener("click", () => P("headers")),
    t.pgTabBtnCurl.addEventListener("click", () => P("curl")),
    t.pgBtnCopyCurl.addEventListener("click", () => {
      if (!i.lastResponse) return;
      const a =
        i.consoleTab === "curl"
          ? i.lastResponse.curl
          : i.consoleTab === "headers"
            ? JSON.stringify(i.lastResponse.headers, null, 2)
            : JSON.stringify(i.lastResponse.data, null, 2);
      navigator.clipboard.writeText(a).then(() => {
        ((t.pgBtnCopyCurl.innerHTML = `
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        Copied!
      `),
          setTimeout(() => {
            t.pgBtnCopyCurl.innerHTML = `
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
          Copy
        `;
          }, 1500));
      });
    }));
}
function B(e) {
  ((i.currentTab = e),
    t.tabBtnExplorer.classList.toggle("active", e === "explorer-pane"),
    t.tabBtnAnalytics.classList.toggle("active", e === "analytics-pane"),
    t.tabBtnPlayground.classList.toggle("active", e === "playground-pane"),
    t.explorerPane.classList.toggle("active", e === "explorer-pane"),
    t.analyticsPane.classList.toggle("active", e === "analytics-pane"),
    t.playgroundPane.classList.toggle("active", e === "playground-pane"));
}
function D(e) {
  e.classList.add("active");
}
function k(e) {
  e.classList.remove("active");
}
function I() {
  const e = t.advShowNutri.checked;
  document.querySelectorAll(".nutri-col").forEach((a) => {
    a.classList.toggle("hidden", !e);
  });
}
async function H() {
  const e = await T({ path: "/recipe2-api/recipe/recipeofday" });
  if (e && e.data && e.data.payload) {
    const a = e.data.payload.data;
    ((i.featuredRecipe = a),
      (t.featuredTitle.textContent = a.Recipe_title),
      (t.featuredTime.textContent = `${a.total_time || 45} mins`),
      (t.featuredRegion.textContent = a.Region || "Global"),
      (t.featuredImage.src =
        a.img_url &&
        !a.img_url.includes("geniuskitchen") &&
        !a.img_url.includes("food.com") &&
        !a.img_url.includes("logo") &&
        !a.img_url.includes("placeholder")
          ? a.img_url
          : "assets/chef_cooking.png"),
      (t.featuredBadges.innerHTML = ""));
    const n = (o, s) => {
      const r = document.createElement("span");
      ((r.className = `badge ${s}`),
        (r.textContent = o),
        t.featuredBadges.appendChild(r));
    };
    (parseFloat(a.Calories) && n(`${a.Calories} Calories`, "calories"),
      parseFloat(a.vegan) === 1 && n("Vegan", "vegan"),
      parseFloat(a.lacto_vegetarian) === 1 && n("Lacto-Veg", "vegan"),
      a.Source && n(`Source: ${a.Source}`, ""),
      (t.featuredRecipeContainer.onclick = () => _(a)),
      (t.featuredRecipeContainer.style.cursor = "pointer"));
  }
}
async function O() {
  t.tableBodyContainer.innerHTML = `
    <tr>
      <td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-muted);">
        <div style="margin-bottom: 0.5rem;">Connecting to Central Database...</div>
        <div class="badge-engine live" style="display: inline-block;">Authorization Active</div>
      </td>
    </tr>
  `;
  const e = await T({
    path: "/recipe2-api/recipe/recipesinfo",
    queryParams: { page: 1, limit: 10 },
  });
  if (e && e.data && e.data.payload) {
    const a = e.data.payload.data || [];
    ((i.allFetchedRecipes = a),
      (i.recipesList = [...a]),
      (i.searchCache = null),
      x(),
      (i.isSorted = !1),
      (i.currentPage = 1),
      v(),
      b("Connected to central database", "success"));
  } else {
    b("Failed to load database. Central server offline.", "error");
    t.tableBodyContainer.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 3rem; color: var(--accent-red);"><div style="font-weight: 700; margin-bottom: 0.5rem;">Failed to load database. Central server offline or API key rate-limited.</div><div style="font-size: 0.8rem; color: var(--text-muted);">Check settings to verify your API base URL and key.</div></td></tr>`;
  }
}
function x() {
  ((i.isSorted = !0),
    i.recipesList.sort((e, a) => {
      let n = e[i.sortKey],
        o = a[i.sortKey];
      return (
        i.sortKey === "Calories" ||
        i.sortKey === "servings" ||
        i.sortKey === "Protein (g)" ||
        i.sortKey === "Total lipid (fat) (g)"
          ? ((n = parseFloat(n) || 0), (o = parseFloat(o) || 0))
          : ((n = String(n || "").toLowerCase()),
            (o = String(o || "").toLowerCase())),
        n < o
          ? i.sortDirection === "asc"
            ? -1
            : 1
          : n > o
            ? i.sortDirection === "asc"
              ? 1
              : -1
            : 0
      );
    }));
}
function checkActiveFilters() {
  if (i.activeSearchTab === "tab-cuisine") {
    return t.searchTitle.value.trim() !== "";
  }
  if (i.activeSearchTab === "tab-ingredient") {
    return (
      t.searchIngUsed.value.trim() !== "" ||
      t.searchIngNotUsed.value.trim() !== ""
    );
  }
  if (i.activeSearchTab === "tab-category") {
    return (
      t.searchCatNotUsed.value.trim() !== "" ||
      t.searchCatUsed.value.trim() !== ""
    );
  }
  if (i.activeSearchTab === "tab-nutrition") {
    return true;
  }
  if (i.activeSearchTab === "tab-advanced") {
    return (
      t.advContinent.value.trim() !== "" ||
      t.advRegion.value.trim() !== "" ||
      t.advCountry.value.trim() !== "" ||
      t.advTitle.value.trim() !== "" ||
      t.advIngUsed.value.trim() !== "" ||
      t.advIngNotUsed.value.trim() !== "" ||
      t.advProcess.value.trim() !== "" ||
      t.advUtensil.value.trim() !== ""
    );
  }
  return false;
}

async function populateInstructionsForRecipes(recipes) {
  const batchSize = 15;
  for (let idx = 0; idx < recipes.length; idx += batchSize) {
    const batch = recipes.slice(idx, idx + batchSize);
    await Promise.all(batch.map(async (recipe) => {
      if (!recipe.Recipe_id) return;
      const cacheKey = `recipedb_instructions_${recipe.Recipe_id}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        recipe.instructions = cached;
        return;
      }
      try {
        const res = await T({
          path: `/recipe2-api/instructions/${recipe.Recipe_id}`
        });
        if (res && res.data && res.data.steps) {
          const stepsStr = res.data.steps.join(". ");
          localStorage.setItem(cacheKey, stepsStr);
          recipe.instructions = stepsStr;
        } else {
          recipe.instructions = "";
        }
      } catch (err) {
        recipe.instructions = "";
      }
    }));
    const hasUncached = batch.some(r => !localStorage.getItem(`recipedb_instructions_${r.Recipe_id}`));
    if (hasUncached && idx + batchSize < recipes.length) {
      await new Promise(resolve => setTimeout(resolve, 150));
    }
  }
}

async function v() {
  const e = i.recipesList.length !== i.allFetchedRecipes.length,
    a = t.tableSearchInput.value.trim().toLowerCase();
  if (y.engine === "live") {
    const isFiltering = checkActiveFilters();
    if (isFiltering && i.searchCache) {
      let filtered = [...i.searchCache];
      if (a) {
        filtered = filtered.filter(
          (item) =>
            item.Recipe_title.toLowerCase().includes(a) ||
            (item.Region && item.Region.toLowerCase().includes(a)),
        );
      }
      const totalCount = filtered.length;
      i.totalPages = Math.max(Math.ceil(totalCount / i.itemsPerPage), 1);
      if (i.currentPage > i.totalPages) i.currentPage = i.totalPages;
      const startIndex = (i.currentPage - 1) * i.itemsPerPage;
      const endIndex = Math.min(i.currentPage * i.itemsPerPage, totalCount);
      const slice = filtered.slice(startIndex, endIndex);
      t.tableBodyContainer.innerHTML = "";
      if (slice.length === 0) {
        t.tableBodyContainer.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">No matches found.</td></tr>`;
      }
      M(slice);
      L(startIndex, endIndex, totalCount);
      return;
    }
    t.tableBodyContainer.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem;">
          <div class="loading-spinner" style="margin: 0 auto 0.5rem auto;"></div>
          <span style="font-size:0.8rem; color:var(--text-muted);">${isFiltering ? "Searching live catalog (fetching multiple pages)..." : "Fetching recipes from live catalog..."}</span>
        </td>
      </tr>
    `;
    try {
      let path = "/recipe2-api/recipe/recipesinfo";
      let queryParams = { 
        page: i.currentPage, 
        limit: i.itemsPerPage 
      };
      let responseKey = "payload";
      
      let activeCuisineQuery = "";
      const fullCountryToRegionMap = {
        "Moroccan": "Northern Africa", "Egyptian": "Middle Eastern", "Nigerian": "Rest Africa", "Rest Middle Eastern": "Middle Eastern", "Chinese": "Chinese and Mongolian", "Thai": "Thai", "Indonesian": "Southeast Asian", "Bangladeshi": "Indian Subcontinent", "Vietnamese": "Southeast Asian", "Lebanese": "Middle Eastern", "Israeli": "Middle Eastern", "Filipino": "Southeast Asian", "Indian": "Indian Subcontinent", "Korean": "Korean", "Malaysian": "Southeast Asian", "Turkish": "Middle Eastern", "Japanese": "Japanese", "Australian": "Australian", "Pakistani": "Indian Subcontinent", "Mexican": "Mexican", "Rest Caribbean": "Caribbean", "Puerto Rican": "Caribbean", "Jamaican": "Caribbean", "Cuban": "Caribbean", "Argentine": "South American", "Brazilian": "South American", "Peruvian": "South American", "Chilean": "South American", "Russian": "Eastern European", "Colombian": "South American", "Danish": "Scandinavian", "English": "UK", "Hungarian": "Eastern European", "Swedish": "Scandinavian", "Scottish": "UK", "UK": "UK", "Belgian": "Belgian", "Welsh": "UK", "Norwegian": "Scandinavian", "Austrian": "Deutschland", "Greek": "Greek", "French": "French", "Swiss": "Deutschland", "Portuguese": "Spanish and Portuguese", "Italian": "Italian", "Polish": "Eastern European", "Dutch": "Belgian", "Irish": "Irish", "German": "Deutschland", "Rest Eastern European": "Eastern European", "Spanish": "Spanish and Portuguese", "Finnish": "Scandinavian", "Czech": "Eastern European", "US": "US", "Canadian": "Canadian", "Somalian": "Rest Africa", "Namibian": "Rest Africa", "Angolan": "Rest Africa", "Libyan": "Northern Africa", "Sudanese": "Rest Africa", "Ethiopian": "Rest Africa", "Laotian": "Middle Eastern", "Nepalese": "Indian Subcontinent", "Cambodian": "Southeast Asian", "Palestinian": "Middle Eastern", "Saudi Arabian": "Middle Eastern", "Mongolian": "Chinese and Mongolian", "Iraqi": "Middle Eastern", "New Zealander": "Australian", "Honduran": "Central American", "Costa Rican": "Central American", "Guatemalan": "Central American", "Ecuadorean": "South American", "Venezuelan": "South American", "Icelandic": "Scandinavian"
      };
      const continentToDefaultRegionMap = {
        "Asian": "Indian Subcontinent",
        "European": "Italian",
        "Latin American": "Mexican",
        "North American": "Canadian",
        "Australasian": "Australian",
        "African": "Rest Africa"
      };

      if (i.activeSearchTab === "tab-cuisine") {
        const continentInput = t.searchRegion.value.trim();
        const countryInput = t.searchCountry.value.trim();
        if (countryInput) {
          activeCuisineQuery = fullCountryToRegionMap[countryInput] || countryInput;
        } else if (continentInput) {
          activeCuisineQuery = continentToDefaultRegionMap[continentInput] || continentInput;
        }
      } else if (i.activeSearchTab === "tab-advanced") {
        const advReg = t.advRegion.value.trim();
        const advCou = t.advCountry.value.trim();
        if (advReg) {
          activeCuisineQuery = advReg;
        } else if (advCou) {
          activeCuisineQuery = fullCountryToRegionMap[advCou] || advCou;
        }
      }

      if (activeCuisineQuery) {
        path = `/recipe2-api/recipes_cuisine/cuisine/${encodeURIComponent(activeCuisineQuery)}`;
        queryParams = { 
          page: i.currentPage, 
          page_size: i.itemsPerPage 
        };
        const countryInput = t.searchCountry.value.trim();
        if (countryInput) {
          queryParams.subRegion = countryInput;
        }
        responseKey = "root";
      } else if (i.searchType === "cuisine" && (i.searchValType === "region" || i.searchValType === "country")) {
        let cuisineVal = i.searchVal || "US";
        const fullCountryToRegionMap = {
          "Moroccan": "Northern Africa", "Egyptian": "Middle Eastern", "Nigerian": "Rest Africa", "Rest Middle Eastern": "Middle Eastern", "Chinese": "Chinese and Mongolian", "Thai": "Thai", "Indonesian": "Southeast Asian", "Bangladeshi": "Indian Subcontinent", "Vietnamese": "Southeast Asian", "Lebanese": "Middle Eastern", "Israeli": "Middle Eastern", "Filipino": "Southeast Asian", "Indian": "Indian Subcontinent", "Korean": "Korean", "Malaysian": "Southeast Asian", "Turkish": "Middle Eastern", "Japanese": "Japanese", "Australian": "Australian", "Pakistani": "Indian Subcontinent", "Mexican": "Mexican", "Rest Caribbean": "Caribbean", "Puerto Rican": "Caribbean", "Jamaican": "Caribbean", "Cuban": "Caribbean", "Argentine": "South American", "Brazilian": "South American", "Peruvian": "South American", "Chilean": "South American", "Russian": "Eastern European", "Colombian": "South American", "Danish": "Scandinavian", "English": "UK", "Hungarian": "Eastern European", "Swedish": "Scandinavian", "Scottish": "UK", "UK": "UK", "Belgian": "Belgian", "Welsh": "UK", "Norwegian": "Scandinavian", "Austrian": "Deutschland", "Greek": "Greek", "French": "French", "Swiss": "Deutschland", "Portuguese": "Spanish and Portuguese", "Italian": "Italian", "Polish": "Eastern European", "Dutch": "Belgian", "Irish": "Irish", "German": "Deutschland", "Rest Eastern European": "Eastern European", "Spanish": "Spanish and Portuguese", "Finnish": "Scandinavian", "Czech": "Eastern European", "US": "US", "Canadian": "Canadian", "Somalian": "Rest Africa", "Namibian": "Rest Africa", "Angolan": "Rest Africa", "Libyan": "Northern Africa", "Sudanese": "Rest Africa", "Ethiopian": "Rest Africa", "Laotian": "Middle Eastern", "Nepalese": "Indian Subcontinent", "Cambodian": "Southeast Asian", "Palestinian": "Middle Eastern", "Saudi Arabian": "Middle Eastern", "Mongolian": "Chinese and Mongolian", "Iraqi": "Middle Eastern", "New Zealander": "Australian", "Honduran": "Central American", "Costa Rican": "Central American", "Guatemalan": "Central American", "Ecuadorean": "South American", "Venezuelan": "South American", "Icelandic": "Scandinavian"
        };
        const continentToDefaultRegionMap = {
          "Asian": "Indian Subcontinent",
          "European": "Italian",
          "Latin American": "Mexican",
          "North American": "Canadian",
          "Australasian": "Australian",
          "African": "Rest Africa"
        };
        let queryVal = cuisineVal;
        if (fullCountryToRegionMap[cuisineVal]) {
          cuisineVal = fullCountryToRegionMap[cuisineVal];
        } else if (continentToDefaultRegionMap[cuisineVal]) {
          cuisineVal = continentToDefaultRegionMap[cuisineVal];
        }
        path = `/recipe2-api/recipes_cuisine/cuisine/${encodeURIComponent(cuisineVal)}`;
        queryParams = { 
          page: i.currentPage, 
          page_size: i.itemsPerPage 
        };
        if (i.searchValType === "country") {
          queryParams.subRegion = queryVal;
        }
        responseKey = "root";
      } else if (i.searchType === "category") {
        path = "/recipe2-api/recipe/recipesinfo";
        queryParams = { page: i.currentPage, limit: 10 };
      }

      if (isFiltering) {
        let allRecipes = [];
        const numPagesToFetch = 100;
        const limitKey = responseKey === "root" ? "page_size" : "limit";
        
        async function fetchPageWithRetry(pIndex) {
          const qParams = {
            ...queryParams,
            page: pIndex,
            [limitKey]: 10
          };
          if (qParams.category === "") delete qParams.category;
          
          let attempts = 0;
          while (attempts < 5) {
            const r = await T({ path, queryParams: qParams });
            if (r && r.status === 429) {
              attempts++;
              await new Promise(res => setTimeout(res, 300 * attempts));
              continue;
            }
            return r;
          }
          return null;
        }

        const batchSize = 10;
        let shouldStop = false;
        for (let batchStart = 1; batchStart <= numPagesToFetch; batchStart += batchSize) {
          if (shouldStop) break;
          const batchEnd = Math.min(batchStart + batchSize - 1, numPagesToFetch);
          const promises = [];
          for (let p = batchStart; p <= batchEnd; p++) {
            promises.push(fetchPageWithRetry(p));
          }
          const results = await Promise.all(promises);
          for (let idx = 0; idx < results.length; idx++) {
            const r = results[idx];
            if (r && r.data) {
              let data = [];
              if (responseKey === "root") {
                data = r.data.data || [];
              } else {
                const payload = r.data.payload || {};
                data = payload.data || [];
              }
              allRecipes = allRecipes.concat(data);
              if (data.length === 0) {
                shouldStop = true;
              }
            } else {
              shouldStop = true;
            }
          }
        }

        const needsInstr = (() => {
          if (i.activeSearchTab === "tab-ingredient") {
            return t.searchIngUsed.value.trim() !== "" || t.searchIngNotUsed.value.trim() !== "";
          }
          if (i.activeSearchTab === "tab-category") {
            return t.searchCatUsed.value.trim() !== "" || t.searchCatNotUsed.value.trim() !== "";
          }
          if (i.activeSearchTab === "tab-advanced") {
            return t.advIngUsed.value.trim() !== "" || t.advIngNotUsed.value.trim() !== "";
          }
          return false;
        })();

        if (needsInstr) {
          await populateInstructionsForRecipes(allRecipes);
        }

        let data = [...allRecipes];
        if (i.activeSearchTab === "tab-cuisine") {
          const titleVal = t.searchTitle.value.trim().toLowerCase();
          if (titleVal)
            data = data.filter((item) =>
              item.Recipe_title.toLowerCase().includes(titleVal),
            );
          const continentVal = t.searchRegion.value.trim().toLowerCase();
          if (continentVal)
            data = data.filter((item) => {
              const c = (item.Continent || "").toLowerCase();
              return c && c.includes(continentVal);
            });
          const countryVal = t.searchCountry.value.trim().toLowerCase();
          if (countryVal)
            data = data.filter((item) => {
              const sr = (item.Sub_region || "").toLowerCase();
              return sr && sr.includes(countryVal);
            });
        } else if (i.activeSearchTab === "tab-ingredient") {
          const usedIng = t.searchIngUsed.value
              .trim()
              .toLowerCase()
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean),
            exIng = t.searchIngNotUsed.value
              .trim()
              .toLowerCase()
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean);
          if (usedIng.length > 0) {
            data = data.filter((item) =>
              usedIng.every(
                (ing) =>
                  item.Recipe_title.toLowerCase().includes(ing) ||
                  (item.instructions &&
                    item.instructions.toLowerCase().includes(ing)),
              ),
            );
          }
          if (exIng.length > 0) {
            data = data.filter(
              (item) =>
                !exIng.some(
                  (ing) =>
                    item.Recipe_title.toLowerCase().includes(ing) ||
                    (item.instructions &&
                      item.instructions.toLowerCase().includes(ing)),
                ),
            );
          }
        } else if (i.activeSearchTab === "tab-category") {
          const usedCat = t.searchCatUsed.value.trim().toLowerCase();
          const exCat = t.searchCatNotUsed.value.trim().toLowerCase();
          if (usedCat) {
            data = data.filter((item) => {
              const reg = (item.Region || "").toLowerCase();
              const title = (item.Recipe_title || "").toLowerCase();
              const instr = (item.instructions || "").toLowerCase();
              const isDairy = usedCat === "dairy" || usedCat === "diary";
              const isLacto = parseFloat(item.lacto_vegetarian) === 1 || parseFloat(item.ovo_lacto_vegetarian) === 1;
              return reg.includes(usedCat) || 
                     title.includes(usedCat) ||
                     instr.includes(usedCat) ||
                     (parseFloat(item.vegan) === 1 && usedCat === "vegan") || 
                     (isLacto && usedCat.includes("veg")) ||
                     (isDairy && isLacto);
            });
          }
          if (exCat) {
            data = data.filter((item) => {
              const reg = (item.Region || "").toLowerCase();
              const title = (item.Recipe_title || "").toLowerCase();
              const instr = (item.instructions || "").toLowerCase();
              return !(reg.includes(exCat) || title.includes(exCat) || instr.includes(exCat));
            });
          }
        } else if (i.activeSearchTab === "tab-nutrition") {
          const maxCal = parseInt(t.searchNutCal.value),
            maxCarbs = parseInt(t.searchNutCarbs.value),
            minProt = parseInt(t.searchNutProtein.value),
            maxFat = parseInt(t.searchNutFat.value);
          data = data.filter((item) => {
            const c = parseFloat(item.Calories) || 120,
              carb = parseFloat(item["Carbohydrate, by difference (g)"]) || 30,
              prot = parseFloat(item["Protein (g)"]) || 10,
              fat = parseFloat(item["Total lipid (fat) (g)"]) || 5;
            return (
              c <= maxCal &&
              carb <= maxCarbs &&
              prot >= minProt &&
              fat <= maxFat
            );
          });
        } else if (i.activeSearchTab === "tab-advanced") {
          const contVal = t.advContinent.value.trim().toLowerCase(),
            regVal = t.advRegion.value.trim().toLowerCase(),
            countryVal = t.advCountry.value.trim().toLowerCase(),
            titleVal = t.advTitle.value.trim().toLowerCase(),
            usedIng = t.advIngUsed.value
              .trim()
              .toLowerCase()
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean),
            exIng = t.advIngNotUsed.value
              .trim()
              .toLowerCase()
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean),
            procVal = t.advProcess.value.trim().toLowerCase(),
            utVal = t.advUtensil.value.trim().toLowerCase();
          if (contVal) {
            data = data.filter((item) =>
              (item.Continent || "").toLowerCase().includes(contVal),
            );
          }
          if (regVal) {
            data = data.filter((item) =>
              (item.Region || "").toLowerCase().includes(regVal),
            );
          }
          if (countryVal) {
            data = data.filter((item) => {
              const sr = (item.Sub_region || "").toLowerCase();
              return sr && sr.includes(countryVal);
            });
          }
          if (titleVal) {
            data = data.filter((item) =>
              item.Recipe_title.toLowerCase().includes(titleVal),
            );
          }
          if (usedIng.length > 0) {
            data = data.filter((item) =>
              usedIng.every(
                (ing) =>
                  item.Recipe_title.toLowerCase().includes(ing) ||
                  (item.instructions &&
                    item.instructions.toLowerCase().includes(ing)),
              ),
            );
          }
          if (exIng.length > 0) {
            data = data.filter(
              (item) =>
                !exIng.some(
                  (ing) =>
                    item.Recipe_title.toLowerCase().includes(ing) ||
                    (item.instructions &&
                      item.instructions.toLowerCase().includes(ing)),
                ),
            );
          }
          if (procVal) {
            data = data.filter((item) =>
              (item.Processes || "").toLowerCase().includes(procVal),
            );
          }
          if (utVal) {
            data = data.filter((item) =>
              (item.Utensils || "").toLowerCase().includes(utVal),
            );
          }
        }

        i.searchCache = [...data];
        const totalCount = data.length;
        i.totalPages = Math.max(Math.ceil(totalCount / i.itemsPerPage), 1);
        i.recipesList = [...data];
        let displayData = [...data];
        if (a) {
          displayData = displayData.filter(
            (item) =>
              item.Recipe_title.toLowerCase().includes(a) ||
              (item.Region && item.Region.toLowerCase().includes(a)),
          );
        }
        const startIndex = 0;
        const endIndex = Math.min(i.itemsPerPage, displayData.length);
        const slice = displayData.slice(startIndex, endIndex);
        t.tableBodyContainer.innerHTML = "";
        if (slice.length === 0) {
          t.tableBodyContainer.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">No matches found.</td></tr>`;
        }
        M(slice);
        L(startIndex, endIndex, displayData.length);
        return;
      }

      const d = await T({ path, queryParams });
      if (d && d.data) {
        let data = [];
        let totalCount = 118083;
        if (responseKey === "root") {
          data = d.data.data || [];
          totalCount = d.data.totalResults || data.length;
        } else {
          const payload = d.data.payload || {};
          data = payload.data || [];
          const pagination = payload.pagination || {};
          totalCount = pagination.totalCount || data.length;
        }
        i.totalPages = responseKey === "root"
          ? d.data.totalPages || Math.ceil(totalCount / i.itemsPerPage)
          : (d.data.payload && d.data.payload.pagination ? d.data.payload.pagination.totalPages : Math.ceil(totalCount / i.itemsPerPage));
        i.recipesList = [...data];
        i.allFetchedRecipes = [...data];
        if (a) {
          data = data.filter(
            (item) =>
              item.Recipe_title.toLowerCase().includes(a) ||
              (item.Region && item.Region.toLowerCase().includes(a)),
          );
        }
        t.tableBodyContainer.innerHTML = "";
        M(data);
        const f = (i.currentPage - 1) * i.itemsPerPage,
          m = f + data.length;
        L(f, m, totalCount);
        return;
      }
    } catch (d) {
      console.error("Live fetch failed:", d);
      t.tableBodyContainer.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">Failed to query live database. API key may be rate-limited.</td></tr>`;
      return;
    }
  }
  let o = [...i.recipesList];
  a &&
    (o = o.filter(
      (d) =>
        d.Recipe_title.toLowerCase().includes(a) ||
        (d.Region && d.Region.toLowerCase().includes(a)) ||
        (d.Country && d.Country.toLowerCase().includes(a)),
    ));
  const s = o.length;
  ((i.totalPages = Math.max(Math.ceil(s / i.itemsPerPage), 1)),
    i.currentPage > i.totalPages && (i.currentPage = i.totalPages));
  const r = (i.currentPage - 1) * i.itemsPerPage,
    u = Math.min(i.currentPage * i.itemsPerPage, s),
    p = o.slice(r, u);
  if (((t.tableBodyContainer.innerHTML = ""), p.length === 0)) {
    ((t.tableBodyContainer.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No data matches search parameters.
        </td>
      </tr>
    `),
      L(0, 0, 0));
    return;
  }
  (M(p), L(r, u, s));
}
async function populateDetailsForSlice(slice) {
  if (y.engine === "mock") return;
  const needsFetch = slice.filter(
    (recipe) => recipe.Recipe_id && (recipe.Calories === undefined || recipe.servings === undefined)
  );
  if (needsFetch.length === 0) return;
  await Promise.all(
    needsFetch.map(async (recipe) => {
      try {
        const res = await T({
          path: `/recipe2-api/search-recipe/${recipe.Recipe_id}`
        });
        if (res && res.data && res.data.recipe) {
          Object.assign(recipe, res.data.recipe);
        }
      } catch (err) {
        console.warn("Failed to populate detailed recipe:", recipe.Recipe_id, err);
      }
    })
  );
}
async function M(e) {
  const renderPage = i.currentPage;
  await populateDetailsForSlice(e);
  if (renderPage !== i.currentPage) return;
  t.tableBodyContainer.innerHTML = "";
  if (e.length === 0) {
    t.tableBodyContainer.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No data matches search parameters.
        </td>
      </tr>
    `;
    return;
  }
  e.forEach((a) => {
    const n = document.createElement("tr"),
      o = parseFloat(a.vegan) === 1 || parseFloat(a.lacto_vegetarian) === 1,
      s = a["Protein (g)"] || 10,
      r = a["Total lipid (fat) (g)"] || 5;
    n.innerHTML = `
      <td style="font-weight: 700; color: var(--text-primary);">
        ${a.Recipe_title}
        <span style="display:block; font-size:0.7rem; color:var(--text-muted); font-weight:normal;">
          ${o ? "Vegetarian" : "Standard"}
        </span>
      </td>
      <td>${a.Region || "Global"}</td>
      <td>${a.Sub_region || a.Region || "Global"}</td>
      <td>${a.servings || "4"}</td>
      <td style="font-weight:700; color:var(--accent-orange);">${parseFloat(a.Calories || 100).toFixed(0)}</td>
      <td class="nutri-col hidable-col">${parseFloat(s).toFixed(1)}g</td>
      <td class="nutri-col hidable-col">${parseFloat(r).toFixed(1)}g</td>
      <td>
        <button class="btn-view-details" style="padding: 0.25rem 0.5rem; font-size:0.75rem;">
          Details
        </button>
      </td>
    `;
    n.querySelector(".btn-view-details").addEventListener("click", () => _(a));
    t.tableBodyContainer.appendChild(n);
  });
  I();
}
function L(e, a, n) {
  ((t.footerItemCounter.textContent =
    n > 0 ? `${e + 1}-${a} of ${n}` : "0-0 of 0"),
    (t.btnNavFirst.disabled = i.currentPage === 1),
    (t.btnNavPrev.disabled = i.currentPage === 1),
    (t.btnNavNext.disabled = i.currentPage === i.totalPages),
    (t.btnNavLast.disabled = i.currentPage === i.totalPages),
    (t.inputGotoPage.value = i.currentPage),
    (t.inputGotoPage.max = i.totalPages));
}
function J() {
  i.searchCache = null;
  ((t.btnSubmitSearch.textContent = "Searching..."),
    (t.btnSubmitSearch.style.opacity = "0.7"));
  if (y.engine === "live") {
    if (i.activeSearchTab === "tab-cuisine") {
      const a = t.searchRegion.value.trim(),
        n = t.searchCountry.value.trim(),
        title = t.searchTitle.value.trim();
      if (n) {
        i.searchType = "cuisine";
        i.searchValType = "country";
        i.searchVal = n;
      } else if (a) {
        i.searchType = "cuisine";
        i.searchValType = "region";
        i.searchVal = a;
      } else {
        i.searchType = null;
        i.searchValType = null;
        i.searchVal = null;
      }
      t.resultsTableTitle.textContent = title 
        ? `Showing Cuisine matches (Region: "${n || a || "any"}", Title: "${title}")`
        : `Showing Cuisine matches (Region: "${n || a || "any"}")`;
    } else if (i.activeSearchTab === "tab-category") {
      const a = t.searchCatUsed.value.trim();
      const ex = t.searchCatNotUsed.value.trim();
      if (a) {
        i.searchType = "category";
        i.searchVal = a;
      } else {
        i.searchType = null;
        i.searchVal = null;
      }
      t.resultsTableTitle.textContent = `Filtered Category (Used: "${a || "any"}", Excluded: "${ex || "none"}")`;
    } else if (i.activeSearchTab === "tab-ingredient") {
      const a = t.searchIngUsed.value.trim().split(",").filter(Boolean),
        n = t.searchIngNotUsed.value.trim().split(",").filter(Boolean);
      i.searchType = "ingredient";
      i.searchVal = t.searchIngUsed.value.trim() || "any";
      t.resultsTableTitle.textContent = `Filtered Ingredients (Used: ${a.length}, Excluded: ${n.length})`;
    } else {
      i.searchType = null;
      i.searchVal = null;
      t.resultsTableTitle.textContent = "Live catalog recipes";
    }
    i.currentPage = 1;
    v();
    setTimeout(() => {
      ((t.btnSubmitSearch.textContent = "Submit Search"),
        (t.btnSubmitSearch.style.opacity = "1"));
    }, 350);
    return;
  }
  let e = [...i.allFetchedRecipes];
  if (i.activeSearchTab === "tab-cuisine") {
    const a = t.searchRegion.value.trim().toLowerCase(),
      n = t.searchCountry.value.trim().toLowerCase(),
      o = t.searchTitle.value.trim().toLowerCase();
    (a && (e = e.filter((s) => (s.Region || "").toLowerCase().includes(a))),
      n &&
        (e = e.filter((s) =>
          (s.Sub_region || s.Region || "").toLowerCase().includes(n),
        )),
      o &&
        (e = e.filter((s) => (s.Recipe_title || "").toLowerCase().includes(o))),
      (t.resultsTableTitle.textContent = `Showing Cuisine matches (Region: "${a || "any"}", Title: "${o || "any"}")`));
  } else if (i.activeSearchTab === "tab-ingredient") {
    const a = t.searchIngUsed.value
        .trim()
        .toLowerCase()
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean),
      n = t.searchIngNotUsed.value
        .trim()
        .toLowerCase()
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
    (a.length > 0 &&
      (e = e.filter((o) =>
        a.every(
          (s) =>
            (o.Recipe_title || "").toLowerCase().includes(s) ||
            (o.instructions || "").toLowerCase().includes(s),
        ),
      )),
      n.length > 0 &&
        (e = e.filter(
          (o) =>
            !n.some(
              (s) =>
                (o.Recipe_title || "").toLowerCase().includes(s) ||
                (o.instructions || "").toLowerCase().includes(s),
            ),
        )),
      (t.resultsTableTitle.textContent = `Filtered Ingredients (Used: ${a.length}, Excluded: ${n.length})`));
  } else if (i.activeSearchTab === "tab-category") {
    const a = t.searchCatUsed.value.trim().toLowerCase(),
      n = t.searchCatNotUsed.value.trim().toLowerCase();
    (a &&
      (e = e.filter(
        (o) =>
          (o.Region || "").toLowerCase().includes(a) ||
          (parseFloat(o.vegan) === 1 && a === "vegan") ||
          (parseFloat(o.lacto_vegetarian) === 1 && a.includes("veg")),
      )),
      n &&
        (e = e.filter(
          (o) =>
            !(o.Region || "").toLowerCase().includes(n) &&
            !(parseFloat(o.vegan) === 1 && n === "vegan"),
        )),
      (t.resultsTableTitle.textContent = "Diet categories filtered results"));
  } else if (i.activeSearchTab === "tab-nutrition") {
    const a = parseInt(t.searchNutCal.value),
      n = parseInt(t.searchNutCarbs.value),
      o = parseInt(t.searchNutProtein.value),
      s = parseInt(t.searchNutFat.value);
    ((e = e.filter((r) => {
      const u = parseFloat(r.Calories) || 120,
        p = parseFloat(r["Carbohydrate, by difference (g)"]) || 30,
        d = parseFloat(r["Protein (g)"]) || 10,
        l = parseFloat(r["Total lipid (fat) (g)"]) || 5;
      return u <= a && p <= n && d >= o && l <= s;
    })),
      (t.resultsTableTitle.textContent = "Nutritional thresholds matches"));
  } else if (i.activeSearchTab === "tab-advanced") {
    const a = t.advContinent.value.trim().toLowerCase(),
      n = t.advRegion.value.trim().toLowerCase(),
      o = t.advCountry.value.trim().toLowerCase(),
      s = t.advTitle.value.trim().toLowerCase(),
      r = t.advIngUsed.value
        .trim()
        .toLowerCase()
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
      u = t.advIngNotUsed.value
        .trim()
        .toLowerCase()
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
      p = t.advProcess.value.trim().toLowerCase(),
      d = t.advUtensil.value.trim().toLowerCase();
    (a && (e = e.filter((l) => (l.Continent || "").toLowerCase().includes(a))),
      n && (e = e.filter((l) => (l.Region || "").toLowerCase().includes(n))),
      o &&
        (e = e.filter((l) => {
          const sr = (l.Sub_region || "").toLowerCase();
          return sr && sr.includes(o);
        })),
      s &&
        (e = e.filter((l) => (l.Recipe_title || "").toLowerCase().includes(s))),
      r.length > 0 &&
        (e = e.filter((l) =>
          r.every(
            (c) =>
              (l.Recipe_title || "").toLowerCase().includes(c) ||
              (l.instructions || "").toLowerCase().includes(c),
          ),
        )),
      u.length > 0 &&
        (e = e.filter(
          (l) =>
            !u.some(
              (c) =>
                (l.Recipe_title || "").toLowerCase().includes(c) ||
                (l.instructions || "").toLowerCase().includes(c),
            ),
        )),
      p && (e = e.filter((l) => (l.Processes || "").toLowerCase().includes(p))),
      d && (e = e.filter((l) => (l.Utensils || "").toLowerCase().includes(d))),
      (t.resultsTableTitle.textContent =
        "Advanced Composite parameters matches"));
  }
  ((i.recipesList = e),
    e.length === i.allFetchedRecipes.length ? (i.isSorted = !1) : x(),
    (i.currentPage = 1),
    v(),
    setTimeout(() => {
      ((t.btnSubmitSearch.textContent = "Submit Search"),
        (t.btnSubmitSearch.style.opacity = "1"));
    }, 350));
}
async function _(e) {
  if (e.Recipe_id && (!e.instructions || e.instructions.trim() === "")) {
    const cacheKey = `recipedb_instructions_${e.Recipe_id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      e.instructions = cached;
    } else {
      try {
        const res = await T({
          path: `/recipe2-api/instructions/${e.Recipe_id}`
        });
        if (res && res.data && res.data.steps) {
          const stepsStr = res.data.steps.join(". ");
          localStorage.setItem(cacheKey, stepsStr);
          e.instructions = stepsStr;
        }
      } catch (err) {
        console.warn("Could not load instructions", err);
      }
    }
  }
  ((t.detModalTitle.textContent = e.Recipe_title),
    (t.detTime.textContent = `${e.total_time || 30} mins`),
    (t.detServings.textContent = e.servings || "4 servings"),
    (t.detRegion.textContent = e.Region || "Global"),
    (t.detUtensils.innerHTML = ""),
    (e.Utensils ? e.Utensils.split("||") : ["saucepan", "spoon"]).forEach(
      (f) => {
        const m = document.createElement("span");
        ((m.className = "badge"),
          (m.textContent = f),
          t.detUtensils.appendChild(m));
      },
    ),
    (t.detProcesses.innerHTML = ""),
    (e.Processes ? e.Processes.split("||") : ["cook", "heat"]).forEach((f) => {
      const m = document.createElement("span");
      ((m.className = "badge"),
        (m.style.borderColor = "rgba(168, 85, 247, 0.2)"),
        (m.style.color = "var(--accent-purple)"),
        (m.textContent = f),
        t.detProcesses.appendChild(m));
    }),
    (t.detDietTags.innerHTML = ""));
  const o = (f, m) => {
    const C = document.createElement("span");
    ((C.className = `badge ${m}`),
      (C.textContent = f),
      t.detDietTags.appendChild(C));
  };
  (parseFloat(e.vegan) === 1 && o("Vegan", "vegan"),
    parseFloat(e.lacto_vegetarian) === 1 && o("Lacto-Veg", "vegan"),
    parseFloat(e.pescetarian) === 1 && o("Pescetarian", ""),
    parseFloat(e.Calories) < 200 && o("Low Calorie", "calories"),
    (t.detInstructions.innerHTML = ""));
  let s = [];
  (e.instructions
    ? (s = e.instructions.split(/\.\s+/).filter((f) => f.trim() !== ""))
    : (s = [
        "Prepare and clean all required ingredients.",
        "Blend, chop, and process according to ingredients profile.",
        "Heat ingredients in active cooking pans.",
        "Serve warm and enjoy your culinary creation!",
      ]),
    s.forEach((f, m) => {
      const C = f.endsWith(".") ? f : `${f}.`,
        S = document.createElement("div");
      ((S.className = "instruction-step"),
        (S.innerHTML = `
      <div class="step-num">${m + 1}</div>
      <div>${C}</div>
    `),
        t.detInstructions.appendChild(S));
    }));
  const r = e["Energy (kcal)"] || parseFloat(e.Calories) * 4 || 200,
    u = e["Carbohydrate, by difference (g)"] || 30,
    p = e["Protein (g)"] || 15,
    d = e["Total lipid (fat) (g)"] || 10;
  ((t.detNutCal.textContent = `${parseFloat(r).toFixed(1)} kcal`),
    (t.detNutCarbs.textContent = `${parseFloat(u).toFixed(1)}g`),
    (t.detNutProtein.textContent = `${parseFloat(p).toFixed(1)}g`),
    (t.detNutFat.textContent = `${parseFloat(d).toFixed(1)}g`));
  const l = Math.min((parseFloat(r) / 1200) * 100, 100),
    c = Math.min((parseFloat(u) / 300) * 100, 100),
    g = Math.min((parseFloat(p) / 100) * 100, 100),
    h = Math.min((parseFloat(d) / 80) * 100, 100);
  ((t.detFillCal.style.width = `${l}%`),
    (t.detFillCarbs.style.width = `${c}%`),
    (t.detFillProtein.style.width = `${g}%`),
    (t.detFillFat.style.width = `${h}%`),
    D(t.modalRecipeDetail));
}
function j() {
  const e = A.averageCaloriesByContinent,
    a = 450,
    n = 230,
    o = 40,
    s = a - o * 2,
    r = n - o * 2,
    u = Math.max(...e.map((l) => l.calories));
  let p = `<svg viewBox="0 0 ${a} ${n}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;
  for (let l = 0; l <= 4; l++) {
    const c = o + (r / 4) * l,
      g = Math.round(u - (u / 4) * l);
    p += `
      <line x1="${o}" y1="${c}" x2="${a - o}" y2="${c}" stroke="var(--border-color)" stroke-width="1" />
      <text x="${o - 8}" y="${c + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end" font-family="var(--font-sans)">${g}</text>
    `;
  }
  const d = s / e.length - 12;
  (e.forEach((l, c) => {
    const g = o + (s / e.length) * c + 6,
      h = (l.calories / u) * r,
      f = n - o - h,
      isMax = l.calories === u,
      gradId = `bar-grad-${c}`;
    p += `
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${isMax ? "var(--accent-cyan)" : "#3F3F46"}" />
          <stop offset="100%" stop-color="${isMax ? "rgba(34,197,94,0.15)" : "#27272A"}" />
        </linearGradient>
      </defs>
      <rect x="${g}" y="${f}" width="${d}" height="${h}" fill="url(#${gradId})" stroke="${isMax ? "var(--accent-cyan)" : "var(--border-color)"}" stroke-width="1" rx="4" ry="4" style="transition: all 0.3s;" />
      <text x="${g + d / 2}" y="${f - 6}" fill="${isMax ? "var(--accent-cyan)" : "var(--text-primary)"}" font-size="10" font-weight="700" text-anchor="middle" font-family="var(--font-sans)">${l.calories}</text>
      <text x="${g + d / 2}" y="${n - o + 16}" fill="var(--text-secondary)" font-size="9.5" text-anchor="middle" font-family="var(--font-sans)">${l.continent}</text>
    `;
  }),
    (p += `
    <line x1="${o}" y1="${n - o}" x2="${a - o}" y2="${n - o}" stroke="var(--border-color)" stroke-width="1.5" />
  </svg>`),
    (t.caloriesBarChart.innerHTML = p));
}
function W() {
  const e = A.dietaryPrevalence;
  ((t.dietaryProfileStats.innerHTML = ""),
    e.forEach((a) => {
      const n = document.createElement("div");
      ((n.className = "stats-pill"),
        (n.innerHTML = `
      <span class="stats-pill-name">${a.category}</span>
      <span class="stats-pill-val">${a.count.toLocaleString()} recipes</span>
    `),
        t.dietaryProfileStats.appendChild(n));
    }));
}
function E() {
  const e = [...i.allFetchedRecipes],
    a = i.plannerTargets,
    n = e.filter((o) => {
      const s = parseFloat(o.Calories) || 120,
        r = parseFloat(o["Carbohydrate, by difference (g)"]) || 30,
        u = parseFloat(o["Protein (g)"]) || 10,
        p = parseFloat(o["Total lipid (fat) (g)"]) || 5;
      return s <= a.calories && r <= a.carbs && u >= a.protein && p <= a.fat;
    });
  if (((t.plannerResults.innerHTML = ""), n.length === 0)) {
    t.plannerResults.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.8rem;">
        No recipes match current target constraints. Try raising limits.
      </div>
    `;
    return;
  }
  n.slice(0, 15).forEach((o) => {
    const s = document.createElement("div");
    ((s.className = "planner-result-card"),
      (s.innerHTML = `
      <div>
        <div class="planner-result-title">${o.Recipe_title}</div>
        <div class="planner-result-meta">
          Prot: ${parseFloat(o["Protein (g)"] || 10).toFixed(0)}g | 
          Carbs: ${parseFloat(o["Carbohydrate, by difference (g)"] || 10).toFixed(0)}g
        </div>
      </div>
      <span class="planner-result-badge">${parseFloat(o.Calories || 100).toFixed(0)} Cal</span>
    `),
      s.addEventListener("click", () => _(o)),
      t.plannerResults.appendChild(s));
  });
}
function Z() {
  ((t.endpointSidebar.innerHTML = ""),
    Object.entries(w).forEach(([e, a]) => {
      const n = document.createElement("button");
      ((n.className = `endpoint-btn ${i.activeEndpoint === e ? "active" : ""}`),
        n.setAttribute("data-endpoint-key", e),
        (n.innerHTML = `
      <div class="endpoint-path">
        <span class="endpoint-method get">${a.method}</span>
        <span>${a.path}</span>
      </div>
      <div class="endpoint-title">${a.name}</div>
    `),
        n.addEventListener("click", () => Q(e)),
        t.endpointSidebar.appendChild(n));
    }),
    R());
}
function Q(e) {
  ((i.activeEndpoint = e),
    t.endpointSidebar.querySelectorAll(".endpoint-btn").forEach((n) => {
      n.classList.remove("active");
    }));
  const a = t.endpointSidebar.querySelector(`[data-endpoint-key="${e}"]`);
  (a && a.classList.add("active"), R());
}
function R() {
  const e = w[i.activeEndpoint];
  ((t.pgMethodTag.textContent = e.method),
    (t.pgUrlInput.value = `${y.baseUrl}${e.path}`),
    (t.pgParamsContainer.innerHTML = ""),
    e.params.length === 0
      ? (t.pgParamsPanel.style.display = "none")
      : ((t.pgParamsPanel.style.display = "block"),
        e.params.forEach((a) => {
          const n = document.createElement("div");
          ((n.className = "param-input-group"),
            (n.innerHTML = `
        <label class="param-label" for="pg-param-${a.key}">
          ${a.key} <span style="color:var(--text-muted);font-weight:normal;">(${a.type})</span>
        </label>
        <input type="${a.type}" class="param-field" id="pg-param-${a.key}" value="${a.default}" placeholder="${a.desc}">
      `),
            t.pgParamsContainer.appendChild(n));
        })));
}
async function X() {
  const e = w[i.activeEndpoint],
    a = {};
  (e.params.forEach((s) => {
    const r = document.getElementById(`pg-param-${s.key}`);
    r && (a[s.key] = r.value);
  }),
    (t.pgConsoleOutput.textContent =
      "// Dispatching request to live systems..."),
    (t.pgConsoleOutput.className = "code-block"),
    (t.consoleMetricStatus.querySelector("span").textContent = "PND"),
    (t.consoleMetricStatus.querySelector("span").style.color =
      "var(--text-muted)"),
    (t.consoleMetricTime.querySelector("span").textContent = "--"));
  const n = await T({ path: e.path, queryParams: a, method: e.method });
  i.lastResponse = n;
  const o = t.consoleMetricStatus.querySelector("span");
  ((o.textContent = `${n.status} ${n.statusText}`),
    n.status >= 200 && n.status < 300
      ? ((o.style.color = "var(--accent-emerald)"),
        b(`Request successful: ${n.status} ${n.statusText}`, "success"))
      : ((o.style.color = "var(--accent-red)"),
        b(`Request failed: ${n.status} ${n.statusText}`, "error")),
    (t.consoleMetricTime.querySelector("span").textContent = `${n.timeMs}ms`),
    P(i.consoleTab));
}
function P(e) {
  if (
    ((i.consoleTab = e),
    t.pgTabBtnResponse.classList.toggle("active", e === "response"),
    t.pgTabBtnHeaders.classList.toggle("active", e === "headers"),
    t.pgTabBtnCurl.classList.toggle("active", e === "curl"),
    !!i.lastResponse)
  )
    if (((t.pgConsoleOutput.innerHTML = ""), e === "response")) {
      const a = JSON.stringify(i.lastResponse.data, null, 2);
      t.pgConsoleOutput.innerHTML = N(a);
    } else if (e === "headers") {
      const a = JSON.stringify(i.lastResponse.headers, null, 2);
      t.pgConsoleOutput.innerHTML = N(a);
    } else
      e === "curl" &&
        ((t.pgConsoleOutput.className = "code-block"),
        (t.pgConsoleOutput.textContent = i.lastResponse.curl));
}
function N(e) {
  return (
    typeof e != "string" && (e = JSON.stringify(e, null, 2)),
    (e = e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")),
    e.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      function (a) {
        let n = "token-number";
        return (
          /^"/.test(a)
            ? /:$/.test(a)
              ? (n = "token-key")
              : (n = "token-string")
            : /true|false/.test(a)
              ? (n = "token-boolean")
              : /null/.test(a) && (n = "token-null"),
          `<span class="${n}">${a}</span>`
        );
      },
    )
  );
}
function Y(e) {
  i.searchCache = null;
  if (y.engine === "live") {
    i.searchType = "cuisine";
    i.searchValType = "region";
    i.searchVal = e;
    i.currentPage = 1;
    t.resultsTableTitle.textContent = e
      ? `Showing ${e} Cuisines`
      : "Showing All Recipes";
    v();
  } else {
    let a = [...i.allFetchedRecipes];
    (e
      ? ((a = a.filter(
          (n) =>
            (n.Region || "").toLowerCase().includes(e.toLowerCase()) ||
            (n.Sub_region || "").toLowerCase().includes(e.toLowerCase()) ||
            (n.Continent || "").toLowerCase().includes(e.toLowerCase()),
        )),
        b(`Filtered recipes by ${e} cuisine`, "info"),
        (t.resultsTableTitle.textContent = `Showing ${e} Cuisines`))
      : (b("Showing all recipes", "info"),
        (t.resultsTableTitle.textContent = "Showing All Recipes")),
      (i.recipesList = a),
      (i.currentPage = 1),
      v());
  }
}
function b(e, a = "info") {
  const n = document.getElementById("toast-container");
  if (!n) return;
  const o = document.createElement("div");
  ((o.className = `toast ${a}`),
    (o.innerHTML = `
    <div class="toast-dot"></div>
    <span>${e}</span>
  `),
    n.appendChild(o),
    setTimeout(() => {
      ((o.style.animation = "slideInRight 0.3s ease reverse forwards"),
        setTimeout(() => {
          o.remove();
        }, 300));
    }, 3e3));
}
