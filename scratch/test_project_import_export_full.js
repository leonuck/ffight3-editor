const fs = require('fs');
const vm = require('vm');

console.log('--- Testing Project Export/Import in Full HTML Context ---');

const html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');
const scriptMatch = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i);
if (!scriptMatch) throw new Error('No script tag found!');

// Mock DOM
const mockElements = {};
function mockEl(id) {
  if (!mockElements[id]) {
    mockElements[id] = {
      id,
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
        toggle: () => {}
      },
      dataset: {},
      addEventListener: () => {},
      children: [],
      click: () => {},
      appendChild: (c) => c,
      querySelector: (sel) => mockEl(id + '_' + sel),
      querySelectorAll: (sel) => [],
      getContext: () => ({
        save: ()=>{}, restore: ()=>{}, scale: ()=>{}, fillRect: ()=>{}, strokeRect: ()=>{},
        beginPath: ()=>{}, stroke: ()=>{}, fill: ()=>{},
        createLinearGradient: ()=>({ addColorStop: ()=>{} }),
        createRadialGradient: ()=>({ addColorStop: ()=>{} }),
        arc: ()=>{}, ellipse: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{}, closePath: ()=>{}, fillText: ()=>{}
      })
    };
  }
  return mockElements[id];
}

const sandbox = {
  console,
  document: {
    getElementById: (id) => mockEl(id),
    querySelector: (sel) => mockEl(sel.replace(/[^a-zA-Z0-9_]/g, '_')),
    querySelectorAll: () => [],
    createElement: (tag) => {
      const el = mockEl('elem_' + Math.random().toString(36).slice(2));
      el.tagName = tag.toUpperCase();
      return el;
    },
    body: mockEl('body'),
    documentElement: mockEl('doc')
  },
  window: {
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  URL: {
    createObjectURL: () => 'blob:mock-url',
    revokeObjectURL: () => {}
  },
  Blob: class MockBlob {
    constructor(parts, options) {
      this.parts = parts;
      this.options = options;
    }
  },
  Uint8Array,
  ArrayBuffer,
  Math,
  parseInt,
  parseFloat,
  isNaN,
  JSON,
  Date,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  alert: (msg) => console.log('[MOCK ALERT]:', msg)
};

sandbox.window.document = sandbox.document;
sandbox.$ = (sel) => sandbox.document.querySelector(sel);

const ctx = vm.createContext(sandbox);
vm.runInContext(scriptMatch[1], ctx);

function run(code) {
  return vm.runInContext(code, ctx);
}

// 1. Verify default SECRET_DOORS
const doors = run('SECRET_DOORS');
console.log('SECRET_DOORS length:', doors.length);
console.log('Door 1 srcStage:', doors[0].srcStage);
if (doors.length !== 1 || doors[0].srcStage !== 2) {
  throw new Error('Expected exactly 1 door on srcStage 2 (Prison Cell)!');
}
console.log('✓ Secret doors default verified: 0 in stage 1, 1 in stage 2 (Prison Cell)!');

// 2. Load clean ROM
const romBytes = new Uint8Array(fs.readFileSync('Final Fight 3 (USA) otimizado.sfc'));
ctx.realRom = romBytes;
run(`
  ROM = realRom;
  ST = loadStages(ROM);
  NAME = 'Final_Fight_3_USA';
`);

const stagesCount = run('ST.stages.length');
console.log('Stages loaded:', stagesCount);

// 3. Make some custom edits
run(`
  const s1 = ST.stages[0];
  s1.items[0].b[6] = 20; // Dave
  s1.items[0].b[8] = 95; // 95 HP
  SECRET_DOORS.push({
    id: 2,
    srcStage: 1,
    destStage: 7,
    exitStage: 3,
    minX: 50,
    maxX: 150,
    maxY: 180
  });
  $('#p_slots').checked = true;
  $('#p_allgates').checked = false;
`);

// 4. Test exportProject
let exportedBlob = null;
sandbox.URL.createObjectURL = (blob) => {
  exportedBlob = blob;
  return 'blob:project';
};
run('exportProject()');

if (!exportedBlob || !exportedBlob.parts) {
  throw new Error('exportProject failed to create blob!');
}
const projectJsonStr = exportedBlob.parts[0];
const projectData = JSON.parse(projectJsonStr);
console.log('Exported project stages:', projectData.stages.length);
console.log('Exported project secretDoors:', projectData.secretDoors.length);

if (projectData.secretDoors.length !== 2) {
  throw new Error('Expected 2 doors in exported project!');
}

// 5. Test applyProjectData on a fresh ROM
run(`
  ST = loadStages(ROM);
  SECRET_DOORS = [{ id: 1, srcStage: 2, destStage: 7, exitStage: 3, minX: 700, maxX: 950, maxY: 205 }];
`);

console.log('Stage 1 Enemy 0 type before import:', run('ST.stages[0].items[0].b[6]'));
console.log('SECRET_DOORS count before import:', run('SECRET_DOORS.length'));

ctx.projectDataToImport = projectData;
const restoredCount = run('applyProjectData(projectDataToImport)');

console.log('Restored stages count:', restoredCount);
console.log('Stage 1 Enemy 0 type after import:', run('ST.stages[0].items[0].b[6]'));
console.log('Stage 1 Enemy 0 HP after import:', run('ST.stages[0].items[0].b[8]'));
console.log('SECRET_DOORS count after import:', run('SECRET_DOORS.length'));

if (run('ST.stages[0].items[0].b[6]') !== 20 || run('ST.stages[0].items[0].b[8]') !== 95) {
  throw new Error('Enemy edits were not restored correctly!');
}
if (run('SECRET_DOORS.length') !== 2) {
  throw new Error('Secret doors were not restored correctly!');
}
if (run("$('#p_allgates').checked") !== false) {
  throw new Error('Options were not restored correctly!');
}

console.log('★★★ ALL FULL PROJECT JSON AND DEFAULT DOORS TESTS PASSED! ★★★');
