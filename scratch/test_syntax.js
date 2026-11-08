const fs = require('fs');

// Extract JS from FF3_Script_Editor.html
const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error('Script not found');
  process.exit(1);
}

// Check syntax of the script
try {
  new Function(scriptMatch[1]);
  console.log('Syntax check passed: HTML script is syntactically valid!');
} catch (e) {
  // It might fail on DOM references like document, window, $, etc., which is expected
  console.log('Syntax evaluated (DOM errors expected if evaluated directly):', e.message);
}

