const fs = require('fs');
const path = require('path');

const ENEMY_SPRITE_FILES = {
  // Round 1 palette (Base 0x00)
  5: 'img/enemies/billybrown body.png',
  6: 'img/enemies/MAY purple.png',
  7: 'img/enemies/andore red.png',
  8: 'img/enemies/dirk olive clothes.png',
  9: 'img/enemies/hunter orange.png',
  10: 'img/enemies/G organe clothes.png',
  11: 'img/enemies/JOE black.png',
  14: 'img/enemies/fat jack pink sweater.png',
  15: 'img/enemies/fritz.png',
  16: 'img/enemies/RAY gray.png',
  17: 'img/enemies/RICK black clothes.png',
  18: 'img/enemies/johnny blue.png',
  19: 'img/enemies/arby redbrick.png',
  20: 'img/enemies/dave.gif',
  21: 'img/enemies/callman.gif',
  22: 'img/enemies/caine.png',
  23: 'img/enemies/drake.png',
  24: 'img/enemies/wong.png',
  25: 'img/enemies/Stray.png',
  26: 'img/enemies/black_stand.gif',

  // Round 2 palette (+0x40 = 64)
  69: 'img/enemies/billy white body.png',
  70: 'img/enemies/MAY orange.png',
  71: 'img/enemies/andore brown.png',
  72: 'img/enemies/dirk green body.png',
  73: 'img/enemies/hunter green.png',
  74: 'img/enemies/G gray clothe.png',
  75: 'img/enemies/JOE pink.png',
  78: 'img/enemies/fat jack red sweater.png',
  79: 'img/enemies/fritz.png',
  80: 'img/enemies/RAY orange.png',
  81: 'img/enemies/RICK green body.png',
  82: 'img/enemies/johnny brown.png',
  83: 'img/enemies/arby red.png',
  84: 'img/enemies/dave.gif',
  85: 'img/enemies/callman.gif',
  86: 'img/enemies/caine.png',
  87: 'img/enemies/drake.png',
  88: 'img/enemies/wong.png',
  89: 'img/enemies/Stray.png',
  90: 'img/enemies/black_stand.gif',

  // Round 3 palette (+0x80 = 128)
  133: 'img/enemies/billy orange clolthe.png',
  134: 'img/enemies/MAY gray.png',
  135: 'img/enemies/andore green.png',
  136: 'img/enemies/dirk olivedrab.png',
  137: 'img/enemies/hunter blue.png',
  138: 'img/enemies/G green clothe.png',
  139: 'img/enemies/JOE darkgreen.png',
  142: 'img/enemies/fat jack black sweater.png',
  143: 'img/enemies/fritz.png',
  144: 'img/enemies/RAY gray.png',
  145: 'img/enemies/RICK green clothe.png',
  146: 'img/enemies/johnny gray.png',
  147: 'img/enemies/arby blue.png',
  148: 'img/enemies/dave.gif',
  149: 'img/enemies/callman.gif',
  150: 'img/enemies/caine.png',
  151: 'img/enemies/drake.png',
  152: 'img/enemies/wong.png',
  153: 'img/enemies/Stray.png',
  154: 'img/enemies/black_stand.gif',

  // Round 4/5/6 palette (+0xC0 = 192)
  197: 'img/enemies/billy green clothe.png',
  198: 'img/enemies/MAY blue.png',
  199: 'img/enemies/andore blue.png',
  200: 'img/enemies/dirk blue clothes.png',
  201: 'img/enemies/hunter gray.png',
  202: 'img/enemies/G darkgray clothe.png',
  203: 'img/enemies/JOE green.png',
  206: 'img/enemies/fat jack blue clothes.png',
  207: 'img/enemies/fritz.png',
  208: 'img/enemies/RAY darkgreen.png',
  209: 'img/enemies/RICK blue clothes.png',
  210: 'img/enemies/johnny olive.png',
  211: 'img/enemies/arby green.png',
  212: 'img/enemies/dave.gif',
  213: 'img/enemies/callman.gif',
  214: 'img/enemies/caine.png',
  215: 'img/enemies/drake.png',
  216: 'img/enemies/wong.png',
  217: 'img/enemies/Stray.png',
  218: 'img/enemies/black_stand.gif'
};

let allExist = true;
for (const [id, relPath] of Object.entries(ENEMY_SPRITE_FILES)) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`MISSING FILE: ${relPath} for ID ${id}`);
    allExist = false;
  }
}
if (allExist) {
  console.log('✓ All 55 sprite files exist on disk and map correctly to enemy types!');
}

