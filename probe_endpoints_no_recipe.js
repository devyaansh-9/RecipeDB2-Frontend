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
    '/recipe2-api/recipes_cuisine/cuisine/Indian',
    '/recipe2-api/recipes_cuisine/cuisine/indian',
    '/recipe2-api/recipeByTitle?recipe_title=Lentil',
    '/recipe2-api/recipeByTitle?title=Lentil',
    '/recipe2-api/search-recipe/5',
    '/recipe2-api/category/Dairy',
    '/recipe2-api/category?category=Dairy',
    '/recipe2-api/recipes-by-carbs?carbs=30',
    '/recipe2-api/recipes_cuisine/cuisine/Italian',
    '/recipe2-api/recipes_cuisine/cuisine/French'
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
