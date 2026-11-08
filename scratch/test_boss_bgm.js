const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const jsCode = scriptMatch[1];
const mockRom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

const mockEl = () => ({
  checked: true, value: '7', style: {}, dataset: {}, classList: { add: () => {}, remove: () => {} },
  querySelector: () => mockEl(), querySelectorAll: () => [], appendChild: () => {}, addEventListener: () => {},
  getContext: () => ({ scale: () => {}, fillRect: () => {}, strokeRect: () => {}, drawImage: () => {},
    beginPath: () => {}, moveTo: () => {}, lineTo: () => {}, stroke: () => {}, fill: () => {}, arc: () => {},
    ellipse: () => {}, closePath: () => {}, fillText: () => {}, save: () => {}, restore: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }), createRadialGradient: () => ({ addColorStop: () => {} })
  })
});

const sandbox = {
  console, setTimeout, clearTimeout, setInterval, clearInterval, alert: () => {}, confirm: () => true, prompt: () => '7',
  window: { location: { reload: () => {} }, innerWidth: 1280, innerHeight: 800, addEventListener: () => {}, removeEventListener: () => {} },
  document: { getElementById: () => mockEl(), querySelector: () => mockEl(), querySelectorAll: () => [], createElement: () => mockEl(), body: mockEl() },
  Uint8Array, ArrayBuffer, Buffer, Math, parseInt, isNaN, Set, Date, mockRom
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;

vm.createContext(sandbox);
vm.runInContext(jsCode, sandbox);
vm.runInContext("ROM = new Uint8Array(mockRom); ST = loadStages(ROM); CUR = 0;", sandbox);
vm.runInContext("createCustomSecretStage(7, true, true);", sandbox);
vm.runInContext(`
  const s = ST.stages.find(st => st.id === 44);
  s.bgCustom = { type: 'bar', layout: 'arena', paletteTheme: 'red', bgm: 0x05 };
  const opts = { slots4: true, allgates: true, p2vram: true, secretDoor: true,
    secretDoors: [{ srcStage: 1, destStage: 44, exitStage: 3, minX: 680, maxX: 720, maxY: 180 }]
  };
  buildResult = buildRom(ROM, ST, opts);
`, sandbox);

const builtRom = vm.runInContext("buildResult.rom", sandbox);
const h = vm.runInContext("ST.h", sandbox);
const s44Off = 0x342B3 + h;
const p0 = builtRom[s44Off] | (builtRom[s44Off+1]<<8) | (builtRom[s44Off+2]<<16);
const p0FileOff = (p0 & 0x3FFFFF) + h;
const bgmByte = builtRom[p0FileOff];
console.log('Boss Battle BGM byte in Pointer 0:', bgmByte);
if (bgmByte !== 0x05) throw new Error('BGM should be 0x05 (Boss Battle)');
console.log('✓ Boss Battle BGM (0x05) test PASSED!');

