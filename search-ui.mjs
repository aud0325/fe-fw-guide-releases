import {searchEntries,escapeHtml as esc} from './core.mjs';
import {isDiscoverable,entryDisplayName} from './editorial-view.mjs';
import {pagePath,stateQuery,globalSearchState} from './routing.mjs';
import {types} from './locales/labels.mjs';
import {createTranslator} from './locales/index.mjs';

export function searchSuggestions(entries,query,limit=8){
 if(!query.trim())return {results:[],total:0};
 const matches=searchEntries(entries.filter(isDiscoverable),{query});
 return {results:matches.slice(0,limit),total:matches.length};
}
export function setupSearch({input,panel,clear,entries,context,navigate}){
 let composing=false,committing=false,active=-1,links=[],totalMatches=0,timer,pointerSelection=false;
 const cancel=()=>{clearTimeout(timer);timer=undefined;};
 const close=()=>{cancel();pointerSelection=false;committing=false;panel.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');active=-1;};
 const refresh=()=>{
  clear.hidden=!input.value;
  cancel();
  if(pointerSelection)return;
  const {lang,base}=context(),t=createTranslator(lang),{results,total}=searchSuggestions(entries,input.value);
  if(!input.value.trim()){close();return;}
  totalMatches=total;
  links=results.map(e=>({href:pagePath({id:e.id},lang,base),name:entryDisplayName(e,lang),type:types[e.type][lang==='ko'?0:1]}));
  if(total)links.push({href:pagePath(globalSearchState(input.value),lang,base)+stateQuery(globalSearchState(input.value)),name:t('search.all-results',{count:total})});
  panel.innerHTML=`<p class="sr-only" role="status">${esc(total?t('search.result-count',{count:total}):t('search.empty'))}</p><ul role="listbox" id="search-options" aria-label="${t('search.suggestions')}">${links.map((l,i)=>`<li role="option" id="search-option-${i}" aria-selected="false"><a tabindex="-1" href="${esc(l.href)}"><strong>${esc(l.name)}</strong>${l.type?`<small>${esc(l.type)}</small>`:''}</a></li>`).join('')}</ul>${total?'':`<p class="search-empty">${t('search.empty')}</p>`}`;
  active=-1;input.removeAttribute('aria-activedescendant');panel.hidden=false;input.setAttribute('aria-expanded','true');
 };
 // Preview even an unfinished Korean syllable after a pause; never navigate during IME composition.
 const schedule=()=>{clear.hidden=!input.value;if(pointerSelection){cancel();return;}if(composing||committing)cancel();else close();if(input.value.trim())timer=setTimeout(()=>{committing=false;refresh();},300);};
 const select=index=>{
  active=index;
  panel.querySelectorAll('[role="option"]').forEach((el,i)=>el.setAttribute('aria-selected',String(i===active)));
  const option=panel.querySelector(`#search-option-${active}`);
  if(option){input.setAttribute('aria-activedescendant',option.id);option.scrollIntoView({block:'nearest'});}
 };
 // Resolve an IME commit before keyboard selection so its delayed refresh cannot reset it.
 const prepare=()=>{if(panel.hidden||timer!==undefined)refresh();committing=false;};
 const submit=()=>{
  if(composing||!input.value.trim())return;
  prepare();
  const {lang,base}=context(),href=active>=0?links[active]?.href:totalMatches===1?links[0]?.href:pagePath(globalSearchState(input.value),lang,base)+stateQuery(globalSearchState(input.value));
  close();if(href)navigate(href);
 };
 input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-controls','search-options');input.setAttribute('aria-expanded','false');
 input.addEventListener('compositionstart',()=>{composing=true;cancel();});
 input.addEventListener('compositionupdate',schedule);
 input.addEventListener('compositionend',()=>{composing=false;committing=true;schedule();});
 input.addEventListener('input',schedule);input.addEventListener('focus',refresh);
 input.addEventListener('search',submit);
 input.addEventListener('keydown',event=>{
  if(composing||event.isComposing||event.keyCode===229)return;
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key==='Tab')return;
  if(['ArrowDown','ArrowUp'].includes(event.key)){
   event.preventDefault();prepare();if(!links.length||panel.hidden)return;
   select((active+(event.key==='ArrowDown'?1:active<0?0:-1)+links.length)%links.length);return;
  }
  if(event.key==='Enter'&&input.value.trim()){
   event.preventDefault();submit();
  }
 });
 // Focus transfer may commit IME text between pointerdown and click. Keep the
 // pressed link mounted until activation; do not navigate on touch-down/scroll.
 panel.addEventListener('pointerdown',event=>{if(event.target.closest('a[href]')){pointerSelection=true;cancel();}});
 panel.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');pointerSelection=false;
  if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const href=link.getAttribute('href');event.preventDefault();close();navigate(href);
 });
 panel.addEventListener('auxclick',()=>{pointerSelection=false;});
 document.addEventListener('pointerup',event=>{if(pointerSelection&&!event.target.closest('#search-panel a[href]'))pointerSelection=false;});
 document.addEventListener('pointercancel',()=>{pointerSelection=false;});
 document.addEventListener('pointerdown',event=>{if(!event.target.closest('.search-area'))close();});
 clear.addEventListener('click',()=>{input.value='';close();clear.hidden=true;input.focus();});
 return {close,refresh,sync(query=''){input.value=query;clear.hidden=!query;close();}};
}
