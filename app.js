// Core Application Controller for RecipeDB2 Gastronomy Portal & Playground
import { configStore, executeApiRequest } from './api.js';
import { mockAnalyticsData } from './mockData.js';

// Application State Store
const state = {
  currentTab: 'explorer-pane',
  activeEndpoint: 'recipesinfo',
  recipesList: [],       // Currently filtered/active dataset shown in main table
  allFetchedRecipes: [], // Master cache of all recipes fetched from backend/mock database
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  featuredRecipe: null,
  activeSearchTab: 'tab-cuisine',
  sortKey: 'Recipe_title',
  sortDirection: 'asc', // asc | desc
  isSorted: false,
  
  // Nutri-Planner Thresholds
  plannerTargets: {
    calories: 800,
    carbs: 120,
    protein: 30,
    fat: 60
  }
};

// Available Endpoints Directory Configuration
const endpointsDirectory = {
  recipesinfo: {
    name: 'Recipe Info',
    path: '/recipe2-api/recipe/recipesinfo',
    method: 'GET',
    description: 'Retrieves a comprehensive list of all available recipes in the database.',
    params: [
      { key: 'page', default: '1', type: 'number', desc: 'Filter by page number.' },
      { key: 'limit', default: '10', type: 'number', desc: 'Number of recipes shown per page.' }
    ]
  },
  recipeofday: {
    name: 'Recipe of Day',
    path: '/recipe2-api/recipe/recipeofday',
    method: 'GET',
    description: 'Returns a single, randomly selected recipe to be featured as the "Recipe of the Day".',
    params: []
  },
  'with-ingredients-categories': {
    name: 'Recipe with Exclusions',
    path: '/recipe2-api/recipe/recipe-day/with-ingredients-categories',
    method: 'GET',
    description: 'Generates a featured recipe of the day while excluding specific ingredients or categories.',
    params: [
      { key: 'excludeIngredients', default: 'water,flour', type: 'text', desc: 'Comma-separated ingredients to exclude.' },
      { key: 'excludeCategories', default: 'Dairy', type: 'text', desc: 'Comma-separated categories to exclude.' }
    ]
  },
  nutritioninfo: {
    name: 'Recipe Nutrition Info',
    path: '/recipe2-api/recipe-nutri/nutritioninfo',
    method: 'GET',
    description: 'Provides detailed macronutrient details (calories, fat, protein, carbohydrates) for recipes.',
    params: [
      { key: 'page', default: '1', type: 'number', desc: 'Filter by page number.' },
      { key: 'limit', default: '10', type: 'number', desc: 'Number of items per page.' }
    ]
  }
};

// ==========================================
// DOM ELEMENTS SELECTORS
// ==========================================
const DOM = {
  brandHome: document.getElementById('brand-home'),
  tabBtnExplorer: document.getElementById('tab-btn-explorer'),
  tabBtnAnalytics: document.getElementById('tab-btn-analytics'),
  tabBtnPlayground: document.getElementById('tab-btn-playground'),
  
  explorerPane: document.getElementById('explorer-pane'),
  analyticsPane: document.getElementById('analytics-pane'),
  playgroundPane: document.getElementById('playground-pane'),
  
  engineBadge: document.getElementById('current-engine-badge'),
  btnOpenSettings: document.getElementById('btn-open-settings'),
  cuisineCarousel: document.getElementById('cuisine-carousel'),
  
  // Settings Modal
  modalSettings: document.getElementById('modal-settings'),
  btnCloseSettings: document.getElementById('btn-close-settings'),
  btnSaveSettings: document.getElementById('btn-save-settings'),
  settingBaseUrl: document.getElementById('setting-baseurl'),
  settingApiKey: document.getElementById('setting-apikey'),
  engineToggleGroup: document.getElementById('engine-toggle-group'),
  
  // Recipe Details Card
  featuredRecipeContainer: document.getElementById('featured-recipe-container'),
  featuredTitle: document.getElementById('featured-title'),
  featuredTime: document.getElementById('featured-time'),
  featuredRegion: document.getElementById('featured-region'),
  featuredBadges: document.getElementById('featured-badges'),
  featuredImage: document.getElementById('featured-image'),
  
  // Search By Console Tab Panes
  searchTabBtns: document.querySelectorAll('.search-tab-btn'),
  searchTabPanes: document.querySelectorAll('.search-tab-pane'),
  btnSubmitSearch: document.getElementById('btn-submit-search'),
  
  // Cuisine inputs
  searchRegion: document.getElementById('search-region'),
  searchCountry: document.getElementById('search-country'),
  searchTitle: document.getElementById('search-title'),
  
  // Ingredient inputs
  searchIngUsed: document.getElementById('search-ing-used'),
  searchIngNotUsed: document.getElementById('search-ing-notused'),
  
  // Category inputs
  searchCatUsed: document.getElementById('search-cat-used'),
  searchCatNotUsed: document.getElementById('search-cat-notused'),
  
  // Nutrition Inputs
  searchNutCal: document.getElementById('search-nut-cal'),
  searchNutCarbs: document.getElementById('search-nut-carbs'),
  searchNutProtein: document.getElementById('search-nut-protein'),
  searchNutFat: document.getElementById('search-nut-fat'),
  valSearchCal: document.getElementById('val-search-cal'),
  valSearchCarbs: document.getElementById('val-search-carbs'),
  valSearchProtein: document.getElementById('val-search-protein'),
  valSearchFat: document.getElementById('val-search-fat'),
  
  // Advanced Inputs
  advContinent: document.getElementById('adv-continent'),
  advRegion: document.getElementById('adv-region'),
  advCountry: document.getElementById('adv-country'),
  advTitle: document.getElementById('adv-title'),
  advIngUsed: document.getElementById('adv-ing-used'),
  advIngNotUsed: document.getElementById('adv-ing-notused'),
  advProcess: document.getElementById('adv-process'),
  advUtensil: document.getElementById('adv-utensil'),
  advShowNutri: document.getElementById('adv-show-nutri'),
  
  // Data Table Results Elements
  tableSearchInput: document.getElementById('table-search-input'),
  recipesDataTable: document.getElementById('recipes-data-table'),
  tableBodyContainer: document.getElementById('table-body-container'),
  resultsTableTitle: document.getElementById('results-table-title'),
  
  // Table Footer Pagination Controls
  rowsSelector: document.getElementById('rows-selector'),
  footerItemCounter: document.getElementById('footer-item-counter'),
  btnNavFirst: document.getElementById('btn-nav-first'),
  btnNavPrev: document.getElementById('btn-nav-prev'),
  btnNavNext: document.getElementById('btn-nav-next'),
  btnNavLast: document.getElementById('btn-nav-last'),
  inputGotoPage: document.getElementById('input-goto-page'),
  
  // Recipe Detail Modal
  modalRecipeDetail: document.getElementById('modal-recipe-detail'),
  btnCloseRecipe: document.getElementById('btn-close-recipe'),
  detModalTitle: document.getElementById('det-modal-title'),
  detTime: document.getElementById('det-time'),
  detServings: document.getElementById('det-servings'),
  detRegion: document.getElementById('det-region'),
  detUtensils: document.getElementById('det-utensils'),
  detProcesses: document.getElementById('det-processes'),
  detDietTags: document.getElementById('det-diet-tags'),
  detInstructions: document.getElementById('det-instructions'),
  
  // Nutrition Detailed Fields
  detNutCal: document.getElementById('det-nut-cal'),
  detNutCarbs: document.getElementById('det-nut-carbs'),
  detNutProtein: document.getElementById('det-nut-protein'),
  detNutFat: document.getElementById('det-nut-fat'),
  detFillCal: document.getElementById('det-fill-cal'),
  detFillCarbs: document.getElementById('det-fill-carbs'),
  detFillProtein: document.getElementById('det-fill-protein'),
  detFillFat: document.getElementById('det-fill-fat'),
  
  // Analytics Elements
  caloriesBarChart: document.getElementById('calories-bar-chart'),
  dietaryProfileStats: document.getElementById('dietary-profile-stats'),
  
  // Nutri-Planner Controls
  slideCal: document.getElementById('slide-cal'),
  slideCarbs: document.getElementById('slide-carbs'),
  slideProtein: document.getElementById('slide-protein'),
  slideFat: document.getElementById('slide-fat'),
  valSlideCal: document.getElementById('val-slide-cal'),
  valSlideCarbs: document.getElementById('val-slide-carbs'),
  valSlideProtein: document.getElementById('val-slide-protein'),
  valSlideFat: document.getElementById('val-slide-fat'),
  plannerResults: document.getElementById('planner-results-container'),
  
  // Developer Playground Panel
  endpointSidebar: document.getElementById('endpoint-sidebar'),
  pgMethodTag: document.getElementById('pg-method-tag'),
  pgUrlInput: document.getElementById('pg-url-input'),
  pgBtnSend: document.getElementById('pg-btn-send'),
  pgParamsContainer: document.getElementById('pg-params-container'),
  pgParamsPanel: document.getElementById('pg-params-panel'),
  
  // Console log outputs
  pgTabBtnResponse: document.getElementById('pg-tab-btn-response'),
  pgTabBtnHeaders: document.getElementById('pg-tab-btn-headers'),
  pgTabBtnCurl: document.getElementById('pg-tab-btn-curl'),
  consoleMetricStatus: document.getElementById('console-metric-status'),
  consoleMetricTime: document.getElementById('console-metric-time'),
  pgConsoleOutput: document.getElementById('pg-console-output'),
  pgBtnCopyCurl: document.getElementById('pg-btn-copy-curl')
};

