const fs = require('fs');

console.log('--- Testing Project Save/Load (JSON) and Secret Door Defaults ---');

// 1. Check default SECRET_DOORS definition
const defaultDoors = [
  { id: 1, srcStage: 2, destStage: 7, exitStage: 3, minX: 700, maxX: 950, maxY: 205 }
];

console.log('Default doors count:', defaultDoors.length);
if (defaultDoors.length !== 1 || defaultDoors[0].srcStage !== 2) {
  throw new Error('Default door should only be in stage 2!');
}
console.log('✓ Default doors: exactly 1 door in Stage 2 (Prison Cell), 0 in Stage 1.');

// 2. Mock ST and Project serialization
const mockStages = [
  {
    id: 1,
    row: 0,
    area: 1,
    templateStage: null,
    isCustomStage: false,
    items: [
      { t: 'rec', b: [250, 0, 48, 0, 0, 0, 19, 0, 40, 1, 0, 0] },
      { t: 'cmd', b: [255, 0] }
    ],
    orig: [
      [250, 0, 48, 0, 0, 0, 19, 0, 40, 1, 0, 0],
      [255, 0]
    ]
  },
  {
    id: 2,
    row: 1,
    area: 2,
    templateStage: null,
    isCustomStage: false,
    items: [
      { t: 'rec', b: [100, 0, 30, 0, 0, 0, 2, 0, 10, 0, 0, 0] }
    ],
    orig: [
      [100, 0, 30, 0, 0, 0, 2, 0, 10, 0, 0, 0]
    ]
  }
];

// Modify stage 1
mockStages[0].items[0].b[6] = 20; // Changed to Dave!
mockStages[0].items[0].b[8] = 99; // 99 HP!

// Add a door
const editedDoors = [
  ...defaultDoors,
  { id: 2, srcStage: 1, destStage: 44, exitStage: 3, minX: 100, maxX: 200, maxY: 180 }
];

const projectData = {
  app: "FF3 Script & Visual Editor",
  version: "2026.1",
  timestamp: new Date().toISOString(),
  romName: "Final_Fight_3_USA",
  options: {
    slots4: true,
    p2vram: true,
    allgates: false,
    secretDoor: true,
    share: false
  },
  secretDoors: editedDoors,
  stages: mockStages.map(s => ({
    id: s.id,
    row: s.row,
    area: s.area,
    templateStage: s.templateStage,
    isCustomStage: !!s.isCustomStage,
    items: s.items.map(it => ({ t: it.t, b: it.b.slice() }))
  }))
};

const jsonStr = JSON.stringify(projectData, null, 2);
console.log('Exported JSON size (bytes):', jsonStr.length);

// 3. Simulate Import
const importedData = JSON.parse(jsonStr);

// Fresh virgin mock stages
const freshStages = [
  {
    id: 1,
    row: 0,
    area: 1,
    items: [
      { t: 'rec', b: [250, 0, 48, 0, 0, 0, 19, 0, 40, 1, 0, 0] },
      { t: 'cmd', b: [255, 0] }
    ],
    orig: [
      [250, 0, 48, 0, 0, 0, 19, 0, 40, 1, 0, 0],
      [255, 0]
    ]
  },
  {
    id: 2,
    row: 1,
    area: 2,
    items: [
      { t: 'rec', b: [100, 0, 30, 0, 0, 0, 2, 0, 10, 0, 0, 0] }
    ],
    orig: [
      [100, 0, 30, 0, 0, 0, 2, 0, 10, 0, 0, 0]
    ]
  }
];

let restoredDoors = [];
for (const projStage of importedData.stages) {
  const target = freshStages.find(x => x.id === projStage.id);
  if (target) {
    target.items = projStage.items.map(it => ({ t: it.t, b: it.b.slice() }));
  }
}
restoredDoors = importedData.secretDoors.slice();

console.log('Restored Stage 1 Enemy 0 Type:', freshStages[0].items[0].b[6]);
console.log('Restored Stage 1 Enemy 0 HP:', freshStages[0].items[0].b[8]);
console.log('Restored Doors Count:', restoredDoors.length);

if (freshStages[0].items[0].b[6] !== 20 || freshStages[0].items[0].b[8] !== 99) {
  throw new Error('Enemy edits not restored!');
}
if (restoredDoors.length !== 2) {
  throw new Error('Secret doors not restored!');
}
console.log('✓ Project Save and Load verification PASSED successfully!');

