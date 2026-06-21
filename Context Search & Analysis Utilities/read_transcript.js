const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Dev\\.gemini\\antigravity\\brain\\a41e0917-6820-4f3e-8974-680c803219f7\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('RecipeDB API Endpoint Playground')) {
    try {
      const obj = JSON.parse(line);
      const content = obj.content || '';
      console.log("=== FOUND DOC ===");
      console.log(content.substring(0, 5000));
      console.log("=== END OF DOC (TRUNCATED IN PRINT) ===");
      fs.writeFileSync('extracted_doc.txt', content, 'utf8');
      process.exit(0);
    } catch (e) {
      console.error(e);
    }
  }
});
