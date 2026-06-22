/* ===== ANIMATE ON SCROLL ===== */
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.opacity='1';
      e.target.style.transform='translateY(0)';
    }
  });
},{threshold:.08});

document.querySelectorAll('.render-section,.sum-card').forEach(el=>{
  el.style.opacity='0';
  el.style.transform='translateY(24px)';
  el.style.transition='opacity .6s ease, transform .6s ease';
  obs.observe(el);
});

/* ===== LIVING: TV FLICKER ===== */
setInterval(()=>{
  const tv=document.querySelector('.tv-screen-live');
  if(!tv) return;
  tv.style.background='radial-gradient(ellipse at 40% 30%,#1e4a6a 0%,#060616 70%)';
  setTimeout(()=>{
    tv.style.background='radial-gradient(ellipse at 30% 40%,#1a3a5a 0%,#050510 70%)';
  },200);
},3000);

/* ===== BATHROOM MIRROR CLOCK ===== */
function updateClock(){
  const clocks=document.querySelectorAll('.mirror-clock');
  const now=new Date();
  const t=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
  clocks.forEach(c=>c.textContent=t);
}
updateClock();
setInterval(updateClock,60000);

/* ===== HOB RING GLOW ANIMATION ===== */
setInterval(()=>{
  const rings=document.querySelectorAll('.hob-ring.on');
  rings.forEach(r=>{
    r.style.boxShadow='0 0 12px rgba(255,120,0,.6) inset,0 0 8px rgba(255,120,0,.3)';
    setTimeout(()=>{
      r.style.boxShadow='0 0 8px rgba(255,100,0,.4) inset,0 0 6px rgba(255,100,0,.2)';
    },500);
  });
},1200);

/* ===== SHOWER STEAM ===== */
setInterval(()=>{
  const steam=document.querySelector('.shower-steam');
  if(!steam) return;
  steam.style.opacity='0.8';
  setTimeout(()=>{ steam.style.opacity='0.3'; },1500);
},2000);

/* ===== PULSE LED STRIPS ===== */
setInterval(()=>{
  const strips=['under-cab-led','bh-led-behind','bed-led-ceil','hall-led-ceil'];
  const sel=strips[Math.floor(Math.random()*strips.length)];
  const el=document.querySelector('.'+sel);
  if(!el) return;
  el.style.opacity='1';
  setTimeout(()=>{ el.style.opacity=''; },400);
},800);

/* ===== SMART PANEL TEXT CYCLE ===== */
const smartTexts=[
  'SMART HOME\n⏶ 22°C · 🔒 ARMED',
  'SMART HOME\n⏶ 24°C · ✓ SECURE',
  'SMART HOME\n⏶ 22°C · 💡 AUTO',
];
let si=0;
setInterval(()=>{
  const sp=document.querySelector('.sp-screen');
  if(!sp) return;
  si=(si+1)%smartTexts.length;
  sp.innerHTML=smartTexts[si];
},3500);

console.log('%c[XXNB26 RENDERS] ХАЙТЕК ВИЗУАЛИЗАЦИЯ ЗАГРУЖЕНА ✓','color:#00d4ff;font-family:monospace;font-size:13px');
