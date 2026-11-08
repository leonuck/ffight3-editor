const fs = require('fs');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

// 1. Add CSS rules before </style>
const newCss = `
/* Interactive Door Zone & Resizing Handles */
.arena-door-zone{position:absolute;border:2px dashed #f59e0b;background:rgba(245,158,11,0.22);box-shadow:0 0 16px rgba(245,158,11,0.35);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:4px;z-index:8;border-radius:4px;cursor:grab;user-select:none;transition:border-color 0.15s,box-shadow 0.15s;pointer-events:auto!important}
.arena-door-zone:hover,.arena-door-zone.is-selected{border-color:#38bdf8!important;background:rgba(56,189,248,0.28)!important;box-shadow:0 0 20px rgba(56,189,248,0.5)!important;z-index:9!important}
.arena-door-zone:active{cursor:grabbing}
.door-resize-handle{position:absolute;background:#fff;border:1.5px solid #0f172a;border-radius:2px;z-index:11}
.door-handle-l{left:-5px;top:25%;bottom:25%;width:8px;cursor:ew-resize}
.door-handle-r{right:-5px;top:25%;bottom:25%;width:8px;cursor:ew-resize}
.door-handle-t{top:-5px;left:25%;right:25%;height:8px;cursor:ns-resize}

/* Canvas & View Mode */
#stageBgCanvas{position:absolute;left:0;top:0;pointer-events:none;image-rendering:pixelated;z-index:1}
.board-viewport{overflow-x:auto;overflow-y:hidden;background:#090b10;border-radius:6px;scrollbar-width:thin}
.board-viewport::-webkit-scrollbar{height:10px}
.board-viewport::-webkit-scrollbar-thumb{background:#334155;border-radius:5px}

/* Wave barrier in pano mode */
.arena-wave-barrier{position:absolute;top:0;bottom:0;width:2px;border-left:2px dashed rgba(239,68,68,0.6);pointer-events:none;z-index:3}
.arena-wave-badge{position:absolute;top:4px;left:4px;background:#ef4444;color:#fff;font-size:8.5px;font-weight:800;padding:1px 4px;border-radius:3px;white-space:nowrap}

/* Camera box indicator */
.arena-camera-box{position:absolute;top:0;bottom:0;border:2px solid rgba(16,185,129,0.7);background:rgba(16,185,129,0.04);pointer-events:none;z-index:2}
.arena-camera-tag{position:absolute;top:4px;left:6px;font-size:8.5px;color:#10b981;font-weight:700;letter-spacing:0.5px}

/* Avatar SVGs inside tokens */
.token-avatar svg{display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.5))}
`;

html = html.replace('/* Drag guides */', newCss + '\n/* Drag guides */');

console.log('CSS integrated successfully');

