const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function dump(name, snesAddr, len = 64) {
  const bank = (snesAddr >> 16) & 0xFF;
  const off = snesAddr & 0xFFFF;
  // In LoROM/HiROM: bank C3:xxxx -> file offset 0x30000 + xxxx (or 0x30000 + off)
  // Let's verify file offset:
  const fileOff = (bank === 0xC3 ? 0x30000 + off : (bank - 0xC0) * 0x10000 + off) + h;
  console.log(`=== ${name} at SNES ${snesAddr.toString(16).toUpperCase()} (File 0x${(fileOff-h).toString(16)}) ===`);
  const slice = rom.slice(fileOff, fileOff + len);
  console.log('Hex: ' + slice.toString('hex').match(/../g).join(' '));
  return slice;
}

dump('[0] C34593', 0xC34593, 75);
dump('[1] C353FE', 0xC353FE, 64);
dump('[2] C3A314', 0xC3A314, 64);
dump('[3] C395C0', 0xC395C0, 64);

