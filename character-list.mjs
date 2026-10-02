import {recruitmentComparison,recruitmentValue,isTutorialRecruit} from './recruitment.mjs';
import {routes} from './locales/labels.mjs';
import {escapeHtml as esc} from './core.mjs';
// Administrator-specified starting-party order; protagonist comes first.
export const automaticJoinOrder={
 cai:['cai','tialla','peter','guzran','ultand'],
 dietrich:['dietrich','esmeralda','fabio','yang-jie','mikaela'],
 theodora:['theodora','bonaventure','tobias','lysander','lilian','sofia'],
 leda:['leda','buccar','mu','olympia','sirocco','catania']
};
export const automaticRank=(id,route)=>{const rank=automaticJoinOrder[route]?.indexOf(id)??-1;return rank<0?Infinity:rank;};
export const scoutRoute=state=>routes.some(([id])=>id===state.scout)?state.scout:'all';
export function sortScouts(list,route){
 if(route==='all')return list;
 const eligible=list.filter(e=>e.type==='character'&&e.recruitment?.[route]&&e.recruitment[route].mode!=='unavailable');
 const rank=e=>{const r=e.recruitment[route];return [r.mode==='automatic'?0:r.mode==='scout'&&r.renown!=null&&r.support!=null?1:2,r.renown??Infinity,r.support??Infinity,r.item||r.gold||r.requirement&&!['N/A','Automatic',''].includes(r.requirement)?1:0];};
 return eligible.sort((a,b)=>{if(a.recruitment[route].mode==='automatic'&&b.recruitment[route].mode==='automatic'){const x=automaticRank(a.id,route),y=automaticRank(b.id,route);if(x!==y)return x<y?-1:1;}const x=rank(a),y=rank(b);for(let i=0;i<x.length;i++)if(x[i]!==y[i])return x[i]<y[i]?-1:1;return a.name.en.localeCompare(b.name.en);});
}
export function scoutConditions(e,route,t){
 const r=e.recruitment?.[route];if(!r)return t('scout.unknown');
 const comparison=recruitmentComparison(e,route),flag=comparison?' · '+t('character.'+comparison.kind):'';
 if(isTutorialRecruit(e,route))return t('character.tutorial-report');
 if(r.mode==='automatic')return t('common.automatic')+flag;
 if(r.mode==='unknown')return t('scout.unknown')+flag;
 return t('scout.conditions',{renown:recruitmentValue(e,route,'renown'),support:recruitmentValue(e,route,'support')})+(r.item||r.gold||r.requirement&&!['N/A','Automatic',''].includes(r.requirement)?' · '+t('scout.additional'):'')+flag;
}
export function scoutToolbar(state,t){
 const selected=scoutRoute(state),route=routes.find(([id])=>id===selected);
 return `<section class="scout-toolbar" aria-label="${t('scout.label')}"><div class="scout-routes">${[['all',t('scout.default')],...routes.map(([id,ko,en])=>[id,t(ko,en)])].map(([id,name])=>`<button type="button" data-scout-route="${id}" aria-pressed="${selected===id}">${esc(name)}</button>`).join('')}</div><p class="scout-caption" role="status">${route?t('scout.group-help'):t('scout.factions')}</p>${route?`<details class="sort-help"><summary>${t('editorial.sort-order-and-caveats')}</summary><p class="result-label">${t('scout.order')} ${t('character.sort-basis')}</p></details>`:''}</section>`;
}

export function scoutGroups(list,route){
 const grouped=new Map();
 for(const e of sortScouts(list,route)){
  const r=e.recruitment[route];
  const key=r.mode==='automatic'?'automatic':r.mode==='scout'&&typeof r.renown==='number'&&Number.isFinite(r.renown)?r.renown:'unknown';
  if(!grouped.has(key))grouped.set(key,[]);
  grouped.get(key).push(e);
 }
 return [...grouped].sort(([a],[b])=>a==='automatic'?-1:b==='automatic'?1:a==='unknown'?1:b==='unknown'?-1:a-b).map(([key,entries])=>({key,entries}));
}
export function scoutGroupedList(list,route,{t,card}){
 return `<div class="scout-groups">${scoutGroups(list,route).map(({key,entries})=>`<section class="scout-group"><h2>${t(typeof key==='number'?'scout.group-renown':'scout.group-'+key,{value:key})} <small>· ${t(entries.length===1?'scout.group-one':'scout.group-count',{count:entries.length})}</small></h2><div class="cards">${entries.map(card).join('')}</div></section>`).join('')}</div>`;
}
