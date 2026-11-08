const fs = require('fs');
const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const lines = html.split('\n');
lines.forEach((line, i) => {
  if (line.includes('OPCODES') || line.includes('CMD_') || line.includes('parseItem') || line.includes('loadStages')) {
    console.log((i+1) + ': ' + line.trim().slice(0, 100));
  }
});

