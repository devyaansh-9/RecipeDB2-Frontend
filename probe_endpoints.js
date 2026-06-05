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
          isJSON: res.headers['content-type'] && res.headers['content-type'].includes('application/json'),
          length: data.length,
          snippet: data.substring(0, 150)
        });
      });
    });

    req.on('error', (err) => {
      resolve({ path, error: err.message });
    });
    
    req.end();
  });
}

async function run() {
  const pathsToTest = [
    '/recipe2-api/recipe/recipes_cuisine/cuisine/Indian',
    '/recipe2-api/recipe/recipes_cuisine/cuisine/indian',
    '/recipe2-api/recipe/recipes_cuisine/Indian',
    '/recipe2-api/recipe/recipes_cuisine/cuisine?region=Indian',
    '/recipe2-api/recipe/recipes_cuisine?region=Indian',
    '/recipe2-api/recipe/recipes_cuisine/cuisine/Indian/page/1/limit/5',
    '/recipe2-api/recipe/recipes_cuisine/cuisine/Indian?page=1&limit=5',
    '/recipe2-api/recipe/cuisine/Indian',
    '/recipe2-api/recipe/recipeByTitle?recipe_title=Lentil',
    '/recipe2-api/recipe/category?category=Dairy',
    '/recipe2-api/recipe/search-recipe/5'
  ];
  
  for (const p of pathsToTest) {
    const res = await testPath(p);
    console.log(`PATH: ${res.path}`);
    console.log(`STATUS: ${res.status}`);
    console.log(`IS JSON: ${res.isJSON}`);
    console.log(`SNIPPET: ${res.snippet.replace(/\n/g, ' ')}`);
    console.log('------------------------------------');
  }
}

run();
