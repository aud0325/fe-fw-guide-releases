import {proficiencyGlyph} from './proficiency-ui.mjs';
import {rows} from './full-data.mjs';
import {uniqueAvailability,itemConnections,legacySpellEntries} from './integration-data.mjs';
import {characterMatrix,learningRanks,specialties,nonSpecialties,abilityTarget,acquisitionLevel,orderedCharacters,characterSkillHref} from './catalog-model.mjs';
import {groupFamilies,skillGroups} from './scale-model.mjs';
export const sampleCharacters=orderedCharacters(rows).map(c=>c.id);
const names={sword:['검술','Sword'],spear:['창술','Spear'],axe:['도끼술','Axe'],bow:['궁술','Bow'],gauntlet:['격투술','Gauntlet'],'black-magic':['흑마술','Black magic'],'white-magic':['백마술','White magic'],authority:['지휘','Authority'],infantry:['보병','Infantry'],armor:['중장','Armor'],cavalry:['기마','Riding'],flying:['비행','Flying'],...skillGroups,'combat-art':['전투 기술','Combat arts'],spell:['마법','Magic'],skill:['장비 스킬','Equipable skills']};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function abilityHref(r,lang){return characterSkillHref(r,lang)||`/${lang}/entry/${encodeURIComponent(r.id)}/`;}
function abilityTable(items,lang){return `<table class="sample-ability-table"><thead><tr><th>${lang==='ko'?'기술명':'Name'}</th><th>${lang==='ko'?'효과':'Effect'}</th></tr></thead><tbody>${groupFamilies(items).map(f=>`<tr data-skill-family="${esc(f[0].family)}"><td colspan="2">${f.map(r=>`<div class="sample-ability-line"><a href="${abilityHref(r,lang)}">${esc(r.name[lang])}</a><span>${esc(r.effect[lang])}</span></div>`).join('')}</td></tr>`).join('')}</tbody></table>`;}
function matrixTable(lines,lang,title){
 const text=(ko,en)=>lang==='ko'?ko:en,label=p=>p?.[lang==='ko'?0:1]||text('미확인','Unknown');
 return `<p class="matrix-scroll-hint" hidden>${text('↔ 좌우로 밀어 D~S+ 랭크를 확인하세요.','↔ Scroll horizontally to view ranks D–S+.')}</p><div class="sample-matrix-scroll" tabindex="0" role="region" aria-label="${title}"><table class="sample-rank-matrix"><caption>${title}</caption><thead><tr><th scope="col">${text('기술능력','Proficiency')}</th>${learningRanks.map(rank=>`<th scope="col">${rank}</th>`).join('')}</tr></thead><tbody id="learnset-rows">${lines.map(line=>`<tr data-proficiency="${line.id}" data-preferred="${line.preferred}" data-affinity="${line.preferred?'preferred':line.nonPreferred?'nonpreferred':'normal'}"><th scope="row" aria-label="${label(names[line.id])}${line.preferred?text(' · 특기',' · Preferred'):line.nonPreferred?text(' · 비특기',' · Non-preferred'):''}"><span class="proficiency-label">${proficiencyGlyph(line.id,line.preferred?'preferred':line.nonPreferred?'nonpreferred':'normal')}${label(names[line.id])}</span></th>${learningRanks.map(rank=>`<td data-rank="${rank}">${line.cells[rank].length?line.cells[rank].map(r=>`<a class="matrix-ability matrix-${r.kind}" data-ability-id="${r.id}" href="${abilityHref(r,lang)}" aria-label="${esc(r.name[lang])} · ${label(names[r.kind])}" title="${esc(r.effect[lang])}">${esc(r.name[lang])}</a>`).join(''):'<span class="matrix-empty">—</span>'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function sampleProfileProficiencies(e,lang){
 if(!sampleCharacters.includes(e.id))return null;
 const text=(ko,en)=>lang==='ko'?ko:en,label=p=>p?.[lang==='ko'?0:1]||text('미확인','Unknown');
 const preferences=(codes,affinity)=>codes.length?codes.map(p=>`<span class="proficiency-affinity affinity-${affinity}">${proficiencyGlyph(p,affinity)}${label(names[p])}</span>`).join(''):`<span class="affinity-unconfirmed">${text('미확인','Unconfirmed')}</span>`;
 return `<dl class="proficiency-overview"><div><dt>${text('특기 숙련','Preferred proficiencies')}</dt><dd>${preferences(specialties(e.id),'preferred')}</dd></div><div><dt>${text('비특기 숙련','Non-preferred proficiencies')}</dt><dd>${preferences(nonSpecialties(e.id),'nonpreferred')}</dd></div></dl>`;
}
export function sampleAbilitySections(e,lang){
 if(!sampleCharacters.includes(e.id))return '';
 const text=(ko,en)=>lang==='ko'?ko:en,label=p=>p?.[lang==='ko'?0:1]||text('미확인','Unknown'),model=characterMatrix(rows,e.id);
 const personal=rows.filter(r=>r.kind==='skill'&&['personal','unique'].includes(r.category)&&r.relations.some(x=>x.id===e.id));
 const sortedPersonal=['personal','unique'].flatMap(category=>groupFamilies(personal.filter(r=>r.category===category)).flat());
 const availability=uniqueAvailability[e.id];
 const other=model.unranked.filter(r=>!personal.includes(r));
 return `<section id="section-abilities" class="sample-abilities" tabindex="-1"><h2>${text('기술과 숙련','Abilities & proficiencies')}</h2><div class="sample-capabilities">${personal.length?`<table class="sample-ability-table sample-personal-table"><caption>${text('캐릭터 스킬','Character skills')}</caption><thead><tr><th scope="col">${text('분류','Type')}</th><th scope="col">${text('이름','Name')}</th><th scope="col">${text('효과','Effect')}</th></tr></thead><tbody>${sortedPersonal.map(r=>{const level=acquisitionLevel(r,e.id);return `<tr id="ability-${r.id}" tabindex="-1"><th scope="row"><span class="skill-type-tag skill-type-${r.category}">${r.category==='personal'?text('개인스킬','Personal'):text('고유스킬','Unique')}</span></th><td class="personal-name"><strong${r.provisional?` title="${text('한국어 임시명','Provisional Korean name')}"`:""}>${esc(r.name[lang])}</strong>${level!=null?` <small>Lv ${level}</small>`:''}</td><td class="personal-effect">${esc(r.effect[lang])}</td></tr>`;}).join('')}${availability?`<tr class="unique-availability"><th scope="row"><span class="skill-type-tag skill-type-unique">${text('고유스킬','Unique')}</span></th><td colspan="2">${availability.status==='reported-absent'?text('없음으로 보고됨','Reported absent'):text('미확인','Unconfirmed')}</td></tr>`:''}</tbody></table>`:''}</div><div class="sample-learnset"><div class="learnset-heading"><h3 id="learnset-title">${text('획득 기술표','Ability acquisition table')}</h3><fieldset class="learnset-toggle"><legend>${text('획득 기술표 표시 범위','Acquisition table view')}</legend><label><input class="learnset-filter" type="radio" name="learnset-${e.id}" value="all" checked aria-controls="learnset-rows"><span>${text('전체보기','Show all')}</span></label><label><input class="learnset-filter" type="radio" name="learnset-${e.id}" value="preferred" aria-controls="learnset-rows"><span>${text('특기 기술만 보기','Preferred only')}</span></label></fieldset></div><div class="matrix-legend"><span class="matrix-skill">${text('장비 스킬','Equipable skills')}</span><span class="matrix-combat-art">${text('전투 기술','Combat arts')}</span><span class="matrix-spell">${text('마법','Magic')}</span></div>${matrixTable(model.lines,lang,text('획득 기술표','Ability acquisition table'))}<p class="matrix-help">${text('기술명을 누르면 효과를 확인할 수 있습니다. — 표시는 습득 기록 미확인입니다.','Select an ability to view its effect. A dash means no acquisition record is confirmed.')}</p></div>${model.initial.length?`<details><summary>${text('초기 소지','Initially known')}</summary>${abilityTable(model.initial,lang)}</details>`:''}${other.length?`<details><summary>${text('습득 랭크 미확인','Acquisition rank unconfirmed')}</summary>${abilityTable(other,lang)}</details>`:''}</section>`;
}
export function sampleItemAbilities(e,lang){
 const text=(ko,en)=>lang==='ko'?ko:en;
 const links=[...itemConnections,...legacySpellEntries].filter(x=>x.itemId===e.id);
 if(!links.length)return '';
 const groups=[['equipment-granted',text('장비 전투 기술','Equipment combat arts')],['teaches-spell',text('사용하면 배우는 마법','Spells learned by using this item')],['same-spell',text('마법 정보','Spell information')]];
 return `<section id="section-item-abilities" class="sample-abilities">${groups.map(([relation,title])=>{
  const selected=links.filter(x=>x.relation===relation),abilities=rows.filter(r=>selected.some(x=>x.abilityId===r.id));
  if(!abilities.length)return '';
  return `<h2>${title}</h2>${relation==='equipment-granted'?`<p class="matrix-help">${text('이 장비를 사용하는 동안 제공되는 전투 기술입니다.','Combat arts available while using this equipment.')}</p>`:''}${abilityTable(abilities,lang)}`;
 }).join('')}${e.id==='banshee-theta-scroll-report'?`<p class="matrix-help">${text('아카이브 Θ와 같은 아이템인지는 미확인입니다.','Identity with Archive Θ is unconfirmed.')}</p>`:''}</section>`;
}

export function abilityReferences(e,lang){
 const text=(ko,en)=>lang==='ko'?ko:en,externalGuides=[],abilitySourceNotes=[];
 if(sampleCharacters.includes(e.id)){
  externalGuides.push(
   {url:'https://docs.google.com/spreadsheets/d/1YW5AdvPUbLPr1RAGlnotcRaNTFCQPTKiIgshwrcdUtE/edit',title:text('커뮤니티 기술·숙련도 표','Community ability and proficiency tables')},
   {url:'https://game8.jp/fe-banshisenko/818786',title:'Game8 · '+text('스킬','Skills')},
   {url:'https://gamewith.jp/fefw/574420',title:'GameWith · '+text('스킬','Skills')});
  abilitySourceNotes.push(text('기술능력 12종 아이콘: 사용자 제공 게임 화면에서 추출. © Nintendo / INTELLIGENT SYSTEMS','Twelve proficiency icons: cropped from user-provided game screenshots. © Nintendo / INTELLIGENT SYSTEMS'));
  if(rows.some(r=>r.provisional&&['personal','unique'].includes(r.category)&&r.relations.some(x=>x.id===e.id)))abilitySourceNotes.push(text('한국어명이 확인되지 않은 캐릭터 스킬은 임시 번역을 사용합니다.','Character skills without a verified Korean name use provisional translations.'));
  const availability=uniqueAvailability[e.id];
  if(availability?.sources.length){
   externalGuides.push(...availability.sources.map(x=>({url:x.url,title:x.name+' · '+text('고유스킬 부재 보고','Unique skill absence report')})));
   abilitySourceNotes.push(text('고유스킬 부재는 출처의 보고이며 모든 레벨을 직접 검증한 판정이 아닙니다.','Unique skill absence is reported by the cited sources and has not been directly verified at every level.'));
  }
 }
 for(const link of itemConnections.filter(x=>x.itemId===e.id))externalGuides.push({url:link.url,title:link.relation==='equipment-granted'?text('장비 전투 기술 대응표','Equipment combat art correspondence'):text('마법 습득 제보','Spell acquisition report')});
 if(legacySpellEntries.some(x=>x.itemId===e.id))externalGuides.push({url:'https://game8.jp/fe-banshisenko/817283',title:'Game8 · '+text('마법','Magic')});
 return {externalGuides,abilitySourceNotes};
}
