const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;

// In SNES, stage init usually happens when loading a new stage ID ($1F03).
// Let's search where $1F03 is read in the whole ROM:
const reads = [];
for (let i = header; i < rom.length - 2; i++) {
  // LDA $1F03 (AD 03 1F), LDX $1F03 (AE 03 1F), LDY $1F03 (AC 03 1F)
  if ((rom[i] === 0xAD || rom[i] === 0xAE || rom[i] === 0xAC) && rom[i+1] === 0x03 && rom[i+2] === 0x1F) {
    const fileOff = i - header;
    const bank = (fileOff >> 16) | 0xC0;
    const addr = fileOff & 0xFFFF;
    reads.push({ fileOff, pc: `${bank.toString(16).toUpperCase()}:${addr.toString(16).padStart(4, '0')}`, op: rom[i].toString(16) });
  }
}
console.log(`Total reads of $1F03: ${reads.length}`);
reads.forEach(r => console.log(`  ${r.pc} (file 0x${r.fileOff.toString(16)}): op ${r.op}`));

