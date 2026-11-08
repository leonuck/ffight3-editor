# Final Fight 3 (SNES) - Technical Architecture & ROM Engine Specification

This specification documents the reverse-engineered Capcom game engine internals for **Final Fight 3** (SNES, NTSC-USA), the 4-Simultaneous Enemies engine patch, the real-time Multi-Door 65816 machine code hooks, and the scenario cloning architecture used by **FF3 Script & Visual Editor 2026**.

---

## 1. ROM Layout & Checksum Verification

| Parameter | Specification |
|---|---|
| **Header Title** | `FINAL FIGHT 3` |
| **ROM Size** | 3,145,728 bytes (3.0 MB), unheadered |
| **Mapping** | HiROM (`$31`, FastROM enabled) |
| **Vectors** | RESET `$00:FE00`, NMI `$00:FE39`, IRQ `$00:FE59` |
| **Header Offset** | `$00:FFC0` (File offset `0x007FC0` for 32KB bank or `0x00FFC0` in linear HiROM) |
| **Original Checksum** | `0x0E89` (Inverse: `0xF176`) |

### FastROM Checksum Calculation Formula
Because Capcom's ROM contains 3.0 MB of data in a 4.0 MB allocation block:
$$\text{Sum} = \left(\sum_{i=0}^{\text{0x1FFFFF}} \text{byte}[i] + 2 \times \sum_{j=\text{0x200000}}^{\text{0x2FFFFF}} \text{byte}[j]\right) \pmod{65536}$$
The inverse checksum ($0xFFFF \oplus \text{Sum}$) is stored at `0x00FFDC` and the direct checksum at `0x00FFDE` in little-endian byte order.

---

## 2. Enemy Record Bytecode (12-Byte Actor Format)

In Capcom's engine, every stage contains a linear script of actors parsed when entering the area or triggered by camera progression:

```
Offset:   +0    +1    +2    +3    +4    +5    +6    +7    +8    +9   +10   +11
Content: [Gate][Mode][ Trig ][SpId][Gfx ][Item][ ?? ][ HP ][Move][Pos ][  X  ]
```

| Byte | Field | Description |
|---|---|---|
| `b[0]` | **Gate** | `0x00` = Always spawn; `0x01` = Spawn only when 2-Player mode is active. |
| `b[1]` | **Spawn Mode** | Trigger condition: `0` (Cam X ≥ val), `1` (Cam X ≤ val), `2` (Cam Y ≤ val), `3` (Cam Y ≥ val), `8` (Immediate), `9` (Event = val). |
| `b[2..3]`| **Trigger Value** | 16-bit little-endian threshold compared against camera world coordinate ($0D84 / 16). |
| `b[4]` | **Sprite Index** | Enemy character type and palette bank. Palette banks step in increments of 64 (`0x00`, `0x40`, `0x80`, `0xC0`). Character IDs `20..26` are bosses. |
| `b[5]` | **Gfx Units** | Number of 16-tile VRAM slots requested. Regular enemies take 2 to 4 units; bosses take 4 units. |
| `b[6]` | **Item Drop** | Collectible spawned if enemy was carrying an item (food, knife, club, points). |
| `b[7]` | **Flags / Subtype** | Sub-behavior flags and internal combat state. |
| `b[8]` | **Health (HP)** | 8-bit health points. Typical grunts have 30 to 48 HP; bosses have 90 to 140 HP. |
| `b[9]` | **Movement AI** | AI aggression pattern and walking profile. |
| `b[10]` | **Coordinate Mode**| `0x00` = Camera-relative offset (grunts); `0x01` = Absolute stage world position (bosses). |
| `b[11]` | **Initial X Offset** | Initial spawn offset: `xPx = (val * 16)`. Offsets `-35` spawn from left screen edge; `290` spawn from right. |

### Command Bytes
* **`0xFF, 0xFF`**: End-of-script marker for the current stage.
* **`0xFF, 0xXX`**: Wave barrier command (wait for all currently spawned enemies to be cleared before advancing the camera).

---

## 3. The 4-Simultaneous Enemies Engine Patch

### 3.1 RAM Page Allocations
SNES WRAM allocates dedicated 256-byte pages for each active combatant:
* `$0500 - $05FF`: Player 1
* `$0600 - $06FF`: Player 2
* `$0700 - $07FF`: Enemy Slot 1
* `$0800 - $08FF`: Enemy Slot 2
* `$0900 - $09FF`: Enemy Slot 3
* `$0A00 - $0AFF`: **Enemy Slot 4** *(Uncapped by patch)*

