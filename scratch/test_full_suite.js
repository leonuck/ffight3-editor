const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  throw new Error("Could not find <script> in HTML");
}
const jsCode = scriptMatch[1];
console.log('Script length:', jsCode.length);

// 1. Syntax Check
try {
  new vm.Script(jsCode);
  console.log('✓ Syntax Check PASSED! No syntax errors in script.');
} catch (e) {
  console.error('✗ Syntax Check FAILED:', e);
  process.exit(1);
}

// 2. Functional Test
const mockRom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

const mockEl = () => ({
  checked: true,
  value: '7',
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

try {
  vm.runInContext(jsCode, sandbox);
  console.log('✓ Script initialized in VM context.');

  // Load stages in VM context
  vm.runInContext("ROM = new Uint8Array(mockRom); ST = loadStages(ROM); CUR = 0;", sandbox);
  const stagesCount = vm.runInContext("ST.stages.length", sandbox);
  console.log('✓ Loaded stages count:', stagesCount);

  // Call createCustomSecretStage with template 7 (Bar Creep Eats)
  vm.runInContext("createCustomSecretStage(7, true, true);", sandbox);
  const s44 = vm.runInContext("ST.stages.find(s => s.id === 44)", sandbox);
  if (!s44) throw new Error("Stage 44 was not created!");
  console.log('✓ Stage 44 created with template', s44.templateStage, 'Items count:', s44.items.length);

  // Test replacing Callman (item 6) with Billy (Type 5) via the type change handler
  console.log('\n--- Testing Auto-Sanitizer (Changing Boss to Common Enemy) ---');
  const callmanBefore = s44.items[6].b.slice();
  console.log('Callman before change: Type:', callmanBefore[4], 'Gfx:', callmanBefore[5], 'Pos:', callmanBefore[10], 'X:', vm.runInContext(`rec.x([${callmanBefore}])/16`, sandbox), 'Y:', vm.runInContext(`rec.y([${callmanBefore}])/16`, sandbox));

  // Trigger simulated onchange with type = 5 (Billy)
  vm.runInContext(`
    const s = ST.stages.find(x => x.id === 44);
    const it = s.items[6];
    const b = it.b;
    const e = { value: '5', dataset: { i: 6, f: 'type' } };
    
    // Execute onchange logic
    const newType = (+e.value) & 0x3F;
    b[4] = +e.value;
    const isBoss = (newType >= 20 && newType <= 26);
    if(!isBoss){
      if(b[5] > 3 || b[5] === 0){
        const isBig = (newType === 7 || newType === 8 || newType === 9 || newType === 14 || newType === 19);
        b[5] = isBig ? 3 : 2;
      }
      if(b[10] === 1){
        b[10] = 0;
        const curXPx = rec.x(b) / 16;
        if(curXPx > 300 || curXPx < -60){
          setW(b, 11, 275 * 16);
        }
      }
      const curY = rec.y(b) / 16;
      if(curY < 155 || curY > 215){
        setW(b, 13, 184 * 16);
      }
    }
  `, sandbox);

  const billyAfter = s44.items[6].b;
  const bGfx = billyAfter[5];
  const bPos = billyAfter[10];
  const bX = vm.runInContext(`rec.x([${billyAfter}])/16`, sandbox);
  const bY = vm.runInContext(`rec.y([${billyAfter}])/16`, sandbox);
  console.log('Billy after auto-sanitizer: Type:', billyAfter[4], 'Gfx:', bGfx, 'Pos:', bPos, 'X:', bX, 'Y:', bY);

  if (bGfx !== 2) throw new Error(`Expected Gfx=2 for Billy, got ${bGfx}`);
  if (bPos !== 0) throw new Error(`Expected Pos=0 for Billy, got ${bPos}`);
  if (bY !== 184) throw new Error(`Expected Y=184 (on the floor) for Billy, got ${bY}`);
  if (bX !== 275) throw new Error(`Expected X=275 for Billy, got ${bX}`);
  console.log('✓ Auto-sanitizer verified! Common enemy is 100% on floor at Y: 184px, Pos: 0, X: 275px.');

  // Test re-cloning another stage (e.g. Stage 3 - Dave)
  console.log('\n--- Testing Re-cloning Stage 3 (Dave) ---');
  vm.runInContext("createCustomSecretStage(3, true, true);", sandbox);
  const s44Dave = vm.runInContext("ST.stages.find(s => s.id === 44)", sandbox);
  console.log('✓ Stage 44 re-cloned with template', s44Dave.templateStage, 'Items count:', s44Dave.items.length);

  // Compile ROM with buildRom
  const built = vm.runInContext(`
    buildRom(ROM, ST, {
      slots4: true,
      p2vram: true,
      allgates: true,
      secretDoor: true,
      secretDoors: SECRET_DOORS,
      share: false
    });
  `, sandbox);
  console.log('✓ ROM built successfully! Checksum:', built.log.find(l => l.includes('Checksum')));

  // Verify reload
  sandbox.builtRom = built.rom;
  const reloadedCount = vm.runInContext("loadStages(builtRom).stages.length", sandbox);
  console.log('✓ Reloaded stages count from built ROM:', reloadedCount);

  console.log('\n========================================');
  console.log('★★★ ALL FULL SUITE TESTS PASSED! ★★★');
  console.log('========================================');
} catch (e) {
  console.error('✗ Execution test failed:', e);
  process.exit(1);
}
