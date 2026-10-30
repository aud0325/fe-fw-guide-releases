import {mentionBoundary,nameProtector,insideOtherName} from './entity-mentions.mjs';
import {escapeHtml as esc} from './core.mjs';
import {entryDisplayName,isDiscoverable} from './editorial-view.mjs';

const indexes=new WeakMap();
function termIndex(entries){
 if(indexes.has(entries))return indexes.get(entries);
 const index=new Map(),byId=new Map(entries.map(e=>[e.id,e]));
 for(const entry of entries.filter(isDiscoverable)){
  const terms=new Set([entry.name.ko,entryDisplayName(entry,'ko'),entry.name.en,...(entry.textAliases||[])]);
  for(const term of terms){
   if(!term||term.length<2)continue;
   if(!index.has(term))index.set(term,new Set());index.get(term).add(entry.id);
  }
 }
 const result={index,byId,compiled:new WeakMap(),protectNames:nameProtector(entries)};indexes.set(entries,result);return result;
}
// Only reviewed relationships are eligible. Search aliases alone never assert a relation.
// Work on plain text, and escape every generated fragment. Never rewrite rendered HTML.
export function renderEntityText(value,entry,{entries,lang='ko',href,format=x=>x}){
 const raw=String(format(String(value??''))),{index,byId,compiled,protectNames}=termIndex(entries);
 if(!compiled.has(entry)){
  const targets=new Set((entry.links||[]).map(l=>l.to));targets.delete(entry.id);
  const terms=new Map();
  for(const [term,ids] of index)if(ids.size===1){
   const id=[...ids][0];if(targets.has(id))terms.set(term,byId.get(id));
  }
  compiled.set(entry,terms);
 }
 const terms=new Map(compiled.get(entry));if(!terms.size)return esc(raw);
 // Include display-translated aliases as a whole, so a bilingual source name becomes one link.
 for(const [term,target] of compiled.get(entry)){
  const translated=String(format(term));if(translated&&translated!==term&&!terms.has(translated))terms.set(translated,target);
 }
 const pattern=new RegExp([...terms.keys()].sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gu');
 const spans=protectNames(raw);
 let html='',offset=0;
 for(const match of raw.matchAll(pattern)){
  const term=match[0],start=match.index,end=start+term.length;
  if(!mentionBoundary(raw,start,end,term)||insideOtherName(spans,start,end))continue;
  const target=terms.get(term),name=entryDisplayName(target,lang);
  html+=esc(raw.slice(offset,start))+`<a href="${esc(href(target.id))}">${esc(name)}</a>`;
  offset=end;
 }
 return html+esc(raw.slice(offset));
}
