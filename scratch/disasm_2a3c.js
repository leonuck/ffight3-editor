const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

const opcodes = {
  0x20: ['JSR', 2], 0x22: ['JSL', 3], 0x4C: ['JMP', 2], 0x5C: ['JML', 3],
  0x60: ['RTS', 0], 0x6B: ['RTL', 0], 0xAD: ['LDA', 2], 0xBD: ['LDA x', 2],
  0xA9: ['LDA #', 1], 0x8D: ['STA', 2], 0x9D: ['STA x', 2], 0x9C: ['STZ', 2],
  0xA2: ['LDX #', 2], 0xAE: ['LDX', 2], 0xA0: ['LDY #', 2], 0xAC: ['LDY', 2],
  0xC9: ['CMP #', 1], 0xCD: ['CMP', 2], 0xD0: ['BNE', 1], 0xF0: ['BEQ', 1],
  0x90: ['BCC', 1], 0xB0: ['BCS', 1], 0x80: ['BRA', 1], 0x10: ['BPL', 1],
  0x30: ['BMI', 1], 0x89: ['BIT #', 1], 0xC2: ['REP #', 1], 0xE2: ['SEP #', 1],
  0xCA: ['DEX', 0], 0x88: ['DEY', 0], 0xE8: ['INX', 0], 0xC8: ['INY', 0],
  0x18: ['CLC', 0], 0x38: ['SEC', 0], 0x08: ['PHP', 0], 0x28: ['PLP', 0],
};

let pc = 0x002A30;
while (pc < 0x002AE0) {
  const b = rom[pc+h];
  const snes = (0xC00000 + pc).toString(16).toUpperCase();
  const info = opcodes[b];
  if (!info) {
    console.log(`${snes}: ${b.toString(16).padStart(2,'0')} (unknown)`);
    pc++;
  } else {
    let args = [];
    for (let k = 1; k <= info[1]; k++) {
      args.push(rom[pc+k+h].toString(16).padStart(2,'0').toUpperCase());
    }
    console.log(`${snes}: ${info[0]} ${args.reverse().join('')}`);
    pc += 1 + info[1];
  }
}

