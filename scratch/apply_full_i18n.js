const fs = require('fs');

console.log('--- Applying Complete Bilingual (EN/PT) i18n to FF3_Script_Editor.html ---');

let html = fs.readFileSync('FF3_Script_Editor.html', 'utf8');

// 1. Definition of I18N and helper t()
const i18nBlock = `
let CURRENT_LANG = 'en';

const I18N = {
  en: {
    app_title: "FF3 Script & Visual Editor",
    open_rom: "Open ROM…",
    no_rom: "no ROM loaded",
    slots4_label: "4 simultaneous enemies",
    slots4_title: "Unlocks 4th enemy slot in all 3 spawners (5 is impossible: only 4 RAM pages $0700-$0A00 exist)",
    p2vram_label: "use P2 VRAM (+6 units)",
    p2vram_title: "Uses 96 VRAM tiles from Player 2 ($6600-$6BFF, 6 units = Gfx 3) as extra dedicated block, raising limit from 16 to 22 units without visual bugs",
    allgates_label: "enable 2P in 1P",
    allgates_title: "Bypasses Gate check ($1F11) in C0:70D1 so 2-Player exclusive enemies also spawn in 1-Player mode",
    secret_door_label: "active secret door",
    secret_door_title: "Active Secret Door Sensor: Pressing UP at the stage door triggers real-time teleport to Secret Room",
    share_label: "share graphics (glitchy)",
    share_title: "Legacy/experimental mode: shares VRAM among enemies of same type",
    save_rom: "Save ROM",
    download_ips: "Download IPS",
    save_proj: "💾 Save Project (JSON)",
    save_proj_title: "Save all stage changes (enemies, waves, doors, options) to a JSON file to resume later",
    load_proj: "📂 Load Project (JSON)",
    load_proj_title: "Load a previously saved project JSON file to restore your edits",
    lang_btn: "🌐 EN",

    // Sidebar
    enemies_count: "{n} enemies",
    doors_count: "{n} secret door(s)",
    boss_tag: "Stage Boss: {name}",
    btn_create_stage44: "✨ + Create Secret Room (Stage 44)",
    btn_open_stage44: "✨ Open Stage 44 (Secret Room)",
    btn_reclone_stage44: "🔄 Re-clone Base Stage for Stage 44",
    mod_tag: "●",

    // Secret Door Panel
    secret_doors_title: "🚪 Active Secret Doors (Multi-Door):",
    doors_registered: "{tot} door(s) registered in game · {stg} active in this stage",
    no_doors: "No secret doors created. Click \\"+ New Secret Door In This Stage\\" to create one.",
    btn_new_door: "+ New Secret Door In This Stage",
    door_card_label: "Door #{idx}",
    door_origin: "Stage Door:",
    door_dest: "➔ Destination (Secret Room):",
    door_exit: "➔ Clear Exit:",
    btn_del_door: "🗑 Delete",
    door_trigger_area: "On-screen Trigger Area:",
    door_min_x: "X min:",
    door_max_x: "X max:",
    door_max_y: "Y ceil:",
    door_marked_hint: "(✓ Marked on Stage Board below)",
    door_other_stage_hint: "(Door configured for another stage)",
    door_tag_label: "DOOR",

    // Custom Stage 44 Banner
    stage44_banner_title: "Custom Secret Room (Stage 44)",
    stage44_banner_desc: "Scenario and audio cloned from: <b>{tpl}</b>",
    btn_reclone_top: "🔄 Clone Another Stage for Stage 44",

    // Boss Banner
    stage_boss: "👑 STAGE BOSS: {name}",
    boss_present: "Active in Arena (#{idx} · HP: {hp} · X:{x} Y:{y})",
    boss_absent: "Not placed in this area",
    btn_focus_boss: "🎯 Focus on Boss (#{idx})",
    btn_insert_boss: "+ Insert {name} into Stage",

    // Toolbar & Stage Canvas
    wave: "Wave",
    wave_filter: "Wave Filter:",
    wave_all: "All",
    zoom_label: "Zoom:",
    controls_label: "Controls:",
    control_drag: "Drag Enemies",
    control_cam: "Camera Trigger (Dashed Line)",
    btn_add_enemy: "+ Enemy",
    btn_restore_stage: "↺ Restore Original Stage",
    door_visual_btn: "+ New Secret Door (Click & Place)",
    footer_note: "Each row is an enemy spawned by camera trigger. The game supports 4 simultaneous enemies with custom patch. ⚠ = VRAM exceeds {max} units.",

    // Selection Control Bar
    btn_left: "⬅ Left Entrance (-35px)",
    btn_left_title: "Place enemy off-screen at left entrance (-35 px)",
    btn_right: "➡ Right Entrance (290px)",
    btn_right_title: "Place enemy off-screen at right entrance (290 px)",
    btn_center: "🎯 Center (128px)",
    btn_center_title: "Center horizontally on screen (128 px)",
    btn_floor: "↕ Floor (184px)",
    btn_floor_title: "Align vertical position to average floor height (184 px)",
    btn_dup: "⧉ Duplicate",
    btn_dup_title: "Duplicate selected enemy",
    btn_del: "✕ Delete",
    btn_del_title: "Delete selected enemy",

    // Table Columns & Options
    col_num: "#",
    col_gate: "Gate",
    col_trigger: "Trigger",
    col_value: "Value",
    col_sprite: "Sprite",
    col_gfx: "Gfx",
    col_item: "Item",
    col_hp: "HP",
    col_move: "Move",
    col_pos: "Pos",
    col_x: "X",
    col_y: "Y",
    col_z: "Z",
    pos_rel: "cam-relative",
    pos_abs: "absolute",
    cmd_barrier: "Barrier / wave",
    cmd_barrier_hint: "waits for enemies to finish entering",
    cmd_raw: "Command FC (hex)",
    gate_title: "0 = always; 1 = 2-Player only",
    trig_title: "camera trigger position (1/16 px)",
    gfx_title: "VRAM block size",
    x_title: "px = value / 16",
    wall_trap_title: "⚠️ Warning: Y outside floor range (155..215px)! Enemy stuck in wall. Click Floor button to fix.",

    // Modal Clone
    modal_title: "✨ Create New Secret Room (Stage 44)",
    modal_title_reclone: "🔄 Clone Another Stage for Stage 44",
    modal_desc: "Choose any of the <b>43 stages</b> in the game to serve as the visual base (graphics, color palettes, BGM) and combat arena:",
    modal_base_label: "Base Stage to Clone:",
    modal_chk_enemies: "Clone all original enemies from the chosen stage",
    modal_enemies_desc: "If you replace the boss with a standard enemy (Billy, May, Dirk, Andore), the editor <b>automatically aligns floor and coordinates</b> so they never spawn stuck inside the wall!",
    modal_chk_door: "Connect Prison Cell Door (Stage 2) to this room",
    modal_door_desc: "Entering the prison cell door teleports to this new secret stage and, upon victory, leads straight to Boss Dave.",
    modal_btn_cancel: "Cancel",
    modal_btn_confirm: "✨ Confirm and Create",

    // Logs & Alerts
    alert_load_rom_first: "Please load a ROM first before creating Stage 44.",
    alert_stage44_success: "✨ Stage 44 configured successfully!\\n\\nCloned stage: Stage {stg} ({name})\\nTotal enemies: {cnt}",
    alert_restore_stage_confirm: "Discard all enemy changes in this stage and restore original ROM script?",
    alert_del_door_confirm: "Remove this secret door from the game?",
    empty_title: "No Stage Selected",
    empty_desc: "Open a compatible ROM (.sfc or .smc) to list all 42 game stages."
  },
  pt: {
    app_title: "FF3 Script & Visual Editor",
    open_rom: "Abrir ROM…",
    no_rom: "nenhuma ROM carregada",
    slots4_label: "4 inimigos simultâneos",
    slots4_title: "Libera o 4º slot de inimigo nos 3 spawners (5 não é possível: só existem 4 páginas de RAM $0700-$0A00)",
    p2vram_label: "usar VRAM P2 (+6 unid.)",
    p2vram_title: "Usa os 96 tiles de VRAM do Player 2 ($6600-$6BFF, 6 unidades = Gfx 3) como bloco exclusivo extra, elevando o limite de 16 para 22 unidades sem bugs visuais",
    allgates_label: "liberar 2P no 1P",
    allgates_title: "Ignora a checagem de Gate ($1F11) em C0:70D1 para que inimigos de 2P também apareçam no modo 1P",
    secret_door_label: "porta secreta ativa",
    secret_door_title: "Sensor Ativo de Porta Secreta: Pressionar CIMA na porta da fase ativa o teletransporte em tempo real para a Sala Secreta",
    share_label: "compartilhar gráficos (bugado)",
    share_title: "Modo legado/experimental: compartilha VRAM entre inimigos do mesmo tipo",
    save_rom: "Salvar ROM",
    download_ips: "Baixar IPS",
    save_proj: "💾 Salvar Projeto (JSON)",
    save_proj_title: "Salvar todas as alterações (inimigos, ondas, portas e opções) em um arquivo JSON para continuar a edição mais tarde",
    load_proj: "📂 Carregar Projeto (JSON)",
    load_proj_title: "Carregar um projeto salvo anteriormente (.json) para restaurar suas edições",
    lang_btn: "🌐 PT",

    // Sidebar
    enemies_count: "{n} inimigos",
    doors_count: "{n} porta(s) secreta(s)",
    boss_tag: "Chefe da Fase: {name}",
    btn_create_stage44: "✨ + Criar Nova Sala Secreta (Fase 44)",
    btn_open_stage44: "✨ Abrir Fase 44 (Sala Secreta)",
    btn_reclone_stage44: "🔄 Clonar Outro Cenário para Fase 44",
    mod_tag: "●",

    // Secret Door Panel
    secret_doors_title: "🚪 Sistema de Portas Secretas (Multi-Portas):",
    doors_registered: "{tot} porta(s) cadastrada(s) no jogo · {stg} ativa(s) nesta fase",
    no_doors: "Nenhuma porta secreta criada. Clique em \\"+ Nova Porta Secreta Nesta Fase\\" para criar uma.",
    btn_new_door: "+ Nova Porta Secreta Nesta Fase",
    door_card_label: "Porta #{idx}",
    door_origin: "Fase da Porta:",
    door_dest: "➔ Leva para (Sala Secreta):",
    door_exit: "➔ Ao Vencer, Sair em:",
    btn_del_door: "🗑 Excluir",
    door_trigger_area: "Área do gatilho na tela:",
    door_min_x: "X min:",
    door_max_x: "X max:",
    door_max_y: "Y teto:",
    door_marked_hint: "(✓ Demarcada no Tabuleiro abaixo)",
    door_other_stage_hint: "(Porta configurada para outra fase)",
    door_tag_label: "PORTA",

    // Custom Stage 44 Banner
    stage44_banner_title: "Sala Secreta Customizada (Fase 44)",
    stage44_banner_desc: "Cenário e áudio clonados da: <b>{tpl}</b>",
    btn_reclone_top: "🔄 Clonar Outra Fase para a Fase 44",

    // Boss Banner
    stage_boss: "👑 CHEFE DA FASE: {name}",
    boss_present: "Ativo no Cenário (#{idx} · HP: {hp} · X:{x} Y:{y})",
    boss_absent: "Não inserido nesta área",
    btn_focus_boss: "🎯 Focar no Chefe (#{idx})",
    btn_insert_boss: "+ Inserir {name} no Cenário",

    // Toolbar & Stage Canvas
    wave: "Onda",
    wave_filter: "Filtro de Onda:",
    wave_all: "Todas",
    zoom_label: "Zoom:",
    controls_label: "Controles:",
    control_drag: "Arrastar Inimigos",
    control_cam: "Gatilho Câmera (Linha Tracejada)",
    btn_add_enemy: "+ Inimigo",
    btn_restore_stage: "↺ Restaurar Fase Original",
    door_visual_btn: "+ Nova Porta Secreta (Clique & Posicione)",
    footer_note: "Cada linha é um inimigo disparado pelo gatilho da câmera. O jogo suporta 4 simultâneos. ⚠ = VRAM passa de {max} unidades.",

    // Selection Control Bar
    btn_left: "⬅ Entrada Esq (-35px)",
    btn_left_title: "Colocar inimigo na entrada fora da tela à esquerda (-35 px)",
    btn_right: "➡ Entrada Dir (290px)",
    btn_right_title: "Colocar inimigo na entrada fora da tela à direita (290 px)",
    btn_center: "🎯 Centro (128px)",
    btn_center_title: "Centralizar na tela (128 px)",
    btn_floor: "↕ Chão (184px)",
    btn_floor_title: "Alinhar altura ao chão médio (184 px)",
    btn_dup: "⧉ Duplicar",
    btn_dup_title: "Duplicar inimigo selecionado",
    btn_del: "✕ Excluir",
    btn_del_title: "Excluir inimigo selecionado",

    // Table Columns & Options
    col_num: "#",
    col_gate: "Gate",
    col_trigger: "Gatilho",
    col_value: "Valor",
    col_sprite: "Sprite",
    col_gfx: "Gfx",
    col_item: "Item",
    col_hp: "Vida",
    col_move: "Mov",
    col_pos: "Pos",
    col_x: "X",
    col_y: "Y",
    col_z: "Z",
    pos_rel: "rel. câmera",
    pos_abs: "absoluta",
    cmd_barrier: "Barreira / onda",
    cmd_barrier_hint: "espera os inimigos terminarem de entrar",
    cmd_raw: "Comando FC (hex)",
    gate_title: "0 = sempre; 1 = 2P",
    trig_title: "posição câmera (1/16 px)",
    gfx_title: "tamanho bloco VRAM",
    x_title: "px = valor / 16",
    wall_trap_title: "⚠️ Atenção: Y fora do chão (155..215px)! Inimigo preso na parede. Clique no botão Chão para corrigir.",

    // Modal Clone
    modal_title: "✨ Criar Nova Sala Secreta (Fase 44)",
    modal_title_reclone: "🔄 Clonar Outro Cenário para a Fase 44",
    modal_desc: "Escolha qualquer uma das <b>43 fases do jogo</b> para servir como base visual (gráficos, paletas de cores, música de fundo) e combate:",
    modal_base_label: "Cenário Base para Clonar:",
    modal_chk_enemies: "Clonar todos os inimigos originais da fase escolhida",
    modal_enemies_desc: "Se você substituir o chefe por um inimigo comum (Billy, May, Dirk, Andore), o editor <b>ajusta automaticamente o chão e as coordenadas</b> para que ele nunca fique preso na parede!",
    modal_chk_door: "Conectar Porta da Cela (Fase 2) nesta sala",
    modal_door_desc: "Ao entrar na cela da prisão, transporta para esta nova fase secreta e, ao vencê-la, segue direto para o Chefe Dave.",
    modal_btn_cancel: "Cancelar",
    modal_btn_confirm: "✨ Confirmar e Criar",

    // Logs & Alerts
    alert_load_rom_first: "Por favor, carregue uma ROM primeiro antes de criar a Fase 44.",
    alert_stage44_success: "✨ Fase 44 configurada com sucesso!\\n\\nCenário clonado: Fase {stg} ({name})\\nTotal de inimigos: {cnt}",
    alert_restore_stage_confirm: "Descartar alterações nos inimigos desta fase e voltar ao script original da ROM?",
    alert_del_door_confirm: "Deseja excluir esta porta secreta do jogo?",
    empty_title: "Nenhum estágio selecionado",
    empty_desc: "Abra uma ROM compatível (.sfc ou .smc) para listar as 42 fases do jogo."
  }
};

function t(k, p = {}){
  const dict = I18N[CURRENT_LANG] || I18N.en;
  let s = dict[k] || I18N.en[k] || k;
  for(const param in p){
    s = s.replace(new RegExp('\\\\{' + param + '\\\\}', 'g'), p[param]);
  }
  return s;
}

function updateStaticI18n(){
  const btnL = $('#btn_lang');
  if(btnL) btnL.textContent = t('lang_btn');
  const btnO = $('#open');
  if(btnO) btnO.textContent = t('open_rom');
  const fn = $('#fname');
  if(fn && !ROM && !PENDING_PROJECT) fn.textContent = t('no_rom');

  const setChk = (id, lk, tk) => {
    const el = $('#' + id);
    if(el && el.parentElement){
      el.parentElement.title = t(tk);
      const txtNode = el.nextSibling;
      if(txtNode) txtNode.textContent = ' ' + t(lk);
    }
  };
  setChk('p_slots', 'slots4_label', 'slots4_title');
  setChk('p_p2vram', 'p2vram_label', 'p2vram_title');
  setChk('p_allgates', 'allgates_label', 'allgates_title');
  setChk('p_secret_door', 'secret_door_label', 'secret_door_title');
  setChk('p_share', 'share_label', 'share_title');

  const btnS = $('#save'); if(btnS) btnS.textContent = t('save_rom');
  const btnI = $('#ips'); if(btnI) btnI.textContent = t('download_ips');
  const btnSP = $('#btn_save_proj');
  if(btnSP){
    btnSP.textContent = t('save_proj');
    btnSP.title = t('save_proj_title');
  }
  const btnLP = $('#btn_load_proj');
  if(btnLP){
    btnLP.textContent = t('load_proj');
    btnLP.title = t('load_proj_title');
  }

  // Modal texts
  const mTitle = $('#modalTitle'); if(mTitle) mTitle.textContent = t('modal_title');
  const mDesc = $('#modalDesc'); if(mDesc) mDesc.innerHTML = t('modal_desc');
  const mBase = $('#modalBaseLabel'); if(mBase) mBase.textContent = t('modal_base_label');
  const mChkE = $('#modalChkEnemiesLabel'); if(mChkE) mChkE.innerHTML = '<b>' + t('modal_chk_enemies') + '</b>';
  const mDescE = $('#modalEnemiesDesc'); if(mDescE) mDescE.innerHTML = t('modal_enemies_desc');
  const mChkD = $('#modalChkDoorLabel'); if(mChkD) mChkD.innerHTML = '<b>' + t('modal_chk_door') + '</b>';
  const mDescD = $('#modalDoorDesc'); if(mDescD) mDescD.textContent = t('modal_door_desc');
  const mCancel = $('#btnModalCancel'); if(mCancel) mCancel.textContent = t('modal_btn_cancel');
  const mConf = $('#btnModalConfirm'); if(mConf) mConf.textContent = t('modal_btn_confirm');
}
`;

