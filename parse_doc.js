const fs = require('fs');

const doc = fs.readFileSync('extracted_doc.txt', 'utf8');

// Find all occurrences of URL paths and request names
const lines = doc.split('\n');
console.log("=== ENDPOINTS FOUND IN POSTMAN COLLECTION ===");

const jsonStartIndex = doc.indexOf('{', doc.indexOf('yes pls implement it'));
if (jsonStartIndex !== -1) {
  try {
    const data = JSON.parse(doc.substring(jsonStartIndex));
    
    // Recursive function to search for requests
    function traverse(item) {
      if (item.request) {
        const req = item.request;
        const name = item.name;
        const method = req.method;
        const urlObj = req.url;
        const path = urlObj ? (Array.isArray(urlObj.path) ? urlObj.path.join('/') : urlObj.path) : '';
        const query = urlObj && urlObj.query ? urlObj.query.map(q => `${q.key}=${q.value || ''} (${q.description || ''})`).join(', ') : 'None';
        
        console.log(`- NAME: ${name}`);
        console.log(`  METHOD: ${method}`);
        console.log(`  PATH: /${path}`);
        console.log(`  QUERY PARAMS: ${query}`);
        console.log('------------------------------------');
      }
      if (item.item) {
        item.item.forEach(traverse);
      }
    }
    
    if (data.item) {
      data.item.forEach(traverse);
    }
  } catch (e) {
    console.error("Failed to parse JSON:", e.message);
  }
}
