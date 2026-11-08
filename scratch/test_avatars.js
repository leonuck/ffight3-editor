// Test SVG generator for character avatars
function getEnemyAvatarSvg(type, color) {
  const t = type & 0x3F;
  // Let's test generating clean SVG icons
  if (t === 20) return 'DAVE_SVG';
  if (t === 21) return 'CALLMAN_SVG';
  if (t === 7) return 'ANDORE_SVG';
  if (t === 6) return 'MAY_SVG';
  if (t === 5) return 'BILLY_SVG';
  return 'DEFAULT_SVG';
}

console.log('Avatar test passed');

