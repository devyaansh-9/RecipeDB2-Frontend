// API Handler for RecipeDB2 Frontend & Playground
import { 
  mockRecipesInfo, 
  mockRecipeOfDay, 
  mockRecipeWithExclusions, 
  mockNutritionInfo 
} from './mockData.js';

// Configuration store backed by LocalStorage
export const configStore = {
  get baseUrl() {
    let url = localStorage.getItem('recipedb_baseUrl');
    if (!url || url === 'https://api.foodoscope.com') {
      url = 'http://cosylab.iiitd.edu.in:6969';
      localStorage.setItem('recipedb_baseUrl', url);
    }
    return url;
  },
  set baseUrl(val) {
    localStorage.setItem('recipedb_baseUrl', val);
  },
  get apiKey() {
    let key = localStorage.getItem('recipedb_apiKey');
    if (!key || key === 'undefined' || key === 'null' || key === 'v5cwjQotMtbTnlq3-bV2VPotjdR-UJaLDNQzbRhGzky99D00' || key === 'CnLZys6hZiEzvl-aPlurxqyMKNUUdwuTzWsxjwd7ASIvKqLL') {
      key = 'YqC-5Yc3J3sfoFEZhFtLjPztv9uVh8juKqYhlE7_sSInaCj6';
      localStorage.setItem('recipedb_apiKey', key);
    }
    return key;
  },
  set apiKey(val) {
    localStorage.setItem('recipedb_apiKey', val);
  },
  get engine() {
    let eng = localStorage.getItem('recipedb_engine');
    if (!eng || eng === 'mock') {
      eng = 'live';
      localStorage.setItem('recipedb_engine', 'live');
    }
    return eng;
  },
  set engine(val) {
    localStorage.setItem('recipedb_engine', val);
  }
};

/**
 * Execute an API call, tracking latency, status, headers, and generating curl equivalents.
 * Supports auto-fallback to mock engine if live fails due to network/CORS.
 */
export async function executeApiRequest({ path, method = 'GET', queryParams = {}, description = '' }) {
  const isMock = configStore.engine === 'mock';
  const startTime = performance.now();
  const urlObj = new URL(`${configStore.baseUrl}${path}`);
  
  // Attach query parameters
  Object.entries(queryParams).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      urlObj.searchParams.append(key, val);
    }
  });

  const url = urlObj.toString();
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (configStore.apiKey) {
    headers['Authorization'] = `Bearer ${configStore.apiKey}`;
  }

  // Generate equivalent curl command
  let curlCmd = `curl -X ${method} "${url}" \\\n  -H "Content-Type: ${headers['Content-Type']}"`;
  if (configStore.apiKey) {
    curlCmd += ` \\\n  -H "Authorization: Bearer ${configStore.apiKey.substring(0, 12)}..."`;
  }

  const resultMetrics = {
    url,
    method,
    curl: curlCmd,
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    timeMs: 0,
    data: null,
    isMockUsed: isMock,
    error: null
  };

  if (isMock) {
    // Simulate network latency (between 150ms and 350ms)
    await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 200));
    resultMetrics.timeMs = Math.round(performance.now() - startTime);
    resultMetrics.status = 200;
    resultMetrics.statusText = 'OK (Mock Sandbox)';
    resultMetrics.headers = {
      'x-sandbox-engine': 'RecipeDB2 Sandbox Engine v1.0',
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-cache',
      'date': new Date().toUTCString()
    };
    resultMetrics.data = getMockDataForPath(path, queryParams);
    return resultMetrics;
  }

  // Live Request Mode
  try {
    const response = await fetch(url, {
      method,
      headers
    });
    
    const endTime = performance.now();
    resultMetrics.timeMs = Math.round(endTime - startTime);
    resultMetrics.status = response.status;
    resultMetrics.statusText = response.statusText;
    
    // Copy headers
    const respHeaders = {};
    response.headers.forEach((val, key) => {
      respHeaders[key] = val;
    });
    resultMetrics.headers = respHeaders;

    const text = await response.text();
    try {
      resultMetrics.data = JSON.parse(text);
    } catch {
      resultMetrics.data = text;
    }
    
    return resultMetrics;
  } catch (err) {
    const endTime = performance.now();
    resultMetrics.timeMs = Math.round(endTime - startTime);
    resultMetrics.status = 500;
    resultMetrics.statusText = 'CORS/Network Error';
    resultMetrics.error = err.message;
    resultMetrics.headers = {
      'x-error-cause': 'CORS policy blocked direct access or endpoint is offline'
    };
    
    // Auto-fallback helper
    console.warn('Live API request failed. Falling back to Mock Database Sandbox.', err);
    resultMetrics.isMockUsed = true;
    resultMetrics.statusText = 'CORS Blocked (Fallback to Mock)';
    resultMetrics.data = getMockDataForPath(path, queryParams);
    return resultMetrics;
  }
}

/**
 * Resolver for local mock data based on requested path
 */
function getMockDataForPath(path, queryParams) {
  if (path.includes('/recipe/recipesinfo')) {
    // Simple pagination mock
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const allData = mockRecipesInfo.payload.data;
    
    // Paginate mock data
    const startIndex = (page - 1) * limit;
    const paginatedData = allData.slice(startIndex, startIndex + limit);
    
    return {
      ...mockRecipesInfo,
      payload: {
        data: paginatedData,
        pagination: {
          totalCount: allData.length,
          totalPages: Math.ceil(allData.length / limit),
          currentPage: page,
          itemsPerPage: limit
        }
      }
    };
  }
  
  if (path.includes('/recipe/recipeofday')) {
    return mockRecipeOfDay;
  }
  
  if (path.includes('/recipe/recipe-day/with-ingredients-categories')) {
    return mockRecipeWithExclusions;
  }
  
  if (path.includes('/recipe-nutri/nutritioninfo')) {
    return mockNutritionInfo;
  }
  
  return {
    success: false,
    message: 'Unknown endpoint',
    payload: null
  };
}
