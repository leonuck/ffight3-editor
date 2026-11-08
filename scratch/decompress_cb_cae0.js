const fs = require('fs');
const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const h = (rom.length & 0x7FFF) === 512 ? 512 : 0;

function decompressCapcomCorrect(srcBuf, startOff) {
  let src = startOff;
  const typeByte = srcBuf[src++];
  const headerWord = srcBuf[src] | (srcBuf[src+1] << 8);
  src += 2;
  const extraBits = headerWord & 7;
  let blockCount = headerWord >> 3;

  const out = [];
  let bitCount = 0;
  let flagByte = 0;

  while (blockCount > 0) {
    if (bitCount === 0) {
      flagByte = srcBuf[src++];
      bitCount = 8;
    }
    const isLz = (flagByte & 1) !== 0;
    flagByte >>= 1;
    bitCount--;

    if (!isLz) {
      out.push(srcBuf[src++]);
    } else {
      const w = srcBuf[src] | (srcBuf[src+1] << 8);
      src += 2;
      const dist = (w & 0x0FFF) + 1;
      let len = (w >> 12);
      if (len === 0) {
        len = srcBuf[src++] + 0x11;
      } else {
        len += 1;
      }
      for (let k = 0; k < len; k++) {
        const copyByte = out[out.length - dist];
        out.push(copyByte !== undefined ? copyByte : 0);
      }
    }

    if (bitCount === 0) {
      blockCount--;
      if (blockCount === 0 && extraBits > 0) {
        bitCount = extraBits;
        flagByte = srcBuf[src++];
      }
    }
  }

  return { out: Buffer.from(out), bytesRead: src - startOff };
}

// In ROM: bank CB:CAE0 -> (0xCB - 0xC0) * 0x10000 + 0xCAE0 = 0x0BCAE0
const offCB = 0x0BCAE0 + h;
const res = decompressCapcomCorrect(rom, offCB);
console.log('Decompressed CB:CAE0 size:', res.out.length);
console.log('First 64 bytes:');
console.log(res.out.slice(0, 64).toString('hex').match(/../g).join(' '));
fs.writeFileSync('scratch/bar_meta_7e2000.bin', res.out);

