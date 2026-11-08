const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function hex(n, w=2) { return n.toString(16).padStart(w, '0').toUpperCase(); }

function buildStage44BgmTransitionHook(s44SoundBank) {
  const c = [];
  const b = (...v) => c.push(...v);

  // 1. STA $1F03 (original instruction replaced at C0:0120)
  b(0x8D, 0x03, 0x1F);

  // 2. Are we entering Stage 44?
  b(0xC9, 44);
  const j_not_enter = c.length; b(0xD0, 0);

  // Entering Stage 44: check if s44SoundBank already loaded
  b(0xA9, s44SoundBank);
  b(0xCD, 0x00, 0x1F); // CMP $1F00
  const j_same_enter = c.length; b(0xF0, 0);
  b(0x8D, 0x00, 0x1F); // STA $1F00
  b(0x22, 0x00, 0x00, 0xEC); // JSL $EC0000
  b(0x9C, 0x0D, 0x1F); // STZ $1F0D
  const j_done_enter = c.length; b(0x80, 0);

  // .check_exit:
  const check_exit_addr = c.length;
  c[j_not_enter + 1] = (check_exit_addr - (j_not_enter + 2)) & 0xFF;
  const same_enter_addr = c.length;
  c[j_same_enter + 1] = (same_enter_addr - (j_same_enter + 2)) & 0xFF;

  b(0xAD, 0x00, 0x00); // LDA $0000 (previous stage)
  b(0xC9, 44);
  const j_not_exit = c.length; b(0xD0, 0);

  // Exiting Stage 44: check destination stage
  b(0xAD, 0x03, 0x1F); // LDA $1F03
  b(0xC9, 0x04);       // CMP #$04 (stages 1, 2, 3)
  const j_not_r1 = c.length; b(0x10, 0);

  // Returning to Round 1: restore Sound Bank 0x01
  b(0xA9, 0x01);
  b(0xCD, 0x00, 0x1F); // CMP $1F00
  const j_same_exit = c.length; b(0xF0, 0);
  b(0x8D, 0x00, 0x1F); // STA $1F00
  b(0x22, 0x00, 0x00, 0xEC); // JSL $EC0000
  b(0x9C, 0x0D, 0x1F); // STZ $1F0D

  const done_addr = c.length;
  c[j_done_enter + 1] = (done_addr - (j_done_enter + 2)) & 0xFF;
  c[j_not_exit + 1] = (done_addr - (j_not_exit + 2)) & 0xFF;
  c[j_not_r1 + 1] = (done_addr - (j_not_r1 + 2)) & 0xFF;
  c[j_same_exit + 1] = (done_addr - (j_same_exit + 2)) & 0xFF;

  // .done:
  b(0xAD, 0x03, 0x1F); // LDA $1F03 (restore A for subsequent CMP #$48)
  b(0x6B);             // RTL

  return c;
}

const hook = buildStage44BgmTransitionHook(0x20);
console.log(`Generated hook length: ${hook.length} bytes`);
console.log('Hook bytes:', hook.map(b => hex(b)).join(' '));

