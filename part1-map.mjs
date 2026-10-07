import {mapNodes,mapProvinces,mapMeta,mapCollectibles} from './part1-map.generated.mjs';
import {normalize} from './core.mjs';
import {englishText} from './locales/english-text.mjs';
import {localized} from './locales/index.mjs';
import {acquisitionRecords} from './acquisition-map.mjs';
export {mapNodes,mapProvinces,mapMeta,mapCollectibles};
export const mapKinds=['hub','town','temple','dungeon','station','gate','gathering','banquet'];
export const gatheringTypes=['fish','plant','ore','loot'];
export const mapMarkerKind=n=>n.kind==='gathering'&&n.gatheringType?'gathering-'+n.gatheringType:n.kind;
export const mapMarkerKinds=mapKinds.flatMap(kind=>kind==='gathering'?gatheringTypes.map(type=>'gathering-'+type):[kind]);
const namesForCollectible=c=>[c.ko,c.en,...c.aliases,localized({ko:c.ko,en:c.en||c.ko},'en'),englishText(c.en||c.ko)];
const searchText=new Map(mapNodes.map(n=>{
 const p=mapProvinces.find(p=>p.id===n.province);
 const collectibles=mapCollectibles.filter(c=>c.placeIds.includes(n.id)).flatMap(namesForCollectible);
 return [n.id,normalize([n.ko,n.en,localized({ko:n.ko,en:n.en||n.ko},'en'),englishText(n.en||n.ko),...n.aliases,p?.ko,p?.en,p?localized({ko:p.ko,en:p.en||p.ko},'en'):null,p?englishText(p.en||p.ko):null,...collectibles,...[...(n.details.materials||[]),...(n.details.loot||[])].flatMap(r=>[r.ko,r.en])].filter(Boolean).join(' '))];
}));
export function filterMapNodes({mapQuery='',mapProvince='',mapKind=''}={}){
 const tokens=mapQuery.trim().split(/\s+/).map(normalize).filter(Boolean);
 return mapNodes.filter(n=>{
  const text=searchText.get(n.id);
  return (!mapProvince||n.province===mapProvince)&&(!mapKind||n.kind===mapKind||mapMarkerKind(n)===mapKind)&&tokens.every(q=>text.includes(q));
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
