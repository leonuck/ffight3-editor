const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;

function dump(fileOff, len) {
  return Array.from(rom.slice(fileOff + header, fileOff + header + len)).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

const targets = [
  { name: 'C0:010e', off: 0x100, len: 48 },
  { name: 'C0:0ac7', off: 0xac0, len: 48 },
  { name: 'C0:18bf', off: 0x18b0, len: 48 },
  { name: 'C0:29af', off: 0x29a0, len: 48 },
  { name: 'CC:d00a', off: 0xcd000, len: 48 },
  { name: 'CD:9650', off: 0xd9640, len: 48 }
];

targets.forEach(t => {
  console.log(`\n=== ${t.name} (file 0x${t.off.toString(16)}) ===`);
  console.log(dump(t.off, t.len));
});

