import {escapeHtml as esc} from './core.mjs';
import {routes} from './locales/labels.mjs';
import {itemVariantSuffix} from './item-variants.mjs';
export function tradeUses(item,entries){
 return entries.filter(e=>e.type==='item').flatMap(e=>(e.acquisition||[]).filter(r=>(r.supplier==='vandal-company'||/trade|exchange/i.test(r.method?.en||''))&&r.materials?.some(m=>m.itemId===item.id)).map(row=>({item:e,row}))).sort((a,b)=>(a.row.fromChapter??a.row.chapter??Infinity)-(b.row.fromChapter??b.row.chapter??Infinity)||a.item.id.localeCompare(b.item.id));
}
export function tradeTiming(row,{t}){
 const scope=row.route?[row.route]:row.routeIds||[],routeNames=scope.map(id=>routes.find(r=>r[0]===id)).filter(Boolean).map(r=>t(r[1],r[2])).join(' · ');
 return [row.part?t('map.part-record',{part:row.part}):'',routeNames,row.merchantName?t(row.merchantName.ko,row.merchantName.en):'',row.fromChapter!=null?t('economy.from-chapter',{chapter:row.fromChapter}):row.chapter!=null?t('map.chapter',{chapter:row.chapter}):'',row.stock!=null?t('economy.stock',{stock:row.stock==='unlimited'?t('economy.unlimited'):row.stock}):'',row.requiresRestoration?t('economy.restored'):''].filter(Boolean).join(' · ');
}
export function tradeMaterials(materials,{entries,name,href,t},focusId){
 return materials.map(m=>{const item=entries.find(e=>e.id===m.itemId),label=item?m.itemId===focusId?esc(name(item)):`<a href="${esc(href(item.id))}">${esc(name(item))}</a>`:`<span lang="en">${esc(m.name?.en||m.original||'')}</span>`,text=label+' ×'+esc(m.quantity);return m.itemId===focusId?`<strong>${text}</strong>`:text;}).join(' + ');
}
export function tradeUsageDetails(e,ctx){
 if(e.type!=='item')return '';
 const uses=tradeUses(e,ctx.entries);if(!uses.length)return '';
 const {t,entries,name,href}=ctx;
 return `<section class="item-trade-usage" id="section-trade-usage"><h2>${t('economy.exchange-for')}</h2><div class="table-wrap economy-trade-table"><table><colgroup><col class="economy-item-column"><col></colgroup><thead><tr><th scope="col">${t('economy.receive')}</th><th scope="col">${t('economy.trade-condition')}</th></tr></thead><tbody>${uses.map(({item,row})=>{const place=entries.find(e=>e.id===row.locationId);return `<tr><th scope="row"><a href="${esc(href(item.id))}">${esc(name(item))}${row.upgrade?' +'+row.upgrade:''}</a></th><td><div>${place?`<a href="${esc(href(place.id))}">${esc(name(place))}</a>`:''}</div><div class="economy-materials">${tradeMaterials(row.materials,ctx,e.id)}</div><small>${esc(tradeTiming(row,ctx))}</small></td></tr>`;}).join('')}</tbody></table></div></section>`;
}
export function crateContentsDetails(e,{t,entries,name,href}){
 if(!e.crateContents?.length)return '';
 return `<section class="item-crate-contents" id="section-crate-contents"><h2>${t('economy.possible-contents')}</h2>${e.cratePoolCondition?`<p>${esc(t(e.cratePoolCondition.ko,e.cratePoolCondition.en))}</p>`:''}<ul class="economy-contents">${e.crateContents.map(row=>{const item=entries.find(e=>e.id===row.itemId),variant=esc(itemVariantSuffix(row,t));return `<li>${item?`<a href="${esc(href(item.id))}">${esc(name(item))}${variant}</a>`:`<span lang="en">${esc(row.name.en)}${variant}</span>`}</li>`;}).join('')}</ul></section>`;
}
