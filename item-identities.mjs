// Reviewed bilingual identities. Earlier IDs remain valid route aliases.
export const itemIdAliases={'video-odd-monju':'oda-monja','observed-golden-basho':'jin-ba-jiao'};
export const canonicalItemId=id=>itemIdAliases[id]||id;
export function resolveItemReferences(value){
 if(Array.isArray(value))return value.map(resolveItemReferences);
 if(!value||typeof value!=='object')return value;
 return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,['itemId','to'].includes(key)&&typeof item==='string'?canonicalItemId(item):resolveItemReferences(item)]));
}
