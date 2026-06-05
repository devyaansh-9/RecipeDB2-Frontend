const fs = require('fs');

const doc = fs.readFileSync('extracted_doc.txt', 'utf8');

// Find all matches for paths that look like endpoints, e.g. /recipe/... or /recipe2-api/...
const pathRegex = /\/(recipe2-api|recipe-nutri)[a-zA-Z0-9_\-\/]+/g;
const matches = doc.match(pathRegex) || [];
const uniquePaths = [...new Set(matches)];

console.log("=== UNIQUE PATHS FOUND IN TRANSCRIPT ===");
uniquePaths.forEach(p => console.log(p));
