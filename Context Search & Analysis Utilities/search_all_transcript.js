const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Dev\\.gemini\\antigravity\\brain\\a41e0917-6820-4f3e-8974-680c803219f7\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

const paths = new Set();
const params = new Set();

rl.on('line', (line) => {
  const matches = line.match(/\/recipe2-api\/[a-zA-Z0-9_\-\/]+/g);
  if (matches) {
    matches.forEach(m => paths.add(m));
  }
  
  // also look for query parameters
  const paramMatches = line.match(/[?&]([a-zA-Z0-9_]+)=/g);
  if (paramMatches) {
    paramMatches.forEach(p => params.add(p.substring(1, p.length - 1)));
  }
});

rl.on('close', () => {
  console.log("=== UNIQUE PATHS ===");
  console.log(Array.from(paths));
  console.log("=== UNIQUE PARAM KEYS ===");
  console.log(Array.from(params));
});
