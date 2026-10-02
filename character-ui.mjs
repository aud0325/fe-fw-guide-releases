import {characterGrowthContext,characterGrowthSummary} from './growth-rates.mjs';
import {growthCellStyle} from './growth-comparison.mjs';
import {pagePath,stateQuery} from './routing.mjs';
import {statLabels} from './locales/labels.mjs';
import {displayText,sourceHint} from './presentation.mjs';
import {escapeHtml as esc} from './core.mjs';
export function characterDetails(e,{t,tx,name,href,entries,base='/',growthSkill=false}){
 if(e.type!=='character')return '';
 if(!e.roles?.includes('playable')&&!e.recruitment&&!e.growthRates&&!e.gifts?.length&&!e.supports?.length)return ''; 
 const text=x=>displayText(x,t,entries);
 const skillApplied=!!(e.modifiedGrowthRates&&growthSkill),context=characterGrowthContext(entries,skillApplied);
 const summary=context=>{
  const {total,ranking}=characterGrowthSummary(e,context);
  if(!Number.isFinite(total))return '';
  const state={type:'growth',...context.state,growthSort:'total',growthDirection:'desc',growthFocus:e.id},url=pagePath(state,t.locale,base)+stateQuery(state)+'#growth-row-'+encodeURIComponent(e.id);
  const rankText=ranking?t(ranking.tied?'character.growth-rank-tied':'character.growth-rank',ranking):'';
  return `<span class="character-growth-summary"><span>${t('growth.sum')} <strong>${total}</strong></span>${ranking?`<a class="growth-rank-link" href="${esc(url)}" aria-label="${esc(t('character.growth-rank-link',{rank:rankText}))}" title="${esc(t('character.growth-rank-help'))}">${esc(rankText)}</a>`:''}</span>`;
 };
 const grid=rows=>{
  const headings=()=>statLabels.map(([,ko,en])=>`<th scope="col">${t(ko,en)}</th>`).join('');
  const label=r=>esc(r.label);
  const values=r=>{const colorContext=r.alternative?characterGrowthContext(entries):context;return statLabels.map(([k])=>{const value=r.values[k],style=growthCellStyle(value,k,colorContext.stats,colorContext.state);return `<td class="growth-value" data-growth-stat="${k}"${style?` style="${style}"`:''}>${Number.isFinite(value)?esc(value)+'%':'—'}</td>`;}).join('');};
  return `<div class="character-stats character-growth"><div class="table-wrap stats-wide"><table><thead><tr><th scope="col">${t('character.context')}</th>${headings()}</tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${label(r)}</th>${values(r)}</tr>`).join('')}</tbody></table></div><div class="stats-narrow">${rows.map(r=>`<table><caption>${label(r)}</caption><thead><tr>${headings()}</tr></thead><tbody><tr>${values(r)}</tr></tbody></table>`).join('')}</div></div>`;
 };
 let out='';
 out+=`<div class="character-growth-heading"><h2>${t('character.personal-growth-rates')}</h2>${e.growthRates?summary(context):''}</div>`;
 if(e.growthRates){out+=`<div class="character-growth-options"><p class="result-label">${t('growth.unitCharacter')}</p>${e.modifiedGrowthRates?`<label title="${esc(tx(e.modifiedGrowthRates.condition))}"><input id="character-growth-skill" type="checkbox" data-character-growth-skill disabled${skillApplied?' checked':''}><span>${t(e.id==='mu'?'character.signs-of-growth-toggle':'growth.compactSkill')}</span></label>`:''}</div>`;const row=skillApplied?{...e.modifiedGrowthRates,label:t('growth.corrected')}:{...e.growthRates,label:t('character.personal-base')};out+=grid([row])+`<p class="character-growth-legend" title="${esc(t('character.growth-help'))}"><span>${t('growth.low')}</span><span class="legend-scale" aria-hidden="true"></span><span>${t('growth.high')}</span></p>`;
  if(e.growthAlternative){out+=`<p class="notice">${t('character.sources-disagree-the-table-above-follows-serenes-forest-the')}</p>${grid([{...e.growthAlternative,alternative:true,label:t('character.conflicting-report')}])}`;}
 }else out+=`<p class="result-label">${t('character.personal-growth-rates-not-documented')}</p>`;
 const growth=out;out='';
 out+=`<h2>${t('character.preferred-gifts')}</h2>`;
 if(e.gifts?.length){out+=`<p class="notice">${t('character.unverified-public-game8-export-only-reported-preferences-are-shown')}</p><div class="table-wrap"><table><thead><tr><th>${t('character.preference')}</th><th>${t('character.gift')}</th></tr></thead><tbody>`;
  out+=e.gifts.map(g=>{const item=entries.find(x=>x.id===g.itemId);return `<tr><td>${g.preference==='loved'?t('character.loved'):t('character.really-liked')}</td><td>${item?`<a href="${href(item.id)}">${esc(name(item))}</a>`:esc(text(t(g.nameKo||g.name,g.name)))}</td></tr>`}).join('')+'</tbody></table></div>';
 }else out+=`<p class="result-label">${t('character.gift-preferences-are-undocumented-this-does-not-imply-gifts')}</p>`;
 const gifts=out;out='';
 out+=`<details class="coverage"><summary>${t('character.support-partners-and-ranks-spoilers')} · ${e.supports?.length||0}</summary>`;
 if(e.supports?.length){out+=`<p class="notice">${t('character.ranks-from-the-game8-export-separate-from-recruitment-support')}</p><div class="table-wrap"><table><thead><tr><th>${t('character.partner')}</th><th>${t('character.reported-rank')}</th></tr></thead><tbody>`;
  out+=e.supports.map(s=>{const partner=entries.find(x=>x.id===s.partnerId);return `<tr><th><a href="${href(partner.id)}">${esc(name(partner))}</a></th><td>${esc([...new Set(s.reports.map(r=>r.rank))].join(' / '))}${s.conflict?' ⚠':''}</td></tr>`}).join('')+'</tbody></table></div>';
 }else out+=`<p>${t('character.support-data-is-undocumented-this-does-not-mean-supports')}</p>`;
 return `<section id="section-training" tabindex="-1">${growth}</section><section id="section-gifts" tabindex="-1">${gifts}</section>`+out+'</details>';
}


export function characterGuide(e,{t,tx,name,href,entries,sources}){
 const guide=e.trainingGuide;if(!guide)return '';
 const source=sources[guide.sourceId];
 const classes=guide.classIds.map(id=>entries.find(e=>e.id===id));
 const hint=sourceHint({href:source.url,tooltip:`${t('character.guide-source')} · ${typeof source.title==='string'?source.title:tx(source.title)}${source.checked?' · '+t('common.checked')+' '+source.checked:''}`,label:t('presentation.references'),external:true});
 return `<section id="section-guide" class="training-guide" tabindex="-1"><h2>${t('character.guide')} ${hint}</h2><ol class="training-path">${classes.map(c=>`<li><a href="${href(c.id)}">${esc(name(c))}</a></li>`).join('')}</ol><div class="guide-explanation"><h3>${esc(t('character.guide-reason'))}</h3><p>${esc(tx(guide.reason))}</p><h3>${esc(t('character.guide-cautions'))}</h3><p>${esc(tx(guide.tactics))}</p><h3>${esc(t('character.preparation'))}</h3><p>${esc(tx(guide.note))}</p></div><p class="result-label">${t('character.guide-note')}</p></section>`;
}
