export const pageSize = 20;
export const skillGroups = {
 personal:['개인 스킬','Personal skills'], unique:['고유 스킬','Unique skills'],
 training:['숙련도 스킬','Proficiency skills'], mastery:['병종 마스터','Class mastery'],
 class:['병종 제공','Class access'], mount:['탈것 제공','Mount access'], unknown:['분류 미확인','Unclassified']
};
export const artGroups = {sword:['검','Sword'],spear:['창','Spear'],axe:['도끼','Axe'],bow:['활','Bow'],gauntlet:['격투','Gauntlet'],general:['공용·지원','General & support'],unknown:['분류 미확인','Unclassified']};
export const spellGroups = {black:['흑마법','Black magic'],white:['백마법','White magic']};
export function labelsForKind(kind){return kind==='spell'?spellGroups:kind==='skill'?skillGroups:artGroups;}
export function categoryOf(row){return row.kind==='spell'?(row.stats.magicSchool||'unknown'):row.category;}
export function groupFamilies(rows,lang='ko'){
 const groups=new Map();
 for(const r of rows){const key=r.family||r.id;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
 const compare=(a,b)=>a.canonicalName.localeCompare(b.canonicalName,'en',{numeric:true});
 return [...groups.values()].map(items=>items.sort((a,b)=>(a.variant==='plus'?1:0)-(b.variant==='plus'?1:0)||compare(a,b))).sort((a,b)=>compare(a[0],b[0]));
}
export function paginate(items,requested=1,size=pageSize){
 const pages=Math.max(1,Math.ceil(items.length/size));const n=Number(requested);
 const page=Math.min(pages,Math.max(1,Number.isFinite(n)?Math.floor(n):1));
 return {items:items.slice((page-1)*size,page*size),page,pages,total:items.length,start:items.length?(page-1)*size+1:0,end:Math.min(page*size,items.length)};
}
export function availableGroups(rows,kind){
 const labels=kind==='skill'?skillGroups:kind==='combat-art'?artGroups:spellGroups;
 return Object.entries(labels).map(([id,label])=>({id,label,rows:rows.filter(r=>r.kind===kind&&categoryOf(r)===id)})).filter(g=>g.rows.length);
}
export function normalizeCategory(rows,kind,requested){const gs=availableGroups(rows,kind);return gs.some(g=>g.id===requested)?requested:gs[0]?.id||'unknown';}
