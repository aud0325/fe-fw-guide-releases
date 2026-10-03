import {mapNodes,mapProvinces,mapMeta} from './part1-map.generated.mjs';
import {normalize} from './core.mjs';
import {englishText} from './locales/english-text.mjs';
import {acquisitionRecords} from './acquisition-map.mjs';
export {mapNodes,mapProvinces,mapMeta};
export const mapKinds=['hub','town','temple','dungeon','station','gate','gathering'];
export function filterMapNodes({mapQuery='',mapProvince='',mapKind=''}={}){
 const tokens=mapQuery.trim().split(/\s+/).map(normalize).filter(Boolean);
 return mapNodes.filter(n=>{
  const p=mapProvinces.find(p=>p.id===n.province);
  const text=normalize([n.ko,n.en,englishText(n.en||n.ko),...n.aliases,p?.ko,p?.en].filter(Boolean).join(' '));
  return (!mapProvince||n.province===mapProvince)&&(!mapKind||n.kind===mapKind)&&tokens.every(q=>text.includes(q));
 });
}
export function mapAcquisitions(entries,node){
 if(!node?.entryId)return [];
 const results=[];
 for(const item of entries.filter(e=>e.type==='item'||e.type==='mount')){
  const records=acquisitionRecords(item,entries).filter(r=>r.locationId===node.entryId);
  if(records.length)results.push({item,records});
 }
 return results;
}
export function itemMapNodes(item,entries){
 return mapNodes.filter(n=>mapAcquisitions(entries,n).some(r=>r.item.id===item.id));
}
export const mapPointForEntry=id=>mapNodes.find(n=>n.entryId===id);
