import {escapeHtml as esc} from './core.mjs';
import {pagePath} from './routing.mjs';
import {characterIcon} from './_abilities/icon-model.mjs';
const order=['loved','liked','neutral','not-disliked','disliked'];
const link=(id,label,t,base,anchor)=>`<a href="${esc(pagePath({id},t.locale,base)+(anchor?'#'+anchor:''))}">${esc(label)}</a>`;
const list=items=>`<ul class="activity-links" role="list">${items.map(s=>`<li>${s}</li>`).join('')}</ul>`;
function preferenceRows(records,{t,content,sortBy}){return order.flatMap(preference=>{const items=records.filter(r=>r.preference===preference);if(sortBy)items.sort((a,b)=>sortBy(a).localeCompare(sortBy(b),t.locale));return items.length?[{preference,items:items.map(content)}]:[];});}
function table(rows,t,heading){return `<table class="activity-preference-table"><thead><tr><th scope="col">${t('activity.preference')}</th><th scope="col">${heading}</th></tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${t('activity.'+r.preference)}</th><td>${list(r.items)}</td></tr>`).join('')}</tbody></table>`;}
export function characterActivityPreferences(e,{t,base='/'}){
 const temples=e.activityPreferences?.temples||[];if(!temples.length)return '';
 const rows=preferenceRows(temples,{t,sortBy:r=>r.name[t.locale],content:r=>link(r.locationId,r.name[t.locale],t,base,'section-temple-service')});
 return `<section class="activity-section" id="section-activities" tabindex="-1"><h2>${t('activity.title')}</h2>${table(rows,t,t('activity.temple-column'))}</section>`;
}

function person(record,{t,name,entries,base}){
 const c=entries.find(e=>e.id===record.characterId),face=characterIcon(c.id);
 return `<a class="activity-person" href="${esc(pagePath({id:c.id},t.locale,base)+'#section-activities')}">${face?`<img src="${esc(base+'_abilities/'+face.src.replace(/^\.\//,''))}" width="24" height="26" loading="lazy" decoding="async" alt="">`:''}<span>${esc(name(c))}</span></a>`;
}
export function templeServicePreferences(e,ctx){
 if(!e.templeServicePreferences?.length)return '';
 const rows=preferenceRows(e.templeServicePreferences,{t:ctx.t,sortBy:r=>ctx.name(ctx.entries.find(e=>e.id===r.characterId)),content:r=>person(r,ctx)});
 return `<section class="activity-section" id="section-temple-service" tabindex="-1"><h2>${ctx.t('activity.temple')} · ${ctx.t('activity.preference')}</h2>${table(rows,ctx.t,ctx.t('activity.people'))}</section>`;
}
export function theatrePlayPreferences(){return ''; }
