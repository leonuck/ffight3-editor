const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

const TABLE = 0x34000;
// Find Stage 7 pointers
let a = TABLE;
const rows = [];
while (a < TABLE + 0x300) {
  const ptrs = [];
  while (rom[a+2] >= 0xC0 && rom[a+2] < 0xF0) {
    ptrs.push(rom[a] | (rom[a+1] << 8) | (rom[a+2] << 16));
    a += 3;
  }
  if (!ptrs.length) break;
  rows.push(ptrs);
  if (rom[a] === 0) a++;
}

const s7Script = rows[6][4] - 0xC00000;
console.log('Stage 7 script starts at 0x' + s7Script.toString(16));

let pos = s7Script;
let idx = 0;
while (pos < s7Script + 300) {
  if (rom[pos] !== 0xFF) {
    const bytes = Array.from(rom.slice(pos, pos + 17));
    console.log(`Enemy ${idx+1}:`, bytes.map(x => x.toString(16).padStart(2, '0')).join(' '));
    // Print fields according to rec helper
    // b[0]: gate, b[1]: mode, b[2..3]: trig, b[4]: type, b[5]: unk/vram, b[6]: item, b[7]: hp, b[8]: mov, b[9..10]: x, b[11..12]: y, b[13..14]: z, b[15..16]: ?
    console.log(`   Gate=${bytes[0]}, Mode=0x${bytes[1].toString(16)}, Trig=${bytes[2]|(bytes[3]<<8)}, Type=0x${bytes[4].toString(16)}, VramSz=0x${bytes[5].toString(16)}, Item=${bytes[6]}, HP=${bytes[7]}, Mov=0x${bytes[8].toString(16)}, X=${bytes[9]|(bytes[10]<<8)}, Y=${bytes[11]|(bytes[12]<<8)}`);
    idx++;
    pos += 17;
  } else {
    const b1 = rom[pos+1];
    const len = (b1 === 0xFE || b1 === 0xFC) ? 7 : (b1 === 0xFD ? 3 : 2);
    console.log(`Cmd:`, Array.from(rom.slice(pos, pos + len)).map(x => x.toString(16).padStart(2, '0')).join(' '));
    pos += len;
    if (b1 === 0xFF) break;
  }
}

