import {routes} from './locales/labels.mjs';
import {gatheringSupplyRows,groupedGatheringScopes} from './gathering-model.mjs';

// A snippet is a small selection of complete records, not a place-name index.
// Unknown constraint fields are deliberately omitted from snippets until their meaning is supported here.
const recordKeys=new Set(['locationId','where','method','part','route','routeIds','chapter','fromChapter','condition','requiresRestoration','price','stock','stockUpdates','merchantName','materials','materialsComplete','quantity','probability','renown','upgrade','supplier','dungeonChest','chestCount','containerId','supplyRecord','status','checked']);
const scopeKeys=new Set(['part','route','routeIds','condition','kind','regularPercent','firstGatherGuaranteed','acceptedQuest','extraConditions']);
const sourceKey=key=>/sourceIds?$/i.test(key);
const supported=(row,keys)=>Object.keys(row).every(key=>keys.has(key)||sourceKey(key));
function verified(row,sources){
 const ids=[];
 function collect(value){
  if(!value||typeof value!=='object')return;
  for(const [key,item]of Object.entries(value))if(sourceKey(key))ids.push(...(Array.isArray(item)?item:[item]));else collect(item);
 }
 collect(row);
 return ids.length>0&&ids.every(id=>sources[id]&&sources[id].kind!=='unverified')&&row.status!=='inferred';
}
function scopeText(row,{t,tx}){
 const ids=row.route?[row.route]:row.routeIds||[];
 if(ids.some(id=>!routes.some(route=>route[0]===id)))return null;
 const routeNames=ids.length===routes.length?'':ids.map(id=>{const route=routes.find(route=>route[0]===id);return t(route[1],route[2]);}).join(' / ');
 return [row.part!=null?t('dungeon.part',{part:row.part}):'',routeNames,row.chapter!=null?t('supply.chapter',{chapter:row.chapter}):'',row.fromChapter!=null?t('economy.from-chapter',{chapter:row.fromChapter}):'',row.requiresRestoration?t('economy.restored'):'',tx(row.condition)].filter(Boolean).join(' · ');
}
function acquisitionText(row,head,ctx){
 if(!head||!supported(row,recordKeys)||!verified(row,ctx.sources))return '';
 const {t,tx,entries,name}=ctx,scope=scopeText(row,ctx),supplier=row.supplier&&entries.find(e=>e.id===row.supplier);
 if(scope===null||row.supplier&&!supplier)return '';
 const materials=(row.materials||[]).map(material=>{
  const item=entries.find(e=>e.id===material.itemId);
  return item&&material.quantity!=null?`${name(item)} ×${material.quantity}`:'';
 });
 if(materials.some(value=>!value))return '';
 const details=[tx(row.method),scope,row.merchantName?tx(row.merchantName):supplier?name(supplier):'',materials.join(' + '),row.materialsComplete===false?t('forge.unknown-materials'):'',row.price!=null?`${row.price}G`:'',row.stock!=null?t('economy.stock',{stock:row.stock==='unlimited'?t('economy.unlimited'):row.stock}):'',row.stockUpdates?t('supply.stock-updates'):'',row.quantity!=null?`×${row.quantity}`:'',row.probability!=null?`${Number((row.probability*100).toFixed(2))}%`:'',row.renown!=null?`${t.locale==='ko'?'명성':'Renown'} ${row.renown}`:''].filter(Boolean);
 return `${head}${row.upgrade?' +'+row.upgrade:''}${details.length?' ('+details.join(' · ')+')':''}`;
}
function gatheringText(row,ctx){
 const item=ctx.entries.find(e=>e.id===row.itemId),scopes=row.gatheringScopes||[],availability=row.availability||[];
 if(!item||!scopes.length&&!availability.length||[...scopes,...availability].some(scope=>!supported(scope,scopeKeys)||!verified(scope,ctx.sources)))return '';
 const {t,tx}=ctx,details=[];
 for(const group of groupedGatheringScopes(scopes)){
  const scope=scopeText({...group,part:null,route:null},ctx);if(scope===null)return '';
  const parts=group.parts.map(part=>t('dungeon.part',{part})).join(' / ');
  const method=group.kind==='dungeon'?t('gathering.dungeon-ore'):group.kind==='quest'?t('gathering.quest-first'):group.kind==='gathering'?t('map.gathering-method'):'';
  if(!method)return '';
  details.push([method,parts,scope,group.regularPercent!=null?t('gathering.rate',{percent:group.regularPercent}):'',group.firstGatherGuaranteed?t('gathering.first-guaranteed'):'',tx(group.acceptedQuest),...(group.extraConditions||[]).map(tx)].filter(Boolean).join(' · '));
 }
 for(const scope of availability){const text=scopeText(scope,ctx);if(text===null)return '';details.push(text);}
 return `${ctx.name(item)} (${[...new Set(details)].join('; ')})`;
}
export function acquisitionSnippet(entry,description,ctx){
 const records=[];
 if(entry.type==='item')for(const row of entry.acquisition||[]){
  const place=ctx.entries.find(e=>e.id===row.locationId);
  records.push(acquisitionText(row,place?ctx.name(place):ctx.tx(row.where),ctx));
 }
 if(entry.type==='location'){
  records.push(...gatheringSupplyRows(entry).map(row=>gatheringText(row,ctx)));
  for(const row of entry.locationSupplies?.shops||[]){
   const item=ctx.entries.find(e=>e.id===row.itemId);if(!item)continue;
   for(const record of item.acquisition||[])if(record.locationId===entry.id&&(record.upgrade||0)===(row.upgrade||0)&&(record.supplyRecord==='shop'||/shop|purchase|trade|exchange/i.test(record.method?.en||'')))records.push(acquisitionText(record,ctx.name(item),ctx));
  }
 }
 const label=ctx.t.locale==='ko'?(entry.type==='item'?'획득처':'얻을 수 있는 아이템'):(entry.type==='item'?'Obtained at':'Items available'),shown=[];
 for(const record of new Set(records.filter(Boolean))){
  if(description.length+label.length+shown.join('; ').length+record.length+8>220)continue;
  shown.push(record);if(shown.length===3)break;
 }
 return shown.length?`${label}: ${shown.join('; ')}`:'';
}