// Insert i18nBlock before STAGE_NAMES
html = html.replace('// Configuração Oficial da Capcom (Debug All Area Map)', i18nBlock + '\n// Configuração Oficial da Capcom (Debug All Area Map)');

// Replace STAGE_NAMES array with bilingual version
const oldStageNamesStart = 'const STAGE_NAMES = [';
const oldStageNamesEnd = 'let SECRET_CONFIG={ enabled: true };';
const stageNamesBlock = html.substring(html.indexOf(oldStageNamesStart), html.indexOf(oldStageNamesEnd));

const newStageNamesBlock = `const STAGE_NAMES = [
  { id: 1, name: "ROUND 1 · 01 Police Station", en: "ROUND 1 · 01 Police Station", pt: "ROUND 1 · 01 Police Station (Delegacia)" },
  { id: 2, name: "ROUND 1 · 02 Prison (Jail Cells)", en: "ROUND 1 · 02 Prison (Jail Cells)", pt: "ROUND 1 · 02 Prison (Celas da Prisão)" },
  { id: 3, name: "ROUND 1 · 03 Gas Station <Boss Dave>", en: "ROUND 1 · 03 Gas Station <Boss Dave>", pt: "ROUND 1 · 03 Gas Station <Chefe Dave>" },
  { id: 4, name: "ROUND 2 · 04 Main Street (Bar Outside)", en: "ROUND 2 · 04 Main Street (Bar Outside)", pt: "ROUND 2 · 04 Main Street (Rua do Bar)" },
  { id: 5, name: "ROUND 2 · 05 Back Street (Warehouse)", en: "ROUND 2 · 05 Back Street (Warehouse)", pt: "ROUND 2 · 05 Back Street (Armazém / Beco)" },
  { id: 6, name: "ROUND 2 · 06 Back Alley <Boss Callman A - Rooftops>", en: "ROUND 2 · 06 Back Alley <Boss Callman A - Rooftops>", pt: "ROUND 2 · 06 Back Alley <Chefe Callman A - Telhados>" },
  { id: 7, name: "ROUND 2 · 07 Club Capcom <Boss Callman B - Secret Bar>", en: "ROUND 2 · 07 Club Capcom <Boss Callman B - Secret Bar>", pt: "ROUND 2 · 07 Club Capcom <Chefe Callman B - Bar Secreto>" },
  { id: 8, name: "ROUND 3 · 08 Bus Stop Street", en: "ROUND 3 · 08 Bus Stop Street", pt: "ROUND 3 · 08 Bus Stop Street (Ponto de Ônibus na Rua)" },
  { id: 9, name: "ROUND 3 · 09 In The Bus", en: "ROUND 3 · 09 In The Bus", pt: "ROUND 3 · 09 In The Bus (Dentro do Ônibus)" },
  { id: 10, name: "ROUND 4A · 10 Bus Clash (Dock Crash)", en: "ROUND 4A · 10 Bus Clash (Dock Crash)", pt: "ROUND 4A · 10 Bus Clash (Batida do Ônibus / Navio)" },
  { id: 11, name: "ROUND 3 · 11 Scrap Heap (Junkyard)", en: "ROUND 3 · 11 Scrap Heap (Junkyard)", pt: "ROUND 3 · 11 Scrap Heap (Depósito de Sucata / Ferro Velho)" },
  { id: 12, name: "ROUND 3 · 12 On The Bus <Boss Caine>", en: "ROUND 3 · 12 On The Bus <Boss Caine>", pt: "ROUND 3 · 12 On The Bus <Chefe Caine / Kain>" },
  { id: 13, name: "ROUND 4A · 13 Iron Bridge", en: "ROUND 4A · 13 Iron Bridge", pt: "ROUND 4A · 13 Iron Bridge (Ponte de Ferro do Navio)" },
  { id: 14, name: "ROUND 4A · 14 Pier (Harbor)", en: "ROUND 4A · 14 Pier (Harbor)", pt: "ROUND 4A · 14 Pier (Cais do Porto)" },
  { id: 15, name: "ROUND 4A · 15 Deck", en: "ROUND 4A · 15 Deck", pt: "ROUND 4A · 15 Deck (Convés do Navio)" },
  { id: 16, name: "ROUND 4A · 16 Store House (Cargo Hold)", en: "ROUND 4A · 16 Store House (Cargo Hold)", pt: "ROUND 4A · 16 Store House (Porão de Carga do Navio)" },
  { id: 17, name: "ROUND 4A · 17 Front Deck <Boss Drake>", en: "ROUND 4A · 17 Front Deck <Boss Drake>", pt: "ROUND 4A · 17 Front Deck <Chefe Drake / Dreik>" },
  { id: 18, name: "BONUS 1 · 18 Bonus-A (Bulldozer)", en: "BONUS 1 · 18 Bonus-A (Bulldozer)", pt: "BÔNUS 1 · 18 Bonas-A (Destruir o Trator / Bulldozer)" },
  { id: 19, name: "ROUND 4B · 19 Chinatown", en: "ROUND 4B · 19 Chinatown", pt: "ROUND 4B · 19 Chinatown (Bairro Chinês)" },
  { id: 20, name: "ROUND 4B · 20 Billboard (Neon Signs)", en: "ROUND 4B · 20 Billboard (Neon Signs)", pt: "ROUND 4B · 20 Billboard (Painéis / Outdoors)" },
  { id: 21, name: "ROUND 4B · 21 Restaurant (Dining Hall)", en: "ROUND 4B · 21 Restaurant (Dining Hall)", pt: "ROUND 4B · 21 Restaurant (Restaurante Chinês)" },
  { id: 22, name: "ROUND 4B · 22 Kitchen <Boss Wong>", en: "ROUND 4B · 22 Kitchen <Boss Wong>", pt: "ROUND 4B · 22 Kitchen <Chefe Wong / Weng>" },
  { id: 23, name: "ROUND 5 · 23 Underground Passage", en: "ROUND 5 · 23 Underground Passage", pt: "ROUND 5 · 23 Underground Passage (Passagem Subterrânea)" },
  { id: 24, name: "ROUND 5 · 24 Chinatown (Alt Route)", en: "ROUND 5 · 24 Chinatown (Alt Route)", pt: "ROUND 5 · 24 Chinatown (Rota Alternativa)" },
  { id: 25, name: "ROUND 5 · 25 Billboard (Alt Route)", en: "ROUND 5 · 25 Billboard (Alt Route)", pt: "ROUND 5 · 25 Billboard (Rota Alternativa)" },
  { id: 26, name: "ROUND 5 · 26 Restaurant (Alt Route)", en: "ROUND 5 · 26 Restaurant (Alt Route)", pt: "ROUND 5 · 26 Restaurant (Rota Alternativa)" },
  { id: 27, name: "ROUND 5 · 27 Kitchen <Sub-boss Wong>", en: "ROUND 5 · 27 Kitchen <Sub-boss Wong>", pt: "ROUND 5 · 27 Kitchen <Subchefe Wong / Weng>" },
  { id: 28, name: "ROUND 5 · 28 Enter The Factory", en: "ROUND 5 · 28 Enter The Factory", pt: "ROUND 5 · 28 Enter The Factry (Entrada da Fábrica)" },
  { id: 29, name: "ROUND 5 · 29 Alarm (Control Room)", en: "ROUND 5 · 29 Alarm (Control Room)", pt: "ROUND 5 · 29 Alarm (Setor de Alarme)" },
  { id: 30, name: "ROUND 5 · 30 Research Room-1 (Secret Lab 1)", en: "ROUND 5 · 30 Research Room-1 (Secret Lab 1)", pt: "ROUND 5 · 30 Research Room-1 (Laboratório Secreto 1)" },
  { id: 31, name: "ROUND 5 · 31 Research Room-2 (Secret Lab 2)", en: "ROUND 5 · 31 Research Room-2 (Secret Lab 2)", pt: "ROUND 5 · 31 Research Room-2 (Laboratório Secreto 2)" },
  { id: 32, name: "ROUND 5 · 32 Computer Room (Shortcut)", en: "ROUND 5 · 32 Computer Room (Shortcut)", pt: "ROUND 5 · 32 Computer Room (Sala de Computadores - Atalho Final!)" },
  { id: 33, name: "ROUND 5 · 33 Hall-way (Industrial Corridor)", en: "ROUND 5 · 33 Hall-way (Industrial Corridor)", pt: "ROUND 5 · 33 Hall-way (Corredor Industrial)" },
  { id: 34, name: "ROUND 5 · 34 Crane <Boss Stray>", en: "ROUND 5 · 34 Crane <Boss Stray>", pt: "ROUND 5 · 34 Crane <Chefe Stray>" },
  { id: 35, name: "BONUS 2 · 35 Bonus-B (Barrels)", en: "BONUS 2 · 35 Bonus-B (Barrels)", pt: "BÔNUS 2 · 35 Bonas-B (Destruir Barris / Sala Bônus)" },
  { id: 36, name: "ROUND 6 · 36 Street Of Buildings", en: "ROUND 6 · 36 Street Of Buildings", pt: "ROUND 6 · 36 Street Of Buildings (Rua dos Edifícios / Skull Cross)" },
  { id: 37, name: "ROUND 6 · 37 Corridor (HQ Security)", en: "ROUND 6 · 37 Corridor (HQ Security)", pt: "ROUND 6 · 37 Corridor (Corredor do Quartel General)" },
  { id: 38, name: "ROUND 6 · 38 Other Room-1 (HQ Secret Room 1)", en: "ROUND 6 · 38 Other Room-1 (HQ Secret Room 1)", pt: "ROUND 6 · 38 Other Room-1 (Sala Secreta 1)" },
  { id: 39, name: "ROUND 6 · 39 Other Room-2 (HQ Secret Room 2)", en: "ROUND 6 · 39 Other Room-2 (HQ Secret Room 2)", pt: "ROUND 6 · 39 Other Room-2 (Sala Secreta 2)" },
  { id: 40, name: "ROUND 6 · 40 Elevator (Tower Lift)", en: "ROUND 6 · 40 Elevator (Tower Lift)", pt: "ROUND 6 · 40 Elevator (Elevador da Torre)" },
  { id: 41, name: "ROUND 6 · 41 President Room (Executive Office)", en: "ROUND 6 · 41 President Room (Executive Office)", pt: "ROUND 6 · 41 President Room (Gabinete Presidencial)" },
  { id: 42, name: "ROUND 6 · 42 Rooftop <Final Boss Black>", en: "ROUND 6 · 42 Rooftop <Final Boss Black>", pt: "ROUND 6 · 42 Rooftop <Chefe Final Black>" },
  { id: 43, name: "TRAINING · TR Training Room", en: "TRAINING · TR Training Room", pt: "MODO DE TREINO · TR Training Room (Sala de Treino)" },
  { id: 44, name: "ROUND 7 · NEW SECRET ROOM (Stage 44)", en: "ROUND 7 · NEW SECRET ROOM (Stage 44)", pt: "ROUND 7 · SALA SECRETA NOVA (Fase 44)" }
];
\n`;

