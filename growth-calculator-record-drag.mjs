import {droppedRecordIds} from './growth-calculator-saves.mjs';

// Pointer events keep the same handle usable with a mouse, pen or touch screen.
export function bindRecordReordering(host,{onMove,onDrop,onHint}){
 const doc=host.ownerDocument,view=doc.defaultView,rowSelector='[data-multi-row],[data-calc-record]';let drag=null,frame=0,ignoreClickUntil=0;
 const key=row=>row.dataset.multiRow||row.dataset.calcRecord;
 const rows=list=>[...list.children].filter(row=>row.matches(rowSelector)&&!row.hidden);
 const clearMark=()=>host.querySelectorAll('.calc-drop-before,.calc-drop-after').forEach(row=>row.classList.remove('calc-drop-before','calc-drop-after'));
 const movePreview=active=>{
  if(!active.preview)return;const origin=active.portal===doc.body?{left:0,top:0}:active.portal.getBoundingClientRect();
  active.preview.style.transform=`translate3d(${active.x-active.offsetX-origin.left-(active.portal.clientLeft||0)}px,${active.y-active.offsetY-origin.top-(active.portal.clientTop||0)}px,0)`;
 };
 const createPreview=active=>{
  const preview=doc.createElement('div'),list=doc.createElement('ul'),copy=active.row.cloneNode(true),popup=host.querySelector('#calc-records-dialog[open]');
  preview.className='growth-calculator calc-drag-preview'+(popup?' calc-records-dialog':'');preview.setAttribute('aria-hidden','true');preview.inert=true;
  Object.assign(preview.style,{position:popup?'absolute':'fixed',left:'0',top:'0',width:active.width+'px',font:view.getComputedStyle(active.row).font});
  list.className=active.list.className;Object.assign(list.style,{margin:'0',padding:'0',border:'0',maxHeight:'none',overflow:'visible'});
  copy.classList.remove('is-dragging','calc-drop-before','calc-drop-after');copy.style.padding=view.getComputedStyle(active.row).padding;
  // The visual copy never participates in input, labels, row lookup or accessibility.
  for(const node of [copy,...copy.querySelectorAll('*')])for(const attr of [...node.attributes])if(attr.name==='id'||attr.name==='for'||attr.name.startsWith('data-')||['aria-controls','aria-labelledby','aria-describedby'].includes(attr.name))node.removeAttribute(attr.name);
  list.append(copy);preview.append(list);active.portal=popup||doc.body;if(popup)popup.classList.add('calc-drag-host');active.portal.append(preview);active.preview=preview;movePreview(active);
 };
 const finish=(commit=false)=>{
  const active=drag;if(!active)return;drag=null;view.cancelAnimationFrame(frame);frame=0;clearMark();active.preview?.remove();if(active.portal&&active.portal!==doc.body)active.portal.classList.remove('calc-drag-host');active.row.classList.remove('is-dragging');
  if(active.handle.hasPointerCapture?.(active.pointerId))active.handle.releasePointerCapture(active.pointerId);
  if(active.started)ignoreClickUntil=Date.now()+500;
  if(commit&&active.started&&active.target)onDrop(active.id,key(active.target),active.placement,active.scope);
 };
 const scrollParent=row=>{
  for(let el=row.parentElement;el&&el!==doc.body;el=el.parentElement)if(/auto|scroll/.test(view.getComputedStyle(el).overflowY)&&el.scrollHeight>el.clientHeight)return el;
  return doc.scrollingElement;
 };
 const bounds=active=>{
  const r=active.list.getBoundingClientRect(),s=active.scroller===doc.scrollingElement?{top:64,bottom:view.innerHeight}:active.scroller.getBoundingClientRect();
  return {left:r.left,right:r.right,top:Math.max(r.top,s.top,0),bottom:Math.min(r.bottom,s.bottom,view.innerHeight)};
 };
 const locate=()=>{
  if(!drag?.started)return;clearMark();drag.target=null;const b=bounds(drag);
  if(drag.x<b.left||drag.x>b.right||drag.y<b.top||drag.y>b.bottom)return;
  const visible=rows(drag.list),target=visible.find(row=>{const r=row.getBoundingClientRect();return drag.y<r.top+r.height/2;})||visible.at(-1);if(!target)return;const placement=target===visible.at(-1)&&drag.y>=target.getBoundingClientRect().top+target.getBoundingClientRect().height/2?'after':'before';
  if(!droppedRecordIds(visible.map(key),drag.id,key(target),placement))return;
  drag.target=target;drag.placement=placement;target.classList.add('calc-drop-'+placement);
 };
 const tick=()=>{
  if(!drag?.started)return;
  if(!drag.handle.isConnected){finish();return;}
  const b=bounds(drag),edge=30;if(drag.x>=b.left&&drag.x<=b.right){const speed=drag.y<b.top+edge?-Math.min(12,(b.top+edge-drag.y)/3):drag.y>b.bottom-edge?Math.min(12,(drag.y-b.bottom+edge)/3):0;if(speed)drag.scroller.scrollTop+=speed;}
  movePreview(drag);locate();frame=view.requestAnimationFrame(tick);
 };
 const down=event=>{
  const handle=event.target.closest('[data-calc-record-drag]');if(!handle||handle.disabled||event.button!==0||event.isPrimary===false)return;
  finish();const row=handle.closest(rowSelector),rect=row.getBoundingClientRect();drag={handle,row,list:row.parentElement,id:handle.dataset.calcRecordDrag,scope:handle.dataset.scope,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,x:event.clientX,y:event.clientY,offsetX:event.clientX-rect.left,offsetY:event.clientY-rect.top,width:rect.width,started:false,target:null,scroller:scrollParent(row)};
  handle.focus({preventScroll:true});handle.setPointerCapture(event.pointerId);
 };
 const move=event=>{
  if(!drag||event.pointerId!==drag.pointerId)return;drag.x=event.clientX;drag.y=event.clientY;
  if(!drag.started&&Math.hypot(drag.x-drag.startX,drag.y-drag.startY)>=5){drag.started=true;createPreview(drag);drag.row.classList.add('is-dragging');frame=view.requestAnimationFrame(tick);}
  if(drag.started){event.preventDefault();movePreview(drag);locate();}
 };
 const up=event=>{if(drag&&event.pointerId===drag.pointerId){if(drag.started){event.preventDefault();drag.x=event.clientX;drag.y=event.clientY;locate();}finish(true);}};
 const cancel=event=>{if(drag&&(!event||event.pointerId===undefined||event.pointerId===drag.pointerId))finish();};
 const keyboard=event=>{
  if(event.key==='Escape'&&drag){event.preventDefault();event.stopPropagation();finish();return;}
  const handle=event.target.closest('[data-calc-record-drag]');if(!handle||handle.disabled||!['ArrowUp','ArrowDown'].includes(event.key))return;
  event.preventDefault();event.stopPropagation();finish();onMove(handle.dataset.calcRecordDrag,event.key==='ArrowUp'?'up':'down',handle.dataset.scope);
 };
 const click=event=>{if(!event.target.closest('[data-calc-record-drag]'))return;event.preventDefault();event.stopImmediatePropagation();if(Date.now()>=ignoreClickUntil)onHint(event.target.closest('[data-calc-record-drag]').dataset.scope);};
 host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move,{passive:false});host.addEventListener('pointerup',up);host.addEventListener('pointercancel',cancel);host.addEventListener('lostpointercapture',cancel);host.addEventListener('keydown',keyboard,{capture:true});host.addEventListener('click',click,{capture:true});view.addEventListener('blur',cancel);
 return ()=>{finish();host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',cancel);host.removeEventListener('lostpointercapture',cancel);host.removeEventListener('keydown',keyboard,{capture:true});host.removeEventListener('click',click,{capture:true});view.removeEventListener('blur',cancel);};
}
