import {allRoute,paralogueOrders} from './locales/labels.mjs';
import {icon} from './icons.mjs';
import {displayText} from './presentation.mjs';
import {entries,routes} from './data.mjs';
import {scheduleRows} from './paralogues.mjs';
import {escapeHtml as esc} from './core.mjs';
const character=id=>entries.find(e=>e.id===id);
const faction=(e,t)=>t(e.koreanNameEvidence?.section?.replace(/^\d+[.\d]*\s*/, '')||e.group||t('common.affiliation-unknown'),e.group||t('common.affiliation-unknown'));
function windowsTable(e,route,t,overview=false){
 const rows=scheduleRows([e],route)[0]?.windows||[];
 if(overview&&route!=='all'&&rows.length){const v=rows[0][1];return `<dl class="paralogue-window"><div><dt>${t('paralogue.accept')}</dt><dd>${v.windows.map(([a,b])=>esc(a===b?a:`${a}–${b}`)).join('<br>')}</dd></div><div class="paralogue-deadline"><dt>${t('paralogue.finish-by')}</dt><dd><strong>${esc(v.deadline)}</strong></dd></div></dl>`;}
 return rows.length?`<table class="paralogue-dates"><thead><tr><th scope="col">${t('common.route')}</th><th scope="col">${t('paralogue.accept')}</th><th scope="col">${t('paralogue.finish-by')}</th></tr></thead><tbody>${rows.map(([id,v])=>`<tr><th scope="row">${esc(t(...routes.find(r=>r[0]===id).slice(1)))}</th><td>${v.windows.map(([a,b])=>a===b?a:`${a}–${b}`).join('<br>')}</td><td><strong>${v.deadline}</strong></td></tr>`).join('')}</tbody></table>`:`<p>${t('paralogue.unavailable-on-this-route')}</p>`;
}
function people(e,{t,name,href}){const s=e.schedule,owner=character(s.owner),giver=character(s.giver);return `<p class="paralogue-people"><a href="${href(owner.id)}">${esc(name(owner))}</a> · ${esc(faction(owner,t))}</p><p class="paralogue-giver">${t('paralogue.accept-from')} <a href="${href(giver.id)}">${esc(name(giver))}</a> · ${esc(displayText(s.place,t,entries))}</p>`;}
export function paralogueDetails(e,ctx){if(!e.schedule)return '';return `<section class="paralogue-detail"><h2>${ctx.t('paralogue.paralogue-schedule-part-i')}</h2>${people(e,ctx)}${windowsTable(e,ctx.route,ctx.t)}${e.schedule.note?`<p class="paralogue-note">${esc(ctx.tx(e.schedule.note))}</p>`:''}</section>`;}
export function paralogueOverview(list,state,ctx){
 const {t,name,href,tx}=ctx;let rows=scheduleRows(list,state.route,state.order);
 if(state.order==='owner')rows.sort((a,b)=>`${faction(character(a.e.schedule.owner),t)} ${name(character(a.e.schedule.owner))}`.localeCompare(`${faction(character(b.e.schedule.owner),t)} ${name(character(b.e.schedule.owner))}`));
 return `<section class="paralogue-overview"><div class="section-head"><h2>${t('paralogue.paralogues')}</h2><small role="status">${rows.length}${t('common.entries')}</small></div><div class="paralogue-toolbar"><div class="paralogue-routes" aria-label="${t('paralogue.paralogue-route')}">${[allRoute,...routes].map(([id,ko,en])=>`<button type="button" data-paralogue-route="${id}" aria-pressed="${state.route===id}">${esc(t(ko,en))}</button>`).join('')}</div><label>${t('paralogue.sort')} <select id="paralogue-order">${paralogueOrders.map(([id,ko,en])=>`<option value="${id}" ${state.order===id?'selected':''}>${t(ko,en)}</option>`).join('')}</select></label></div><p class="paralogue-caption">${t('paralogue.part-i-in-game-dates-available-only-on-listed')}</p><div class="paralogue-list">${rows.map(({e})=>`<article class="paralogue-row"><div><h3><a href="${href(e.id)}">${esc(name(e))} ${icon('arrow')}</a></h3>${people(e,ctx)}</div>${windowsTable(e,state.route,t,true)}${e.schedule.note?`<p class="paralogue-note">${esc(tx(e.schedule.note))}</p>`:''}</article>`).join('')||`<p>${t('paralogue.no-matching-paralogues-change-your-search-or-route')}</p>`}</div><p class="paralogue-caption">${t('paralogue.open-a-title-for-prerequisites-and-rewards')}</p></section>`;
}

