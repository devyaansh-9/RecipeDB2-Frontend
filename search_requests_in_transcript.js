const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Dev\\.gemini\\antigravity\\brain\\a41e0917-6820-4f3e-8974-680c803219f7\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('recipesinfo') && (line.includes('Region') || line.includes('region') || line.includes('cuisine') || line.includes('country'))) {
    // Let's print the line or part of it
    console.log("=== MATCH ===");
    console.log(line.substring(0, 1000));
  }
});
