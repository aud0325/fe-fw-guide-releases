import {mapMarkerKinds,gatheringTypes} from './part1-map.mjs';

export const defaultHiddenMapKinds=['gate','banquet'];
const collecting=gatheringTypes.map(type=>'gathering-'+type);
// Keep older whole-gathering snapshots compatible with the material controls.
export function bindMapLegend(host,{hiddenKinds=defaultHiddenMapKinds}={}){
 const hidden=new Set(hiddenKinds.flatMap(kind=>kind==='gathering'?collecting:mapMarkerKinds.includes(kind)?[kind]:[])),listeners=[];
 const controls=[...host.querySelectorAll('[data-map-toggle-kind]')];
 const points=new Map(mapMarkerKinds.map(kind=>[kind,[...host.querySelectorAll('.part1-point[data-map-kind="'+kind+'"]')]]));
 function sync(){
  for(const input of controls){
   const kind=input.dataset.mapToggleKind;
   input.disabled=false;
   if(kind==='gathering'){
    const count=collecting.filter(type=>!hidden.has(type)).length;
    input.checked=count>0;input.indeterminate=count>0&&count<collecting.length;
   }else input.checked=!hidden.has(kind);
  }
 }
 function setVisible(kind,visible){
  const kinds=kind==='gathering'?collecting:mapMarkerKinds.includes(kind)?[kind]:[];
  for(const type of kinds){
   if(visible)hidden.delete(type);else hidden.add(type);
   for(const point of points.get(type))point.hidden=!visible;
  }
  sync();
 }
 for(const kind of mapMarkerKinds)for(const point of points.get(kind))point.hidden=hidden.has(kind);
 sync();
 for(const input of controls){
  const change=()=>setVisible(input.dataset.mapToggleKind,input.checked);
  input.addEventListener('change',change);listeners.push(()=>input.removeEventListener('change',change));
 }
 return {show:kind=>setVisible(kind,true),snapshot:()=>mapMarkerKinds.filter(kind=>hidden.has(kind)),destroy(){listeners.forEach(remove=>remove());}};
}
