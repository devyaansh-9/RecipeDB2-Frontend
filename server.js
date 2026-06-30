const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8085;
const TARGET_HOST = '192.168.1.92';
const TARGET_PORT = 3030;
const TARGET_PROTOCOL = 'http';

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
  const req = https.request(options, (res) => {
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

// Load API keys from local .env file (never committed to GitHub)
let GROQ_API_KEY = '';
let STABILITY_KEY = '';
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const groqMatch = envContent.match(/GROQ_API_KEY=(.+)/);
  if (groqMatch) GROQ_API_KEY = groqMatch[1].trim();
  const stabilityMatch = envContent.match(/STABILITY_KEY=(.+)/);
  if (stabilityMatch) STABILITY_KEY = stabilityMatch[1].trim();
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
        if (res.statusCode !== 200) {
          throw new Error(`Groq API returned status ${res.statusCode}: ${data}`);
        }
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


function generateImage(prompt, callback) {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const bodyParts = [
    `--${boundary}\r\n`,
    `Content-Disposition: form-data; name="prompt"\r\n\r\n`,
    `${prompt}\r\n`,
    `--${boundary}\r\n`,
    `Content-Disposition: form-data; name="output_format"\r\n\r\n`,
    `webp\r\n`,
    `--${boundary}--\r\n`
  ];
  const bodyBuffer = Buffer.concat(bodyParts.map(part => Buffer.from(part)));

  const options = {
    hostname: 'api.stability.ai',
    path: '/v2beta/stable-image/generate/core',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STABILITY_KEY}`,
      'Accept': 'image/*',
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': bodyBuffer.length
    }
  };

  const req = https.request(options, (res) => {
    if (res.statusCode === 200) {
      let chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        callback(null, Buffer.concat(chunks));
      });
    } else {
      let errBody = '';
      res.on('data', chunk => errBody += chunk);
      res.on('end', () => {
        callback(new Error(`Stability AI returned ${res.statusCode}: ${errBody}`));
      });
    }
  });

  req.on('error', err => callback(err));
  req.write(bodyBuffer);
  req.end();
}

const server = http.createServer((req, res) => {
  // 0. Secure Groq API proxy endpoint
  
  // ─── BROWSER ERROR LOGGER ENDPOINT ───
  if (req.url === '/api/log-error' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('\n================== BROWSER ERROR LOGGED ==================');
      try {
        const parsed = JSON.parse(body);
        console.log(parsed.error || parsed.message || body);
        if (parsed.stack) {
          console.log('Stack Trace:');
          console.log(parsed.stack);
        }
      } catch (e) {
        console.log(body);
      }
      console.log('==========================================================\n');
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  // ─── STABILITY AI IMAGE GENERATION PROXY ENDPOINT ───
  const [pathname, queryString] = req.url.split('?');
  if (pathname === '/api/generate-image') {
    const params = new URLSearchParams(queryString || '');
    const recipeName = params.get('recipeName') || 'Delicious Dish';
    const region = params.get('region') || 'International';
    const prompt = `Stunning professional food photography of ${recipeName}, ${region} cuisine, beautifully plated on a rustic table, warm lighting, restaurant quality, appetizing colors`;

    console.log(`[Stability Proxy] Generating image for: "${recipeName}" (${region})...`);
    generateImage(prompt, (err, imageBuffer) => {
      if (err) {
        console.error('[Stability Proxy] Image generation failed:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: err.message }));
      } else {
        console.log('[Stability Proxy] Image generated successfully.');
        res.writeHead(200, { 
          'Content-Type': 'image/webp',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(imageBuffer);
      }
    });
    return;
  }

  if (req.url === '/api/culinary-news') {
    console.log('[Groq Proxy] Fetching news from Groq...');
    fetchGroqNews((err, articles) => {
      if (err) {
        console.error('[Groq Proxy] Error fetching news, falling back to mock news:', err.message);
        const mockNews = [
          { "title": "Culinary AI Revolution", "summary": "Chefs across the globe are embracing AI tools to invent unexpected flavor pairings.", "date": "Today" },
          { "title": "Sweet & Salty Sweeps the Nation", "summary": "A new wave of desserts combining intense sea salt and dark caramel is trending.", "date": "2 hours ago" },
          { "title": "Historical Roman Recipe Reconstructed", "summary": "Archaeologists and chefs team up to recreate an authentic 2,000-year-old feast.", "date": "Yesterday" },
          { "title": "Vegan Cheese Breakthrough", "summary": "A new fermentation process is producing dairy-free cheese that melts and stretches.", "date": "Today" },
          { "title": "The Ghost Pepper Comeback", "summary": "Ultra-spicy ingredients are finding their way into mainstream fast food menus.", "date": "5 hours ago" },
          { "title": "Lab-Grown Seafood Hits Menus", "summary": "Sustainable cell-cultured salmon is now being served in select upscale restaurants.", "date": "Yesterday" },
          { "title": "Mushroom Coffee Boom", "summary": "The morning brew is getting a fungal upgrade as health-conscious consumers seek alternatives.", "date": "Today" },
          { "title": "Robots in the Kitchen", "summary": "Automated sous-chefs are taking over repetitive chopping tasks in commercial kitchens.", "date": "3 hours ago" },
          { "title": "Zero-Waste Cooking Trend", "summary": "Top restaurants are pledging to completely eliminate food waste by repurposing scraps.", "date": "Yesterday" },
          { "title": "Global Vanilla Shortage", "summary": "Bakers brace for impact as the price of authentic Madagascar vanilla soars.", "date": "Today" }
        ];
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(mockNews));
      } else {
        console.log('[Groq Proxy] Successfully fetched and returned Groq news.');
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
    console.log(`[Proxy] Intercepted request for: ${req.url}`);
    const options = {
      hostname: TARGET_HOST,
      port: TARGET_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: TARGET_HOST
      }
    };

    const client = TARGET_PROTOCOL === 'https' ? https : http;
    const proxyReq = client.request(options, (proxyRes) => {
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
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'landing.html' : req.url.split('?')[0]);
  
  // Handle directory requests
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'landing.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA Routing fallback
        fs.readFile(path.join(__dirname, 'dist', 'landing.html'), (err2, content2) => {
          if (err2) {
            res.writeHead(500);
            res.end('Error loading landing.html');
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
