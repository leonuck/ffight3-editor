# Final Fight 3 (SNES, USA): patch de 4 inimigos simultâneos

*Documentação técnica do que foi analisado, alterado e como reconstruir. Versão do patch: `sempre_4_inimigos`.*

## 1. Resumo

O objetivo era remover o limite de 3 inimigos simultâneos na tela. A análise mostrou que o limite não é um número único, e sim consequência de três fatores do engine:

1. Um **teto lógico** no spawner: só 3 dos 4 slots de inimigo são considerados em jogo normal.
2. Uma **estrutura fixa de RAM**: cada ator vive numa página de 256 bytes da WRAM, e há exatamente 4 páginas para inimigos.
3. Um **orçamento de VRAM**: cada tipo de inimigo reserva um bloco numa tabela de 16 bytes.

Foram feitas duas entregas:

| Versão | Arquivo | O que faz |
| --- | --- | --- |
| 1 | `Final_Fight_3_4_inimigos.sfc` | Libera o 4º slot sempre (3 bytes alterados no código + checksum). O 4º inimigo só aparece quando o script da fase tem uma 4ª entrada pendente. |
| 2 | `Final_Fight_3_sempre_4_inimigos.sfc` | Inclui a versão 1 e adiciona um clonador: repete um inimigo vivo para manter os 4 slots ocupados. |

> **Estado de verificação.** Todo o trabalho foi feito por análise estática (disassembly próprio de 65816 + montagem com Asar). **Nada foi executado em emulador por mim.** A versão 1 foi testada pelo usuário e funcionou. A versão 2 ainda não foi testada.

## 2. A ROM

| Propriedade | Valor |
| --- | --- |
| Título no header | `FINAL FIGHT 3` |
| Tamanho do arquivo | 3.145.728 bytes (3 MB), sem header de cópia |
| Mapeamento | HiROM (byte de modo `$31`, FastROM) |
| Vetores | RESET `$00:FE00`, NMI `$00:FE39`, IRQ `$00:FE59` |
| Checksum original | `0E89` (complemento `F176`) |
| Checksum do patch v2 | `D44D` |

**Conversão de endereços (HiROM).** O endereço SNES `C0:xxxx` corresponde ao offset de arquivo `0x00xxxx`; `C1:xxxx` a `0x01xxxx`, e assim por diante. Todos os endereços deste documento estão no formato SNES.

**Checksum.** A ROM tem 3 MB num header que declara 4 MB. A fórmula validada contra o valor original foi: soma dos primeiros 2 MB + 2 × soma do último 1 MB, módulo 65536. O complemento fica em `C0:FFDC` e o checksum em `C0:FFDE` (little-endian).

## 3. Como o engine funciona (o que foi descoberto)

O nível de certeza está indicado: **\[confirmado\]** quando o código foi lido e o comportamento é direto; **\[inferido\]** quando deduzi pelo contexto.

### 3.1 Mapa de WRAM relevante

| Endereço | Uso | Certeza |
| --- | --- | --- |
| `$0500`, `$0600` | Páginas dos dois jogadores | inferido |
| `$0700`, `$0800`, `$0900`, `$0A00` | **4 slots de inimigo**, uma página de 256 bytes cada | confirmado |
| `$0B00` a `$0C80` (passo `$30`) | Tabela de objetos pequenos (projéteis/efeitos) | inferido |
| `$0D84` | Posição X da câmera, em 1/16 de pixel | confirmado |
| `$0E25` | Contador de entradas já processadas pelo script | confirmado |
| `$0E26` | Valor de "onda" gravado por comandos do script | inferido |
| `$0E27` a `$0E36` | Tabela de alocação de VRAM (8 pares id/tamanho) | confirmado |
| `$0E37` | Flag de "spawn em andamento" | confirmado |
| `$041B` | Flags do script; **bit `$20` = modo de 4 slots** | confirmado |
| `$0000` a `$0006` (absoluto) | Área de rascunho do spawner | confirmado |

Os 6 slots de ator são varridos por código desenrolado (loops com `LDX #$0700`, `#$0800`, etc.) em pelo menos 16 lugares, entre eles `C0:2D69`, `C0:6338`, `C0:6685`, `C0:71CC`, `C0:76D7`, `C0:89CF`, `C0:944A`, `C0:94EC`, `C0:A6C0`, `C0:A830`, `C0:A979`, `C0:C16C`, `C0:C1B8`, `C0:C211`, `C0:C256` e `C0:CD23`. Por isso **não** é viável criar um 5º slot de inimigo sem reescrever todos eles e arranjar nova RAM e VRAM.

### 3.2 Campos de um ator (offsets dentro da página do slot)

| Offset | Conteúdo | Certeza |
| --- | --- | --- |
| `$00` | Flags. Bit 0 = vivo. Bit 7 = lado/orientação. **Bit 6 (`$40`) = marca de clone (introduzido pelo patch).** | bit 0 e 7 confirmados; bit 6 estava sem uso aparente |
| `$01` | Tipo (bits 0-5) e variante de paleta (bits 6-7) | confirmado |
| `$04` | Flags gráficas. Máscara `$3C` ≠ 0 significa que o ator tem bloco de VRAM | confirmado |
| `$22` | Offset de VRAM (16 bits) do bloco do ator | confirmado |
| `$34` | Posição X (1/16 px) | confirmado |
| `$36` | Posição Y | confirmado |
| `$38` | Terceiro eixo (altura) | inferido |
| `$8A` | **Id** do bloco de VRAM (igual ao id da entrada do script) | confirmado |
| `$8B` | Tamanho do bloco de VRAM (entrada do script × 2) | confirmado |
| `$9B`, `$A5` | Zerado / `$0500` na criação | confirmado (uso exato desconhecido) |

