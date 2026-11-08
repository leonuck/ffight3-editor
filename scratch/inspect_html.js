const fs = require('fs');
const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const lines = html.split('\n');
lines.forEach((line, i) => {
  if (line.includes('F340') || line.includes('buildStageExitHook') || line.includes('132A') || line.includes('0406') || line.includes('exitStage')) {
    console.log((i+1) + ': ' + line.trim());
  }
});

