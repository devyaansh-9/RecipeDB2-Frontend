const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Dev\\.gemini\\antigravity\\brain\\a41e0917-6820-4f3e-8974-680c803219f7\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.step_index < 700) {
      const str = JSON.stringify(obj);
      if (str.includes('/recipe2-api/') && str.includes('queryParams')) {
        console.log(`=== STEP ${obj.step_index} REQUEST ===`);
        console.log(str.substring(str.indexOf('queryParams') - 100, str.indexOf('queryParams') + 300));
      }
    }
  } catch (e) {}
});
