import {escapeHtml as esc} from './core.mjs';
import {pagePath} from './routing.mjs';
import {entryIconMedia} from './entity-media.mjs';

// Hide only redundant generic capture descriptions; raw evidence is preserved.
export function visibleMountRecords(records,entry){
 const scoped=records.filter(r=>r.mountSource==='scoped-location');
 return records.filter(r=>{
  if(entry?.id==='red-falicorn'&&entry.acquisition.some(a=>a.mountSource==='scoped-location'&&a.part===3)&&r.sourceId==='dc-762882'&&r.where?.en==='Coast across the sea'&&r.condition?.en==='Capture reported in the post; exact location and availability are unconfirmed.')return false;
  if(!scoped.length)return true;
  if(['game8-jp-816904','dc-758284'].includes(r.conditionSourceId))return false;
  if(r.sourceId==='administrator-cai-observations'&&r.part===1&&r.observedRoute==='cai'&&r.condition?.en==='Cai route'&&scoped.some(n=>n.part===1&&n.route==='cai'))return false;
  return true;
 });
}
export const mountCaptureAnchor=(mountId,part)=>'mount-capture-'+mountId+'-'+part;
export function groupedCaptureRecords(records){
 const out=[],groups=new Map();
 for(const r of records){
  if(r.mountSource!=='scoped-location'||!r.route){out.push(r);continue;}
  const {route,...scope}=r,key=JSON.stringify(scope),prior=groups.get(key);
  if(prior){prior.routeIds=[...new Set([...(prior.routeIds||[prior.route]),route])];delete prior.route;}
  else {const copy={...r};groups.set(key,copy);out.push(copy);}
 }
 return out;
}
export function locationMountCaptures(e,{t,name,entries,routes,base='/'}){
 if(!e.mountCaptures?.length)return '';
 const groups=new Map();
 for(const row of e.mountCaptures){const key=mountCaptureAnchor(row.mountId,row.part),prior=groups.get(key);if(prior){if(row.route&&!prior.routeIds.includes(row.route))prior.routeIds.push(row.route);}else groups.set(key,{...row,routeIds:row.route?[row.route]:[]});}
 const rows=[...groups.values()];
 const table=values=>`<div class="table-wrap location-supply-table"><table><colgroup><col class="location-supply-name"><col></colgroup><thead><tr><th scope="col">${t('mount.capture.mount')}</th><th scope="col">${t('mount.capture.period')}</th></tr></thead><tbody>${values.map(row=>{
  const mount=entries.find(e=>e.id===row.mountId),icon=entryIconMedia(mount),routeNames=row.routeIds.map(id=>routes.find(r=>r[0]===id)).filter(Boolean).map(r=>t(r[1],r[2]));
  return `<tr id="${mountCaptureAnchor(row.mountId,row.part)}" tabindex="-1"><th scope="row"><a class="mount-capture-link" href="${esc(pagePath({id:mount.id},t.locale,base)+(row.part===3?'#mount-acquisition-part-3':'#entry-acquisition'))}">${icon?`<img src="${esc(icon.src)}" width="20" height="20" alt="" loading="lazy" decoding="async">`:''}<span>${esc(name(mount))}</span></a></th><td>${esc([t('dungeon.part',{part:row.part}),...routeNames].join(' · '))}</td></tr>`;
 }).join('')}</tbody></table></div>`;
 const current=rows.filter(r=>r.part!==3),later=rows.filter(r=>r.part===3);
 return `<section class="location-supplies mount-captures" id="section-mount-captures" tabindex="-1"><h2>${t('mount.capture.title')}</h2>${current.length?table(current):''}${later.length?`<details class="location-supply-later"><summary>${t('mount.capture.later')}</summary>${table(later)}</details>`:''}</section>`;
}
