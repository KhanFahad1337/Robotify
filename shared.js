// ── Motion preference helpers
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(pointer: fine)').matches;

// ── Custom cursor (fine pointers only, respects reduced motion)
(function(){
  if(REDUCED_MOTION || !FINE_POINTER) return;
  const cur=document.getElementById('cur'),ring=document.getElementById('cur-r');
  if(!cur||!ring)return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
  (function animR(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animR);})();
  document.querySelectorAll('a,button').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.style.width='16px';cur.style.height='16px';});
    el.addEventListener('mouseleave',()=>{cur.style.width='10px';cur.style.height='10px';});
  });
})();

// ── Particles (skipped for reduced motion; squared-distance + link cap for speed)
(function(){
  if(REDUCED_MOTION) return;
  const cvs=document.getElementById('cvs');if(!cvs)return;
  const ctx=cvs.getContext('2d');
  let W,H;
  function rsz(){W=cvs.width=window.innerWidth;H=cvs.height=window.innerHeight;}
  rsz();window.addEventListener('resize',rsz);
  const isSmall=window.innerWidth<768;
  const COUNT=isSmall?36:70, LINK_DIST=88, LINK_DIST2=LINK_DIST*LINK_DIST, MAX_LINKS=3;
  const PTS=[];
  class P{
    constructor(){this.reset();}
    reset(){this.x=Math.random()*W;this.y=Math.random()*H;
      this.vx=(Math.random()-.5)*.32;this.vy=(Math.random()-.5)*.32;
      this.sz=Math.random()*1.1+.4;this.life=Math.random()*200+80;this.ml=this.life;
      this.c=Math.random()>.7?'0,212,255':'184,200,212';}
    step(){this.x+=this.vx;this.y+=this.vy;this.life--;
      if(this.life<=0||this.x<0||this.x>W||this.y<0||this.y>H)this.reset();}
    draw(){const a=this.life/this.ml*.4;ctx.beginPath();ctx.arc(this.x,this.y,this.sz,0,Math.PI*2);ctx.fillStyle=`rgba(${this.c},${a})`;ctx.fill();}
  }
  for(let i=0;i<COUNT;i++)PTS.push(new P());
  (function loop(){
    requestAnimationFrame(loop);
    if(document.hidden)return;
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<PTS.length;i++){
      PTS[i].step();PTS[i].draw();
      let links=0;
      for(let j=i+1;j<PTS.length&&links<MAX_LINKS;j++){
        const dx=PTS[i].x-PTS[j].x,dy=PTS[i].y-PTS[j].y,d2=dx*dx+dy*dy;
        if(d2<LINK_DIST2){
          links++;
          ctx.beginPath();ctx.moveTo(PTS[i].x,PTS[i].y);ctx.lineTo(PTS[j].x,PTS[j].y);
          ctx.strokeStyle=`rgba(0,212,255,${(1-Math.sqrt(d2)/LINK_DIST)*.1})`;ctx.lineWidth=.5;ctx.stroke();
        }
      }
    }
  })();
})();

// ── Mobile nav toggle (keeps aria-expanded in sync)
(function(){
  const btn=document.querySelector('.nav-mobile-btn'),links=document.getElementById('nav-links');
  if(!btn||!links)return;
  btn.setAttribute('aria-expanded','false');
  btn.addEventListener('click',()=>{
    const open=links.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
  });
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    links.classList.remove('open');btn.setAttribute('aria-expanded','false');
  }));
})();

// ── Scroll reveal
(function(){
  const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.08});
  document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%5)*.07+'s';obs.observe(el);});
})();

// Glow orbs (glass ambience)
(function(){
  if(document.querySelector('.glow-orb'))return;
  document.body.insertAdjacentHTML('beforeend','<div class="glow-orb glow-a" aria-hidden="true"></div><div class="glow-orb glow-b" aria-hidden="true"></div>');
})();

// Scroll progress bar
(function(){
  if(document.getElementById('prog'))return;
  document.body.insertAdjacentHTML('beforeend','<div id="prog" aria-hidden="true"></div>');
  const bar=document.getElementById('prog');
  let ticking=false;
  function update(){
    const d=document.documentElement;
    const max=d.scrollHeight-d.clientHeight;
    bar.style.width=(max>0?(d.scrollTop||document.body.scrollTop)/max*100:0)+'%';
    ticking=false;
  }
  window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});
  update();
})();
