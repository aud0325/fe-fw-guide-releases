import {proficiencyNames} from '../proficiency-names.mjs';
import {proficiencyMedia} from './proficiency-media.mjs';
import {abilityToken} from './token-links.mjs';
import {proficiencyGlyph} from './proficiency-ui.mjs';
import {abilityIcon} from './icon-model.mjs';
import {abilitySourceLinks} from './ability-sources.mjs';
import {reviewedClassAbility} from '../class-ability-view.mjs';
import {rows} from './full-data.mjs';
import {abilityDetailHref} from './ability-identities.mjs';
import {uniqueAvailability,itemConnections,legacySpellEntries} from './integration-data.mjs';
import {characterMatrix,learningRanks,specialties,nonSpecialties,abilityTarget,acquisitionLevel,orderedCharacters,characterSkillHref} from './catalog-model.mjs';
import {groupFamilies,skillGroups} from './scale-model.mjs';
import {createTranslator} from '../locales/index.mjs';
export const sampleCharacters=orderedCharacters(rows).map(c=>c.id);
const referenceRows=rows.map(reviewedClassAbility);
const names={...proficiencyNames,...skillGroups,'combat-art':['전투 기술','Combat arts'],spell:['마법','Magic'],skill:['장비 스킬','Equipable skills']};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function abilityHref(r,lang){return characterSkillHref(r,lang)||abilityDetailHref(r.id,lang);}
function abilityTable(items,lang,base='/'){return `<table class="sample-ability-table"><thead><tr><th>${lang==='ko'?'기술명':'Name'}</th><th>${lang==='ko'?'효과':'Effect'}</th></tr></thead><tbody>${groupFamilies(items).map(f=>`<tr data-skill-family="${esc(f[0].family)}"><td colspan="2">${f.map(r=>`<div class="sample-ability-line">${abilityToken(r,lang,{base})}<span>${esc(r.effect[lang])}</span></div>`).join('')}</td></tr>`).join('')}</tbody></table>`;}
function matrixTable(lines,lang,title,base='/'){
 const t=createTranslator(lang),text=(ko,en)=>lang==='ko'?ko:en,label=p=>p?.[lang==='ko'?0:1]||text('미확인','Unknown');
 return `<p class="matrix-scroll-hint" hidden>${text('↔ 좌우로 밀어 D~S+ 랭크를 확인하세요.','↔ Scroll horizontally to view ranks D–S+.')}</p><div class="sample-matrix-scroll" tabindex="0" role="region" aria-label="${title}"><table class="sample-rank-matrix"><caption>${title}</caption><thead><tr><th scope="col" class="matrix-proficiency-heading" aria-label="${text('기술능력','Proficiency')}"></th>${learningRanks.map(rank=>`<th scope="col">${rank}</th>`).join('')}</tr></thead><tbody id="learnset-rows">${lines.map(line=>{
  const affinity=line.preferred?'preferred':line.nonPreferred?'nonpreferred':'normal';
  const unavailable=!!line.restriction,name=label(names[line.id])+(unavailable?' · '+t('character.proficiency-unavailable'):line.preferred?text(' · 특기',' · Preferred'):line.nonPreferred?text(' · 비특기',' · Non-preferred'):''),hint=unavailable?name+' · '+t(line.restriction.reasonKey):name;
  return `<tr data-proficiency="${line.id}" data-affinity="${affinity}"${unavailable?' class="matrix-unavailable" aria-disabled="true"':''}><th scope="row" aria-label="${esc(name)}"><button type="button" class="matrix-proficiency information-hint" data-source-tip="${esc(hint)}" aria-label="${esc(hint)}" aria-haspopup="dialog" aria-controls="source-tooltip" aria-expanded="false">${proficiencyGlyph(line.id,affinity)}</button></th>${learningRanks.map(rank=>`<td data-rank="${rank}">${unavailable?`<span class="matrix-unavailable-value" aria-label="${esc(t('character.proficiency-unavailable'))}">-</span>`:line.cells[rank].length?line.cells[rank].map(r=>abilityToken(r,lang,{base,className:'matrix-ability matrix-'+r.kind,attributes:{'data-ability-id':r.id,'aria-label':r.name[lang]+' · '+label(names[r.kind])}})).join(''):'<span class="matrix-empty">—</span>'}</td>`).join('')}</tr>`;
 }).join('')}</tbody></table></div>`;
}
export function sampleProfileProficiencies(e,lang){
 if(!sampleCharacters.includes(e.id))return null;
 const text=(ko,en)=>lang==='ko'?ko:en,label=p=>p?.[lang==='ko'?0:1]||text('미확인','Unknown');
 const preferences=(codes,affinity)=>codes.length?codes.map(p=>`<span class="proficiency-affinity affinity-${affinity}">${proficiencyGlyph(p,affinity)}${label(names[p])}</span>`).join(''):`<span class="affinity-unconfirmed">${e.proficiencyStatus?.nonPreferred==='none'&&affinity==='nonpreferred'?text('없음','None'):text('미확인','Unconfirmed')}</span>`;
 return `<dl class="proficiency-overview"><div><dt>${text('특기 숙련','Preferred proficiencies')}</dt><dd>${preferences(specialties(e.id),'preferred')}</dd></div><div><dt>${text('비특기 숙련','Non-preferred proficiencies')}</dt><dd>${preferences(nonSpecialties(e.id),'nonpreferred')}</dd></div></dl>`;
}
export function sampleAbilitySections(e,lang,base='/'){
 if(!sampleCharacters.includes(e.id))return '';
 const text=(ko,en)=>lang==='ko'?ko:en,label=p=>p?.[lang==='ko'?0:1]||text('미확인','Unknown'),model=characterMatrix(rows,e.id);
 const personal=rows.filter(r=>r.kind==='skill'&&['personal','unique'].includes(r.category)&&r.relations.some(x=>x.id===e.id));
 const sortedPersonal=['personal','unique'].flatMap(category=>groupFamilies(personal.filter(r=>r.category===category)).flat());
 const availability=uniqueAvailability[e.id],t=createTranslator(lang);
 const personalTiming=r=>{if(r.category!=='personal')return '';const routes=r.relations.filter(x=>x.id===e.id).flatMap(x=>x.routes||[x]);const key=routes.some(x=>x.method==='overblaze')?'character.skill-timing-overblaze':r.variant==='plus'&&routes.some(x=>x.method==='character-specific-unknown')?'character.skill-timing-unknown':null;return key?` <small>${esc(t(key))}</small>`:'';};
 const other=model.unranked.filter(r=>!personal.includes(r)),initial=model.initial.filter(r=>!personal.includes(r)),exclusive=model.exclusive||[];
 const exclusiveCondition=exclusive.flatMap(r=>r.relations.filter(x=>x.id===e.id).flatMap(x=>x.routes||[x])).find(r=>r.condition)?.condition?.[lang];
 return `<section id="section-abilities" class="sample-abilities" tabindex="-1"><h2>${text('기술과 숙련','Abilities & proficiencies')}</h2><div class="sample-capabilities">${personal.length?`<table class="sample-ability-table sample-personal-table"><caption>${text('캐릭터 스킬','Character skills')}</caption><thead><tr><th scope="col">${text('분류','Type')}</th><th scope="col">${text('이름','Name')}</th><th scope="col">${text('효과','Effect')}</th></tr></thead><tbody>${sortedPersonal.map(r=>{const level=acquisitionLevel(r,e.id);return `<tr id="ability-${r.id}" tabindex="-1"><th scope="row"><span class="skill-type-tag skill-type-${r.category}">${r.category==='personal'?text('개인스킬','Personal'):text('고유스킬','Unique')}</span></th><td class="personal-name">${abilityToken(r,lang,{base})}${personalTiming(r)}${level!=null?` <small>Lv ${level}</small>`:r.category==='unique'&&model.initial.includes(r)?` <small>${text('초기 소지','Initially known')}</small>`:''}</td><td class="personal-effect">${esc(r.effect[lang])}</td></tr>`;}).join('')}${availability?`<tr class="unique-availability"><th scope="row"><span class="skill-type-tag skill-type-unique">${text('고유스킬','Unique')}</span></th><td colspan="2">${availability.status==='reported-absent'?text('없음','None'):text('미확인','Unconfirmed')}</td></tr>`:''}</tbody></table>`:''}</div><div class="sample-learnset"><div class="learnset-heading"><h3 id="learnset-title">${text('획득 기술표','Ability acquisition table')}</h3></div>${matrixTable(model.lines,lang,text('획득 기술표','Ability acquisition table'),base)}<p class="matrix-help">${text('기술명을 누르면 효과를 확인할 수 있습니다. — 표시는 습득 기록 미확인입니다.','Select an ability to view its effect. A dash means no acquisition record is confirmed.')}</p></div>${exclusive.length?`<div class="character-exclusive-abilities" id="section-exclusive-abilities"><h3>${text('전용기술','Exclusive abilities')}</h3>${exclusiveCondition?`<p>${esc(exclusiveCondition)}</p>`:''}${abilityTable(exclusive,lang,base)}</div>`:''}${initial.length?`<details><summary>${text('초기 소지','Initially known')}</summary>${abilityTable(initial,lang,base)}</details>`:''}${other.length?`<details><summary>${text('습득 랭크 미확인','Acquisition rank unconfirmed')}</summary>${abilityTable(other,lang,base)}</details>`:''}</section>`;
}
export function sampleItemAbilities(e,lang,base='/'){
 const text=(ko,en)=>lang==='ko'?ko:en;
 const links=[...itemConnections,...legacySpellEntries].filter(x=>x.itemId===e.id);
 if(!links.length)return '';
 const groups=[['equipment-granted',text('장비 전투 기술','Equipment combat arts')],['teaches-spell',text('사용하면 배우는 마법','Spells learned by using this item')],['same-spell',text('마법 정보','Spell information')]];
 return `<section id="section-item-abilities" class="sample-abilities">${groups.map(([relation,title])=>{
  const selected=links.filter(x=>x.relation===relation),abilities=rows.filter(r=>selected.some(x=>x.abilityId===r.id));
  if(!abilities.length)return '';
  return `<h2>${title}</h2>${relation==='equipment-granted'?`<p class="matrix-help">${text('이 장비를 사용하는 동안 제공되는 전투 기술입니다.','Combat arts available while using this equipment.')}</p>`:''}${abilityTable(abilities,lang,base)}`;
 }).join('')}</section>`;
}

