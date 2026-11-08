const fs = require('fs');

const rom = fs.readFileSync('Final Fight 3 (USA) otimizado.sfc');
const TABLE = 0x34000;

function cmdLen(b1){return b1===0xFE||b1===0xFC?7:b1===0xFD?3:2;}
function detectHeader(buf){return (buf.length%1024===512)?512:0;}

function parseScript(rom,h,start){
  const items=[];let a=start;
  for(;;){
    if(a+17>rom.length) throw new Error('script fora da ROM');
    if(rom[a+h]!==0xFF){items.push({t:'rec',b:Array.from(rom.slice(a+h,a+h+17))});a+=17;continue;}
    const b1=rom[a+h+1],n=cmdLen(b1);
    if(b1===0xFF){return {items,end:a+2};}
    items.push({t:'cmd',b:Array.from(rom.slice(a+h,a+h+n))});a+=n;
  }
}

function loadStages(rom){
  const h=detectHeader(rom);const rows=[];let a=TABLE;
  for(;;){
    const ptrs=[];
    while(rom[a+h+2]>=0xC0&&rom[a+h+2]<0xF0){ptrs.push({at:a,v:rom[a+h]|rom[a+h+1]<<8|rom[a+h+2]<<16});a+=3;}
    if(!ptrs.length||rom[a+h]!==0)break; a++; rows.push(ptrs);
  }
  const stages=rows.map((r,i)=>{
    const p=r[r.length-1];const start=p.v-0xC00000;
    const s=parseScript(rom,h,start);
    return {row:i,id:i+1,area:i+1,ptrAt:p.at,start,end:s.end,items:s.items,orig:s.items.map(x=>x.b.slice())};
  });
  return {h,stages};
}

const {stages} = loadStages(rom);
[1, 2, 3].forEach(id => {
  const s = stages[id-1];
  let maxTrig = 0;
  let recCount = 0;
  s.items.forEach(it => {
    if(it.t==='rec'){
      recCount++;
      const trig = (it.b[2] | (it.b[3]<<8)) / 16;
      if(trig > maxTrig) maxTrig = trig;
    }
  });
  console.log(`Stage ${id}: ${recCount} enemies, maxTrig: ${maxTrig}px, maxView: ${maxTrig + 256}px`);
});
