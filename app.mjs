import {bindGrowthControls,bindCharacterGrowthControls,revealGrowthFocus} from './growth-controls.mjs';
import {navigationHtml,shellFilters,renderKey,hydrateContent,homeCategoriesHtml} from './shell-renderer.mjs';
import {revealAnchor} from './anchors.mjs';
import {isArchivedState} from './editorial-view.mjs';
import {trackPage} from './analytics.mjs';
import {setupUpdateCheck} from './update-check.mjs';
import {pageStructuredData,serializeStructuredData} from './seo.mjs';
import {setupSearch} from './search-ui.mjs';
import {setupSourceTooltips} from './source-tooltips.mjs';
import {renderPage} from './page-renderer.mjs';
import {defaultState,pagePath,stateQuery,readRoute,rewriteLinks,preferredLanguage} from './routing.mjs';
import {createTranslator} from './locales/index.mjs';
import {setupNavigationDrawer} from './drawer.mjs';
import {normalizeItemFilters} from './item-types.mjs';
import {normalizeItemFlavor,foodKinds} from './food.mjs';
import {bindCommunityControls} from './community-ui.mjs';
import {entries,sources,routes} from './data.mjs';
import {bindPart1Map} from './part1-map-controls.mjs';
import {escapeHtml as esc} from './core.mjs';
const $=id=>document.getElementById(id);
setupSourceTooltips(document,window);
const saved=(()=>{try{return localStorage.getItem('fw-language')}catch{return null}})();
const basePath=new URL(document.baseURI).pathname;
const updates=setupUpdateCheck(window,document,remember);
const initialRoute=readRoute(new URL(location.href),basePath,preferredLanguage(saved,navigator.language));
let lang=initialRoute?.lang||'ko';
let visibleLimit=36;
let state=initialRoute?.state||defaultState();
let t=createTranslator(lang);
let headingObserver;
let searchUI;
let mapControls;
function syncDetailHeading(){
 headingObserver?.disconnect();
 const header=document.querySelector('body>header'),heading=$('content').querySelector('.detail-heading');
 const measure=()=>{
  document.documentElement.style.setProperty('--header-height',header.getBoundingClientRect().height+'px');
  document.documentElement.style.setProperty('--detail-heading-height',(heading?.getBoundingClientRect().height||0)+'px');
 };
 measure();
 headingObserver=new ResizeObserver(measure);
 headingObserver.observe(header);if(heading)headingObserver.observe(heading);
}
function nav(){
 const key=renderKey(state,lang,visibleLimit,basePath);
 if($('navigation').dataset.renderKey===key)return;
 const expanded=new Map([...$('navigation').querySelectorAll('[data-nav-group]')].map(el=>[el.dataset.navGroup,el.open]));
 $('navigation').innerHTML=navigationHtml(state,lang,basePath,entries,sources,expanded);
 $('navigation').dataset.renderKey=key;
}
function renderFilters(){
 const controls=shellFilters(state,entries),routeVisible=controls.route;
 $('route-filter').hidden=!routeVisible;
 $('tips-filter').hidden=!controls.tips;
 document.querySelector('.page-filters').hidden=!routeVisible&&!controls.tips;
 document.querySelector('.page-filters').setAttribute('aria-label',t('app.filters'));
 $('filter-toggle').textContent=t('app.filters')+(routeVisible&&state.route!=='all'?' · '+routes.find(r=>r[0]===state.route)[lang==='ko'?1:2]:'')+(controls.tips&&!state.includeTips?t('app.no-tips'):'');
}
function render(){
 mapControls?.destroy();mapControls=null;
 updates.schedule();
 t=createTranslator(lang);nav();document.documentElement.lang=lang;$('language-value').textContent=t('app.language-switch-label');
 document.querySelector('meta[name="description"]').content=t('app.description');
 const brandName=t('app.fire-emblem-fortune-s-weave-encyclopedia');
 document.querySelectorAll('.brand-logo').forEach(logo=>{
  logo.src=lang==='ko'?'./assets/encyclopedia-logo.png':'./assets/encyclopedia-logo-en.png';
  logo.alt=brandName;
 });
 document.querySelectorAll('.brand,.sidebar-brand').forEach(link=>link.setAttribute('aria-label',t('shell.home-label')));
 $('menu-toggle').setAttribute('aria-label',t('app.open-menu'));
 $('menu-close').setAttribute('aria-label',t('app.close-menu'));
 $('language-label').textContent=t('app.language');
 document.querySelector('.intro').hidden=Boolean(state.id||state.type!=='all'||state.query);
 $('clear-search').hidden=!$('search').value;
 $('clear-search').setAttribute('aria-label',t('app.clear-search'));
 $('home-categories').innerHTML=homeCategoriesHtml(lang,basePath);
 $('language').setAttribute('aria-label',t('app.switch-to-korean'));
 document.querySelector('.skip').textContent=t('app.skip-to-content');
 document.querySelector('.brand-name').textContent=brandName;
 document.querySelector('.brand small').textContent=t('app.unofficial-fan-encyclopedia');
 document.querySelector('.intro .eyebrow').textContent='FAN ENCYCLOPEDIA';
 for(const [id,ko,en]of routes)$('route').querySelector(`[value="${id}"]`).textContent=t(ko,en);
 document.querySelector('.edition').textContent=t('app.unofficial-fan-encyclopedia');
 document.querySelector('.aside-title').textContent=t('app.fortune-s-weave-encyclopedia');
 $('navigation').setAttribute('aria-label',t('app.categories'));
 document.querySelector('.search-area').setAttribute('aria-label',t('app.search'));
 $('headline').textContent=brandName;$('intro-text').textContent=t('app.from-recruiting-allies-to-preparing-for-battle-find-your');
 $('search-label').textContent=t('app.search-the-archive');$('search').placeholder=t('app.search-names-items-places');$('route-label').textContent=t('app.your-route');$('route').options[0].textContent=t('app.all-routes');$('tips-label').textContent=t('app.include-community-tips');$('reset').textContent=t('app.reset');$('filter-toggle').textContent=t('app.filters')+(state.route!=='all'?' · '+routes.find(r=>r[0]===state.route)[lang==='ko'?1:2]:'')+(!state.includeTips?t('app.no-tips'):'');
 $('footer').innerHTML=`<a href="${basePath}${lang}/directory/">${t('app.all-documents')}</a> · <a href="${esc(pagePath(state,lang==='ko'?'en':'ko',basePath)+stateQuery(state))}">${lang==='ko'?'English':'한국어'}</a><br>`+t('app.unofficial-fan-project-not-affiliated-with-nintendo-or-intelligent');
 const page=renderPage(state,lang,visibleLimit,basePath);
 hydrateContent($('content'),renderKey(state,lang,visibleLimit,basePath),page.html);
 const growthViewport=$('content').querySelector('.growth-scroll'),savedGrowth=history.state?.growthViewport;
 if(growthViewport&&savedGrowth){growthViewport.scrollLeft=savedGrowth.x;growthViewport.scrollTop=savedGrowth.y;}
 syncDetailHeading();
 updateMetadata(page);
 trackPage();
 document.querySelectorAll('a[href^="#"]').forEach(a=>{if(a.classList.contains('skip')){a.href=location.pathname+location.search+'#main';return;}const next=rewriteLinks(a.outerHTML,lang,basePath);if(next!==a.outerHTML){const holder=document.createElement('template');holder.innerHTML=next;a.href=holder.content.firstElementChild.getAttribute('href');}});
 document.querySelectorAll('.brand,.sidebar-brand').forEach(link=>link.href=pagePath(defaultState(),lang,basePath));
 document.querySelector('.skip').href=location.pathname+location.search+'#main';
 renderFilters();
 bindCommunityControls($('content'));
 bindCharacterGrowthControls($('content'),{change:checked=>{
  remember();state.growthSkill=checked;
  history.pushState({...history.state},'',pagePath(state,lang,basePath)+stateQuery(state)+location.hash);render();
  window.scrollTo(0,history.state?.scroll||0);
  $('content').querySelector('[data-character-growth-skill]')?.focus({preventScroll:true});
 }});
 bindGrowthControls($('content'),{state,change:(next,focus)=>{
  const viewport=$('content').querySelector('.growth-scroll'),position=viewport?{x:viewport.scrollLeft,y:viewport.scrollTop}:null;
  const tabChanged=next.growthTab&&next.growthTab!==state.growthTab;remember();Object.assign(state,next);
  history.pushState({scroll:scrollY,limit:visibleLimit,growthViewport:tabChanged?null:position},'',pagePath(state,lang,basePath)+stateQuery(state));render();
  const restored=$('content').querySelector('.growth-scroll');if(restored&&position&&!tabChanged){restored.scrollLeft=position.x;restored.scrollTop=position.y;}
  $('content').querySelector(focus)?.focus({preventScroll:true});
 }});
 mapControls=bindPart1Map($('content'),{state,view:history.state?.mapViewport,change:(next,{focus,caret,center}={})=>{
  const mapViewport=mapControls?.snapshot();remember();Object.assign(state,next);
  history.pushState({scroll:scrollY,limit:visibleLimit,mapViewport},'',pagePath(state,lang,basePath)+stateQuery(state));
  render();if(center)mapControls?.center();
  const target=focus&&$('content').querySelector(focus);target?.focus({preventScroll:true});
  if(target?.id==='map-search'&&caret!=null)target.setSelectionRange(caret,caret);
  if(center&&innerWidth<900)target?.scrollIntoView({block:'nearest'});
 }});
 $('content').querySelectorAll('[data-scout-route]').forEach(b=>b.addEventListener('click',()=>{state.scout=b.dataset.scoutRoute;state.route='all';state.group='';state.faction='';visibleLimit=36;$('route').value='all';saveHash();render();$('content').querySelector(`[data-scout-route="${state.scout}"]`)?.focus({preventScroll:true});}));
 const updateItems=(next,focusSelector)=>{Object.assign(state,normalizeItemFilters(next));state.itemFlavor=normalizeItemFlavor(next.itemFlavor??state.itemFlavor);if(state.itemMajor==='equipment'||(state.itemMinor&&state.itemMinor!=='ingredients')||(state.itemKind&&!foodKinds[state.itemKind]))state.itemFlavor='';state.group='';visibleLimit=36;saveHash();render();if(focusSelector)$('content').querySelector(focusSelector)?.focus({preventScroll:true});};
 $('content').querySelectorAll('[data-item-major]').forEach(b=>b.addEventListener('click',()=>updateItems({itemMajor:b.dataset.itemMajor,itemFlavor:''},`[data-item-major="${b.dataset.itemMajor}"]`)));
 $('content').querySelectorAll('[data-item-minor]').forEach(b=>b.addEventListener('click',()=>updateItems({itemMajor:state.itemMajor,itemMinor:b.dataset.itemMinor},`[data-item-minor="${b.dataset.itemMinor}"]`)));
 $('item-kind')?.addEventListener('change',()=>updateItems({...state,itemKind:$('item-kind').value},'#item-kind'));
 $('item-flavor')?.addEventListener('change',()=>{state.itemFlavor=normalizeItemFlavor($('item-flavor').value);visibleLimit=36;saveHash();render();$('item-flavor')?.focus({preventScroll:true});});
 $('content').querySelector('[data-item-reset]')?.addEventListener('click',()=>updateItems({itemFlavor:''},'[data-item-major=""]'));

 $('content').querySelectorAll('[data-paralogue-route]').forEach(b=>b.addEventListener('click',()=>{state.route=b.dataset.paralogueRoute;$('route').value=state.route;saveHash();render();$('content').querySelector(`[data-paralogue-route="${state.route}"]`)?.focus({preventScroll:true})}));
 $('paralogue-order')?.addEventListener('change',()=>{state.order=$('paralogue-order').value;saveHash();render();$('paralogue-order')?.focus({preventScroll:true})});
 $('catalog-group')?.addEventListener('change',()=>{state.group=$('catalog-group').value;state.faction='';visibleLimit=36;saveHash();render();$('catalog-group')?.focus({preventScroll:true})});
 $('show-more')?.addEventListener('click',()=>{visibleLimit+=36;render()});
 $('content').querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;const note=document.createElement('p');note.className='result-label';note.textContent=t('app.image-unavailable-please-visit-the-source-link');img.after(note);},{once:true}));
}
document.addEventListener('click',event=>{const button=event.target.closest('[data-map-zoom]');if(!button)return;const img=$('world-map-image');if(!img)return;const current=Number(img.dataset.zoom||1);const action=button.dataset.mapZoom;const zoom=action==='reset'?1:Math.max(1,Math.min(4,current+(action==='in'?.5:-.5)));img.dataset.zoom=zoom;img.style.width=(zoom*100)+'%';$('map-scale').textContent=Math.round(zoom*100)+'%';if(action==='reset'){const viewport=img.parentElement;viewport.scrollTop=0;viewport.scrollLeft=0;}});
function updateMetadata(page){
 document.title=page.title;
 for(const [selector,value]of [['meta[name="description"]',page.description],['meta[property="og:title"]',page.title],['meta[property="og:description"]',page.description]])document.querySelector(selector)?.setAttribute('content',value);
 const origin=document.querySelector('meta[name="site-url"]')?.content;
 const structured=document.querySelector('#page-structured-data');
 if(structured)structured.textContent=serializeStructuredData(pageStructuredData(page,state,lang,origin));
 const canonical=origin?new URL(pagePath(state,lang,basePath),origin).href:'';
 document.querySelector('link[rel="canonical"]')?.setAttribute('href',canonical);
 document.querySelector('meta[property="og:url"]')?.setAttribute('content',canonical);
 document.querySelector('meta[property="og:locale"]')?.setAttribute('content',lang==='ko'?'ko_KR':'en_US');
 document.querySelector('meta[property="og:image"]')?.setAttribute('content',new URL('assets/encyclopedia-logo'+(lang==='en'?'-en':'')+'.png',origin||document.baseURI).href);
 document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link=>link.href=new URL(pagePath(state,link.hreflang==='en'?'en':'ko',basePath),origin||location.origin).href);
 document.querySelector('meta[name="robots"]')?.setAttribute('content',!origin||stateQuery(state)||page.missing||isArchivedState(state,entries)?'noindex,follow':'index,follow');
}
function remember(){const growth=$('content').querySelector('.growth-scroll');history.replaceState({...history.state,scroll:scrollY,limit:visibleLimit,...(growth?{growthViewport:{x:growth.scrollLeft,y:growth.scrollTop}}:{}),...(mapControls?{mapViewport:mapControls.snapshot()}:{})},'',location.href);}
function parseLocation(){
 const route=readRoute(new URL(location.href),basePath,lang);
 if(!route){location.reload();return;}
 state=route.state;lang=route.lang;visibleLimit=history.state?.limit||36;
 if(route.legacy||location.pathname===basePath)history.replaceState(history.state,'',pagePath(state,lang,basePath)+stateQuery(state));
 searchUI?.sync(state.query);$('route').value=state.route;$('tips').checked=state.includeTips;render();
}
function saveHash(){history.replaceState({...history.state,limit:visibleLimit},'',pagePath(state,lang,basePath)+stateQuery(state));}
document.addEventListener('click',event=>{
 const a=event.target.closest('a[href]');
 if(!a||a.getAttribute('target')||a.hasAttribute('download')||a.classList.contains('skip')||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const url=new URL(a.getAttribute('href'),document.baseURI);if(url.origin!==location.origin)return;
 if(a.classList.contains('growth-rank-link')){
  const route=readRoute(url,basePath,lang);if(route?.state.type==='growth'){
   event.preventDefault();navigateTo(url.pathname+url.search+url.hash);return;
  }
 }
 if(url.hash){
  let anchorId;try{anchorId=decodeURIComponent(url.hash.slice(1));}catch{return;}
  if(url.pathname===location.pathname&&url.search===location.search&&document.getElementById(anchorId)){
   event.preventDefault();remember();if(url.hash!==location.hash)history.pushState({...history.state},'',url.href);revealAnchor(document,url.hash);
  }
  return;
 }
 const route=readRoute(url,basePath,lang);if(!route)return;
 if(route.state.id&&!entries.some(e=>e.id===route.state.id))return;
 event.preventDefault();remember();
 // Carry context only in explicit links (e.g. a selected scout route), not globally.
 navigateTo(pagePath(route.state,route.lang,basePath)+stateQuery(route.state));
});
function navigateTo(href){
 remember();history.pushState({scroll:0,limit:36},'',href);parseLocation();window.scrollTo(0,0);
 const heading=$('entry-title')||$('content').querySelector('h1,h2');
 if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
 if(state.type==='growth'&&state.growthFocus)requestAnimationFrame(()=>revealGrowthFocus($('content'),state.growthFocus,{focus:true}));
}
history.scrollRestoration='manual';
function restoreScroll(){
 if(state.type==='growth'&&state.growthFocus){
  window.scrollTo(0,history.state?.scroll||0);
  if(!history.state?.growthViewport&&revealGrowthFocus($('content'),state.growthFocus))return;
  if(history.state?.growthViewport)return;
 }
 if(!revealAnchor(document,location.hash))window.scrollTo(0,history.state?.scroll||0);
}
window.addEventListener('popstate',()=>{parseLocation();requestAnimationFrame(restoreScroll);});
window.addEventListener('hashchange',()=>{if(/^#(?:(?:entry|category)\/|\?)/.test(location.hash))parseLocation();else revealAnchor(document,location.hash);});
searchUI=setupSearch({input:$('search'),panel:$('search-panel'),clear:$('clear-search'),entries,context:()=>({lang,base:basePath}),navigate:navigateTo});
 $('route').addEventListener('change',()=>{state.route=$('route').value;saveHash();render()});$('tips').addEventListener('change',()=>{state.includeTips=$('tips').checked;saveHash();render()});
 $('reset').addEventListener('click',()=>{state.route='all';state.includeTips=true;state.group='';state.faction='';Object.assign(state,normalizeItemFilters());state.itemFlavor='';state.order='start';visibleLimit=36;$('route').value='all';$('tips').checked=true;saveHash();render()});
 $('language').addEventListener('click',()=>{remember();lang=lang==='ko'?'en':'ko';try{localStorage.setItem('fw-language',lang)}catch{}history.pushState({scroll:scrollY,limit:visibleLimit,growthViewport:history.state?.growthViewport,...(mapControls?{mapViewport:mapControls.snapshot()}:{})},'',pagePath(state,lang,basePath)+stateQuery(state));render();searchUI.close()});
document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){event.preventDefault();$('search').focus()}});
setupNavigationDrawer();

parseLocation();
$('search').disabled=false;$('menu-toggle').disabled=false;$('startup-status').hidden=true;
if(location.hash||state.growthFocus||history.state?.fwUpdateReload)requestAnimationFrame(restoreScroll);
