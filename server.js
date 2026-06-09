const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const TARGET_HOST = '192.168.1.92';
const TARGET_PORT = 3030;

// ============================================================
//  SERVER-SIDE RECIPE OF THE DAY CACHE
//  Fetches once per day from the backend, serves the SAME
//  recipe to BOTH landing page and portal — guaranteed sync.
// ============================================================
let rotdCache = { date: null, recipe: null };

function getTodayStr() {
  return new Date().toISOString().slice(0, 10); // "2026-06-09"
}

function fetchRotdFromBackend(callback) {
  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: '/recipe2-api/recipe/recipeofday',
    method: 'GET'
  };
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        const recipe = parsed?.payload?.data || parsed?.data || null;
        if (recipe) {
          rotdCache = { date: getTodayStr(), recipe };
          console.log(`[ROTD Cache] Fetched & cached: "${recipe.Recipe_title}"`);
        }
        callback(null, recipe);
      } catch (e) {
        callback(e, null);
      }
    });
  });
  req.on('error', err => callback(err, null));
  req.end();
}

function getRotdCached(callback) {
  const today = getTodayStr();
  if (rotdCache.date === today && rotdCache.recipe) {
    console.log(`[ROTD Cache] Serving cached: "${rotdCache.recipe.Recipe_title}"`);
    callback(null, rotdCache.recipe);
  } else {
    fetchRotdFromBackend(callback);
  }
}

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

const https = require('https');

// Load GROQ_API_KEY from .env file (never committed to GitHub)
const envPath = path.join(__dirname, '.env');
let GROQ_API_KEY = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GROQ_API_KEY=(.+)/);
  if (match) GROQ_API_KEY = match[1].trim();
}

function fetchGroqNews(callback) {
  const prompt = "Generate 10 completely unique, fascinating, and realistic news articles related to global cooking trends, recipe discoveries, new restaurant trends, flavor science, or historical culinary facts. Return ONLY a pure JSON array containing 10 objects, each with 'title' (string), 'summary' (string, max 2 sentences), and 'date' (string like 'Today', '2 hours ago', or 'Yesterday'). No markdown formatting around the JSON, just the raw JSON array.";

  const body = JSON.stringify({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + GROQ_API_KEY,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        let content = parsed.choices[0].message.content.trim();
        if (content.startsWith('```json')) content = content.substring(7);
        if (content.startsWith('```')) content = content.substring(3);
        if (content.endsWith('```')) content = content.substring(0, content.length - 3);
        const articles = JSON.parse(content.trim());
        callback(null, articles);
      } catch (e) {
        callback(e);
      }
    });
  });

  req.on('error', callback);
  req.write(body);
  req.end();
}

const server = http.createServer((req, res) => {
  // 0. Secure Groq API proxy endpoint
  if (req.url === '/api/culinary-news') {
    fetchGroqNews((err, articles) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: err.message }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(articles));
      }
    });
    return;
  }

  // ── RECIPE OF THE DAY — server-cached so both pages get same recipe ──
  if (req.url === '/api/recipe-of-day') {
    getRotdCached((err, recipe) => {
      if (err || !recipe) {
        res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: 'Failed to fetch recipe of the day' }));
      } else {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store'
        });
        res.end(JSON.stringify({ payload: { data: recipe } }));
      }
    });
    return;
  }

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
