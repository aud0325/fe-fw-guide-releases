import {escapeHtml as esc} from './core.mjs';
import {characterOriginMedia} from './character-origin-media.generated.mjs';
import {statLabels} from './locales/labels.mjs';
export function characterOriginDetails(entry,{t,base='/'}){
 const origin=entry.origin;if(!origin)return '';
 const lang=t.locale,name=origin.name[lang]||origin.name.en,description=origin.description[lang]||origin.description.en;
 const media=characterOriginMedia[entry.id],image=media?`<img class="character-origin-image" src="${esc(base+media.src.slice(2))}" width="${media.width}" height="${media.height}" alt="${esc(name)}" loading="lazy" decoding="async">`:'';
 const bonuses=statLabels.filter(([key])=>Number.isFinite(origin.bonuses[key])&&origin.bonuses[key]!==0).map(([key,ko,en])=>`<span>${lang==='en'?en:ko} <strong>${origin.bonuses[key]>0?'+':''}${origin.bonuses[key]}</strong></span>`).join('');
 return `<section id="section-origin" class="character-origin" tabindex="-1"><h2>${t('character.origin')}</h2><div class="character-origin-content" data-keyword-field="unique-possession">${image}<div class="character-origin-text"><div class="character-origin-heading"><h3>${esc(name)}</h3><div class="character-origin-bonuses">${bonuses}</div></div><p>${esc(description)}</p></div></div></section>`;
}
