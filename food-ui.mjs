import {flavors,foodKinds,ingredientFlavorId,preferredMountFood,mountFoodReports} from './food.mjs';
import {classifyItem} from './item-types.mjs';
import {escapeHtml as esc} from './core.mjs';
import {informationHint} from './presentation.mjs';
export function ingredientFlavorLabel(e,t){const f=flavors[ingredientFlavorId(e)];return t(f.ko,f.en);}
export function foodDetails(e,{t}){
 if(e.type==='item'&&foodKinds[classifyItem(e).kind]){
  const observed=e.ingredientFlavor?.basis==='game-ui';
  const conflicts=(e.ingredientFlavorReports||[]).filter(r=>r.flavor!==e.ingredientFlavor?.flavor);
  const help=e.ingredientFlavor?informationHint(t(observed?'item.flavor-video':'item.flavor-basis'),t('item.flavor-information')):'';
  return `<section class="food-details"><h2>${t('item.flavor')} ${help}</h2><p><strong>${esc(ingredientFlavorLabel(e,t))}</strong></p>${conflicts.map(r=>`<p class="notice">${t('item.flavor-description-differs',{flavor:t(flavors[r.flavor].ko,flavors[r.flavor].en)})}</p>`).join('')}</section>`;
 }
 return '';
}
export function ingredientFoodRow(e,{t}){
 if(e.type!=='item'||!foodKinds[classifyItem(e).kind])return '';
 const conflicts=(e.ingredientFlavorReports||[]).filter(r=>r.flavor!==e.ingredientFlavor?.flavor);
 const help=e.ingredientFlavor?informationHint(t(e.ingredientFlavor.basis==='game-ui'?'item.flavor-video':'item.flavor-basis'),t('item.flavor-information')):'';
 return `<tr class="food-details"><th scope="row">${t('item.flavor')} ${help}</th><td><strong>${esc(ingredientFlavorLabel(e,t))}</strong>${conflicts.map(r=>`<p class="notice">${t('item.flavor-description-differs',{flavor:t(flavors[r.flavor].ko,flavors[r.flavor].en)})}</p>`).join('')}</td></tr>`;
}
export function mountFoodRow(e,{t,sources={},tx=x=>x}){
 if(e.type!=='mount')return '';
 const preferred=preferredMountFood(e);
 let value=t('item.food-unknown');
 if(preferred){
  const {kind,flavor}=preferred;
  const label=[kind?t(foodKinds[kind].ko,foodKinds[kind].en):t('item.food-kind-unknown'),t(flavors[flavor].ko,flavors[flavor].en)].join(' · ');
  value=kind&&flavor!=='unknown'?`<a class="linkchip food-match" href="#category/item?main=materials&sub=ingredients&kind=${kind}&flavor=${flavor}">${esc(label)}</a>`:esc(label);
 }
 const reports=mountFoodReports(e);
 const conflict=new Set(reports.map(r=>r.flavor).filter(f=>f!=='unknown')).size>1;
 const reportLinks=r=>{
  const seen=new Set();
  return r.reports.map(s=>sources[s.sourceId]).filter(s=>{
   if(!s||seen.has(s.url))return false;
   seen.add(s.url);return true;
  }).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(typeof s.title==='string'?s.title:tx(s.title))}</a>`).join(' / ');
 };
 if(conflict)value+=`<div class="recruitment-comparison"><strong>${t('character.conflict')}</strong><ul>${reports.map(r=>`<li>${esc(t(flavors[r.flavor].ko,flavors[r.flavor].en))} · ${reportLinks(r)}</li>`).join('')}</ul></div>`;
 return `<tr><th>${t('item.preferred-food')}</th><td>${value}</td></tr>`;
}
