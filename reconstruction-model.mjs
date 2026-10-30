export const reconstructionStorageKey='fw-reconstruction-completed-v1';
export function completedReconstruction(raw,projects){
 try{const value=JSON.parse(raw),valid=new Set(projects.map(p=>p.locationId));return Array.isArray(value)?[...new Set(value.filter(id=>typeof id==='string'&&valid.has(id)))]:[];}catch{return [];}
}
export function remainingReconstruction(projects,completed=[]){
 const done=new Set(completed),remaining=projects.filter(p=>!done.has(p.locationId)),sums=new Map();
 for(const p of remaining)for(const m of p.materials)sums.set(m.itemId,(sums.get(m.itemId)||0)+m.quantity);
 return {remaining:remaining.length,total:projects.length,materials:[...sums].map(([itemId,quantity])=>({itemId,quantity}))};
}
