const https = require('https');

function testParams(queryParams) {
  return new Promise((resolve) => {
    const key = 'ESL32hFBESL4RjiwN_0glmpSV9nBqlR4gdXKGF0ZOKWowzNc';
    
    // Construct query string
    const query = Object.entries(queryParams)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
      
    const path = `/recipe2-api/recipe/recipesinfo?page=1&limit=5&${query}`;
    
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
            query: queryParams,
            status: res.statusCode,
            success: parsed.success,
            totalCount: parsed.payload && parsed.payload.pagination ? parsed.payload.pagination.totalCount : null,
            dataLength: parsed.payload && parsed.payload.data ? parsed.payload.data.length : null,
            firstTitle: parsed.payload && parsed.payload.data && parsed.payload.data[0] ? parsed.payload.data[0].Recipe_title : null,
            firstRegion: parsed.payload && parsed.payload.data && parsed.payload.data[0] ? parsed.payload.data[0].Region : null
          });
        } catch (e) {
          resolve({ query: queryParams, status: res.statusCode, error: e.message });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ query: queryParams, error: err.message });
    });
    
    req.end();
  });
}

async function run() {
  const tests = [
    { recipe_title: 'Egyptian' },
    { title: 'Egyptian' },
    { region: 'Middle Eastern' },
    { cuisine: 'Middle Eastern' },
    { category: 'Dairy' },
    { ingredients: 'Garlic' },
    { excludeIngredients: 'Garlic' }
  ];
  
  for (const t of tests) {
    const res = await testParams(t);
    console.log(JSON.stringify(res, null, 2));
    console.log('------------------------------------');
  }
}

run();
