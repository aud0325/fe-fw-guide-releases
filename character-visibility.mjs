import {classReference} from './class-reference.generated.mjs';
import {retiredCharacterIds} from './retired-characters.generated.mjs';
const retired=new Set(retiredCharacterIds);
export const isRetiredCharacterId=id=>retired.has(id);
export const isRetiredCharacter=entry=>!!entry&&entry.type==='character'&&isRetiredCharacterId(entry.id);
// Full source records remain in the private catalog; no independent public profiles.
export function publicEntryRecord(entry){
 const {mealPreferences,mealPreferenceScope,giftCategoryReports,playPreferenceRows,...record}=entry;
 if(record.type==='class'&&classReference[record.id])record.sourceIds=[...new Set([...(record.sourceIds||[]),...classReference[record.id].sourceIds])];
 if(record.activityPreferences){const {plays,...preferences}=record.activityPreferences;if(preferences.temples?.length)record.activityPreferences=preferences;else delete record.activityPreferences;}
 if(record.links)record.links=record.links.filter(link=>!isRetiredCharacterId(link.to));
 // Review history, capture provenance and editorial reasoning stay in the private catalog.
 // No public renderer reads these, and none of them carries a citation shown on a page.
 for(const key of reviewOnlyKeys)delete record[key];
 for(const [key,fields]of Object.entries(reviewOnlyFields)){
  if(!record[key])continue;
  const strip=value=>Object.fromEntries(Object.entries(value).filter(([field])=>!fields.includes(field)));
  record[key]=Array.isArray(record[key])?record[key].map(strip):strip(record[key]);
 }
 // Name evidence keeps what pages use: the cited source and, for Korean names, the faction section.
 for(const key of nameEvidenceKeys)if(record[key])record[key]=citationOnly(record[key],key==='koreanNameEvidence'?['section']:[]);
 return record;
}
const reviewOnlyKeys=['mapAccess','koreanNameHistory','materialObservations','mapGatheringType','englishNamePending','videoNameEvidence','weaponExpansionEvidence','characterMissing','koreanNameEvidenceHistory','farmingReports','mountObservations','previousKoreanNameEvidence','mountFoodEvidence','favoriteFoodObservation','permanentStatBoost','communityName','tags','mountFoodEvidenceHistory','routeUsageReport','nameEvidence','scopeEvidence','acquisitionEvidence'];
const reviewOnlyFields={
 beginnerGuide:['alternative','reason','caution','futureNote','startNote','reviewedSkillIds','futureMode','kind','extraAlternative'],
 skillTrainingReview:['reason','caution','abilityIds','kind'],
 gatheringSheet:['firstVisit'],
 battalionRecruitment:['unscoped'],
 battalion:['fieldSources']
};
const nameEvidenceKeys=['koreanNameEvidence','englishNameEvidence','japaneseNameEvidence','weaponNameEvidence','placeNameEvidence','itemIdentityEvidence','textAliasEvidence'];
function citationOnly(value,keep){
 if(Array.isArray(value))return value.map(item=>citationOnly(item,keep));
 if(!value||typeof value!=='object')return value;
 return Object.fromEntries(Object.entries(value).filter(([key])=>key==='sourceIds'||/sourceId$/i.test(key)||keep.includes(key)));
}
