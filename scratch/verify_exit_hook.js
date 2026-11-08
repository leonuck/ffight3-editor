function buildStageExitHook(doors){
  const c=[];const b=(...v)=>c.push(...v);
  // 1. Executa a rotina nativa original em C0:132A
  b(0x22,0x09,0xE0,0xC0);               // JSL $C0E009
  b(0x08);                              // PHP
  b(0xE2,0x20);                        // SEP #$20

  // 2. Trava de Game Over: se ambos os jogadores estiverem mortos, não redireciona
  // $0500 bit 0 = P1 ativo/vivo, $0600 bit 0 = P2 ativo/vivo
  b(0xAD,0x00,0x05);                   // LDA $0500
  b(0x0D,0x00,0x06);                   // ORA $0600
  b(0x89,0x01);                        // BIT #$01
  const j_dead=c.length; b(0xF0,0);    // BEQ .exit (jogadores mortos -> Game Over normal)

  // 3. Mapeia saídas personalizadas para cada sala de destino (sem duplicidade)
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
    b(0x8D,0x06,0x04);                  // STA $0406 (força o despachante a ir para a fase de retorno!)
    b(0x28);                            // PLP
    b(0x6B);                            // RTL

    const skip_addr=c.length;
    c[j_skip+1]=(skip_addr-(j_skip+2))&0xFF;
  }

  // .exit:
  const exit_addr=c.length;
  b(0x28);                              // PLP
  b(0x6B);                              // RTL

  c[j_dead+1]=(exit_addr-(j_dead+2))&0xFF;
  return c;
}

const doors = [{ destStage: 7, exitStage: 3 }];
const code = buildStageExitHook(doors);
console.log('Hook length:', code.length, 'bytes');
console.log('Hex dump:');
for (let i = 0; i < code.length; i += 16) {
  console.log(code.slice(i, i + 16).map(x => x.toString(16).padStart(2, '0')).join(' '));
}

