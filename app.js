'use strict';
const asset=path=>window.ADIM_ASSETS?.[path]||path;
const pad=n=>String(n).padStart(2,'0');
const photoSrc=n=>asset(`assets/project-photo-${pad(n)}.jpg`);
const $=s=>document.querySelector(s);
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- content ---------- */
const categories=[
 {id:'building',ar:'المباني والتشطيبات',en:'Buildings & fit-out',shortAr:'المباني',shortEn:'Buildings',
  descAr:'تنفيذ المباني التجارية والسكنية وأعمال التشطيبات الداخلية والواجهات، مع ضبط التفاصيل في كل مرحلة من مراحل التنفيذ.',
  descEn:'Commercial and residential buildings, interior fit-out and facades — with every detail controlled through each stage of construction.',start:1,end:23,cover:8},
 {id:'cold',ar:'المستودعات والتبريد',en:'Warehousing & refrigeration',shortAr:'التبريد',shortEn:'Refrigeration',
  descAr:'مستودعات صناعية وغرف تبريد وتجميد، وتجهيزات التخزين المبرّد بما يناسب طبيعة كل منشأة.',
  descEn:'Industrial warehouses, chillers and freezer rooms, and cold-storage installations fitted to each facility.',start:24,end:42,cover:24},
 {id:'mechanical',ar:'الأنظمة الميكانيكية',en:'Mechanical systems',shortAr:'الميكانيكا',shortEn:'Mechanical',
  descAr:'شبكات التكييف ووحدات مناولة الهواء ومجاري الهواء، وتركيب الأنظمة الميكانيكية وتشغيلها.',
  descEn:'HVAC networks, air-handling units and ductwork — installed, tested and commissioned.',start:43,end:58,cover:44},
 {id:'fire',ar:'أنظمة مكافحة الحريق',en:'Fire protection systems',shortAr:'مكافحة الحريق',shortEn:'Fire protection',
  descAr:'مضخات الحريق وشبكات الرش والإطفاء وتجهيزات السلامة وفق متطلبات الدفاع المدني.',
  descEn:'Fire pumps, sprinkler and suppression networks, and life-safety installations to Civil Defense requirements.',start:59,end:63,cover:61}
];
const principles=[
 {ar:'الدقة',en:'Precision',descAr:'نقيس مرتين وننفّذ مرة. كل تفصيلة تُراجع على المخططات والمواصفات قبل التنفيذ وبعده.',descEn:'Measure twice, build once. Every detail is checked against drawings and specifications before and after it is built.',
  icon:'<path d="M25 6 43 16 25 26 7 16Z"/><path d="M7 16v18l18 10 18-10V16M25 26v18"/><path d="M25 1v4M25 47v2M2 25h3M45 25h3" />'},
 {ar:'النزاهة',en:'Integrity',descAr:'وضوح في النطاق والتكلفة والجدول الزمني، والتزام بما نتفق عليه من أول يوم حتى التسليم.',descEn:'Clarity on scope, cost and schedule — and we hold to what we agree, from day one to handover.',
  icon:'<path d="M25 4 41 13 25 22 9 13Z"/><path d="M9 13v11l16 9 16-9V13M25 22v11"/><path d="M9 28v9l16 9 16-9v-9M25 37v9"/>'},
 {ar:'المتانة',en:'Endurance',descAr:'نختار المواد والأنظمة لتدوم في مناخ المملكة، ونبني ما يبقى ظاهراً وسليماً لسنوات.',descEn:'Materials and systems chosen to last in the Kingdom’s climate — building what stays sound and visible for years.',
  icon:'<path d="M6 46V30l7-6v22M17 46V22l8-7v31M29 46V10l9-8v44"/><path d="M3 46h44"/><path d="M4 40 C 18 37, 32 30, 47 20"/>'}
];
const ringPhotos=[3,8,24,13,44,20,29,61,5,33,48,17,38,57,10,27,52,1];
const marqueePhotos=[15,26,45,9,31,59,19,36,50,12,40,62];
const tickerWords=[['المباني','Buildings'],['التشطيبات','Fit-out'],['المستودعات','Warehouses'],['غرف التبريد','Cold rooms'],['التكييف','HVAC'],['مكافحة الحريق','Fire protection']];

