// Badge SVG generator. Run via run_script: eval(await readFile('badges/_generator.js')); await build(saveFile);
const C=256,CY=250;
const P={
 gold:{m:['#FFF4B0','#FFCB45','#F2A516','#B86E0C'],m2:['#FFE07A','#D98E14','#9A560A'],dk:'#7A4206',ic:['#FFF8D0','#FFC531','#E08A0F'],rb:['#FF8A50','#FF5D18','#C2410C'],rbd:'#7A2606',bl:['#8ED8FF','#2FA8E8','#0D5BA8'],bld:'#0B3A6E',gem:['#FFB3C8','#D4245A','#6E0A2A']},
 off:{flat:1,m:['#C3C8CF','#B4BAC2','#C3C8CF','#A9B0B8'],m2:['#B4BAC2','#A9B0B8','#9CA3AB'],dk:'#7D838C',ic:['#9CA3AB','#9CA3AB','#9CA3AB'],rb:['#B4BAC2','#B4BAC2','#B4BAC2'],rbd:'#7D838C',bl:['#B4BAC2','#B4BAC2','#B4BAC2'],bld:'#7D838C',gem:['#9CA3AB','#9CA3AB','#9CA3AB']},
 grey:{m:['#FFFFFF','#D6DADF','#A9B0B8','#6E767F'],m2:['#E4E7EA','#9BA2AA','#5E656D'],dk:'#3F454C',ic:['#FFFFFF','#CDD2D8','#8E959D'],rb:['#C4C9CF','#9CA3AB','#6E757D'],rbd:'#3F454C',bl:['#C4C9CF','#9CA3AB','#6E757D'],bld:'#3F454C',gem:['#E9ECEF','#9CA3AB','#555C64']}
};
const f=n=>(+n).toFixed(1);
const stops=a=>a.map((c,i)=>`<stop offset="${f(i/(a.length-1))}" stop-color="${c}"/>`).join('');
const defs=(p,field)=>`<defs>
<linearGradient id="m" x1="80" y1="40" x2="430" y2="470" gradientUnits="userSpaceOnUse">${stops([p.m[0],p.m[1],p.m[0],p.m[2],p.m[3]])}</linearGradient>
<linearGradient id="m2" x1="430" y1="470" x2="80" y2="40" gradientUnits="userSpaceOnUse">${stops(p.m2)}</linearGradient>
<linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">${stops([p.m[0],p.m[1],p.m[2]])}</linearGradient>
<linearGradient id="ig" x1="0" y1="0" x2="0" y2="1">${stops(p.ic)}</linearGradient>
<radialGradient id="fd" cx="256" cy="230" r="130" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${field[0]}"/><stop offset="1" stop-color="${field[1]}"/></radialGradient>
<linearGradient id="rb" x1="0" y1="0" x2="1" y2="0">${stops(p.rb)}</linearGradient>
<linearGradient id="bl" x1="0" y1="0" x2="1" y2="0">${stops(p.bl)}</linearGradient>
<linearGradient id="gm" x1="0" y1="0" x2="1" y2="1">${stops(p.gem)}</linearGradient>
</defs>`;
const pts=(n,r,off)=>Array.from({length:n},(_,k)=>{const a=(off+360/n*k)*Math.PI/180;return f(C+r*Math.cos(a))+' '+f(CY+r*Math.sin(a));});
const SH={
 circle:{d:`M${C-112} ${CY}a112 112 0 1 0 224 0a112 112 0 1 0 -224 0Z`,top:CY-112,bot:CY+112},
 shield:{d:`M146 156 L256 122 L366 156 L366 262 Q366 346 256 390 Q146 346 146 262Z`,top:122,bot:390},
 pent:{d:'M'+pts(5,128,-90).join(' L')+'Z',top:CY-128,bot:CY+104},
 hex:{d:'M'+pts(6,126,-90).join(' L')+'Z',top:CY-126,bot:CY+126}
};
const sc=s=>`transform="translate(${C} ${CY}) scale(${s}) translate(${-C} ${-CY})"`;
const shape=(k,p)=>{const d=SH[k].d;return `<path d="${d}" fill="none" stroke="${p.dk}" stroke-width="26" stroke-linejoin="round"${p.flat?' stroke-dasharray="14 10"':''}/><path d="${d}" fill="url(#m)" stroke="url(#m)" stroke-width="18" stroke-linejoin="round"/><path d="${d}" fill="url(#m2)" ${sc(.86)}/><path d="${d}" fill="url(#fd)" stroke="${p.dk}" stroke-width="3" ${sc(.78)}/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3" stroke-linejoin="round" ${sc(1.03)}/>`;};
// broad upswept feathers, top feather longest; drawn bottom-up so upper feathers overlap lower ones
const wing=(p,side,big)=>{
 const F=big?[[146,196,34],[158,168,32],[170,140,30],[182,112,28],[194,86,26]]:[[148,176,32],[161,148,30],[174,120,28],[187,92,26]];
 let s='';
 F.forEach(([deg,l,w],i)=>{const a=deg*Math.PI/180,dx=Math.cos(a),dy=-Math.sin(a),nx=dy,ny=-dx; // n points "up" side of feather
  const bx=184,by=196+i*26,tx=bx+dx*l,ty=by+dy*l;
  const ux=bx-nx*w*.5,uy=by-ny*w*.5,lx=bx+nx*w*.5,ly=by+ny*w*.5;
  const c1x=bx+dx*l*.45-nx*w*1.1,c1y=by+dy*l*.45-ny*w*1.1,c2x=bx+dx*l*.6+nx*w*.55,c2y=by+dy*l*.6+ny*w*.55;
  const d=`M${f(ux)} ${f(uy)} Q${f(c1x)} ${f(c1y)} ${f(tx)} ${f(ty)} Q${f(c2x)} ${f(c2y)} ${f(lx)} ${f(ly)}Z`;
  const hx1=bx+dx*l*.15-nx*w*.25,hy1=by+dy*l*.15-ny*w*.25,hx2=bx+dx*l*.8-nx*w*.25,hy2=by+dy*l*.8-ny*w*.25,hcx=bx+dx*l*.45-nx*w*.75,hcy=by+dy*l*.45-ny*w*.75;
  s=`<path d="${d}" fill="url(#wg)" stroke="${p.dk}" stroke-width="4" stroke-linejoin="round"/><path d="M${f(hx1)} ${f(hy1)} Q${f(hcx)} ${f(hcy)} ${f(hx2)} ${f(hy2)}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"/>`+s;});
 return side<0?`<g>${s}</g>`:`<g transform="translate(512 0) scale(-1 1)">${s}</g>`;};
