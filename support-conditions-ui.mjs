import {escapeHtml as esc} from './core.mjs';
import {pagePath} from './routing.mjs';
import {routes} from './locales/labels.mjs';
import {characterIcon} from './_abilities/icon-model.mjs';
export function supportConditions(e,{t,name,entries,base='/'}){
 if(e.type!=='character'||(!e.supports?.length&&e.supportStatus!=='none'))return '';
 const get=id=>entries.find(e=>e.id===id),person=id=>esc(name(get(id))),route=id=>{const r=routes.find(r=>r[0]===id);return esc(t(r[1],r[2]));};
 const note=n=>`<p class="support-note">${t('support.'+n.key)}</p>`;
 const conversationLink=c=>{
  const [a,b]=c.characterIds,label=c.characterIds.map(person).join('–');
  return `<a href="${esc(pagePath({id:a},t.locale,base)+'#support-'+b+'-'+c.rank)}">${label}</a>`;
 };
 const lines=r=>{
  const timing=[r.parts?.map(part=>t('support.part',{part})).join(' / '),r.routes?.length?t('support.routes',{names:r.routes.map(route).join(' / ')}):'',...r.excludedRoutes?.map(id=>t('support.excluded',{name:route(id)}))||[],r.chapter?t('support.chapter',{chapter:r.chapter}):'',r.fromChapter?t('support.from',{chapter:r.fromChapter}):'',r.afterChapter?t('support.after',{chapter:r.afterChapter}):'',r.beforeChapter?t(r.deadlineRouteId?'support.deadline-route':'support.before',{chapter:r.beforeChapter,name:r.deadlineRouteId?route(r.deadlineRouteId):''}):'',r.timingUnknown?t('support.timing-unknown'):''].filter(Boolean);
  const conditions=[r.recruitBeforeChapter?t('support.recruit-before',{name:person(r.recruitCharacterId),chapter:r.recruitBeforeChapter}):'',r.recruitmentNotRequiredId?t('support.no-recruitment',{name:person(r.recruitmentNotRequiredId)}):'',r.beforeConversation?t('support.before-conversation',{pair:conversationLink(r.beforeConversation),rank:r.beforeConversation.rank}):'',r.afterConversation?t('support.after-conversation',{pair:conversationLink(r.afterConversation),rank:r.afterConversation.rank}):'',r.orderCanLock?t('support.lock'):'',r.afterEvent?t('support.after-request',{name:person(r.afterEvent.characterId)}):'',r.unspecifiedConversation?t('support.prerequisite-unknown',{name:person(r.unspecifiedConversation.characterId),rank:r.unspecifiedConversation.rank}):''].filter(Boolean);
  return `<div id="support-${r.partnerId}-${r.rank}" class="support-rank" tabindex="-1"><strong class="support-rank-letter">${r.rank}</strong><div><p class="support-rank-meta"><span>${t('support.level',{level:r.supportLevel})}</span>${timing.length?`<span>${timing.join(' · ')}</span>`:''}</p>${conditions.length?`<ul class="support-requirements">${conditions.map(line=>`<li>${line}</li>`).join('')}</ul>`:''}</div></div>`;
 };
 const rows=[...e.supports||[]].sort((a,b)=>name(get(a.partnerId)).localeCompare(name(get(b.partnerId)),t.locale));
 const body=e.supportStatus==='none'?`<p>${t('support.none')}</p>`:`${e.supportNotes?.map(note).join('')||''}<table class="support-conditions-table"><thead><tr><th scope="col">${t('support.partner')}</th><th scope="col">${t('support.conditions')}</th></tr></thead><tbody>${rows.map(s=>{
  const p=get(s.partnerId),icon=characterIcon(p.id);
  return `<tr><th scope="row"><a class="support-partner" href="${esc(pagePath({id:p.id},t.locale,base)+'#support-'+e.id+'-'+s.ranks[0].rank)}">${icon?`<img src="${esc(base+'_abilities/'+icon.src.replace(/^\.\//,''))}" width="24" height="26" alt="" loading="lazy" decoding="async">`:''}<span>${esc(name(p))}</span></a></th><td>${s.ranks.map(r=>lines({...r,partnerId:p.id})).join('')}${s.notes?.map(note).join('')||''}</td></tr>`;
 }).join('')}</tbody></table>`;
 return `<section id="section-supports" class="support-section" tabindex="-1"><h2>${t('support.title')}</h2>${body}</section>`;
}
