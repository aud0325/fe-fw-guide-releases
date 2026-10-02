import {indexReviewEvidence} from './index-review.generated.mjs';
const bi=(ko,en)=>({ko,en});
export const excludedIndexSources=['index-items','index-classes','index-characters'];
const excluded=id=>excludedIndexSources.includes(id);
const labels={category:bi('분류','Category'),recovery:bi('회복량','Recovery'),weight:bi('무게','Weight'),might:bi('위력','Might'),uses:bi('내구도','Uses'),range:bi('사거리','Range'),hit:bi('명중','Hit'),crit:bi('필살','Critical'),rank:bi('요구 랭크','Rank')};
// Run after all source-specific enrichments: a translated label or an unrelated
// citation never validates an index-only number, acquisition row or relationship.
export function applyIndexReview(db,sources){
 Object.assign(sources,indexReviewEvidence.sources);
 const affected=new Set([...db.values()].filter(e=>e.sourceIds.some(excluded)).map(e=>e.id));
 const gifts=new Map();
 for(const e of db.values())for(const g of e.gifts||[]){
  if(!g.itemId||excluded(g.sourceId))continue;
  if(!gifts.has(g.itemId))gifts.set(g.itemId,new Set());gifts.get(g.itemId).add(g.sourceId);
 }
 function clean(value){
  if(!value||typeof value!=='object')return value;
  if(excluded(value.sourceId))return undefined;
  if(Array.isArray(value))return value.map(clean).filter(v=>v!==undefined);
  const result={};for(const [key,v] of Object.entries(value)){
   if(key==='sourceIds'){result[key]=v.filter(id=>!excluded(id));continue;}
   if(key==='referenceUrl'&&v?.includes('fortunesweave.co.uk'))continue;
   const next=clean(v);if(next!==undefined)result[key]=next;
  }return result;
 }
 const removed=[];
 for(const [id,original] of db){
  const e=clean(original);db.set(id,e);
  if(!affected.has(id))continue;
  const evidence=indexReviewEvidence.items[id];
  // Retain only same-field corroboration; existing JP/wiki facts take precedence.
  if(evidence){
   e.sourceIds=[...new Set([...e.sourceIds,evidence.sourceId])];
   const category=e.facts?.find(f=>f.key==='category');
   if(!category){e.category=evidence.category;e.categorySourceId=evidence.sourceId;e.facts.push({key:'category',label:labels.category,value:e.category,sourceId:evidence.sourceId});}
   for(const f of evidence.facts){
    const previous=original.facts?.find(p=>p.key===f.key&&excluded(p.sourceId));
    if(previous?.value===f.value&&!e.facts.some(p=>p.key===f.key))e.facts.push({...f,label:labels[f.key]});
   }
   if(evidence.flavor){
    if(!e.ingredientFlavor)e.ingredientFlavor=evidence.flavor;
    else if(e.ingredientFlavor.flavor!==evidence.flavor.flavor)e.ingredientFlavorReports=[...(e.ingredientFlavorReports||[]),evidence.flavor];
   }
  }
  if(gifts.has(id)){
   e.sourceIds=[...new Set([...e.sourceIds,...gifts.get(id)])];
   if(!e.facts.some(f=>f.key==='category')){e.category='Gift';e.categorySourceId=[...gifts.get(id)][0];}
  }
  if(!e.sourceIds.length){removed.push({id,type:e.type});db.delete(id);continue;}
  // Scalar categories and generic summaries were imported without field citations.
  // Reconstruct their provenance rather than allowing stale index text to survive.
  if(original.facts?.some(f=>['category','tier'].includes(f.key)&&excluded(f.sourceId))){
   const category=e.facts.find(f=>['category','tier'].includes(f.key));
   if(category){e.category=category.value;e.categorySourceId=category.sourceId;}
   else if(!e.categorySourceId)delete e.category;
  }
  if(e.observedFoodKind){e.category=e.observedFoodKind==='fish'?'Fish (ingredient)':'Ingredient';e.categorySourceId=e.ingredientFlavor.sourceId;}
  if(e.status==='unverified')e.status=e.sourceIds.some(s=>sources[s]?.kind==='reference'||sources[s]?.kind==='guide')?'reference':'community';
  if(/English reference index|verification status of individual fields|Named in an item acquisition report|Quest named in the item reward index|Class reference\./.test(e.summary?.en||'')){
   e.summary=bi(`${e.name.ko} · 확인된 참고 자료의 정보만 수록합니다.`,`${e.name.en} · Only information supported by the cited references is included.`);
  }
  if(e.type==='item'){
   const located=e.acquisition?.length||e.links?.some(l=>db.get(l.to)?.type==='location')||e.facts.some(f=>/^game8-item-(gathering|part1|part3)$/.test(f.key));
   e.missing=(e.missing||[]).filter(v=>v!=='Acquisition location');if(!located)e.missing.push('Acquisition location');
  }
 }
 for(const e of db.values()){
  e.links=(e.links||[]).filter(l=>db.has(l.to));
  for(const g of e.gifts||[])if(g.itemId&&!db.has(g.itemId))delete g.itemId;
 }
 const c=db.get('class-caladrius'),review=indexReviewEvidence.caladrius;
 c.sourceIds.push(review.sourceId);
 c.aliases=[...new Set([...c.aliases,'カラドリオス','카라드리우스'])];
 c.referenceUrl=sources[review.sourceId].url;
 c.classStatHistory=[...(c.classStatHistory||[]),structuredClone(c.classStats)];
 c.classStats=structuredClone(review.stats);
 const replaced=new Set(['class-required-ko','ko-require','unlock']);
 c.resolvedFactHistory=[...(c.resolvedFactHistory||[]),...c.facts.filter(f=>replaced.has(f.key))];
 c.facts=c.facts.filter(f=>!replaced.has(f.key));
 for(const [key,label,value,valueKo] of [
  ['class-required-ko',bi('전직 주요 기술 (Game8 JP)','Primary certification skills (Game8 JP)'),'Riding D / Black Magic B','기마술 D / 흑마술 B'],
  ['unlock',bi('해금 조건 (Game8 JP)','Unlock condition (Game8 JP)'),"Cai: complete Castor's lesson at renown 7",'카이편: 명성 7에 받는 카스톨의 지도 「父からの秘密の依頼」 완료'],
  ['absolute-movement',bi('이동력 (Game8 JP)','Movement (Game8 JP)'),String(review.stats.modifiers.absoluteMovement),String(review.stats.modifiers.absoluteMovement)]
 ])c.facts.push({key,label,value,valueKo,literal:true,sourceId:review.sourceId});
 for(const id of excludedIndexSources)delete sources[id];
 return {reviewed:affected.size,removed};
}
