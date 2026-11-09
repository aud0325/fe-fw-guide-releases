import {itemMajors,itemMinors,itemKinds,classifyItem,matchesItemFilters} from './item-types.mjs';
import {itemMedia} from './item-media.mjs';
import {escapeHtml as esc} from './core.mjs';
import {flavors} from './food.mjs';
const itemKindName=(entry,t,kind)=>entry.category==='Fertilizer'?t('item.type.fertilizer'):t(itemKinds[kind].ko,itemKinds[kind].en);
export function itemIcon(entry,{t},className=''){
 const kind=classifyItem(entry),image=itemMedia[kind.icon];
 const label=itemKindName(entry,t,kind.kind);
 return `<img class="item-type-icon ${kind.cursed?'is-cursed ':''}${className}" src="${esc(image.src)}" alt="${esc(kind.cursed?t('item.cursed-type-icon',{kind:label}):label+' '+t('item.type-icon'))}" width="36" height="36" loading="lazy" decoding="async">`;
}
export function itemTypeLabel(entry,{t}){const c=classifyItem(entry);return [t(itemMajors[c.major].ko,itemMajors[c.major].en),t(itemMinors[c.minor].ko,itemMinors[c.minor].en),itemKindName(entry,t,c.kind)].filter((v,i,a)=>!i||v!==a[i-1]).join(' · ');}
export function itemScopeLabel(state,{t}){
 const category=itemKinds[state.itemKind]||itemMinors[state.itemMinor]||itemMajors[state.itemMajor];
 const scope=category?t(category.ko,category.en):t('item.all-items');
 return state.itemFlavor?scope+' · '+t(flavors[state.itemFlavor].ko,flavors[state.itemFlavor].en):scope;
}
export function itemFilters(list,state,{t,availableKinds}){
 const count=filter=>list.filter(e=>matchesItemFilters(e,filter)).length;
 const button=(attribute,id,title,n,active,icon)=>`<button type="button" ${attribute}="${id}" aria-pressed="${active}"${icon?` class="item-filter-icon"`:''}>${icon?`<img src="${itemMedia[icon].src}" alt="" width="24" height="24">`:''}<span>${esc(title)}</span><small>${n}</small></button>`;
 let out=`<section class="item-filters" aria-label="${t('item.item-categories')}"><div class="item-major-tabs" role="group" aria-label="${t('item.main-category')}">${button('data-item-major','',t('item.all'),list.length,!state.itemMajor)}${Object.entries(itemMajors).map(([id,l])=>button('data-item-major',id,t(l.ko,l.en),count({itemMajor:id}),state.itemMajor===id)).join('')}</div>`;
 out+=`<div class="item-minor-filters" role="group" aria-label="${t('item.subcategory')}">${button('data-item-minor','',t('item.all'),count({itemMajor:state.itemMajor}),!state.itemMinor)}${Object.entries(itemMinors).filter(([,m])=>!m.archived&&(!state.itemMajor||m.major===state.itemMajor)).map(([id,m])=>button('data-item-minor',id,t(m.ko,m.en),count({itemMinor:id}),state.itemMinor===id)).join('')}</div>`;
 const kinds=Object.entries(itemKinds).filter(([id,k])=>id!=='strike'&&k.minor===state.itemMinor&&(!availableKinds||availableKinds.has(id)||state.itemKind===id));
 if(kinds.length>1)out+=`<div class="item-kind-filters" role="group" aria-label="${t('item.kind-filter')}">${button('data-item-kind','',t('item.all'),count({itemMinor:state.itemMinor}),!state.itemKind)}${kinds.map(([id,k])=>button('data-item-kind',id,t(k.ko,k.en),count({itemKind:id}),state.itemKind===id,k.icon)).join('')}</div>`;
 return out+'</section>';
}
