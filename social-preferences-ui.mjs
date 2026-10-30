import {escapeHtml as esc} from './core.mjs';
import {pagePath} from './routing.mjs';
import {characterIcon} from './_abilities/icon-model.mjs';
import {informationHint} from './presentation.mjs';
import {socialMeals} from './social-meals.mjs';
const preferences=['loved','liked','mild','neutral','disliked',null];
const label=(preference,t)=>t('social.'+(preference||'unknown'));
const list=items=>`<ul class="social-links" role="list">${items.map(item=>`<li>${item}</li>`).join('')}</ul>`;
const table=(rows,t,heading)=>`<table class="social-preference-table"><thead><tr><th scope="col">${t('social.preference')}</th><th scope="col">${heading}</th></tr></thead><tbody>${rows.map(row=>`<tr><th scope="row">${label(row.preference,t)}</th><td>${list(row.items)}</td></tr>`).join('')}</tbody></table>`;
export function characterGiftPreferences(e,{t,name,entries,base='/'}){
 if(e.type!=='character')return '';
 const rows=preferences.flatMap(preference=>{
  const gifts=(e.gifts||[]).filter(g=>g.preference===preference).map(g=>entries.find(e=>e.id===g.itemId)).filter(Boolean).sort((a,b)=>name(a).localeCompare(name(b),t.locale));
  return gifts.length?[{preference,items:gifts.map(item=>`<a href="${esc(pagePath({id:item.id},t.locale,base))}">${esc(name(item))}</a>`)}]:[];
 });
 return `<section id="section-gifts" class="social-section" tabindex="-1"><h2>${t('social.gifts')}</h2>${rows.length?table(rows,t,t('social.gift')):`<p class="result-label">${t('social.gifts-unknown')}</p>`}</section>`;
}
export function characterMealPreferences(e,{t}){
 if(e.type!=='character'||(!e.mealPreferences?.length&&!e.mealPreferenceScope))return '';
 const rows=preferences.flatMap(preference=>{
  const meals=(e.mealPreferences||[]).filter(m=>m.preference===preference).map(m=>socialMeals[m.mealId]).sort((a,b)=>t(a.ko,a.en).localeCompare(t(b.ko,b.en),t.locale));
  const items=meals.map(meal=>`<span${t.locale==='ko'?` title="${esc(meal.en)}"`:''}>${esc(t(meal.ko,meal.en))}</span>`);
  if(e.mealPreferenceScope?.preference===preference)items.push(t('social.all-meals'));
  return items.length?[{preference,items}]:[];
 });
 const names=e.mealPreferences?.length?[...new Set(e.mealPreferences.map(m=>m.mealId))].map(id=>socialMeals[id]):Object.values(socialMeals);
 const help=t('social.meal-name-help')+'\n'+names.map(meal=>meal.ko+' · '+meal.en).join('\n');
 return `<section id="section-meals" class="social-section" tabindex="-1"><h2>${t('social.meals')}${t.locale==='ko'?informationHint(help,t('social.meals')+' · '+t('presentation.information'),'i','social-meal-name-hint'):''}</h2>${table(rows,t,t('social.meal'))}</section>`;
}
export function giftRecipientTable(gifts,{t,name,base='/'}){
 if(!gifts.length)return '';
 const rows=preferences.flatMap(preference=>{
  const people=gifts.filter(g=>g.gift.preference===preference).map(g=>g.character).sort((a,b)=>name(a).localeCompare(name(b),t.locale));
  return people.length?[{preference,items:people.map(person=>{const icon=characterIcon(person.id);return `<a class="social-person" href="${esc(pagePath({id:person.id},t.locale,base)+'#section-gifts')}">${icon?`<img src="${esc(base+'_abilities/'+icon.src.replace(/^\.\//,''))}" alt="" width="24" height="26" loading="lazy" decoding="async">`:''}<span>${esc(name(person))}</span></a>`;})}]:[];
 });
 return `<section id="section-gift-recipients" class="social-section social-recipients" tabindex="-1"><h3>${t('social.recipients')}</h3>${table(rows,t,t('social.characters'))}</section>`;
}
