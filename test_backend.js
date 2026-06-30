const http = require('http');

function probe(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
  });
}

async function run() {
  const target = 'http://192.168.1.92:3030';
  const data = await probe(`${target}/recipe2-api/recipe/recipesinfo?page=1&limit=10`);
  console.log("Keys of response:", Object.keys(data));
  console.log("Success:", data.success);
  console.log("Message:", data.message);
  if (data.payload) {
    console.log("payload keys:", Object.keys(data.payload));
    if (data.payload.data) {
      console.log("payload.data is array:", Array.isArray(data.payload.data));
      console.log("payload.data length:", data.payload.data.length);
      console.log("First item keys:", Object.keys(data.payload.data[0]));
    }
  } else {
    console.log("No payload field found!");
  }
}

run();
