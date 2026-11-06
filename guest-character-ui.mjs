import {escapeHtml as esc} from './core.mjs';
import {routes} from './locales/labels.mjs';
import {pagePath} from './routing.mjs';
import {entryDisplayName} from './editorial-view.mjs';
import {rows} from './_abilities/full-data.mjs';
import {abilityToken} from './_abilities/token-links.mjs';
const byId=new Map(rows.map(row=>[row.id,row]));
const key=ability=>ability.abilityId||ability.name.en;
export function guestSkillTokens(e,{t,base='/'}){
 const known=[...new Map((e.guestCombat?.appearances||[]).flatMap(row=>row.abilities?.skill||[]).map(skill=>[key(skill),skill])).values()];
 return known.map(skill=>skill.abilityId?abilityToken(byId.get(skill.abilityId),t.locale,{base}):`<span lang="en">${esc(skill.name.en)}</span>`).join('')||esc(t('overview.unconfirmed'));
}

export function guestAppearanceLabel(appearance,t){
 const names=appearance.routeIds.map(id=>{const route=routes.find(row=>row[0]===id);return route[t.locale==='ko'?1:2];}).join(t.locale==='ko'?'·':' / ');
 return t(appearance.chapter?'character.guest-chapter':'character.guest-part',{part:appearance.part,route:names,chapter:appearance.chapter});
}
export function guestParticipation(e,{t,entries,base='/'}){
 if(!e.guestCombat)return '';
 const name=id=>entryDisplayName(entries.find(row=>row.id===id),t.locale);
 return `<section id="section-recruitment" class="guest-participation" tabindex="-1"><h2>${t('character.guest-participation')}</h2><div class="table-wrap"><table><thead><tr><th scope="col">${t('character.guest-timing')}</th><th scope="col">${t('character.guest-class')}</th></tr></thead><tbody>${e.guestCombat.appearances.map(appearance=>`<tr><th scope="row">${esc(guestAppearanceLabel(appearance,t))}${appearance.paralogueId?`<a class="guest-paralogue" href="${pagePath({id:appearance.paralogueId},t.locale,base)}">${esc(name(appearance.paralogueId))}</a>`:''}<small>${esc(appearance.timing[t.locale])}</small></th><td><a href="${pagePath({id:appearance.classId},t.locale,base)}">${esc(name(appearance.classId))}</a></td></tr>`).join('')}</tbody></table></div></section>`;
}
export function guestAbilities(e,{t,base='/'}){
 if(!e.guestCombat)return '';
 const appearances=e.guestCombat.appearances,known=appearances.filter(row=>row.abilities);
 const token=ability=>ability.abilityId?abilityToken(byId.get(ability.abilityId),t.locale,{base}):`<span class="guest-source-name" lang="en">${esc(ability.name.en)}</span>`;
 const tokens=list=>`<div class="guest-ability-tokens">${list.map(token).join('')}</div>`;
 const groups=['skill','combat-art','spell'].map(kind=>{
  const common=known[0]?.abilities[kind].filter(ability=>known.length===appearances.length&&known.every(row=>row.abilities[kind].some(other=>key(other)===key(ability))))||[];
  const extra=known.map(row=>({appearance:row,abilities:row.abilities[kind].filter(ability=>!common.some(other=>key(other)===key(ability)))})).filter(row=>row.abilities.length);
  if(!known.length)return '';
  return `<div class="guest-ability-group" data-guest-ability-kind="${kind}"><dt>${t('character.guest-'+kind)}</dt><dd>${common.length?tokens(common):''}${extra.map(row=>`<div class="guest-ability-addition"><small>${esc(guestAppearanceLabel(row.appearance,t))}${common.length?' · '+t('character.guest-additional'):''}</small>${tokens(row.abilities)}</div>`).join('')}${!common.length&&!extra.length?`<span class="result-label">${t('character.guest-none')}</span>`:''}</dd></div>`;
 }).join('');
 return `<section id="section-abilities" class="guest-abilities" tabindex="-1"><h2>${t('character.guest-abilities')}</h2>${known.length?`<p class="result-label">${t('character.guest-loadout-scope')}</p><dl class="guest-ability-list">${groups}</dl>`:`<p class="result-label">${t('character.guest-unconfirmed')}</p>`}</section>`;
}