// ==========================================
// CENTRAL CONTROLLER ENGINE & INITIALIZATIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initConfigurations();
  setupEventListeners();
  renderEndpointsSidebar();
  loadFeaturedRecipe();
  fetchMasterRecipeDatabase(); // Grabs cache of recipes to drive filters
  drawCaloriesChart();
  renderDietaryStats();
  solveNutriPlan();
});

/**
 * Loads values from state managers & localStorage to configure input forms
 */
function initConfigurations() {
  DOM.settingBaseUrl.value = configStore.baseUrl;
  DOM.settingApiKey.value = configStore.apiKey;
  updateEngineBadge();

  // Set active style toggle state
  const toggles = DOM.engineToggleGroup.querySelectorAll('.toggle-option');
  toggles.forEach(tog => {
    if (tog.getAttribute('data-engine') === configStore.engine) {
      tog.classList.add('active');
    } else {
      tog.classList.remove('active');
    }
  });

  // Init nutri columns hidden state
  toggleNutriColumnsVisibility();
}

/**
 * Updates UI badge indicating whether live backend or local mock is active
 */
function updateEngineBadge() {
  const isMock = configStore.engine === 'mock';
  DOM.engineBadge.textContent = isMock ? 'Mock Sandbox' : 'Live Server';
  DOM.engineBadge.className = `badge-engine ${isMock ? 'mock' : 'live'}`;
}

