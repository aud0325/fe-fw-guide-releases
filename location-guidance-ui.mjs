import {escapeHtml as esc} from './core.mjs';
import {localized} from './locales/index.mjs';
import {pagePath} from './routing.mjs';
import {groupedRecommendedLevels} from './location-guidance-model.mjs';
export function locationGuidanceDetails(e,{t,name,entries,routes,base='/'}){
 const data=e.locationGuidance;if(!data)return '';
 const routeNames=ids=>ids?.length===routes.length?'':(ids||[]).map(id=>routes.find(r=>r[0]===id)).filter(Boolean).map(r=>t(r[1],r[2])).join(' · ');
 const scope=row=>[row.part?t('dungeon.part',{part:row.part}):'',routeNames(row.routeIds),row.chapter?t('supply.chapter',{chapter:row.chapter}):''].filter(Boolean).join(' · ');
 const link=id=>{const target=entries.find(e=>e.id===id);return target?`<a href="${esc(pagePath({id},t.locale,base)+(target.locationGuidance?'#section-location-guide':''))}">${esc(name(target))}</a>`:'';};
 const text=value=>{const raw=localized(value,t.locale),pattern=/\{([a-z0-9-]+)\}/g;let html='',last=0;for(const match of raw.matchAll(pattern)){html+=esc(raw.slice(last,match.index))+link(match[1]);last=match.index+match[0].length;}return html+esc(raw.slice(last));};
 const direction=row=>{const destination=row.destinationId?link(row.destinationId):row.destinationName?`<span lang="en">${esc(row.destinationName.en)}</span>`:'',period=row.part===3&&!row.routeIds?.length&&!row.chapter?'':scope(row);return `<div class="location-guide-direction" id="location-guide-${esc(row.id)}" tabindex="-1">${destination?`<h3>${t('location.guide.destination',{name:destination})}</h3>`:''}${period?`<p class="location-guide-scope">${esc(period)}</p>`:''}<p>${text(row.text)}</p></div>`;};
 const table=levels=>levels.length?`<div class="table-wrap location-guide-levels"><table><colgroup><col><col class="location-guide-level-column"></colgroup><thead><tr><th scope="col">${t('location.guide.scope')}</th><th scope="col">${t('location.guide.recommended')}</th></tr></thead><tbody>${levels.map(row=>`<tr><th scope="row">${esc(scope(row))}</th><td>Lv${row.level}</td></tr>`).join('')}</tbody></table></div>`:'';
 const levels=groupedRecommendedLevels(data.recommendedLevels),current=data.directions.filter(r=>r.part!==3).map(direction).join('')+table(levels.filter(r=>r.part!==3)),later=data.directions.filter(r=>r.part===3).map(direction).join('')+table(levels.filter(r=>r.part===3));
 if(!current&&!later)return '';
 return `<section class="location-guidance" id="section-location-guide" tabindex="-1"><h2>${t('location.guide.title')}</h2>${current}${later?`<details class="location-guide-later"><summary>${t('location.guide.later')}</summary>${later}</details>`:''}</section>`;
}