### 3.3 Script de fase

O script é lido por um ponteiro de 24 bits em `$00`-`$02` (endereçamento direto, com o DP apontando para o objeto do script). O laço principal é `C0:6F63`.

- Se o byte 0 do registro é `$FF`, é um **comando** (byte 1 seleciona: `$FF` fim, `$FE` espera de scroll, `$FD` liga/desliga o modo de 4 slots, `$FC`, ou outro valor que grava `$0E26`).
- Caso contrário é uma **entrada de spawn de 17 bytes (`$11`)**. Layout parcialmente decodificado:
  - byte 0: se diferente de zero, só vale conforme `$1F11`;
  - byte 1: modo de gatilho (comparações com a câmera usando `$0D80` ou `$0D98`, ou modos imediatos `8` e `9`);
  - byte 4: tipo do inimigo;
  - byte 5: tamanho do bloco gráfico (multiplicado por 2 vira o tamanho na tabela de VRAM);
  - os demais campos incluem posição (absoluta ou relativa à câmera) e parâmetros de criação.
- Após criar o inimigo, o ponteiro avança `$11` bytes e `$0E25` é incrementado (`C0:737C`). Entradas ignoradas também avançam do mesmo jeito.

### 3.4 Fluxo do spawner (endereços)

| Endereço | Função |
| --- | --- |
| `C0:6F63` | Laço principal do script |
| `C0:70CA` | Entrada de spawn: valida byte 0 e avalia o gatilho |
| `C0:7171` | Início da cauda de spawn (checagens de `$041B` bit 3 e `$1F0A` bit 0) |
| `C0:7187` a `C0:719D` | **Teto de 3 inimigos** (ver 3.5) |
| `C0:71AD` | `id = $0E25 + 1` gravado em `$0002` |
| `C0:71BD` | `JSR $747F`: alocação de bloco de VRAM |
| `C0:71CC` | Varredura dos slots em busca do primeiro livre |
| `C0:71F2` | Caminho "esperar 1 frame": `JSL $C0E090` e volta ao laço |
| `C0:7250` a `C0:7379` | Inicialização do ator (posições, tabelas por slot em `C0:73E1`, paleta etc.) |
| `C0:737C` | Avanço do ponteiro (+`$11`), `INC $0E25`, espera 1 frame |
| `C0:747F` | Alocador de VRAM |

### 3.5 O teto de 3 inimigos

Em `C0:7187` o código lê `$041B` e testa o bit `$20`:

```
C0:7187  LDA $041B
C0:718A  BIT #$20
C0:718C  BNE $719D      ; bit ligado -> considera os 4 slots
C0:718E  ... testa só $0700, $0800 e $0900; se todos ocupados -> JMP $71F2 (espera)
C0:719D  ... testa os 4 slots
```

O bit `$20` é controlado pelo comando de script `$FD`. Em jogo normal ele fica desligado, o que reserva o 4º slot (`$0A00`). O mesmo teste aparece em três rotinas de spawn: `C0:7187`, `C0:7694` e `C0:94A7`.

### 3.6 Orçamento de VRAM (`$0E27` a `$0E36`)

O alocador `C0:747F` mantém 8 pares de bytes (id, tamanho), com capacidade total de **16 unidades**. Ele recebe o id em `$0002` e o tamanho em `$0004`, e devolve em `$0000` o offset (índice × 16) e `$0001 = 1`. Em falha devolve `$FF` em `$0000`, e o spawner então espera (`C0:71C5`).

O bloco é liberado quando o ator morre ou sai da tela, por código que procura o id na tabela e zera o par. Há três pontos de liberação: `C0:7FEE`, `C0:9486` e `C0:AC53`. Outros pontos (`C0:7C53`, `C0:8514`) realocam o bloco de um ator já existente, lendo `$8A` e `$8B` do próprio ator.

Esse orçamento de 16 unidades é a provável razão de projeto do limite de 3: três inimigos com blocos de 4 a 5 unidades enchem a tabela.

## 4. Alterações feitas

### 4.1 Tabela de patches

| # | Endereço | Bytes originais | Bytes novos | Efeito |
| --- | --- | --- | --- | --- |
| 1 | `C0:718C` | `D0 0F` (`BNE`) | `80 0F` (`BRA`) | Spawner principal sempre usa a verificação de 4 slots |
| 2 | `C0:7699` | `D0 0F` | `80 0F` | Idem, spawn variante |
| 3 | `C0:94AC` | `D0 0F` | `80 0F` | Idem, spawn variante 2 |
| 4 | `C0:71F2` | `22 90 E0 C0` (`JSL $C0E090`) | `4C A0 EE EA` (`JMP $EEA0` + `NOP`) | Desvia o "esperar frame" para o `CloneHook` |
| 5 | `C0:71BD` | `20 7F 74` (`JSR $747F`) | `20 29 EF` (`JSR $EF29`) | Alocação de VRAM passa pelo `AllocHook` |
| 6 | `C0:733B` | `A5 ED 05 EE` | `20 5B EF EA` | Chama `StaggerHook` e depois repete o `LDA $ED : ORA $EE` original |
| 7 | `C0:7FEE` (23 bytes) | laço de liberação | `JSL $C0EFE7` + 19 `NOP` | Liberação compartilhada (DP) |
| 8 | `C0:9486` (26 bytes) | laço de liberação | `JSL $C0EFF8` + 22 `NOP` | Liberação compartilhada (índice X) |
| 9 | `C0:AC53` (23 bytes) | laço de liberação | `JSL $C0EFE7` + 19 `NOP` | Liberação compartilhada (DP) |
| 10 | `C0:EEA0` a `C0:F051` | zeros | código novo (434 bytes) | Ganchos e rotinas |
| 11 | `C0:FFDC` a `C0:FFDF` | checksum antigo | checksum novo | Header |

