import {escapeHtml as esc} from './core.mjs';
import {pagePath} from './routing.mjs';
import {proficiencyGlyph} from './_abilities/proficiency-ui.mjs';
import {abilityToken} from './_abilities/token-links.mjs';
import {rows as abilities} from './_abilities/full-data.mjs';
const stageLabel=(level,t)=>level===0?t('forge.base'):'+'+level;
export function forgeCostHtml(cost,{t,entries,name,base='/'}){
 const amounts=(cost.materials||[]).map(material=>{const item=entries.find(e=>e.id===material.itemId);return `<a href="${esc(pagePath({id:item.id},t.locale,base))}">${esc(name(item))}</a> ×${material.quantity}`;});
 if(cost.materials==null||cost.materialsComplete===false)amounts.push(`<span class="forging-unknown">${t(cost.materials?.length?'forge.additional-unknown-materials':'forge.unknown-materials')}</span>`);
 amounts.push(cost.gold==null?`<span class="forging-unknown">${cost.knownGold>0?t('forge.partial-gold',{gold:cost.knownGold.toLocaleString('en-US')}):t('forge.unknown-gold')}</span>`:cost.gold.toLocaleString('en-US')+'G');
 return amounts.join(' · ');
}
function effectText(stage,lang){
 return stage.effect[lang].replace(lang==='ko'?/(^|\.\s+)(?:회피|저주) \+\d+\./g:/(^|\.\s+)(?:Avo\+|Cursed \+)\d+\./g,'$1').trim();
}
export function forgingDetails(e,{t,name,entries,base='/'}){
 const forging=e.forging;if(!forging)return '';
 const label=level=>stageLabel(level,t),path=id=>pagePath({id},t.locale,base),columns=['might','hit','crit','weight','range','uses',...['avoid','curse'].filter(key=>forging.stages.some(s=>s.stats[key]>0))];
 const requirements=`<p class="forging-requirements"><span>${t('forge.requirements')}</span> ${forging.requirements.map(r=>`<span class="forging-requirement">${proficiencyGlyph(r.proficiency)}${t('forge.'+r.proficiency)} ${esc(r.rank)}</span>`).join(' ')}</p>`;
 const named=forging.stages.some(s=>s.variantName),grouped=[];
 for(const stage of forging.stages){const effect=effectText(stage,t.locale),key=JSON.stringify([effect,stage.combatArts]);const last=grouped.at(-1);if(last?.key===key)last.levels.push(stage.level);else grouped.push({key,effect,arts:stage.combatArts,levels:[stage.level]});}
 const effects=grouped.filter(g=>g.effect||g.arts.length),range=g=>g.levels.length===forging.stages.length?t('forge.all-stages'):g.levels.length>1?label(g.levels[0])+'–'+label(g.levels.at(-1)):label(g.levels[0]);
 const artHtml=art=>{const ability=abilities.find(a=>a.id===art.abilityId),character=entries.find(e=>e.id===art.characterId),conditions=[];if(character)conditions.push(t('forge.only',{name:name(character)}));if(art.effectiveAgainst?.length)conditions.push(t('forge.effective',{targets:art.effectiveAgainst.map(type=>t('forge.'+type)).join('·')}));return `<div class="forging-combat-art">${abilityToken(ability,t.locale,{base})}${conditions.length?` <span class="forging-art-condition">${esc(conditions.join(' · '))}</span>`:''}</div>`;};
 let html=`<section id="section-forging" class="forging-section" tabindex="-1"><h2>${t(forging.stages.length>1?'forge.title':'forge.weapon-stats')}</h2>${forging.storyCondition?`<p class="forging-condition">${esc(forging.storyCondition[t.locale])}</p>`:''}${requirements}<p class="forging-scroll-hint">${t('forge.scroll')}</p><div class="forging-scroll" tabindex="0" role="region" aria-label="${t('forge.table-label')}"><table class="forging-performance${named?' forging-named-stages':''}"><thead><tr><th scope="col">${t('forge.stage')}</th>${columns.map(key=>`<th scope="col">${t('forge.stat-'+key)}</th>`).join('')}</tr></thead><tbody>${forging.stages.map(stage=>`<tr><th scope="row">${label(stage.level)}${stage.variantName?`<small class="forging-variant-name" lang="en">${esc(stage.variantName.en)}</small>`:''}</th>${columns.map(key=>`<td>${esc(stage.stats[key]??'—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 if(effects.length)html+=`<h3>${t('forge.effects')}</h3><table class="forging-effects-table"><thead><tr><th scope="col">${t('forge.stage')}</th><th scope="col">${t('forge.effect')}</th></tr></thead><tbody>${effects.map(group=>`<tr><th scope="row">${range(group)}</th><td>${group.effect?`<p>${esc(group.effect)}</p>`:''}${group.arts.map(artHtml).join('')}</td></tr>`).join('')}</tbody></table>`;
 const paidStages=forging.stages.filter(stage=>stage.level>0);
 if(paidStages.length)html+=`<h3>${t('forge.cost-steps')}</h3><table class="forging-cost-table"><thead><tr><th scope="col">${t('forge.stage')}</th><th scope="col">${t('forge.cost')}</th></tr></thead><tbody>${paidStages.map(stage=>`<tr><th scope="row">${label(stage.level)}</th><td>${stage.storyAwardPart?t('forge.award',{part:stage.storyAwardPart}):forgeCostHtml(stage.cost||{},{t,entries,name,base})}</td></tr>`).join('')}</tbody></table>`;
 if(e.weaponRestoration){const restoration=e.weaponRestoration,target=entries.find(item=>item.id===restoration.toItemId);html+=`<h3>${t('forge.restoration')}</h3><p><a href="${esc(path(target.id))}">${esc(t('forge.restore-to',{name:name(target)}))}</a></p><p class="forging-condition">${esc(restoration.condition[t.locale])}</p>`;}
 if(e.restoredFrom){const item=entries.find(item=>item.id===e.restoredFrom);html+=`<p>${t('forge.restored-from')}: <a href="${esc(path(item.id))}">${esc(name(item))}</a></p>`;}
 return html+'</section>';
}
export function forgingMaterialDetails(e,{t,name,entries,base='/'}){
 if(!e.forgeUses?.length)return '';
 const table=uses=>`<table class="forging-material-table"><thead><tr><th scope="col">${t('forge.weapon')}</th><th scope="col">${t('forge.stages-amounts')}</th></tr></thead><tbody>${uses.map(use=>{const weapon=entries.find(w=>w.id===use.weaponId);return `<tr><th scope="row"><a href="${esc(pagePath({id:weapon.id},t.locale,base))}#section-forging">${esc(name(weapon))}</a></th><td>${use.stages.map(stage=>`<span class="forging-material-step">+${stage.level} ×${stage.quantity}</span>`).join(' · ')}</td></tr>`;}).join('')}</tbody></table>`;
 let content;if(e.forgeUses.length>10){const groups=['Sword','Spear','Axe','Bow','Gauntlet'].map(type=>({type,uses:e.forgeUses.filter(use=>entries.find(w=>w.id===use.weaponId).forging.weaponType===type)})).filter(g=>g.uses.length);content=groups.map((group,i)=>`<details class="forging-material-group"${i===0?' open':''}><summary>${t('forge.'+group.type)} (${group.uses.length})</summary>${table(group.uses)}</details>`).join('');}else content=table(e.forgeUses);
 return `<section id="section-forge-uses" class="forging-section" tabindex="-1"><h2>${t('forge.material-use')}</h2><p class="forging-material-hint">${t('forge.material-hint')}</p>${content}</section>`;
}
