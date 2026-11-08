const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function parseLoader(stageNum, ptr) {
  const fileOff = (ptr & 0xFFFF) + 0x30000 + h;
  console.log(`\n=== Stage ${stageNum} GFX Loader at SNES ${ptr.toString(16).toUpperCase()} (File 0x${(fileOff-h).toString(16)}) ===`);
  let i = fileOff;
  while (i < fileOff + 100) {
    const cmd = rom[i];
    if (cmd === 0xFF || cmd === 0x00) {
      console.log(`[0x${(i-h).toString(16)}] Terminate (${cmd.toString(16)})`);
      break;
    }
    if (cmd === 0x4D) { // Decompress
      const src = rom[i+1] | (rom[i+2]<<8) | (rom[i+3]<<16);
      const dst = rom[i+4] | (rom[i+5]<<8) | (rom[i+6]<<16);
      console.log(`[0x${(i-h).toString(16)}] CMD 4D: Decompress SNES ${src.toString(16).toUpperCase()} -> WRAM ${dst.toString(16).toUpperCase()}`);
      i += 7;
    } else if (cmd === 0x44) { // DMA copy to VRAM
      const src = rom[i+1] | (rom[i+2]<<8) | (rom[i+3]<<16);
      const vramDst = rom[i+4] | (rom[i+5]<<8);
      const len = rom[i+6] | (rom[i+7]<<8);
      console.log(`[0x${(i-h).toString(16)}] CMD 44: DMA WRAM ${src.toString(16).toUpperCase()} -> VRAM 0x${vramDst.toString(16).padStart(4,'0')} (len: 0x${len.toString(16)})`);
      i += 8;
    } else if (cmd === 0x43) { // Palette DMA or CGRAM?
      const src = rom[i+1] | (rom[i+2]<<8) | (rom[i+3]<<16);
      const cgramDst = rom[i+4] | (rom[i+5]<<8);
      const len = rom[i+6] | (rom[i+7]<<8);
      console.log(`[0x${(i-h).toString(16)}] CMD 43: DMA Palette SNES ${src.toString(16).toUpperCase()} -> CGRAM 0x${cgramDst.toString(16).padStart(4,'0')} (len: 0x${len.toString(16)})`);
      i += 8;
    } else {
      console.log(`[0x${(i-h).toString(16)}] Unknown CMD: 0x${cmd.toString(16)} (bytes: ${rom.slice(i, i+6).toString('hex')})`);
      i += 1;
    }
  }
}

parseLoader(7, 0xC353FE);

