// A generic source placeholder is not an additional unlock requirement.
// Keep every specific alternative, including rank, level, initial and access routes.
export function visibleAbilityRelations(row){
 const emptyImport=r=>!r.id&&r.type==='unknown'&&(r.routes?.length?r.routes:[r]).every(s=>s.method==='mount-active'&&s.friendshipLevel==null&&s.level==null&&s.rank==null&&!s.condition&&!s.variantScope);
 return row.relations.filter(r=>!emptyImport(r)||!row.relations.some(known=>known.id&&known.type==='mount'));
}
export function abilityConditionRoutes(relation){
 const routes=relation.routes?.length?relation.routes:[relation];
 const placeholder=r=>['unknown','character-specific-unknown','proficiency'].includes(r.method)&&!r.proficiency&&r.rank==null&&r.level==null&&r.friendshipLevel==null&&!r.variantScope;
 const specific=routes.some(r=>r.rank!=null||r.level!=null||r.friendshipLevel!=null||r.variantScope||['personal','initial-possession','overblaze','class-active','class-mastery','mount-active','item-use','equipment-granted','quest-reward'].includes(r.method));
 return specific?routes.filter(r=>!placeholder(r)):routes;
}
