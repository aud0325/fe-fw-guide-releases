import * as integration from './integration-data.mjs';
import {abilitySlugCatalog} from './ability-slugs.generated.mjs';
const pathIds={...Object.fromEntries(Object.entries(abilitySlugCatalog.slugs).map(([id,slug])=>[slug,id])),...abilitySlugCatalog.aliases};
export function canonicalAbilityId(id){
 const seen=new Set();
 const next=value=>Object.hasOwn(pathIds,value)?pathIds[value]:Object.hasOwn(integration.abilityIdAliases||{},value)?integration.abilityIdAliases[value]:null;
 while(next(id)){
  if(seen.has(id))throw Error('Cyclic ability identity: '+id);
  seen.add(id);id=next(id);
 }
 return id;
}
export const abilitySlug=id=>{const canonical=canonicalAbilityId(id);return Object.hasOwn(abilitySlugCatalog.slugs,canonical)?abilitySlugCatalog.slugs[canonical]:id;};
