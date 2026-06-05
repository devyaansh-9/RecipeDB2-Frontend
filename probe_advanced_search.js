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
  console.log("Sleeping 65 seconds to clear rate limit...");
  await new Promise(r => setTimeout(r, 65000));
  
  const paths = [
    '/recipe2-api/by-ingredients-categories-title?ingredients=Garlic&page=1&page_size=5',
    '/recipe2-api/recipeByTitle?title=Lentil&page=1&page_size=5',
    '/recipe2-api/recipes-by-carbs?carbs=30&page=1&page_size=5'
  ];
  
  for (const p of paths) {
    const res = await testPath(p);
    console.log(`PATH: ${res.path} -> STATUS: ${res.status}`);
    console.log(`SNIPPET: ${res.snippet}`);
    console.log('------------------------------------');
  }
}

run();
