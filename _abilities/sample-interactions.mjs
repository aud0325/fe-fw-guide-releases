// Keep native page scrolling and table semantics; pin only a visual copy of the rank header.
let region=null,pinned=null,frame=0;
function update(){
 frame=0;
 const current=document.querySelector('.sample-matrix-scroll');
 if(current!==region){
  pinned?.remove();region=current;pinned=null;
  if(region){
   pinned=document.createElement('div');pinned.className='matrix-pinned-head';pinned.setAttribute('aria-hidden','true');
   const table=region.querySelector('table').cloneNode(false);
   table.append(region.querySelector('thead').cloneNode(true));pinned.append(table);
   region.parentElement.append(pinned);
  }
 }
 if(!region)return;
 const table=region.querySelector('table'),head=table.querySelector('thead'),rect=region.getBoundingClientRect();
 const occupied=[document.querySelector('header'),document.querySelector('.detail-heading')].filter(Boolean).map(el=>{
  const style=getComputedStyle(el),box=el.getBoundingClientRect();
  return ['sticky','fixed'].includes(style.position)&&box.top<=parseFloat(style.top||'0')+1?Math.max(0,box.bottom):0;
 });
 const top=Math.max(0,...occupied),height=head.getBoundingClientRect().height;
 const shown=head.getBoundingClientRect().top<top&&rect.bottom>top+height;
 pinned.hidden=!shown;
 if(shown){
  Object.assign(pinned.style,{top:top+'px',left:(rect.left+region.clientLeft)+'px',width:region.clientWidth+'px'});
  const copy=pinned.querySelector('table');copy.style.width=table.getBoundingClientRect().width+'px';copy.style.minWidth='0';
  [...head.querySelectorAll('th')].forEach((cell,i)=>{copy.querySelectorAll('th')[i].style.width=cell.getBoundingClientRect().width+'px';});
  pinned.scrollLeft=region.scrollLeft;
 }
 const overflow=region.scrollWidth>region.clientWidth+1;
 const hint=region.parentElement.querySelector('.matrix-scroll-hint');
 if(hint)hint.hidden=!overflow;
 region.classList.toggle('can-scroll-right',overflow&&region.scrollLeft+region.clientWidth<region.scrollWidth-2);
}
function schedule(){if(!frame)frame=requestAnimationFrame(update);}
window.addEventListener('scroll',schedule,{capture:true,passive:true});
window.addEventListener('resize',schedule,{passive:true});
document.addEventListener('change',schedule);
new MutationObserver(schedule).observe(document.querySelector('#app')||document.body,{childList:true,subtree:true});
schedule();
