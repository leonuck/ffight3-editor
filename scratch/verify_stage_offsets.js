for (let stage = 1; stage <= 45; stage++) {
  const x = (stage - 1) * 16 + 3;
  const romAddr = 0x34000 + x - 3; // base entry
  console.log(`Stage ${stage}: offset = 0x${x.toString(16)}, ROM entry = 0x${romAddr.toString(16)} (C3:${(romAddr & 0xFFFF).toString(16)})`);
}

