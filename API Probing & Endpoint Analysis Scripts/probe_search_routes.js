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
          resolve({ path: path, status: res.statusCode, error: e.message, snippet: data.substring(0, 150) });
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
  const routes = [
    '/recipe2-api/recipes?page=1&page_size=5',
    '/recipe2-api/recipe?page=1&page_size=5',
    '/recipe2-api/search?title=Lentil&page=1&page_size=5',
    '/recipe2-api/recipes_cuisine/cuisine/Indian%20Subcontinent?page=1&page_size=5',
    '/recipe2-api/category?category=Dairy&page=1&page_size=5',
    '/recipe2-api/recipe/recipesinfo?page=1&page_size=5',
    '/recipe2-api/recipeByTitle?title=Lentil',
    '/recipe2-api/recipesByTitle?title=Lentil'
  ];
  
  for (const r of routes) {
    const res = await testPath(r);
    console.log(`PATH: ${res.path}`);
    console.log(`STATUS: ${res.status}`);
    console.log(`SUCCESS: ${res.success}`);
    console.log(`KEYS: ${res.data ? Object.keys(res.data) : 'None'}`);
    if (res.data && res.data.payload) {
      console.log(`PAYLOAD KEYS: ${Object.keys(res.data.payload)}`);
      if (res.data.payload.data) console.log(`DATA LENGTH: ${res.data.payload.data.length}`);
    } else if (res.data && res.data.data) {
      console.log(`DATA LENGTH: ${res.data.data.length}`);
    }
    console.log('------------------------------------');
  }
}

run();
