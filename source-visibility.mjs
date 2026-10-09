// Recording provenance is retained in local research, not in the public source list.
export const internalSourceIds=new Set(['game-video-20260926','game-flavors-20260926','game-materials-20261009']);
export const isPublicSource=(id,source)=>Boolean(source)&&!internalSourceIds.has(id);
export function publicCatalogValue(value){
 if(Array.isArray(value))return value.map(publicCatalogValue);
 if(!value||typeof value!=='object')return value;
 const result={};
 for(const [key,item] of Object.entries(value)){
  if(['video','time','snapshot','sha256','baseStats'].includes(key))continue;
  if(key==='sourceIds'){result[key]=item.filter(id=>!internalSourceIds.has(id));continue;}
  if(/sourceId$/i.test(key)&&internalSourceIds.has(item))continue;
  result[key]=publicCatalogValue(item);
 }
 return result;
}

// Keep source records locally; publish only references used by the resolved entries.
export function referencedSources(entries,sources){
 const used=new Set();
 function visit(value){
  if(!value||typeof value!=='object')return;
  for(const [key,item]of Object.entries(value)){
   if(key==='sourceIds'&&Array.isArray(item))item.forEach(id=>used.add(id));
   else if(/sourceId$/i.test(key)&&typeof item==='string')used.add(item);
   else visit(item);
  }
 }
 visit(entries);
 return Object.fromEntries(Object.entries(sources).filter(([id])=>used.has(id)));
}
