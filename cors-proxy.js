// Simple CORS proxy for RecipeDB2 API
const http = require('http');

const TARGET = 'cosylab.iiitd.edu.in';
const TARGET_PORT = 6969;
const PROXY_PORT = 3001;

const server = http.createServer((req, res) => {
  // Add CORS headers to every response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const options = {
    hostname: TARGET,
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `${TARGET}:${TARGET_PORT}` }
  };

  const proxy = http.request(options, (proxyRes) => {
    // Copy status + headers, override CORS
    const headers = { ...proxyRes.headers };
    headers['access-control-allow-origin'] = '*';
    headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    headers['access-control-allow-headers'] = 'Content-Type, Authorization';

    res.writeHead(proxyRes.statusCode, headers);
    proxyRes.pipe(res);
  });

  proxy.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ success: false, message: 'Proxy error: ' + err.message }));
  });

  req.pipe(proxy);
});

server.listen(PROXY_PORT, () => {
  console.log(`\n  CORS Proxy running at http://localhost:${PROXY_PORT}`);
  console.log(`  Forwarding to http://${TARGET}:${TARGET_PORT}\n`);
});
