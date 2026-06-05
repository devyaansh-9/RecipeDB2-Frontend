const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Dev\\.gemini\\antigravity\\brain\\a41e0917-6820-4f3e-8974-680c803219f7\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('58e52d15-9745-4b8b-8962-ef48ea3cd088')) {
    console.log("Found line with postman id. Length:", line.length);
    // Find where the JSON starts. Look for {"info" or similar.
    const startPattern = '{"info":';
    let idx = line.indexOf(startPattern);
    if (idx !== -1) {
      // Find the end of the JSON. It might be at the end of the string or before some transcript wrapper.
      // Let's write from idx to the end to a file.
      fs.writeFileSync('postman_extracted.json', line.substring(idx));
      console.log("Saved to postman_extracted.json");
    }
  }
});
