import {reviewedItemAliases} from './item-identities.generated.mjs';
// Earlier IDs remain valid route aliases; identity decisions retain their own evidence.
export const legacyItemAliases={'video-odd-monju':'oda-monja','observed-golden-basho':'jin-ba-jiao'};
export const itemIdAliases={...legacyItemAliases,...reviewedItemAliases};
export const canonicalItemId=id=>itemIdAliases[id]?canonicalItemId(itemIdAliases[id]):id;
export function resolveItemReferences(value){
 if(Array.isArray(value))return value.map(resolveItemReferences);
 if(!value||typeof value!=='object')return value;
 return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,['id','item','itemId','candidateItemId','to','foodItemId'].includes(key)&&typeof item==='string'?canonicalItemId(item):resolveItemReferences(item)]));
}
