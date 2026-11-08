const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);

const mockEl = () => ({ checked: true, value: '7', style: {}, dataset: {}, classList: { add: ()=>{}, remove: ()=>{} }, querySelector: ()=>mockEl(), querySelectorAll: ()=>[], appendChild: ()=>{}, addEventListener: ()=>{}, getContext: ()=>({}) });
const sandbox = { console, setTimeout, clearTimeout, document: { querySelector: () => mockEl(), querySelectorAll: () => [], getElementById: () => mockEl(), createElement: () => mockEl() }, window: { innerWidth: 1024, innerHeight: 768, location: {}, document: { querySelector: () => mockEl(), querySelectorAll: () => [] }, addEventListener: () => {}, removeEventListener: () => {} }, prompt: () => '7', alert: () => {}, confirm: () => true, Image: function() { this.src = ''; }, Uint8Array, ArrayBuffer, Math, parseInt, isNaN, Set, Date };
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;
vm.createContext(sandbox);
vm.runInContext(scriptMatch[1], sandbox);

const romBuf = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
sandbox.mockRom = romBuf;
vm.runInContext('ROM = new Uint8Array(mockRom); ST = loadStages(ROM);', sandbox);

const stages = vm.runInContext('ST.stages', sandbox);
const STAGE_BG_WIDTHS = vm.runInContext('STAGE_BG_WIDTHS', sandbox);

const bossStages = [3, 6, 7, 12, 17, 22, 27, 34, 42];
bossStages.forEach(stId => {
  const s = stages.find(x => x.id === stId);
  if (!s) return;
  const bgW = STAGE_BG_WIDTHS[stId] || 768;
  const bossItems = s.items.filter(it => it.t === 'rec' && ((it.b[4] & 0x3F) >= 20 && (it.b[4] & 0x3F) <= 26));
  bossItems.forEach(it => {
    const b = it.b;
    const xPx = vm.runInContext('rec.x([' + b + '])/16', sandbox);
    const yPx = vm.runInContext('rec.y([' + b + '])/16', sandbox);
    const trigPx = vm.runInContext('rec.trig([' + b + '])/16', sandbox);
    const isAbs = (b[10] === 1);
    
    // Old flawed calculation:
    const oldWorldX = trigPx + xPx;
    // New fixed calculation:
    const newWorldX = isAbs ? xPx : (trigPx + xPx);

    console.log(`Stage ${stId} (Width: ${bgW}px): Boss ${vm.runInContext('sName(' + b[4] + ')', sandbox)}`);
    console.log(`   Pos: ${b[10]} (isAbs: ${isAbs}), Raw X: ${xPx}px, Trig: ${trigPx}px, Y: ${yPx}px`);
    console.log(`   Old WorldX: ${oldWorldX}px (${oldWorldX > bgW ? 'OUT OF STAGE!' : 'in stage'})`);
    console.log(`   New WorldX: ${newWorldX}px (${newWorldX <= bgW && newWorldX >= 0 ? '✓ PERFECTLY IN STAGE' : 'OUT'})`);
  });
});

