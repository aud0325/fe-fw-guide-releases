import {navigationGroups,navigationContext,filterContext} from './navigation.mjs';
import {isDiscoverable} from './editorial-view.mjs';
import {isPublicSource,referencedSources} from './source-visibility.mjs';
import {types} from './locales/labels.mjs';
import {createTranslator,localized} from './locales/index.mjs';
import {icon} from './icons.mjs';
import {escapeHtml as esc} from './core.mjs';
import {defaultState,pagePath} from './routing.mjs';

export const renderKey=(state,lang,limit=36,base='/')=>JSON.stringify([lang,base,limit,Object.entries(state).sort(([a],[b])=>a.localeCompare(b))]);
export function navigationHtml(state,lang,base,entries,sources,expanded=new Map()){
 const current=navigationContext(state,entries);
 const link=key=>`<a href="${esc(pagePath({...defaultState(),type:key},lang,base))}" class="${current.type===key?'active':''}" ${current.type===key?`aria-current="${state.id?'location':'page'}"`:''}>${icon(key==='growth'?'class':key)}<span>${esc(types[key][lang==='ko'?0:1])}</span>${['growth','map'].includes(key)?'':`<span class="count">${key==='sources'?Object.keys(referencedSources(entries,sources)).filter(id=>isPublicSource(id,sources[id])).length:key==='all'?entries.filter(isDiscoverable).length:entries.filter(e=>e.type===key).length}</span>`}</a>`;
 return link('all')+navigationGroups.map(group=>`<details class="nav-group ${current.group===group.id?'current-group':''}" data-nav-group="${group.id}" ${current.group===group.id||(expanded.get(group.id)??true)?'open':''}><summary>${esc(localized(group.label,lang))}${icon('expand')}</summary><div class="nav-children">${group.types.map(link).join('')}</div></details>`).join('')+link('sources');
}
export function shellFilters(state,entries){
 const controls=filterContext(state,entries);
 const route=controls.route&&(Boolean(state.id)||state.type!=='paralogue');
 return {route,tips:controls.tips,visible:route||controls.tips};
}
export function hydrateContent(element,key,html){
 // Consume the server marker once. Later renders replace nodes before binding
 // controls again, so clicking an already-selected filter cannot duplicate handlers.
 const initialKey=element.dataset.renderKey;delete element.dataset.renderKey;
 if(initialKey===key)return false;
 element.innerHTML=html;return true;
}

export function homeCategoriesHtml(lang,base){
 const t=createTranslator(lang);
 return [['weekly-routine',t('browse.routine-quick-link'),'paralogue'],['save-replay-guide',t('browse.save-quick-link'),'tip']].map(([id,title,type])=>`<a href="${pagePath({...defaultState(),id},lang,base)}">${icon(type)}<span>${title}</span>${icon('arrow')}</a>`).join('');
}