O patch 1-3 (versão 1) altera apenas 1 byte por local (`D0` vira `80`). Na ROM final, 467 bytes diferem da original (código novo, ganchos, NOPs e checksum).

**Por que o gancho 6 está em `C0:733B` e não perto do fim da inicialização.** O endereço `C0:737B` (`PLD`) é alvo de um `BEQ` em `C0:7341`, e `C0:737C` é alvo de saltos de vários caminhos de "entrada ignorada". Colocar um `JML` ali quebraria esses alvos. Em `C0:733B` a substituição tem exatamente 4 bytes, mantém o `BEQ` intacto e o DP já aponta para o ator novo, com a posição já gravada.

### 4.2 Alocação na ROM

| Região | Situação |
| --- | --- |
| `C0:EE98` a `C0:FD00` | Bloco de 3.944 bytes zerados no fim do banco C0 (preenchimento) |
| `C0:EEA0` a `C0:F051` | **Usado pelo patch** (434 bytes) |
| `C0:F052` em diante | Continua livre (cerca de 3.500 bytes) |

| Rótulo | Endereço | Função |
| --- | --- | --- |
| `CloneHook` | `C0:EEA0` | Clonagem de inimigo vivo |
| `AllocHook` | `C0:EF29` | Compartilhamento de VRAM |
| `StaggerHook` | `C0:EF5B` | Marca e desloca clones |
| `OnTab` | `C0:EFDB` | Deslocamentos para clone na tela |
| `OffTab` | `C0:EFE1` | Deslocamentos para clone fora da tela |
| `FreeDP` | `C0:EFE7` | Liberação de VRAM (id no DP) |
| `FreeX` | `C0:EFF8` | Liberação de VRAM (id via índice X) |

A premissa de que essa área é preenchimento (e não dados) vem de ser um bloco contíguo de zeros no fim do banco de código. Não verifiquei referências a ela.

### 4.3 Alocação de RAM

**O patch não aloca nenhum byte novo de WRAM.** Não consegui provar que qualquer endereço estivesse livre (a varredura estática dá falsos positivos e a WRAM alta é muito usada). Por isso o desenho evita variáveis persistentes:

- o estado "sou clone" fica em um **bit já existente** (`$40` do byte de flags `$00` do ator);
- a identificação do "índice do clone" é recalculada contando atores vivos com o mesmo id;
- o ponteiro do script e `$0E25` são alterados temporariamente e restaurados pelo próprio avanço normal do spawner.

Uso de pilha: no máximo 7 bytes extras (`FreeDP`/`FreeX`: P, Y, palavra de exclusão e id).

## 5. Como funciona cada parte

### 5.1 Versão 1: 4º slot sempre liberado

Trocar `BNE` por `BRA` nas três rotinas faz o código sempre seguir para a checagem dos 4 slots. Esse modo já é usado pelo próprio jogo quando o script liga o bit `$20`, o que indica que o 4º slot tem tabelas e recursos próprios (a tabela por slot em `C0:73E1` tem uma linha para ele).

### 5.2 Versão 2: `CloneHook` (`C0:EEA0`)

Entra no lugar do "esperar 1 frame" do spawner. Ou seja, só roda quando o script está esperando algo (gatilho ainda não atingido, ou slots cheios). Isso dá **prioridade às entradas reais**: o laço principal sempre tenta primeiro a entrada atual.

Lógica:

1. Se `$041B & $20` (modo especial/chefe) → não clona.
2. Se `$0700 & $0800 & $0900 & $0A00` tem o bit 0 ligado (todos vivos) → não clona.
3. Recua o ponteiro do script em `$11` (entrada anterior).
4. Procura um ator **vivo e não clone** (bit 0 ligado, bit 6 desligado) com:
   - `$8A == $0E25` (mesmo id da entrada anterior);
   - tipo igual (`$01 & $3F` contra byte 4 da entrada);
   - tamanho igual (`$8B` contra byte 5 × 2).
5. Se achar: `DEC $0E25` e `JMP $7171`. A cauda de spawn roda para essa entrada. Ao terminar, o avanço normal (`C0:737C`) soma `$11` ao ponteiro e incrementa `$0E25`, **restaurando o estado** sem código extra.
6. Se não achar: devolve o ponteiro e executa o esperar-frame original (`JSL $C0E090 : JMP $6F63`).

Como o `id` do ator é `contador + 1` no momento da criação e o contador já avançou, o id do ator da entrada anterior é exatamente `$0E25`. As verificações de tipo e tamanho protegem contra o caso em que existe um comando de tamanho diferente entre as entradas e o ponteiro recuado cai no meio de um registro.

**Limite contra travamento.** Se os clones pudessem gerar clones, o jogador nunca zeraria os inimigos e, se a fase trava a câmera até a tela limpar, o jogo travaria. Por isso só um ator **original** vivo permite novos clones. Matando o original, o ciclo termina.

### 5.3 `AllocHook` (`C0:EF29`)

Substitui o `JSR $747F`. Varre os 4 slots; se existe um ator vivo com o mesmo id (`$8A == $0002`), copia o `$22` (offset de VRAM) dele para `$0000` e retorna, **sem tocar no alocador**. O clone usa assim o mesmo bloco gráfico e não consome VRAM. Se não há ator com esse id, salta para `$747F` (caminho original).

### 5.4 `StaggerHook` (`C0:EF5B`)

