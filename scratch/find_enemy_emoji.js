const fs = require('fs');
const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('enemyEmoji') || l.includes('enemyColor')) {
    console.log((i+1) + ': ' + l);
  }
});

