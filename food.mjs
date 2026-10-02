export const flavors={sweet:{ko:'단맛',en:'Sweet'},spicy:{ko:'매운맛',en:'Spicy'},bitter:{ko:'쓴맛',en:'Bitter'},delicacy:{ko:'진미',en:'Delicacy'},salty:{ko:'짠맛',en:'Salty'},unknown:{ko:'맛 미확인',en:'Flavor undocumented'}};
export const foodKinds={plant:{ko:'채소·식물',en:'Vegetables & plants'},fish:{ko:'물고기',en:'Fish'},meat:{ko:'고기',en:'Meat'}};
export const foodFactKeys=['food','food-guide','namu-bait','game8-bait'];
export const normalizeItemFlavor=value=>Object.hasOwn(flavors,value)?value:'';
export const ingredientFlavorId=e=>e.ingredientFlavor?.flavor||'unknown';
export function preferredMountFood(e){
 const reports=mountFoodReports(e);
 return reports.find(r=>r.reports.some(source=>source.key==='food-guide'))||reports[0]||null;
}
export function mountFoodReports(e){
 const ordered=['food-guide','game8-bait','namu-bait','food'].flatMap(key=>(e.facts||[]).filter(f=>f.key===key));
 const rows=[];
 for(const f of ordered){
  const value=f.valueKo||f.value;
  const kind=/채소|야채|野菜/.test(value)?'plant':/물고기|생선|魚/.test(value)?'fish':/고기|肉/.test(value)?'meat':null;
  const flavor=/단맛|甘味|Sweet/i.test(value)?'sweet':/매운맛|辛[み味]|Spicy/i.test(value)?'spicy':/쓴맛|苦味|Bitter/i.test(value)?'bitter':/진미|珍味|Delicacy/i.test(value)?'delicacy':'unknown';
  rows.push({kind,flavor,sourceId:f.sourceId,uncertain:/uncertain/i.test(value),key:f.key});
 }
 const knownKind=rows.find(r=>r.kind)?.kind;
 const combined=[];
 for(const row of rows){
  const kind=row.kind||knownKind||null;
  // An omitted flavor is not a contradictory report.
  if(row.flavor==='unknown'&&rows.some(r=>r.flavor!=='unknown'&&r.kind===kind))continue;
  const same=combined.find(r=>r.kind===kind&&r.flavor===row.flavor);
  if(same)same.reports.push(row);else combined.push({kind,flavor:row.flavor,reports:[row]});
 }
 return combined;
}
