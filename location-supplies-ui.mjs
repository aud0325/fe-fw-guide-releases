import {gatheringSupplyRows} from './gathering-model.mjs';
import {gatheringConditionDetails} from './gathering-ui.mjs';
import {escapeHtml as esc} from './core.mjs';
import {localized} from './locales/index.mjs';
import {acquisitionRecords} from './acquisition-map.mjs';
import {tradeMaterials} from './item-economy-ui.mjs';
const isCommerce=r=>Boolean(r.materials?.length||r.price!=null||/shop|purchase|trade|exchange/i.test(r.method?.en||''));
export function visibleShopRows(place){
 const rows=place.locationSupplies?.shops||[];
 // The source splits this compound into two unrecognized tokens. Keep the
 // independently linked compound, without inventing another route or period.
 if(place.id!=='map-maon-castle'||!rows.some(r=>r.itemId==='volcano-ghosh'))return rows;
 return rows.filter(r=>r.itemId||!['Volcano','Ghosh'].includes(r.name?.en));
}
const routeText=(ids,{t,routes})=>ids?.length===routes.length?'':(ids||[]).map(id=>routes.find(r=>r[0]===id)).filter(Boolean).map(r=>t(r[1],r[2])).join(' · ');
const scope=(r,ctx)=>[r.part?ctx.t('dungeon.part',{part:r.part}):'',r.route?routeText([r.route],ctx):routeText(r.routeIds,ctx),r.chapter?ctx.t('supply.chapter',{chapter:r.chapter}):'',r.fromChapter?ctx.t('economy.from-chapter',{chapter:r.fromChapter}):'',r.requiresRestoration&&!/restor|복구|復興/i.test(r.condition?.en||r.condition?.ko||'')?ctx.t('economy.restored'):'',r.condition?localized(r.condition,ctx.t.locale):''].filter(Boolean).join(' · ');
function commerceCondition(r,ctx){
 const condition=scope(r,ctx),values=condition?[esc(condition)]:[];
 if(r.price!=null&&!/[GＧ]/.test(r.condition?.en||''))values.push(esc(Number(r.price).toLocaleString('en-US')+'G'));
 if(r.stock!=null&&!/stock|재고|在庫/i.test(r.condition?.en||''))values.push(esc(ctx.t('economy.stock',{stock:r.stock==='unlimited'?ctx.t('economy.unlimited'):r.stock})));
 if(r.merchantName)values.push(esc(localized(r.merchantName,ctx.t.locale)));
 if(r.materials?.length)values.push(esc(ctx.t('item.trade-materials'))+': '+tradeMaterials(r.materials,ctx));
 if(r.materialsComplete===false)values.push(esc(ctx.t('forge.unknown-materials')));
 return values.join(' · ')||ctx.t('supply.purchase');
}
const itemLabel=(row,ctx)=>{const item=ctx.entries.find(e=>e.id===row.itemId),upgrade=row.upgrade?' +'+row.upgrade:'';return item?`<a href="${esc(ctx.href(item.id))}">${esc(ctx.name(item))}${upgrade}</a>`:`<span lang="en">${esc(row.name?.en||'')}${upgrade}</span>`;};
function supplyTable(rows,ctx,kind){
 const content=row=>kind==='gathering'?gatheringConditionDetails(row.gatheringScopes||[],ctx)+row.availability.map(r=>row.gatheringScopes?`<span class="gathering-condition"><span class="gathering-primary">${ctx.t('map.gathering-method')}</span><span class="gathering-scope">${esc(scope(r,ctx))}</span></span>`:`<div>${esc(scope(r,ctx))}</div>`).join(''):row.records?.length?row.records.map(r=>`<div>${commerceCondition(r,ctx)}</div>`).filter((v,i,all)=>all.indexOf(v)===i).join(''):'—';
 return `<div class="table-wrap location-supply-table${kind==='gathering'&&rows.some(r=>r.gatheringScopes)?' location-gathering-conditions':''}"><table><colgroup><col class="location-supply-name"><col></colgroup><thead><tr><th scope="col">${ctx.t('supply.item')}</th><th scope="col">${ctx.t(kind==='gathering'?'supply.gathering-condition':'supply.shop-condition')}</th></tr></thead><tbody>${rows.map(row=>`<tr><th scope="row">${itemLabel(row,ctx)}</th><td>${content(row)}</td></tr>`).join('')}</tbody></table></div>`;
}
export function locationSupplyDetails(e,ctx){
 const d=e.locationSupplies;if(!d)return '';
 let out='';
 const section=(kind,title,rows)=>{
  if(!rows.length)return '';
  const onlyLater=r=>kind==='gathering'?(r.gatheringScopes?.length||r.availability.length)&&[...(r.gatheringScopes||[]),...r.availability].every(a=>a.part===3):r.records?.length&&r.records.every(a=>a.part===3);
  const now=rows.filter(r=>!onlyLater(r)),later=rows.filter(onlyLater);
  const current=now.length?supplyTable(now,ctx,kind):'',future=later.length?`<details class="location-supply-later"><summary>${ctx.t('supply.later')}</summary>${supplyTable(later,ctx,kind)}</details>`:'';
  return `<section class="location-supplies" id="section-${kind}-supplies"><h2>${ctx.t(title)}</h2>${kind==='shop'&&d.stockUpdates?`<p class="location-supply-note">${ctx.t('supply.stock-updates')}</p>`:''}${kind==='shop'?future+current:current+future}</section>`;
 };
 out+=section('gathering','supply.gathering',gatheringSupplyRows(e));
 const shops=visibleShopRows(e).map(row=>{const item=ctx.entries.find(e=>e.id===row.itemId),records=item?acquisitionRecords(item,ctx.entries).filter(r=>r.locationId===e.id&&isCommerce(r)&&(r.upgrade||0)===(row.upgrade||0)&&(row.merchantName?r.merchantName?.en===row.merchantName.en:!r.merchantName)):[];return {...row,records};});
 out+=section('shop','supply.shops',shops);
 return out;
}
