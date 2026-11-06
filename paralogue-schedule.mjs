export function dateValue(value){const [m,d]=value.split('/').map(Number);return m*100+d;}
export function scheduleRows(list,route='all',order='start'){
 return list.filter(e=>e.schedule).map(e=>({e,windows:Object.entries(e.schedule.routes).filter(([id])=>route==='all'||route===id)})).filter(r=>r.windows.length).sort((a,b)=>{
  if(order==='owner')return a.e.schedule.owner.localeCompare(b.e.schedule.owner);
  const key=row=>Math.min(...row.windows.flatMap(([,v])=>order==='deadline'?[dateValue(v.deadline)]:v.windows.map(w=>dateValue(w[0]))));
  return key(a)-key(b)||a.e.id.localeCompare(b.e.id);
 });
}
