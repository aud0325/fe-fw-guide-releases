import {escapeHtml as esc,searchEntries} from './core.mjs';
import {classifyItem,itemKinds,itemMinors,itemMajors} from './item-types.mjs';
import {itemIcon,itemFilters,itemScopeLabel} from './item-ui.mjs';
import {flavors,foodKinds,ingredientFlavorId} from './food.mjs';

function equipmentEffect(entry,t){
 const base=entry.equipmentVariants?.find(row=>row.key==='base');
 if(entry.equipmentVariants?.length)return base?.effect?t(base.effect.ko,base.effect.en):'';
 const fact=['observed-effect','equipment-effect','effect','game8-item-effect'].map(key=>entry.facts?.find(f=>f.key===key)).find(Boolean);
 const effect=fact?(t.locale==='ko'?fact.valueKo??fact.value:fact.value):t(entry.summary?.ko||'',entry.summary?.en||'');
 if(/확인된 참고 자료|Only information supported by the cited references/.test(effect))return '';
 return String(effect).replace(/^(?:무게|Weight)\s*[+-]?\d+(?:\.\d+)?\s*(?:\/|[.;·])\s*/i,'').trim();
}

export const itemFoodScope=state=>state.itemMinor==='ingredients'&&(!state.itemKind||Boolean(foodKinds[state.itemKind]))||Boolean(state.itemFlavor);
export function itemDirectoryGroups(list,state,{t,name}){
 const collator=new Intl.Collator(t.locale,{numeric:true,sensitivity:'base'});
 const ordered=[...list].sort((a,b)=>collator.compare(name(a),name(b)));
 if(state.itemOrder==='flavor'&&itemFoodScope(state)){
  return [...Object.entries(flavors).map(([id,label])=>({id:'flavor-'+id,title:t(label.ko,label.en),entries:ordered.filter(e=>foodKinds[classifyItem(e).kind]&&ingredientFlavorId(e)===id)})),...Object.entries(itemKinds).filter(([id,k])=>k.minor==='ingredients'&&!foodKinds[id]).map(([id,k])=>({id,title:t(k.ko,k.en),entries:ordered.filter(e=>classifyItem(e).kind===id)}))].filter(g=>g.entries.length);
 }
 const groups=state.itemMinor?itemKinds:itemMinors;
 return Object.entries(groups).filter(([,g])=>!g.archived).map(([id,g])=>({id,title:t(g.ko,g.en),entries:ordered.filter(e=>classifyItem(e)[state.itemMinor?'kind':'minor']===id)})).filter(g=>g.entries.length);
}
export function itemDirectory(entries,state,{t,name,href,text}){
 const query=[state.query,state.catalogQuery].filter(Boolean).join(' ');
 const all=searchEntries(entries,{type:'item',query}),list=searchEntries(entries,{...state,type:'item',query});
 const value=(e,key)=>{const f=e.facts?.find(f=>f.key===key);return f&&(t.locale==='ko'?f.valueKo??f.value:f.value);};
 const meta=e=>{
  const kind=classifyItem(e),parts=[];
  if(foodKinds[kind.kind]){
   if(!state.itemMinor||state.itemOrder==='flavor')parts.push(t(itemKinds[kind.kind].ko,itemKinds[kind.kind].en));
   if(state.itemOrder!=='flavor'||!itemFoodScope(state))parts.push(t(flavors[ingredientFlavorId(e)].ko,flavors[ingredientFlavorId(e)].en));
  }
  else if(kind.minor==='weapons'){
   const might=value(e,'might'),rank=value(e,'rank');
   if(might!=null&&might!=='')parts.push(t('app.mt')+might);
   if(rank)parts.push(text(rank)+' '+t('app.rank'));
  }else if(kind.minor==='accessories'){
   const effect=equipmentEffect(e,t);
   if(effect)parts.push(effect);
   else if(!state.itemMinor)parts.push(t(itemKinds[kind.kind].ko,itemKinds[kind.kind].en));
  }else if(!state.itemMinor)parts.push(t(itemKinds[kind.kind].ko,itemKinds[kind.kind].en));
  return parts.join(' · ');
 };
 const groups=itemDirectoryGroups(list,state,{t,name});
 const overview=!state.itemMinor&&!query.trim()&&!state.itemFlavor;
 const renderEntry=e=>{
  const info=meta(e),equipment=classifyItem(e).minor==='accessories';
  return `<a class="item-directory-link" data-item-id="${esc(e.id)}" href="${href(e.id)}"><span class="item-directory-icon">${itemIcon(e,{t})}</span><span class="item-directory-copy"><strong>${esc(name(e))}</strong>${info?`<small${equipment?` class="item-directory-effect" title="${esc(info)}"`:''}>${esc(info)}</small>`:''}</span></a>`;
 };
 const renderGroup=g=>{
  const url='#category/item?main='+itemMinors[g.id]?.major+'&sub='+g.id;
  const headingTag=overview?'h3':'h2';
  const heading=`<${headingTag} id="item-group-${g.id}">${esc(g.title)} <small>${t(g.entries.length===1?'browse.entry-one':'browse.entry-count',{count:g.entries.length})}</small></${headingTag}>`;
  return `<section class="item-directory-group" aria-labelledby="item-group-${g.id}">${overview?`<div class="item-directory-group-heading">${heading}<a class="item-directory-group-more" href="${url}" aria-label="${esc(t('item.category-all',{category:g.title}))}">${t('item.view-all')}</a></div>`:heading}<div class="item-directory-grid">${(overview?g.entries.slice(0,6):g.entries).map(renderEntry).join('')}</div></section>`;
 };
 const sections=overview?`<div class="item-directory-overview">${Object.entries(itemMajors).map(([id,title])=>{
  const majorGroups=groups.filter(g=>itemMinors[g.id].major===id);
  return majorGroups.length?`<section class="item-directory-major" aria-labelledby="item-major-${id}"><h2 id="item-major-${id}">${esc(t(title.ko,title.en))}</h2><div class="item-directory-overview-grid">${majorGroups.map(renderGroup).join('')}</div></section>`:'';
 }).join('')}</div>`:groups.map(renderGroup).join('');
 const food=itemFoodScope(state),flavorOptions=Object.entries(flavors).map(([id,label])=>`<option value="${id}"${state.itemFlavor===id?' selected':''}>${esc(t(label.ko,label.en))}</option>`).join('');
 return `<div class="item-directory" data-item-directory>${itemFilters(all,state,{t,availableKinds:new Set(entries.filter(e=>e.type==='item').map(e=>classifyItem(e).kind))})}<div class="item-directory-tools"><label class="item-directory-search"><span class="sr-only">${t('item.directory-search')}</span><input id="item-query" type="search" value="${esc(state.catalogQuery||state.query)}" placeholder="${esc(t('item.directory-search'))}" autocomplete="off"></label>${food?`<label>${t('item.flavor')}<select data-item-flavor><option value="">${t('item.all')}</option>${flavorOptions}</select></label><label>${t('item.sort')}<select data-item-order><option value="name"${state.itemOrder!=='flavor'?' selected':''}>${t('item.sort-name')}</option><option value="flavor"${state.itemOrder==='flavor'?' selected':''}>${t('item.sort-flavor')}</option></select></label>`:''}<span class="item-directory-count" role="status" aria-live="polite">${esc(t('item.result-count',{scope:itemScopeLabel(state,{t}),count:list.length}))}</span></div>${groups.length?sections:`<div class="empty"><h2>${t('app.no-matching-entries')}</h2><p>${t('app.try-another-name-english-or-korean-or-reset-the')}</p></div>`}</div>`;
}
