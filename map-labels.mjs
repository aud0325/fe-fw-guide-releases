const nameLevel=zoom=>zoom>=4.5?2:zoom>=3?1:0;

// Names stay anchored below their marker. Pan coordinates and nearby labels
// never change which names appear; the viewport naturally clips its contents.
export function mapLabelIds(points,zoom,{enabled=true}={}){
 const level=enabled?nameLevel(zoom):0;
 return points.filter(p=>level&&!p.hidden&&p.named&&(level===2||p.kind==='hub'||p.kind==='town')).map(p=>p.id);
}

export function bindMapLabels(host,{camera,showNames=true}){
 const control=host.querySelector('[data-map-toggle-names]');
 const points=[...host.querySelectorAll('.part1-point')].map(el=>({el,id:el.dataset.mapPlace,kind:el.dataset.mapKind,named:!el.classList.contains('unidentified')}));
 let disposed=false,previous=new Set(),lastLevel;
 control.checked=showNames;control.disabled=false;
 function update(zoom=camera().zoom){
  if(disposed)return;
  lastLevel=nameLevel(zoom);
  const shown=new Set(mapLabelIds(points.map(p=>({...p,hidden:p.el.hidden})),zoom,{enabled:control.checked}));
  for(const point of points)if(previous.has(point.id)!==shown.has(point.id))point.el.classList.toggle('has-auto-name',shown.has(point.id));
  previous=shown;
 }
 const change=event=>{if(event.target.matches('[data-map-toggle-names],[data-map-toggle-kind]'))update();};
 host.addEventListener('change',change);
 update();
 return {
  schedule(view){if(nameLevel(view.zoom)!==lastLevel)update(view.zoom);},
  refresh:update,
  snapshot:()=>control.checked,
  destroy(){disposed=true;host.removeEventListener('change',change);}
 };
}
