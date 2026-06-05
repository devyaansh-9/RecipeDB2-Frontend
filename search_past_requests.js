const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Dev\\.gemini\\antigravity\\brain\\a41e0917-6820-4f3e-8974-680c803219f7\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('/recipe2-api/') && (line.includes('recipeByTitle') || line.includes('recipe_title') || line.includes('carbs') || line.includes('category'))) {
    try {
      const obj = JSON.parse(line);
      console.log(`=== MATCH PAST (Step ${obj.step_index}) ===`);
      console.log(line.substring(0, 500));
    } catch(e) {
      console.log("Error parsing:", e.message);
    }
  }
});