### 3.2 Spawner Limit Uncapping
In vanilla ROM, the 3 spawner dispatchers check a maximum loop counter set to 3. The patch raises this ceiling to 4:
1. `0x0070CE`: `E0 03 00` $\rightarrow$ `E0 04 00` (`CPX #$0004`)
2. `0x00735E`: `E0 03 00` $\rightarrow$ `E0 04 00` (`CPX #$0004`)
3. `0x007542`: `E0 03 00` $\rightarrow$ `E0 04 00` (`CPX #$0004`)

### 3.3 Player 2 VRAM Reallocation (+6 Units)
Sprite graphics reside in SNES VRAM at `$6000-$7FFF`. 
* Standard grunt allocation budget: 16 units (256 tiles).
* When Player 2 is absent, VRAM tiles `$6600-$6BFF` (96 tiles = 6 units) are reclaimed as a dedicated graphics expansion buffer, raising maximum simultaneous sprite units from **16 to 22 units**.
* This eliminates tile flickering or sprite corruption when 4 distinct enemy varieties fight on screen simultaneously.

---

## 4. Real-time Multi-Door 65816 Assembly Machine Code

The editor injects a zero-lag real-time portal engine directly into the gameplay frame loop:

### 4.1 Frame Hook at `C0:12F4`
The original instruction `JSR $2266` is replaced with `JSR $F060` (or free bank routine):

```assembly
; Real-time Door Sensor (Runs every gameplay frame)
door_sensor_hook:
    LDA $0500          ; Check if Player 1 is alive ($0500 != 0)
    BIT #$01
    BEQ .exit_frame
    LDA $1E5B          ; Read Player 1 controller input
    BIT #$08           ; Check if UP directional is pressed
    BEQ .exit_frame

    ; Sequential door check loop:
    LDA $1F03          ; Check current stage ID
    CMP #src_stage
    BNE .next_door

    LDA $0D84          ; Check Player World X Position
    CMP #min_x
    BLT .next_door
    CMP #max_x
    BGT .next_door

    LDA $0D86          ; Check Player World Y Position
    CMP #max_y
    BGT .next_door

    ; Door triggered! Fire transition:
    LDA #dest_stage    ; Load target secret stage ID
    STA $1F03          ; Set next stage
    LDA #$02           ; Transition command
    STA $0406          ; Trigger room reload
    RTS

.next_door:
    ; (Repeated for each active door)

.exit_frame:
    JSR $2266          ; Execute original displaced gameplay logic
    RTS
```

### 4.2 Stage Exit Hook at `C0:132A`
To ensure players return to the appropriate next stage after clearing a secret arena:
```assembly
stage_exit_hook:
    JSL $C0E009        ; Execute Capcom native stage end procedure
    PHP
    SEP #$20           ; 8-bit accumulator
    LDA $1F03          ; Check cleared stage ID
    CMP #dest_stage
    BNE .normal_exit
    LDA #exit_stage    ; Target stage to resume campaign
    STA $0406          ; Force target stage ID into return register
.normal_exit:
    PLP
    RTS
```

---

## 5. Scenario Pointer Architecture (Pointers 0-4)

The stage definition table begins at ROM offset `0x000E00` (Bank `C0`):
Each stage entry holds 5 24-bit little-endian pointers:
* **Pointer 0 (`$00..$02`)**: Stage Video Registers & Mode configuration.
* **Pointer 1 (`$03..$05`)**: Graphics Tileset Scripts and VRAM DMA transfer queues.
* **Pointer 2 (`$06..$08`)**: Collision Map, Floor Lines, and Obstacle Boundaries.
* **Pointer 3 (`$09..$0B`)**: Color Palette Tables (HUD, background, and lighting).
* **Pointer 4 (`$0C..$0E`)**: Enemy Spawn Script & Wave Triggers.

### Custom Stage 44 Pure Cloning
Stage 44 inherits Pointers 0 through 3 identically from the chosen template stage, along with the 12 metadata bytes at `C0:0D35` (BGM sound track, GFX banks). Pointer 4 points to a clean free-run allocation in ROM bank `$3F0000`, guaranteeing 100% audio-video stability without black screen bugs.

