// A source union records how an entry was built. Detail citations follow the
// current fields instead; originals and superseded reports stay in the catalog.
const privateKeys=new Set(['baseStats','giftCategoryReports','mealPreferences','mealPreferenceScope','playPreferenceRows','skillTrainingReview','farmingReports']);
// These inputs also provide names and summary effects without per-field IDs.
const entryLevelSources={character:['fe-characters'],class:['fe-classes'],item:['fe-weapons','wip-items-expansion-20261029','yuphas-items-expansion-20261029'],mount:['namu-animals']};
const unboundEntrySources={cai:['official'],dietrich:['official'],theodora:['official'],leda:['official'],dagsion:['official','namu','namu-dagda','namu-dagsion'],'temple-of-balor':['provided-balor-name']};
function ids(value){
 const result=new Set();
 function visit(node){if(!node||typeof node!=='object')return;for(const [key,item]of Object.entries(node)){if(key==='sourceIds'&&Array.isArray(item))item.forEach(id=>result.add(id));else if(/sourceId$/i.test(key)&&typeof item==='string')result.add(item);else visit(item);}}
 visit(value);return [...result];
}
export function currentReferenceValue(value){
 if(Array.isArray(value))return value.map(currentReferenceValue);
 if(!value||typeof value!=='object')return value;
 const entry=typeof value.id==='string'&&typeof value.type==='string';
 const result={};
 for(const [key,item]of Object.entries(value)){
  if(privateKeys.has(key)||/history|^previous|alternatives$/i.test(key)||key==='reports'&&Array.isArray(value.ranks))continue;
  if(entry&&key==='sourceIds')continue;
  if(key==='translationSourceId'&&(value.koreanNameEvidence?.sourceId||value.itemId&&value.preference))continue;
  if(entry&&value.beginnerGuide&&key==='trainingGuide')continue;
  if(key==='activityPreferences'&&item){const {plays,...shown}=item;result[key]=currentReferenceValue(shown);continue;}
  if(entry&&key==='facts'){
   result[key]=currentReferenceValue(item.filter(f=>{
    if(value.type==='character'&&value.recruitment&&['ability','personal-ko','namu-personal-skill'].includes(f.key))return false;
    if(value.origin&&f.key==='unique-possession')return false;
    if(value.type==='mount'&&/^(?:food$|food-guide|food-correction|capture-|mount-stats|mount-skills|namu-|game8-(?:bait|capture|acquisition|scope|food-conflict))/.test(f.key)){
     return f.key==='namu-category'&&!value.mountDetails?.category||['namu-stats','mount-stats-ko'].includes(f.key)&&!value.mountDetails?.modifiers?.values||['food','food-guide','namu-bait','game8-bait','food-correction'].includes(f.key)&&!value.preferredFood;
    }
    return true;
   }));continue;
  }
  result[key]=currentReferenceValue(item);
 }
 if(entry){
  const nested=ids(result),roots=value.sourceIds||[];
  // Battalion/gambit ranks and some simple items were sourced as whole tables,
  // with no source on each numeric cell. Keep those real table-level citations.
  const tableOnly=value.battalion||value.gambit||!nested.length;
  const foundational=new Set([...(entryLevelSources[value.type]||[]),...(unboundEntrySources[value.id]||[])]);
  result.sourceIds=tableOnly?roots:roots.filter(id=>foundational.has(id));
 }
 return result;
}
export const currentReferenceIds=value=>ids(currentReferenceValue(value));