html = html.replace(stageNamesBlock, newStageNamesBlock);

// Replace MODES and areaLabel
const oldModes = `const MODES={0:'Câmera X ≥ valor',1:'Câmera X ≤ valor',2:'Câmera Y ≤ valor',3:'Câmera Y ≥ valor',8:'Imediato',9:'Evento = valor'};
function areaLabel(a){const s=STAGE_NAMES.find(x=>x.id===a);return s?s.name:'Fase '+a;}`;

const newModes = `const MODES = {
  get 0(){ return CURRENT_LANG === 'pt' ? 'Câmera X ≥ valor' : 'Camera X ≥ value'; },
  get 1(){ return CURRENT_LANG === 'pt' ? 'Câmera X ≤ valor' : 'Camera X ≤ value'; },
  get 2(){ return CURRENT_LANG === 'pt' ? 'Câmera Y ≤ valor' : 'Camera Y ≤ value'; },
  get 3(){ return CURRENT_LANG === 'pt' ? 'Câmera Y ≥ valor' : 'Camera Y ≥ value'; },
  get 8(){ return CURRENT_LANG === 'pt' ? 'Imediato' : 'Immediate'; },
  get 9(){ return CURRENT_LANG === 'pt' ? 'Evento = valor' : 'Event = value'; }
};
function areaLabel(a){
  const s = STAGE_NAMES.find(x => x.id === a);
  if(!s) return (CURRENT_LANG === 'pt' ? 'Fase ' : 'Stage ') + a;
  return s[CURRENT_LANG] || s.name || s.en;
}`;

