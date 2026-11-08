const fs = require('fs');
const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const idx = html.indexOf('.btn-bg-preset');
console.log(html.slice(idx, idx + 1200));

