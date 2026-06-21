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
            totalResults: parsed.totalResults,
            firstTitle: parsed.data && parsed.data[0] ? parsed.data[0].Recipe_title || parsed.data[0].title : null,
            firstRegion: parsed.data && parsed.data[0] ? parsed.data[0].Region || parsed.data[0].region : null
          });
        } catch (e) {
          resolve({ path: path, status: res.statusCode, error: e.message });
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
  const tests = [
    '/recipe2-api/recipes_cuisine/cuisine/India?page=1&page_size=5',
    '/recipe2-api/recipes_cuisine/cuisine/South%20Asian?page=1&page_size=5',
    '/recipe2-api/recipes_cuisine/cuisine/Asia?page=1&page_size=5',
    '/recipe2-api/recipes_cuisine/cuisine/Asian?page=1&page_size=5',
    '/recipe2-api/recipes_cuisine/cuisine/East%20Asian?page=1&page_size=5',
    '/recipe2-api/recipes_cuisine/cuisine/North%20American?page=1&page_size=5',
    '/recipe2-api/recipes_cuisine/cuisine/American?page=1&page_size=5',
    '/recipe2-api/recipes_cuisine/cuisine/US?page=1&page_size=5',
    '/recipe2-api/recipes_cuisine/cuisine/USA?page=1&page_size=5'
  ];
  
  for (const t of tests) {
    const res = await testPath(t);
    console.log(JSON.stringify(res, null, 2));
    console.log('------------------------------------');
  }
}

run();
