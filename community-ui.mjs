import {statLabels as stats} from './locales/labels.mjs';
import {displayText} from './presentation.mjs';
import {entries} from './data.mjs';
import {escapeHtml as esc} from './core.mjs';
export function communityDetails(e,{t,tx,routes,route,showGathering=true,showNotes=true}){
 let out='';
 const text=x=>displayText(x,t,entries);
 const table=(headers,rows)=>`<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 const grid=(r,percent)=>`<div class="character-stats">${table(stats.map(s=>t(s[1],s[2])),[stats.map(([k])=>r.values[k]==null?'—':esc(r.values[k])+(percent?'%':''))])}</div><p>${r.movement!=null?t('community.movement-modifier')+' '+esc(r.movement):''}</p>`;
 if(e.classStats){out+=`<h2>${t('community.class-growth-and-stat-modifiers')}</h2><p>${t('community.class-modifiers-added-to-personal-rates-negative-and-zero')}</p>`;for(const [field,r]of Object.entries(e.classStats))out+=`<h3>${field==='growth'?t('community.growth-modifiers'):t('community.stat-modifiers')}</h3>${grid(r,field==='growth')}`;
 if(e.classStatAlternatives?.length)out+=`<details class="coverage"><summary>${t('community.compare-conflicting-sources')}</summary>${e.classStatAlternatives.map(r=>`<h3>${r.field==='growth'?t('community.growth-modifiers'):t('community.stat-modifiers')}</h3>${grid(r,r.field==='growth')}`).join('')}</details>`;}
 if(e.giftCategoryReports?.length)out+=`<details class="coverage"><summary>${t('community.gift-category-reports')}</summary><p>${t('community.community-category-recommendations-distinct-from-individual-gift-preference-tiers')}</p>${e.giftCategoryReports.map(r=>`<p>${esc(text(r.text))}</p>`).join('')}</details>`;
 if(e.paralogue){const p=e.paralogue;out+=e.schedule?`<details class="coverage"><summary>${t('community.community-dates-rewards')}</summary>`:'';out+=`<h2>${t('community.paralogue-schedule-by-route')}</h2><p class="notice">${t('community.overview-and-detail-dates-are-preserved-separately-conflicting-dates')}</p>`+table([t('common.route'),t('community.overview-acceptance-window'),t('community.detail-table-period')],routes.filter(([id])=>p.windows[id]&&(route==='all'||route===id)).map(([id,ko,en])=>[esc(t(ko,en)),esc(p.windows[id]),esc(text(p.detail[id]||'—'))]))+`<p>${t('community.reported-reward')}: ${esc(text(p.reward))}</p>${p.note?`<p class="notice">${esc(text(p.note))}</p>`:''}`;if(e.schedule)out+='</details>'; }
 if(showGathering&&e.gathering?.length)out+=`<h2>${t('community.gathering-locations')}</h2>`+table([t('community.region'),t('community.location')],e.gathering.map(r=>[esc(text(r.region||'—')),esc(text(r.where))]));
 for(const n of showNotes?e.communityNotes||[]:[]){const body=`<p>${esc(tx(n.text))}</p>`;out+=n.spoiler?`<details class="coverage"><summary>${t('community.additional-report-spoilers')}</summary>${body}</details>`:body;}
 if(e.checklist)out+=`<section class="routine" data-routine="${esc(e.id)}"><h2>${t('community.my-checklist')}</h2><p>${t('community.saved-on-this-device-it-does-not-sync-with')}</p>${e.checklist.map(r=>`<label><input type="checkbox" data-routine-item="${esc(r.id)}"> <span><small>${r.period==='daily'?t('community.daily'):r.period==='weekly'?t('community.weekly'):t('community.periodic')}</small> ${esc(tx(r.label))}</span></label>`).join('')}<button type="button" data-routine-reset>${t('community.reset-checklist')}</button></section>`;

 return out;
}
export function bindCommunityControls(root){
 for(const section of root.querySelectorAll('[data-routine]')){const key='fw-routine-v1-'+section.dataset.routine;let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}const inputs=[...section.querySelectorAll('[data-routine-item]')];const persist=()=>{try{localStorage.setItem(key,JSON.stringify(saved))}catch{}};for(const input of inputs){input.checked=saved[input.dataset.routineItem]===true;input.addEventListener('change',()=>{saved[input.dataset.routineItem]=input.checked;persist()});}section.querySelector('[data-routine-reset]').addEventListener('click',()=>{saved={};inputs.forEach(i=>i.checked=false);persist()});}
}

