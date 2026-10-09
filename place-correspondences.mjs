import {placeReview} from './place-correspondences.generated.mjs';
export const placeNameKey=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[’']/g,'').replace(/\s+/g,' ').trim();
const byName=new Map(),byId=new Map();
for(const place of placeReview.places){
 byId.set(place.id,place);
 for(const id of place.legacyIds)byId.set(id,place);
 for(const name of place.aliases){
  const key=placeNameKey(name),previous=byName.get(key);
  if(previous&&previous.id!==place.id)throw Error('Ambiguous place correspondence: '+name);
  byName.set(key,place);
 }
}
export const reviewedPlace=value=>byId.get(value)||byName.get(placeNameKey(value));
export const placeAliases=id=>byId.get(id)?.aliases||[];
const methods=new Set(placeReview.methodNames.map(placeNameKey));
const errors=new Set(placeReview.sourceErrors.map(placeNameKey));
export function acquisitionContext(record){
 const names=[record.whereKey,...(typeof record.where==='object'?Object.values(record.where):[record.where])].filter(Boolean).map(placeNameKey);
 if(names.some(n=>errors.has(n)))return 'source-error';
 const method=typeof record.method==='object'?record.method.en:record.method;
 if(record.characterId||['Initial equipment','Quest reward','Paralogue reward','Training reward','Traveling merchant purchase'].includes(method)||names.some(n=>methods.has(n)))return 'method';
 return 'place';
}
export function applyPlaceCorrespondences(merged,sources){
 sources['game8-jp-place-817376']={title:'Game8 · ゾトー湖',url:'https://game8.jp/fe-banshisenko/817376',kind:'guide',checked:placeReview.checked};
 for(const place of placeReview.places){
  const entry=merged.get(place.id);if(!entry)throw Error('Missing place entry: '+place.id);
  entry.aliases=[...new Set([...(entry.aliases||[]),...place.aliases])];
  entry.placeNameEvidence={sourceIds:place.sourceIds,checked:placeReview.checked,method:'reviewed-place-correspondence',basis:place.basis};
  entry.sourceIds=[...new Set([...entry.sourceIds,...place.sourceIds])];
 }
}
