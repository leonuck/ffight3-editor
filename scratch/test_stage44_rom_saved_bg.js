const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const jsCode = scriptMatch[1];
const mockRom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

const mockEl = () => ({
  checked: true,
  value: '7',
  style: {},
  dataset: {},
  classList: { add: () => {}, remove: () => {} },
  querySelector: () => mockEl(),
  querySelectorAll: () => [],
  appendChild: () => {},
  addEventListener: () => {},
  getContext: () => ({
    scale: () => {}, fillRect: () => {}, strokeRect: () => {}, drawImage: () => {},
    beginPath: () => {}, moveTo: () => {}, lineTo: () => {}, stroke: () => {},
    fill: () => {}, arc: () => {}, ellipse: () => {}, closePath: () => {},
    fillText: () => {}, save: () => {}, restore: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} })
  })
});

const sandbox = {
  console, setTimeout, clearTimeout, setInterval, clearInterval,
  alert: (msg) => console.log('[MOCK ALERT]:', msg),
  confirm: () => true, prompt: () => '7',
  window: { location: { reload: () => {} }, innerWidth: 1280, innerHeight: 800, addEventListener: () => {}, removeEventListener: () => {} },
  document: { getElementById: () => mockEl(), querySelector: () => mockEl(), querySelectorAll: () => [], createElement: () => mockEl(), body: mockEl() },
  Uint8Array, ArrayBuffer, Buffer, Math, parseInt, isNaN, Set, Date, mockRom
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;

vm.createContext(sandbox);
vm.runInContext(jsCode, sandbox);

// 1. Load stages from ROM
vm.runInContext("ROM = new Uint8Array(mockRom); ST = loadStages(ROM); CUR = 0;", sandbox);

// 2. Create Stage 44 with Template 7 (Club Capcom)
vm.runInContext("createCustomSecretStage(7, true, true);", sandbox);
const s44 = vm.runInContext("ST.stages.find(s => s.id === 44);", sandbox);
if (!s44) throw new Error('Stage 44 was not created');
console.log('✓ Stage 44 created! Template:', s44.templateStage);

// 3. Customize Stage 44: Arena mode, Blue VIP palette, Club Capcom Theme (0x07)
vm.runInContext(`
  const s = ST.stages.find(st => st.id === 44);
  s.bgCustom = {
    type: 'bar',
    layout: 'arena',
    paletteTheme: 'blue',
    bgm: 0x07
  };
`, sandbox);

// 4. Build ROM
vm.runInContext(`
  const opts = {
    slots4: true,
    allgates: true,
    p2vram: true,
    secretDoor: true,
    secretDoors: [
      { srcStage: 1, destStage: 44, exitStage: 3, minX: 680, maxX: 720, maxY: 180 }
    ]
  };
  buildResult = buildRom(ROM, ST, opts);
`, sandbox);

const buildResult = vm.runInContext("buildResult", sandbox);
console.log('\n--- ROM Build Log ---');
buildResult.log.forEach(l => console.log('  ' + l));

const builtRom = buildResult.rom;
const h = vm.runInContext("ST.h", sandbox);
const s44Off = 0x342B3 + h;

// 5. Verification
const p0 = builtRom[s44Off] | (builtRom[s44Off+1]<<8) | (builtRom[s44Off+2]<<16);
const p1 = builtRom[s44Off+3] | (builtRom[s44Off+4]<<8) | (builtRom[s44Off+5]<<16);
const p2 = builtRom[s44Off+6] | (builtRom[s44Off+7]<<8) | (builtRom[s44Off+8]<<16);

console.log('\n--- Stage 44 ROM Binary Verifications ---');
console.log(`Pointer 0 (Visual Metadata & BGM): C${(p0>>16).toString(16).toUpperCase()}:${(p0&0xFFFF).toString(16).toUpperCase().padStart(4,'0')}`);
console.log(`Pointer 1 (GFX Loader Script): C${(p1>>16).toString(16).toUpperCase()}:${(p1&0xFFFF).toString(16).toUpperCase().padStart(4,'0')}`);
console.log(`Pointer 2 (Objects): C${(p2>>16).toString(16).toUpperCase()}:${(p2&0xFFFF).toString(16).toUpperCase().padStart(4,'0')}`);

const p0FileOff = (p0 & 0x3FFFFF) + h;
const bgmByte = builtRom[p0FileOff];
console.log(`Pointer 0 Byte 0 (BGM byte): 0x${bgmByte.toString(16).toUpperCase().padStart(2,'0')}`);

if (p0 < 0xC00000) throw new Error('Pointer 0 must point to SNES bank');
if (p1 < 0xC00000) throw new Error('Pointer 1 must point to SNES bank');
if (p2 !== 0xC3A8B5) throw new Error(`Pointer 2 expected 0xC3A8B5 (Arena clean room), got: 0x${p2.toString(16)}`);
if (bgmByte !== 0x07) throw new Error(`BGM expected 0x07, got: 0x${bgmByte.toString(16)}`);

// Check GFX loader script content in ROM (must be 56 bytes ending in 18 00 45)
const scriptFileOff = (p1 & 0x3FFFFF) + h;
const scriptBytes = builtRom.slice(scriptFileOff, scriptFileOff + 56);
console.log('Script in ROM (56 bytes):', Buffer.from(scriptBytes).toString('hex').match(/../g).join(' '));

if (scriptBytes[0] !== 0x4D) throw new Error('Script must start with 0x4D');
if (scriptBytes[55] !== 0x45) throw new Error('Script must end with 0x45 at byte 55');
if (scriptBytes[53] !== 0x18 || scriptBytes[54] !== 0x00) {
  throw new Error('Script must have flags 0x0018 before 0x45');
}

// Check C0:0120 audio hook
const c120 = 0x000120 + h;
const hookCall = [builtRom[c120], builtRom[c120+1], builtRom[c120+2], builtRom[c120+3], builtRom[c120+4]];
console.log('C0:0120 opcode:', Buffer.from(hookCall).toString('hex').match(/../g).join(' '));
if (hookCall[0] !== 0x22 || hookCall[1] !== 0x80 || hookCall[2] !== 0xF3 || hookCall[3] !== 0xC0) {
  throw new Error('C0:0120 must call JSL $C0F380');
}

// Check hook content at C0:F380
const f380 = 0x00F380 + h;
const hookBytes = builtRom.slice(f380, f380 + 55);
console.log('Audio Manager Hook at C0:F380:', Buffer.from(hookBytes).toString('hex').match(/../g).join(' '));

console.log('\n======================================================');
console.log('★★★ STAGE 44 ROM BACKGROUND & BGM PERSISTENCE PASSED 100%! ★★★');
console.log('======================================================');
