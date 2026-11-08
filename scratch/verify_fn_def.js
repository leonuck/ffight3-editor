const fs = require('fs');
const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

const lines = html.split('\n');
let foundDef = false;
let foundCall = false;
lines.forEach((l, i) => {
  if (l.includes('function createCustomSecretStage()')) {
    foundDef = i + 1;
  }
  if (l.includes('createCustomSecretStage();')) {
    foundCall = i + 1;
  }
});

console.log('Definition found at line:', foundDef);
console.log('Call found at line:', foundCall);
if (foundDef && foundCall) {
  console.log('SUCCESS: createCustomSecretStage is properly defined and called!');
} else {
  console.error('ERROR: Missing definition or call');
}

