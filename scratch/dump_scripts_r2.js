const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Let's dump Stage 5, 6, 7 scripts
// From dump_stage_ptrs:
// Stage 5 script is ptrs[4] = C3:B948 (file 0x03B948 + h)
// Stage 6 script is ptrs[4] = C3:BA84 (file 0x03BA84 + h)
// Stage 7 script is ptrs[4] = C3:BB56 (file 0x03BB56 + h)

function dumpScript(name, snesAddr) {
  const off = snesAddr - 0xC00000 + h;
  console.log(`\n=== Script ${name} at SNES ${snesAddr.toString(16).toUpperCase()} ===`);
  const bytes = [];
  for (let i = 0; i < 80; i++) {
    bytes.push(hex(rom[off + i]));
  }
  console.log(bytes.join(' '));
}

dumpScript('Stage 4 (Main Street)', 0xC3B874);
dumpScript('Stage 5 (Back Street)', 0xC3B948);
dumpScript('Stage 6 (Back Alley)', 0xC3BA84);
dumpScript('Stage 7 (Club Capcom)', 0xC3BB56);

