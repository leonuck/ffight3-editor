const fs = require('fs');
const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  const css = styleMatch[1];
  console.log('CSS length:', css.length);
  // find arena styles
  const lines = css.split('\n').filter(l => l.includes('arena') || l.includes('token') || l.includes('door'));
  console.log('Door/arena CSS lines:');
  console.log(lines.slice(0, 30).join('\n'));
}

