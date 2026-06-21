const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Dev\\.gemini\\antigravity\\brain\\a41e0917-6820-4f3e-8974-680c803219f7\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('GET Method') && line.includes('recipes_cuisine')) {
    // This line likely contains the full json doc!
    console.log("Found line of length:", line.length);
    // Find where the JSON starts
    const index = line.indexOf('{"info":');
    if (index !== -1) {
      const jsonStr = line.substring(index);
      // Let's write this to a file so we can inspect it!
      fs.writeFileSync('untruncated_doc.json', jsonStr);
      console.log("Wrote untruncated doc to untruncated_doc.json");
      process.exit(0);
    }
  }
});
