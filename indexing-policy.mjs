import {isDiscoverable,isArchivedState} from './editorial-view.mjs';

// Reviewed on 2026-10-30. Restore indexing only after reviewing added content.
// These records remain available in the catalog, search and related links.
export const noindexEntryGroups={
 character:[
  'breza','cohen','drake','ianuarius','lyrah','nero','whill','zenon','cleobulus',
  'hilaria','katarina','karina','myson','nuwa','tsiskaridze','elfrida','flayn',
  'hedda','jiang','kleitos','lamine','maurice','nemesis','seiros','tabatha','thales','vritra',
  'castor','long','solel','anna','maria'
 ],
 item:[
  'bau-manure','horse-manure','ornius-manure','pegasus-manure',
  'sandbael-tails','spellcasters-relics','violet-brooch',
  'headbutt','great-stinger','water-strike','trunk-attack',
  'lashing-rapture','video-kokomini'
 ],
 mount:['ornius'],
 location:[]
};
export const noindexEntryIds=new Set(Object.values(noindexEntryGroups).flat());
export const isIndexableEntry=entry=>isDiscoverable(entry)&&!noindexEntryIds.has(entry.id);
export const isNoindexState=(state,entries)=>isArchivedState(state,entries)||noindexEntryIds.has(state.id);
