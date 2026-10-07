export const clampMapZoom=value=>Math.max(1,Math.min(6,value));
const midpoint=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

// Pointer events keep mouse, pen and multi-touch on the same pan/zoom path.
export function bindMapGestures(viewport,{getZoom,zoomAt,panBy}){
 const pointers=new Map(),listeners=[];
 let moved=false,blockedUntil=0;
 const listen=(target,type,handler,options)=>{
  target.addEventListener(type,handler,options);
  listeners.push(()=>target.removeEventListener(type,handler,options));
 };
 const capture=()=>{
  for(const id of pointers.keys())if(!viewport.hasPointerCapture(id))viewport.setPointerCapture(id);
  viewport.classList.add('is-dragging');
 };
 const finish=event=>{
  if(!pointers.delete(event.pointerId))return;
  if(viewport.hasPointerCapture(event.pointerId))viewport.releasePointerCapture(event.pointerId);
  if(moved)blockedUntil=Date.now()+600;
  if(!pointers.size)viewport.classList.remove('is-dragging');
 };
 viewport.classList.add('is-interactive');
 listen(viewport,'wheel',event=>{
  if(!event.deltaY)return;
  event.preventDefault();
  const unit=event.deltaMode===1?16:event.deltaMode===2?viewport.clientHeight:1;
  const delta=Math.max(-400,Math.min(400,event.deltaY*unit));
  zoomAt(clampMapZoom(getZoom()*Math.exp(-delta*.002)),{x:event.clientX,y:event.clientY});
 },{passive:false});
 listen(viewport,'pointerdown',event=>{
  if(event.button!==0||event.ctrlKey||event.metaKey||event.altKey||event.shiftKey)return;
  if(!pointers.size){moved=false;blockedUntil=0;}
  pointers.set(event.pointerId,{x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY});
  if(pointers.size>1){moved=true;capture();}
 });
 listen(viewport,'pointermove',event=>{
  const previous=pointers.get(event.pointerId);if(!previous)return;
  const before=pointers.size>1?[...pointers.values()].slice(0,2):null;
  const next={...previous,x:event.clientX,y:event.clientY};
  pointers.set(event.pointerId,next);
  if(pointers.size>1){
   const after=[...pointers.values()].slice(0,2),oldDistance=distance(...before);
   if(oldDistance>0)zoomAt(clampMapZoom(getZoom()*distance(...after)/oldDistance),midpoint(...after),midpoint(...before));
  }else{
   if(!moved&&Math.hypot(next.x-next.startX,next.y-next.startY)<6)return;
   const from=moved?previous:{x:next.startX,y:next.startY};
   if(!moved){moved=true;capture();}
   panBy(next.x-from.x,next.y-from.y);
  }
  event.preventDefault();
 },{passive:false});
 for(const type of ['pointerup','pointercancel'])listen(viewport,type,finish);
 // Touch starts with implicit capture on the pressed marker. Transferring it
 // to the viewport bubbles lostpointercapture from that child, not a release.
 listen(viewport,'lostpointercapture',event=>{if(event.target===viewport)finish(event);});
 listen(viewport,'click',event=>{
  if(event.detail&&Date.now()<blockedUntil){event.preventDefault();event.stopImmediatePropagation();}
 },true);
 listen(viewport,'dragstart',event=>event.preventDefault());
 const clear=()=>{
  for(const id of [...pointers.keys()])finish({pointerId:id});
  viewport.classList.remove('is-dragging');
 };
 if(viewport.ownerDocument?.defaultView){
  const win=viewport.ownerDocument.defaultView;
  listen(win,'blur',clear);
  // A press released just outside the border may never cross the drag threshold.
  for(const type of ['pointerup','pointercancel'])listen(win,type,finish);
 }
 return {destroy(){clear();listeners.forEach(remove=>remove());viewport.classList.remove('is-interactive');}};
}
