function buildStageExitHook(doors){
  const c=[];const b=(...v)=>c.push(...v);
  b(0x22,0x09,0xE0,0xC0);               // JSL $C0E009
  b(0x08);                              // PHP
  b(0xE2,0x20);                        // SEP #$20

  b(0xAD,0x06,0x04); const j_trans=c.length; b(0xD0,0); // LDA $0406 : BNE .exit

  const exitMap = new Map();
  for(const d of doors){
    if(d.destStage && d.exitStage && d.destStage !== d.exitStage){
      exitMap.set(d.destStage, d.exitStage);
    }
  }

  for(const [destStage, exitStage] of exitMap.entries()){
    b(0xAD,0x03,0x1F);                  // LDA $1F03 (fase atual)
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

  c[j_trans+1]=(exit_addr-(j_trans+2))&0xFF;
  return c;
}

const doors = [{ destStage: 7, exitStage: 3 }];
const bytes = buildStageExitHook(doors);
console.log('Bytes:', bytes.map(x => x.toString(16).padStart(2, '0')).join(' '));

