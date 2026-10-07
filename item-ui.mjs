import {itemMajors,itemMinors,itemKinds,classifyItem,matchesItemFilters} from './item-types.mjs';
import {itemMedia} from './item-media.mjs';
import {escapeHtml as esc} from './core.mjs';
import {flavors,foodKinds} from './food.mjs';
export function itemIcon(entry,{t},className=''){
 const kind=classifyItem(entry),image=itemMedia[kind.icon];
 const label=t(itemKinds[kind.kind].ko,itemKinds[kind.kind].en);
 return `<img class="item-type-icon ${kind.cursed?'is-cursed ':''}${className}" src="${esc(image.src)}" alt="${esc(kind.cursed?t('item.cursed-type-icon',{kind:label}):label+' '+t('item.type-icon'))}" width="36" height="36" loading="lazy" decoding="async">`;
}
export function itemTypeLabel(entry,{t}){const c=classifyItem(entry);return [itemMajors[c.major],itemMinors[c.minor],itemKinds[c.kind]].map(v=>t(v.ko,v.en)).filter((v,i,a)=>!i||v!==a[i-1]).join(' · ');}
export function itemScopeLabel(state,{t}){
 const category=itemKinds[state.itemKind]||itemMinors[state.itemMinor]||itemMajors[state.itemMajor];
 const scope=category?t(category.ko,category.en):t('item.all-items');
 return state.itemFlavor?scope+' · '+t(flavors[state.itemFlavor].ko,flavors[state.itemFlavor].en):scope;
}
export function itemFilters(list,state,{t}){
 const count=filter=>list.filter(e=>matchesItemFilters(e,filter)).length;
 const button=(attribute,id,title,n,active,icon)=>`<button type="button" ${attribute}="${id}" aria-pressed="${active}"${icon?` class="item-filter-icon"`:''}>${icon?`<img src="${itemMedia[icon].src}" alt="" width="24" height="24">`:''}<span>${esc(title)}</span><small>${n}</small></button>`;
 let out=`<section class="item-filters" aria-label="${t('item.item-categories')}"><div class="item-filter-row" role="group" aria-label="${t('item.main-category')}">${button('data-item-major','',t('item.all'),list.length,!state.itemMajor)}${Object.entries(itemMajors).map(([id,l])=>button('data-item-major',id,t(l.ko,l.en),count({itemMajor:id}),state.itemMajor===id)).join('')}</div>`;
 if(state.itemMajor)out+=`<div class="item-filter-row item-filter-secondary" role="group" aria-label="${t('item.subcategory')}">${button('data-item-minor','',t('item.category-all',{category:t(itemMajors[state.itemMajor].ko,itemMajors[state.itemMajor].en)}),count({itemMajor:state.itemMajor}),!state.itemMinor)}${Object.entries(itemMinors).filter(([,m])=>m.major===state.itemMajor).map(([id,m])=>button('data-item-minor',id,t(m.ko,m.en),count({itemMinor:id}),state.itemMinor===id,m.icon)).join('')}</div>`;
 const kinds=Object.entries(itemKinds).filter(([id,k])=>(!state.itemMajor||itemMinors[k.minor].major===state.itemMajor)&&(!state.itemMinor||k.minor===state.itemMinor)&&list.some(e=>classifyItem(e).kind===id));
 out+='<div class="item-filter-controls">';
 if((state.itemMinor&&kinds.length>1)||state.itemKind)out+=`<label class="catalog-filter">${t('item.item-type')} <select id="item-kind"><option value="">${t('common.all')}</option>${kinds.map(([id,k])=>`<option value="${id}" ${state.itemKind===id?'selected':''}>${esc(t(k.ko,k.en))} (${count({itemKind:id})})</option>`).join('')}${state.itemKind&&!kinds.some(([id])=>id===state.itemKind)?`<option value="${state.itemKind}" selected>${esc(t(itemKinds[state.itemKind].ko,itemKinds[state.itemKind].en))} (0)</option>`:''}</select></label>`;
 const showFlavor=state.itemFlavor||(state.itemMinor==='ingredients'&&list.some(e=>foodKinds[classifyItem(e).kind]&&matchesItemFilters(e,{...state,itemFlavor:''})));
 if(showFlavor)out+=`<label class="catalog-filter">${t('item.flavor')} <select id="item-flavor"><option value="">${t('common.all')}</option>${Object.entries(flavors).map(([id,f])=>`<option value="${id}" ${state.itemFlavor===id?'selected':''}>${esc(t(f.ko,f.en))} (${count({...state,itemFlavor:id})})</option>`).join('')}</select></label>`;
 const help=showFlavor?`<details class="item-filter-help"><summary>${t('item.flavor-help-title')}</summary><p class="result-label">${t('item.flavor-filter-help')}</p></details>`:'';
 return out+((state.itemMinor||state.itemKind||state.itemFlavor)?`<button type="button" class="item-filter-reset" data-item-reset>${t('item.reset-categories')}</button>`:'')+'</div>'+help+'</section>';
}
