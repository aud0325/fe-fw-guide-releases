import {mapNodes,filterMapNodes} from './part1-map.mjs';
export function mapClickPlace(event,host){
 const target=event.target.closest('[data-map-place]');
 // Keyboard activation and list links select their own named place.
 if(!target?.classList.contains('part1-point')||!event.detail)return target;
 let closest=target,distance=Infinity;
 // Hit areas can overlap on a small map. Resolve only rendered hit areas,
 // using viewport coordinates so zooming, panning and page scrolling agree.
 for(const point of host.querySelectorAll('.part1-point')){
  const rect=point.getBoundingClientRect(),x=event.clientX,y=event.clientY;
  if(x<rect.left||x>rect.right||y<rect.top||y>rect.bottom)continue;
  const next=(x-(rect.left+rect.width/2))**2+(y-(rect.top+rect.height/2))**2;
  if(next<distance||(next===distance&&point===target)){closest=point;distance=next;}
 }
 return closest;
}
// Bind only the map subtree. History/route ownership remains with the application.
export function bindPart1Map(root,{state,view,change}){
 const host=root.querySelector('[data-part1-map]');if(!host)return null;
 const viewport=host.querySelector('.part1-viewport'),canvas=host.querySelector('.part1-canvas');
 let zoom=Math.max(1,Math.min(4,Number(view?.zoom)||1)),timer,composing=false;
 const snapshot=()=>({zoom,x:viewport.scrollLeft,y:viewport.scrollTop});
 function resize(){
  canvas.style.width=Math.min(viewport.clientWidth,viewport.clientHeight*810/760)*zoom+'px';
  host.querySelector('#part1-scale').textContent=Math.round(zoom*100)+'%';
 }
 function center(){
  const point=mapNodes.find(n=>n.id===host.dataset.place);if(!point)return;
  viewport.scrollLeft=canvas.offsetLeft+canvas.clientWidth*point.u-viewport.clientWidth/2;
  viewport.scrollTop=canvas.clientHeight*point.v-viewport.clientHeight/2;
 }
 resize();
 if(view){viewport.scrollLeft=view.x||0;viewport.scrollTop=view.y||0;}else if(host.dataset.place){zoom=1.5;resize();center();}
 const observer=new ResizeObserver(()=>{const x=viewport.scrollLeft,y=viewport.scrollTop;resize();viewport.scrollLeft=x;viewport.scrollTop=y;});
 observer.observe(viewport);
 host.querySelectorAll('[data-part1-zoom]').forEach(button=>button.addEventListener('click',()=>{
  const action=button.dataset.part1Zoom,oldWidth=canvas.clientWidth;
  const x=(viewport.scrollLeft+viewport.clientWidth/2-canvas.offsetLeft)/oldWidth,y=(viewport.scrollTop+viewport.clientHeight/2)/canvas.clientHeight;
  zoom=action==='fit'?1:Math.max(1,Math.min(4,zoom+(action==='in'?.5:-.5)));resize();
  if(action==='fit'){viewport.scrollLeft=0;viewport.scrollTop=0;}else{viewport.scrollLeft=canvas.offsetLeft+x*canvas.clientWidth-viewport.clientWidth/2;viewport.scrollTop=y*canvas.clientHeight-viewport.clientHeight/2;}
 }));
 host.addEventListener('click',event=>{
  const place=mapClickPlace(event,host);
  if(!place||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();change({mapPlace:place.dataset.mapPlace},{focus:'#map-selection',center:true});
 });
 const search=host.querySelector('#map-search');
 const update=()=>{
  const next={mapQuery:search.value,mapProvince:host.querySelector('#map-province').value,mapKind:host.querySelector('#map-kind').value};
  const rows=filterMapNodes(next);if(!rows.some(n=>n.id===state.mapPlace))next.mapPlace='';
  if(Object.entries(next).every(([key,value])=>state[key]===value))return;
  change(next,{focus:document.activeElement?.id?'#'+document.activeElement.id:null,caret:search.selectionStart});
 };
 search.addEventListener('compositionstart',()=>{composing=true;clearTimeout(timer);});
 search.addEventListener('compositionend',()=>{composing=false;clearTimeout(timer);timer=setTimeout(update,300);});
 search.addEventListener('input',()=>{clearTimeout(timer);if(!composing)timer=setTimeout(update,300);});
 for(const id of ['map-province','map-kind'])host.querySelector('#'+id).addEventListener('change',()=>{clearTimeout(timer);update();});
 host.querySelector('form').addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);if(!composing)update();});
 return {snapshot,center,destroy(){clearTimeout(timer);observer.disconnect();}};
}
