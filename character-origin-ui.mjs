import {escapeHtml as esc} from './core.mjs';
import {statLabels} from './locales/labels.mjs';
export function characterOriginDetails(entry,{t}){
 const origin=entry.origin;if(!origin)return '';
 const lang=t.locale,name=origin.name[lang]||origin.name.en,description=origin.description[lang]||origin.description.en;
 const bonuses=statLabels.filter(([key])=>Number.isFinite(origin.bonuses[key])&&origin.bonuses[key]!==0).map(([key,ko,en])=>`<span>${lang==='en'?en:ko} <strong>${origin.bonuses[key]>0?'+':''}${origin.bonuses[key]}</strong></span>`).join('');
 return `<section id="section-origin" class="character-origin" tabindex="-1"><h2>${t('character.origin')}</h2><div data-keyword-field="unique-possession"><div class="character-origin-heading"><h3>${esc(name)}</h3><div class="character-origin-bonuses">${bonuses}</div></div><p>${esc(description)}</p></div></section>`;
}
