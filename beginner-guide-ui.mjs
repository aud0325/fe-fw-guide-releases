import {rows as abilityRows} from './_abilities/full-data.mjs';
import {abilityToken} from './_abilities/token-links.mjs';
import {trainingDirections} from './training-directions.generated.mjs';
import {keywordLink} from './game-keywords.mjs';
import {escapeHtml as esc} from './core.mjs';
import {informationHint} from './presentation.mjs';
import {statLabels} from './locales/labels.mjs';
const tierNames={Beginner:'beginner',Specialty:'intermediate',Intermediate:'intermediate',Advanced:'advanced',Master:'master',Divine:'divine'};
function classToken(id,{t,name,href,entries,base='/'}){
 const cls=entries.find(e=>e.id===id);if(!cls)throw Error('Missing training class '+id);
 return keywordLink(id,name(cls),{lang:t.locale,base,inline:false,href:href(id),className:'guide-class'});
}
export function beginnerGuideBrief(e,context){
 const p=trainingDirections[e.id];if(!p)return '';
 const path=p.path.map(s=>s.classIds.map(id=>classToken(id,context)).join(' / ')).join(' <span aria-hidden="true">→</span> ');
 return `<div class="beginner-guide-brief"><strong>${context.t('character.beginner-start')}</strong><span>${path}</span><a class="beginner-read" href="#section-guide">${context.t(e.beginnerGuide?'character.beginner-read':'character.imported-read')}</a></div>`;
}
export function trainingGuidePath(rows,context){
 if(!rows.length)return '';
 const {t,entries}=context;
 return `<div class="training-path-scroll" role="region" tabindex="0" aria-label="${esc(t('character.training-path'))}"><ol class="training-path">${rows.map((s,i)=>{
  const ids=s.classIds||[s.classId],tier=s.tier||entries.find(e=>e.id===ids[0]).category;
  return `<li>${i?'<span class="guide-path-arrow" aria-hidden="true">→</span>':''}<small>${t('character.beginner-tier-'+tierNames[tier])}</small><span class="guide-class-choices">${ids.map(id=>classToken(id,context)).join('<span class="guide-choice-or" aria-hidden="true">/</span>')}</span></li>`;
 }).join('')}</ol></div>`;
}
function skillTiming(milestones,{t,base='/'}){
 if(!milestones?.length)return '';
 return `<p class="guide-preparation guide-skill-timing"><strong>${t('character.skill-timing')}</strong> ${milestones.map(m=>{
  const row=abilityRows.find(r=>r.id===m.abilityId);if(!row)throw Error('Missing guide milestone ability: '+m.abilityId);
  const condition=m.condition==='level'?'Lv.'+m.level:t('character.skill-timing-'+m.condition);
  return `<span>${esc(condition)} ${abilityToken(row,t.locale,{base})}</span>`;
 }).join(' · ')}</p>`;
}
function trainingGrowth(profile,context){
 const {growth}=profile,{t}=context;
 const labels=new Map(statLabels.map(([key,ko,en])=>[key,t.locale==='ko'?ko:en]));
 return `<details class="guide-option guide-growth"><summary>${t('character.training-growth')}</summary><p class="guide-growth-basis">${t('character.training-growth-basis')}${growth.personalSkillApplied?' '+t('character.training-growth-skill'):''}</p><div class="guide-growth-scroll" role="region" tabindex="0" aria-label="${t('character.training-growth')}"><table><caption class="sr-only">${t('character.training-growth')}</caption><thead><tr><th scope="col">${t('character.beginner-class')}</th>${growth.keys.map(key=>`<th scope="col">${esc(labels.get(key))}</th>`).join('')}</tr></thead><tbody>${growth.rows.map(row=>`<tr><th scope="row">${classToken(row.classId,context)}${row.levelRange?`<small>Lv.${esc(row.levelRange)}</small>`:''}</th>${growth.keys.map(key=>`<td data-growth-stat="${key}">${row.values[key]}%</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
}
function reviewedGuide(e,context,imported=false){
 const p=trainingDirections[e.id];if(!p)return '';
 const {t,tx}=context,review=e.skillTrainingReview;
 return `<section id="section-guide" class="training-guide beginner-guide${imported?' imported-guide':''}" data-keyword-ids="${esc(p.referencedClassIds.join(' '))}" tabindex="-1"><div class="guide-heading"><h2>${t(imported?'character.training-guide':'character.beginner-guide')}</h2>${informationHint(t(imported?'character.imported-help':'character.beginner-help'),t(imported?'character.imported-help-label':'character.beginner-help-label'),'?')}</div>${p.role?`<h3 class="guide-role">${esc(tx(p.role))}</h3>`:''}${trainingGuidePath(p.path,context)}<p class="guide-preparation">${t('character.beginner-preparation')}</p><div class="guide-analysis"><h3>${t('character.guide-reason')}</h3><p>${esc(tx(p.reason))}</p></div>${skillTiming(review?.milestones||e.beginnerGuide?.skillMilestones,context)}<div class="guide-adjustment"><h3>${t('character.beginner-alternative')}</h3><p>${esc(tx(p.adjustment))}</p></div>${trainingGrowth(p,context)}<details class="guide-option guide-later"><summary>${t('character.beginner-future')}</summary>${p.future.length?`<p>${t('character.beginner-future-intro')}</p>${trainingGuidePath(p.future,context)}`:''}<p>${esc(tx(p.futureNote))}</p></details></section>`;
}
export function importedCharacterGuide(e,context){return e.trainingGuide?reviewedGuide(e,context,true):'';}
export function beginnerGuide(e,context){return e.beginnerGuide?reviewedGuide(e,context):'';}
