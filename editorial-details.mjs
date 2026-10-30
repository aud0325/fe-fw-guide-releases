const positiveMethods=new Set(['material trade','shop purchase','shop listing','gathering','dungeon chest','chest','traveling merchant listing']);
function hasLocatedAcquisition(entry,entries){
 return (entry.acquisition||[]).some(r=>r.sourceId&&r.available!==false&&r.unavailable!==true&&r.condition?.en!=='Inaccessible in Cai’s route'&&positiveMethods.has(String(r.method?.en||r.method||'').toLowerCase())&&entries.some(e=>e.id===r.locationId&&e.type==='location'));
}
function hasKnownAcquisition(entry,entries){
 if(hasLocatedAcquisition(entry,entries))return true;
 return (entry.acquisition||[]).some(r=>{
  const container=r.containerId&&entries.find(e=>e.id===r.containerId&&e.type==='item');
  return container?.crateContents?.some(c=>c.itemId===entry.id)&&hasLocatedAcquisition(container,entries);
 });
}
export function unresolvedMissingFields(entry,entries){
 return (entry.missing||[]).filter(field=>{
  if(field==='Acquisition location')return !hasKnownAcquisition(entry,entries);
  if(field==='Food preference')return !['sweet','spicy','bitter','delicacy'].includes(entry.preferredFood?.flavor);
  if(field==='Recruitment requirements')return !(entry.facts||[]).some(f=>f.key==='joins'&&f.sourceId&&/^Prologue: Descent Chapter \d+$/.test(f.value));
  return true;
 });
}
// Display choices do not clear the private missing-field record.
export function visibleMissingFields(entry,entries){
 return unresolvedMissingFields(entry,entries).filter(field=>{
  if(field==='Acquisition location'&&entry.category==='Strike')return false;
  if(field==='Acquisition location'&&(entry.acquisition||[]).some(r=>r.mountSource==='quest'&&r.method?.en==='Quest reward'&&r.part&&r.where?.en&&r.whereSourceId))return false;
  return true;
 });
}
export const visibleProfileFact=fact=>!(fact.key==='age'&&fact.value==='Unknown');
