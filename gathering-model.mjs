const routes=['cai','dietrich','theodora','leda'];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const identity=r=>r.itemId||r.name?.en;
function matchingScope(record,scope){
 if(record.part!==scope.part)return false;
 if(scope.part===3)return !record.route&&!record.routeIds?.length;
 const known=record.route?[record.route]:record.routeIds;
 return known?.includes(scope.route)||false;
}
export function enrichedGatheringScopes(record,availability=[]){
 return (record.scopes||[]).map(scope=>{
  const extraConditions=availability.filter(a=>a.condition&&matchingScope(a,scope)).map(a=>a.condition).filter((v,i,all)=>all.findIndex(x=>same(x,v))===i);
  return {...scope,...(extraConditions.length?{extraConditions}:{})};
 });
}
function remainingAvailability(availability,scopes){
 return availability.flatMap(a=>{
  const known=scopes.filter(s=>s.part===a.part),conditionCovered=!a.condition||known.some(s=>s.extraConditions?.some(c=>same(c,a.condition)));
  if(!conditionCovered)return [a];
  const requested=a.route?[a.route]:a.routeIds;
  if(requested?.length){const remaining=requested.filter(route=>!known.some(s=>s.route===route));return remaining.length?[{...a,routeIds:remaining,route:undefined}]:[];}
  return known.length&&(a.part===3||routes.every(route=>known.some(s=>s.route===route)))?[]:[a];
 });
}
export function gatheringSupplyRows(place){
 const pending=new Map((place.gatheringConditions||[]).map(r=>[identity(r),r]));
 const rows=(place.locationSupplies?.gathering||[]).map(old=>{
  const record=pending.get(identity(old));if(!record)return old;pending.delete(identity(old));
  const gatheringScopes=enrichedGatheringScopes(record,old.availability);
  return {...old,gatheringScopes,availability:remainingAvailability(old.availability,gatheringScopes)};
 });
 for(const record of pending.values())rows.push({...record,gatheringScopes:enrichedGatheringScopes(record),availability:[]});
 return rows;
}
export function gatheringAcquisitionRecords(entry,entries){
 if(entry.type!=='item')return [];
 return (entry.gatheringConditions||[]).map(record=>{
  const place=entries.find(e=>e.id===record.locationId),prior=place?.locationSupplies?.gathering.find(r=>r.itemId===entry.id),gatheringScopes=enrichedGatheringScopes(record,prior?.availability),parts=[...new Set(gatheringScopes.map(s=>s.part))];
  return {locationId:record.locationId,method:{ko:'채집',en:'Gathering'},supplyRecord:'gathering',gatheringScopes,sourceId:gatheringScopes[0].sourceId,...(parts.length===1?{part:parts[0]}:{})};
 });
}
export function coveredGatheringRecord(record,scopes){
 const method=typeof record.method==='object'?record.method.en:record.method;
 if(record.gatheringScopes||!(record.supplyRecord==='gathering'||/^(gathering|loot)$/i.test(method||'')))return false;
 if(record.chapter!=null||record.fromChapter!=null||record.materials?.length||record.price!=null||record.stock!=null||record.upgrade||record.dungeonChest||record.promotionItem||record.quantity!=null||record.status==='inferred')return false;
 const relevant=scopes.filter(s=>!record.part||record.part===s.part);
 if(!relevant.length)return false;
 const requested=record.observedRoute||record.route;
 if(requested&&typeof requested!=='string')return false;
 const requestedRoutes=requested?[requested]:record.routeIds;
 const covered=requestedRoutes?.length?requestedRoutes.every(route=>relevant.some(s=>s.route===route)):!record.part||record.part===3||routes.every(route=>relevant.some(s=>s.route===route));
 if(!covered)return false;
 return !record.condition||relevant.some(s=>s.extraConditions?.some(c=>same(c,record.condition)));
}
const meaning=r=>JSON.stringify([r.kind,r.regularPercent,r.firstGatherGuaranteed,r.acceptedQuest||null,r.extraConditions||[]]);
export function groupedGatheringScopes(scopes){
 const grouped=new Map();
 for(const scope of scopes){const key=scope.part+'|'+meaning(scope);if(!grouped.has(key))grouped.set(key,{...scope,parts:[scope.part],routeIds:[]});const group=grouped.get(key);if(scope.route&&!group.routeIds.includes(scope.route))group.routeIds.push(scope.route);}
 const result=[];
 for(const group of grouped.values()){
  group.routeIds.sort((a,b)=>routes.indexOf(a)-routes.indexOf(b));
  const routeKey=group.routeIds.length===routes.length?'':group.routeIds.join('|'),previous=result.find(g=>meaning(g)===meaning(group)&&(g.routeIds.length===routes.length?'':g.routeIds.join('|'))===routeKey);
  if(previous){previous.parts=[...new Set([...previous.parts,...group.parts])].sort();}
  else result.push(group);
 }
 return result;
}
