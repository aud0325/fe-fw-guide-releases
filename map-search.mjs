import {mapProvinces,variantCollectibles,mapMarkerKind} from './part1-map.mjs';
import {normalize,escapeHtml as esc} from './core.mjs';
import {englishText} from './locales/english-text.mjs';
import {localized} from './locales/index.mjs';
import {mapVariantNodes,caiChangedPlace} from './map-variants.mjs';
import {placeAliases} from './place-correspondences.mjs';

export function mapSearchSuggestions(query,t,limit=8,variant='all'){
 const tokens=query.trim().split(/\s+/).map(normalize).filter(Boolean),whole=normalize(query);
 if(!tokens.length)return [];
 const score=names=>{
  const values=names.filter(Boolean).map(normalize),text=values.join(' ');
  return tokens.every(token=>text.includes(token))?values.includes(whole)?3:values.some(value=>value.startsWith(whole))?2:1:0;
 };
 const nodes=mapVariantNodes(variant),collectibleRows=variantCollectibles(variant);
 const provinces=mapProvinces.filter(p=>nodes.some(n=>n.province===p.id)).map(p=>({
  type:'province',id:p.id,label:t(p.ko,p.en||p.ko),meta:t('map.province'),score:score([p.ko,p.en,localized({ko:p.ko,en:p.en||p.ko},'en'),englishText(p.en||p.ko)])
 }));
 const places=nodes.filter(n=>n.ko!=='???').map(n=>{
  const p=mapProvinces.find(p=>p.id===n.province);
  return {type:'place',id:n.id,label:t(n.ko,n.en||n.ko),meta:[p?t(p.ko,p.en||p.ko):t('map.unknown-province'),t('map.'+(variant==='cai'&&caiChangedPlace(n.id)?mapMarkerKind(n,variant):n.kind)),n.gatheringType&&!(variant==='cai'&&caiChangedPlace(n.id))?t('map.gathering-'+n.gatheringType):''].filter(Boolean).join(' · '),score:score([n.ko,n.en,localized({ko:n.ko,en:n.en||n.ko},'en'),englishText(n.en||n.ko),...n.aliases,...placeAliases(n.entryId)])};
 });
 const collectibles=collectibleRows.map(c=>({type:'collectible',id:c.id,label:t(c.ko,c.en||c.ko),meta:t('map.collectible-places',{count:c.placeIds.length}),score:score([c.ko,c.en,...c.aliases,localized({ko:c.ko,en:c.en||c.ko},'en'),englishText(c.en||c.ko)])}));
 return [...provinces,...places,...collectibles].filter(row=>row.score).sort((a,b)=>b.score-a.score).slice(0,limit);
}

export function mapSearchSelection(row){
 return {mapQuery:row.type==='province'?'':row.label,mapProvince:row.type==='province'?row.id:'',mapKind:'',mapPlace:row.type==='place'?row.id:'',mapItem:row.type==='collectible'?row.id:''};
}

// Suggestions are local previews. Only explicit selection/submission changes
// the route and map, keeping IME input and the map camera stable while typing.
export function bindMapSearch({input,panel,form,t,change,variant='all'}){
 const doc=input.ownerDocument,listeners=[];
 let composing=false,pointerSelection=false,active=-1,rows=[],timer;
 const on=(target,event,fn)=>{target.addEventListener(event,fn);listeners.push(()=>target.removeEventListener(event,fn));};
 const cancel=()=>{clearTimeout(timer);timer=undefined;};
 const close=()=>{cancel();active=-1;panel.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');};
 const refresh=()=>{
  cancel();if(pointerSelection)return;
  rows=mapSearchSuggestions(input.value,t,8,variant);active=-1;
  input.removeAttribute('aria-activedescendant');
  if(!input.value.trim()){close();return;}
  panel.innerHTML=`<ul role="listbox" id="map-search-options" aria-label="${esc(t('map.suggestions'))}">${rows.map((row,i)=>`<li role="option" id="map-search-option-${i}" aria-selected="false"><button type="button" tabindex="-1" data-map-suggestion="${i}"><strong${t.locale==='en'&&/[가-힣]/.test(row.label)?' lang="ko"':''}>${esc(row.label)}</strong><small>${esc(row.meta)}</small></button></li>`).join('')}</ul><p${rows.length?' class="sr-only"':' class="map-search-empty"'} role="status">${esc(rows.length?t('map.suggestion-count',{count:rows.length}):t('map.suggestion-empty'))}</p>`;
  panel.hidden=false;input.setAttribute('aria-expanded','true');
 };
 const schedule=()=>{cancel();if(pointerSelection)return;timer=setTimeout(refresh,150);};
 const select=index=>{
  active=index;
  panel.querySelectorAll('[role="option"]').forEach((option,i)=>option.setAttribute('aria-selected',String(i===index)));
  const option=panel.querySelector('#map-search-option-'+index);
  if(option){input.setAttribute('aria-activedescendant',option.id);option.scrollIntoView({block:'nearest'});}
 };
 const choose=row=>{close();change(mapSearchSelection(row),{focus:'#map-search',center:true});};
 const submit=()=>{
  if(composing)return;
  if(timer!==undefined||panel.hidden)refresh();
  if(active>=0&&rows[active]){choose(rows[active]);return;}
  const query=input.value.trim();close();
  change({mapQuery:query,mapProvince:'',mapKind:'',mapPlace:'',mapItem:''},{focus:'#map-search',caret:input.selectionStart,center:!!query});
 };
 input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-controls','map-search-options');input.setAttribute('aria-expanded','false');
 on(input,'compositionstart',()=>{composing=true;cancel();});
 on(input,'compositionupdate',schedule);
 on(input,'compositionend',()=>{composing=false;schedule();});
 on(input,'input',schedule);on(input,'focus',refresh);
 on(input,'keydown',event=>{
  if(composing||event.isComposing||event.keyCode===229)return;
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key==='Tab'){close();return;}
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){
   event.preventDefault();if(timer!==undefined||panel.hidden)refresh();
   if(rows.length)select((active+(event.key==='ArrowDown'?1:active<0?0:-1)+rows.length)%rows.length);
  }else if(event.key==='Enter'){event.preventDefault();submit();}
 });
 on(form,'submit',event=>{event.preventDefault();submit();});
 // Preserve a pressed option across the IME commit caused by focus transfer.
 // Activation stays on click, so scrolling a touch list never selects a place.
 on(panel,'pointerdown',event=>{if(event.target.closest('[data-map-suggestion]')){pointerSelection=true;cancel();}});
 on(panel,'click',event=>{
  const button=event.target.closest('[data-map-suggestion]');pointerSelection=false;
  if(!button||event.button!==0)return;
  event.preventDefault();const row=rows[Number(button.dataset.mapSuggestion)];if(row)choose(row);
 });
 on(doc,'pointerup',event=>{if(!panel.contains(event.target))pointerSelection=false;});
 on(doc,'pointercancel',()=>{pointerSelection=false;});
 on(doc,'pointerdown',event=>{if(!form.contains(event.target)){pointerSelection=false;close();}});
 on(form,'focusout',event=>{if(!pointerSelection&&!form.contains(event.relatedTarget))close();});
 return {close,destroy(){close();listeners.forEach(remove=>remove());}};
}
