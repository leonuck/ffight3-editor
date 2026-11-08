const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// Disassemble C0:0115 to C0:0195
const opcodes = {
  0xAD: ['LDA', 2], 0x8D: ['STA', 2], 0x9C: ['STZ', 2], 0xC9: ['CMP #', 1],
  0xD0: ['BNE', 1], 0xF0: ['BEQ', 1], 0x10: ['BPL', 1], 0x30: ['BMI', 1],
  0x80: ['BRA', 1], 0x4C: ['JMP', 2], 0x22: ['JSL', 3], 0x20: ['JSR', 2],
  0xA9: ['LDA #', 1], 0x89: ['BIT #', 1], 0x60: ['RTS', 0], 0x6B: ['RTL', 0],
  0xC2: ['REP #', 1], 0xE2: ['SEP #', 1], 0xA2: ['LDX #', 2], 0xEE: ['INC', 2]
};

let pc = 0x000115;
while (pc < 0x000185) {
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

