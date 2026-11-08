const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const romCopy = new Uint8Array(rom);

// 1. Template: Stage 7 (Bar Creep Eats)
// Stage 7 pointer entry:
// [ 0xc34593, 0xc353fe, 0xc3a314, 0xc395c0, 0xc3bb56 ]
const templateStage = 7;
const TABLE = 0x34000;
// Read template pointers
let a = TABLE;
const rows = [];
while (a < TABLE + 0x300) {
  const ptrs = [];
  while (romCopy[a+2] >= 0xC0 && romCopy[a+2] < 0xF0) {
    ptrs.push(romCopy[a] | (romCopy[a+1] << 8) | (romCopy[a+2] << 16));
    a += 3;
  }
  if (!ptrs.length) break;
  rows.push(ptrs);
  if (romCopy[a] === 0) a++;
}

console.log('Template stage 7 pointers:', rows[6].map(x => '0x' + x.toString(16)));

// New script for Stage 44: let's put it in free run 0xE55A8
const scriptAddr = 0xE55A8;
const snesScriptAddr = 0xC00000 + scriptAddr;

// Write Stage 44 entry at 0x342B3
const s44Off = 0x342B3;
// 4 visual pointers from template:
for (let p = 0; p < 4; p++) {
  const v = rows[6][p];
  romCopy[s44Off + p*3] = v & 0xFF;
  romCopy[s44Off + p*3 + 1] = (v >> 8) & 0xFF;
  romCopy[s44Off + p*3 + 2] = (v >> 16) & 0xFF;
}
// 5th pointer: our new script
romCopy[s44Off + 12] = snesScriptAddr & 0xFF;
romCopy[s44Off + 13] = (snesScriptAddr >> 8) & 0xFF;
romCopy[s44Off + 14] = (snesScriptAddr >> 16) & 0xFF;
romCopy[s44Off + 15] = 0x00; // terminator

// Verify reading the table with Stage 44 added:
let testA = TABLE;
const testRows = [];
while (testA < TABLE + 0x300) {
  const ptrs = [];
  while (romCopy[testA+2] >= 0xC0 && romCopy[testA+2] < 0xF0) {
    ptrs.push(romCopy[testA] | (romCopy[testA+1] << 8) | (romCopy[testA+2] << 16));
    testA += 3;
  }
  if (!ptrs.length) break;
  testRows.push(ptrs);
  if (romCopy[testA] === 0) testA++;
}

console.log('Total stages recognized after adding Stage 44:', testRows.length);
console.log('Stage 44 pointers:', testRows[43].map(x => '0x' + x.toString(16)));

// Metadata entry at C0:0D35:
// Copy 12 bytes from template (Stage 7, index 6) to Stage 44 (index 43)
const metaBase = 0x0D35;
const tplMetaOff = metaBase + 6 * 12;
const s44MetaOff = metaBase + 43 * 12;
for (let i = 0; i < 12; i++) {
  romCopy[s44MetaOff + i] = romCopy[tplMetaOff + i];
}
console.log('Stage 44 metadata written successfully at C0:' + s44MetaOff.toString(16));

