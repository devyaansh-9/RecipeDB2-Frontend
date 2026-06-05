const fs = require('fs');

const doc = fs.readFileSync('extracted_doc.txt', 'utf8');

// Find all segments of the form "name": "...", and look ahead to find "request": { "method": "...", "url": { "raw": "..."
// We can use a simple state machine or regex search for occurrences of /recipe2-api/
const regex = /"name":\s*"([^"]+)"[\s\S]*?"request":\s*\{[\s\S]*?"method":\s*"([^"]+)"[\s\S]*?"url":\s*\{[\s\S]*?"raw":\s*"([^"]+)"/g;

let match;
console.log("=== SCANNING FOR REQUESTS IN DOC ===");
while ((match = regex.exec(doc)) !== null) {
  console.log(`Name: ${match[1]}`);
  console.log(`Method: ${match[2]}`);
  console.log(`URL Raw: ${match[3]}`);
  console.log('------------------------------------');
}

// Let's also do a search for paths inside the text
const pathMatches = doc.match(/\/recipe2-api\/[a-zA-Z0-9_\-\/{\}]+/g) || [];
console.log("=== UNIQUE PATH PATTERNS IN DOC ===");
console.log([...new Set(pathMatches)]);
