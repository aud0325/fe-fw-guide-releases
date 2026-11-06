import {defaultState,pagePath,stateQuery} from './routing.mjs';
import {escapeHtml as esc} from './core.mjs';
import {feedbackLink} from './feedback.mjs';
export const directoryKind=state=>state.type==='growth'?state.growthTab||'character':state.type;
export const directoryView=state=>state.type==='growth'?(state.growthMode==='stats'?'stats':'growth'):state.directoryView==='skills'?'skills':state.directoryView==='scout'||state.type==='character'&&state.scout&&state.scout!=='all'?'scout':'overview';
export function directoryTabs(state,{t,lang,base='/'}){
 const type=directoryKind(state),view=directoryView(state),query=state.type==='growth'?state.growthQuery:state.catalogQuery;
 const views=[['overview',t('directory.overview')],['growth',t('directory.growth')],[type==='character'?'scout':'stats',type==='character'?t('directory.scout'):t('directory.stats')],['skills',t('directory.abilities')]];
 return `<div class="directory-tabs" role="tablist" aria-label="${esc(t('directory.views-label'))}">${views.map(([key,label])=>{
  const next={...defaultState(),type:key==='growth'||key==='stats'?'growth':type,growthTab:type,growthMode:key==='stats'?'stats':'growth',directoryView:['scout','skills'].includes(key)?key:'overview',scout:key==='scout'&&state.scout&&state.scout!=='all'?state.scout:key==='scout'?'cai':'all',catalogQuery:query||'',growthQuery:query||'',growthHeat:state.growthHeat,growthSkill:state.growthSkill};
  return `<a id="directory-tab-${key}" role="tab" aria-selected="${view===key}" aria-controls="directory-panel" tabindex="${view===key?0:-1}" data-directory-tab="${key}" href="${esc(pagePath(next,lang,base)+stateQuery(next))}">${esc(label)}</a>`;
 }).join('')}</div>`;
}
export function directoryShell(state,body,{t,lang,base='/',count=''}){
 const type=directoryKind(state),view=directoryView(state),title=t(type==='character'?'overview.characters':type==='class'?'overview.classes':'directory.mounts');
 return `<div class="${type}-listing overview-page directory-page" data-directory-page><div class="breadcrumb-row page-breadcrumb-row"><div class="breadcrumbs"><a href="${base}${lang}/">${t('app.archive')}</a> / ${title}</div>${feedbackLink(lang)}</div><div class="section-head"><div class="overview-heading"><h1>${title}</h1></div>${count}</div>${directoryTabs(state,{t,lang,base})}<section id="directory-panel" role="tabpanel" aria-labelledby="directory-tab-${view}">${body}</section></div>`;
}
export function bindDirectoryTabs(root){
 root.querySelectorAll('[data-directory-tab]').forEach(tab=>tab.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();const tabs=[...root.querySelectorAll('[data-directory-tab]')],i=tabs.indexOf(tab),j=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;
  tabs[j].click();root.querySelector('[data-directory-tab][aria-selected="true"]')?.focus({preventScroll:true});
 }));
}
