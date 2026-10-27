import {isDiscoverable,isArchivedState} from './editorial-view.mjs';

// Reviewed on 2026-10-27. Restore indexing only after reviewing added content.
// These records remain available in the catalog, search and related links.
export const noindexEntryGroups={
 character:[
  'breza','cohen','drake','ianuarius','lyrah','nero','whill','zenon','cleobulus',
  'hilaria','katarina','karina','myson','nuwa','tsiskaridze','elfrida','flayn',
  'hedda','jiang','kleitos','lamine','maurice','nemesis','seiros','tabatha','thales','vritra'
 ],
 item:[
  'bau-manure','castalia-map','elektra-map','extra-large-bullion','gift-box',
  'horse-manure','large-bullion','lucky-coin','mature-blush','megrez-soil','melias-map',
  'ornius-manure','pegasus-manure','sandbael-tails','saveilon-map','spellcasters-relics',
  'violet-brooch','beast-claw','headbutt','great-stinger','water-strike','trunk-attack'
 ],
 location:['temple-of-balor']
};
export const noindexEntryIds=new Set(Object.values(noindexEntryGroups).flat());
export const isIndexableEntry=entry=>isDiscoverable(entry)&&!noindexEntryIds.has(entry.id);
export const isNoindexState=(state,entries)=>isArchivedState(state,entries)||noindexEntryIds.has(state.id);
