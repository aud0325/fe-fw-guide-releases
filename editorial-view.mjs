import {localized} from './locales/index.mjs';

// Keep archived reward records addressable without advertising them as walkthroughs.
export const isDiscoverable=e=>e.type!=='quest';
export const isArchivedState=(state,entries)=>state.type==='quest'||entries.some(e=>e.id===state.id&&!isDiscoverable(e));
const locationTitles={
 'temple-of-balor-dungeon-chests-inside-the-temple':{ko:'발로르 신전 · 던전 보물상자',en:'Temple of Balor · Dungeon chests'},
 'dagsion-sewers-chapter-2-visit-the-more-notable-of-two-chests':{ko:'다그시온 하수도 · 2장 보물상자',en:'Dagsion Sewers · Chapter 2 chest'}
};
export function entryDisplayName(e,lang='ko'){
 if(locationTitles[e.id])return localized(locationTitles[e.id],lang);
 const value=localized(e.name,lang),suffix=`(${e.name.en})`;
 return lang==='ko'&&value.endsWith(suffix)?value.slice(0,-suffix.length).trim():value;
}
export function groupedRelations(links){
 const groups=new Map();
 for(const link of links){
  if(!groups.has(link.to))groups.set(link.to,{to:link.to,labels:[]});
  const group=groups.get(link.to);
  if(!group.labels.some(label=>label.ko===link.label.ko&&label.en===link.label.en))group.labels.push(link.label);
 }
 return [...groups.values()];
}
// Only merge known equivalent fields with identical values; keep conflicting reports.
export function consolidateFacts(facts){
 const pairs=[['mount-stats-ko','namu-stats'],['capture-jp','game8-capture']];
 const result=facts.map(f=>({...f,sourceIds:[f.sourceId]}));
 const normalized=f=>String(f.value).replace(/[\s·・]/g,'');
 for(const [oldKey,newKey] of pairs){
  const older=result.find(f=>f.key===oldKey),newer=result.find(f=>f.key===newKey);
  if(older&&newer&&normalized(older)===normalized(newer)){
   newer.sourceIds=[...new Set([...newer.sourceIds,...older.sourceIds])];
   result.splice(result.indexOf(older),1);
  }
 }
 return result;
}
