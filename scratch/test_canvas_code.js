// Test Stage 1 canvas drawer logic
function testCanvasCode() {
  const code = `
    function drawStageBackground(canvas, stageId, totalW, totalH, zoom) {
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;
      canvas.width = totalW;
      canvas.height = totalH;
      ctx.save();
      ctx.scale(zoom, zoom);
      const w = totalW / zoom;
      const h = totalH / zoom;
      // test drawing primitives
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
  `;
  new Function(code);
  console.log('Canvas drawer code is syntactically valid!');
}
testCanvasCode();