const photos=categories.flatMap(c=>Array.from({length:c.end-c.start+1},(_,i)=>({id:c.start+i,category:c.id,file:photoSrc(c.start+i)})));
const state={language:'ar',filter:'all',limit:12,openService:0,dialogIndex:0,dialogPhotos:[],lastFocus:null};
const tr=(ar,en)=>state.language==='ar'?ar:en;
const catFor=p=>categories.find(c=>c.id===p.category);
const catName=c=>tr(c.ar,c.en);
const photoTitle=p=>tr(`صورة ${pad(p.id)}`,`Image ${pad(p.id)}`);

/* ---------- static builds ---------- */
function buildRing(){
 const ring=$('#ring');
 ring.innerHTML=ringPhotos.map(n=>`<div class="ring-card"><img src="${photoSrc(n)}" alt="" width="600" height="400" decoding="async"></div>`).join('');
 layoutRing();
}
let ringRadius=1000,ringAngle=0;
function layoutRing(){
 const cards=[...document.querySelectorAll('.ring-card')];const n=cards.length;
 const vw=innerWidth;const w=vw<700?vw*.9:Math.min(640,vw*.36);const h=w*.78;const gap=w*.07;
 ringRadius=n*(w+gap)/(2*Math.PI);
 const stage=$('.hero-stage');stage.style.setProperty('--persp',`${Math.round(ringRadius*1.03)}px`);
 cards.forEach((card,i)=>{card.style.setProperty('--w',`${w}px`);card.style.setProperty('--h',`${h}px`);card.dataset.angle=String(i*360/n);
  card.style.transform=`rotateY(${i*360/n}deg) translateZ(${-ringRadius}px)`;});
 paintRing();
}
function paintRing(){$('#ring').style.transform=`rotateY(${ringAngle}deg)`;}
let ringRunning=!reduceMotion,last=0,heroVisible=true;
function spin(t){if(last&&ringRunning&&heroVisible){ringAngle=(ringAngle+(t-last)*0.0045)%360;paintRing();}last=t;requestAnimationFrame(spin);}
function buildTicker(){
 const group=()=>`<div class="ticker-group">${tickerWords.map((w,i)=>`<span class="ticker-item${i%2?' outline':''}">${state.language==='ar'?w[0]:w[1]}</span><img class="ticker-star" src="${asset('assets/favicon.svg')}" alt="">`).join('')}</div>`;
 $('#ticker-track').innerHTML=group()+group();
}
function buildMarquee(){const set=marqueePhotos.map(n=>`<img src="${photoSrc(n)}" alt="" loading="lazy" width="360" height="240">`).join('');$('#marquee-track').innerHTML=set+set;}
function renderServices(){
 $('#services-list').innerHTML=categories.map((c,i)=>`<div class="acc-item${state.openService===i?' is-open':''}"><button class="acc-head" type="button" aria-expanded="${state.openService===i}" data-service="${i}"><span class="acc-num">${pad(i+1)}</span><h3 class="acc-title">${catName(c)}</h3><span class="acc-icon" aria-hidden="true"></span></button><div class="acc-body"><div class="acc-inner"><div class="acc-content"><div><p>${tr(c.descAr,c.descEn)}</p><a href="#projects" class="acc-link" data-show="${c.id}">${tr('مشاهدة الصور','View project images')} <span aria-hidden="true">${tr('←','→')}</span></a></div><div class="acc-thumb"><img src="${photoSrc(c.cover)}" alt="" loading="lazy" width="300" height="200"></div></div></div></div></div>`).join('');
}
function renderPrinciples(){
 $('#principle-grid').innerHTML=principles.map((p,i)=>`<article class="principle" data-reveal><div class="principle-top"><svg viewBox="0 0 50 50" aria-hidden="true">${p.icon}</svg><span>${pad(i+1)}</span></div><h3>${tr(p.ar,p.en)}</h3><p>${tr(p.descAr,p.descEn)}</p></article>`).join('');
 observeReveals();
}

