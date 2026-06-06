/**
 * Refined Live Search Integration Test
 * 
 * Verifies:
 * 1. Title search fetching multiple pages.
 * 2. Country browsing: maps the country "Egyptian" to region "Middle Eastern",
 *    fetches 4 pages sequentially, and filters locally for "Egyptian".
 */

const https = require('https');

const API_KEY = 'k6Hprs-yAwqx4e7Lpovpe3z-V8cGHObIqnZryOsNGvzkXIpE';
const BASE_URL = 'api.foodoscope.com';

function fetchFromFoodoscope(path, queryParams = {}) {
  return new Promise((resolve) => {
    const queryStr = Object.entries(queryParams)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    const fullPath = path + (queryStr ? `?${queryStr}` : '');
    
    const options = {
      hostname: BASE_URL,
      port: 443,
      path: fullPath,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ statusCode: 500, error: e.message });
    });

    req.end();
  });
}

async function fetchMultiplePages(path, baseParams, responseKey, numPages = 4) {
  let combinedRecipes = [];
  const limitKey = (path.includes('recipes_cuisine') || path.includes('category')) ? 'page_size' : 'limit';

  for (let p = 1; p <= numPages; p++) {
    const queryParams = {
      ...baseParams,
      page: p,
      [limitKey]: 10
    };
    
    if (p > 1) {
      await new Promise(r => setTimeout(r, 300));
    }

    const res = await fetchFromFoodoscope(path, queryParams);
    if (res.statusCode === 200 && res.body) {
      let data = [];
      if (responseKey === "root") {
        data = res.body.data || [];
      } else {
        const payload = res.body.payload || {};
        data = payload.data || [];
      }
      combinedRecipes = combinedRecipes.concat(data);
    } else if (res.statusCode === 429) {
      console.log(`⚠️ Received 429 rate limit on page ${p}, backing off for 1.2 seconds...`);
      await new Promise(r => setTimeout(r, 1200));
      p--; // Retry this page
    } else {
      console.log(`⚠️ Page ${p} request returned status ${res.statusCode}`);
    }
  }

  return combinedRecipes;
}

const countryToRegionMap = {
  "Argentine": "South American",
  "Bangladeshi": "Indian Subcontinent",
  "Indian": "Indian Subcontinent",
  "Canadian": "Canadian",
  "Egyptian": "Middle Eastern",
  "French": "French",
  "Greek": "Greek",
  "Italian": "Italian",
  "Japanese": "Japanese",
  "Korean": "Korean",
  "Mexican": "Mexican",
  "Rest Caribbean": "Caribbean",
  "Russian": "Eastern European",
  "Thai": "Thai",
  "US": "US"
};

async function runLiveSearchTests() {
  console.log('=== STARTING REFINED LIVE SEARCH TEST ===\n');

  // Test Case 1: Search by Title ("Soup") in general recipes (multipage)
  console.log('Test Case 1: Searching for "Soup" in general recipes (fetching 4 pages sequentially)...');
  const t1Start = Date.now();
  try {
    const recipes = await fetchMultiplePages('/recipe2-api/recipe/recipesinfo', {}, 'payload', 4);
    console.log(`- Fetched ${recipes.length} total recipes in ${Date.now() - t1Start}ms.`);

    const searchQuery = 'soup';
    const matches = recipes.filter(item => 
      item.Recipe_title.toLowerCase().includes(searchQuery)
    );

    console.log(`- Found ${matches.length} recipes matching "soup":`);
    matches.slice(0, 5).forEach(item => {
      console.log(`  * [ID: ${item.Recipe_id}] ${item.Recipe_title} (${item.Region || 'Unknown region'})`);
    });

    if (matches.length > 0) {
      console.log('✅ Title search test passed!');
    } else {
      console.log('❌ Failure: No recipes matching "soup" found.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error in Test Case 1:', err);
    process.exit(1);
  }

  console.log('\n-----------------------------------------------\n');

  // Test Case 2: Country browsing (e.g. select "Egyptian" from Country dropdown)
  // Logic: Maps "Egyptian" to region "Middle Eastern", fetches Middle Eastern recipes, and filters locally for Egyptian.
  console.log('Test Case 2: Browsing Country "Egyptian" (mapping to "Middle Eastern" and fetching 4 pages sequentially)...');
  const t2Start = Date.now();
  try {
    const countryInput = 'Egyptian';
    const mappedRegion = countryToRegionMap[countryInput];
    console.log(`- Country "${countryInput}" mapped to Region "${mappedRegion}"`);

    const path = `/recipe2-api/recipes_cuisine/cuisine/${encodeURIComponent(mappedRegion)}`;
    const recipes = await fetchMultiplePages(path, {}, 'root', 4);
    console.log(`- Fetched ${recipes.length} total ${mappedRegion} recipes in ${Date.now() - t2Start}ms.`);

    // Local filter by country
    const matches = recipes.filter(item => {
      const sr = (item.Sub_region || "").toLowerCase();
      return sr && sr.includes(countryInput.toLowerCase());
    });

    console.log(`- Found ${matches.length} Egyptian recipes within the fetched ${mappedRegion} recipes:`);
    matches.forEach(item => {
      console.log(`  * [ID: ${item.Recipe_id}] ${item.Recipe_title} (Sub-region: ${item.Sub_region})`);
    });

    if (matches.length > 0) {
      console.log('✅ Country browsing test passed!');
    } else {
      console.log('❌ Failure: No Egyptian recipes found in the fetched Middle Eastern region.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error in Test Case 2:', err);
    process.exit(1);
  }

  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');
}

// Wait 1.5 seconds before running to avoid immediate rate limit trigger
setTimeout(runLiveSearchTests, 1500);
