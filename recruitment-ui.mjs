import {escapeHtml as esc} from './core.mjs';
import {pagePath} from './routing.mjs';
import {recruitmentValue,isTutorialRecruit,recruitmentRequirementLines} from './recruitment.mjs';
export function recruitmentDetails(e,{t,tx,name,href,entries,routes,sources,route,text,base='/'}){
 if(!e.recruitment&&!e.recruitmentAvailability)return '';
 const recruitment=e.recruitment||{};
 const laterOnly=e.lateRecruitment&&Object.values(recruitment).every(r=>r.mode==='unknown'&&r.support==null&&r.renown==null&&!r.item&&!r.requirement&&!r.fromChapter&&!r.gold);
 const nonScouting=e.recruitmentAvailability?.unavailableParts?.includes(1);
 const compact=Object.values(recruitment).every(r=>['automatic','unavailable'].includes(r.mode)||r.mode==='unknown'&&r.support==null&&r.renown==null);
 const row=([id,ko,en])=>{
  const r=recruitment[id];if(!r)return '';
  const item=entries.find(x=>x.id===r.item);
  const mode=isTutorialRecruit(e,id)?t('character.tutorial-report'):r.mode==='automatic'?t('common.automatic'):r.mode==='unavailable'?t('entity.unavailable'):r.mode==='unknown'?t('catalog.not-documented'):'';
  const requirement=item?`<a class="linkchip" href="${href(item.id)}">${esc(name(item))} × ${esc(r.quantity)} <span class="sr-only">${t('character.requirement-link')}</span></a>`:mode?esc(mode):r.requirement&&r.requirement!=='N/A'&&r.requirement!=='Automatic'?recruitmentRequirementLines(r,{lang:t.locale,translate:text}).map(line=>`<span class="recruitment-condition-line">${esc(line)}</span>`).join(''):t('catalog.no-extra-item-listed');
  return `<tr class="recruitment-route${route===id?' selected':''}"><th scope="row">${esc(t(ko,en))}${route===id?`<small class="selected-route">${t('character.selected-route')}</small>`:''}</th>${compact?'':`<td>${esc(recruitmentValue(e,id,'support'))}</td><td>${esc(recruitmentValue(e,id,'renown'))}</td>`}<td>${requirement}</td></tr>`;
 };
 const rows=routes.map(row).join('');
 const later=e.lateRecruitment?`<details id="section-later-recruitment" class="coverage later-recruitment" data-recruitment-disclosure><summary>${t('recruitment.later-spoilers')}</summary><p>${esc(tx(e.lateJoin))}</p>${e.lateRecruitment.links.length?`<p>${e.lateRecruitment.links.map(id=>{const target=entries.find(x=>x.id===id);return `<a href="${esc(href(id))}">${esc(name(target))}</a>`;}).join(' · ')}${e.lateRecruitment.requiredParalogueId?` · <a href="${esc(pagePath({type:'paralogue'},t.locale,base))}">${t('recruitment.paralogue-calendar')}</a>`:''}</p>`:''}</details>`:'';
 const scouting=laterOnly||nonScouting?'':`<div class="table-wrap recruitment-table"><table aria-labelledby="recruitment-title"><caption class="sr-only">${t('catalog.recruitment-by-route-part-i')}</caption><colgroup><col class="route-column">${compact?'':'<col class="number-column"><col class="number-column">'}<col></colgroup><thead><tr><th scope="col">${t('common.route')}</th>${compact?'':`<th scope="col">${t('catalog.support')}</th><th scope="col">${t('catalog.renown')}</th>`}<th scope="col">${t('catalog.requirement')}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
 return `<section id="section-recruitment" tabindex="-1"><h2 id="recruitment-title">${t(laterOnly||nonScouting?'recruitment.title':'catalog.recruitment-by-route-part-i')}</h2>${nonScouting?`<p class="recruitment-availability">${esc(tx(e.lateJoin))}</p>`:''}${scouting}${later}${laterOnly||nonScouting?'':`<p class="recruitment-help"><a href="${href('scouting-basics')}">${t('character.recruitment-help')}</a></p>`}</section>`;
}
