const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

const TABLE = 0x34000;
const p = (rom[TABLE] | (rom[TABLE+1] << 8) | (rom[TABLE+2] << 16)) - 0xC00000;
// wait, the last pointer of stage 1 row is the script pointer:
// let's read the 6 pointers of Stage 1:
const ptrs = [];
for (let i = 0; i < 6; i++) {
  const off = TABLE + i * 3;
  ptrs.push(rom[off] | (rom[off+1] << 8) | (rom[off+2] << 16));
}
console.log('Stage 1 pointers:', ptrs.map(x => '0x' + x.toString(16)));
const scriptStart = ptrs[5] - 0xC00000;
console.log('Script starts at 0x' + scriptStart.toString(16));

let a = scriptStart;
const items = [];
while (a < scriptStart + 1000) {
  if (rom[a] !== 0xFF) {
    // 17-byte enemy record
    const b = Array.from(rom.slice(a, a + 17));
    // gate, mode, trig, unk, type, pal, item, hp, mov, x, y, z
    const gate = b[0];
    const mode = b[1];
    const trig = b[2] | (b[3] << 8);
    const type = b[4];
    const item = b[6];
    const hp = b[7];
    const x = b[9] | (b[10] << 8);
    const y = b[11] | (b[12] << 8);
    items.push({ type: 'enemy', trig, actorType: type, x, y, hp, raw: b });
    a += 17;
  } else {
    const b1 = rom[a+1];
    if (b1 === 0xFF) {
      console.log('End of script at 0x' + a.toString(16));
      break;
    }
    const len = (b1 === 0xFE || b1 === 0xFC) ? 7 : (b1 === 0xFD ? 3 : 2);
    items.push({ type: 'cmd', b: Array.from(rom.slice(a, a + len)) });
    a += len;
  }
}

console.log(`Parsed ${items.length} items in Stage 1 script:`);
items.forEach((it, idx) => {
  if (it.type === 'enemy') {
    console.log(`Enemy ${idx+1}: type=${it.actorType}, trig=${it.trig} (px: ${it.trig/16}), X=${it.x} (px: ${it.x/16}), Y=${it.y} (px: ${it.y/16})`);
  } else {
    console.log(`Cmd ${idx+1}:`, it.b.map(x => x.toString(16).padStart(2, '0')).join(' '));
  }
});

