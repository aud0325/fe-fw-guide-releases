import {entrySlugCatalog} from './entry-slugs.generated.mjs';
const idsBySlug=new Map(Object.entries(entrySlugCatalog.slugs).map(([id,slug])=>[slug,id]));
export const canonicalEntryId=value=>idsBySlug.get(value)||(Object.hasOwn(entrySlugCatalog.aliases,value)?entrySlugCatalog.aliases[value]:value);
export const entrySlug=value=>{
 const id=canonicalEntryId(value);
 return Object.hasOwn(entrySlugCatalog.slugs,id)?entrySlugCatalog.slugs[id]:id;
};