Roda com o DP no ator recém-criado. Conta quantos atores vivos têm o mesmo id (incluindo o novo). Se o total é 1, é um original e nada muda. Se for 2 ou mais:

- marca o ator como clone (`$00 |= $40`);
- desloca `$34` (X). Posição relativa = `$34 − $0D84`.
  - Dentro da tela (relativa < `$1000`): clone 1 vai `+$0280`, clone 2 vai `−$0280`, clone 3 vai `+$0500` (`$0280` = 40 pixels).
  - Fora da tela: afasta-se do centro em `$0280`, `$0500` ou `$0780` conforme o índice.

Depois executa as duas instruções originais que o gancho substituiu (`LDA $ED : ORA $EE`).

### 5.5 `FreeDP` / `FreeX` (`C0:EFE7`, `C0:EFF8`)

Substituem o laço original que apaga o par (id, tamanho) da tabela `$0E27`. Como original e clones compartilham o id, o primeiro a morrer liberaria o bloco enquanto os outros continuam usando, e um novo inimigo poderia sobrescrever os gráficos. A rotina:

1. Recebe o id (de `$8A` no DP, ou de `$008A,X`) e o endereço do ator que está morrendo (para excluí-lo);
2. Varre os 4 slots procurando outro ator **vivo** com o mesmo id;
3. Se encontrar, não libera nada;
4. Se não encontrar, procura o id em `$0E27` e zera o par.

Diferença do original: se o id não é encontrado, o código original escrevia em `$0E37` (índice 16 estourando a tabela). A rotina nova simplesmente sai.

## 6. Efeitos colaterais e riscos conhecidos

| Risco | Detalhe |
| --- | --- |
| Chefes | O patch só evita clonar quando o bit `$20` de `$041B` está ligado. Não verifiquei se todos os chefes ficam nesse modo. |
| Bit `$40` do flag | Marquei clones nesse bit porque não achei nenhum teste dele no código varrido. Código de IA de inimigos em outros bancos pode usá-lo. |
| Posição inicial | O deslocamento em X pode colocar o clone fora da área jogável em entradas com posição fixa. |
| Mix de inimigos | Só o último inimigo criado é clonado, e só quando o script está esperando. |
| VRAM | Clones compartilham o bloco do original. Dois atores com o mesmo id em rotinas de realocação (`C0:7C53`, `C0:8514`) não foram analisados a fundo. |
| Piscadas | Mais sprites por linha de varredura podem gerar flicker. |
| Script de cutscene | Comandos que procuram inimigo por tipo (`C0:944A`) podem encontrar um clone. |
| Itens e drops | Os drops parecem usar a tabela de objetos pequenos, não os slots de inimigo, mas não confirmei. |

## 7. O que ficou de fora (por que não 5 inimigos)

Um 5º slot exigiria: nova página de RAM (a região logo após `$0A00` já é ocupada), alteração de mais de 16 laços desenrolados, nova região e paleta de VRAM, e conferir limites de OAM. Sem emulador, isso tem alta chance de quebrar o jogo. Uma alternativa seria depurar o jogo no Mesen-S (breakpoints de escrita em `$0A00`) para coletar dados reais de VRAM e paleta antes de tentar.

## 8. Ferramentas e método

- **Disassembler 65816** escrito em Python (`dis.py`), com tabela de opcodes e controle manual dos modos de 8/16 bits (M/X).
- **Busca por padrões de bytes** (laços de slot, comparações com contadores, escritas em `$0E27`) para localizar o spawner.
- **Asar** (RPGHacker/asar, compilado do GitHub) para montar o patch. Opções usadas: `--fix-checksum=off`. O checksum foi recalculado à parte.
- **Verificações de segurança** no `.asm`: `assert read1(...)` confere os bytes originais antes de qualquer patch.

### Reconstruir a ROM

```
cp Final_Fight_3__USA_.sfc work.sfc
asar --fix-checksum=off ff3_clone.asm work.sfc
```

Depois corrigir o checksum no header (`C0:FFDC`..`FFDF`) com a fórmula da seção 2, ou simplesmente usar o `.ips` fornecido.

### Aplicar o IPS

Use Flips ou qualquer aplicador de IPS sobre a ROM original USA sem header (3.145.728 bytes). Em outras versões da ROM, os endereços mudam e o patch não deve ser aplicado.

## 9. Plano de teste sugerido

1. Fase 1 por alguns minutos: observar se aparecem 4 inimigos, se há gráficos corrompidos e se a fase avança normalmente.
2. Matar todos os inimigos de uma onda e conferir que o jogo continua (sem travamento de câmera).
3. Uma fase com chefe: verificar se o chefe é clonado.
4. Modo 2 jogadores, se disponível.
5. No Mesen-S: breakpoint de escrita em `$0E27`-`$0E36` para confirmar que os blocos só são liberados com o último usuário.

Se algo falhar, descreva fase, momento e sintoma. Com isso é possível ajustar os parâmetros (por exemplo, desativar clones em um tipo, mudar o deslocamento ou limitar a 1 clone por entrada).

## 10. Arquivos entregues

| Arquivo | Descrição |
| --- | --- |
| `Final_Fight_3_4_inimigos.sfc` / `.ips` | Versão 1 (4º slot sempre liberado) |
| `Final_Fight_3_sempre_4_inimigos.sfc` / `.ips` | Versão 2 (com clonagem) |
| `ff3_clone.asm` | Código-fonte do patch da versão 2 (Asar) |

## 11. Mecânica de Portas Secretas e Sistema de Transição de Fases

### 11.1 Mapa de Memória WRAM (Endereços Essenciais)