// ==========================================
// ROUTER & NAVIGATION CONTROLLERS
// ==========================================
function setupEventListeners() {
  
  // Tab Switching Layout
  DOM.tabBtnExplorer.addEventListener('click', () => switchTab('explorer-pane'));
  DOM.tabBtnAnalytics.addEventListener('click', () => switchTab('analytics-pane'));
  DOM.tabBtnPlayground.addEventListener('click', () => switchTab('playground-pane'));
  DOM.brandHome.addEventListener('click', () => switchTab('explorer-pane'));

  // Cuisine Carousel Card Filter
  if (DOM.cuisineCarousel) {
    DOM.cuisineCarousel.addEventListener('click', (e) => {
      const card = e.target.closest('.carousel-card');
      if (!card) return;
      
      DOM.cuisineCarousel.querySelectorAll('.carousel-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      const cuisine = card.getAttribute('data-cuisine');
      filterRecipesByCuisine(cuisine);
    });
  }

  // Configuration Modal Triggers
  DOM.btnOpenSettings.addEventListener('click', () => openModal(DOM.modalSettings));
  DOM.btnCloseSettings.addEventListener('click', () => closeModal(DOM.modalSettings));
  
  // Drawer Toggle Options Selection
  DOM.engineToggleGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-option');
    if (!btn) return;
    DOM.engineToggleGroup.querySelectorAll('.toggle-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  // Saving settings configurations
  DOM.btnSaveSettings.addEventListener('click', () => {
    const activeBtn = DOM.engineToggleGroup.querySelector('.toggle-option.active');
    const selectedEngine = activeBtn ? activeBtn.getAttribute('data-engine') : 'live';
    
    configStore.engine = selectedEngine;
    configStore.baseUrl = DOM.settingBaseUrl.value.trim();
    configStore.apiKey = DOM.settingApiKey.value.trim();
    
    updateEngineBadge();
    closeModal(DOM.modalSettings);
    
    // Refresh panels with new engine parameters
    loadFeaturedRecipe();
    fetchMasterRecipeDatabase();
    solveNutriPlan();
    updatePlaygroundWorkspace();
    
    showToast('Configuration settings updated successfully', 'success');
  });

  // Close modals clicking background overlays
  [DOM.modalSettings, DOM.modalRecipeDetail].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  DOM.btnCloseRecipe.addEventListener('click', () => closeModal(DOM.modalRecipeDetail));

  // "Search By" Tab Clicks Switches
  DOM.searchTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.searchTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tabId = btn.getAttribute('data-search-tab');
      state.activeSearchTab = tabId;
      
      DOM.searchTabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === tabId);
      });
    });
  });

  // Master Submit Search Click
  DOM.btnSubmitSearch.addEventListener('click', () => {
    executeSearchBy();
  });

  // Nutrition sliders value visualizers
  DOM.searchNutCal.addEventListener('input', (e) => {
    DOM.valSearchCal.textContent = `${e.target.value} KCal`;
  });
  DOM.searchNutCarbs.addEventListener('input', (e) => {
    DOM.valSearchCarbs.textContent = `${e.target.value}g`;
  });
  DOM.searchNutProtein.addEventListener('input', (e) => {
    DOM.valSearchProtein.textContent = `${e.target.value}g`;
  });
  DOM.searchNutFat.addEventListener('input', (e) => {
    DOM.valSearchFat.textContent = `${e.target.value}g`;
  });

  // Checkbox Show nutrition profile columns dynamic toggler
  DOM.advShowNutri.addEventListener('change', () => {
    toggleNutriColumnsVisibility();
  });

  // Table Search real-time filter (search within results)
  let searchTimeout;
  DOM.tableSearchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (DOM.tableSearchInput.value.trim() === '') {
        state.isSorted = false;
        state.currentPage = 1;
      }
      renderDataTableSlice();
    }, 200);
  });

  // Sorting Header Click listeners
  DOM.recipesDataTable.querySelectorAll('thead th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.getAttribute('data-sort');
      if (state.sortKey === key) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortKey = key;
        state.sortDirection = 'asc';
      }
      
      // Update sorted arrows style
      DOM.recipesDataTable.querySelectorAll('thead th span.sort-icon').forEach(s => s.opacity = '0.4');
      
      sortRecipesList();
      state.currentPage = 1;
      renderDataTableSlice();
    });
  });

  // Footer rows-per-page selector
  DOM.rowsSelector.addEventListener('change', (e) => {
    state.itemsPerPage = parseInt(e.target.value);
    state.currentPage = 1;
    renderDataTableSlice();
  });

  // Footer Navigation Click listeners
  DOM.btnNavFirst.addEventListener('click', () => {
    state.currentPage = 1;
    renderDataTableSlice();
  });
  DOM.btnNavPrev.addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderDataTableSlice();
    }
  });
  DOM.btnNavNext.addEventListener('click', () => {
    if (state.currentPage < state.totalPages) {
      state.currentPage++;
      renderDataTableSlice();
    }
  });
  DOM.btnNavLast.addEventListener('click', () => {
    state.currentPage = state.totalPages;
    renderDataTableSlice();
  });

  // Footer Go To page input keyup
  DOM.inputGotoPage.addEventListener('change', (e) => {
    const pageNum = parseInt(e.target.value);
    if (pageNum >= 1 && pageNum <= state.totalPages) {
      state.currentPage = pageNum;
      renderDataTableSlice();
    }
  });

  // Nutri-Planner Sliders Active Listeners
  DOM.slideCal.addEventListener('input', (e) => {
    state.plannerTargets.calories = parseInt(e.target.value);
    DOM.valSlideCal.textContent = `${state.plannerTargets.calories} kcal`;
    solveNutriPlan();
  });

  DOM.slideCarbs.addEventListener('input', (e) => {
    state.plannerTargets.carbs = parseInt(e.target.value);
    DOM.valSlideCarbs.textContent = `${state.plannerTargets.carbs}g`;
    solveNutriPlan();
  });

  DOM.slideProtein.addEventListener('input', (e) => {
    state.plannerTargets.protein = parseInt(e.target.value);
    DOM.valSlideProtein.textContent = `${state.plannerTargets.protein}g`;
    solveNutriPlan();
  });

  DOM.slideFat.addEventListener('input', (e) => {
    state.plannerTargets.fat = parseInt(e.target.value);
    DOM.valSlideFat.textContent = `${state.plannerTargets.fat}g`;
    solveNutriPlan();
  });

  // Playground workspace actions
  DOM.pgBtnSend.addEventListener('click', dispatchPlaygroundRequest);
  
  // Console Tab switches
  DOM.pgTabBtnResponse.addEventListener('click', () => switchConsoleTab('response'));
  DOM.pgTabBtnHeaders.addEventListener('click', () => switchConsoleTab('headers'));
  DOM.pgTabBtnCurl.addEventListener('click', () => switchConsoleTab('curl'));

  // Copy Curl to clipboard
  DOM.pgBtnCopyCurl.addEventListener('click', () => {
    if (!state.lastResponse) return;
    const text = state.consoleTab === 'curl' 
      ? state.lastResponse.curl 
      : (state.consoleTab === 'headers' 
          ? JSON.stringify(state.lastResponse.headers, null, 2) 
          : JSON.stringify(state.lastResponse.data, null, 2));
          
    navigator.clipboard.writeText(text).then(() => {
      DOM.pgBtnCopyCurl.innerHTML = `
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        Copied!
      `;
      setTimeout(() => {
        DOM.pgBtnCopyCurl.innerHTML = `
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
          Copy
        `;
      }, 1500);
    });
  });
}