export function abilityReferences(e,lang){
 const text=(ko,en)=>lang==='ko'?ko:en,externalGuides=[],abilitySourceNotes=[];
 const relatedRows=referenceRows.filter(row=>row.relations.some(relation=>relation.id===e.id));
 for(const row of relatedRows)for(const source of abilitySourceLinks(row,{ownerId:e.id})){
  if(!source.url){const note=typeof source.title==='object'?source.title[lang]:source.title;if(!abilitySourceNotes.includes(note))abilitySourceNotes.push(note);}
  else if(!externalGuides.some(guide=>guide.url===source.url))externalGuides.push(source);
 }
 if(e.forging)abilitySourceNotes.push(text('기술능력 아이콘: Yu Phas’ Temple 원본. © Nintendo / INTELLIGENT SYSTEMS','Proficiency icons: original assets from Yu Phas’ Temple. © Nintendo / INTELLIGENT SYSTEMS'));
 if(sampleCharacters.includes(e.id)){
  abilitySourceNotes.push(text('기술능력 12종 아이콘: Yu Phas’ Temple 원본. © Nintendo / INTELLIGENT SYSTEMS','Twelve proficiency icons: original assets from Yu Phas’ Temple. © Nintendo / INTELLIGENT SYSTEMS'));
  const availability=uniqueAvailability[e.id];
  if(availability?.sources.length){
   externalGuides.push(...availability.sources.map(x=>({url:x.url,title:x.name+' · '+text('고유스킬 부재 보고','Unique skill absence report')})));
  }
 }
 for(const link of itemConnections.filter(x=>x.itemId===e.id&&x.url))externalGuides.push({url:link.url,title:link.relation==='equipment-granted'?text('장비 전투 기술 대응표','Equipment combat art correspondence'):link.status==='guide-correspondence'?text('마법 습득 아이템 · 공략 자료','Spell-learning items · guides'):text('마법 습득 제보','Spell acquisition report')});
 const itemAbilityIds=new Set(itemConnections.filter(link=>link.itemId===e.id).map(link=>link.abilityId));
 const images=[...relatedRows,...rows.filter(row=>itemAbilityIds.has(row.id))].map(abilityIcon).filter(Boolean);
 return {externalGuides,abilitySourceNotes,imageCredits:[...images,...(e.forging||sampleCharacters.includes(e.id)?[proficiencyMedia.armor]:[])]};
}
