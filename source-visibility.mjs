// Recording provenance is retained in local research, not in the public source list.
export const internalSourceIds=new Set(['game-video-20260926','game-flavors-20260926']);
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
