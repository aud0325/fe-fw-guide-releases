import {isRetiredCharacterId} from './character-visibility.mjs';
import {locationRedirects} from './location-review.mjs';
import {normalizeGrowthState} from './growth-comparison.mjs';
import {types} from './locales/labels.mjs';
import {routes} from './data.mjs';
import {normalizeItemFilters} from './item-types.mjs';
import {normalizeItemFlavor} from './food.mjs';
import {mapProvinces} from './part1-map.generated.mjs';
import {canonicalItemId} from './item-identities.mjs';
import {canonicalMountId} from './mount-review.mjs';
import {canonicalEntryId,entrySlug} from './entry-identities.mjs';
import {canonicalAbilityId,abilitySlug} from './_abilities/ability-identities.mjs';
import {mapVariantNodes,caiMarkerKinds} from './map-variants.mjs';
export const defaultState=()=>({type:'all',id:null,query:'',catalogQuery:'',forgeFrom:'',forgeTo:'',route:'all',scout:'all',includeTips:true,group:'',faction:'',order:'start',itemMajor:'',itemMinor:'',itemKind:'',itemFlavor:'',mapVariant:'all',mapPlace:'',mapItem:'',mapProvince:'',mapKind:'',mapQuery:'',...normalizeGrowthState()});
export function preferredLanguage(saved,browserLanguage){
 if(saved==='ko'||saved==='en')return saved;
 return /^en(?:-|$)/i.test(browserLanguage||'')?'en':'ko';
}
// The header search starts a fresh, global query, independent of page filters.
export const globalSearchState=query=>({...defaultState(),query});
export function pagePath(state,lang='ko',base='/'){
 if(!state.id&&state.type==='map'&&state.mapVariant==='cai')return base+lang+'/category/map/cai/';
 if(!state.id&&state.type==='growth')return base+lang+'/category/growth/'+(['class','mount'].includes(state.growthTab)?state.growthTab+'/':'');
 return base+lang+'/'+(state.id?'entry/'+encodeURIComponent(abilitySlug(entrySlug(canonicalMountId(canonicalItemId(state.id)))))+'/':state.type==='all'?'':'category/'+encodeURIComponent(state.type)+'/');
}
export function stateQuery(state){
 const p=new URLSearchParams();
 if(!state.id&&state.type==='growth'){
  const next=normalizeGrowthState(state);
  for(const [key,value]of Object.entries({mode:next.growthMode==='stats'?'stats':'',find:next.growthQuery,heat:next.growthHeat==='off'?'off':'',skill:next.growthSkill?'1':'',group:next.growthGroup,sort:next.growthSort==='default'?'':next.growthSort,direction:next.growthSort!=='default'&&next.growthDirection==='asc'?'asc':'',focus:next.growthFocus}))if(value)p.set(key,value);
  return p.size?'?'+p:'';
 }
 if(!state.id&&['character','class','mount','battalion','gambit'].includes(state.type)&&state.catalogQuery)p.set('find',state.catalogQuery);
 if(state.id&&state.growthSkill)p.set('skill','1');
 if(state.id)for(const [key,value]of [['forge-from',state.forgeFrom],['forge-to',state.forgeTo]])if(/^\d+$/.test(String(value??'')))p.set(key,String(value));
 if(state.type==='character'&&!state.id&&state.faction)p.set('faction',state.faction);
 if(state.type==='character'&&!state.id&&routes.some(([id])=>id===state.scout))p.set('scout',state.scout);
 if(state.type==='item'&&normalizeItemFlavor(state.itemFlavor))p.set('flavor',state.itemFlavor);
 if(state.type==='map'&&!state.id){
  for(const [key,value]of Object.entries({place:state.mapPlace,item:state.mapItem,province:state.mapProvince,'map-kind':state.mapKind,mq:state.mapQuery}))if(value)p.set(key,value);
 }
 for(const [key,value]of Object.entries({q:state.query,route:state.route==='all'?'':state.route,tips:state.includeTips?'':'0',group:state.group,sort:state.order==='start'?'':state.order,main:state.itemMajor,sub:state.itemMinor,kind:state.itemKind}))if(value)p.set(key,value);
 return p.size?'?'+p:'';
}
export function readRoute(url,base='/',fallback='ko'){
 const legacy=/^#(?:entry\/|category\/|\?)/.test(url.hash);
 const relative=url.pathname.startsWith(base)?url.pathname.slice(base.length):null;
 if(relative===null)return null;
 let parts=relative.replace(/index\.html$/,'').split('/').filter(Boolean),lang=['ko','en'].includes(parts[0])?parts.shift():fallback;
 if(legacy)parts=url.hash.slice(1).split('?')[0].split('/').filter(Boolean);
 const growthPath=parts[0]==='category'&&parts[1]==='growth'&&parts.length===3&&['class','mount'].includes(parts[2]);
 const caiMapPath=parts[0]==='category'&&parts[1]==='map'&&parts.length===3&&parts[2]==='cai';
 if(parts.length&&!(parts.length===2&&['entry','category'].includes(parts[0]))&&!growthPath&&!caiMapPath)return null;
 const state=defaultState(),params=new URLSearchParams(legacy?url.hash.split('?')[1]||'':url.search);
 if(parts[0]==='entry'){try{state.id=canonicalAbilityId(canonicalMountId(canonicalItemId(canonicalEntryId(decodeURIComponent(parts[1])))));}catch{return null;}}
 if(state.id&&isRetiredCharacterId(state.id))Object.assign(state,{type:'character',id:null});
 if(state.id&&locationRedirects[state.id])Object.assign(state,locationRedirects[state.id],{id:locationRedirects[state.id].id||null});
 if(parts[0]==='category'){
  if(!Object.hasOwn(types,parts[1]))return null;
  state.type=parts[1];
 }
 if(state.type==='growth')Object.assign(state,normalizeGrowthState({growthTab:parts[2]||params.get('tab'),growthMode:params.get('mode'),growthQuery:params.get('find'),growthHeat:params.get('heat'),growthSkill:params.get('skill')==='1',growthGroup:params.get('group'),growthSort:params.get('sort'),growthDirection:params.get('direction'),growthFocus:params.get('focus')||url.hash.match(/^#growth-row-([a-z0-9-]+)$/)?.[1]}));
 if(state.id){state.growthSkill=params.get('skill')==='1';for(const [key,param]of [['forgeFrom','forge-from'],['forgeTo','forge-to']])state[key]=/^\d+$/.test(params.get(param)||'')?params.get(param):'';}
 state.catalogQuery=!state.id&&['character','class','mount','battalion','gambit'].includes(state.type)?params.get('find')||'':'';
 state.query=params.get('q')||'';state.group=params.get('group')||'';
 if(state.type==='location'&&state.group==='Saveilon')state.group='사벨론주';
 if(state.type==='location'&&state.group==='Nation')state.group='';
 if(state.type==='spell'&&['dark','unknown'].includes(state.group))state.group='black';
 state.faction=state.type==='character'?params.get('faction')||'':'';
 state.scout=state.type==='character'&&!state.id&&routes.some(([id])=>id===params.get('scout'))?params.get('scout'):'all';
 state.route=routes.some(r=>r[0]===params.get('route'))?params.get('route'):'all';state.includeTips=params.get('tips')!=='0';
 state.order=['start','deadline','owner'].includes(params.get('sort'))?params.get('sort'):'start';
 Object.assign(state,normalizeItemFilters({itemMajor:params.get('main')||'',itemMinor:params.get('sub')||'',itemKind:params.get('kind')||''}));
 state.itemFlavor=state.type==='item'?normalizeItemFlavor(params.get('flavor')):'';
 if(state.type==='map'&&!state.id){
  state.mapVariant=caiMapPath||params.get('variant')==='cai'?'cai':'all';
  state.mapPlace=mapVariantNodes(state.mapVariant).some(n=>n.id===params.get('place'))?params.get('place'):'';
  state.mapItem=/^[a-z0-9-]+$/.test(params.get('item')||'')?canonicalItemId(params.get('item')):'';
  state.mapProvince=[...mapProvinces.map(p=>p.id),'undocumented'].includes(params.get('province')||state.mapProvince)?params.get('province')||state.mapProvince:'';
  state.mapKind=['hub','town','temple','dungeon','station','gate','banquet','gathering',...['fish','plant','ore','loot'].map(k=>'gathering-'+k),...(state.mapVariant==='cai'?caiMarkerKinds:[])].includes(params.get('map-kind'))?params.get('map-kind'):'';
  state.mapQuery=params.get('mq')||'';
 }
 if(state.type==='quest'&&state.group==='Paralogue'){state.type='paralogue';state.group='';}
 if(state.type==='item'&&state.group){Object.assign(state,normalizeItemFilters({...state,group:state.group}));state.group='';}
 // Old equipment-magic filters now open the dedicated spell catalog.
 if(state.type==='item'&&!state.id){
  const groups={'black-magic':'black','white-magic':'white','dark-magic':'black','black magic':'black','white magic':'white','dark magic':'black'};
  const kind=(params.get('kind')||params.get('group')||'').toLowerCase();
  if(params.get('sub')==='magic'||Object.hasOwn(groups,kind))Object.assign(state,{type:'spell',group:groups[kind]||'',itemMajor:'',itemMinor:'',itemKind:'',itemFlavor:''});
 }
 return {state,lang,legacy};
}
export function entryLanguageAnchor(target,current,base='/',lang='ko'){
 if(target.origin!==current.origin||target.hash||!current.hash)return '';
 try{decodeURIComponent(current.hash.slice(1));}catch{return '';}
 const next=readRoute(target,base,lang),previous=readRoute(current,base,lang);
 return next&&previous&&next.lang!==previous.lang&&next.state.id&&next.state.id===previous.state.id?current.hash:'';
}

export function rewriteLinks(html,lang,base){
 return html.replace(/href="\/(ko|en)\//g,(_,locale)=>`href="${base}${locale}/`).replace(/href="#((?:entry\/|category\/)[^" ]*|)"/g,(_,hash)=>{
  const route=readRoute(new URL(base+'#'+hash,'https://local.invalid'),base,lang);
  return route?`href="${pagePath(route.state,lang,base)}${stateQuery(route.state).replaceAll('&','&amp;')}"`:_;
 }).replace(/href="((?:\/[^"?#]*)?\/(?:ko|en)\/entry\/)([^/"?#]+)\//g,(match,prefix,id)=>{
  const slug=abilitySlug(entrySlug(canonicalMountId(canonicalItemId(decodeURIComponent(id)))));
  return `href="${prefix}${encodeURIComponent(slug)}/`;
 });
}