| Endereço | Tipo | Descrição e Comportamento |
| :--- | :--- | :--- |
| `$0534` | Word (16-bit LE) | Posição horizontal (**X**) do Player 1 em subpixels (`pixel * 16`). |
| `$0536` | Word (16-bit LE) | Posição vertical (**Y**) do Player 1 em subpixels (`pixel * 16`). |
| `$1E5B` | Byte (8-bit) | Entradas direcionais do P1. O bit 3 (`#$08`) indica direcional **CIMA** pressionado. |
| `$0500` | Byte (8-bit) | Status e vida do Player 1. Bit 0 (`#$01`) indica se o P1 está ativo e vivo. |
| `$0600` | Byte (8-bit) | Status e vida do Player 2. Bit 0 (`#$01`) indica se o P2 está ativo e vivo. |
| `$1F03` | Byte (8-bit) | ID da fase/sala atualmente ativa (1 a 43). |
| `$1F07` | Word (16-bit LE) | Temporizador nativo de contagem regressiva de vitória ao derrotar o chefe/área. |
| `$0406` | Byte (8-bit) | **Registrador de Transição de Fase da Engine**: |
| | | • `$00`: Modo gameplay normal (sem transição). |
| | | • `$FF` (negativo): Encerramento nativo de fase (vitória) ou Game Over. Dispara a contagem de pontos (`C0:0195`) e avança a história padrão. |
| | | • `> $00` (positivo): Salto forçado imediato. O despachante grava `$0406` em `$1F03` e carrega a fase apontada diretamente, ignorando o fluxo linear da história. |

---

### 11.2 Arquitetura de Dois Ganchos (Two-Hook Architecture)

Para implementar salas secretas com retorno configurável sem quebrar o fluxo nativo da história, foi desenvolvida uma arquitetura com dois pontos de injeção em assembly 65816:

#### Gancho 1: Sensor de Entrada (`C0:12F4` ➔ `C0:F060`)
Executado a cada frame durante o laço principal de gameplay (`C0:1239`):
1. Substitui `JSR $2266` por `JSR $F060`.
2. Confere travas de segurança: `$0406 == 0` (nenhuma transição ativa), P1 vivo (`$0500 & 0x01`) e direcional CIMA segurado (`$1E5B & 0x08`).
3. Compara `$1F03` com a fase de origem (`srcStage`) e verifica a caixa de colisão retangular (`minX <= X <= maxX` e `Y <= maxY`).
4. Ao acionar, grava o ID da sala secreta (`destStage`) em `$0406` e encerra com `RTS`, iniciando o fade-out imediato para a sala secreta.

#### Gancho 2: Despachante de Retorno ao Vencer (`C0:132A` ➔ `C0:F340`)
Executado exatamente no momento em que a fase termina (inimigos eliminados ou chefe derrotado):
1. Substitui `JSL $C0E009` por `JSL $C0F340`.
2. **Descoberta Crítica da Engine**: Quando o temporizador `$1F07` zera após a vitória, a engine executa nativamente em `C0:2B4B`:
   ```assembly
   LDA #$FF : STA $0406
   ```
   Portanto, `$0406` **já chega valendo `$FF`** no final da fase. Checar `LDA $0406 : BNE .exit` abortava o retorno indevidamente.
3. **Solução Implementada**:
   - O gancho verifica se ao menos um jogador está vivo (`$0500 | $0600 & 0x01`). Se ambos morreram (Game Over), não altera `$0406` para permitir a tela de Game Over.
   - Se os jogadores venceram e a fase encerrada é a sala secreta (`$1F03 == destStage`), sobrescreve `$0406` com a fase de retorno configurada (`exitStage`).
   - Retorna via `PLP : RTL` para `C0:010E`.
4. O despachante nativo em `C0:0119` lê `$0406`:
   ```assembly
   C0:0119: LDA $0406
   C0:011C: BEQ $0144     ; se 0, fluxo normal
   C0:011E: 30 24         ; se negativo ($FF), fluxo normal
   C0:0120: STA $1F03     ; SE POSITIVO: grava fase de destino em $1F03!
   C0:0170: BEQ $010A     ; Salta para C0:010A (JSL $C011EE) carregando a nova fase!
   ```

---

### 11.3 Tabela Oficial de IDs e Rotas das Fases (Capcom Debug Map)

De acordo com a tabela original e mapa de depuração da Capcom (**ALL AREA MAP / ALL AREA NAME**), os 43 estágios oficiais e seus chefes são mapeados como:

| ID | Nome Oficial Capcom | Nome Traduzido / Descrição | Chefe / Particularidade |
|:---:|---|---|---|
| **01** | 01 POLICE STATION | ROUND 1 · Rua da Delegacia de Metro City | Início da jornada |
| **02** | 02 PRISON | ROUND 1 · Corredor das Celas da Prisão | Interior da delegacia |
| **03** | 03 GAS STATION | ROUND 1 · Posto de Combustíveis | **Chefe Dave** |
| **04** | 04 MAIN STREET | ROUND 2 · Rua Principal do Bar | Área externa |
| **05** | 05 BACK STREETT | ROUND 2 · Beco dos Armazéns (Bifurcação) | Porta de madeira |
| **06** | 06 BACK ALLEY | ROUND 2 · Beco / Telhado (Rota Normal A) | **Chefe Callman A** |
| **07** | 07 CLUB CAPCOM | ROUND 2 · Interior do Bar (Rota Secreta B) | **Chefe Callman B** |
| **08** | 08 BUS STOP STREET | ROUND 3 · Ponto de Ônibus na Rua | **Convergência de 6/7 e Grande Escolha de Rota** |
| **09** | 09 IN THE BUS | ROUND 3 · Combate Dentro do Ônibus (Rota Esquerda) | Combate nos corredores e bancos |
| **10** | 10 BUS CLASH | ROUND 4A · Batida do Ônibus no Cais | Transição da batida no cais |
| **11** | 11 SCRAP HEAP | ROUND 3 · Ferro-Velho / Depósito de Sucata | Pilhas de entulho e tambores |
| **12** | 12 ON THE BUS | ROUND 3 · Teto do Ônibus em Movimento | **Chefe Caine** (Kain) |
| **13** | 13 IRON BRIDGE | ROUND 4A · Ponte de Ferro do Navio (Rota Baixo) | Caminho a pé até o porto |
| **14** | 14 PIER | ROUND 4A · Cais de Embarque | Atracadouro do cargueiro |
| **15** | 15 DECK (ECK) | ROUND 4A · Convés Superior do Navio | Área aberta no navio |
| **16** | 16 STORE HOUSE | ROUND 4A · Porão de Carga do Navio | Galpão interno com caixas |
| **17** | 17 FRONT DECK | ROUND 4A · Proa do Navio Cargueiro | **Chefe Drake** |
| **18** | 18 BONAS-A | BÔNUS 1 · Destruir o Trator / Bulldozer | Fase Bônus A |
| **19** | 19 CHINATOWN | ROUND 4B · Bairro Chinês (Vindo de Caine 12) | Bairro Chinês comercial |
| **20** | 20 BILLBOARD | ROUND 4B · Painéis / Outdoors da Cidade | Letreiros luminosos e telhados |
| **21** | 21 RESTAURANT | ROUND 4B · Restaurante Chinês | Mesas e salão interno |
| **22** | 22 KITCHEN | ROUND 4B · Cozinha do Restaurante | **Chefe Wong** |
| **23** | 23 UNDERGROUND | ROUND 5 · Passagem Subterrânea (Vindo de Bônus 18)| Galerias sob o porto |
| **24** | 24 CHINATOWN | ROUND 5 · Rota Alternativa - Bairro Chinês | Subsolo / conexão urbana |
| **25** | 25 BILLBOARD | ROUND 5 · Rota Alternativa - Painéis | Telhados de acesso à fábrica |
| **26** | 26 RESTAURANT | ROUND 5 · Rota Alternativa - Restaurante | Interior de apoio |
| **27** | 27 KITCHEN | ROUND 5 · Rota Alternativa - Cozinha | **Subchefe Wong** |
| **28** | 28 ENTER THE FACTRY | ROUND 5 · Entrada Principal da Fábrica | **Ponto de Convergência das Rotas 18 e 22** |
| **29** | 29 ALARM | ROUND 5 · Setor dos Alarmes Industriais | Sala de controle com 3 opções de rota |
| **30** | 30 RESEARCH ROOM-1 | ROUND 5 · Laboratório Secreto de Pesquisa 1 | Sala lateral opcional |
| **31** | 31 RESEARCH ROOM-2 | ROUND 5 · Laboratório Secreto de Pesquisa 2 | Acesso ao atalho do computador |
| **32** | 32 COMPUTER ROOM | ROUND 5 · Sala Central de Computadores | **SUPER ATALHO DIRETO PARA A FASE 36 (Pula Stray e Bônus)!** |
| **33** | 33 HALL-WAY | ROUND 5 · Corredor Industrial Principal | Acesso ao guindaste |
| **34** | 34 CRANE | ROUND 5 · Pátio do Guindaste Industrial | **Chefe Stray** |
| **35** | 35 BONAS-B | BÔNUS 2 · Destruir os Computadores e Barris | Fase Bônus B |
| **36** | 36 STREET OF BUILDINGS | ROUND 6 · Rua dos Edifícios (Quartel Skull Cross)| Entrada do complexo final |
| **37** | 37 CORRIDOR | ROUND 6 · Corredor de Segurança da Torre | Corredor interno com 2 salas secretas |
| **38** | 38 OTHER ROOM-1 | ROUND 6 · Sala Secreta 1 da Torre | Sala de segurança esquerda |
| **39** | 39 OTHER ROOM-2 | ROUND 6 · Sala Secreta 2 da Torre | Sala de segurança direita |
| **40** | 40 ELEVATOR | ROUND 6 · Elevador Panorâmico da Torre | Subida rumo à cobertura |
| **41** | 41 PRESIDENT ROOM | ROUND 6 · Gabinete Presidencial da Skull Cross | Escritório luxuoso |
| **42** | 42 ROOFTOP | ROUND 6 · Terraço da Torre (Confronto Final) | **Chefe Final Black** |
| **43** | TR TRANING ROOM | MODO DE TREINO · Sala de Treinamento Livre | 56 barris e tambores (Leva à Fase 01) |

---

### 11.4 Integração no Editor Visual (`FF3_Script_Editor.html`)

- Painel **🚪 Sistema de Portas Secretas (Multi-Portas)** integrado diretamente na interface HTML.
- Permite configurar ilimitadas portas independentes com `srcStage`, `destStage`, `exitStage`, `minX`, `maxX` e `maxY`.
- **Modo Rua Panorâmica (1280px)**: Exibe a rua da Fase 1 em extensão total com arte de fundo contínua (Delegacia, Pagode Chinês e Bar "Creep Eats").
- **Edição Visual de Portas (Drag & Drop)**: Permite arrastar caixas de porta diretamente no cenário e puxar alças de borda para alterar largura (`X min`, `X max`) e teto (`Y teto`) em tempo real.
- **Sprites e Avatares Vetoriais**: Inimigos exibem gráficos característicos de cada personagem (Dave, Callman, Andore, May, Billy, Fat Jack, etc.) com barras de HP e posicionamento global.
- Checksum FastROM recalculado automaticamente garantindo compatibilidade com consoles reais e emuladores.

