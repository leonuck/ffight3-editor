const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Let's disassemble C0:18BF to C0:1945
const opcodes = {
  0xAD: ['LDA', 2], 0x3A: ['DEC', 0], 0xC2: ['REP #', 1], 0x29: ['AND #', 2],
  0x0A: ['ASL', 0], 0x18: ['CLC', 0], 0x69: ['ADC #', 2], 0x8D: ['STA', 2],
  0xAA: ['TAX', 0], 0xE2: ['SEP #', 1], 0xBF: ['LDA long,X', 3], 0x0D: ['ORA', 2],
  0xD0: ['BNE', 1], 0xA9: ['LDA #', 1], 0x60: ['RTS', 0], 0x20: ['JSR', 2],
  0x22: ['JSL', 3], 0xAE: ['LDX', 2], 0xAF: ['LDA long', 3]
};

let pc = 0x0018BF;
while (pc < 0x001955) {
  const b = rom[pc+h];
  const snes = (0xC00000 + pc).toString(16).toUpperCase();
  const info = opcodes[b];
  if (!info) {
    console.log(`${snes}: ${hex(b)} (unknown)`);
    pc++;
  } else {
    let args = [];
    for (let k = 1; k <= info[1]; k++) {
      args.push(hex(rom[pc+k+h]));
    }
    console.log(`${snes}: ${info[0]} ${args.reverse().join('')}`);
    pc += 1 + info[1];
  }
}

