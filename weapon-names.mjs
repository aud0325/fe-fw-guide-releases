import {weaponNameData} from './weapon-names.generated.mjs';
// Improve provisional Korean labels only. Neither a blog translation nor a
// Japanese identity match establishes an official Korean localization.
export function applyWeaponNames(db,sources){
 Object.assign(sources,weaponNameData.sources);
 const applied=[];
 for(const row of weaponNameData.mappings){
  if(row.status!=='matched')continue;
  const e=db.get(row.id);if(!e||e.type!=='item')throw Error('Missing weapon-name target: '+row.id);
  const before=e.name.ko,provisional=e.translation==='provisional';
  e.aliases=[...new Set([...e.aliases,before,before.replace(`(${e.name.en})`,''),row.ko,row.jp])];
  e.weaponNameEvidence={sourceId:row.sourceId,jpSourceId:row.jpSourceId,blogId:row.blogId,ko:row.ko,jp:row.jp,method:row.method,checked:'2026-09-29',officialKorean:false,...(row.note?{note:row.note}:{})};
  e.sourceIds=[...new Set([...e.sourceIds,row.sourceId,...(row.jpSourceId?[row.jpSourceId]:[])])];
  if(provisional){
   e.name={...e.name,ko:`${row.ko}(${e.name.en})`};
   e.translationSourceId=row.sourceId;
   e.koreanNameEvidence={...e.weaponNameEvidence,status:'provisional'};
  }
  // Two user-confirmed weapons lost their index-only type in the earlier audit.
  // Their type is now corroborated by the Japanese weapon table, without stats.
  if(!e.category&&row.jpSourceId){
   e.category=row.category;e.categorySourceId=row.jpSourceId;
   e.facts.push({key:'category',label:{ko:'분류',en:'Category'},value:row.category,sourceId:row.jpSourceId});
  }
  applied.push({id:e.id,before,after:e.name.ko,action:provisional?'provisional-label':'alias-only'});
 }
 return applied;
}
