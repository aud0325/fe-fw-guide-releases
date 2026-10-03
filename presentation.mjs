import {isPublicSource} from './source-visibility.mjs';
import {skillTerms,factLabels} from './locales/labels.mjs';
import {icon} from './icons.mjs';
import {displayTerms} from './display-terms.mjs';
import {koreanGameplayValue} from './locales/gameplay-terms.mjs';
import {escapeHtml as esc} from './core.mjs';

import {localized} from './locales/index.mjs';
import {editorialText} from './locales/editorial-text.mjs';
import {englishText} from './locales/english-text.mjs';
export {localized} from './locales/index.mjs';
export function collectReferences(value) {
 const ids=new Set();
 function visit(node){
  if(!node||typeof node!=='object')return;
  for(const [key,item] of Object.entries(node)){
   if(key==='sourceIds'&&Array.isArray(item))item.forEach(id=>ids.add(id));
   else if(/sourceId$/i.test(key)&&typeof item==='string')ids.add(item);
   else visit(item);
  }
 }
 visit(value);return [...ids];
}
export function referenceSite(url) {
 try {const host=new URL(url).hostname.replace(/^www\./,'');
  if(host==='gall.dcinside.com'||host==='m.dcinside.com')return 'dcinside.com';
  if(host==='game8.co'||host==='game8.jp')return 'game8';
  return host;
 }catch{return 'local';}
}
export function sourceHint({href,tooltip,label='',symbol='i',className='source-hint',external=false}){
 const description=String(tooltip||'').trim();
 return `<a class="${esc(className)}" href="${esc(href)}" data-source-tip="${esc(description)}" aria-label="${esc(label?label+' · '+description:description)}"${external?' target="_blank" rel="noopener noreferrer"':''}>${esc(symbol)}</a>`;
}
export function informationHint(tooltip,label,symbol='i'){
 return `<button type="button" class="information-hint" data-source-tip="${esc(tooltip)}" aria-label="${esc(label)}" aria-haspopup="dialog" aria-controls="source-tooltip" aria-expanded="false">${esc(symbol)}</button>`;
}
export function referenceSection(list,{sources,t,tx,updated,images=[]}) {
 const records=new Map();
 for(const e of list)for(const id of collectReferences(e)){
  const source=sources[id];if(!isPublicSource(id,source))continue;
  if(!records.has(source.url))records.set(source.url,{...source,anchorIds:[]});
  const record=records.get(source.url);if(!record.anchorIds.includes(id))record.anchorIds.push(id);
 }

 const extra=new Map();
 for(const e of list){
  if(e.referenceUrl&&!records.has(e.referenceUrl))extra.set(e.referenceUrl,{title:t('presentation.reference-entry')+' · '+tx(e.name)});
  for(const g of e.externalGuides||[])if(!records.has(g.url))extra.set(g.url,{title:g.title,note:g.status==='unavailable'?t('presentation.unavailable'):g.status==='image-only'?t('presentation.image-based'):t('presentation.body-accessed')});
 }
 for(const m of images)if(m?.sourceUrl){
  extra.set(m.sourceUrl,{title:t('presentation.image-credit')+' · '+m.credit,imageNote:m.sourceNote});
  if(records.has(m.sourceUrl)&&m.sourceNote)records.get(m.sourceUrl).imageNote=m.sourceNote;
 }
 for(const [url,s]of extra)if(!records.has(url))records.set(url,{...s,url});
 const groups=new Map();
 for(const s of records.values()){const site=referenceSite(s.url);if(!groups.has(site))groups.set(site,[]);groups.get(site).push(s);}
 const links=[...groups].map(([site,items])=>{
  const title=site==='local'?t('presentation.gameplay-recordings'):site==='game8'?'Game8':site;
  const originals=items.map(s=>`<li>${(s.anchorIds||[]).map(id=>`<span id="source-${esc(id)}" class="source-anchor" aria-hidden="true"></span>`).join('')}<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(tx(s.title))} ${icon('external')}</a>${s.checked&&!s.hideChecked?`<small>${t('common.checked')} ${esc(s.checked)}</small>`:''}${s.note?`<p>${esc(tx(s.note))}</p>`:''}${s.imageNote?`<p>${esc(tx(s.imageNote))}</p>`:''}</li>`).join('');
  return `<li class="reference-site"><strong>${esc(title)}</strong><details class="reference-originals"><summary>${t('presentation.original-sources')} (${items.length})</summary><ul>${originals}</ul></details></li>`;
 });
 const notes=list.flatMap(e=>{
  const out=[];
  if(e.videoNameEvidence){const v=e.videoNameEvidence;out.push(`${t('presentation.name-evidence-video')} · ${v.method==='unmapped'?t('presentation.english-mapping-pending'):t('presentation.english-mapping-editorial')}`);}
  if(e.videoGathering&&e.type!=='location')out.push(t('presentation.gathering-display-cai-in-game-sep-25')+(e.videoGathering.unknownSlots?t('presentation.includes-unknown-slots'):''));
  if(e.koreanNameEvidence){
   const evidence=e.koreanNameEvidence;
   if(evidence.method==='user-reported-game-label')out.push(t('presentation.korean-name-user-reported'));
   else if(evidence.method==='community-game-screenshot')out.push(t('presentation.korean-name-community-screenshot'));
   else if(evidence.method==='user-requested-label')out.push(t('presentation.korean-name-user-requested'));
   else if(evidence.sourceId===e.weaponNameEvidence?.sourceId)out.push(t('presentation.korean-name-blog-provisional'));
   else if(evidence.sourceId?.startsWith('namu-'))out.push(t('presentation.korean-names-cross-checked-against-namuwiki'));
  }
  return out.map(n=>`<p>${esc(n)}</p>`);
 });
 return links.length?`<details class="page-references"><summary>${t('presentation.references')} (${groups.size})</summary>${notes.join('')}<ol>${links.join('')}</ol></details>`:'';
}

