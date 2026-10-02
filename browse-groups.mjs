import {automaticJoinOrder,automaticRank} from './character-list.mjs';
import {escapeHtml as esc} from './core.mjs';
import {characterFaction} from './presentation.mjs';
import {displayText} from './presentation.mjs';
import {classTierOrder} from './catalog-ui.mjs';
import {roleNames} from './locales/labels.mjs';
import {itemMajors,itemMinors,itemKinds,classifyItem} from './item-types.mjs';
import {defaultState,pagePath,stateQuery} from './routing.mjs';

export const primaryRole=e=>['playable','guest','boss','npc','background'].find(role=>e.roles?.includes(role))||'background';
export const factionKey=e=>e.facts?.find(f=>f.key==='faction')?.value||e.group||'undocumented';
export function characterGroups(list){
 const groups=new Map();
 for(const e of list){
  const role=primaryRole(e),faction=role==='playable'?factionKey(e):'',key=role+':'+faction;
  if(!groups.has(key))groups.set(key,{role,faction,entries:[]});
  groups.get(key).entries.push(e);
 }
 for(const g of groups.values()){const route=Object.keys(automaticJoinOrder).find(id=>g.entries.some(e=>e.id===id));if(g.role==='playable'&&route)g.entries.sort((a,b)=>{const x=automaticRank(a.id,route),y=automaticRank(b.id,route);return x===y?0:x<y?-1:1;});}
 return [...groups.values()].sort((a,b)=>Object.keys(roleNames).indexOf(a.role)-Object.keys(roleNames).indexOf(b.role));
}
export function groupedBrowse(list,state,{t,lang,base,card,classCards,entries}){
 const link=patch=>pagePath({...defaultState(),type:state.type,...patch},lang,base)+stateQuery({...defaultState(),type:state.type,...patch});
 const sample=(rows,compact=false)=>`<div class="${compact?'browse-item-rows':'cards'}">${rows.slice(0,6).map(e=>card(e).replaceAll('<h3>','<h4>').replaceAll('</h3>','</h4>')).join('')}</div>`;
 if(state.type==='character'){
  const groups=characterGroups(list);
  const section=g=>{
   const title=g.faction?characterFaction(g.entries[0],t,entries):t(...roleNames[g.role]);
   const url=link({group:g.role,faction:g.faction});
   return `<section class="browse-group"><div class="browse-group-heading"><h3>${esc(title)}</h3><small>${g.entries.length}${t('common.entries')}</small>${g.entries.length>6?`<a class="group-more" aria-label="${esc(t('browse.view-group',{name:title,count:g.entries.length}))}" href="${esc(url)}">${t('browse.view-all')}</a>`:''}</div>${sample(g.entries)}</section>`;
  };
  const allies=groups.filter(g=>g.role==='playable'),guests=groups.filter(g=>g.role==='guest'),other=groups.filter(g=>!['playable','guest'].includes(g.role));
  return `<div class="grouped-browse character-browse">${allies.length?`<h2>${t('browse.factions')}</h2><div class="character-factions">${allies.map(section).join('')}</div>`:''}${guests.map(section).join('')}${other.length?`<details class="other-characters"><summary>${t('browse.other-people')} (${other.reduce((n,g)=>n+g.entries.length,0)})</summary>${other.map(section).join('')}</details>`:''}</div>`;
 }
 if(state.type==='class'){
  const categories=[...new Set(list.map(e=>e.category).filter(Boolean))];
  const order=[...classTierOrder.filter(x=>categories.includes(x)),...categories.filter(x=>!classTierOrder.includes(x)).sort()];
  return `<div class="grouped-browse class-browse">${order.map(category=>{
   const rows=list.filter(e=>e.category===category),title=displayText(category,t,entries);
   return `<section class="browse-group"><div class="browse-group-heading"><h2>${esc(title)}</h2><small>${rows.length}${t('common.entries')}</small>${rows.length>6?`<a class="group-more" aria-label="${esc(t('browse.view-group',{name:title,count:rows.length}))}" href="${esc(link({group:category}))}">${t('browse.view-all')}</a>`:''}</div>${classCards(rows.slice(0,6))}</section>`;
  }).join('')}</div>`;
 }
 return `<div class="grouped-browse item-browse">${Object.entries(itemMajors).filter(([id])=>!state.itemMajor||state.itemMajor===id).map(([major,title])=>{
  const groups=Object.entries(itemMinors).filter(([,m])=>m.major===major).map(([id,m])=>({id,...m,entries:list.filter(e=>classifyItem(e).minor===id)})).filter(g=>g.entries.length);
  if(!groups.length)return '';
  return `<section>${!state.itemMajor?`<h2>${esc(t(title.ko,title.en))}</h2>`:''}<div class="item-group-grid">${groups.map(g=>{
   const label=t(g.ko,g.en),kinds=Object.entries(itemKinds).filter(([id,k])=>k.minor===g.id&&g.entries.some(e=>classifyItem(e).kind===id));
   return `<section class="browse-group"><div class="browse-group-heading"><h3>${esc(label)}</h3><small>${g.entries.length}${t('common.entries')}</small><a class="group-more item-group-more" aria-label="${esc(t('browse.view-group',{name:label,count:g.entries.length}))}" href="${esc(link({itemMajor:major,itemMinor:g.id}))}">${t('item.view-all')}</a></div>${kinds.length>1?`<div class="kind-links">${kinds.map(([id,k])=>`<a href="${esc(link({itemMajor:major,itemMinor:g.id,itemKind:id}))}">${esc(t(k.ko,k.en))}</a>`).join('')}</div>`:''}${sample(g.entries,true)}</section>`;
  }).join('')}</div></section>`;
 }).join('')}</div>`;
}