const wings=(p,big)=>wing(p,-1,big)+wing(p,1,big);
const sword=(p,rot)=>`<g transform="rotate(${rot} 256 256)"><path d="M246 92 L266 92 L266 400 L256 424 L246 400Z" fill="url(#m2)" stroke="${p.dk}" stroke-width="4" stroke-linejoin="round"/><path d="M256 96 V404" stroke="#fff" stroke-opacity=".5" stroke-width="3"/><rect x="226" y="78" width="60" height="16" rx="6" fill="url(#m)" stroke="${p.dk}" stroke-width="4"/><rect x="248" y="40" width="16" height="40" rx="4" fill="url(#m2)" stroke="${p.dk}" stroke-width="4"/><circle cx="256" cy="34" r="11" fill="url(#m)" stroke="${p.dk}" stroke-width="4"/></g>`;
const swords=p=>sword(p,-32)+sword(p,32);
const spear=(p,rot)=>`<g transform="rotate(${rot} 256 256)"><rect x="250" y="70" width="12" height="300" rx="5" fill="url(#m2)" stroke="${p.dk}" stroke-width="4"/><path d="M256 14 C276 38 278 62 256 86 C234 62 236 38 256 14Z" fill="url(#m)" stroke="${p.dk}" stroke-width="4" stroke-linejoin="round"/><rect x="242" y="84" width="28" height="12" rx="5" fill="url(#m)" stroke="${p.dk}" stroke-width="4"/></g>`;
const spears=p=>spear(p,-24)+spear(p,24);
const tail=(p,id,dk,rot,y0)=>`<g transform="rotate(${rot} 256 ${y0})"><path d="M228 ${y0} H284 V${y0+130} L256 ${y0+108} L228 ${y0+130}Z" fill="url(#${id})" stroke="${dk}" stroke-width="4" stroke-linejoin="round"/><path d="M236 ${y0} V${y0+112}" stroke="#fff" stroke-opacity=".35" stroke-width="4"/></g>`;
const ribbon1=(p,y0)=>tail(p,'rb',p.rbd,0,y0);
const ribbon2=(p,id,dk,y0)=>tail(p,id,dk,-24,y0)+tail(p,id,dk,24,y0);
const gem=(p,y,s=20)=>{const t=s*.55;return `<path d="M256 ${y-s} L${256+s} ${y} L256 ${y+s} L${256-s} ${y}Z" fill="url(#m)" stroke="${p.dk}" stroke-width="4" stroke-linejoin="round"/><path d="M256 ${y-t} L${256+t} ${y} L256 ${y+t} L${256-t} ${y}Z" fill="url(#gm)"/><path d="M256 ${y-t} L${256+t} ${y} L256 ${y}Z" fill="#fff" opacity=".45"/>`;};
const crown=(p,y)=>`<path d="M204 ${y+8} L196 ${y-44} L228 ${y-22} L256 ${y-58} L284 ${y-22} L316 ${y-44} L308 ${y+8}Z" fill="url(#m)" stroke="${p.dk}" stroke-width="5" stroke-linejoin="round"/>`+[196,256,316].map((x,i)=>`<circle cx="${x}" cy="${y-(i==1?58:44)}" r="7" fill="url(#m)" stroke="${p.dk}" stroke-width="3"/>`).join('')+gem(p,y-14,13);
const laurel=p=>{const R=170,cx=C,cy=CY+10;
 const leaf=(x,y,rot)=>`<ellipse cx="${f(x)}" cy="${f(y)}" rx="10" ry="24" fill="url(#m)" stroke="${p.dk}" stroke-width="3.5" transform="rotate(${f(rot)} ${f(x)} ${f(y)})"/>`;
 let L='';for(let i=0;i<10;i++){const thd=100+i*15,th=thd*Math.PI/180,x=cx+R*Math.cos(th),y=cy+R*Math.sin(th),nx=Math.cos(th),ny=Math.sin(th);L+=leaf(x+nx*16,y+ny*16,thd+150)+leaf(x-nx*14,y-ny*14,thd+210);}
 const a0=100*Math.PI/180,a1=235*Math.PI/180,arc=`M${f(cx+R*Math.cos(a0))} ${f(cy+R*Math.sin(a0))} A${R} ${R} 0 0 1 ${f(cx+R*Math.cos(a1))} ${f(cy+R*Math.sin(a1))}`;
 const half=`<path d="${arc}" fill="none" stroke="${p.dk}" stroke-width="9" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="url(#m)" stroke-width="5" stroke-linecap="round"/>`+L;
 return `<g>${half}</g><g transform="translate(512 0) scale(-1 1)">${half}</g><rect x="236" y="${cy+R-14}" width="40" height="26" rx="8" fill="url(#m)" stroke="${p.dk}" stroke-width="4"/><path d="M248 ${cy+R-14} v26 M264 ${cy+R-14} v26" stroke="${p.dk}" stroke-width="3" opacity=".6"/>`;};
