import {escapeHtml as esc} from './core.mjs';
import {entryIconMedia} from './entity-media.mjs';
import {recruitmentRouteName} from './growth-calculator-recruitment.mjs';
import {classTierOrder,canonicalClassTier} from './class-tiers.mjs';
import {sortClasses} from './class-order.mjs';
import {characterIcon} from './_abilities/icon-model.mjs';
export function calculatorIcon(entry,base='/'){
 const media=entry?.type==='character'?characterIcon(entry.id):entry?entryIconMedia(entry):null;
 if(!media)return '';
 const src=entry.type==='character'?base+'_abilities/'+media.src.replace(/^\.\//,''):base+media.src.replace(/^\.\//,'');
 return `<img src="${esc(src)}" alt="" width="${entry.type==='character'?32:24}" height="${entry.type==='character'?36:24}" loading="lazy" decoding="async">`;
}
export function calculatorPickerGroups(items){
 if(items.some(e=>e.pickerGroup)){const groups=new Map();for(const e of items){if(!groups.has(e.pickerGroup))groups.set(e.pickerGroup,[]);groups.get(e.pickerGroup).push(e);}return [...groups].map(([label,items])=>({label,items}));}
 if(!items.length||!items.every(e=>e.type==='class'))return [{tier:'',items}];
 const groups=new Map();for(const entry of sortClasses(items)){const tier=canonicalClassTier(entry.tier);if(!groups.has(tier))groups.set(tier,[]);groups.get(tier).push(entry);}
 return [...groups].sort(([a],[b])=>classTierOrder.indexOf(a)-classTierOrder.indexOf(b)).map(([tier,rows])=>({tier,items:rows}));
}
export function centeredPickerScroll(list,option){return list.scrollTop+option.top+option.height/2-list.top-list.height/2;}
const pickerChevron='<svg class="calc-picker-chevron" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export function calculatorPicker({id,label,items,value,lang,base,t,character=false,disabled=false,routeViews,selectedRoute=''}){
 const findText=!character&&routeViews?t('calculator.recruitFindLevel'):t('calculator.find');
 const name=e=>e.name?.[lang]||e.name?.en||'',current=items.find(e=>e.id===value),icon=calculatorIcon(current,base),text=current?name(current):t('calculator.none');
 const viewRoute=routeViews?.some(v=>v.route===selectedRoute)?selectedRoute:'',views=routeViews||[{route:'',items}];
 const option=(e,i,view)=>`<button type="button" role="option" tabindex="-1" id="${id}-view-${view}-option-${i}" aria-selected="${e.id===value}" data-value="${esc(e.id)}" data-search="${esc([e.name?.ko,e.name?.en,...(e.aliases||[]),e.pickerDetail].join(' ').normalize('NFKC').toLowerCase())}">${calculatorIcon(e,base)}<span class="calc-option-copy"><span>${esc(name(e))}</span>${e.pickerDetail?`<small>${esc(e.pickerDetail)}</small>`:''}</span>${Number.isFinite(e.pickerLevel)?`<small class="calc-option-level">Lv${e.pickerLevel}</small>`:''}</button>`;
 const options=views.map((view,v)=>{let serial=0;const groups=calculatorPickerGroups(view.items).map((group,i)=>{const title=group.label||(group.tier?t('calculator.tier.'+group.tier):'');const rows=group.items.map(e=>option(e,serial++,v)).join('');return title?`<div role="group" aria-labelledby="${id}-view-${v}-group-${i}" data-calc-option-group><div class="calc-picker-group-label" id="${id}-view-${v}-group-${i}">${esc(title)}</div>${rows}</div>`:rows;}).join('');return `<div data-calc-route-view="${view.route}"${view.route===viewRoute?'':' hidden'}>${groups}</div>`;}).join('');
 const filters=routeViews?`<div class="calc-picker-routes" role="group" aria-label="${t('calculator.recruitRouteFilter')}">${views.map(v=>`<button type="button" data-calc-picker-route="${v.route}" aria-pressed="${v.route===viewRoute}">${v.route?esc(recruitmentRouteName(v.route,lang,t)):t('calculator.recruitAll')}</button>`).join('')}</div><p class="calc-picker-route-note"${viewRoute==='dietrich'?'':' hidden'}>${t('calculator.recruitDietrichNote')}</p>`:'';

 return `<div class="calc-picker${character?' calc-person-picker':''}" data-calc-picker="${id}"${routeViews?` data-calc-route-picker data-calc-selected-route="${viewRoute}"`: ''}><label id="${id}-label" for="${id}">${esc(label)}</label><div class="calc-picker-control">${icon}${character?`<input id="${id}" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-list" autocomplete="off" value="${esc(text)}" data-selected-text="${esc(text)}">`:`<button type="button" id="${id}"${disabled?' disabled':''} aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-list" aria-labelledby="${id}-label ${id}-text"><span id="${id}-text">${esc(text)}</span><span class="calc-picker-toggle">${pickerChevron}</span></button>`}${character?`<button type="button" class="calc-picker-arrow" aria-label="${esc(t('calculator.browse',{name:label}))}" data-open-label="${esc(t('calculator.browse',{name:label}))}" data-close-label="${esc(t('calculator.closeBrowse',{name:label}))}" aria-expanded="false" aria-controls="${id}-list">${pickerChevron}</button>`:''}</div><div class="calc-picker-popup" hidden>${filters}${character?'':`<input type="search" class="calc-picker-search" aria-label="${esc(label+' '+findText)}" placeholder="${esc(findText)}" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-list" autocomplete="off">`}<div role="listbox" tabindex="-1" aria-labelledby="${id}-label" id="${id}-list">${options}</div><p class="calc-picker-empty" role="status" hidden>${t('calculator.noOptions')}</p></div></div>`;
}
export function bindCalculatorPickers(host,onSelect,{onRoute}={}){
 const disposers=[];
 host.querySelectorAll('[data-calc-picker]').forEach(picker=>{
  const id=picker.dataset.calcPicker,trigger=picker.querySelector('#'+id);if(trigger.disabled)return;
  const popup=picker.querySelector('.calc-picker-popup'),listbox=picker.querySelector('[role="listbox"]'),input=picker.querySelector('input'),options=[...picker.querySelectorAll('[role="option"]')];let active=-1,searchText='';
  const visible=()=>options.filter(o=>!o.hidden&&!o.closest('[data-calc-route-view]').hidden);
  const highlight=n=>{const list=visible();active=Math.max(0,Math.min(n,list.length-1));options.forEach(o=>o.classList.remove('calc-option-active'));const option=list[active];if(option){option.classList.add('calc-option-active');input.setAttribute('aria-activedescendant',option.id);option.scrollIntoView({block:'nearest'});}else input.removeAttribute('aria-activedescendant');};
  const filter=q=>{searchText=q;const query=q.normalize('NFKC').toLowerCase().trim();options.forEach(o=>{o.hidden=!o.dataset.search.includes(query);o.classList.remove('calc-option-active');});picker.querySelectorAll('[data-calc-option-group]').forEach(group=>{group.hidden=!group.querySelector('[role=option]:not([hidden])');});picker.querySelector('.calc-picker-empty').hidden=visible().length>0;active=-1;input.removeAttribute('aria-activedescendant');listbox.scrollTop=0;};
  const arrow=picker.querySelector('.calc-picker-arrow'),expanded=value=>{if(arrow){arrow.setAttribute('aria-expanded',String(value));arrow.setAttribute('aria-label',value?arrow.dataset.closeLabel:arrow.dataset.openLabel);}};
  const close=()=>{expanded(false);popup.hidden=true;trigger.setAttribute('aria-expanded','false');input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');if(trigger===input)input.value=input.dataset.selectedText;};
  const position=()=>{const anchor=popup.offsetParent||picker,rect=anchor.getBoundingClientRect(),below=innerHeight-rect.bottom-12,above=rect.top-12,up=below<240&&above>below,space=up?above:below;popup.style.top=up?'auto':'calc(100% + 5px)';popup.style.bottom=up?'calc(100% + 5px)':'auto';picker.querySelector('[role="listbox"]').style.maxHeight=Math.max(80,Math.min(300,space-(popup.offsetHeight-listbox.offsetHeight)-8))+'px';};
  const open=()=>{host.querySelectorAll('[data-calc-picker]').forEach(p=>{if(p!==picker)p.dispatchEvent(new Event('calc-close'));});popup.hidden=false;expanded(true);trigger.setAttribute('aria-expanded','true');input.setAttribute('aria-expanded','true');filter('');if(trigger!==input){input.value='';input.focus();}else input.select();position();if(trigger!==input){const selected=visible().find(o=>o.getAttribute('aria-selected')==='true');if(selected){active=visible().indexOf(selected);selected.classList.add('calc-option-active');input.setAttribute('aria-activedescendant',selected.id);const a=listbox.getBoundingClientRect(),b=selected.getBoundingClientRect();listbox.scrollTop=centeredPickerScroll({scrollTop:listbox.scrollTop,top:a.top,height:listbox.clientHeight},{top:b.top,height:b.height});}}};
  const resize=()=>{if(!popup.hidden)position();};window.addEventListener('resize',resize);disposers.push(()=>window.removeEventListener('resize',resize));
  picker.addEventListener('calc-close',close);
  trigger.addEventListener('click',()=>{if(trigger===input||popup.hidden)open();else close();});
  picker.querySelector('.calc-picker-arrow')?.addEventListener('click',()=>{if(popup.hidden){open();input.focus();}else close();});
  input.addEventListener('input',()=>{if(popup.hidden)open();filter(input.value);});
  picker.addEventListener('keydown',event=>{
   if(event.isComposing)return;
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();trigger.focus();}
   if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)&&(event.key.startsWith('Arrow')||!popup.hidden)){
    event.preventDefault();if(popup.hidden)open();if(event.target.closest('[data-calc-picker-route]')){input.focus();if(trigger===input)input.select();}const size=visible().length;highlight(event.key==='Home'?0:event.key==='End'?size-1:active+(event.key==='ArrowDown'?1:-1));
   }
   if(event.key==='Enter'&&!popup.hidden&&event.target===input){event.preventDefault();const option=visible()[Math.max(active,0)];if(option){close();onSelect(id,option.dataset.value,picker.dataset.calcSelectedRoute||'');}}
  });
  options.forEach(option=>option.addEventListener('click',()=>{close();onSelect(id,option.dataset.value,picker.dataset.calcSelectedRoute||'');}));
  const setRoute=route=>{const views=[...picker.querySelectorAll('[data-calc-route-view]')],chosen=views.some(v=>v.dataset.calcRouteView===route)?route:'';picker.dataset.calcSelectedRoute=chosen;views.forEach(v=>v.hidden=v.dataset.calcRouteView!==chosen);picker.querySelectorAll('[data-calc-picker-route]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.calcPickerRoute===chosen)));const note=picker.querySelector('.calc-picker-route-note');if(note)note.hidden=chosen!=='dietrich';filter(searchText);if(!popup.hidden)position();};
  picker.addEventListener('calc-route-filter',event=>setRoute(event.detail));
  picker.querySelectorAll('[data-calc-picker-route]').forEach(button=>button.addEventListener('click',()=>{const route=button.dataset.calcPickerRoute;host.querySelectorAll('[data-calc-route-picker]').forEach(p=>p.dispatchEvent(new CustomEvent('calc-route-filter',{detail:route})));onRoute?.(id,route);}));
  const outside=event=>{if(!picker.contains(event.target))close();};document.addEventListener('pointerdown',outside);disposers.push(()=>document.removeEventListener('pointerdown',outside));
  picker.addEventListener('focusout',event=>{if(!picker.contains(event.relatedTarget))close();});
 });
 return ()=>disposers.forEach(dispose=>dispose());
}
