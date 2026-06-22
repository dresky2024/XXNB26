// ============================================================
// HITECH APARTMENT RENDERS - CANVAS DRAWING ENGINE
// ============================================================

// Color palette
const C = {
  bg: '#04040c', bg2: '#080814', bg3: '#0c0c1c',
  wall: '#0e0e1e', wallDark: '#0a0a16', wallLight: '#141428',
  floor: '#111122', floorLight: '#181830',
  cyan: '#00d4ff', cyanDim: 'rgba(0,212,255,0.4)',
  purple: '#a855f7', purpleDim: 'rgba(168,85,247,0.4)',
  orange: '#f97316',
  steel: '#2a2a3e', steelLight: '#3a3a50',
  black: '#060610', blackMat: '#0a0a18',
  white: '#f0f0ff', gray: '#505070',
  ledWarm: 'rgba(255,240,200,0.8)',
  ledCool: 'rgba(200,230,255,0.8)',
  glowCyan: 'rgba(0,212,255,0.15)',
  glowPurple: 'rgba(168,85,247,0.12)',
};

// Helper: draw gradient rect
function gRect(ctx, x, y, w, h, c1, c2, dir='v') {
  const g = dir === 'v'
    ? ctx.createLinearGradient(x, y, x, y+h)
    : ctx.createLinearGradient(x, y, x+w, y);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
}
function gRectD(ctx, x, y, w, h, c1, c2) {
  const g = ctx.createLinearGradient(x, y, x+w, y+h);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
}

// Draw LED strip
function ledStrip(ctx, x, y, w, h, color, vertical=false) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, vertical ? h : w, vertical ? w : h);
  ctx.shadowColor = color.replace('0.', '0.8,').replace('rgb', 'rgba').replace(')', ',0.8)') || color;
  ctx.shadowBlur = 20;
  ctx.fillRect(x, y, vertical ? h : w, vertical ? w : h);
  ctx.shadowBlur = 0;
}

// Draw ambient glow
function glow(ctx, cx, cy, r, color) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, color); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g; ctx.fillRect(cx-r, cy-r, r*2, r*2);
}

// ============================================================
// ROOM 01 - LIVING ROOM MAIN VIEW
// ============================================================
function drawLivingMain(id) {
  const cv = document.getElementById(id); if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;

  // Background / walls
  gRect(ctx, 0, 0, W, H, '#05050f', '#0a0a1a');
  
  // Left wall (angled perspective)
  ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(W*0.18, 0);
  ctx.lineTo(W*0.18, H); ctx.lineTo(0, H); ctx.closePath();
  gRect(ctx, 0, 0, W*0.18, H, '#0c0c20', '#08081a');
  // Left wall vertical LED lines
  for(let i=0; i<3; i++) {
    const x = W*0.04 + i*W*0.05;
    const g = ctx.createLinearGradient(x, H*0.1, x, H*0.85);
    g.addColorStop(0,'transparent'); g.addColorStop(0.5,C.cyanDim); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(x-1, H*0.1, 2, H*0.75);
  }

  // Back wall
  gRect(ctx, W*0.18, 0, W*0.62, H, '#080812', '#0d0d20');
  
  // Floor - large format ceramic tiles
  const floorY = H*0.68;
  gRect(ctx, 0, floorY, W, H-floorY, '#0e0e1e', '#080810');
  // Tile grid
  ctx.strokeStyle = 'rgba(0,212,255,0.06)'; ctx.lineWidth = 1;
  for(let x=0; x<W; x+=W/12) { ctx.beginPath(); ctx.moveTo(x,floorY); ctx.lineTo(x,H); ctx.stroke(); }
  for(let y=floorY; y<H; y+=(H-floorY)/3) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  // Floor reflection glow
  gRect(ctx, 0, floorY, W, 30, 'rgba(0,212,255,0.05)', 'transparent');

  // Ceiling
  gRect(ctx, W*0.18, 0, W*0.62, H*0.1, '#07071a', '#0a0a18');
  // Ceiling LED strip - RGB
  const ledG = ctx.createLinearGradient(W*0.18, 0, W*0.8, 0);
  ledG.addColorStop(0,'transparent'); ledG.addColorStop(0.15,'rgba(0,212,255,0.8)');
  ledG.addColorStop(0.35,'rgba(168,85,247,0.7)'); ledG.addColorStop(0.65,'rgba(0,212,255,0.8)');
  ledG.addColorStop(0.85,'rgba(249,115,22,0.5)'); ledG.addColorStop(1,'transparent');
  ctx.fillStyle = ledG; ctx.fillRect(W*0.18, H*0.1-3, W*0.62, 3);
  ctx.shadowColor='#00d4ff'; ctx.shadowBlur=25;
  ctx.fillStyle=ledG; ctx.fillRect(W*0.18, H*0.1-3, W*0.62, 3);
  ctx.shadowBlur=0;
  // Ceiling downlights
  [0.25,0.4,0.55,0.68].forEach(fx => {
    ctx.beginPath(); ctx.arc(W*fx, H*0.09, 5, 0, Math.PI*2);
    ctx.fillStyle='#ffffff'; ctx.fill();
    ctx.shadowColor='rgba(255,255,255,0.5)'; ctx.shadowBlur=18;
    ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.fill();
    ctx.shadowBlur=0;
  });

  // TV wall - black panel  
  gRect(ctx, W*0.19, H*0.12, W*0.52, H*0.52, '#0a0a18', '#060610');
  ctx.strokeStyle='rgba(0,212,255,0.15)'; ctx.lineWidth=1;
  ctx.strokeRect(W*0.19, H*0.12, W*0.52, H*0.52);

  // TV screen 65"
  gRectD(ctx, W*0.21, H*0.14, W*0.42, H*0.38, '#0a1a2a', '#030308');
  // TV screen content glow
  glow(ctx, W*0.42, H*0.33, W*0.2, 'rgba(0,150,255,0.08)');
  // TV backlight RGB
  const tvGlow = ctx.createRadialGradient(W*0.42, H*0.33, 0, W*0.42, H*0.33, W*0.3);
  tvGlow.addColorStop(0,'transparent'); tvGlow.addColorStop(0.7,'transparent');
  tvGlow.addColorStop(1,'rgba(0,212,255,0.06)');
  ctx.fillStyle=tvGlow; ctx.fillRect(W*0.18, H*0.1, W*0.62, H*0.6);
  // TV frame border glow
  ctx.strokeStyle='rgba(0,212,255,0.08)'; ctx.lineWidth=2;
  ctx.strokeRect(W*0.205, H*0.135, W*0.43, H*0.39);
  // TV logo dot
  ctx.beginPath(); ctx.arc(W*0.42, H*0.55, 3, 0, Math.PI*2);
  ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.fill();
  // Horizontal accent strip below TV
  gRect(ctx, W*0.19, H*0.65, W*0.52, 2, 'rgba(0,212,255,0.4)', 'rgba(0,212,255,0.0)','h');

  // Right wall
  gRect(ctx, W*0.8, 0, W*0.2, H, '#0c0c1e', '#080816');
  // Modular shelf unit on right
  const shelfColors = ['#0e0e20','#121228','#0a0a18'];
  for(let i=0; i<4; i++) {
    ctx.fillStyle=shelfColors[i%3]; ctx.fillRect(W*0.82, H*0.2+i*H*0.1, W*0.15, H*0.08);
    ctx.strokeStyle='rgba(0,212,255,0.1)'; ctx.lineWidth=1; ctx.strokeRect(W*0.82, H*0.2+i*H*0.1, W*0.15, H*0.08);
  }

  // SOFA - modular dark gray
  const sx=W*0.2, sy=H*0.58, sw=W*0.35, sh=H*0.1;
  gRect(ctx, sx, sy, sw, sh, '#1a1a2e','#0e0e1c');
  ctx.strokeStyle='rgba(0,212,255,0.1)'; ctx.strokeRect(sx,sy,sw,sh);
  // Sofa back
  gRect(ctx, sx, sy-sh*0.6, sw, sh*0.6, '#1e1e32','#14142a');
  ctx.strokeRect(sx, sy-sh*0.6, sw, sh*0.6);
  // Sofa cushions
  for(let i=0;i<3;i++) {
    gRect(ctx, sx+4+i*(sw/3-2), sy-sh*0.55, sw/3-6, sh*0.5,'#20203a','#16162c');
    ctx.strokeStyle='rgba(0,212,255,0.06)'; ctx.strokeRect(sx+4+i*(sw/3-2), sy-sh*0.55, sw/3-6, sh*0.5);
  }
  // Sofa legs
  [0.05, 0.93].forEach(fx => { ctx.fillStyle='#0a0a1c'; ctx.fillRect(sx+sw*fx-3, sy+sh, 6, H*0.03); });

  // Coffee table - glass/metal
  const tx=W*0.24, ty=H*0.66, tw=W*0.14, th=H*0.02;
  gRect(ctx, tx, ty, tw, th, 'rgba(0,212,255,0.12)','rgba(0,212,255,0.05)');
  ctx.strokeStyle='rgba(0,212,255,0.3)'; ctx.lineWidth=1; ctx.strokeRect(tx, ty, tw, th);
  // Table reflect on floor
  gRect(ctx, tx, ty+th, tw, H*0.02, 'rgba(0,212,255,0.05)','transparent');
  // Table legs
  [[0.1,0],[0.9,0]].forEach(([fx]) => { ctx.fillStyle='rgba(0,212,255,0.3)'; ctx.fillRect(tx+tw*fx-1, ty+th, 2, H*0.04); });
  
  // Floor lamp right side
  ctx.fillStyle='rgba(0,212,255,0.3)'; ctx.fillRect(W*0.61, floorY-H*0.28, 2, H*0.28);
  glow(ctx, W*0.61, floorY-H*0.3, 40, 'rgba(0,212,255,0.15)');

  // Ambient glows
  glow(ctx, W*0.42, H*0.4, 200, 'rgba(0,212,255,0.04)');
  glow(ctx, W*0.75, H*0.3, 120, 'rgba(168,85,247,0.03)');
  glow(ctx, W*0.18, H*0.5, 100, 'rgba(0,212,255,0.03)');

  // Perspective lines for depth
  ctx.strokeStyle='rgba(0,212,255,0.03)'; ctx.lineWidth=1;
  for(let y=H*0.1; y<H; y+=H/20) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
}


