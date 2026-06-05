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
          resolve(parsed);
        } catch (e) {
          resolve({ error: e.message, data: data.substring(0, 300) });
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
  const result = await testPath('/recipe2-api/recipes_cuisine/cuisine/Indian?page=1&page_size=5');
  console.log("Keys in response:", Object.keys(result));
  if (result.payload) {
    console.log("Keys in payload:", Object.keys(result.payload));
    if (Array.isArray(result.payload.data)) {
      console.log("payload.data length:", result.payload.data.length);
      console.log("First recipe:", JSON.stringify(result.payload.data[0], null, 2));
    } else {
      console.log("payload.data is not an array:", typeof result.payload.data);
    }
  } else {
    console.log("No payload in response:", result);
  }
}

run();
