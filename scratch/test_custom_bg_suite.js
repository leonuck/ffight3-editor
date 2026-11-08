const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const jsCode = scriptMatch[1];

let drawCalls = [];
const mockCtx = {
  save: ()=>{}, restore: ()=>{}, scale: ()=>{}, fillRect: (...a)=>{ drawCalls.push({ type: 'fillRect', a }); },
  strokeRect: (...a)=>{ drawCalls.push({ type: 'strokeRect', a }); },
  beginPath: ()=>{}, stroke: ()=>{}, fill: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{},
  createLinearGradient: ()=>({ addColorStop: ()=>{} }),
  createRadialGradient: ()=>({ addColorStop: ()=>{} }),
  arc: (...a)=>{ drawCalls.push({ type: 'arc', a }); },
  ellipse: (...a)=>{ drawCalls.push({ type: 'ellipse', a }); },
  closePath: ()=>{},
  fillText: (...a)=>{ drawCalls.push({ type: 'fillText', a }); },
  drawImage: ()=>{ }
};

const mockCanvas = {
  width: 0,
  height: 0,
  getContext: () => mockCtx
};

const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  document: {
    querySelector: () => ({ checked: true, value: '1', style: {}, dataset: {}, classList: { add: ()=>{}, remove: ()=>{} }, querySelector: ()=>({ textContent: '' }), querySelectorAll: ()=>[] }),
    querySelectorAll: () => [],
    createElement: () => ({ style: {}, dataset: {}, classList: { add: ()=>{}, remove: ()=>{} }, appendChild: ()=>{} })
  },
  window: {},
  Math,
  Date,
  parseInt,
  isNaN,
  Set,
  Uint8Array,
  ArrayBuffer
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;

vm.createContext(sandbox);
vm.runInContext(jsCode, sandbox);

// Test 1: Stage 44 with custom Bar (counter at X: 200, custom Neon)
drawCalls = [];
const s44Bar = {
  id: 44,
  templateStage: 7,
  bgCustom: {
    type: 'bar',
    counterX: 200,
    counterW: 350,
    neonText: '★ CUSTOM SECRET BAR ★',
    neonColor: '#38bdf8',
    neonBorder: '#06b6d4',
    neonX: 180,
    subNeonText: 'PIZZA & BEER',
    subNeonX: 600,
    dartboardX: 90,
    showDartboard: true,
    shelvesStart: 10,
    shelvesEnd: 1050,
    stoolSpacing: 60,
    floorTheme: 'tile'
  },
  items: []
};

sandbox.drawStageBackground(mockCanvas, s44Bar, 1024, 224, 1);

const fillTexts = drawCalls.filter(c => c.type === 'fillText');
console.log('FillText calls for Custom Bar:', fillTexts.map(c => c.a[0]));

const hasNeon = fillTexts.some(c => c.a[0] === '★ CUSTOM SECRET BAR ★');
if (!hasNeon) throw new Error("Expected custom neon text in fillText calls!");
console.log('✓ Found custom neon text: "★ CUSTOM SECRET BAR ★"');

const hasSubNeon = fillTexts.some(c => c.a[0] === 'PIZZA & BEER');
if (!hasSubNeon) throw new Error("Expected custom subNeon text in fillText calls!");
console.log('✓ Found custom sub-neon text: "PIZZA & BEER"');

// Check counter rect
const counterRect = drawCalls.find(c => c.type === 'fillRect' && c.a[0] === 200 && c.a[1] === 115 && c.a[2] === 350);
if (!counterRect) throw new Error("Expected counter rect at X: 200, W: 350!");
console.log('✓ Found custom counter at X: 200px, Width: 350px');

// Test 2: Stage 44 with custom Dave Office
drawCalls = [];
const s44Dave = {
  id: 44,
  templateStage: 3,
  bgCustom: {
    type: 'dave',
    windowX: 150,
    windowW: 400,
    deskX: 250,
    deskW: 180,
    lampX: 270,
    carpetColor: '#1e3a8a',
    wallColor: '#26120b',
    titleText: '⚡ SALA SECRETA 44 · GABINETE DO CHEFE'
  },
  items: []
};

sandbox.drawStageBackground(mockCanvas, s44Dave, 768, 224, 1);

const daveTexts = drawCalls.filter(c => c.type === 'fillText');
console.log('\nFillText calls for Custom Dave:', daveTexts.map(c => c.a[0]));

const hasDaveTitle = daveTexts.some(c => c.a[0] === '⚡ SALA SECRETA 44 · GABINETE DO CHEFE');
if (!hasDaveTitle) throw new Error("Expected custom Dave office title!");
console.log('✓ Found custom Dave title!');

const deskRect = drawCalls.find(c => c.type === 'fillRect' && c.a[0] === 250 && c.a[1] === 90 && c.a[2] === 180);
if (!deskRect) throw new Error("Expected desk rect at X: 250, W: 180!");
console.log('✓ Found custom desk at X: 250px, Width: 180px');

console.log('\n======================================================');
console.log('★★★ ALL CUSTOM BACKGROUND SUITE TESTS PASSED! ★★★');
console.log('======================================================');

