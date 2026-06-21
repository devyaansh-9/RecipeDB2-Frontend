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
        try {
          const parsed = JSON.parse(data);
          resolve({
            path: path,
            status: res.statusCode,
            success: parsed.success,
            data: parsed
          });
        } catch (e) {
          resolve({ path: path, status: res.statusCode, error: e.message, snippet: data.substring(0, 200) });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ path: path, error: err.message });
    });
    
    req.end();
  });
}

async function run() {
  const tests = [
    '/recipe2-api/recipe/recipeByTitle?recipe_title=Lentil',
    '/recipe2-api/recipe/recipeByTitle?title=Lentil',
    '/recipe2-api/recipe/recipeByTitle?recipe_title=Egyptian%20Lentil%20Soup',
    '/recipe2-api/recipe/category?category=Dairy',
    '/recipe2-api/recipe/category?category=Dairy&page=1&limit=5',
    '/recipe2-api/recipe/search-recipe/2610',
    '/recipe2-api/recipe/search-recipe/5'
  ];
  
  for (const t of tests) {
    const res = await testPath(t);
    console.log(`PATH: ${res.path}`);
    console.log(`STATUS: ${res.status}`);
    console.log(`DATA SNIPPET: ${JSON.stringify(res.data || res.snippet).substring(0, 300)}`);
    console.log('------------------------------------');
  }
}

run();