// ============================================================
// ROOM 01 - LIVING WALL (accent wall detail)
// ============================================================
function drawLivingWall(id) {
  const cv = document.getElementById(id); if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  gRect(ctx, 0, 0, W, H, '#060610', '#0c0c1c');
  // Metal panels
  const pw=W/6;
  for(let i=0; i<6; i++) {
    const x=i*pw; const isDark=i%2===0;
    gRect(ctx, x+2, H*0.1, pw-4, H*0.8, isDark?'#0e0e22':'#141430', isDark?'#0a0a18':'#0e0e24');
    ctx.strokeStyle='rgba(0,212,255,0.12)'; ctx.lineWidth=1;
    ctx.strokeRect(x+2, H*0.1, pw-4, H*0.8);
    // Brushed metal texture lines
    for(let j=0; j<12; j++) {
      ctx.fillStyle=`rgba(255,255,255,${0.008*Math.random()})`;
      ctx.fillRect(x+4, H*0.12+j*(H*0.65/12), pw-8, 1);
    }
  }
  // Vertical LED strips between panels
  for(let i=1; i<6; i++) {
    const x=i*pw;
    const g=ctx.createLinearGradient(x,H*0.05,x,H*0.95);
    g.addColorStop(0,'transparent'); g.addColorStop(0.3,'rgba(0,212,255,0.7)');
    g.addColorStop(0.7,'rgba(0,212,255,0.5)'); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(x-1,H*0.05,2,H*0.9);
    ctx.shadowColor='#00d4ff'; ctx.shadowBlur=15;
    ctx.fillStyle=g; ctx.fillRect(x-1,H*0.05,2,H*0.9); ctx.shadowBlur=0;
  }
  // Floor
  gRect(ctx, 0, H*0.9, W, H*0.1, '#0e0e20','#08080e');
  ctx.strokeStyle='rgba(0,212,255,0.08)'; ctx.lineWidth=1;
  for(let x=0;x<W;x+=W/8){ctx.beginPath();ctx.moveTo(x,H*0.9);ctx.lineTo(x,H);ctx.stroke();}
  // Floor glow
  glow(ctx, W*0.5, H*0.92, W*0.6, 'rgba(0,212,255,0.04)');
  // Label
  ctx.fillStyle='rgba(0,212,255,0.6)';ctx.font='bold 11px monospace';
  ctx.fillText('ВОРОНЕНАЯ СТАЛЬ · ВЕРТИКАЛЬНЫЕ LED', 20, H-15);
}

