import {escapeHtml as esc} from './core.mjs';

export function entityPeekFrame(title,body,href,t){
 return `<div class="entity-peek-header"><h2 id="entity-peek-title">${esc(title)}</h2><a href="${esc(href)}">${t('entity.full-details')}</a><button type="button" class="entity-peek-close" aria-label="${t('entity.close')}">×</button></div><div class="entity-peek-body">${body}</div>`;
}
export function entityPeekStats(stats,{t,combatArt=false}){
 const fields=[['durabilityCost','cost'],['might',combatArt?'might-bonus':'might'],['hit',combatArt?'hit-bonus':'hit'],['crit',combatArt?'crit-bonus':'crit'],['range','range'],['uses','uses']].filter(([key])=>stats[key]!=null);
 if(!fields.length)return '';
 return `<table class="entity-peek-stats"><thead><tr>${fields.map(([,label])=>`<th scope="col">${t('entity.'+label)}</th>`).join('')}</tr></thead><tbody><tr>${fields.map(([key])=>`<td>${esc(stats[key])}</td>`).join('')}</tr></tbody></table>`;
}