html = html.replace(oldModes, newModes);

// Update sName
html = html.replace(
  `function sName(t){return SPRITES[t]&&SPRITES[t]!=='CRASH'?SPRITES[t]:'tipo '+t.toString(16).toUpperCase().padStart(2,'0');}`,
  `function sName(t){return SPRITES[t]&&SPRITES[t]!=='CRASH'?SPRITES[t]:(CURRENT_LANG==='pt'?'tipo ':'type ')+t.toString(16).toUpperCase().padStart(2,'0');}`
);

// Update renderSide
html = html.replace(
  `const bossBadge = bossMeta ? \`<span title="Chefe da Fase: \${bossMeta.name}" style="color:#f59e0b;font-size:11px;margin-left:3px;">👑</span>\` : '';`,
  `const bossBadge = bossMeta ? \`<span title="\${t('boss_tag', {name: bossMeta.name})}" style="color:#f59e0b;font-size:11px;margin-left:3px;">👑</span>\` : '';`
);
html = html.replace(
  `const doorBadge = doorCount > 0 ? \`<span title="\${doorCount} porta(s) secreta(s)">🚪\${doorCount>1?doorCount:''}</span>\` : '';`,
  `const doorBadge = doorCount > 0 ? \`<span title="\${t('doors_count', {n: doorCount})}">🚪\${doorCount>1?doorCount:''}</span>\` : '';`
);
html = html.replace(
  `<small>\${r.length} inimigos · \${names}</small>`,
  `<small>\${t('enemies_count', {n: r.length})} · \${names}</small>`
);
html = html.replace(
  `\${hasStage44 ? '✨ Abrir Fase 44 (Sala Secreta)' : '✨ + Criar Nova Sala Secreta (Fase 44)'}`,
  `\${hasStage44 ? t('btn_open_stage44') : t('btn_create_stage44')}`
);
html = html.replace(
  `🔄 Clonar Outro Cenário para Fase 44`,
  `\${t('btn_reclone_stage44')}`
);

