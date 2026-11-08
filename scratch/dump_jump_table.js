const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const header = (rom.length & 0x3FF) === 0x200 ? 0x200 : 0;

console.log('Jump table at C0:E009:');
for(let i=0; i<43; i++){
  const ptr = 0x00E009 + header + (i * 3);
  const op = rom[ptr];
  const addr = rom[ptr+1] | (rom[ptr+2] << 8);
  if(op === 0x4C){
    // Read code at target
    const targetFile = addr + header;
    const bytes = Array.from(rom.slice(targetFile, targetFile + 16)).map(b => b.toString(16).padStart(2, '0')).join(' ');
    console.log(`Stage ${i+1} (idx ${i}): JMP $${addr.toString(16)} -> ${bytes}`);
  }
}