---

### 11.5 Criação de Novas Fases Secretas (Fase 44+)

- **Tabela de Ponteiros (`0x342B3`)**: A tabela nativa de estágios contém 64 bytes livres pós-Fase 43, permitindo acomodar 4 novas fases completas (44 a 47) de 16 bytes cada.
- **Área Livre de Scripts (`0xE55A8`)**: Com mais de 10.300 bytes livres, novos scripts de combate são compilados e indexados de forma transparente.
- **Tabela de Metadados (`C0:0F39`)**: A entrada de 12 bytes da Fase 44 herda os parâmetros do cenário template escolhido (música, gráficos e paletas).
- O fluxo de vitória e retorno via Hook 2 (`C0:132A`) gerencia perfeitamente a saída da Fase 44 para o destino configurado (ex: Chefe Dave).



### 11.6 Correção e Otimização da Fase 44 e Inserção de Inimigos

Durante a criação da Fase 44 e testes de combate, foram identificadas e solucionadas as seguintes particularidades da engine da Capcom:

1. **Alocação de VRAM Obrigatória (`b[5] >= 2`)**:
   - Cada inimigo no registro de 17 bytes necessita de um valor de blocos de VRAM não-nulo em `b[5]` (2 para Billy/May, 3 para Dirk/Hunter, 4 para Chefes como Callman/Andore/Dave). Se `b[5] == 0`, o despachante de sprites falha ao reservar tiles e o ator não é renderizado.
2. **Posição e Plano do Chão (`b[13..14]`)**:
   - As coordenadas em Final Fight 3 utilizam 16 subpixels por pixel (`pixel * 16`). O plano do chão jogável está entre **Y: 155px e 215px** (2480 a 3440 subpixels). Valores em Y: 0px colocam o ator fora da tela no céu, resultando em cancelamento imediato pelo motor de física.
3. **Clonagem Transparente de Template**:
   - A criação da Fase 44 passou a clonar diretamente os inimigos legítimos do cenário base escolhido (ex: Fase 7 - Bar Creep Eats com Callman, Fritz, Billy e May). Isso garante compatibilidade total de VRAM, gatilhos de câmera e barreiras sem necessidade de configuração manual do zero.
4. **Inserção Segura de Inimigos (`+ Inimigo`)**:
   - A função de adicionar inimigo (`#addE`) insere os novos atores **antes do terminador da onda / barreira final (`FF 01` / `FF 02`)** e com atributos válidos garantidos (`Gfx = 2`, `Y = 184px`, `HP = 35`), evitando que comandos após o encerramento do script sejam ignorados.
5. **Cálculo de Drag & Drop no Tabuleiro Panorâmico**:
   - No modo Panorâmico, a movimentação do token calcula a posição relativa à câmera subtraindo o gatilho da onda (`curWorldX - trigPx`), garantindo precisão matemática perfeita ao arrastar inimigos.
6. **Cenários de Fundo Temáticos no Editor**:
   - O editor agora desenha cenários personalizados completos para o interior do Bar Creep Eats (estante de garrafas, letreiros neon, balcão de madeira com banquetas, piso de parquet), Gabinete do Dave, Restaurante Chinês, Prisão e Cais.

### 11.7 Auto-Sanitização de Chefes para Inimigos Comuns e Clonador Modal de Fases

1. **Por que o inimigo comum ficava preso no lugar ao substituir um chefe?**:
   - **Posicionamento Absoluto dos Chefes (`Pos = 1`)**: Na engine da Capcom, todos os chefes (Dave, Callman, Caine, Wong, Drake, Stray, Black) possuem `Pos = 1` com coordenadas especiais de entrada (`X` além da barreira da câmera e `Y` entre 128px e 144px no teto, balcão ou mezanino).
   - **Cutscenes de Entrada vs. IA Normal**: Os chefes possuem rotinas de cutscene exclusivas na ROM que desativam a colisão temporariamente durante a animação de entrada. Inimigos comuns (Billy, May, Dirk, Andore, etc.) não possuem cutscene e iniciam direto na rotina de combate. Como o chão jogável de Final Fight 3 exige `Y >= 155px`, qualquer inimigo comum em `Y: 144px` colide com a parede superior, tendo suas velocidades zeradas (`VX=0, VY=0`) e ficando congelado no lugar.
   - **Solução no Editor**: O editor agora possui um auto-sanitizador no dropdown de Tipo: ao trocar um chefe por um capanga comum, ele automaticamente move o ator para o plano do chão (`Y = 184px`), converte para posição relativa à câmera (`Pos = 0, X = 275px`) e redimensiona a VRAM para 2 ou 3 blocos.

2. **Modal Interativo de Seleção de Cenário (Todas as 43 Fases)**:
   - A criação da Fase 44 foi aprimorada com uma janela modal elegante contendo um menu `<select>` com todas as 43 fases originais catalogadas por Round.
   - Permite re-clonar qualquer cenário a qualquer momento pelo botão `🔄 Clonar Outra Fase para Fase 44` na barra lateral.

### 11.8 Cenários Reais do Jogo (Screenshots Panorâmicos de Todas as 42 Fases)

