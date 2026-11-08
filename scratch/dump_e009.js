const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
function h(offset) {
  // HiROM to file offset: Bank C0 -> offset in file is offset & 0x3FFFFF (if LoROM or HiROM)
  // Let's check header
  const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;
  return offset + header;
}

// In HiROM: C0:E009 -> 0x00E009
const start = h(0x00E009);
console.log('Bytes at C0:E009:', Array.from(rom.slice(start, start + 64)).map(b => b.toString(16).padStart(2, '0')).join(' '));

