import * as integration from './integration-data.mjs';
export const canonicalAbilityId=id=>integration.abilityIdAliases?.[id]||id;
