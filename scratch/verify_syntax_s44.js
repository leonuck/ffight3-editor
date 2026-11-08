const fs = require('fs');

const html = fs.readFileSync('scratch/updated_with_stage44.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error('No script found');
  process.exit(1);
}

try {
  new Function(scriptMatch[1]);
  console.log('SUCCESS: Script with Stage 44 is 100% syntactically valid!');
} catch (e) {
  console.error('Syntax error:', e.message);
  process.exit(1);
}