// Update openCreateStageModal
html = html.replace(
  `alert("Por favor, carregue uma ROM primeiro antes de criar a Fase 44.");`,
  `alert(t('alert_load_rom_first'));`
);
html = html.replace(
  `titleEl.textContent = isReclone ? "🔄 Clonar Outro Cenário para a Fase 44" : "✨ Criar Nova Sala Secreta (Fase 44)";`,
  `titleEl.textContent = isReclone ? t('modal_title_reclone') : t('modal_title');`
);
html = html.replace(
  `alert("✨ Fase 44 configurada com sucesso!\\n\\nCenário clonado: Fase " + tplStageId + " (" + areaLabel(tplStageId) + ")\\nTotal de Inimigos: " + s44.items.length);`,
  `alert(t('alert_stage44_success', {stg: tplStageId, name: areaLabel(tplStageId), cnt: s44.items.length}));`
);

// Update waves
html = html.replace(
  `const waves=[{id:0,name:'Onda 1',items:[]}];`,
  `const waves=[{id:0,name:t('wave')+' 1',items:[]}];`
);
html = html.replace(
  `waves.push({id:w,name:\`Onda \${w+1}\`,items:[]});`,
  `waves.push({id:w,name:t('wave')+' '+(w+1),items:[]});`
);

// Update Secret Door Panel
html = html.replace(
  `<span class="pill" style="background:\${isCur?'var(--warn)':'var(--chip)'};color:\${isCur?'#000':'var(--ink)'};font-weight:bold;">Porta #\${idx+1}</span>
          <span>Fase da Porta:</span>`,
  `<span class="pill" style="background:\${isCur?'var(--warn)':'var(--chip)'};color:\${isCur?'#000':'var(--ink)'};font-weight:bold;">\${t('door_card_label', {idx: idx+1})}</span>
          <span>\${t('door_origin')}</span>`
);
html = html.replace(
  `<span>➔ Leva para (Sala Secreta):</span>`,
  `<span>\${t('door_dest')}</span>`
);
html = html.replace(
  `<span>➔ Ao Vencer, Sair em:</span>`,
  `<span>\${t('door_exit')}</span>`
);
html = html.replace(
  `<button class="btn-del-door" data-idx="\${idx}" title="Excluir esta porta">🗑 Excluir</button>`,
  `<button class="btn-del-door" data-idx="\${idx}" title="\${t('btn_del_door')}">\${t('btn_del_door')}</button>`
);
html = html.replace(
  `<span>Área do gatilho na tela:</span>
          <span>X min: <input type="number" class="inp_door_min" data-idx="\${idx}" value="\${d.minX}" style="width:65px"> px</span>
          <span>X max: <input type="number" class="inp_door_max" data-idx="\${idx}" value="\${d.maxX}" style="width:65px"> px</span>
          <span>Y teto: <input type="number" class="inp_door_y" data-idx="\${idx}" value="\${d.maxY}" style="width:60px"> px</span>
          <span class="hint" style="color:\${isCur?'var(--ok)':'inherit'}">\${isCur?'(✓ Demarcada no Tabuleiro abaixo)':'(Porta configurada para outra fase)'}</span>`,
  `<span>\${t('door_trigger_area')}</span>
          <span>\${t('door_min_x')} <input type="number" class="inp_door_min" data-idx="\${idx}" value="\${d.minX}" style="width:65px"> px</span>
          <span>\${t('door_max_x')} <input type="number" class="inp_door_max" data-idx="\${idx}" value="\${d.maxX}" style="width:65px"> px</span>
          <span>\${t('door_max_y')} <input type="number" class="inp_door_y" data-idx="\${idx}" value="\${d.maxY}" style="width:60px"> px</span>
          <span class="hint" style="color:\${isCur?'var(--ok)':'inherit'}">\${isCur?t('door_marked_hint'):t('door_other_stage_hint')}</span>`
);
html = html.replace(
  `<b>🚪 Sistema de Portas Secretas (Multi-Portas):</b>
          <span class="hint">\${SECRET_DOORS.length} porta(s) cadastrada(s) no jogo · \${stageDoors.length} ativa(s) nesta fase</span>
        </div>
        <button id="btn_add_door" class="sec" style="font-size:11px;padding:3px 10px;">+ Nova Porta Secreta Nesta Fase</button>
      </div>
      \${SECRET_DOORS.length > 0 ? doorCards : '<div style="color:var(--mute);padding:6px 0;">Nenhuma porta secreta criada. Clique em "+ Nova Porta Secreta Nesta Fase" para criar uma.</div>'}`,
  `<b>\${t('secret_doors_title')}</b>
          <span class="hint">\${t('doors_registered', {tot: SECRET_DOORS.length, stg: stageDoors.length})}</span>
        </div>
        <button id="btn_add_door" class="sec" style="font-size:11px;padding:3px 10px;">\${t('btn_new_door')}</button>
      </div>
      \${SECRET_DOORS.length > 0 ? doorCards : '<div style="color:var(--mute);padding:6px 0;">'+t('no_doors')+'</div>'}`
);

