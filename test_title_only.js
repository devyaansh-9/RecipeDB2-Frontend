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
          snippet: data.substring(0, 300)
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
  const paths = [
    '/recipe2-api/recipe/recipeByTitle?recipe_title=Lentil',
    '/recipe2-api/recipeByTitle?recipe_title=Lentil',
    '/recipe2-api/recipe/recipeByTitle?title=Lentil',
    '/recipe2-api/recipeByTitle?title=Lentil'
  ];
  
  for (const p of paths) {
    const res = await testPath(p);
    console.log(`PATH: ${res.path} -> STATUS: ${res.status}`);
    console.log(`SNIPPET: ${res.snippet}`);
    console.log('------------------------------------');
  }
}

run();
