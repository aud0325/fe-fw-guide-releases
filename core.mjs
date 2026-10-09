import {guideTopic} from './browse-topics.mjs';
import {matchesItemFilters} from './item-types.mjs';
import {koreanGameplayValue} from './locales/gameplay-terms.mjs';
import {englishText} from './locales/english-text.mjs';
import {flavors} from './food.mjs';
// Expand only public prose; folded story fields and spoiler reports stay out.
const prose=value=>typeof value==='string'?[value]:[value?.ko||'',value?.en||''];
export function isSpoilerEntry(e){return e.spoiler===true||/스포일러|spoiler/i.test([e.name?.ko,e.name?.en].join(' '));}
export function publicSearchProse(e){return isSpoilerEntry(e)?[]:[...prose(e.body),...prose(e.note),...prose(e.materialDescription),...(e.checklist||[]).flatMap(r=>prose(r.label)),...(e.communityNotes||[]).filter(n=>!n.spoiler).flatMap(n=>prose(n.text)),...(e.guideSections||[]).filter(s=>!s.spoiler).flatMap(s=>[s.title,...(s.paragraphs||[]),...(s.steps||[]),...(s.bullets||[]),...(s.table?.headers||[]),...(s.table?.rows||[]).flat()].flatMap(prose))];}
export function normalize(value){return String(value).normalize('NFKC').toLocaleLowerCase().replace(/[\s’'“”"·:.,!?()\-_/]/g,'');}
export const matchesLocationGroup=(e,group)=>e.mapProvince?.ko===group||(!e.mapProvince&&(e.region||'Unverified')===group)||(group!=='Unverified'&&e.region===group);
export function searchEntries(entries,{query='',type='all',route='all',includeTips=true,group='',faction='',itemMajor='',itemMinor='',itemKind='',itemFlavor=''}={}){
 const tokens=query.trim().split(/\s+/).map(normalize).filter(Boolean);
 return entries.filter(e=>(type!=='character'||!faction||(e.facts?.find(f=>f.key==='faction')?.value||e.group||'undocumented')===faction)&&(type!=='item'||matchesItemFilters(e,{itemMajor,itemMinor,itemKind,itemFlavor}))&&(type==='all'||e.type===type)&&(!group||e.category===group||(type==='tip'&&guideTopic(e).id===group)||(type==='location'&&matchesLocationGroup(e,group))||(type==='character'?['playable','guest','boss','npc','background'].find(role=>e.roles?.includes(role))===group:e.roles?.includes(group)))&&(includeTips||e.type!=='tip')&&(route==='all'||!e.routeIds||e.routeIds.includes(route))).map(e=>{
  const names=[e.name.ko,e.name.en,englishText(e.name.en),...e.aliases].map(normalize);
  if(e.ingredientFlavor){const f=flavors[e.ingredientFlavor.flavor];names.push(normalize(f.ko),normalize(f.en));}
  const all=normalize([...names,e.summary.ko,e.summary.en,...publicSearchProse(e),e.type,e.category||'',e.type==='location'?e.region||'':'',e.mapProvince?.ko||'',e.mapProvince?.en||'',...(e.facts||[]).filter(f=>!['joins','first-appearance'].includes(f.key)).flatMap(f=>[f.value,f.valueKo||'',koreanGameplayValue(f.value,f.literal?'':f.key)]),...(e.gifts||[]).flatMap(g=>[g.name,g.nameKo||'']),...(e.giftCategoryReports||[]).map(r=>r.text),...(e.gathering||[]).flatMap(r=>[r.region,r.where])].join(' '));
  const score=tokens.reduce((s,t)=>s+(names.includes(t)?100:names.some(n=>n.startsWith(t))?50:names.some(n=>n.includes(t))?25:all.includes(t)?10:-10000),0);
  return {e,score,match:tokens.every(t=>all.includes(t))};
 }).filter(x=>x.match).sort((a,b)=>b.score-a.score).map(x=>x.e);
}
export function relatedTo(entries,id){return entries.filter(e=>e.id!==id&&(e.links||[]).some(l=>l.to===id));}
export function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