const IC={
 rocket:(p,fc)=>`<g transform="rotate(45)"><path d="M-10 24 L0 48 L10 24Z" fill="url(#rb)" stroke="${p.dk}" stroke-width="3" stroke-linejoin="round"/><path d="M-16 2 L-32 26 L-30 34 L-14 24Z M16 2 L32 26 L30 34 L14 24Z" fill="url(#ig)" stroke="${p.dk}" stroke-width="3" stroke-linejoin="round"/><path d="M0 -50 C18 -32 20 -6 16 24 L-16 24 C-20 -6 -18 -32 0 -50Z" fill="url(#ig)" stroke="${p.dk}" stroke-width="3" stroke-linejoin="round"/><circle cy="-12" r="9" fill="${fc}" stroke="${p.dk}" stroke-width="3"/></g>`,
 target:(p,fc)=>`<circle r="46" fill="url(#ig)" stroke="${p.dk}" stroke-width="3"/><circle r="33" fill="${fc}"/><circle r="21" fill="url(#ig)"/><circle r="9" fill="${fc}"/>`,
 flag:p=>`<rect x="-36" y="-48" width="10" height="98" rx="5" fill="url(#ig)" stroke="${p.dk}" stroke-width="3"/><path d="M-26 -42 C-6 -54 12 -28 42 -40 L42 4 C12 14 -6 -12 -26 0Z" fill="url(#ig)" stroke="${p.dk}" stroke-width="3" stroke-linejoin="round"/>`,
 flame:p=>`<path d="M0 -50 C10 -30 36 -18 36 12 C36 34 20 48 0 48 C-20 48 -36 34 -36 12 C-36 -8 -24 -16 -20 -32 C-12 -20 -8 -12 -4 -8 C-6 -24 -4 -38 0 -50Z" fill="url(#ig)" stroke="${p.dk}" stroke-width="3" stroke-linejoin="round"/><path d="M2 2 C10 12 18 18 18 28 C18 38 10 44 0 44 C-10 44 -18 38 -18 28 C-18 16 -6 12 2 2Z" fill="url(#rb)"/>`,
 chat:p=>`<path d="M-4 -12 H36 Q46 -12 46 -2 V22 Q46 32 36 32 H34 L38 46 L22 32 H-4 Q-14 32 -14 22 V-2 Q-14 -12 -4 -12Z" fill="url(#ig)" stroke="${p.dk}" stroke-width="3" stroke-linejoin="round"/><path d="M-36 -42 H4 Q14 -42 14 -32 V-8 Q14 2 4 2 H-22 L-38 16 L-34 2 H-36 Q-46 2 -46 -8 V-32 Q-46 -42 -36 -42Z" fill="url(#ig)" stroke="${p.dk}" stroke-width="3" stroke-linejoin="round"/><path d="M-34 -26 H2 M-34 -14 H-8" stroke="${p.dk}" stroke-width="4" stroke-linecap="round" opacity=".5"/>`,
 book:p=>`<path d="M-2 -30 C-16 -42 -34 -42 -48 -36 V36 C-34 30 -16 30 -2 42Z M2 -30 C16 -42 34 -42 48 -36 V36 C34 30 16 30 2 42Z" fill="url(#ig)" stroke="${p.dk}" stroke-width="3" stroke-linejoin="round"/><path d="M-38 -20 C-28 -24 -18 -24 -12 -18 M-38 -6 C-28 -10 -18 -10 -12 -4 M-38 8 C-28 4 -18 4 -12 10 M38 -20 C28 -24 18 -24 12 -18 M38 -6 C28 -10 18 -10 12 -4 M38 8 C28 4 18 4 12 10" fill="none" stroke="${p.dk}" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>`,
 heart:p=>`<path d="M0 46 C-30 24 -48 6 -48 -14 C-48 -34 -34 -46 -19 -46 C-9 -46 -3 -40 0 -33 C3 -40 9 -46 19 -46 C34 -46 48 -34 48 -14 C48 6 30 24 0 46Z" fill="url(#ig)" stroke="${p.dk}" stroke-width="3" stroke-linejoin="round"/><path d="M-30 -24 C-28 -34 -18 -36 -12 -32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`,
 trophy:p=>`<path d="M-30 -36 H-44 V-24 C-44 -10 -36 -4 -26 -4 M30 -36 H44 V-24 C44 -10 36 -4 26 -4" fill="none" stroke="${p.dk}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M-30 -36 H-44 V-24 C-44 -10 -36 -4 -26 -4 M30 -36 H44 V-24 C44 -10 36 -4 26 -4" fill="none" stroke="url(#m)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="-7" y="14" width="14" height="18" fill="url(#ig)" stroke="${p.dk}" stroke-width="3"/><rect x="-26" y="30" width="52" height="14" rx="4" fill="url(#ig)" stroke="${p.dk}" stroke-width="3"/><path d="M-32 -46 H32 V-14 C32 6 18 18 0 18 C-18 18 -32 6 -32 -14Z" fill="url(#ig)" stroke="${p.dk}" stroke-width="3" stroke-linejoin="round"/><path d="M-20 -36 V-14 C-20 -4 -14 2 -8 4" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>`,
 bolt:p=>`<path d="M10 -50 L-32 6 H-4 L-12 50 L32 -8 H4Z" fill="url(#ig)" stroke="${p.dk}" stroke-width="3" stroke-linejoin="round"/>`,
 star:p=>{const s=Array.from({length:10},(_,k)=>{const r=k%2?21:50,a=(-90+36*k)*Math.PI/180;return f(r*Math.cos(a))+' '+f(r*Math.sin(a)+3);});return `<path d="M${s.join(' L')}Z" fill="url(#ig)" stroke="${p.dk}" stroke-width="4" stroke-linejoin="round"/><path d="M0 -40 L0 3 L-44 -12Z" fill="#fff" opacity=".25"/>`;}
};
const icon=(k,p,fc,s=1.15)=>(p.flat?'':`<g transform="translate(${C} ${CY+4}) scale(${s})" opacity=".35"><g transform="translate(0 4)">${IC[k](p,'#000').replace(/url\(#(ig|m|rb)\)/g,'#000')}</g></g>`)+`<g transform="translate(${C} ${CY}) scale(${s})">${IC[k](p,fc)}</g>`;
const BADGES=[
 {id:'kickoff',name:'Kickoff',field:['#6B4524','#3A220F'],build:(p,fc)=>wings(p)+shape('circle',p)+icon('rocket',p,fc)+gem(p,SH.circle.bot)},
 {id:'goal-setter',name:'Goal setter',field:['#6A1A28','#320810'],build:(p,fc)=>swords(p)+wings(p)+shape('shield',p)+icon('target',p,fc)+gem(p,SH.shield.bot-6)},
 {id:'halfway-there',name:'Halfway there',field:['#5E3D22','#2F1C0C'],build:(p,fc)=>swords(p)+wings(p)+ribbon1(p,300)+shape('pent',p)+icon('flag',p,fc,1.05)},
 {id:'on-a-roll',name:'On a roll',field:['#5A3518','#2A170A'],build:(p,fc)=>wings(p,1)+ribbon2(p,'bl',p.bld,310)+shape('pent',p)+crown(p,SH.pent.top+6)+icon('flame',p,fc,1.05)},
 {id:'feedback-seeker',name:'Feedback seeker',field:['#3B2A8A','#1A0F4A'],build:(p,fc)=>wings(p)+shape('hex',p)+icon('chat',p,fc,1.1)+gem(p,SH.hex.bot)},
 {id:'storyteller',name:'Storyteller',field:['#1C3E6E','#0A1C38'],build:(p,fc)=>spears(p)+wings(p)+ribbon1(p,320)+shape('hex',p)+icon('book',p,fc,1.1)},
 {id:'encourager',name:'Encourager',field:['#6E1E3E','#360A1C'],build:(p,fc)=>ribbon2(p,'rb',p.rbd,300)+shape('circle',p)+icon('heart',p,fc,1.15)},
 {id:'path-complete',name:'Path complete',field:['#000','#000'],build:(p,fc)=>ribbon1(p,330)+laurel(p)+`<g transform="translate(0 -6)">${icon('trophy',p,fc,1.7)}</g>`},
 {id:'streak-keeper',name:'Streak keeper',field:['#1E5A34','#0B2C17'],build:(p,fc)=>wings(p,1)+shape('hex',p)+crown(p,SH.hex.top+8)+icon('bolt',p,fc,1.1)},
 {id:'champion',name:'Champion',field:['#5A1428','#2A0610'],build:(p,fc)=>swords(p)+wings(p,1)+ribbon2(p,'rb',p.rbd,320)+shape('shield',p)+crown(p,SH.shield.top+4)+icon('star',p,fc,1.15)},
];
const ST={earned:[P.gold,null,''],locked:[P.grey,['#4A5058','#24282D'],'-locked'],disabled:[P.off,['#E6E9ED','#D5D9DE'],'-disabled']};
async function build(save){for(const b of BADGES)for(const st in ST){const [p,fo,suf]=ST[st],field=fo||b.field;let body=b.build(p,field[1]);if(p.flat)body=`<g opacity=".6">${body.replace(/stroke="#fff"/g,'stroke="none"').replace(/fill="#fff"/g,'fill="none"')}</g>`;
 await save(`badges/${b.id}${suf}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><title>${b.name}${st=='earned'?'':' ('+st+')'}</title>${defs(p,field)}${body}</svg>`);}}