const editorialDictionaries=new WeakMap();
function editorialDictionary(entries){
 if(!editorialDictionaries.has(entries))editorialDictionaries.set(entries,Object.fromEntries([...Object.entries(displayTerms).map(([en,v])=>[en,v.ko]),...entries.map(e=>[e.name.en,e.name.ko.replace(/\([^)]*\)$/,'')])]));
 return editorialDictionaries.get(entries);
}
export function displayText(value,t,entries=[],literal=false,key='') {
 if(value==null)return '';
 if(typeof value==='object')return t(value.ko,value.en);
 const text=String(value);
 if(t.locale==='ko'&&text.includes(' · '))return text.split(' · ').map(part=>displayText(part,t,entries,literal,key)).join(' · ');
 const entry=entries.find(e=>e.name.en===text||e.name.ko===text);
 if(entry&&entry.name.ko!==entry.name.en)return t(entry.name.ko,entry.name.en);
 if(displayTerms[text]){const translated=t(displayTerms[text].ko,displayTerms[text].en);return t.locale==='ko'?koreanGameplayValue(translated,literal?'':key):translated;}
 let result=(t.locale==='ko'?koreanGameplayValue(text,literal?'':key):text).replace(/(\d+)장/g,(_,n)=>t('common.chapter',{number:n}));
 // literal values (transcribed wiki prose) skip skill-term substitution, which would mangle Korean words.
 if(!literal&&t('ko','en')==='en'){
  const terms=skillTerms;
  if(/^[가-힣\sA-Z+·,()—-]+$/.test(result))for(const [ko,en]of Object.entries(terms))result=result.replaceAll(ko,en);
 }
 return t.locale==='ko'?editorialText(result,editorialDictionary(entries)):englishText(result,entries);
}
export function characterFaction(e,t,entries=[]){
 const faction=e.facts?.find(f=>f.key==='faction');
 const value=(t.locale==='ko'&&faction?.valueKo)||faction?.value||e.group;
 return value?displayText(value,t,entries):t('app.faction-undocumented');
}
export function localizedFacts(facts,t) {
 const korean=t('ko','en')==='ko';
 const counterpart={'personal-ko':'ability','ko-master_skill':'mastery','ko-class_skill_1':'skills','ko-class_skill_2':'skills','ko-class_skill_3':'skills','namu-likes':'likes','namu-hobby':'interests','namu-dislikes':'dislikes','namu-age':'age','namu-birthday':'birthday','namu-height':'height'};
 const preferred=new Set(korean?facts.filter(f=>counterpart[f.key]).map(f=>counterpart[f.key]):[]);
 return facts.filter(f=>!preferred.has(f.key)&&!(counterpart[f.key]&&!korean&&facts.some(other=>other.key===counterpart[f.key]))).map(f=>({...f,label:{ko:koreanGameplayValue(f.label.ko.replace(/ · (한국어|영어)/g,'')),en:factLabels[f.key]||f.label.en.replace(/ · (Korean|Japanese)/g,'')}}));
}
