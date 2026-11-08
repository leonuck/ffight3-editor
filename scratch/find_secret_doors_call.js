const fs = require('fs');
const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const lines = html.split('\n');
lines.forEach((line, i) => {
  if (line.includes('secretDoors') || line.includes('buildRom(')) {
    console.log((i+1) + ': ' + line.trim());
  }
});

