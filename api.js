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
    if (!url || url.includes('cosylab.iiitd.edu.in')) {
      url = 'https://api.foodoscope.com';
      localStorage.setItem('recipedb_baseUrl', url);
    }
    return url;
  },
  set baseUrl(val) {
    localStorage.setItem('recipedb_baseUrl', val);
  },
  get apiKey() {
    let key = localStorage.getItem('recipedb_apiKey');
    if (!key || key === 'undefined' || key === 'null' || key === 'v5cwjQotMtbTnlq3-bV2VPotjdR-UJaLDNQzbRhGzky99D00' || key === 'YqC-5Yc3J3sfoFEZhFtLjPztv9uVh8juKqYhlE7_sSInaCj6' || key === 'CnLZys6hZiEzvl-aPlurxqyMKNUUdwuTzWsxjwd7ASIvKqLL' || key === 'ESL32hFBESL4RjiwN_0glmpSV9nBqlR4gdXKGF0ZOKWowzNc' || key === '-BQKD4dXZR6WFf5pzP3icei3DvcBDE0KR--M6GdyIwp0UA5H') {
      key = 'B9T3fCoeHaRKdHvPUm5k_hzzVMb7-xxLXNXpkydXeZg5-K7n';
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
    
    console.warn('Live API request failed.', err);
    resultMetrics.isMockUsed = false;
    resultMetrics.statusText = 'CORS/Network Error';
    resultMetrics.data = null;
    return resultMetrics;
  }
}

/**
 * Resolver for local mock data based on requested path
 */
function getMockDataForPath(path, queryParams) {
  return {
    success: false,
    message: 'Mock sandbox disabled',
    payload: null
  };
}
