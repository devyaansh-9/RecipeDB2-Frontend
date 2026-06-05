const fs = require('fs');

const doc = fs.readFileSync('extracted_doc.txt', 'utf8');

const jsonStartIndex = doc.indexOf('{');
if (jsonStartIndex !== -1) {
  const jsonStr = doc.substring(jsonStartIndex);
  console.log("=== TOP 3000 CHARACTERS OF JSON ===");
  console.log(jsonStr.substring(0, 3000));
} else {
  console.log("No JSON structure found");
}
