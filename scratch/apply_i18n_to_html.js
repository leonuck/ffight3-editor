const fs = require('fs');

console.log('--- Applying i18n and Language Toggle to FF3_Script_Editor.html ---');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

// 1. Add CSS for .lang-btn
if (!html.includes('.lang-btn{')) {
  const cssTarget = `button.proj-load:hover{background:#64748b;border-color:#64748b}`;
  const cssRepl = `button.proj-load:hover{background:#64748b;border-color:#64748b}
button.lang-btn{background:var(--chip);border:1px solid var(--line);color:var(--ink);font-weight:700;font-size:12px;padding:5px 10px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .15s}
button.lang-btn:hover{border-color:var(--warn);color:var(--warn);background:var(--panel-sub)}`;
  html = html.replace(cssTarget, cssRepl);
}

// 2. Add #btn_lang to <header>
if (!html.includes('id="btn_lang"')) {
  const headerTarget = `<button id="btn_load_proj" class="proj-load" title="Carregar um projeto salvo anteriormente (.json) para restaurar suas edições">📂 Carregar Projeto (JSON)</button>`;
  const headerRepl = `<button id="btn_load_proj" class="proj-load" title="Carregar um projeto salvo anteriormente (.json) para restaurar suas edições">📂 Carregar Projeto (JSON)</button>
  <button id="btn_lang" class="lang-btn" title="Toggle Language / Alternar Idioma (English / Português)">🌐 EN</button>`;
  html = html.replace(headerTarget, headerRepl);
}

// 3. Add IDs to modal elements for dynamic translation
html = html.replace(
  `<p style="font-size:12px;color:var(--mute);margin:0 0 4px 0;line-height:1.4;">`,
  `<p id="modalDesc" style="font-size:12px;color:var(--mute);margin:0 0 4px 0;line-height:1.4;">`
);
html = html.replace(
  `<label style="display:block;font-size:11.5px;font-weight:700;margin-bottom:5px;color:var(--ink);">Cenário Base para Clonar:</label>`,
  `<label id="modalBaseLabel" style="display:block;font-size:11.5px;font-weight:700;margin-bottom:5px;color:var(--ink);">Base Stage to Clone:</label>`
);
html = html.replace(
  `<span><b>Clonar todos os inimigos originais da fase escolhida</b></span>`,
  `<span id="modalChkEnemiesLabel"><b>Clonar todos os inimigos originais da fase escolhida</b></span>`
);
html = html.replace(
  `<div style="font-size:11px;color:var(--mute);margin-left:22px;line-height:1.4;">\n            Se você substituir o chefe`,
  `<div id="modalEnemiesDesc" style="font-size:11px;color:var(--mute);margin-left:22px;line-height:1.4;">\n            Se você substituir o chefe`
);
html = html.replace(
  `<span><b>Conectar Porta da Cela (Fase 2) nesta sala</b></span>`,
  `<span id="modalChkDoorLabel"><b>Conectar Porta da Cela (Fase 2) nesta sala</b></span>`
);
html = html.replace(
  `<div style="font-size:11px;color:var(--mute);margin-left:22px;margin-top:4px;line-height:1.4;">\n            Ao entrar na cela`,
  `<div id="modalDoorDesc" style="font-size:11px;color:var(--mute);margin-left:22px;margin-top:4px;line-height:1.4;">\n            Ao entrar na cela`
);

fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('Header, CSS and Modal markup updated.');

