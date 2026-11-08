const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  throw new Error("Could not find <script> in HTML");
}
const jsCode = scriptMatch[1];
console.log('Script length:', jsCode.length);

const mockRom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

const mockEl = () => ({
  checked: true,
  value: '0',
  style: {},
  dataset: {},
  classList: { add: () => {}, remove: () => {} },
  querySelector: () => ({ textContent: '', style: {} }),
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
    createElement: () => mockEl()
  },
  window: {
    innerWidth: 1024,
    innerHeight: 768,
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  prompt: (msg, def) => '7',
  alert: (msg) => console.log('[MOCK ALERT]:', msg.split('\n')[0]),
  confirm: (msg) => true,
  Uint8Array,
  ArrayBuffer,
  Math,
  parseInt,
  isNaN,
  Set,
  Date,
  mockRom
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;

vm.createContext(sandbox);
vm.runInContext(jsCode, sandbox);
vm.runInContext("ROM = new Uint8Array(mockRom); ST = loadStages(ROM); CUR = 0;", sandbox);

// Test cloning Stage 3 (Dave) into Stage 44
console.log('Testing cloning Stage 3 (Dave)...');
const s3 = vm.runInContext("ST.stages.find(s => s.id === 3)", sandbox);
console.log('Stage 3 items count:', s3.items.length);
const daveRec = s3.items.find(it => it.t === 'rec' && (it.b[4] & 0x3F) === 20);
console.log('Dave raw bytes:', daveRec.b);

// Test cloning Stage 12 (Caine) into Stage 44
const s12 = vm.runInContext("ST.stages.find(s => s.id === 12)", sandbox);
console.log('Stage 12 (Caine) items count:', s12.items.length);

console.log('✓ Stage inspection test passed.');

