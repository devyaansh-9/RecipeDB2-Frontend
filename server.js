const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const TARGET_HOST = '192.168.1.92';
const TARGET_PORT = 3030;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  // 1. Check if it's an API request
  if (req.url.startsWith('/recipe2-api')) {
    const options = {
      hostname: TARGET_HOST,
      port: TARGET_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: `${TARGET_HOST}:${TARGET_PORT}`
      }
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy Error connecting to database:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: false, message: 'Proxy failed to connect: ' + err.message }));
    });

    req.pipe(proxyReq);
    return;
  }

  // 2. Otherwise, serve static files from /dist
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  
  // Handle directory requests (if it's a folder, serve index.html inside it)
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA Routing fallback: serve index.html for unknown routes
        fs.readFile(path.join(__dirname, 'dist', 'index.html'), (err2, content2) => {
          if (err2) {
            res.writeHead(500);
            res.end('Error loading index.html');
          } else {
            res.writeHead(200, { 
              'Content-Type': 'text/html',
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
              'Surrogate-Control': 'no-store'
            });
            res.end(content2);
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      const headers = { 'Content-Type': contentType };
      // Force no-cache for HTML files
      if (contentType === 'text/html') {
        headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
        headers['Pragma'] = 'no-cache';
        headers['Expires'] = '0';
        headers['Surrogate-Control'] = 'no-store';
      }
      res.writeHead(200, headers);
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n================================================================`);
  console.log(`  RecipeDB2 Frontend Server running at: http://localhost:${PORT}`);
  console.log(`  Proxying /recipe2-api requests to: http://${TARGET_HOST}:${TARGET_PORT}`);
  console.log(`================================================================\n`);
});