// Stage 44 banner
html = html.replace(
  `<b style="color:var(--ok)">Sala Secreta Customizada (Fase 44)</b>
            <span class="hint" style="margin-left:8px;">Cenário e áudio clonados da: <b>\${tplName}</b></span>
          </div>
        </div>
        <button id="btnRecloneTop" class="sec" style="font-size:11px;padding:4px 10px;">🔄 Clonar Outra Fase para a Fase 44</button>`,
  `<b style="color:var(--ok)">\${t('stage44_banner_title')}</b>
            <span class="hint" style="margin-left:8px;">\${t('stage44_banner_desc', {tpl: tplName})}</span>
          </div>
        </div>
        <button id="btnRecloneTop" class="sec" style="font-size:11px;padding:4px 10px;">\${t('btn_reclone_top')}</button>`
);

// Boss banner
html = html.replace(
  `<b style="color:#f59e0b;font-size:12px;">👑 CHEFE DA FASE: \${bossMeta.name}</b>
          \${bossPresent ? \`<span class="pill" style="background:#f59e0b;color:#000;font-weight:bold;font-size:10px;">Ativo no Cenário (#\${bossIdx+1} · HP: \${bossHp} · X:\${bossX} Y:\${bossY})</span>\` : \`<span class="pill" style="background:#64748b;color:#fff;font-size:10px;">Não inserido nesta área</span>\`}
        </div>
        <span class="hint" style="color:#94a3b8;font-size:11px;">\${bossMeta.desc}</span>
      </div>
      <div style="margin-left:auto;display:flex;gap:6px;">
        \${bossPresent ? 
          \`<button id="btnFocusBoss" class="sec" style="font-size:11px;padding:3px 10px;" data-boss-idx="\${bossIdx}">🎯 Focar no Chefe (#\${bossIdx+1})</button>\` :
          \`<button id="btnAddBoss" class="sec" style="font-size:11px;padding:3px 10px;border-color:#f59e0b;color:#f59e0b;">+ Inserir \${bossMeta.name} no Cenário</button>\`
        }`,
  `<b style="color:#f59e0b;font-size:12px;">\${t('stage_boss', {name: bossMeta.name})}</b>
          \${bossPresent ? \`<span class="pill" style="background:#f59e0b;color:#000;font-weight:bold;font-size:10px;">\${t('boss_present', {idx: bossIdx+1, hp: bossHp, x: bossX, y: bossY})}</span>\` : \`<span class="pill" style="background:#64748b;color:#fff;font-size:10px;">\${t('boss_absent')}</span>\`}
        </div>
        <span class="hint" style="color:#94a3b8;font-size:11px;">\${bossMeta.desc}</span>
      </div>
      <div style="margin-left:auto;display:flex;gap:6px;">
        \${bossPresent ? 
          \`<button id="btnFocusBoss" class="sec" style="font-size:11px;padding:3px 10px;" data-boss-idx="\${bossIdx}">\${t('btn_focus_boss', {idx: bossIdx+1})}</button>\` :
          \`<button id="btnAddBoss" class="sec" style="font-size:11px;padding:3px 10px;border-color:#f59e0b;color:#f59e0b;">\${t('btn_insert_boss', {name: bossMeta.name})}</button>\`
        }`
);

