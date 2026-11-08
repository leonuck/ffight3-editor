const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

// 1. Verify GFX script bytes:
function buildBarGfxLoaderScript(bc, palSnesAddr) {
  const bytes = [];
  // 1. Descompacta CHR tiles (4bpp) -> WRAM 7F:0000
  bytes.push(0x4D, 0xE0, 0x6E, 0xC5, 0x00, 0x00, 0x7F);
  // 2. DMA CHR para VRAM 0x0000 (tamanho 0x8000)
  bytes.push(0x44, 0x00, 0x00, 0x7F, 0x00, 0x00, 0x00, 0x80);
  // 3. Descompacta Tilemaps do Bar -> WRAM 7E:8000
  bytes.push(0x4D, 0x80, 0x8A, 0xCA, 0x00, 0x80, 0x7E);
  // 4. DMA BG2 para VRAM 0x4000 (tamanho 0x1000)
  bytes.push(0x44, 0x00, 0xA0, 0x7E, 0x00, 0x40, 0x00, 0x10);
  // 5. DMA BG1 para VRAM 0x4800 (tamanho 0x1000)
  bytes.push(0x44, 0x00, 0x80, 0x7E, 0x00, 0x48, 0x00, 0x10);
  // 6. Descompacta Metatiles -> WRAM 7E:2000
  bytes.push(0x4D, 0xE0, 0xCA, 0xCB, 0x00, 0x20, 0x7E);

  // 7. DMA Paleta CGRAM 0x00C0 (32 bytes) com flags 0x0018
  const p0 = palSnesAddr & 0xFF;
  const p1 = (palSnesAddr >> 8) & 0xFF;
  const p2 = (palSnesAddr >> 16) & 0xFF;
  bytes.push(0x43, p0, p1, p2, 0xC0, 0x00, 0x20, 0x00, 0x18, 0x00);

  // 8. Terminador
  bytes.push(0x45);
  return new Uint8Array(bytes);
}

const script = buildBarGfxLoaderScript({}, 0xC36482);
console.log('Script length:', script.length, 'bytes');
console.log('Script hex:', Buffer.from(script).toString('hex').match(/../g).join(' '));

// Verify it ends with 43 82 64 C3 C0 00 20 00 18 00 45
const expectedEnd = '43 82 64 c3 c0 00 20 00 18 00 45';
const actualEnd = Buffer.from(script.slice(script.length - 11)).toString('hex').match(/../g).join(' ');
console.log('End match:', actualEnd === expectedEnd ? 'PASSED! ✓' : 'FAILED!');
if (actualEnd !== expectedEnd) throw new Error('Script end mismatch');

