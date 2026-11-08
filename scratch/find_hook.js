const fs = require('fs');
const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const idx = html.indexOf('#rng_counter_x');
console.log(html.slice(idx - 100, idx + 800));

