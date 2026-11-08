const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

// 1. Check where STAGE_NAMES is defined and add 44
console.log('STAGE_NAMES defined in html:', html.includes('const STAGE_NAMES = ['));

// 2. Check buildRom in html
console.log('buildRom defined in html:', html.includes('function buildRom(orig,st,opts){'));

// 3. Check sidebar stage list
console.log('sidebar defined in html:', html.includes('id="stlist"'));

