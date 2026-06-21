const https = require('https');

function testParam(path) {
  return new Promise((resolve) => {
    const key = 'ESL32hFBESL4RjiwN_0glmpSV9nBqlR4gdXKGF0ZOKWowzNc';
    
    console.log(`Testing query: https://api.foodoscope.com${path}`);
    
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
            status: res.statusCode,
            success: parsed.success,
            totalCount: parsed.payload && parsed.payload.pagination ? parsed.payload.pagination.totalCount : (parsed.payload ? parsed.payload.length : null),
            dataLength: parsed.payload && parsed.payload.data ? parsed.payload.data.length : (parsed.payload ? parsed.payload.length : null),
            firstTitle: parsed.payload && parsed.payload.data && parsed.payload.data[0] ? parsed.payload.data[0].Recipe_title : (parsed.payload && parsed.payload[0] ? parsed.payload[0].Recipe_title : null),
            firstRegion: parsed.payload && parsed.payload.data && parsed.payload.data[0] ? parsed.payload.data[0].Region : (parsed.payload && parsed.payload[0] ? parsed.payload[0].Region : null)
          });
        } catch (e) {
          resolve({ status: res.statusCode, error: e.message, data: data.substring(0, 500) });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message });
    });
    
    req.end();
  });
}

async function run() {
  const result = await testParam('/recipe2-api/recipe/recipes_cuisine/cuisine/Indian?page=1&limit=5');
  console.log("Result:", JSON.stringify(result, null, 2));
}

run();