// Toolbar
html = html.replace(
  `const waveTabs = [\`<span class="pill wave-pill \${ACTIVE_WAVE==='all'?'active':''}" data-w="all">Todas</span>\`];`,
  `const waveTabs = [\`<span class="pill wave-pill \${ACTIVE_WAVE==='all'?'active':''}" data-w="all">\${t('wave_all')}</span>\`];`
);
html = html.replace(
  `<button id="addE" class="sec">+ Inimigo</button>
      <button id="rstS" class="sec" style="color:var(--acc);" title="Restaura os dados originais desta fase salvos na ROM">Restaurar Fase Original</button>`,
  `<button id="addE" class="sec">\${t('btn_add_enemy')}</button>
      <button id="rstS" class="sec" style="color:var(--acc);" title="Restore original ROM script for this stage">\${t('btn_restore_stage')}</button>`
);
html = html.replace(
  `<span><b>Filtro de Onda:</b></span>`,
  `<span><b>\${t('wave_filter')}</b></span>`
);
html = html.replace(
  `<span><b>Zoom:</b></span>`,
  `<span><b>\${t('zoom_label')}</b></span>`
);
html = html.replace(
  `<span><b>Controles:</b></span>
        <span class="hint">Arrastar Inimigos · Gatilho Câmera (Linha Tracejada)</span>`,
  `<span><b>\${t('controls_label')}</b></span>
        <span class="hint">\${t('control_drag')} · \${t('control_cam')}</span>`
);

