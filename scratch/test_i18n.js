const fs = require('fs');

console.log('--- Testing i18n Dictionary and Helpers ---');

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
    btn_create_stage44: "+ Create Secret Room (Stage 44)",
    btn_reclone_stage44: "🔄 Re-clone Base Stage",
    mod_tag: "(mod)",

    // Secret Door Panel
    secret_doors_title: "🚪 Active Secret Doors (Multi-Door)",
    doors_registered: "door(s) registered in game",
    doors_active_stage: "active in this stage",
    no_doors: "No secret doors created. Click \"+ New Secret Door in This Stage\" to create one.",
    btn_new_door: "+ New Secret Door in This Stage",
    door_origin: "Origin:",
    door_dest: "Destination:",
    door_exit: "Clear Exit:",
    btn_del_door: "🗑 Delete",
    door_min_x: "X min:",
    door_max_x: "X max:",
    door_max_y: "Y ceil:",
    door_tag_label: "DOOR",

    // Boss Banner
    stage_boss: "Stage Boss:",
    boss_present: "👑 Boss Present in Stage Arena (X: {x}px, Y: {y}px)",
    btn_focus_boss: "🎯 Focus on Boss",
    boss_absent: "⚠️ Boss not placed in this stage's arena",
    btn_insert_boss: "+ Insert Boss into Stage",

    // Toolbar & Stage Canvas
    wave_filter: "Wave Filter:",
    wave_all: "All",
    zoom_label: "Zoom:",
    controls_label: "Controls:",
    control_drag: "Drag Enemies",
    control_cam: "Camera Trigger (Dashed Line)",
    btn_add_enemy: "Add Enemy",
    btn_restore_stage: "Restore Original Stage",
    door_visual_btn: "+ New Secret Door (Click & Place)",
    footer_note: "Each row is an enemy spawned by camera trigger. The game supports 4 simultaneous enemies with custom patch.",

    // Table Columns
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
    col_actions: "Actions",

    // Table Actions
    btn_dup: "Duplicate",
    btn_rem: "Remove",
    btn_rst: "Restore",

    // Modal Clone
    modal_title: "✨ Create New Secret Room (Stage 44)",
    modal_desc: "Choose any of the <b>43 stages</b> in the game to serve as the visual base (graphics, color palettes, BGM) and combat arena:",
    modal_base_label: "Base Stage to Clone:",
    modal_chk_enemies: "Clone all original enemies from the chosen stage",
    modal_enemies_desc: "If you replace the boss with a standard enemy (Billy, May, Dirk, Andore), the editor <b>automatically aligns floor and coordinates</b> so they never spawn stuck inside the wall!",
    modal_chk_door: "Connect Prison Cell Door (Stage 2) to this room",
    modal_door_desc: "Entering the prison cell door teleports to this new secret stage and, upon victory, leads straight to Boss Dave.",
    modal_btn_cancel: "Cancel",
    modal_btn_confirm: "✨ Confirm and Create"
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
    btn_create_stage44: "+ Criar Sala Secreta (Fase 44)",
    btn_reclone_stage44: "🔄 Reclonar Cenário Base",
    mod_tag: "(mod)",

    // Secret Door Panel
    secret_doors_title: "🚪 Portas Secretas Ativas (Multi-Portas)",
    doors_registered: "porta(s) cadastrada(s) no jogo",
    doors_active_stage: "ativa(s) nesta fase",
    no_doors: "Nenhuma porta secreta criada. Clique em \"+ Nova Porta Secreta Nesta Fase\" para criar uma.",
    btn_new_door: "+ Nova Porta Secreta Nesta Fase",
    door_origin: "Origem:",
    door_dest: "Destino:",
    door_exit: "Retorno ao vencer:",
    btn_del_door: "🗑 Excluir",
    door_min_x: "X min:",
    door_max_x: "X max:",
    door_max_y: "Y teto:",
    door_tag_label: "PORTA",

    // Boss Banner
    stage_boss: "Chefe da Fase:",
    boss_present: "👑 Chefe Presente no Cenário (X: {x}px, Y: {y}px)",
    btn_focus_boss: "🎯 Focar no Chefe",
    boss_absent: "⚠️ Chefe não está no cenário desta fase",
    btn_insert_boss: "+ Inserir Chefe no Cenário",

    // Toolbar & Stage Canvas
    wave_filter: "Filtro de Onda:",
    wave_all: "Todos",
    zoom_label: "Zoom:",
    controls_label: "Controles:",
    control_drag: "Arrastar Inimigos",
    control_cam: "Gatilho Câmera (Linha Tracejada)",
    btn_add_enemy: "Adicionar Inimigo",
    btn_restore_stage: "Restaurar Fase Original",
    door_visual_btn: "+ Nova Porta Secreta (Clique & Posicione)",
    footer_note: "Cada linha é um inimigo disparado pelo gatilho da câmera. O jogo suporta 4 inimigos simultâneos com o patch exclusivo.",

    // Table Columns
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
    col_actions: "Ações",

    // Table Actions
    btn_dup: "Duplicar",
    btn_rem: "Remover",
    btn_rst: "Restaurar",

    // Modal Clone
    modal_title: "✨ Criar Nova Sala Secreta (Fase 44)",
    modal_desc: "Escolha qualquer uma das <b>43 fases do jogo</b> para servir como base visual (gráficos, paletas de cores, música de fundo) e combate:",
    modal_base_label: "Cenário Base para Clonar:",
    modal_chk_enemies: "Clonar todos os inimigos originais da fase escolhida",
    modal_enemies_desc: "Se você substituir o chefe por um inimigo comum (Billy, May, Dirk, Andore), o editor <b>ajusta automaticamente o chão e as coordenadas</b> para que ele nunca fique preso na parede!",
    modal_chk_door: "Conectar Porta da Cela (Fase 2) nesta sala",
    modal_door_desc: "Ao entrar na cela da prisão, transporta para esta nova fase secreta e, ao vencê-la, segue direto para o Chefe Dave.",
    modal_btn_cancel: "Cancelar",
    modal_btn_confirm: "✨ Confirmar e Criar"
  }
};

let CURRENT_LANG = 'en';

function t(k, p = {}) {
  const dict = I18N[CURRENT_LANG] || I18N.en;
  let s = dict[k] || I18N.en[k] || k;
  for (const param in p) {
    s = s.replace(new RegExp('\\{' + param + '\\}', 'g'), p[param]);
  }
  return s;
}

// Check key symmetry
for (const k of Object.keys(I18N.en)) {
  if (!I18N.pt[k]) {
    throw new Error(`Missing Portuguese translation for key: ${k}`);
  }
}
for (const k of Object.keys(I18N.pt)) {
  if (!I18N.en[k]) {
    throw new Error(`Missing English translation for key: ${k}`);
  }
}

console.log('✓ All 60+ translation keys matched between EN and PT!');
console.log('Default lang (EN) sample:', t('open_rom'));
CURRENT_LANG = 'pt';
console.log('Toggled lang (PT) sample:', t('open_rom'));
console.log('✓ i18n verification passed cleanly!');

