const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

const target = `  const bS44 = $('#btnCreateStage44');
  if(bS44){
    bS44.onclick = () => {
      const idx = ST.stages.findIndex(s => s.id === 44);
      if(idx >= 0){
        CUR = ST.stages[idx].row;
        SELECTED_IDX = null;
        ACTIVE_WAVE = 'all';
        render();
      } else {
        createCustomSecretStage();
      }
    };
  }
}`;

const replacement = `  const bS44 = $('#btnCreateStage44');
  if(bS44){
    bS44.onclick = () => {
      const idx = ST.stages.findIndex(s => s.id === 44);
      if(idx >= 0){
        CUR = ST.stages[idx].row;
        SELECTED_IDX = null;
        ACTIVE_WAVE = 'all';
        render();
      } else {
        openCreateStageModal(false);
      }
    };
  }
  const bReclone = $('#btnRecloneStage44');
  if(bReclone){
    bReclone.onclick = () => {
      openCreateStageModal(true);
    };
  }
}`;

if (!html.includes(target)) {
  throw new Error("Could not find target bS44 block to replace");
}

html = html.replace(target, replacement);
fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('bS44 and bReclone updated successfully!');

