const fs = require('fs');

const doc = fs.readFileSync('extracted_doc.txt', 'utf8');

const searchStr = 'recipe';
let idx = 0;
let count = 0;
while ((idx = doc.indexOf(searchStr, idx)) !== -1 && count < 10) {
  console.log(`=== MATCH AT INDEX ${idx} ===`);
  const start = Math.max(0, idx - 100);
  const end = Math.min(doc.length, idx + searchStr.length + 300);
  console.log(doc.substring(start, end));
  idx += searchStr.length;
  count++;
}
