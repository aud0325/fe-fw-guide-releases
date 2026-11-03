import {classReference} from './class-reference.generated.mjs';
// Preserve original records; use the reviewed class associations in every renderer.
export function reviewedClassAbility(row){
 const relations=row.relations.flatMap(relation=>{
  const p=relation.type==='class'?classReference[relation.id]:null;if(!p)return [relation];
  const routes=(relation.routes||[relation]).filter(route=>route.method==='class-active'?p.abilityIds.includes(row.id):route.method==='class-mastery'?p.masteryIds.includes(row.id):true);
  if(!routes.length)return [];
  return routes.length===(relation.routes||[relation]).length?[relation]:[{...relation,...routes[0],routes}];
 });
 return relations.length===row.relations.length&&relations.every((r,i)=>r===row.relations[i])?row:{...row,relations};
}
