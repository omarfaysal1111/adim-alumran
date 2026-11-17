'use strict';
const asset=path=>window.ADIM_ASSETS?.[path]||path;
const categories=[
 {id:'building',ar:'المباني والتشطيبات',en:'Buildings & fit-out',shortAr:'المباني',shortEn:'Buildings',descriptionAr:'واجهات، أعمال داخلية، وتفاصيل مراحل التنفيذ.',descriptionEn:'Facades, interiors and details from the construction process.',start:1,end:23,cover:8,tag:'BUILDINGS & INTERIORS'},
 {id:'cold',ar:'المستودعات والتبريد',en:'Warehousing & refrigeration',shortAr:'التبريد',shortEn:'Refrigeration',descriptionAr:'فراغات صناعية، غرف تبريد، وتجهيزات المستودعات.',descriptionEn:'Industrial spaces, cold rooms and warehouse installations.',start:24,end:42,cover:24,tag:'WAREHOUSING & COLD ROOMS'},
 {id:'mechanical',ar:'الأنظمة الميكانيكية',en:'Mechanical systems',shortAr:'الأنظمة الميكانيكية',shortEn:'Mechanical',descriptionAr:'شبكات تكييف، وحدات مناولة هواء، وتفاصيل الأنظمة.',descriptionEn:'HVAC networks, air handling units and system details.',start:43,end:58,cover:44,tag:'MECHANICAL & HVAC'},
 {id:'fire',ar:'أنظمة مكافحة الحريق',en:'Fire protection systems',shortAr:'مكافحة الحريق',shortEn:'Fire protection',descriptionAr:'مضخات، شبكات، وتجهيزات أنظمة مكافحة الحريق.',descriptionEn:'Pumps, networks and fire protection installations.',start:59,end:63,cover:61,tag:'FIRE PROTECTION'}
];
const photos=categories.flatMap(category=>Array.from({length:category.end-category.start+1},(_,index)=>({id:category.start+index,category:category.id,file:asset(`assets/project-photo-${String(category.start+index).padStart(2,'0')}.jpg`)})));
const state={language:'ar',filter:'all',search:'',limit:12,dialogIndex:0,dialogPhotos:[],lastFocus:null};
const $=selector=>document.querySelector(selector);
const categoryFor=photo=>categories.find(category=>category.id===photo.category);
const tr=(ar,en)=>state.language==='ar'?ar:en;
const photoTitle=photo=>tr(`صورة مرجعية ${String(photo.id).padStart(2,'0')}`,`Archive image ${String(photo.id).padStart(2,'0')}`);
function filteredPhotos(){const query=state.search.trim().toLocaleLowerCase().replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));return photos.filter(photo=>{const category=categoryFor(photo);return(state.filter==='all'||photo.category===state.filter)&&(!query||[photo.id,String(photo.id).padStart(2,'0'),category.ar,category.en,category.shortAr,category.shortEn,category.descriptionAr,category.descriptionEn,category.tag,photoTitle(photo)].join(' ').toLocaleLowerCase().includes(query));});}
function translatePage(){document.documentElement.lang=state.language;document.documentElement.dir=state.language==='ar'?'rtl':'ltr';document.title=tr('أديم العمران — المقاولات الهندسية','Adim Alumran — Engineering Contracting');document.querySelectorAll('[data-ar][data-en]').forEach(node=>{node.textContent=node.dataset[state.language];});document.querySelectorAll('[data-placeholder-ar]').forEach(node=>{node.placeholder=state.language==='ar'?node.dataset.placeholderAr:node.dataset.placeholderEn;});$('#language-toggle').innerHTML=state.language==='ar'?'EN <span>↗</span>':'العربية <span>↗</span>';$('#language-toggle').setAttribute('aria-label',tr('Switch to English','التحويل إلى العربية'));$('.brand').setAttribute('aria-label',tr('أديم العمران — الرئيسية','Adim Alumran — Home'));$('#main-nav').setAttribute('aria-label',tr('القائمة الرئيسية','Main navigation'));$('#menu-toggle').setAttribute('aria-label',tr('فتح القائمة','Open menu'));$('#archive-search').setAttribute('aria-label',tr('البحث في الأرشيف','Search the image archive'));$('#filters').setAttribute('aria-label',tr('تصنيف الصور','Filter images'));$('#close-dialog').setAttribute('aria-label',tr('إغلاق','Close'));$('#previous-image').setAttribute('aria-label',tr('الصورة السابقة','Previous image'));$('#next-image').setAttribute('aria-label',tr('الصورة التالية','Next image'));document.querySelectorAll('[data-lang-src-ar]').forEach(image=>{image.src=asset(state.language==='ar'?image.dataset.langSrcAr:image.dataset.langSrcEn);});$('#collections').setAttribute('aria-label',tr('مجموعات صور الأعمال','Work image collections'));renderCollections();renderFilters();renderArchive();updateMotionLabel();if($('#image-dialog').open)renderDialog();}
function renderCollections(){
 $('#collections').innerHTML=categories.map((category,index)=>`<button class="collection-card" type="button" data-collection="${category.id}"><span class="collection-image"><img src="${asset(`assets/project-photo-${String(category.cover).padStart(2,'0')}.jpg`)}" alt="${state.language==='ar'?category.ar:category.en}" loading="lazy" width="900" height="900"><span class="collection-image-number">0${index+1} / 04</span><span class="collection-open" aria-hidden="true">↗</span></span><span class="collection-meta"><span class="collection-meta-top"><strong class="collection-title">${state.language==='ar'?category.ar:category.en}</strong><span class="collection-count">${tr(`${category.end-category.start+1} صورة`,`${category.end-category.start+1} images`)}</span></span><span class="collection-description">${state.language==='ar'?category.descriptionAr:category.descriptionEn}</span><span class="collection-tag" lang="en">${category.tag}</span></span></button>`).join('');
}
function renderFilters(){const all=[{id:'all',ar:'جميع الصور',en:'All images',count:photos.length},...categories.map(category=>({id:category.id,ar:category.shortAr,en:category.shortEn,count:category.end-category.start+1}))];$('#filters').innerHTML=all.map(category=>`<button type="button" class="filter-button" data-filter="${category.id}" aria-pressed="${category.id===state.filter}">${state.language==='ar'?category.ar:category.en}<sup>${category.count}</sup></button>`).join('');}
function renderArchive(){const found=filteredPhotos();const visible=found.slice(0,state.limit);$('#archive-grid').innerHTML=visible.map(photo=>{const category=categoryFor(photo);return `<button class="archive-item" type="button" data-photo="${photo.id}" aria-label="${tr('فتح','Open')} ${photoTitle(photo)} — ${state.language==='ar'?category.ar:category.en}"><div class="archive-item-image"><img src="${photo.file}" alt="${state.language==='ar'?category.ar:category.en} — ${photoTitle(photo)}" loading="lazy" width="400" height="330"></div><div class="archive-item-caption"><span>${state.language==='ar'?category.ar:category.en}</span><small>${String(photo.id).padStart(2,'0')}</small></div></button>`;}).join('');$('#result-status').textContent=tr(`عرض ${visible.length} من ${found.length} صورة`,`Showing ${visible.length} of ${found.length} images`);$('#load-more').hidden=visible.length>=found.length;$('#empty-state').hidden=found.length>0;}
function chooseFilter(id,scroll=false){state.filter=id;state.search='';state.limit=12;$('#archive-search').value='';renderFilters();renderArchive();if(scroll){$('#archive').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}}
function openPhoto(id){state.lastFocus=document.activeElement;state.dialogPhotos=filteredPhotos();state.dialogIndex=state.dialogPhotos.findIndex(photo=>photo.id===id);if(state.dialogIndex<0)return;renderDialog();$('#image-dialog').showModal();document.body.classList.add('modal-open');$('#close-dialog').focus();}
function renderDialog(){const photo=state.dialogPhotos[state.dialogIndex];if(!photo)return;const category=categoryFor(photo);$('#dialog-category').textContent=state.language==='ar'?category.ar:category.en;$('#dialog-title').textContent=photoTitle(photo);$('#dialog-image').src=photo.file;$('#dialog-image').alt=`${state.language==='ar'?category.ar:category.en} — ${photoTitle(photo)}`;$('#original-image').href=photo.file;if(window.ADIM_ASSETS){$('#original-image').download=`Adim-Archive-${String(photo.id).padStart(2,'0')}.jpg`;$('#original-image').textContent=tr('تنزيل الصورة الأصلية ↗','Download original image ↗');}$('#dialog-counter').textContent=`${state.dialogIndex+1} / ${state.dialogPhotos.length}`;$('#dialog-thumbnails').innerHTML=state.dialogPhotos.map((item,index)=>`<button type="button" data-dialog-index="${index}" aria-current="${index===state.dialogIndex}" aria-label="${photoTitle(item)}"><img src="${item.file}" alt="" loading="lazy" width="64" height="48"></button>`).join('');$('#dialog-thumbnails [aria-current="true"]')?.scrollIntoView({block:'nearest',inline:'nearest'});}
function navigatePhoto(delta){state.dialogIndex=(state.dialogIndex+delta+state.dialogPhotos.length)%state.dialogPhotos.length;renderDialog();}
function closeMenu(){const open=$('#menu-toggle').getAttribute('aria-expanded')==='true';if(open){$('#main-nav').classList.remove('is-open');$('#menu-toggle').setAttribute('aria-expanded','false');}}
$('#language-toggle').addEventListener('click',()=>{closeMenu();state.language=state.language==='ar'?'en':'ar';try{localStorage.setItem('adim-language',state.language);}catch{}translatePage();});
$('#menu-toggle').addEventListener('click',()=>{const open=$('#menu-toggle').getAttribute('aria-expanded')!=='true';$('#menu-toggle').setAttribute('aria-expanded',String(open));$('#main-nav').classList.toggle('is-open',open);});
$('#main-nav').addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();if(!$('#image-dialog').open)return;if(event.key==='ArrowRight'){event.preventDefault();navigatePhoto(1);}if(event.key==='ArrowLeft'){event.preventDefault();navigatePhoto(-1);}});
$('#collections').addEventListener('click',event=>{const button=event.target.closest('[data-collection]');if(button)chooseFilter(button.dataset.collection,true);});
$('#filters').addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(button)chooseFilter(button.dataset.filter);});
$('#archive-search').addEventListener('input',event=>{state.search=event.target.value;state.limit=12;renderArchive();});
$('#reset-filters').addEventListener('click',()=>chooseFilter('all'));
$('#load-more').addEventListener('click',()=>{state.limit+=12;renderArchive();});
$('#archive-grid').addEventListener('click',event=>{const button=event.target.closest('[data-photo]');if(button)openPhoto(Number(button.dataset.photo));});
$('#close-dialog').addEventListener('click',()=>$('#image-dialog').close());
$('#image-dialog').addEventListener('close',()=>{document.body.classList.remove('modal-open');state.lastFocus?.focus();});
$('#image-dialog').addEventListener('click',event=>{if(event.target===$('#image-dialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)$('#image-dialog').close();}});
$('#previous-image').addEventListener('click',()=>navigatePhoto(-1));$('#next-image').addEventListener('click',()=>navigatePhoto(1));
$('#dialog-thumbnails').addEventListener('click',event=>{const button=event.target.closest('[data-dialog-index]');if(button){state.dialogIndex=Number(button.dataset.dialogIndex);renderDialog();}});
document.querySelectorAll('.approach-rows details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open){document.querySelectorAll('.approach-rows details').forEach(other=>{if(other!==detail)other.open=false;});const image=$('#principle-image');if(image&&detail.dataset.detailPhoto){image.src=asset(detail.dataset.detailPhoto);image.alt=tr('صورة مرجعية من الأرشيف','Reference image from the supplied archive');}}}));
try{const saved=localStorage.getItem('adim-language');if(saved==='ar'||saved==='en')state.language=saved;}catch{}
$('#year').textContent=String(new Date().getFullYear());translatePage();


const motionButton=$('#motion-toggle');
let motionPaused=false;
function updateMotionLabel(){
 const label=$('#motion-label');if(!label)return;
 const ar=document.body.classList.contains('motion-paused')?'تشغيل الحركة':'إيقاف الحركة';
 const en=document.body.classList.contains('motion-paused')?'Play motion':'Pause motion';
 label.dataset.ar=ar;label.dataset.en=en;label.textContent=tr(ar,en);
}
motionButton.addEventListener('click',()=>{
 motionPaused=!motionPaused;document.body.classList.toggle('motion-paused',motionPaused);
 motionButton.setAttribute('aria-pressed',String(motionPaused));$('#motion-icon').textContent=motionPaused?'▷':'Ⅱ';updateMotionLabel();
});
const reduceMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
if('IntersectionObserver' in window&&!reduceMotion.matches){
 document.documentElement.classList.add('motion-ready');
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
 document.querySelectorAll('[data-reveal]').forEach(node=>revealObserver.observe(node));
}
let scrollFrame=false;
function paintProgress(){const height=document.documentElement.scrollHeight-innerHeight;$('.scroll-progress').style.transform=`scaleX(${height>0?Math.min(1,scrollY/height):0})`;scrollFrame=false;}
addEventListener('scroll',()=>{if(!scrollFrame){scrollFrame=true;requestAnimationFrame(paintProgress);}},{passive:true});paintProgress();
