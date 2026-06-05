const https = require('https');

function getRecipes(path) {
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
          resolve(parsed);
        } catch (e) {
          resolve({});
        }
      });
    });

    req.on('error', () => resolve({}));
    req.end();
  });
}

async function run() {
  const result1 = await getRecipes('/recipe2-api/recipe/recipesinfo?page=1&page_size=100');
  console.log("With page_size=100 - Data length:", result1.payload && result1.payload.data ? result1.payload.data.length : null);
  
  const result2 = await getRecipes('/recipe2-api/recipe/recipesinfo?page=1&limit=100');
  console.log("With limit=100 - Data length:", result2.payload && result2.payload.data ? result2.payload.data.length : null);
}

run();
