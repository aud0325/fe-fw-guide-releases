// Original entries and relationships are retained in private research.
export const locationIdAliases={'mount-orgus-trail':'map-ogers-mountain-road','rear-mountain-path':'map-back-mountain-road','giants-mount':'map-giant-s-hill','video-boman-pass':'collection-bodan-pass'};
export const canonicalLocationId=id=>locationIdAliases[id]||id;
export const retiredLocationIds=new Set(['saveilon','dagdan-empire','kingdom-of-arago','kingdom-of-brezarant','kingdom-of-saramis','ribeira','bafosgu','sidonia','brigid','shopping-arcade','arena',...Object.keys(locationIdAliases)]);
export const locationRedirects={saveilon:{type:'map',mapProvince:'saveilon'},...Object.fromEntries(Object.entries(locationIdAliases).map(([oldId,id])=>[oldId,{type:'location',id}]))};
function resolveLocationReferences(value){
 if(Array.isArray(value))return value.map(resolveLocationReferences);
 if(!value||typeof value!=='object')return value;
 const result={};
 for(const [key,item] of Object.entries(value)){
  if(['to','locationId','placeId'].includes(key)&&typeof item==='string'){
   result[key]=canonicalLocationId(item);
   if(result[key]!==item)result.reportedLocationId=value.reportedLocationId||item;
  }else if(['locationIds','placeIds'].includes(key)&&Array.isArray(item))result[key]=[...new Set(item.map(canonicalLocationId))];
  else result[key]=resolveLocationReferences(item);
 }
 return result;
}
export function applyLocationReview(merged,sources){
 for(const [oldId,id] of Object.entries(locationIdAliases)){
  const original=merged.get(oldId),target=merged.get(id);
  if(!original||!target)throw Error('Missing reviewed location merge: '+oldId);
  target.aliases=[...new Set([...(target.aliases||[]),original.name.ko,original.name.ko.replace(/\([^)]*\)$/,'').trim(),original.name.en,...(original.aliases||[])])];
  target.sourceIds=[...new Set([...target.sourceIds,...original.sourceIds])];
  target.links=[...(target.links||[]),...(original.links||[])];
 }
 for(const id of retiredLocationIds)merged.delete(id);
 for(const [id,original] of merged){
  const entry=resolveLocationReferences(original);
  if(entry.links)entry.links=entry.links.filter(link=>!retiredLocationIds.has(link.to));
  if(entry.type==='location'&&entry.region==='Nation'&&entry.mapProvince)entry.region=entry.mapProvince.ko;
  merged.set(id,entry);
 }
 // Public provider label for the same private transcript; no recording metadata.
 sources['provided-balor-name']={title:{ko:'제공 자료 · 발로르 신전 명칭',en:'Provided material · Temple of Balor name'},kind:'reference'};
 const balor=merged.get('temple-of-balor');
 balor.sourceIds=[...new Set([...balor.sourceIds,'provided-balor-name'])];
}
