const fs = require('fs');
const vm = require('vm');

console.log('--- Testing Sprite Avatars & Stage Boss Features ---');

const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);

const mockEl = () => ({
  checked: true,
  value: '7',
  style: {},
  dataset: {},
  classList: { add: ()=>{}, remove: ()=>{}, contains: ()=>false },
  querySelector: () => mockEl(),
  querySelectorAll: () => [],
  appendChild: () => {},
  addEventListener: () => {},
  getContext: () => ({
    save: ()=>{}, restore: ()=>{}, scale: ()=>{}, fillRect: ()=>{}, strokeRect: ()=>{},
    beginPath: ()=>{}, stroke: ()=>{}, fill: ()=>{},
    createLinearGradient: ()=>({ addColorStop: ()=>{} }),
    createRadialGradient: ()=>({ addColorStop: ()=>{} }),
    arc: ()=>{}, ellipse: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{}, closePath: ()=>{}, fillText: ()=>{},
    drawImage: ()=>{}
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
  prompt: () => '7',
  alert: () => {},
  confirm: () => true,
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

const romBuf = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
sandbox.mockRom = romBuf;
vm.runInContext('ROM = new Uint8Array(mockRom); ST = loadStages(ROM);', sandbox);

// 1. Verify getEnemySpriteImg mapping
const imgDave = vm.runInContext('getEnemySpriteImg(20)', sandbox);
const imgCallman = vm.runInContext('getEnemySpriteImg(21)', sandbox);
const imgBillyBrown = vm.runInContext('getEnemySpriteImg(5)', sandbox);
const imgBillyWhite = vm.runInContext('getEnemySpriteImg(69)', sandbox);
const imgBlack = vm.runInContext('getEnemySpriteImg(26)', sandbox);

console.log('Dave image:', imgDave);
console.log('Callman image:', imgCallman);
console.log('Billy Brown image:', imgBillyBrown);
console.log('Billy White image:', imgBillyWhite);
console.log('Black image:', imgBlack);

if (!imgDave.includes('dave.gif')) throw new Error('Dave image mapping failed!');
if (!imgCallman.includes('callman.gif')) throw new Error('Callman image mapping failed!');
if (!imgBillyBrown.includes('billybrown body.png')) throw new Error('Billy brown image mapping failed!');
if (!imgBillyWhite.includes('billy white body.png')) throw new Error('Billy white image mapping failed!');
if (!imgBlack.includes('black_stand.gif')) throw new Error('Black image mapping failed!');
console.log('✓ All enemy and boss sprite images mapped correctly!');

// 2. Test Boss insertion in Stage 1
vm.runInContext('CUR = 0;', sandbox); // Stage 1 (no boss)
const s1 = vm.runInContext('ST.stages.find(x => x.id === 1)', sandbox);
const initialItemsCount = s1.items.length;
console.log('Stage 1 initial items:', initialItemsCount);

const bossMeta = vm.runInContext('STAGE_BOSSES[3]', sandbox); // Dave
vm.runInContext(`insertBossIntoStage(ST.stages.find(x => x.id === 1), STAGE_BOSSES[3])`, sandbox);

const newItemsCount = s1.items.length;
console.log('Stage 1 items after inserting boss:', newItemsCount);
if (newItemsCount !== initialItemsCount + 1) throw new Error('Boss was not inserted into Stage 1!');

const insertedBoss = s1.items.find(it => it.t === 'rec' && it.b[4] === 20);
if (!insertedBoss) throw new Error('Inserted boss item not found in items!');
const bossX = vm.runInContext('rec.x([' + insertedBoss.b + '])/16', sandbox);
const bossY = vm.runInContext('rec.y([' + insertedBoss.b + '])/16', sandbox);
const bossPos = insertedBoss.b[10];
console.log(`✓ Boss inserted in Stage 1! Type: ${insertedBoss.b[4]}, X: ${bossX}px, Y: ${bossY}px, Pos: ${bossPos}`);

// 3. Test render in Stage 3 (Dave)
vm.runInContext('CUR = 2;', sandbox); // Stage 3
vm.runInContext('render()', sandbox);
console.log('✓ render() executed cleanly for Stage 3 (Dave).');

// 4. Test render in Stage 7 (Club Capcom / Callman)
vm.runInContext('CUR = 6;', sandbox); // Stage 7
vm.runInContext('render()', sandbox);
console.log('✓ render() executed cleanly for Stage 7 (Callman).');

console.log('★★★ ALL SPRITE & BOSS INTEGRATION TESTS PASSED! ★★★');
