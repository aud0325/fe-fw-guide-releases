import {flavors,foodKinds,ingredientFlavorId,preferredMountFood} from './food.mjs';
import {classifyItem} from './item-types.mjs';
import {escapeHtml as esc} from './core.mjs';
import {informationHint} from './presentation.mjs';
export function ingredientFlavorLabel(e,t){const f=flavors[ingredientFlavorId(e)];return t(f.ko,f.en);}
export function foodDetails(e,{t}){
 if(e.type==='item'&&foodKinds[classifyItem(e).kind]){
  return `<section class="food-details"><h2>${t('item.flavor')}</h2><p><strong>${esc(ingredientFlavorLabel(e,t))}</strong></p></section>`;
 }
 return '';
}
export function ingredientFoodRow(e,{t}){
 if(e.type!=='item'||!foodKinds[classifyItem(e).kind])return '';
 return `<tr class="food-details"><th scope="row">${t('item.flavor')}</th><td><strong>${esc(ingredientFlavorLabel(e,t))}</strong></td></tr>`;
}
export function mountFoodRow(e,{t}){
 if(e.type!=='mount')return '';
 const preferred=preferredMountFood(e);
 if(!preferred)return '';
 let value=t('item.food-unknown');
 if(preferred){
  const {kind,flavor}=preferred;
  const label=[kind?t(foodKinds[kind].ko,foodKinds[kind].en):t('item.food-kind-unknown'),t(flavors[flavor].ko,flavors[flavor].en)].join(' · ');
  value=kind&&flavor!=='unknown'?`<a class="linkchip food-match" href="#category/item?main=materials&sub=ingredients&kind=${kind}&flavor=${flavor}">${esc(label)}</a>`:esc(label);
 }
 const help=informationHint(t('item.mount-bait-advice'),t('item.preferred-food')+' · '+t('presentation.information'));
 return `<tr><th>${t('item.preferred-food')}${help}</th><td>${value}</td></tr>`;
}
