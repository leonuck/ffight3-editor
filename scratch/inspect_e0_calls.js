const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;

function dump(offset, len) {
  const fileOff = offset + header;
  return Array.from(rom.slice(fileOff, fileOff + len)).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

// In SNES: E000 is bank C0:E000
// At C0:E000 we saw jump table:
// 0x00: JMP $E09F
// 0x03: JMP $E0AF
// 0x06: JMP $E0C9
// Let's inspect $E09F, $E0AF, $E0C9, $E051, $E039
const targets = [0xE09F, 0xE0AF, 0xE0C9, 0xE051, 0xE039, 0xE027, 0xE05A, 0xE033, 0xE036, 0xE06F];
targets.forEach(addr => {
  console.log(`Subroutine at C0:${addr.toString(16)}: ${dump(addr, 24)}`);
});