function switchTab(tabId) {
  state.currentTab = tabId;
  DOM.tabBtnExplorer.classList.toggle('active', tabId === 'explorer-pane');
  DOM.tabBtnAnalytics.classList.toggle('active', tabId === 'analytics-pane');
  DOM.tabBtnPlayground.classList.toggle('active', tabId === 'playground-pane');
  
  DOM.explorerPane.classList.toggle('active', tabId === 'explorer-pane');
  DOM.analyticsPane.classList.toggle('active', tabId === 'analytics-pane');
  DOM.playgroundPane.classList.toggle('active', tabId === 'playground-pane');
}

function openModal(modalEl) {
  modalEl.classList.add('active');
}

function closeModal(modalEl) {
  modalEl.classList.remove('active');
}

/**
 * Toggles dynamic columns for protein and fat inside the data table
 */
function toggleNutriColumnsVisibility() {
  const showNutri = DOM.advShowNutri.checked;
  document.querySelectorAll('.nutri-col').forEach(col => {
    col.classList.toggle('hidden', !showNutri);
  });
}

// ==========================================
// PORTAL DATA FETCHING & RENDERING
// ==========================================

/**
 * Loads the featured Recipe of the Day
 */
async function loadFeaturedRecipe() {
  const result = await executeApiRequest({
    path: '/recipe2-api/recipe/recipeofday'
  });

  if (result && result.data && result.data.payload) {
    const data = result.data.payload.data;
    state.featuredRecipe = data;
    
    DOM.featuredTitle.textContent = data.Recipe_title;
    DOM.featuredTime.textContent = `${data.total_time || 45} mins`;
    DOM.featuredRegion.textContent = data.Region || 'Global';
    
    if (data.img_url) {
      DOM.featuredImage.src = data.img_url;
    } else {
      DOM.featuredImage.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop';
    }

    DOM.featuredBadges.innerHTML = '';
    const addBadge = (text, cls) => {
      const b = document.createElement('span');
      b.className = `badge ${cls}`;
      b.textContent = text;
      DOM.featuredBadges.appendChild(b);
    };

    if (parseFloat(data.Calories)) addBadge(`${data.Calories} Calories`, 'calories');
    if (parseFloat(data.vegan) === 1) addBadge('Vegan', 'vegan');
    if (parseFloat(data.lacto_vegetarian) === 1) addBadge('Lacto-Veg', 'vegan');
    if (data.Source) addBadge(`Source: ${data.Source}`, '');

    DOM.featuredRecipeContainer.onclick = () => openRecipeDetails(data);
    DOM.featuredRecipeContainer.style.cursor = 'pointer';
  }
}

/**
 * Downloads a complete cache of database recipes to support search options
 */
async function fetchMasterRecipeDatabase() {
  DOM.tableBodyContainer.innerHTML = `
    <tr>
      <td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-muted);">
        <div style="margin-bottom: 0.5rem;">Connecting to RecipeDB2 Central Database...</div>
        <div class="badge-engine live" style="display: inline-block;">Authorization Active</div>
      </td>
    </tr>
  `;

  // Fetch 100 entries to provide a highly interactive, responsive sandbox table cache
  const result = await executeApiRequest({
    path: '/recipe2-api/recipe/recipesinfo',
    queryParams: {
      page: 1,
      limit: 500
    }
  });

  if (result && result.data && result.data.payload) {
    const data = result.data.payload.data || [];
    state.allFetchedRecipes = data;
    state.recipesList = [...data];
    
    sortRecipesList();
    state.isSorted = false; // Reset sorting state for the initial table load to enable live paging
    state.currentPage = 1;
    renderDataTableSlice();
    
    if (result.isMockUsed) {
      showToast('CORS block or offline server. Loaded local sandbox mock data.', 'info');
    } else {
      showToast('Connected to RecipeDB2 Central Database', 'success');
    }
  } else {
    showToast('Failed to load database. Using mock data.', 'error');
  }
}

/**
 * Sorts state recipesList based on sortKey and sortDirection
 */
