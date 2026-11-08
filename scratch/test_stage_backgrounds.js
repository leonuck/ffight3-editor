const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const jsCode = scriptMatch[1];

let drawImageCalls = [];
const mockCtx = {
  save: ()=>{}, restore: ()=>{}, scale: ()=>{}, fillRect: ()=>{}, strokeRect: ()=>{},
  beginPath: ()=>{}, stroke: ()=>{}, fill: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{},
  createLinearGradient: ()=>({ addColorStop: ()=>{} }),
  createRadialGradient: ()=>({ addColorStop: ()=>{} }),
  arc: ()=>{}, ellipse: ()=>{}, closePath: ()=>{}, fillText: ()=>{},
  drawImage: (...args) => {
    drawImageCalls.push(args);
  }
};

const mockCanvas = {
  width: 0,
  height: 0,
  getContext: () => mockCtx
};

class MockImage {
  constructor() {
    this.src = '';
    this.complete = true;
    this.naturalWidth = 1024;
    this.naturalHeight = 190;
    this.onload = null;
  }
}

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
  Image: MockImage,
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

// Test 1: Stage 1 Pano
drawImageCalls = [];
vm.runInContext("BOARD_VIEW_MODE = 'pano';", sandbox);
const s1 = { id: 1, items: [] };
sandbox.drawStageBackground(mockCanvas, s1, 1024, 224, 1);
console.log('Test 1 (Stage 1 Pano): drawImage calls =', drawImageCalls.length);
if (drawImageCalls.length !== 1) throw new Error("Expected 1 drawImage call");
console.log('Call args:', drawImageCalls[0].slice(1));
if (drawImageCalls[0][1] !== 0 || drawImageCalls[0][2] !== 34 || drawImageCalls[0][3] !== 1024 || drawImageCalls[0][4] !== 190) {
  throw new Error("Invalid drawImage coordinates for Stage 1 Pano");
}
console.log('✓ Stage 1 Pano test passed!');

// Test 2: Stage 3 Dave (imgW = 768)
drawImageCalls = [];
vm.runInContext("BOARD_VIEW_MODE = 'pano';", sandbox);
const s3 = { id: 3, items: [] };
sandbox.drawStageBackground(mockCanvas, s3, 768, 224, 1);
console.log('\nTest 2 (Stage 3 Dave Pano): drawImage calls =', drawImageCalls.length);
console.log('Call args:', drawImageCalls[0].slice(1));
if (drawImageCalls[0][3] !== 768 || drawImageCalls[0][4] !== 190) {
  throw new Error("Invalid drawImage coordinates for Stage 3 Dave Pano");
}
console.log('✓ Stage 3 Dave Pano test passed!');

// Test 3: Stage 1 Single Screen Mode (256px)
drawImageCalls = [];
vm.runInContext("BOARD_VIEW_MODE = 'single'; ACTIVE_WAVE = 'all';", sandbox);
sandbox.drawStageBackground(mockCanvas, s1, 396, 224, 1);
console.log('\nTest 3 (Stage 1 Single Mode): drawImage calls =', drawImageCalls.length);
console.log('Call args:', drawImageCalls[0].slice(1));
// [sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight]
// [0, 0, 256, 190, 70, 34, 256, 190]
if (drawImageCalls[0][5] !== 70 || drawImageCalls[0][6] !== 34 || drawImageCalls[0][7] !== 256 || drawImageCalls[0][8] !== 190) {
  throw new Error("Invalid drawImage coordinates for Single Mode");
}
console.log('✓ Stage 1 Single Mode test passed!');

// Test 4: Stage 44 with Template 1
drawImageCalls = [];
vm.runInContext("BOARD_VIEW_MODE = 'pano';", sandbox);
const s44 = { id: 44, templateStage: 1, items: [] };
sandbox.drawStageBackground(mockCanvas, s44, 1024, 224, 1);
console.log('\nTest 4 (Stage 44 Template 1): drawImage calls =', drawImageCalls.length);
console.log('Call args:', drawImageCalls[0].slice(1));
if (drawImageCalls[0][3] !== 1024) throw new Error("Expected 1024 width for Stage 44 cloned from Stage 1");
console.log('✓ Stage 44 with Template 1 test passed!');

console.log('\n========================================');
console.log('★★★ ALL BACKGROUND TESTS PASSED! ★★★');
console.log('========================================');
