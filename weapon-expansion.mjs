import {weaponExpansionData as data} from './weapon-expansion.generated.mjs';
export function applyWeaponExpansion(db,sources){
 Object.assign(sources,data.sources);
 for(const entry of data.newEntries){
  if(db.has(entry.id))throw Error('Weapon expansion would overwrite an existing entry: '+entry.id);
  db.set(entry.id,structuredClone(entry));
 }
 const spelling=data.englishCorrection,weapon=db.get(spelling.id);
 weapon.aliases=[...new Set([...weapon.aliases,weapon.name.en,weapon.name.ko,spelling.en])];
 weapon.name={en:spelling.en,ko:weapon.name.ko.replace(`(${weapon.name.en})`,`(${spelling.en})`)};
 weapon.sourceIds=[...new Set([...weapon.sourceIds,spelling.sourceId])];
 weapon.englishNameEvidence={sourceId:spelling.sourceId,method:'updated-wiki-list-spelling',checked:'2026-09-29'};
 for(const [id,ko] of Object.entries(data.requestedWeaponNames)){
  const e=db.get(id);if(!e)throw Error('Missing requested weapon label: '+id);
  e.aliases=[...new Set([...e.aliases,e.name.ko,e.name.ko.replace(/\([^()]*\)$/,''),ko])];
  e.name={...e.name,ko:`${ko}(${e.name.en})`};
  e.translation='provisional';e.translationSourceId=data.userSourceId;
  e.koreanNameEvidence={sourceId:data.userSourceId,method:'user-requested-label',checked:'2026-09-29',officialKorean:false};
  e.sourceIds=[...new Set([...e.sourceIds,data.userSourceId])];
 }
 return {added:data.newEntries.map(e=>e.id),pending:structuredClone(data.pending)};
}