function sortRecipesList() {
  state.isSorted = true;
  state.recipesList.sort((a, b) => {
    let valA = a[state.sortKey];
    let valB = b[state.sortKey];
    
    // Normalize numeric values
    if (state.sortKey === 'Calories' || state.sortKey === 'servings' || state.sortKey === 'Protein (g)' || state.sortKey === 'Total lipid (fat) (g)') {
      valA = parseFloat(valA) || 0;
      valB = parseFloat(valB) || 0;
    } else {
      valA = String(valA || '').toLowerCase();
      valB = String(valB || '').toLowerCase();
    }

    if (valA < valB) return state.sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return state.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Renders a slice of sorted data into the results gastronomy table
 */
/**
 * Renders a slice of sorted data into the results gastronomy table
 */
async function renderDataTableSlice() {
  const isSearchActive = state.recipesList.length !== state.allFetchedRecipes.length;
  const tableSearch = DOM.tableSearchInput.value.trim().toLowerCase();
  const isLiveServer = configStore.engine === 'live';
  
  // If in Live Server mode, and no active search filter is applied, and not sorted:
  // paginate server-side so the user can browse the entire 128,942 live recipes catalog.
  if (isLiveServer && !isSearchActive && !tableSearch && !state.isSorted) {
    DOM.tableBodyContainer.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem;">
          <div class="loading-spinner" style="margin: 0 auto 0.5rem auto;"></div>
          <span style="font-size:0.8rem; color:var(--text-muted);">Fetching recipes from live catalog...</span>
        </td>
      </tr>
    `;
    
    try {
      const result = await executeApiRequest({
        path: '/recipe2-api/recipe/recipesinfo',
        queryParams: {
          page: state.currentPage,
          limit: state.itemsPerPage
        }
      });
      
      if (result && result.data && result.data.payload) {
        const payload = result.data.payload;
        const recipes = payload.data || [];
        const pagination = payload.pagination || {};
        const total = pagination.totalCount || 118083;
        state.totalPages = pagination.totalPages || Math.ceil(total / state.itemsPerPage);
        
        DOM.tableBodyContainer.innerHTML = '';
        renderRecipesToTableBody(recipes);
        
        const start = (state.currentPage - 1) * state.itemsPerPage;
        const end = start + recipes.length;
        updatePaginationControls(start, end, total);
        return;
      }
    } catch (err) {
      console.warn("Server-side pagination failed, falling back to local database cache:", err);
    }
  }

  // Fallback / Local Pagination (from state.recipesList cache)
  let list = [...state.recipesList];
  if (tableSearch) {
    list = list.filter(r => 
      r.Recipe_title.toLowerCase().includes(tableSearch) ||
      (r.Region && r.Region.toLowerCase().includes(tableSearch)) ||
      (r.Country && r.Country.toLowerCase().includes(tableSearch))
    );
  }

  const totalCount = list.length;
  state.totalPages = Math.max(Math.ceil(totalCount / state.itemsPerPage), 1);
  
  if (state.currentPage > state.totalPages) state.currentPage = state.totalPages;

  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const endIndex = Math.min(state.currentPage * state.itemsPerPage, totalCount);
  const slice = list.slice(startIndex, endIndex);

  DOM.tableBodyContainer.innerHTML = '';
  
  if (slice.length === 0) {
    DOM.tableBodyContainer.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No data matches search parameters.
        </td>
      </tr>
    `;
    updatePaginationControls(0, 0, 0);
    return;
  }

  renderRecipesToTableBody(slice);
  updatePaginationControls(startIndex, endIndex, totalCount);
}

function renderRecipesToTableBody(slice) {
  slice.forEach(recipe => {
    const tr = document.createElement('tr');
    
    const isVegan = parseFloat(recipe.vegan) === 1 || parseFloat(recipe.lacto_vegetarian) === 1;
    const protein = recipe['Protein (g)'] || 10;
    const fat = recipe['Total lipid (fat) (g)'] || 5;

    tr.innerHTML = `
      <td style="font-weight: 700; color: var(--text-primary);">
        ${recipe.Recipe_title}
        <span style="display:block; font-size:0.7rem; color:var(--text-muted); font-weight:normal;">
          ${isVegan ? 'Vegetarian' : 'Standard'}
        </span>
      </td>
      <td>${recipe.Region || 'Global'}</td>
      <td>${recipe.Sub_region || recipe.Region || 'Global'}</td>
      <td>${recipe.servings || '4'}</td>
      <td style="font-weight:700; color:var(--accent-orange);">${parseFloat(recipe.Calories || 100).toFixed(0)}</td>
      
      <td class="nutri-col hidable-col">${parseFloat(protein).toFixed(1)}g</td>
      <td class="nutri-col hidable-col">${parseFloat(fat).toFixed(1)}g</td>
      
      <td>
        <button class="btn-view-details" style="padding: 0.25rem 0.5rem; font-size:0.75rem;">
          Details
        </button>
      </td>
    `;
    
    tr.querySelector('.btn-view-details').addEventListener('click', () => openRecipeDetails(recipe));
    DOM.tableBodyContainer.appendChild(tr);
  });

  // Re-apply hidable columns states
  toggleNutriColumnsVisibility();
}

/**
 * Refreshes pages visual bounds tags
 */
function updatePaginationControls(start, end, total) {
  DOM.footerItemCounter.textContent = total > 0 ? `${start + 1}-${end} of ${total}` : '0-0 of 0';
  
  DOM.btnNavFirst.disabled = state.currentPage === 1;
  DOM.btnNavPrev.disabled = state.currentPage === 1;
  DOM.btnNavNext.disabled = state.currentPage === state.totalPages;
  DOM.btnNavLast.disabled = state.currentPage === state.totalPages;
  
  DOM.inputGotoPage.value = state.currentPage;
  DOM.inputGotoPage.max = state.totalPages;
}

/**
 * Solves and extracts input parameter filters from active "Search By" tabs
 */
function executeSearchBy() {
  DOM.btnSubmitSearch.textContent = 'Searching...';
  DOM.btnSubmitSearch.style.opacity = '0.7';

  let list = [...state.allFetchedRecipes];
  
  if (state.activeSearchTab === 'tab-cuisine') {
    const region = DOM.searchRegion.value.trim().toLowerCase();
    const country = DOM.searchCountry.value.trim().toLowerCase();
    const title = DOM.searchTitle.value.trim().toLowerCase();
    
    if (region) list = list.filter(r => (r.Region || '').toLowerCase().includes(region));
    if (country) list = list.filter(r => (r.Sub_region || r.Region || '').toLowerCase().includes(country));
    if (title) list = list.filter(r => (r.Recipe_title || '').toLowerCase().includes(title));
    
    DOM.resultsTableTitle.textContent = `Showing Cuisine matches (Region: "${region || 'any'}", Title: "${title || 'any'}")`;
    
  } else if (state.activeSearchTab === 'tab-ingredient') {
    const used = DOM.searchIngUsed.value.trim().toLowerCase().split(',').map(x => x.trim()).filter(Boolean);
    const notUsed = DOM.searchIngNotUsed.value.trim().toLowerCase().split(',').map(x => x.trim()).filter(Boolean);
    
    if (used.length > 0) {
      list = list.filter(r => used.every(u => 
        (r.Recipe_title || '').toLowerCase().includes(u) || 
        (r.instructions || '').toLowerCase().includes(u)
      ));
    }
    if (notUsed.length > 0) {
      list = list.filter(r => !notUsed.some(nu => 
        (r.Recipe_title || '').toLowerCase().includes(nu) || 
        (r.instructions || '').toLowerCase().includes(nu)
      ));
    }
    
    DOM.resultsTableTitle.textContent = `Filtered Ingredients (Used: ${used.length}, Excluded: ${notUsed.length})`;
    
  } else if (state.activeSearchTab === 'tab-category') {
    const used = DOM.searchCatUsed.value.trim().toLowerCase();
    const notUsed = DOM.searchCatNotUsed.value.trim().toLowerCase();
    
    if (used) {
      list = list.filter(r => 
        (r.Region || '').toLowerCase().includes(used) || 
        (parseFloat(r.vegan) === 1 && used === 'vegan') ||
        (parseFloat(r.lacto_vegetarian) === 1 && used.includes('veg'))
      );
    }
    if (notUsed) {
      list = list.filter(r => 
        !(r.Region || '').toLowerCase().includes(notUsed) &&
        !(parseFloat(r.vegan) === 1 && notUsed === 'vegan')
      );
    }
    
    DOM.resultsTableTitle.textContent = `Diet categories filtered results`;
    
  } else if (state.activeSearchTab === 'tab-nutrition') {
    const maxCal = parseInt(DOM.searchNutCal.value);
    const maxCarb = parseInt(DOM.searchNutCarbs.value);
    const minProtein = parseInt(DOM.searchNutProtein.value);
    const maxFat = parseInt(DOM.searchNutFat.value);
    
    list = list.filter(r => {
      const cal = parseFloat(r.Calories) || 120;
      const carb = parseFloat(r['Carbohydrate, by difference (g)']) || 30;
      const prot = parseFloat(r['Protein (g)']) || 10;
      const fat = parseFloat(r['Total lipid (fat) (g)']) || 5;
      
      return cal <= maxCal && carb <= maxCarb && prot >= minProtein && fat <= maxFat;
    });

    DOM.resultsTableTitle.textContent = `Nutritional thresholds matches`;
    
  } else if (state.activeSearchTab === 'tab-advanced') {
    const continent = DOM.advContinent.value.trim().toLowerCase();
    const region = DOM.advRegion.value.trim().toLowerCase();
    const country = DOM.advCountry.value.trim().toLowerCase();
    const title = DOM.advTitle.value.trim().toLowerCase();
    const used = DOM.advIngUsed.value.trim().toLowerCase().split(',').map(x => x.trim()).filter(Boolean);
    const notUsed = DOM.advIngNotUsed.value.trim().toLowerCase().split(',').map(x => x.trim()).filter(Boolean);
    const process = DOM.advProcess.value.trim().toLowerCase();
    const utensil = DOM.advUtensil.value.trim().toLowerCase();
    
    if (continent) list = list.filter(r => (r.Continent || '').toLowerCase().includes(continent));
    if (region) list = list.filter(r => (r.Region || '').toLowerCase().includes(region));
    if (country) list = list.filter(r => (r.Sub_region || r.Region || '').toLowerCase().includes(country));
    if (title) list = list.filter(r => (r.Recipe_title || '').toLowerCase().includes(title));
    
    if (used.length > 0) {
      list = list.filter(r => used.every(u => 
        (r.Recipe_title || '').toLowerCase().includes(u) || (r.instructions || '').toLowerCase().includes(u)
      ));
    }
    if (notUsed.length > 0) {
      list = list.filter(r => !notUsed.some(nu => 
        (r.Recipe_title || '').toLowerCase().includes(nu) || (r.instructions || '').toLowerCase().includes(nu)
      ));
    }
    
    if (process) list = list.filter(r => (r.Processes || '').toLowerCase().includes(process));
    if (utensil) list = list.filter(r => (r.Utensils || '').toLowerCase().includes(utensil));
    
    DOM.resultsTableTitle.textContent = `Advanced Composite parameters matches`;
  }

  state.recipesList = list;
  if (list.length === state.allFetchedRecipes.length) {
    state.isSorted = false;
  } else {
    sortRecipesList();
  }
  state.currentPage = 1;
  renderDataTableSlice();

  setTimeout(() => {
    DOM.btnSubmitSearch.textContent = 'Submit Search';
    DOM.btnSubmitSearch.style.opacity = '1';
  }, 350);
}

/**
 * Triggers modal drawer overlays mapping specific recipe variables & macronutrients charts
 */
function openRecipeDetails(recipe) {
  DOM.detModalTitle.textContent = recipe.Recipe_title;
  DOM.detTime.textContent = `${recipe.total_time || 30} mins`;
  DOM.detServings.textContent = recipe.servings || '4 servings';
  DOM.detRegion.textContent = recipe.Region || 'Global';

  // Utensils badges
  DOM.detUtensils.innerHTML = '';
  const utensils = recipe.Utensils ? recipe.Utensils.split('||') : ['saucepan', 'spoon'];
  utensils.forEach(u => {
    const span = document.createElement('span');
    span.className = 'badge';
    span.textContent = u;
    DOM.detUtensils.appendChild(span);
  });

  // Processes badges
  DOM.detProcesses.innerHTML = '';
  const processes = recipe.Processes ? recipe.Processes.split('||') : ['cook', 'heat'];
  processes.forEach(p => {
    const span = document.createElement('span');
    span.className = 'badge';
    span.style.borderColor = 'rgba(168, 85, 247, 0.2)';
    span.style.color = 'var(--accent-purple)';
    span.textContent = p;
    DOM.detProcesses.appendChild(span);
  });

  // Diet classification
  DOM.detDietTags.innerHTML = '';
  const addDiet = (text, type) => {
    const span = document.createElement('span');
    span.className = `badge ${type}`;
    span.textContent = text;
    DOM.detDietTags.appendChild(span);
  };

  if (parseFloat(recipe.vegan) === 1) addDiet('Vegan', 'vegan');
  if (parseFloat(recipe.lacto_vegetarian) === 1) addDiet('Lacto-Veg', 'vegan');
  if (parseFloat(recipe.pescetarian) === 1) addDiet('Pescetarian', '');
  if (parseFloat(recipe.Calories) < 200) addDiet('Low Calorie', 'calories');

  // Preparation step-by-step parsing
  DOM.detInstructions.innerHTML = '';
  let steps = [];
  if (recipe.instructions) {
    steps = recipe.instructions.split(/\.\s+/).filter(s => s.trim() !== '');
  } else {
    steps = [
      'Prepare and clean all required ingredients.',
      'Blend, chop, and process according to ingredients profile.',
      'Heat ingredients in active cooking pans.',
      'Serve warm and enjoy your culinary creation!'
    ];
  }

  steps.forEach((step, idx) => {
    const cleanStep = step.endsWith('.') ? step : `${step}.`;
    const stepDiv = document.createElement('div');
    stepDiv.className = 'instruction-step';
    stepDiv.innerHTML = `
      <div class="step-num">${idx + 1}</div>
      <div>${cleanStep}</div>
    `;
    DOM.detInstructions.appendChild(stepDiv);
  });

  // Macro-nutrients diagram progress fill calculations
  const calVal = recipe['Energy (kcal)'] || (parseFloat(recipe.Calories) * 4) || 200;
  const carbVal = recipe['Carbohydrate, by difference (g)'] || 30;
  const protVal = recipe['Protein (g)'] || 15;
  const fatVal = recipe['Total lipid (fat) (g)'] || 10;

  DOM.detNutCal.textContent = `${parseFloat(calVal).toFixed(1)} kcal`;
  DOM.detNutCarbs.textContent = `${parseFloat(carbVal).toFixed(1)}g`;
  DOM.detNutProtein.textContent = `${parseFloat(protVal).toFixed(1)}g`;
  DOM.detNutFat.textContent = `${parseFloat(fatVal).toFixed(1)}g`;

  const percentCal = Math.min((parseFloat(calVal) / 1200) * 100, 100);
  const percentCarb = Math.min((parseFloat(carbVal) / 300) * 100, 100);
  const percentProt = Math.min((parseFloat(protVal) / 100) * 100, 100);
  const percentFat = Math.min((parseFloat(fatVal) / 80) * 100, 100);

  DOM.detFillCal.style.width = `${percentCal}%`;
  DOM.detFillCarbs.style.width = `${percentCarb}%`;
  DOM.detFillProtein.style.width = `${percentProt}%`;
  DOM.detFillFat.style.width = `${percentFat}%`;

  openModal(DOM.modalRecipeDetail);
}

// ==========================================
// ANALYTICS GRAPH DRAWING ENGINE
// ==========================================

/**
 * Draws pre-computed continental calorie metric summaries inside dynamic SVGs
 */
function drawCaloriesChart() {
  const data = mockAnalyticsData.averageCaloriesByContinent;
  const width = 450;
  const height = 230;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxVal = Math.max(...data.map(d => d.calories));
  
  let svg = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;
  
  // Background dash lines
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartHeight / 4) * i;
    const val = Math.round(maxVal - (maxVal / 4) * i);
    svg += `
      <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-dasharray="4" />
      <text x="${padding - 8}" y="${y + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end" font-family="var(--font-sans)">${val}</text>
    `;
  }
  
  // Drawing bars
  const barWidth = chartWidth / data.length - 12;
  data.forEach((d, idx) => {
    const x = padding + (chartWidth / data.length) * idx + 6;
    const barHeight = (d.calories / maxVal) * chartHeight;
    const y = height - padding - barHeight;
    const gradId = `bar-grad-${idx}`;
    
    svg += `
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent-cyan)" />
          <stop offset="100%" stop-color="rgba(6, 182, 212, 0.2)" />
        </linearGradient>
      </defs>
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="url(#${gradId})" rx="4" ry="4" style="transition: all 0.3s;" />
      <text x="${x + barWidth/2}" y="${y - 6}" fill="var(--text-primary)" font-size="10" font-weight="700" text-anchor="middle" font-family="var(--font-sans)">${d.calories}</text>
      <text x="${x + barWidth/2}" y="${height - padding + 16}" fill="var(--text-secondary)" font-size="9.5" text-anchor="middle" font-family="var(--font-sans)">${d.continent}</text>
    `;
  });
  
  svg += `
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.12)" />
  </svg>`;
  
  DOM.caloriesBarChart.innerHTML = svg;
}

/**
 * Compiles stats cards displaying counts
 */
function renderDietaryStats() {
  const data = mockAnalyticsData.dietaryPrevalence;
  DOM.dietaryProfileStats.innerHTML = '';
  data.forEach(item => {
    const pill = document.createElement('div');
    pill.className = 'stats-pill';
    pill.innerHTML = `
      <span class="stats-pill-name">${item.category}</span>
      <span class="stats-pill-val">${item.count.toLocaleString()} recipes</span>
    `;
    DOM.dietaryProfileStats.appendChild(pill);
  });
}

// ==========================================
// TARGET NUTRI-PLANNER SOLVER
// ==========================================

/**
 * Dynamic calculation engine querying databases for matching target values
 */
function solveNutriPlan() {
  const allRecipes = [
    ...state.allFetchedRecipes
  ];

  const targets = state.plannerTargets;
  
  // Find recipes meeting macro constraints
  const matches = allRecipes.filter(recipe => {
    const cal = parseFloat(recipe.Calories) || 120;
    const carb = parseFloat(recipe['Carbohydrate, by difference (g)']) || 30;
    const prot = parseFloat(recipe['Protein (g)']) || 10;
    const fat = parseFloat(recipe['Total lipid (fat) (g)']) || 5;
    
    return cal <= targets.calories && 
           carb <= targets.carbs && 
           prot >= targets.protein && 
           fat <= targets.fat;
  });

  // Render planner recommended list cards
  DOM.plannerResults.innerHTML = '';
  if (matches.length === 0) {
    DOM.plannerResults.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.8rem;">
        No recipes match current target constraints. Try raising limits.
      </div>
    `;
    return;
  }

  matches.slice(0, 15).forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'planner-result-card';
    
    card.innerHTML = `
      <div>
        <div class="planner-result-title">${recipe.Recipe_title}</div>
        <div class="planner-result-meta">
          Prot: ${parseFloat(recipe['Protein (g)'] || 10).toFixed(0)}g | 
          Carbs: ${parseFloat(recipe['Carbohydrate, by difference (g)'] || 10).toFixed(0)}g
        </div>
      </div>
      <span class="planner-result-badge">${parseFloat(recipe.Calories || 100).toFixed(0)} Cal</span>
    `;
    
    card.addEventListener('click', () => openRecipeDetails(recipe));
    DOM.plannerResults.appendChild(card);
  });
}

// ==========================================
// DEVELOPER PLAYGROUND CONSOLE CONTROLLERS
// ==========================================

/**
 * Sidebar loaded with available endpoints configurations
 */
function renderEndpointsSidebar() {
  DOM.endpointSidebar.innerHTML = '';
  Object.entries(endpointsDirectory).forEach(([key, endpoint]) => {
    const btn = document.createElement('button');
    btn.className = `endpoint-btn ${state.activeEndpoint === key ? 'active' : ''}`;
    btn.setAttribute('data-endpoint-key', key);
    
    btn.innerHTML = `
      <div class="endpoint-path">
        <span class="endpoint-method get">${endpoint.method}</span>
        <span>${endpoint.path}</span>
      </div>
      <div class="endpoint-title">${endpoint.name}</div>
    `;
    
    btn.addEventListener('click', () => selectEndpoint(key));
    DOM.endpointSidebar.appendChild(btn);
  });

  updatePlaygroundWorkspace();
}

/**
 * Switch selected endpoint, updating parameters and paths
 */
function selectEndpoint(key) {
  state.activeEndpoint = key;
  DOM.endpointSidebar.querySelectorAll('.endpoint-btn').forEach(b => {
    b.classList.remove('active');
  });
  
  const activeBtn = DOM.endpointSidebar.querySelector(`[data-endpoint-key="${key}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  updatePlaygroundWorkspace();
}

/**
 * Populates workstation inputs and parameters forms
 */
function updatePlaygroundWorkspace() {
  const ep = endpointsDirectory[state.activeEndpoint];
  DOM.pgMethodTag.textContent = ep.method;
  DOM.pgUrlInput.value = `${configStore.baseUrl}${ep.path}`;

  // Populate dynamic parameter fields
  DOM.pgParamsContainer.innerHTML = '';
  if (ep.params.length === 0) {
    DOM.pgParamsPanel.style.display = 'none';
  } else {
    DOM.pgParamsPanel.style.display = 'block';
    ep.params.forEach(param => {
      const group = document.createElement('div');
      group.className = 'param-input-group';
      group.innerHTML = `
        <label class="param-label" for="pg-param-${param.key}">
          ${param.key} <span style="color:var(--text-muted);font-weight:normal;">(${param.type})</span>
        </label>
        <input type="${param.type}" class="param-field" id="pg-param-${param.key}" value="${param.default}" placeholder="${param.desc}">
      `;
      DOM.pgParamsContainer.appendChild(group);
    });
  }
}

/**
 * Triggers request dispatcher, counting time and rendering outputs
 */
async function dispatchPlaygroundRequest() {
  const ep = endpointsDirectory[state.activeEndpoint];
  const queryParams = {};
  
  // Extract inputs
  ep.params.forEach(param => {
    const input = document.getElementById(`pg-param-${param.key}`);
    if (input) {
      queryParams[param.key] = input.value;
    }
  });

  // Pulse console body to indicate active request
  DOM.pgConsoleOutput.textContent = '// Dispatching request to live systems...';
  DOM.pgConsoleOutput.className = 'code-block';
  
  DOM.consoleMetricStatus.querySelector('span').textContent = 'PND';
  DOM.consoleMetricStatus.querySelector('span').style.color = 'var(--text-muted)';
  DOM.consoleMetricTime.querySelector('span').textContent = '--';

  const result = await executeApiRequest({
    path: ep.path,
    queryParams,
    method: ep.method
  });

  state.lastResponse = result;
  
  // Update metrics dashboard
  const statusEl = DOM.consoleMetricStatus.querySelector('span');
  statusEl.textContent = `${result.status} ${result.statusText}`;
  if (result.status >= 200 && result.status < 300) {
    statusEl.style.color = 'var(--accent-emerald)';
    showToast(`Request successful: ${result.status} ${result.statusText}`, 'success');
  } else {
    statusEl.style.color = 'var(--accent-red)';
    showToast(`Request failed: ${result.status} ${result.statusText}`, 'error');
  }

  DOM.consoleMetricTime.querySelector('span').textContent = `${result.timeMs}ms`;

  // Render text blocks
  switchConsoleTab(state.consoleTab);
}

function switchConsoleTab(tabKey) {
  state.consoleTab = tabKey;
  DOM.pgTabBtnResponse.classList.toggle('active', tabKey === 'response');
  DOM.pgTabBtnHeaders.classList.toggle('active', tabKey === 'headers');
  DOM.pgTabBtnCurl.classList.toggle('active', tabKey === 'curl');

  if (!state.lastResponse) return;

  DOM.pgConsoleOutput.innerHTML = '';
  if (tabKey === 'response') {
    const formattedJson = JSON.stringify(state.lastResponse.data, null, 2);
    DOM.pgConsoleOutput.innerHTML = colorizeJson(formattedJson);
  } else if (tabKey === 'headers') {
    const formattedHeaders = JSON.stringify(state.lastResponse.headers, null, 2);
    DOM.pgConsoleOutput.innerHTML = colorizeJson(formattedHeaders);
  } else if (tabKey === 'curl') {
    DOM.pgConsoleOutput.className = 'code-block';
    DOM.pgConsoleOutput.textContent = state.lastResponse.curl;
  }
}

/**
 * Regex-based syntax colorizer rendering formatted JSON string on developers dashboards
 */
function colorizeJson(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2);
  }
  
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
    let cls = 'token-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'token-key';
      } else {
        cls = 'token-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'token-boolean';
    } else if (/null/.test(match)) {
      cls = 'token-null';
    }
    return `<span class="${cls}">${match}</span>`;
  });
}

/**
 * Filters the recipes grid by geocultural cuisine selected in the carousel
 */
function filterRecipesByCuisine(cuisine) {
  let list = [...state.allFetchedRecipes];
  if (cuisine) {
    list = list.filter(r => 
      (r.Region || '').toLowerCase().includes(cuisine.toLowerCase()) || 
      (r.Sub_region || '').toLowerCase().includes(cuisine.toLowerCase()) || 
      (r.Continent || '').toLowerCase().includes(cuisine.toLowerCase())
    );
    showToast(`Filtered recipes by ${cuisine} cuisine`, 'info');
    DOM.resultsTableTitle.textContent = `Showing ${cuisine} Cuisines`;
  } else {
    showToast('Showing all recipes', 'info');
    DOM.resultsTableTitle.textContent = 'Showing All Recipes';
  }
  
  state.recipesList = list;
  state.currentPage = 1;
  renderDataTableSlice();
}

/**
 * Renders a floating notification toast inside the toast-container
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-dot"></div>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

