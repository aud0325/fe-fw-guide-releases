const routes=['cai','dietrich','theodora','leda'];
export const guidanceReferences=text=>[...new Set([...Object.values(text||{}).flatMap(value=>[...value.matchAll(/\{([a-z0-9-]+)\}/g)].map(m=>m[1]))])];
export function groupedRecommendedLevels(scopes){
 const groups=new Map();
 for(const scope of scopes||[]){if(scope.status!=='recommended'||!Number.isFinite(scope.level))continue;const key=scope.part+'|'+scope.level;if(!groups.has(key))groups.set(key,{part:scope.part,level:scope.level,routeIds:[]});if(scope.route)groups.get(key).routeIds.push(scope.route);}
 return [...groups.values()].map(g=>({...g,routeIds:[...new Set(g.routeIds)].sort((a,b)=>routes.indexOf(a)-routes.indexOf(b))}));
}
export function unratedGuidanceRoutes(guidance){
 const scopes=new Map();for(const row of guidance.directions||[])for(const route of row.routeIds||[]){if(!row.part||guidance.recommendedLevels?.some(level=>level.part===row.part&&level.route===route))continue;const key=row.part;if(!scopes.has(key))scopes.set(key,{part:row.part,routeIds:[]});if(!scopes.get(key).routeIds.includes(route))scopes.get(key).routeIds.push(route);}
 return [...scopes.values()];
}
export function guidanceSearchProse(guidance,entries=[]){
 return (guidance?.directions||[]).filter(r=>r.part!==3).flatMap(r=>[...['ko','en'].map(lang=>(r.text[lang]||r.text.en).replace(/\{([a-z0-9-]+)\}/g,(_,id)=>{const e=entries.find(e=>e.id===id);return e?.name[lang]||e?.name.en||'';})),...Object.values(entries.find(e=>e.id===r.destinationId)?.name||r.destinationName||{})]);
}
