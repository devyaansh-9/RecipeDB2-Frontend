const fs = require('fs');
const replaceInFile = (path) => {
  let c = fs.readFileSync(path, 'utf8');
  c = c.replace(/118,171/g, '118,083')
       .replace(/118171/g, '118083')
       .replace(/35,474/g, '19,019')
       .replace(/35474/g, '19019')
       .replace(/99 countries/gi, '75 countries')
       .replace(/99 Countries/g, '75 Countries')
       .replace(/data-target="99"/g, 'data-target="75"')
       .replace(/32 regions/gi, '26 regions')
       .replace(/32 Regions/g, '26 Regions')
       .replace(/32 distinct geo-cultural regions/gi, '26 distinct geo-cultural regions');
  fs.writeFileSync(path, c);
};
replaceInFile('dist/landing.html');
replaceInFile('dist/index.html');
console.log('Replaced stats in both files');
