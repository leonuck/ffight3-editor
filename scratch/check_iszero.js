const fs = require('fs');
const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const idx = html.indexOf('function isZero');
console.log(html.slice(idx, idx + 400));

