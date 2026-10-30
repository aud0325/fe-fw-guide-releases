import {escapeHtml as esc} from './core.mjs';
import {localized} from './locales/index.mjs';
import {groupedGatheringScopes} from './gathering-model.mjs';
export function gatheringConditionDetails(scopes,{t,routes,entries=[],name,href}){
 const clusters=new Map();
 for(const group of groupedGatheringScopes(scopes)){const key=JSON.stringify([group.kind,group.regularPercent,group.firstGatherGuaranteed,group.acceptedQuest||null,group.extraConditions||[]]);if(!clusters.has(key))clusters.set(key,[]);clusters.get(key).push(group);}
 return [...clusters.values()].map(groups=>{
  const group=groups[0],scopeLines=groups.map(scope=>{const parts=scope.parts.length===1?t('dungeon.part',{part:scope.parts[0]}):t('gathering.parts',{parts:scope.parts.join(t.locale==='ko'?'·':', ')}),names=scope.routeIds.length===routes.length?'':scope.routeIds.map(id=>routes.find(r=>r[0]===id)).filter(Boolean).map(r=>t(r[1],r[2])).join(' · ');return `<span class="gathering-scope">${esc([parts,names].filter(Boolean).join(' · '))}</span>`;}).join('');
  const rate=group.regularPercent==null?'':t('gathering.rate',{percent:group.regularPercent});
  const primary=group.kind==='quest'?t('gathering.quest-first'):group.kind==='dungeon'?t('gathering.dungeon-ore'):[rate,group.firstGatherGuaranteed?t('gathering.first-guaranteed'):''].filter(Boolean).join(' · ');
  const guide=group.acceptedQuest?.en==='Legacy of a Legendary Sculptor'?entries.find(e=>e.id==='legendary-sculptor-guide'):null;
  const quest=group.acceptedQuest?guide?`<span class="gathering-quest"><a href="${esc(href(guide.id))}">${esc(name(guide))}</a></span>`:`<span class="gathering-quest"${!group.acceptedQuest[t.locale]?' lang="en"':''}>${esc(localized(group.acceptedQuest,t.locale))}</span>`:'';
  const extra=(group.extraConditions||[]).map(c=>`<span class="gathering-extra">${esc(localized(c,t.locale))}</span>`).join('');
  return `<span class="gathering-condition"><span class="gathering-primary">${esc(primary)}</span>${quest}${scopeLines}${extra}</span>`;
 }).join('');
}