// ============================================================
// ROOM 01 - LIVING NIGHT MODE
// ============================================================
function drawLivingNight(id) {
  const cv = document.getElementById(id); if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  gRect(ctx, 0, 0, W, H, '#02020a', '#050510');
  // Night floor reflection
  gRect(ctx, 0, H*0.65, W, H*0.35, '#060610','#030308');
  for(let x=0;x<W;x+=W/12){ctx.strokeStyle='rgba(0,212,255,0.04)';ctx.beginPath();ctx.moveTo(x,H*0.65);ctx.lineTo(x,H);ctx.stroke();}
  // Ceiling glow bands
  const bandG = ctx.createLinearGradient(0,0,W,0);
  bandG.addColorStop(0,'transparent');bandG.addColorStop(0.1,'rgba(168,85,247,0.5)');
  bandG.addColorStop(0.3,'rgba(0,212,255,0.6)');bandG.addColorStop(0.5,'rgba(249,115,22,0.4)');
  bandG.addColorStop(0.7,'rgba(168,85,247,0.5)');bandG.addColorStop(0.9,'rgba(0,212,255,0.4)');
  bandG.addColorStop(1,'transparent');
  ctx.fillStyle=bandG; ctx.fillRect(0,H*0.1-4,W,4);
  ctx.shadowColor='#a855f7'; ctx.shadowBlur=30; ctx.fillStyle=bandG; ctx.fillRect(0,H*0.1-4,W,4); ctx.shadowBlur=0;
  // Band reflection on ceiling
  ctx.fillStyle=bandG; ctx.fillRect(0,0,W,H*0.1);
  // TV glow dominating
  const tvG=ctx.createRadialGradient(W*0.45,H*0.35,0,W*0.45,H*0.35,W*0.4);
  tvG.addColorStop(0,'rgba(0,80,180,0.12)');tvG.addColorStop(1,'transparent');
  ctx.fillStyle=tvG;ctx.fillRect(0,0,W,H);
  // TV screen bright
  gRectD(ctx,W*0.22,H*0.14,W*0.44,H*0.38,'#0d1e3a','#030315');
  glow(ctx,W*0.44,H*0.33,W*0.2,'rgba(0,100,255,0.1)');
  // Sofa silhouette
  ctx.fillStyle='#0a0a18'; ctx.fillRect(W*0.2,H*0.57,W*0.36,H*0.12);
  ctx.fillRect(W*0.2,H*0.5,W*0.36,H*0.07);
  // Sofa under-glow purple
  glow(ctx,W*0.38,H*0.7,'rgba(168,85,247,0.08)');
  // Ambient dots
  [[0.2,0.9,'rgba(0,212,255,0.3)'],[0.6,0.88,'rgba(168,85,247,0.25)'],[0.9,0.91,'rgba(0,212,255,0.2)']].forEach(([x,y,c])=>{
    ctx.beginPath();ctx.arc(W*x,H*y,2,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();
  });
  glow(ctx,W*0.42,H*0.4,W*0.15,'rgba(168,85,247,0.05)');
  ctx.fillStyle='rgba(168,85,247,0.6)';ctx.font='bold 11px monospace';
  ctx.fillText('НОЧНОЙ РЕЖИМ · RGB AMBIENT LIGHT', 20, H-15);
}


// ============================================================
// ROOM 02 - KITCHEN MAIN
// ============================================================
function drawKitchenMain(id) {
  const cv = document.getElementById(id); if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  gRect(ctx, 0, 0, W, H, '#06060e', '#0c0c1a');

  // Window (natural light source)
  const wX=W*0.55,wY=H*0.1,wW=W*0.38,wH=H*0.55;
  gRectD(ctx, wX, wY, wW, wH, '#1a3a18','#0d200c');
  // Window glass light
  ctx.fillStyle='rgba(180,230,160,0.06)'; ctx.fillRect(wX,wY,wW,wH);
  // Trees/greenery
  for(let i=0;i<5;i++){
    const gx=wX+i*(wW/5),gy=wY+wH*0.4;
    const g=ctx.createRadialGradient(gx+wW/10,gy,0,gx+wW/10,gy,wW/6);
    g.addColorStop(0,'rgba(30,80,20,0.6)'); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(gx,wY,wW/5,wH*0.6);
  }
  // Window frame
  ctx.strokeStyle='rgba(0,212,255,0.2)'; ctx.lineWidth=3;
  ctx.strokeRect(wX,wY,wW,wH);
  ctx.strokeStyle='rgba(0,212,255,0.1)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(wX+wW/2,wY); ctx.lineTo(wX+wW/2,wY+wH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(wX,wY+wH/2); ctx.lineTo(wX+wW,wY+wH/2); ctx.stroke();
  // Light cone from window
  const lG=ctx.createLinearGradient(wX,0,0,0);
  lG.addColorStop(0,'rgba(200,255,150,0.04)'); lG.addColorStop(1,'transparent');
  ctx.fillStyle=lG; ctx.fillRect(0,wY,wX,wH);

  // Upper cabinets - stainless steel
  const ucY=H*0.1, ucH=H*0.28;
  gRect(ctx, W*0.02, ucY, W*0.5, ucH, '#1e1e30','#141428');
  // Cabinet doors
  const numC=4;
  for(let i=0;i<numC;i++){
    const cx=W*0.02+i*(W*0.5/numC), cw=W*0.5/numC;
    gRect(ctx, cx+2, ucY+3, cw-4, ucH-6, '#222238','#181830');
    // Steel texture
    for(let j=0;j<8;j++){ctx.fillStyle=`rgba(255,255,255,${0.015})`;ctx.fillRect(cx+4,ucY+5+j*(ucH/9),cw-8,1);}
    ctx.strokeStyle='rgba(0,212,255,0.15)'; ctx.lineWidth=1; ctx.strokeRect(cx+2,ucY+3,cw-4,ucH-6);
    // Handle
    gRect(ctx, cx+cw*0.3, ucY+ucH*0.85, cw*0.4, 4,'rgba(0,212,255,0.5)','rgba(0,212,255,0.3)','h');
  }
  // Under-cabinet LED
  const ulG=ctx.createLinearGradient(W*0.02,0,W*0.52,0);
  ulG.addColorStop(0,'transparent'); ulG.addColorStop(0.15,'rgba(0,212,255,0.8)');
  ulG.addColorStop(0.85,'rgba(0,212,255,0.8)'); ulG.addColorStop(1,'transparent');
  ctx.fillStyle=ulG; ctx.fillRect(W*0.02, ucY+ucH, W*0.5, 3);
  ctx.shadowColor='#00d4ff'; ctx.shadowBlur=18; ctx.fillStyle=ulG; ctx.fillRect(W*0.02,ucY+ucH,W*0.5,3); ctx.shadowBlur=0;

  // Hood above hob
  const hX=W*0.15, hY=H*0.05, hW=W*0.2, hH=H*0.18;
  gRect(ctx, hX, hY, hW, hH, '#1a1a2e','#0e0e20');
  ctx.strokeStyle='rgba(0,212,255,0.2)'; ctx.strokeRect(hX,hY,hW,hH);
  // Hood vent grille
  for(let i=0;i<4;i++){ctx.fillStyle='rgba(0,212,255,0.15)';ctx.fillRect(hX+8,hY+hH*0.5+i*6,hW-16,3);}

  // Countertop - microcement
  const ctY=H*0.38, ctH=H*0.05;
  gRect(ctx, W*0.02, ctY, W*0.5, ctH, '#1c1c2c','#121220');
  ctx.strokeStyle='rgba(0,212,255,0.2)'; ctx.lineWidth=1; ctx.strokeRect(W*0.02, ctY, W*0.5, ctH);
  // Counter edge glow
  const ceG=ctx.createLinearGradient(W*0.02,0,W*0.52,0);
  ceG.addColorStop(0,'transparent'); ceG.addColorStop(0.5,'rgba(0,212,255,0.3)'); ceG.addColorStop(1,'transparent');
  ctx.fillStyle=ceG; ctx.fillRect(W*0.02, ctY, W*0.5, 2);

  // Backsplash tiles - graphite
  const bsY=ucY+ucH+3, bsH=ctY-ucY-ucH-3;
  const tW=W*0.5/12, tH=bsH/3;
  for(let col=0;col<12;col++) for(let row=0;row<3;row++) {
    const tx=W*0.02+col*tW, ty2=bsY+row*tH;
    const shade=col%2===0?'#121224':'#0e0e1e';
    ctx.fillStyle=shade; ctx.fillRect(tx+1,ty2+1,tW-2,tH-2);
    ctx.strokeStyle='rgba(0,212,255,0.07)'; ctx.strokeRect(tx+1,ty2+1,tW-2,tH-2);
  }

  // Sink
  const skX=W*0.22, skY=ctY+4, skW=W*0.12, skH=ctH-8;
  ctx.fillStyle='#06060e'; ctx.fillRect(skX,skY,skW,skH);
  ctx.strokeStyle='rgba(0,212,255,0.3)'; ctx.strokeRect(skX,skY,skW,skH);
  // Faucet
  ctx.fillStyle='rgba(0,212,255,0.4)'; ctx.fillRect(skX+skW*0.4,ctY-20,4,24); ctx.fillRect(skX+skW*0.4,ctY-20,skW*0.3,4);

  // Induction hob
  const iX=W*0.06, iY=ctY+2, iW=W*0.14, iH=ctH-4;
  ctx.fillStyle='#0a0a18'; ctx.fillRect(iX,iY,iW,iH);
  ctx.strokeStyle='rgba(0,212,255,0.15)'; ctx.strokeRect(iX,iY,iW,iH);
  // Hob rings
  [[0.3,0.35,0.22,0.5,'rgba(255,90,0,0.5)'],[0.7,0.35,0.18,0.4,'rgba(0,212,255,0.15)'],
   [0.3,0.75,0.2,0.45,'rgba(255,80,0,0.4)'],[0.72,0.75,0.15,0.35,'rgba(0,212,255,0.1)']].forEach(([fx,fy,fr,op,c])=>{
    ctx.beginPath(); ctx.arc(iX+iW*fx,iY+iH*fy,iW*fr,0,Math.PI*2);
    ctx.strokeStyle=c; ctx.lineWidth=2; ctx.stroke();
    if(c.includes('255,90') || c.includes('255,80')){
      ctx.shadowColor='rgba(255,80,0,0.6)'; ctx.shadowBlur=12; ctx.stroke(); ctx.shadowBlur=0;
    }
  });

  // Lower cabinets - matt black
  const lcY=ctY+ctH, lcH=H-ctY-ctH;
  for(let i=0;i<5;i++){
    const cx=W*0.02+i*(W*0.5/5), cw=W*0.5/5;
    gRect(ctx, cx+2, lcY, cw-4, lcH*0.85,'#0c0c1c','#080810');
    ctx.strokeStyle='rgba(0,212,255,0.08)'; ctx.strokeRect(cx+2,lcY,cw-4,lcH*0.85);
    ctx.fillStyle='rgba(0,212,255,0.3)'; ctx.fillRect(cx+cw*0.3,lcY+lcH*0.5,cw*0.4,3);
  }

  // Kitchen floor
  gRect(ctx, 0, H*0.85, W, H*0.15, '#0e0e1c','#080810');
  for(let x=0;x<W;x+=W/10){ctx.strokeStyle='rgba(0,212,255,0.05)';ctx.beginPath();ctx.moveTo(x,H*0.85);ctx.lineTo(x,H);ctx.stroke();}

  // Ambient from window
  glow(ctx, wX, H*0.4, 150, 'rgba(150,255,100,0.04)');
  // LED strip glow
  glow(ctx, W*0.26, ucY+ucH+5, 80, 'rgba(0,212,255,0.08)');
}

// ============================================================
// ROOM 02 - KITCHEN DETAIL
// ============================================================
function drawKitchenDetail(id) {
  const cv=document.getElementById(id); if(!cv) return;
  const ctx=cv.getContext('2d'); const W=cv.width,H=cv.height;
  gRect(ctx,0,0,W,H,'#06060e','#0a0a18');
  // Backsplash detail
  const tW=W/8,tH=H/4;
  for(let c=0;c<8;c++) for(let r=0;r<4;r++){
    const x=c*tW,y=r*tH; const d=(c+r)%2===0;
    gRectD(ctx,x+1,y+1,tW-2,tH-2,d?'#131325':'#0f0f1f',d?'#0d0d1c':'#0b0b16');
    ctx.strokeStyle='rgba(0,212,255,0.06)'; ctx.lineWidth=1; ctx.strokeRect(x+1,y+1,tW-2,tH-2);
  }
  // Counter
  gRect(ctx,0,H*0.75,W,H*0.08,'#1a1a28','#111120');
  ctx.strokeStyle='rgba(0,212,255,0.2)'; ctx.strokeRect(0,H*0.75,W,H*0.08);
  // LED counter edge
  const eG=ctx.createLinearGradient(0,0,W,0);
  eG.addColorStop(0,'transparent');eG.addColorStop(0.5,'rgba(0,212,255,0.6)');eG.addColorStop(1,'transparent');
  ctx.fillStyle=eG;ctx.fillRect(0,H*0.75,W,2);
  ctx.shadowColor='#00d4ff';ctx.shadowBlur=12;ctx.fillStyle=eG;ctx.fillRect(0,H*0.75,W,2);ctx.shadowBlur=0;
  // Lower cabinets
  gRect(ctx,0,H*0.83,W,H*0.17,'#0a0a18','#060610');
  ctx.strokeStyle='rgba(0,212,255,0.08)';ctx.strokeRect(0,H*0.83,W,H*0.17);
  ctx.fillStyle='rgba(0,212,255,0.8)';ctx.fillText('ФАРТУК · ГРАФИТ 30×60 · LED СТОЛЕШНИЦА', 15, H-15);
}

// ============================================================
// ROOM 03 - BATHROOM MAIN
// ============================================================
function drawBathMain(id) {
  const cv=document.getElementById(id); if(!cv) return;
  const ctx=cv.getContext('2d'); const W=cv.width,H=cv.height;
  gRect(ctx,0,0,W,H,'#04040c','#08081a');

  // Ceiling white glossy
  gRect(ctx,0,0,W,H*0.1,'#e8e8f8','#d0d0e8');
  // Downlights
  [0.2,0.5,0.8].forEach(fx=>{
    ctx.beginPath(); ctx.arc(W*fx,H*0.06,6,0,Math.PI*2);
    ctx.fillStyle='#ffffff'; ctx.fill();
    ctx.shadowColor='rgba(255,255,255,0.8)'; ctx.shadowBlur=24; ctx.fill(); ctx.shadowBlur=0;
    // Light cone
    const cG=ctx.createRadialGradient(W*fx,H*0.1,0,W*fx,H*0.1,H*0.6);
    cG.addColorStop(0,'rgba(255,255,255,0.05)');cG.addColorStop(1,'transparent');
    ctx.fillStyle=cG; ctx.fillRect(W*fx-H*0.3,H*0.1,H*0.6,H*0.6);
  });

  // Anthracite tile walls
  const tW=W/14, tH=H/7;
  for(let c=0;c<14;c++) for(let r=1;r<7;r++){
    const x=c*tW, y=r*tH;
    const shade=(c+r)%3===0?'#111122':(c+r)%3===1?'#0d0d1c':'#0f0f20';
    ctx.fillStyle=shade; ctx.fillRect(x+1,y+1,tW-2,tH-2);
    ctx.strokeStyle='rgba(0,212,255,0.05)'; ctx.lineWidth=1; ctx.strokeRect(x+1,y+1,tW-2,tH-2);
  }

  // Floor tiles
  const fY=H*0.82, ftW=W/8, ftH=(H-fY)/3;
  for(let c=0;c<8;c++) for(let r=0;r<3;r++){
    const x=c*ftW, y=fY+r*ftH;
    ctx.fillStyle=c%2===0?'#0e0e1e':'#0c0c1c'; ctx.fillRect(x+1,y+1,ftW-2,ftH-2);
    ctx.strokeStyle='rgba(0,212,255,0.06)'; ctx.strokeRect(x+1,y+1,ftW-2,ftH-2);
  }

  // LED Mirror
  const mX=W*0.05, mY=H*0.12, mW=W*0.32, mH=H*0.45;
  gRectD(ctx,mX,mY,mW,mH,'rgba(0,212,255,0.06)','rgba(168,85,247,0.04)');
  ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=2; ctx.strokeRect(mX,mY,mW,mH);
  // Mirror LED sides
  const mLG=ctx.createLinearGradient(0,mY,0,mY+mH);
  mLG.addColorStop(0,'transparent');mLG.addColorStop(0.3,'rgba(255,255,220,0.9)');
  mLG.addColorStop(0.7,'rgba(255,255,220,0.9)');mLG.addColorStop(1,'transparent');
  [mX-2, mX+mW].forEach(x=>{ctx.fillStyle=mLG;ctx.fillRect(x,mY,2,mH);
    ctx.shadowColor='rgba(255,255,200,0.7)';ctx.shadowBlur=16;ctx.fillStyle=mLG;ctx.fillRect(x,mY,2,mH);ctx.shadowBlur=0;});
  // Mirror reflection
  glow(ctx, mX+mW*0.4, mY+mH*0.3, 60, 'rgba(255,255,255,0.03)');
  // Clock on mirror
  ctx.fillStyle='rgba(0,212,255,0.7)'; ctx.font='bold 16px monospace';
  const now=new Date(); ctx.fillText(String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0'), mX+mW*0.55, mY+mH*0.15);
  ctx.font='10px monospace'; ctx.fillStyle='rgba(0,212,255,0.5)';
  ctx.fillText('22°C  💧 55%', mX+mW*0.3, mY+mH*0.9);
  // Mirror glow
  glow(ctx, mX+mW/2, mY+mH/2, 100, 'rgba(255,255,200,0.04)');

  // Vanity unit
  const vX=W*0.05, vY=H*0.58, vW=W*0.32, vH=H*0.24;
  gRect(ctx,vX,vY,vW,vH,'#0e0e1e','#080814');
  ctx.strokeStyle='rgba(0,212,255,0.1)'; ctx.strokeRect(vX,vY,vW,vH);
  // Basin
  const bX=vX+vW*0.2, bY=vY+4, bW=vW*0.55, bH=H*0.08;
  ctx.fillStyle='#060610'; ctx.fillRect(bX,bY,bW,bH);
  ctx.strokeStyle='rgba(0,212,255,0.25)'; ctx.strokeRect(bX,bY,bW,bH);
  // Faucet - chrome
  gRect(ctx,bX+bW*0.42,vY-20,5,26,'#2a2a3e','#1a1a2c');
  gRect(ctx,bX+bW*0.42,vY-22,bW*0.25,5,'#2a2a3e','#1a1a2c');
  // Vanity reflection
  gRect(ctx,vX,vY+vH,vW,6,'rgba(0,212,255,0.04)','transparent');

  // Glass shower
  const shX=W*0.45, shY=H*0.12, shW=W*0.25, shH=H*0.7;
  ctx.fillStyle='rgba(200,230,255,0.03)'; ctx.fillRect(shX,shY,shW,shH);
  ctx.strokeStyle='rgba(200,230,255,0.18)'; ctx.lineWidth=2; ctx.strokeRect(shX,shY,shW,shH);
  ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(shX,shY); ctx.lineTo(shX,shY+shH); ctx.stroke();
  ctx.lineWidth=1;
  // Shower head
  ctx.beginPath(); ctx.arc(shX+shW*0.7,shY+H*0.1,18,0,Math.PI*2);
  ctx.strokeStyle='rgba(0,212,255,0.5)'; ctx.stroke();
  glow(ctx, shX+shW*0.7, shY+H*0.1, 30, 'rgba(0,212,255,0.1)');
  // Steam effect
  for(let i=0;i<6;i++){
    const sg=ctx.createRadialGradient(shX+shW*0.4+i*10,shY+shH*0.6,0,shX+shW*0.4+i*10,shY+shH*0.6,25);
    sg.addColorStop(0,'rgba(200,230,255,0.06)');sg.addColorStop(1,'transparent');
    ctx.fillStyle=sg; ctx.fillRect(shX+shW*0.1,shY+shH*0.4,shW*0.8,shH*0.5);
  }
  // Shower LED floor
  const sfG=ctx.createLinearGradient(shX,0,shX+shW,0);
  sfG.addColorStop(0,'transparent');sfG.addColorStop(0.5,'rgba(0,212,255,0.3)');sfG.addColorStop(1,'transparent');
  ctx.fillStyle=sfG; ctx.fillRect(shX,shY+shH-4,shW,3);

  // Wall-hung toilet
  const tX=W*0.76, tY=H*0.52, tW2=W*0.2, tH2=H*0.3;
  // Installation frame
  gRect(ctx,tX,H*0.12,tW2,H*0.4,'#0a0a18','#06060c');
  ctx.strokeStyle='rgba(0,212,255,0.08)'; ctx.strokeRect(tX,H*0.12,tW2,H*0.4);
  // Flush button
  ctx.fillStyle='rgba(0,212,255,0.2)'; ctx.fillRect(tX+tW2*0.35,H*0.2,tW2*0.3,H*0.06);
  ctx.strokeStyle='rgba(0,212,255,0.4)'; ctx.strokeRect(tX+tW2*0.35,H*0.2,tW2*0.3,H*0.06);
  // Toilet bowl
  ctx.fillStyle='#dddde8'; ctx.fillRect(tX+tW2*0.1,tY,tW2*0.8,H*0.08);
  ctx.fillStyle='#c0c0d0'; ctx.fillRect(tX+tW2*0.05,tY-H*0.02,tW2*0.9,H*0.02);
  ctx.strokeStyle='rgba(0,212,255,0.1)'; ctx.strokeRect(tX+tW2*0.1,tY,tW2*0.8,H*0.08);

  // Towel heated rail
  const trX=W*0.76, trY=H*0.82;
  for(let i=0;i<3;i++){
    gRect(ctx,trX,trY+i*H*0.025,W*0.18,3,'rgba(0,212,255,0.4)','rgba(0,212,255,0.15)','h');
    ctx.shadowColor='rgba(255,130,0,0.4)'; ctx.shadowBlur=6;
    ctx.fillStyle='rgba(255,130,0,0.1)'; ctx.fillRect(trX,trY+i*H*0.025,W*0.18,3); ctx.shadowBlur=0;
  }

  // Ambient
  glow(ctx, mX+mW/2, mY+mH/2, 120, 'rgba(255,255,200,0.03)');
  glow(ctx, shX+shW/2, shY+shH*0.6, 80, 'rgba(0,212,255,0.04)');
}


// ============================================================
// ROOM 04 - HALLWAY
// ============================================================
function drawHallMain(id) {
  const cv=document.getElementById(id); if(!cv) return;
  const ctx=cv.getContext('2d'); const W=cv.width,H=cv.height;
  gRect(ctx,0,0,W,H,'#06060e','#0c0c1e');

  // Ceiling
  gRect(ctx,0,0,W,H*0.1,'#080812','#060610');
  // Ceiling LED strip
  const clG=ctx.createLinearGradient(0,0,W,0);
  clG.addColorStop(0,'transparent');clG.addColorStop(0.15,'rgba(0,212,255,0.6)');
  clG.addColorStop(0.85,'rgba(0,212,255,0.6)');clG.addColorStop(1,'transparent');
  ctx.fillStyle=clG;ctx.fillRect(0,H*0.1-3,W,3);
  ctx.shadowColor='#00d4ff';ctx.shadowBlur=20;ctx.fillStyle=clG;ctx.fillRect(0,H*0.1-3,W,3);ctx.shadowBlur=0;
  // Downlights
  [0.25,0.5,0.75].forEach(fx=>{
    ctx.beginPath();ctx.arc(W*fx,H*0.06,5,0,Math.PI*2);
    ctx.fillStyle='#fff';ctx.fill();
    ctx.shadowColor='rgba(255,255,255,0.6)';ctx.shadowBlur=22;ctx.fill();ctx.shadowBlur=0;
  });

  // Back wall - microcement dark
  gRect(ctx,0,H*0.1,W,H*0.72,'#0c0c1e','#080814');
  // Microcement texture
  for(let i=0;i<30;i++){
    ctx.fillStyle=`rgba(255,255,255,${Math.random()*0.008})`;
    ctx.fillRect(Math.random()*W,H*0.1+Math.random()*H*0.7,Math.random()*60+20,1);
  }
  // Horizontal accent line
  gRect(ctx,0,H*0.82-2,W,2,'rgba(0,212,255,0.3)','rgba(0,212,255,0)','h');

  // Floor - large ceramic
  gRect(ctx,0,H*0.82,W,H*0.18,'#0e0e1e','#08080e');
  for(let x=0;x<W;x+=W/10){ctx.strokeStyle='rgba(0,212,255,0.06)';ctx.beginPath();ctx.moveTo(x,H*0.82);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=H*0.82;y<H;y+=(H-H*0.82)/2){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  // Floor reflection
  glow(ctx,W*0.5,H*0.85,W*0.6,'rgba(0,212,255,0.04)');

  // ENTRY DOOR (Matt Black)
  const dX=W*0.38,dY=H*0.1,dW=W*0.25,dH=H*0.72;
  gRect(ctx,dX,dY,dW,dH,'#0a0a1a','#060610');
  ctx.strokeStyle='rgba(0,212,255,0.15)';ctx.lineWidth=3;ctx.strokeRect(dX,dY,dW,dH);ctx.lineWidth=1;
  // Door panels
  [[0.05,0.04,0.9,0.38],[0.05,0.48,0.9,0.45]].forEach(([rx,ry,rw,rh])=>{
    gRect(ctx,dX+dW*rx,dY+dH*ry,dW*rw,dH*rh,'#0e0e20','#0a0a16');
    ctx.strokeStyle='rgba(0,212,255,0.12)';ctx.strokeRect(dX+dW*rx,dY+dH*ry,dW*rw,dH*rh);
  });
  // Door handle
  gRect(ctx,dX+dW*0.82,dY+dH*0.5,6,dH*0.12,'rgba(0,212,255,0.6)','rgba(0,212,255,0.3)');
  // Smart lock keypad
  gRect(ctx,dX+dW*0.06,dY+dH*0.53,dW*0.18,dH*0.1,'#06060e','#040408');
  ctx.strokeStyle='rgba(0,212,255,0.4)';ctx.strokeRect(dX+dW*0.06,dY+dH*0.53,dW*0.18,dH*0.1);
  // Keypad dot
  ctx.beginPath();ctx.arc(dX+dW*0.15,dY+dH*0.58,3,0,Math.PI*2);
  ctx.fillStyle='rgba(0,212,255,0.8)';ctx.fill();
  ctx.shadowColor='#00d4ff';ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;
  // Door glow
  glow(ctx,dX+dW/2,dY+dH*0.5,60,'rgba(0,212,255,0.04)');

  // FULL-LENGTH MIRROR (left)
  const mirX=W*0.04,mirY=H*0.1,mirW=W*0.12,mirH=H*0.72;
  gRectD(ctx,mirX,mirY,mirW,mirH,'rgba(0,212,255,0.05)','rgba(255,255,255,0.02)');
  ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=2;ctx.strokeRect(mirX,mirY,mirW,mirH);ctx.lineWidth=1;
  // Mirror LED frame
  [mirX-2,mirX+mirW].forEach(x=>{
    const g=ctx.createLinearGradient(0,mirY,0,mirY+mirH);
    g.addColorStop(0,'transparent');g.addColorStop(0.3,'rgba(255,255,200,0.8)');
    g.addColorStop(0.7,'rgba(255,255,200,0.8)');g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fillRect(x,mirY,2,mirH);
    ctx.shadowColor='rgba(255,255,200,0.6)';ctx.shadowBlur=14;ctx.fillStyle=g;ctx.fillRect(x,mirY,2,mirH);ctx.shadowBlur=0;
  });
  glow(ctx,mirX+mirW/2,mirY+mirH*0.4,80,'rgba(255,255,200,0.04)');

  // WARDROBE (right)
  const wX=W*0.67,wY=H*0.1,wW=W*0.3,wH=H*0.72;
  // Left door mirror
  gRectD(ctx,wX,wY,wW/2,wH,'rgba(0,212,255,0.04)','rgba(255,255,255,0.02)');
  ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.strokeRect(wX,wY,wW/2,wH);
  // Right door dark
  gRect(ctx,wX+wW/2,wY,wW/2,wH,'#0c0c1c','#080810');
  ctx.strokeStyle='rgba(0,212,255,0.08)';ctx.strokeRect(wX+wW/2,wY,wW/2,wH);
  // Wardrobe handles
  [wX+wW*0.45,wX+wW*0.97].forEach(hx=>{ctx.fillStyle='rgba(0,212,255,0.4)';ctx.fillRect(hx-1,wY+wH*0.45,2,wH*0.12);});
  // Wardrobe LED strip top
  const wlG=ctx.createLinearGradient(wX,0,wX+wW,0);
  wlG.addColorStop(0,'transparent');wlG.addColorStop(0.5,'rgba(0,212,255,0.4)');wlG.addColorStop(1,'transparent');
  ctx.fillStyle=wlG;ctx.fillRect(wX,wY,wW,2);
  // Sensor dot
  ctx.beginPath();ctx.arc(wX+wW*0.97,wY+H*0.04,4,0,Math.PI*2);
  ctx.fillStyle='rgba(34,197,94,0.9)';ctx.fill();
  ctx.shadowColor='rgba(34,197,94,0.7)';ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;

  // Shoe bench
  const bX=W*0.04,bY=H*0.82-H*0.1,bW=W*0.26,bH=H*0.08;
  gRect(ctx,bX,bY,bW,bH,'#141428','#0e0e1c');
  ctx.strokeStyle='rgba(0,212,255,0.1)';ctx.strokeRect(bX,bY,bW,bH);
  gRect(ctx,bX,bY+bH,bW,3,'rgba(0,212,255,0.2)','transparent','h');

  // Smart home panel
  const pX=W*0.35,pY=H*0.52,pW=W*0.08,pH=H*0.18;
  gRect(ctx,pX,pY,pW,pH,'#06060e','#040408');
  ctx.strokeStyle='rgba(0,212,255,0.4)';ctx.strokeRect(pX,pY,pW,pH);
  ctx.fillStyle='rgba(0,212,255,0.7)';ctx.font='7px monospace';
  ctx.fillText('SMART',pX+4,pY+14);ctx.fillText('🔒 SECURE',pX+2,pY+26);ctx.fillText('22°C',pX+8,pY+38);
  glow(ctx,pX+pW/2,pY+pH/2,30,'rgba(0,212,255,0.06)');

  // Ambient
  glow(ctx,W*0.5,H*0.5,200,'rgba(0,212,255,0.03)');
}

// ============================================================
// ROOM 05 - BEDROOM MAIN
// ============================================================
function drawBedroomMain(id) {
  const cv=document.getElementById(id); if(!cv) return;
  const ctx=cv.getContext('2d'); const W=cv.width,H=cv.height;
  gRect(ctx,0,0,W,H,'#05050d','#0a0a18');

  // Ceiling
  gRect(ctx,0,0,W,H*0.1,'#07070f','#050510');
  // RGB ceiling LED
  const cG=ctx.createLinearGradient(0,0,W,0);
  cG.addColorStop(0,'transparent');cG.addColorStop(0.1,'rgba(168,85,247,0.7)');
  cG.addColorStop(0.4,'rgba(0,212,255,0.5)');cG.addColorStop(0.7,'rgba(168,85,247,0.6)');cG.addColorStop(1,'transparent');
  ctx.fillStyle=cG;ctx.fillRect(0,H*0.1-3,W,3);
  ctx.shadowColor='#a855f7';ctx.shadowBlur=24;ctx.fillStyle=cG;ctx.fillRect(0,H*0.1-3,W,3);ctx.shadowBlur=0;

  // METAL ACCENT WALL (back)
  gRect(ctx,0,H*0.1,W*0.65,H*0.72,'#0c0c20','#080814');
  // Metal panel grooves
  const pCount=8;
  for(let i=0;i<pCount;i++){
    const px=i*(W*0.65/pCount), pw=W*0.65/pCount;
    gRectD(ctx,px+2,H*0.12,pw-4,H*0.68,i%2===0?'#111126':'#0d0d1e',i%2===0?'#0d0d1e':'#0b0b18');
    // Brushed texture
    for(let j=0;j<10;j++){ctx.fillStyle=`rgba(255,255,255,${0.01*Math.random()})`;ctx.fillRect(px+4,H*0.13+j*(H*0.65/10),pw-8,1);}
    ctx.strokeStyle='rgba(0,212,255,0.08)';ctx.strokeRect(px+2,H*0.12,pw-4,H*0.68);
  }
  // LED strips between panels
  for(let i=1;i<pCount;i++){
    const x=i*(W*0.65/pCount);
    const lG=ctx.createLinearGradient(0,H*0.12,0,H*0.8);
    lG.addColorStop(0,'transparent');lG.addColorStop(0.4,'rgba(168,85,247,0.5)');
    lG.addColorStop(0.6,'rgba(168,85,247,0.4)');lG.addColorStop(1,'transparent');
    ctx.fillStyle=lG;ctx.fillRect(x-1,H*0.12,2,H*0.68);
    ctx.shadowColor='#a855f7';ctx.shadowBlur=10;ctx.fillStyle=lG;ctx.fillRect(x-1,H*0.12,2,H*0.68);ctx.shadowBlur=0;
  }

  // Side wall with window
  gRect(ctx,W*0.65,H*0.1,W*0.35,H*0.72,'#0a0a18','#060612');
  // Night window
  const nwX=W*0.68,nwY=H*0.15,nwW=W*0.27,nwH=H*0.45;
  gRectD(ctx,nwX,nwY,nwW,nwH,'#010115','#020220');
  // Stars
  for(let i=0;i<25;i++){
    ctx.beginPath();ctx.arc(nwX+Math.random()*nwW,nwY+Math.random()*nwH*0.6,Math.random()*1.5+0.5,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${0.4+Math.random()*0.5})`;ctx.fill();
  }
  // City lights bottom
  for(let i=0;i<12;i++){
    ctx.fillStyle=`rgba(${Math.random()>0.5?255:255},${Math.random()>0.5?200:150},0,${0.3+Math.random()*0.4})`;
    ctx.fillRect(nwX+i*(nwW/12),nwY+nwH*0.7+Math.random()*nwH*0.15,3+Math.random()*8,4+Math.random()*20);
  }
  ctx.strokeStyle='rgba(0,212,255,0.2)';ctx.lineWidth=3;ctx.strokeRect(nwX,nwY,nwW,nwH);ctx.lineWidth=1;
  // Blind
  gRect(ctx,nwX,nwY,nwW,nwH*0.12,'#0c0c20','rgba(12,12,32,0)');

  // FLOOR
  gRect(ctx,0,H*0.82,W,H*0.18,'#0e0e1e','#08080e');
  for(let x=0;x<W;x+=W/10){ctx.strokeStyle='rgba(0,212,255,0.05)';ctx.beginPath();ctx.moveTo(x,H*0.82);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=H*0.82;y<H;y+=(H-H*0.82)/2){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  // RUG
  const rugG=ctx.createLinearGradient(W*0.1,0,W*0.7,0);
  rugG.addColorStop(0,'transparent');rugG.addColorStop(0.15,'rgba(168,85,247,0.07)');
  rugG.addColorStop(0.85,'rgba(168,85,247,0.07)');rugG.addColorStop(1,'transparent');
  ctx.fillStyle=rugG;ctx.fillRect(W*0.1,H*0.82,W*0.6,H*0.18);
  glow(ctx,W*0.4,H*0.85,W*0.35,'rgba(168,85,247,0.04)');

  // BED
  const bdX=W*0.08,bdY=H*0.55,bdW=W*0.5,bdH=H*0.28;
  // Headboard
  gRect(ctx,bdX,H*0.38,bdW,H*0.18,'#1a1a2e','#111120');
  ctx.strokeStyle='rgba(168,85,247,0.2)';ctx.strokeRect(bdX,H*0.38,bdW,H*0.18);
  // Headboard inner
  gRect(ctx,bdX+6,H*0.4,bdW-12,H*0.14,'#1e1e32','#14142a');
  // RGB BACK-LIGHT behind headboard
  const bhG=ctx.createLinearGradient(bdX,0,bdX+bdW,0);
  bhG.addColorStop(0,'transparent');bhG.addColorStop(0.15,'rgba(168,85,247,0.9)');
  bhG.addColorStop(0.85,'rgba(168,85,247,0.7)');bhG.addColorStop(1,'transparent');
  ctx.fillStyle=bhG;ctx.fillRect(bdX,H*0.56-3,bdW,4);
  ctx.shadowColor='#a855f7';ctx.shadowBlur=30;ctx.fillStyle=bhG;ctx.fillRect(bdX,H*0.56-3,bdW,4);ctx.shadowBlur=0;
  // Glow on wall from bed LED
  glow(ctx,bdX+bdW/2,H*0.5,W*0.25,'rgba(168,85,247,0.06)');
  // Mattress
  gRect(ctx,bdX,bdY,bdW,bdH*0.9,'#161628','#0e0e1e');
  ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(bdX,bdY,bdW,bdH*0.9);
  // Pillows
  [[0.06,0.06,'#1e1e34'],[0.36,0.06,'#1e1e34']].forEach(([px,py,c])=>{
    gRect(ctx,bdX+bdW*px,bdY+bdH*py,bdW*0.26,bdH*0.3,c,'#161626');
    ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.strokeRect(bdX+bdW*px,bdY+bdH*py,bdW*0.26,bdH*0.3);
  });
  // Blanket
  gRect(ctx,bdX,bdY+bdH*0.4,bdW,bdH*0.5,'#1a1a2c','#121220');
  ctx.strokeStyle='rgba(168,85,247,0.08)';ctx.strokeRect(bdX,bdY+bdH*0.4,bdW,bdH*0.5);
  // Bed frame LED underlight
  const bfG=ctx.createLinearGradient(0,0,bdW,0);
  bfG.addColorStop(0,'transparent');bfG.addColorStop(0.5,'rgba(168,85,247,0.4)');bfG.addColorStop(1,'transparent');
  ctx.fillStyle=bfG;ctx.fillRect(bdX,bdY+bdH*0.9,bdW,3);
  glow(ctx,bdX+bdW/2,bdY+bdH,'rgba(168,85,247,0.08)');

  // Bedside tables
  [[bdX-W*0.08,H*0.57],[bdX+bdW,H*0.57]].forEach(([tx,ty])=>{
    gRect(ctx,tx,ty,W*0.07,H*0.18,'#0e0e1c','#080814');
    ctx.strokeStyle='rgba(0,212,255,0.1)';ctx.strokeRect(tx,ty,W*0.07,H*0.18);
    // Lamp
    const lx=tx+W*0.035, ly=ty-H*0.06;
    glow(ctx,lx,ly,24,'rgba(255,200,0,0.1)');
    ctx.fillStyle='rgba(255,200,0,0.6)';ctx.beginPath();ctx.arc(lx,ly,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,200,0,0.2)';ctx.fillRect(lx-1,ly,2,H*0.08);
  });

  // Wardrobe
  const gwX=W*0.65,gwY=H*0.1,gwW=W*0.11,gwH=H*0.72;
  gRectD(ctx,gwX,gwY,gwW/2,gwH,'rgba(0,212,255,0.04)','rgba(255,255,255,0.02)');
  ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.strokeRect(gwX,gwY,gwW/2,gwH);
  gRect(ctx,gwX+gwW/2,gwY,gwW/2,gwH,'#0c0c1c','#080810');
  ctx.strokeStyle='rgba(0,212,255,0.08)';ctx.strokeRect(gwX+gwW/2,gwY,gwW/2,gwH);
  const gwlG=ctx.createLinearGradient(gwX,0,gwX+gwW,0);
  gwlG.addColorStop(0,'transparent');gwlG.addColorStop(0.5,'rgba(0,212,255,0.4)');gwlG.addColorStop(1,'transparent');
  ctx.fillStyle=gwlG;ctx.fillRect(gwX,gwY,gwW,2);

  // Final ambients
  glow(ctx,bdX+bdW/2,H*0.5,W*0.3,'rgba(168,85,247,0.04)');
  glow(ctx,W*0.75,H*0.4,120,'rgba(0,212,255,0.03)');
}


// ============================================================
// DETAIL CANVASES
// ============================================================
function drawBathShower(id) {
  const cv=document.getElementById(id); if(!cv) return;
  const ctx=cv.getContext('2d'); const W=cv.width,H=cv.height;
  gRect(ctx,0,0,W,H,'#04040c','#080818');
  // Tile wall
  const tW=W/10,tH=H/8;
  for(let c=0;c<10;c++) for(let r=0;r<8;r++){
    ctx.fillStyle=(c+r)%3===0?'#111122':(c+r)%3===1?'#0d0d1c':'#0f0f20';
    ctx.fillRect(c*tW+1,r*tH+1,tW-2,tH-2);
    ctx.strokeStyle='rgba(0,212,255,0.05)';ctx.strokeRect(c*tW+1,r*tH+1,tW-2,tH-2);
  }
  // Glass walls
  ctx.fillStyle='rgba(200,230,255,0.04)';ctx.fillRect(W*0.1,H*0.05,W*0.8,H*0.78);
  ctx.strokeStyle='rgba(200,230,255,0.2)';ctx.lineWidth=3;
  ctx.strokeRect(W*0.1,H*0.05,W*0.8,H*0.78);ctx.lineWidth=1;
  // Shower head
  ctx.beginPath();ctx.arc(W*0.5,H*0.12,25,0,Math.PI*2);
  ctx.strokeStyle='rgba(0,212,255,0.5)';ctx.lineWidth=3;ctx.stroke();ctx.lineWidth=1;
  glow(ctx,W*0.5,H*0.12,50,'rgba(0,212,255,0.15)');
  // Water drops
  for(let i=0;i<20;i++){
    ctx.fillStyle='rgba(200,230,255,0.25)';
    ctx.fillRect(W*0.2+Math.random()*W*0.6,H*0.2+Math.random()*H*0.5,1,6+Math.random()*8);
  }
  // Steam
  for(let i=0;i<8;i++){
    const g=ctx.createRadialGradient(W*0.2+i*W*0.08,H*0.6,0,W*0.2+i*W*0.08,H*0.6,40);
    g.addColorStop(0,'rgba(200,230,255,0.06)');g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fillRect(W*0.1,H*0.4,W*0.8,H*0.4);
  }
  // LED floor strip
  const sfG=ctx.createLinearGradient(W*0.1,0,W*0.9,0);
  sfG.addColorStop(0,'transparent');sfG.addColorStop(0.5,'rgba(0,212,255,0.5)');sfG.addColorStop(1,'transparent');
  ctx.fillStyle=sfG;ctx.fillRect(W*0.1,H*0.83-2,W*0.8,3);
  ctx.shadowColor='#00d4ff';ctx.shadowBlur=14;ctx.fillStyle=sfG;ctx.fillRect(W*0.1,H*0.83-2,W*0.8,3);ctx.shadowBlur=0;
  // Floor
  gRect(ctx,0,H*0.83,W,H*0.17,'#0c0c1c','#080810');
}

function drawBathMirror(id) {
  const cv=document.getElementById(id); if(!cv) return;
  const ctx=cv.getContext('2d'); const W=cv.width,H=cv.height;
  gRect(ctx,0,0,W,H,'#06060e','#0a0a1a');
  // Tile background
  const tW=W/8,tH=H/6;
  for(let c=0;c<8;c++) for(let r=0;r<6;r++){
    ctx.fillStyle=(c+r)%2===0?'#111122':'#0d0d1c';
    ctx.fillRect(c*tW+1,r*tH+1,tW-2,tH-2);
    ctx.strokeStyle='rgba(0,212,255,0.05)';ctx.strokeRect(c*tW+1,r*tH+1,tW-2,tH-2);
  }
  // Mirror frame
  const mX=W*0.12,mY=H*0.06,mW=W*0.76,mH=H*0.65;
  ctx.fillStyle='rgba(0,212,255,0.05)';ctx.fillRect(mX,mY,mW,mH);
  ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;ctx.strokeRect(mX,mY,mW,mH);ctx.lineWidth=1;
  // LED top/bottom
  [mY-2,mY+mH].forEach(y=>{
    const g=ctx.createLinearGradient(mX,0,mX+mW,0);
    g.addColorStop(0,'transparent');g.addColorStop(0.5,'rgba(255,255,200,0.9)');g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fillRect(mX,y,mW,3);
    ctx.shadowColor='rgba(255,255,200,0.7)';ctx.shadowBlur=18;ctx.fillStyle=g;ctx.fillRect(mX,y,mW,3);ctx.shadowBlur=0;
  });
  // Clock display
  const now=new Date();
  ctx.fillStyle='rgba(0,212,255,0.8)';ctx.font='bold 28px monospace';
  ctx.textAlign='center';
  ctx.fillText(String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0'), W/2, mY+H*0.2);
  ctx.font='14px monospace';ctx.fillStyle='rgba(0,212,255,0.5)';
  ctx.fillText('22°C  •  💧 55%  •  Пн', W/2, mY+H*0.32);
  ctx.textAlign='left';
  // Vanity below
  gRect(ctx,W*0.1,mY+mH+H*0.02,W*0.8,H*0.12,'#0e0e1e','#080812');
  ctx.strokeStyle='rgba(0,212,255,0.1)';ctx.strokeRect(W*0.1,mY+mH+H*0.02,W*0.8,H*0.12);
  // Basin
  ctx.fillStyle='#06060e';ctx.fillRect(W*0.28,mY+mH+H*0.03,W*0.44,H*0.08);
  ctx.strokeStyle='rgba(0,212,255,0.2)';ctx.strokeRect(W*0.28,mY+mH+H*0.03,W*0.44,H*0.08);
  glow(ctx,W*0.5,mY+mH*0.4,120,'rgba(255,255,200,0.04)');
}

function drawKitchenWindow(id) {
  const cv=document.getElementById(id); if(!cv) return;
  const ctx=cv.getContext('2d'); const W=cv.width,H=cv.height;
  gRect(ctx,0,0,W,H,'#0a1a0a','#061006');
  // Trees
  for(let i=0;i<6;i++){
    const gx=i*(W/6),gy=H*0.4;
    const g=ctx.createRadialGradient(gx+W/12,gy,0,gx+W/12,gy,W/6);
    g.addColorStop(0,'rgba(30,100,20,0.7)');g.addColorStop(0.6,'rgba(15,60,10,0.5)');g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fillRect(gx,H*0.1,W/6,H*0.6);
  }
  // Sky light
  gRect(ctx,0,0,W,H*0.25,'rgba(100,160,255,0.15)','transparent');
  // Window frame overlay
  ctx.strokeStyle='rgba(0,212,255,0.3)';ctx.lineWidth=8;ctx.strokeRect(4,4,W-8,H-8);ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();
  ctx.lineWidth=1;
  ctx.fillStyle='rgba(0,212,255,0.4)';ctx.font='10px monospace';
  ctx.fillText('ВИД ИЗ ОКНА · ЗЕЛЕНЬ', 15, H-12);
}

function drawBedLight(id) {
  const cv=document.getElementById(id); if(!cv) return;
  const ctx=cv.getContext('2d'); const W=cv.width,H=cv.height;
  gRect(ctx,0,0,W,H,'#030308','#060610');
  // Headboard glow - purple
  glow(ctx,W*0.5,H*0.35,W*0.4,'rgba(168,85,247,0.2)');
  // LED strip behind headboard
  const hbG=ctx.createLinearGradient(0,0,W,0);
  hbG.addColorStop(0,'transparent');hbG.addColorStop(0.15,'rgba(168,85,247,1)');
  hbG.addColorStop(0.85,'rgba(168,85,247,0.9)');hbG.addColorStop(1,'transparent');
  ctx.fillStyle=hbG;ctx.fillRect(W*0.08,H*0.42-3,W*0.84,5);
  ctx.shadowColor='#a855f7';ctx.shadowBlur=35;ctx.fillStyle=hbG;ctx.fillRect(W*0.08,H*0.42-3,W*0.84,5);ctx.shadowBlur=0;
  // Headboard silhouette
  gRect(ctx,W*0.08,H*0.2,W*0.84,H*0.24,'#0f0f1e','#080810');
  ctx.strokeStyle='rgba(168,85,247,0.2)';ctx.strokeRect(W*0.08,H*0.2,W*0.84,H*0.24);
  // Bed
  gRect(ctx,W*0.05,H*0.42,W*0.9,H*0.35,'#0e0e1e','#08080e');
  // Pillows
  [[0.08,0.45],[0.46,0.45]].forEach(([px,py])=>{
    gRect(ctx,W*px,H*py,W*0.34,H*0.14,'#181830','#0e0e20');
    ctx.strokeStyle='rgba(168,85,247,0.1)';ctx.strokeRect(W*px,H*py,W*0.34,H*0.14);
  });
  // Blanket
  gRect(ctx,W*0.05,H*0.59,W*0.9,H*0.18,'#16162c','#0c0c1c');
  // Under-bed LED
  const ubG=ctx.createLinearGradient(0,0,W,0);
  ubG.addColorStop(0,'transparent');ubG.addColorStop(0.5,'rgba(168,85,247,0.5)');ubG.addColorStop(1,'transparent');
  ctx.fillStyle=ubG;ctx.fillRect(W*0.05,H*0.77,W*0.9,3);
  ctx.shadowColor='#a855f7';ctx.shadowBlur=18;ctx.fillStyle=ubG;ctx.fillRect(W*0.05,H*0.77,W*0.9,3);ctx.shadowBlur=0;
  glow(ctx,W*0.5,H*0.78,W*0.5,'rgba(168,85,247,0.07)');
  // Ceiling RGB
  const cG=ctx.createLinearGradient(0,0,W,0);
  cG.addColorStop(0,'rgba(168,85,247,0.15)');cG.addColorStop(0.5,'rgba(0,212,255,0.1)');cG.addColorStop(1,'rgba(168,85,247,0.15)');
  ctx.fillStyle=cG;ctx.fillRect(0,0,W,H*0.08);
  ctx.fillStyle='rgba(168,85,247,0.6)';ctx.font='bold 11px monospace';
  ctx.fillText('НОЧНАЯ ПОДСВЕТКА · RGB AMBIENT', 15, H-12);
}

function drawBedWardrobe(id) {
  const cv=document.getElementById(id); if(!cv) return;
  const ctx=cv.getContext('2d'); const W=cv.width,H=cv.height;
  gRect(ctx,0,0,W,H,'#060610','#0c0c1e');
  // Wall
  gRect(ctx,0,H*0.1,W,H*0.72,'#0a0a1a','#060610');
  // Metal wall panels
  for(let i=0;i<8;i++){
    const px=i*(W/8);
    gRectD(ctx,px+1,H*0.12,W/8-2,H*0.68,i%2===0?'#111120':'#0d0d1c',i%2===0?'#0d0d18':'#0b0b16');
    ctx.strokeStyle='rgba(0,212,255,0.06)';ctx.strokeRect(px+1,H*0.12,W/8-2,H*0.68);
  }
  // Wardrobe
  const wX=W*0.08,wY=H*0.1,wW=W*0.84,wH=H*0.72;
  // Mirror door left
  gRectD(ctx,wX,wY,wW*0.5,wH,'rgba(0,212,255,0.04)','rgba(255,255,255,0.02)');
  ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=2;ctx.strokeRect(wX,wY,wW*0.5,wH);ctx.lineWidth=1;
  // Reflection in mirror
  glow(ctx,wX+wW*0.2,wY+wH*0.4,80,'rgba(255,255,255,0.03)');
  // Dark door right
  gRect(ctx,wX+wW*0.5,wY,wW*0.5,wH,'#0c0c1c','#080810');
  ctx.strokeStyle='rgba(0,212,255,0.08)';ctx.strokeRect(wX+wW*0.5,wY,wW*0.5,wH);
  // Handles
  [wX+wW*0.47,wX+wW*0.97].forEach(hx=>{
    ctx.fillStyle='rgba(0,212,255,0.5)';ctx.fillRect(hx-1,wY+wH*0.44,2,wH*0.14);
  });
  // LED top strip
  const wlG=ctx.createLinearGradient(wX,0,wX+wW,0);
  wlG.addColorStop(0,'transparent');wlG.addColorStop(0.5,'rgba(0,212,255,0.5)');wlG.addColorStop(1,'transparent');
  ctx.fillStyle=wlG;ctx.fillRect(wX,wY,wW,2);
  ctx.shadowColor='#00d4ff';ctx.shadowBlur=14;ctx.fillStyle=wlG;ctx.fillRect(wX,wY,wW,2);ctx.shadowBlur=0;
  glow(ctx,wX+wW/2,wY+5,wW*0.5,'rgba(0,212,255,0.04)');
  // Floor
  gRect(ctx,0,H*0.82,W,H*0.18,'#0e0e1e','#08080e');
  ctx.fillStyle='rgba(0,212,255,0.5)';ctx.font='bold 11px monospace';
  ctx.fillText('ГАРДЕРОБ · ЗЕРКАЛЬНЫЕ ДВЕРИ · LED', 15, H-12);
}

// ============================================================
// INIT - draw all canvases
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  drawLivingMain('c-living-main');
  drawLivingWall('c-living-wall');
  drawLivingNight('c-living-night');
  drawKitchenMain('c-kitchen-main');
  drawKitchenDetail('c-kitchen-detail');
  drawKitchenWindow('c-kitchen-window');
  drawBathMain('c-bath-main');
  drawBathShower('c-bath-shower');
  drawBathMirror('c-bath-mirror');
  drawHallMain('c-hall-main');
  drawBedroomMain('c-bed-main');
  drawBedLight('c-bed-light');
  drawBedWardrobe('c-bed-wardrobe');
});
