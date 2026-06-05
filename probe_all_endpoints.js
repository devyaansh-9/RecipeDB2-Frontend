const https = require('https');

function testPath(path) {
  return new Promise((resolve) => {
    const key = 'ESL32hFBESL4RjiwN_0glmpSV9nBqlR4gdXKGF0ZOKWowzNc';
    
    const options = {
      hostname: 'api.foodoscope.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          path: path,
          status: res.statusCode,
          snippet: data.substring(0, 150)
        });
      });
    });

    req.on('error', (err) => {
      resolve({ path: path, error: err.message });
    });
    
    req.end();
  });
}

async function run() {
  const prefixes = ['/recipe2-api', '/recipe2-api/recipe'];
  const endpoints = [
    '/recipesinfo',
    '/recipeofday',
    '/recipe-day/with-ingredients-categories',
    '/nutritioninfo',
    '/micronutritioninfo',
    '/recipes/range',
    '/recipes_cuisine/cuisine/US',
    '/recipeByTitle',
    '/recipebytitle',
    '/recipe-by-title',
    '/calories',
    '/region-diet',
    '/recipe-diet',
    '/recipes-by-carbs',
    '/instructions/2610',
    '/meal-plan',
    '/ingredients/flavor/sweet',
    '/byutensils/utensils',
    '/recipes-method/bake',
    '/byenergy/energy',
    '/by-ingredients-categories-title',
    '/category',
    '/search-recipe/2610',
    '/protein-range',
    '/recipe-Day-category'
  ];
  
  const tests = [];
  for (const pref of prefixes) {
    for (const ep of endpoints) {
      tests.push(pref + ep);
    }
  }
  
  // Also add some with query parameters
  tests.push('/recipe2-api/recipe/recipeByTitle?recipe_title=Lentil');
  tests.push('/recipe2-api/recipeByTitle?recipe_title=Lentil');
  tests.push('/recipe2-api/recipe/recipeByTitle?title=Lentil');
  tests.push('/recipe2-api/recipeByTitle?title=Lentil');
  tests.push('/recipe2-api/recipe/category?category=Dairy');
  tests.push('/recipe2-api/category?category=Dairy');
  
  for (const t of tests) {
    const res = await testPath(t);
    if (res.status !== 404) {
      console.log(`PATH: ${res.path} -> STATUS: ${res.status}`);
      console.log(`SNIPPET: ${res.snippet.replace(/\n/g, ' ')}`);
      console.log('------------------------------------');
    }
  }
}

run();
