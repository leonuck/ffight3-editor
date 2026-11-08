const fs = require('fs');

function getInitialBgCustom(tplStageId) {
  if (tplStageId === 3) {
    return {
      type: 'dave',
      windowX: 100,
      windowW: 568,
      deskX: 320,
      deskW: 220,
      lampX: 340,
      carpetColor: '#450a0a',
      wallColor: '#26120b',
      titleText: '⚡ SALA SECRETA 44 · GABINETE EXECUTIVO'
    };
  } else if (tplStageId === 11 || tplStageId === 19 || tplStageId === 21) {
    return {
      type: 'china',
      pillarSpacing: 180,
      lanternSpacing: 180,
      wallColor: '#7f1d1d',
      titleText: '⚡ SALA SECRETA 44 · RESTAURANTE CHINÊS'
    };
  } else {
    return {
      type: 'bar',
      counterX: 520,
      counterW: 500,
      neonText: '★ CREEP EATS · SALA SECRETA 44 ★',
      neonColor: '#f43f5e',
      neonBorder: '#ec4899',
      neonX: 160,
      subNeonText: 'COLD BEER',
      subNeonX: 440,
      dartboardX: 110,
      showDartboard: true,
      shelvesStart: 10,
      shelvesEnd: 1050,
      stoolSpacing: 75,
      floorTheme: 'wood'
    };
  }
}

const customBar = getInitialBgCustom(7);
console.log('Default customBar config:', customBar);

const customDave = getInitialBgCustom(3);
console.log('Default customDave config:', customDave);