/* ---------- gallery ---------- */
const filtered=()=>photos.filter(p=>state.filter==='all'||p.category===state.filter);
function renderFilters(){
 const all=[{id:'all',ar:'الكل',en:'All',count:photos.length},...categories.map(c=>({id:c.id,ar:c.shortAr,en:c.shortEn,count:c.end-c.start+1}))];
 $('#filters').innerHTML=all.map(f=>`<button type="button" class="filter-button" data-filter="${f.id}" aria-pressed="${f.id===state.filter}">${tr(f.ar,f.en)}<sup>${f.count}</sup></button>`).join('');
}
function renderGrid(){
 const found=filtered();const shown=found.slice(0,state.limit);
 $('#project-grid').innerHTML=shown.map(p=>{const c=catFor(p);return `<button class="project-card" type="button" data-photo="${p.id}" aria-label="${tr('فتح','Open')} ${photoTitle(p)} — ${catName(c)}"><img src="${p.file}" alt="${catName(c)} — ${photoTitle(p)}" loading="lazy" width="400" height="330"><span class="cap"><span>${catName(c)}</span><small>${pad(p.id)}</small></span></button>`;}).join('');
 $('#result-status').textContent=tr(`عرض ${shown.length} من ${found.length} صورة`,`Showing ${shown.length} of ${found.length} images`);
 $('#load-more').hidden=shown.length>=found.length;
}
function chooseFilter(id){state.filter=id;state.limit=12;renderFilters();renderGrid();}

/* ---------- lightbox ---------- */
function openPhoto(id){state.lastFocus=document.activeElement;state.dialogPhotos=filtered();state.dialogIndex=state.dialogPhotos.findIndex(p=>p.id===id);if(state.dialogIndex<0)return;renderDialog();$('#image-dialog').showModal();document.body.classList.add('modal-open');}
function renderDialog(){const p=state.dialogPhotos[state.dialogIndex];if(!p)return;const c=catFor(p);$('#dialog-category').textContent=catName(c);$('#dialog-title').textContent=photoTitle(p);$('#dialog-image').src=p.file;$('#dialog-image').alt=`${catName(c)} — ${photoTitle(p)}`;$('#dialog-counter').textContent=`${state.dialogIndex+1} / ${state.dialogPhotos.length}`;}
function stepPhoto(d){state.dialogIndex=(state.dialogIndex+d+state.dialogPhotos.length)%state.dialogPhotos.length;renderDialog();}

/* ---------- language ---------- */
function translatePage(){
 const ar=state.language==='ar';
 document.documentElement.lang=state.language;document.documentElement.dir=ar?'rtl':'ltr';
 document.title=tr('أديم العمران — المقاولات الهندسية','Adim Alumran — Engineering Contracting');
 document.querySelectorAll('[data-ar][data-en]').forEach(n=>{n.textContent=n.dataset[state.language];});
 $('#language-toggle').textContent=ar?'EN':'العربية';$('#language-toggle').setAttribute('aria-label',tr('Switch to English','التحويل إلى العربية'));
 $('#footer-lang').textContent=ar?'English':'العربية';
 $('.brand').setAttribute('aria-label',tr('أديم العمران — الرئيسية','Adim Alumran — Home'));
 $('#main-nav').setAttribute('aria-label',tr('القائمة الرئيسية','Main navigation'));
 $('#menu-toggle').setAttribute('aria-label',tr('فتح القائمة','Open menu'));
 $('#filters').setAttribute('aria-label',tr('تصنيف الصور','Filter images'));
 $('#close-dialog').setAttribute('aria-label',tr('إغلاق','Close'));
 $('#to-top').setAttribute('aria-label',tr('إلى الأعلى','Back to top'));
 buildTicker();renderServices();renderPrinciples();renderFilters();renderGrid();
 if($('#image-dialog').open)renderDialog();
}
function toggleLanguage(){closeMenu();state.language=state.language==='ar'?'en':'ar';try{localStorage.setItem('adim-language',state.language);}catch{}translatePage();}

