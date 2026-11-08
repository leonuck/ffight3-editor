function getEnemyAvatarSvg(type) {
  const t = type & 0x3F;
  // Common dimensions 32x32 viewBox
  if (t === 20) { // Dave (Police Boss)
    return `<svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M6 10 Q16 4 26 10 L28 14 L4 14 Z" fill="#1e3a8a"/>
      <ellipse cx="16" cy="11" rx="3" ry="2" fill="#f59e0b"/>
      <rect x="7" y="14" width="18" height="12" rx="3" fill="#fbcfe8"/>
      <rect x="9" y="16" width="6" height="3" rx="1" fill="#0f172a"/>
      <rect x="17" y="16" width="6" height="3" rx="1" fill="#0f172a"/>
      <rect x="14" y="17" width="4" height="1" fill="#0f172a"/>
      <path d="M12 22 Q16 25 20 22" stroke="#991b1b" stroke-width="1.5" fill="none"/>
      <rect x="5" y="25" width="22" height="7" fill="#1e3a8a"/>
      <polygon points="16,25 14,32 18,32" fill="#dc2626"/>
    </svg>`;
  }
  if (t === 21) { // Callman (Bar Boss)
    return `<svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M7 6 Q16 2 25 6 L26 12 L6 12 Z" fill="#18181b"/>
      <rect x="8" y="12" width="16" height="13" rx="3" fill="#fed7aa"/>
      <rect x="9" y="14" width="6" height="3.5" rx="1" fill="#09090b"/>
      <rect x="17" y="14" width="6" height="3.5" rx="1" fill="#09090b"/>
      <line x1="15" y1="15" x2="17" y2="15" stroke="#09090b" stroke-width="1.5"/>
      <path d="M13 21 Q16 22 19 21" stroke="#78350f" stroke-width="1.5" fill="none"/>
      <path d="M6 25 L26 25 L28 32 L4 32 Z" fill="#27272a"/>
      <polygon points="16,25 14,32 18,32" fill="#ef4444"/>
    </svg>`;
  }
  if (t === 7) { // Andore
    return `<svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M13 3 L19 3 L18 10 L14 10 Z" fill="#dc2626"/>
      <rect x="6" y="9" width="20" height="14" rx="4" fill="#fcd34d"/>
      <circle cx="11" cy="13" r="2" fill="#000"/>
      <circle cx="21" cy="13" r="2" fill="#000"/>
      <path d="M10 18 Q16 22 22 18" stroke="#000" stroke-width="2" fill="none"/>
      <path d="M4 23 L28 23 L30 32 L2 32 Z" fill="#b91c1c"/>
      <line x1="4" y1="23" x2="16" y2="32" stroke="#000" stroke-width="2"/>
    </svg>`;
  }
  if (t === 6) { // May
    return `<svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M7 6 Q16 2 25 6 L27 12 L5 12 Z" fill="#9333ea"/>
      <circle cx="26" cy="14" r="5" fill="#581c87"/>
      <rect x="9" y="11" width="14" height="12" rx="3" fill="#fbcfe8"/>
      <circle cx="12" cy="14" r="1.5" fill="#3b82f6"/>
      <circle cx="20" cy="14" r="1.5" fill="#3b82f6"/>
      <path d="M13 19 Q16 21 19 19" stroke="#db2777" stroke-width="1.5" fill="none"/>
      <path d="M7 23 L25 23 L27 32 L5 32 Z" fill="#a855f7"/>
      <polygon points="27,20 31,18 29,24" fill="#cbd5e1"/>
    </svg>`;
  }
  if (t === 5) { // Billy
    return `<svg viewBox="0 0 32 32" width="28" height="28">
      <path d="M8 8 Q16 4 24 8 L24 12 L8 12 Z" fill="#fde047"/>
      <rect x="8" y="11" width="16" height="12" rx="3" fill="#fed7aa"/>
      <circle cx="12" cy="14" r="1.5" fill="#000"/>
      <circle cx="20" cy="14" r="1.5" fill="#000"/>
      <path d="M12 18 Q16 20 20 18" stroke="#000" stroke-width="1.5" fill="none"/>
      <path d="M6 23 L26 23 L28 32 L4 32 Z" fill="#78350f"/>
    </svg>`;
  }
  if (t === 14 || t === 19) { // Fat Jack / Arby
    return `<svg viewBox="0 0 32 32" width="28" height="28">
      <ellipse cx="16" cy="8" rx="10" ry="4" fill="#3b82f6"/>
      <ellipse cx="16" cy="14" rx="9" ry="8" fill="#fed7aa"/>
      <circle cx="12" cy="13" r="1.5" fill="#000"/>
      <circle cx="20" cy="13" r="1.5" fill="#000"/>
      <path d="M13 18 Q16 20 19 18" stroke="#000" stroke-width="2" fill="none"/>
      <ellipse cx="16" cy="28" rx="14" ry="7" fill="#ec4899"/>
    </svg>`;
  }
  if (t >= 27 && t <= 31) { // Barrel / Crate / Pot
    return `<svg viewBox="0 0 32 32" width="28" height="28">
      <rect x="5" y="6" width="22" height="22" rx="3" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
      <line x1="5" y1="12" x2="27" y2="12" stroke="#78350f" stroke-width="1.5"/>
      <line x1="5" y1="22" x2="27" y2="22" stroke="#78350f" stroke-width="1.5"/>
      <line x1="5" y1="6" x2="27" y2="28" stroke="#451a03" stroke-width="1.5"/>
    </svg>`;
  }
  // Default street brawler
  return `<svg viewBox="0 0 32 32" width="28" height="28">
    <circle cx="16" cy="10" r="7" fill="#fcd34d"/>
    <rect x="8" y="17" width="16" height="15" rx="3" fill="#2563eb"/>
    <circle cx="13" cy="10" r="1.5" fill="#000"/>
    <circle cx="19" cy="10" r="1.5" fill="#000"/>
    <path d="M13 14 Q16 16 19 14" stroke="#000" stroke-width="1.5" fill="none"/>
  </svg>`;
}

console.log('SVG test complete, sample Billy:', getEnemyAvatarSvg(5).length);
console.log('SVG test complete, sample Dave:', getEnemyAvatarSvg(20).length);

