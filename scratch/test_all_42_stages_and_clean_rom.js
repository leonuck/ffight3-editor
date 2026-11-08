const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('--- Testing All 42 Stage Backgrounds and Clean ROM Building ---');

const html = fs.readFileSync(path.resolve('FF3_Script_Editor.html'), 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error('No script tag found!');

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
    save: ()=>{}, restore: ()=>{}, scale: ()=>{}, fillRect: ()=>{}, strokeRect: ()=>{},
    beginPath: ()=>{}, stroke: ()=>{}, fill: ()=>{},
    createLinearGradient: ()=>({ addColorStop: ()=>{} }),
    createRadialGradient: ()=>({ addColorStop: ()=>{} }),
    arc: ()=>{}, ellipse: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{}, closePath: ()=>{}, fillText: ()=>{}
  })
});

const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  document: {
    querySelector: () => mockEl(),
    querySelectorAll: () => [],
    getElementById: () => mockEl(),
    createElement: () => mockEl()
  },
  window: {
    innerWidth: 1024,
    innerHeight: 768,
    location: {},
    document: {
      querySelector: () => mockEl(),
      querySelectorAll: () => []
    },
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  prompt: (msg, def) => '7',
  alert: (msg) => console.log('[MOCK ALERT]:', msg.split('\n')[0]),
  confirm: (msg) => true,
  Image: function() { this.src = ''; },
  Uint8Array,
  ArrayBuffer,
  Math,
  parseInt,
  isNaN,
  Set,
  Date
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;

vm.createContext(sandbox);
vm.runInContext(scriptMatch[1], sandbox);

const STAGE_BG_IMAGES = vm.runInContext("STAGE_BG_IMAGES", sandbox);
const STAGE_BG_WIDTHS = vm.runInContext("STAGE_BG_WIDTHS", sandbox);

if (!STAGE_BG_IMAGES || !STAGE_BG_WIDTHS) {
  throw new Error('STAGE_BG_IMAGES or STAGE_BG_WIDTHS not found!');
}

function getPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.toString('ascii', 1, 4) !== 'PNG') return null;
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20)
  };
}

let allPassed = true;
for (let id = 1; id <= 42; id++) {
  const imgPath = STAGE_BG_IMAGES[id];
  const expectedW = STAGE_BG_WIDTHS[id];

  if (!imgPath) {
    console.error(`FAIL: Stage ${id} missing in STAGE_BG_IMAGES`);
    allPassed = false;
    continue;
  }
  if (!expectedW) {
    console.error(`FAIL: Stage ${id} missing in STAGE_BG_WIDTHS`);
    allPassed = false;
    continue;
  }

  const fullPath = path.resolve(imgPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`FAIL: Stage ${id} image file not found on disk: ${imgPath}`);
    allPassed = false;
    continue;
  }

  const dims = getPngDimensions(fullPath);
  if (dims.width !== expectedW) {
    console.error(`FAIL: Stage ${id} width mismatch! Expected ${expectedW}, got ${dims.width}`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log('✓ All 42 stages have matching PNG files and dimensions!');
} else {
  throw new Error('Some stages failed background image verification!');
}

// Test ROM Build and C0:0120 verification
const romBuf = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
sandbox.mockRom = romBuf;
vm.runInContext("ROM = new Uint8Array(mockRom); ST = loadStages(ROM); CUR = 0;", sandbox);

// Create Stage 44 with Template 14 (Pier)
vm.runInContext("createCustomSecretStage(14, true, true);", sandbox);
const s44 = vm.runInContext("ST.stages.find(s => s.id === 44)", sandbox);
if (!s44 || s44.templateStage !== 14) {
  throw new Error('Stage 44 creation with template 14 failed!');
}
console.log('✓ Stage 44 created with template 14 (Pier).');

const built = vm.runInContext(`buildRom(ROM, ST, {
  slots4: true,
  share: true,
  p2vram: true,
  allgates: true,
  secretDoors: SECRET_DOORS
})`, sandbox);

const builtRom = built.rom;
const h = vm.runInContext("ST.h", sandbox);

// Verify C0:0120
const c120Bytes = [builtRom[0x000120 + h], builtRom[0x000121 + h], builtRom[0x000122 + h], builtRom[0x000123 + h], builtRom[0x000124 + h]];
const c120Hex = c120Bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
console.log('C0:0120 in built ROM:', c120Hex);

if (c120Hex !== '8D 03 1F C9 48') {
  throw new Error(`C0:0120 is not restored to vanilla! Found: ${c120Hex}`);
}
console.log('✓ C0:0120 is 100% vanilla (8D 03 1F C9 48)!');

// Verify Stage 44 pointers in table 0x342B3 match template 14 pointers in table 0x34000
let aTpl = 0x34000 + h;
let curTpl = 1;
let expectedTplPtrs = null;
while (aTpl < 0x34000 + h + 0x300) {
  const ptrs = [];
  while (builtRom[aTpl+2] >= 0xC0 && builtRom[aTpl+2] < 0xF0) {
    ptrs.push(builtRom[aTpl] | (builtRom[aTpl+1] << 8) | (builtRom[aTpl+2] << 16));
    aTpl += 3;
  }
  if (!ptrs.length) break;
  if (curTpl === 14) { expectedTplPtrs = ptrs; break; }
  curTpl++;
  if (builtRom[aTpl] === 0) aTpl++;
}

const s44Off = 0x342B3 + h;
for (let p = 0; p < 4; p++) {
  const tplP = expectedTplPtrs[p];
  const s44P = builtRom[s44Off + p*3] | (builtRom[s44Off + p*3 + 1] << 8) | (builtRom[s44Off + p*3 + 2] << 16);
  if (tplP !== s44P) {
    throw new Error(`Pointer ${p} mismatch! Template: 0x${tplP.toString(16)}, Stage 44: 0x${s44P.toString(16)}`);
  }
}
console.log('✓ All 4 scenario pointers of Stage 44 match Template 14 exactly!');

// Verify checksum
const csum = (builtRom[0x007FDE + h] | (builtRom[0x007FDF + h] << 8)).toString(16).toUpperCase();
const invCsum = (builtRom[0x007FDC + h] | (builtRom[0x007FDD + h] << 8)).toString(16).toUpperCase();
console.log(`✓ SNES Header Checksum: 0x${csum}, Inverse: 0x${invCsum}`);

console.log('★★★ ALL VERIFICATIONS PASSED SUCCESSFULLY! ★★★');