/* ---------- interactions ---------- */
function closeMenu(){$('#main-nav').classList.remove('is-open');$('#menu-toggle').setAttribute('aria-expanded','false');}
$('#language-toggle').addEventListener('click',toggleLanguage);
$('#footer-lang').addEventListener('click',()=>{toggleLanguage();scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'});});
$('#menu-toggle').addEventListener('click',()=>{const open=$('#menu-toggle').getAttribute('aria-expanded')!=='true';$('#menu-toggle').setAttribute('aria-expanded',String(open));$('#main-nav').classList.toggle('is-open',open);});
$('#main-nav').addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
$('#services-list').addEventListener('click',e=>{
 const head=e.target.closest('[data-service]');
 if(head){const i=Number(head.dataset.service);state.openService=state.openService===i?-1:i;document.querySelectorAll('.acc-item').forEach((item,k)=>{item.classList.toggle('is-open',k===state.openService);item.querySelector('.acc-head').setAttribute('aria-expanded',String(k===state.openService));});return;}
 const link=e.target.closest('[data-show]');if(link){chooseFilter(link.dataset.show);}
});
$('#filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b)chooseFilter(b.dataset.filter);});
$('#load-more').addEventListener('click',()=>{state.limit+=12;renderGrid();});
$('#project-grid').addEventListener('click',e=>{const b=e.target.closest('[data-photo]');if(b)openPhoto(Number(b.dataset.photo));});
$('#close-dialog').addEventListener('click',()=>$('#image-dialog').close());
$('#image-dialog').addEventListener('close',()=>{document.body.classList.remove('modal-open');state.lastFocus?.focus();});
$('#image-dialog').addEventListener('click',e=>{if(e.target===$('#image-dialog'))$('#image-dialog').close();});
$('#previous-image').addEventListener('click',()=>stepPhoto(-1));$('#next-image').addEventListener('click',()=>stepPhoto(1));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();if(!$('#image-dialog').open)return;if(e.key==='ArrowRight')stepPhoto(1);if(e.key==='ArrowLeft')stepPhoto(-1);});

/* header + back-to-top + active link */
const bar=$('#to-top-bar'),circ=2*Math.PI*23;
let ticking=false;
function onScroll(){
 const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
 $('#site-header').classList.toggle('is-solid',y>40);
 $('#to-top').classList.toggle('is-visible',y>innerHeight*.6);
 bar.style.strokeDashoffset=String(circ*(1-(h>0?Math.min(1,y/h):0)));
 let current='home';['about','services','projects','contact'].forEach(id=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<innerHeight*.4)current=id;});
 document.querySelectorAll('.main-nav a').forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')===`#${current}`));
 ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(layoutRing,120);});

/* reveal */
let revealObserver=null;
function observeReveals(){if(!revealObserver)return;document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(n=>revealObserver.observe(n));}
if('IntersectionObserver' in window&&!reduceMotion){
 document.documentElement.classList.add('motion-ready');
 revealObserver=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('is-visible');revealObserver.unobserve(en.target);}}),{threshold:.12});
 new IntersectionObserver(es=>{heroVisible=es[0].isIntersecting;}).observe($('#home'));
}

/* init */
try{const saved=localStorage.getItem('adim-language');if(saved==='ar'||saved==='en')state.language=saved;}catch{}
$('#year').textContent=String(new Date().getFullYear());
buildRing();buildMarquee();translatePage();observeReveals();onScroll();
requestAnimationFrame(spin);
