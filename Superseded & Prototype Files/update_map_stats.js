const fs = require('fs');

const path = 'dist/index.html';
let c = fs.readFileSync(path, 'utf8');

c = c.replace(/'US': \{ count: 14200,/g, "'US': { count: 5025,");
c = c.replace(/'Canadian': \{ count: 3100,/g, "'Canadian': { count: 6694,");
c = c.replace(/'Mexican': \{ count: 12900,/g, "'Mexican': { count: 14447,");
c = c.replace(/'Argentine': \{ count: 2500,/g, "'Argentine': { count: 6049,");
c = c.replace(/'Rest Caribbean': \{ count: 4800,/g, "'Rest Caribbean': { count: 2201,");
c = c.replace(/'French': \{ count: 15300,/g, "'French': { count: 6375,");
c = c.replace(/'Italian': \{ count: 22700,/g, "'Italian': { count: 16574,");
c = c.replace(/'Greek': \{ count: 5200,/g, "'Greek': { count: 4181,");
c = c.replace(/'Russian': \{ count: 4100,/g, "'Russian': { count: 856,");
c = c.replace(/'Egyptian': \{ count: 3800,/g, "'Egyptian': { count: 325,");
c = c.replace(/'Indian': \{ count: 24500,/g, "'Indian': { count: 5987,");
c = c.replace(/'Bangladeshi': \{ count: 2100,/g, "'Bangladeshi': { count: 16,");
c = c.replace(/'Thai': \{ count: 6300,/g, "'Thai': { count: 2603,");
c = c.replace(/'Japanese': \{ count: 8900,/g, "'Japanese': { count: 2040,");
c = c.replace(/'Korean': \{ count: 7800,/g, "'Korean': { count: 668,");

fs.writeFileSync(path, c);
console.log('Replaced map stats in index.html');
