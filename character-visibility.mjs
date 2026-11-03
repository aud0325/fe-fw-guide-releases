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
 return record;
}
