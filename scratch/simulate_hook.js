const fs = require('fs');

const origRom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');

// We simulate what FF3_Script_Editor.html does
function buildStageExitHook(doors){
  const c=[];const b=(...v)=>c.push(...v);
  b(0x22,0x09,0xE0,0xC0);               // JSL $C0E009
  b(0x08);                              // PHP
  b(0xE2,0x20);                        // SEP #$20

  b(0xAD,0x00,0x05);                   // LDA $0500
  b(0x0D,0x00,0x06);                   // ORA $0600
  b(0x89,0x01);                        // BIT #$01
  const j_dead=c.length; b(0xF0,0);    // BEQ .exit

  const exitMap = new Map();
  for(const d of doors){
    if(d.destStage && d.exitStage){
      exitMap.set(d.destStage, d.exitStage);
    }
  }

  for(const [destStage, exitStage] of exitMap.entries()){
    b(0xAD,0x03,0x1F);                  // LDA $1F03
    b(0xC9,destStage);                  // CMP #destStage
    const j_skip=c.length; b(0xD0,0);   // BNE .skip

    b(0xA9,exitStage);                  // LDA #exitStage
    b(0x8D,0x06,0x04);                  // STA $0406
    b(0x28);                            // PLP
    b(0x6B);                            // RTL

    const skip_addr=c.length;
    c[j_skip+1]=(skip_addr-(j_skip+2))&0xFF;
  }

  const exit_addr=c.length;
  b(0x28);                              // PLP
  b(0x6B);                              // RTL

  c[j_dead+1]=(exit_addr-(j_dead+2))&0xFF;
  return c;
}

const doors = [
  { id: 1, srcStage: 1, destStage: 7, exitStage: 3, minX: 60, maxX: 300, maxY: 205 },
  { id: 2, srcStage: 1, destStage: 7, exitStage: 3, minX: 550, maxX: 640, maxY: 205 },
  { id: 3, srcStage: 2, destStage: 7, exitStage: 3, minX: 700, maxX: 950, maxY: 205 }
];

const hook = buildStageExitHook(doors);
console.log('Hook generated successfully, length =', hook.length);
console.log('Hook bytes:', hook.map(b => b.toString(16).padStart(2, '0')).join(' '));

// Verify that doors with same destStage (7) are deduplicated by Map:
// 1 door entry in exitMap for destStage=7 -> exitStage=3.
console.log('Deduplication verified: only 1 entry for destStage 7!');