// Door zone tag
html = html.replace(
  `<div class="door-tag">🚪 PORTA #\${di+1} (X:\${d.minX}..\${d.maxX}) ➔ \${destName}</div>`,
  `<div class="door-tag">🚪 \${t('door_tag_label')} #\${di+1} (X:\${d.minX}..\${d.maxX}) ➔ \${destName}</div>`
);
html = html.replace(
  `<button id="btnAddDoorVisual" class="sec" style="padding:2px 8px;font-size:11px;" title="Cria uma nova porta na tela e posiciona onde você clicar">+ Nova Porta Secreta (Clique & Posicione)</button>`,
  `<button id="btnAddDoorVisual" class="sec" style="padding:2px 8px;font-size:11px;" title="Add new secret door trigger on this stage">\${t('door_visual_btn')}</button>`
);

// Selection buttons
html = html.replace(
  `<button id="b_left" title="Colocar inimigo na entrada fora da tela à esquerda (-35 px)">⬅ Entrada Esq (-35px)</button>
      <button id="b_right" title="Colocar inimigo na entrada fora da tela à direita (290 px)">➡ Entrada Dir (290px)</button>
      <button id="b_center" title="Centralizar na tela (128 px)">🎯 Centro (128px)</button>
      <button id="b_floor" title="Alinhar altura ao chão médio (184 px)">↕ Chão (184px)</button>
      <button id="b_dup" title="Duplicar inimigo selecionado">⧉ Duplicar</button>
      <button id="b_del" title="Excluir inimigo selecionado" style="color:var(--acc)">✕ Excluir</button>`,
  `<button id="b_left" title="\${t('btn_left_title')}">\${t('btn_left')}</button>
      <button id="b_right" title="\${t('btn_right_title')}">\${t('btn_right')}</button>
      <button id="b_center" title="\${t('btn_center_title')}">\${t('btn_center')}</button>
      <button id="b_floor" title="\${t('btn_floor_title')}">\${t('btn_floor')}</button>
      <button id="b_dup" title="\${t('btn_dup_title')}">\${t('btn_dup')}</button>
      <button id="b_del" title="\${t('btn_del_title')}" style="color:var(--acc)">\${t('btn_del')}</button>`
);

// Table Note and Headers
html = html.replace(
  `<p class="note">Cada linha é um inimigo disparado pelo gatilho da câmera. O jogo suporta 4 simultâneos. ⚠ = VRAM passa de \${maxV} unidades.</p>
  <div style="overflow:auto"><table><tr><th>#</th><th>Gate</th><th>Gatilho</th><th>Valor</th><th>Sprite</th><th>Gfx</th><th>Item</th><th>Vida</th><th>Mov</th><th>Pos</th><th>X</th><th>Y</th><th>Z</th><th></th></tr>\`;`,
  `<p class="note">\${t('footer_note', {max: maxV})}</p>
  <div style="overflow:auto"><table><tr><th>\${t('col_num')}</th><th>\${t('col_gate')}</th><th>\${t('col_trigger')}</th><th>\${t('col_value')}</th><th>\${t('col_sprite')}</th><th>\${t('col_gfx')}</th><th>\${t('col_item')}</th><th>\${t('col_hp')}</th><th>\${t('col_move')}</th><th>\${t('col_pos')}</th><th>\${t('col_x')}</th><th>\${t('col_y')}</th><th>\${t('col_z')}</th><th></th></tr>\`;`
);

// Table row content
html = html.replace(
  `Barreira / onda <input class="h" data-i="\${i}" data-f="w" value="\${h2(b[1])}"> <span class="hint">espera os inimigos terminarem de entrar</span>`,
  `\${t('cmd_barrier')} <input class="h" data-i="\${i}" data-f="w" value="\${h2(b[1])}"> <span class="hint">\${t('cmd_barrier_hint')}</span>`
);
html = html.replace(
  `Comando FC (hex) <input style="width:230px" data-i="\${i}" data-f="raw" value="\${hex(Uint8Array.from(b))}">`,
  `\${t('cmd_raw')} <input style="width:230px" data-i="\${i}" data-f="raw" value="\${hex(Uint8Array.from(b))}">`
);
html = html.replace(
  `<td><select data-i="\${i}" data-f="pos"><option value="0" \${b[10]?'':'selected'}>rel. câmera</option><option value="1" \${b[10]?'selected':''}>absoluta</option></select></td>`,
  `<td><select data-i="\${i}" data-f="pos"><option value="0" \${b[10]?'':'selected'}>\${t('pos_rel')}</option><option value="1" \${b[10]?'selected':''}>\${t('pos_abs')}</option></select></td>`
);

// Alerts & Confirmations in actions
html = html.replace(
  `if(confirm('Descartar alterações nos inimigos desta fase e voltar ao script original da ROM?')){`,
  `if(confirm(t('alert_restore_stage_confirm'))){`
);
html = html.replace(
  `if(confirm('Deseja excluir esta porta secreta do jogo?')){`,
  `if(confirm(t('alert_del_door_confirm'))){`
);

// Language toggle event listener at startup
const langStartup = `
$('#btn_lang').onclick = () => {
  CURRENT_LANG = (CURRENT_LANG === 'en') ? 'pt' : 'en';
  try { localStorage.setItem('ff3_editor_lang', CURRENT_LANG); } catch(e){}
  updateStaticI18n();
  render();
};

try {
  const savedLang = localStorage.getItem('ff3_editor_lang');
  if(savedLang === 'pt' || savedLang === 'en') CURRENT_LANG = savedLang;
} catch(e){}
updateStaticI18n();
`;

html = html.replace(
  `['p_slots','p_p2vram','p_allgates','p_secret_door','p_share'].forEach(id=>$('#'+id).onchange=()=>{`,
  langStartup + '\n' + `['p_slots','p_p2vram','p_allgates','p_secret_door','p_share'].forEach(id=>$('#'+id).onchange=()=>{`
);

fs.writeFileSync('FF3_Script_Editor.html', html, 'utf8');
console.log('FF3_Script_Editor.html updated with complete bilingual i18n support.');