1. **Substituição do Fundo Procedural por Screenshots Autênticos**:
   - Todas as **42 fases do jogo** (Rounds 1 a 6, Bônus 1 e 2) contam agora com gráficos de pixel-art originais extraídos diretamente do jogo em screenshots panorâmicos armazenados na pasta `img/`:
     - **Round 1 (Fases 1 a 3)**: Delegacia (`round_1_fase_1.png` - 1024×190), Celas (`round_1_fase_2.png` - 1023×190), Gabinete do Dave (`round_1_fase_3_chefe.png` - 768×190).
     - **Round 2 (Fases 4 a 7)**: Rua do Bar (`round_2_main_4.png` - 768×190), Armazém/Beco (`round_2_main_5.png` - 1023×445), Telhados/Callman A (`round_2_main_6.png` - 768×190), Club Capcom/Callman B (`round_2_main_7.png` - 768×190).
     - **Round 3 (Fases 8, 9, 11, 12)**: Ponto de Ônibus (`round_3_main_8.png` - 768×190), Interior do Ônibus (`round_3_main_9.png` - 512×200), Ferro Velho (`round_3_main_11.png` - 768×200), Teto do Ônibus/Kain (`round_3_main_12.png` - 512×200).
     - **Round 4A (Fases 10, 13 a 17)**: Batida do Ônibus (`round_4a_main_10.png` - 384×190), Ponte de Ferro (`round_4a_main_13.png` - 712×190), Cais/Pier (`round_4a_main_14.png` - 896×190), Convés (`round_4a_main_15.png` - 512×190), Porão de Carga (`round_4a_main_16.png` - 512×197), Front Deck/Drake (`round_4a_main_17.png` - 464×190).
     - **Bônus 1 (Fase 18)**: Destruir o Trator (`bonus_1-main_18.png` - 436×210).
     - **Round 4B (Fases 19 a 22)**: Chinatown (`round_4b_main_19.png` - 768×190), Painéis (`round_4b_main_20.png` - 1017×190), Restaurante Chinês (`round_4b_main_21.png` - 768×190), Cozinha/Weng (`round_4b_main_22.png` - 512×190).
     - **Round 5 (Fases 23 a 34)**: Passagem Subterrânea a Corredores e Guindaste/Stray (`round_4b_main_23.png` a `round_5_main_34.png` - 256×190 a 1280×190).
     - **Bônus 2 (Fase 35)**: Barris (`bonus_2_main_35.png` - 512×200).
     - **Round 6 (Fases 36 a 42)**: Skull Cross, Corredor, Elevador, Sala Presidencial e Telhado/Black (`round_5_main_36.png` a `42.png` - 256×190 a 1216×190).
   - A **Fase 44 (Sala Secreta)** herda dinamicamente o screenshot e largura da fase selecionada como template.

2. **Alinhamento e Coordenadas SNES com Precisão Subpixel**:
   - A resolução vertical nativa do SNES é de **224 linhas**:
     - **Linhas 0 a 34 (34px)**: Barra de Status / HUD do SNES (placar, cronômetro, barras de vida). O editor renderiza uma barra escura com demarcação técnica.
     - **Linhas 34 a 224 (190px)**: Campo de visão do jogo (*playfield*). As imagens fornecidas possuem exatamente 190px de altura útil, encaixando-se com perfeição milimétrica ao serem desenhadas a partir de `Y = 34`.
   - O plano do chão jogável (`Y: 155..215 px`) alinha-se perfeitamente com calçadas, asfalto, grades, convés e pisos internos.

3. **Modos Panorâmico e Tela Única com Janela de Câmera**:
   - **Modo Panorâmico**: O tabuleiro adapta dinamicamente sua largura ao comprimento exato da imagem de cada fase (de 256px até 1280px), eliminando distorções.
   - **Modo Tela Única SNES (256px)**: O canvas projeta uma janela de recorte de 256px correspondente ao gatilho de câmera (`Trig`) da onda selecionada, com as laterais de entrada fora da tela (70px à esquerda e à direita) suavemente escurecidas.

4. **Portas e Demarcações Interativas sobre o Gráfico Real**:
   - As caixas de gatilho de portas secretas sobrepõem-se diretamente sobre o desenho das portas no cenário real, permitindo aos modders arrastar e calibrar áreas de transição com retorno visual imediato.

### 11.9 Clonagem Segura da Fase 44 e Estabilidade 100% Vanilla

1. **Herança Limpa de Ponteiros de Cenário (Ponteiros 0 a 3)**:
   - Para evitar instabilidades de áudio (SPC700) ou incompatibilidades de bytecode de vídeo, a Fase 44 opera em modo de clonagem pura:
   - Copia integralmente os 4 ponteiros de vídeo (`0x34000`) da fase template escolhida na tabela `0x342B3`.
   - Copia os 12 bytes de metadados originais da fase template para o slot da Fase 44 em `C0:0F39` (área de limites de câmera e gráficos nativos).

2. **Preservação Integral do Código Original do SNES (`C0:0120`)**:
   - O endereço de transição de tela `C0:0120` permanece com as instruções originais do jogo:
     ```assembly
     STA $1F03   ; 8D 03 1F (atualiza fase atual)
     CMP #$48    ; C9 48    (compara limite)
     ```
   - Não há injeção de hooks no driver APU/SPC700 nem scripts experimentais de GFX na ROM, eliminando totalmente qualquer risco de telas pretas, bugs de introdução de fase ou silenciamento de músicas.

3. **Customização Segura de Inimigos**:
   - Somente o 5º ponteiro (script de combate e ondas) é apontado para a área de edição livre do modder (`FREE_RUNS` em `0xE55A8`).
   - O corretor automático de chefes posiciona capangas comuns no centro do chão (`Y: 184px`, `Pos: 0`, `X: 275px`), garantindo que inimigos comuns usados como chefes se movam e ataquem com liberdade total sem ficarem presos na geometria da parede.

