import {escapeHtml as esc} from './core.mjs';
import {recruitmentComparison,recruitmentValue,isTutorialRecruit} from './recruitment.mjs';
export function recruitmentDetails(e,{t,tx,name,href,entries,routes,sources,route,text}){
 if(!e.recruitment)return '';
 const source=(id,label)=>sources[id]?`<a href="${esc(sources[id].url)}" target="_blank" rel="noopener noreferrer">${esc(label||tx(sources[id].title))}</a>`:'';
 const comparisons=[];
 const row=([id,ko,en])=>{
  const r=e.recruitment[id];if(!r)return '';
  const item=entries.find(x=>x.id===r.item),comparison=recruitmentComparison(e,id);
  const mode=isTutorialRecruit(e,id)?t('character.tutorial-report'):r.mode==='automatic'?t('common.automatic'):r.mode==='unavailable'?t('catalog.unavailable-n-a'):r.mode==='unknown'?t('catalog.not-documented'):'';
  const requirement=item?`<a class="linkchip" href="${href(item.id)}">${esc(name(item))} × ${esc(r.quantity)} <span class="sr-only">${t('character.requirement-link')}</span></a>`:mode?esc(mode):r.requirement&&r.requirement!=='N/A'&&r.requirement!=='Automatic'?esc(text(r.requirement)):t('catalog.no-extra-item-listed');
  const reportLine=(report,label)=>`${source(report.sourceId,label)}: ${report.support!=null?t('catalog.support')+' '+esc(report.support):''}${report.support!=null&&report.renown!=null?' · ':''}${report.renown!=null?t('catalog.renown')+' '+esc(report.renown):''}`;
  if(comparison)comparisons.push(`<div class="recruitment-comparison"><strong>${esc(t(ko,en))} · ${t('character.'+comparison.kind)}</strong><ul><li>${reportLine(r,r.sourceId==='recruitment'?'RPG Site · '+t('character.main-source'):undefined)}${mode?' · '+esc(mode):''}</li>${comparison.reports.map(report=>`<li>${reportLine(report,report.labelKey?t(report.labelKey):report.sourceId.startsWith('game8')?'Game8':undefined)}</li>`).join('')}</ul>${comparison.kind==='tutorial-report'?`<p>${t('character.tutorial-explanation')}</p>`:''}</div>`);
  return `<tr class="recruitment-route${route===id?' selected':''}"><th scope="row">${esc(t(ko,en))}${route===id?`<small class="selected-route">${t('character.selected-route')}</small>`:''}</th><td>${esc(recruitmentValue(e,id,'support'))}</td><td>${esc(recruitmentValue(e,id,'renown'))}</td><td>${requirement}${comparison&&comparison.kind!=='tutorial-report'?`<small class="recruitment-status">${t('character.'+comparison.kind)}</small>`:''}</td></tr>`;
 };
 const rows=routes.map(row).join('');
 return `<section id="section-recruitment" tabindex="-1"><h2 id="recruitment-title">${t('catalog.recruitment-by-route-part-i')}</h2><div class="table-wrap recruitment-table"><table aria-labelledby="recruitment-title"><caption>${t('catalog.part-i-undocumented-n-a-unavailable-later-joins-listed')}</caption><colgroup><col class="route-column"><col class="number-column"><col class="number-column"><col></colgroup><thead><tr><th scope="col">${t('common.route')}</th><th scope="col">${t('catalog.support')}</th><th scope="col">${t('catalog.renown')}</th><th scope="col">${t('catalog.requirement')}</th></tr></thead><tbody>${rows}</tbody></table></div>${comparisons.length?`<details class="recruitment-evidence"><summary>${t('character.source-comparison')} · ${comparisons.length}</summary>${comparisons.join('')}<p class="result-label">${t('character.compare-help')}</p></details>`:''}<p class="recruitment-help"><a href="${href('scouting-basics')}">${t('character.recruitment-help')}</a></p></section>`;
}
