import {mapNodes,filterMapNodes,mapMeta,mapMarkerKind} from './part1-map.mjs';
import {switchMapVariant} from './map-variants.mjs';
import {bindMapGestures,clampMapZoom} from './map-gestures.mjs';
import {createMapCamera,mapFrameRenderer} from './map-camera.mjs';
import {bindMapLegend} from './map-visibility.mjs';
import {bindMapSearch} from './map-search.mjs';
import {bindMapLabels} from './map-labels.mjs';
// Grow slightly smaller markers up to 500%, then increase only their spacing.
export const mapMarkerSize=zoom=>(16+6*(Math.min(5,clampMapZoom(zoom))-1))*.9;
// The hit target and label scale separately so labels can sit above nearby
// icons without adding layout work during zoom or reducing touch targets.
export function mapMarkerPresentation(zoom,visualScale){
 const icon=mapMarkerSize(zoom),hit=Math.max(44,icon+16),ratio=hit/56;
 return {pointScale:ratio/visualScale,iconScale:icon/40/ratio,labelScale:1/visualScale,labelOffset:(icon/2+8)/visualScale,selectionScale:(icon+9)/49/ratio,matchScale:Math.max(30,icon+10)/49/ratio};
}
export function mapClickPlace(event,host){
 const target=event.target.closest('[data-map-place]');
 // Keyboard activation and list links select their own named place.
 if(!target?.classList.contains('part1-point')||!event.detail)return target;
 let closest=target,distance=Infinity;
 // Hit areas can overlap on a small map. Resolve only rendered hit areas,
 // using viewport coordinates so zooming, panning and page scrolling agree.
 for(const point of host.querySelectorAll('.part1-point')){
  if(point.hidden)continue;
  const rect=(point.querySelector?.('.part1-point-hit')||point).getBoundingClientRect(),x=event.clientX,y=event.clientY;
  if(x<rect.left||x>rect.right||y<rect.top||y>rect.bottom)continue;
  const next=(x-(rect.left+rect.width/2))**2+(y-(rect.top+rect.height/2))**2;
  if(next<distance||(next===distance&&point===target)){closest=point;distance=next;}
 }
 return closest;
}
// Bind only the map subtree. History/route ownership remains with the application.
export function bindPart1Map(root,{state,view,t,change}){
 const host=root.querySelector('[data-part1-map]');if(!host)return null;
 const viewport=host.querySelector('.part1-viewport'),canvas=host.querySelector('.part1-canvas');
 const legend=host.querySelector('.part1-legend');
 if(legend)legend.open=view?.legendOpen??!matchMedia('(max-width:600px)').matches;
 const gatheringLegend=host.querySelector('[data-map-gathering]');
 if(gatheringLegend)gatheringLegend.open=view?.gatheringOpen??false;
 const visibility=bindMapLegend(host,{hiddenKinds:view?.hiddenKinds});
 const camera=createMapCamera({width:viewport.clientWidth,height:viewport.clientHeight,aspect:mapMeta.width/mapMeta.height,zoom:view?.zoom||1,x:view?.x||0,y:view?.y||0});
 const win=viewport.ownerDocument.defaultView,scale=host.querySelector('#part1-scale');
 let renderedWidth=0,renderedZoom=0,renderedScale=0,zoomTimer,commitWidth=false,labels;
 viewport.classList.add('has-camera');
 function render(){
  const {w,left,x,y,zoom}=camera.snapshot();
  // Scale the existing texture during a gesture; rasterize at the final width
  // once it settles. Keeping width stable avoids relaying out all map points.
  if(!renderedWidth||commitWidth){
   if(w!==renderedWidth)canvas.style.width=w+'px';
   renderedWidth=w;commitWidth=false;
  }
  const visualScale=w/renderedWidth;
  if(zoom!==renderedZoom||visualScale!==renderedScale){
   const marker=mapMarkerPresentation(zoom,visualScale);
   for(const [key,value] of Object.entries(marker))canvas.style.setProperty('--map-'+key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()),value+(key==='labelOffset'?'px':''));
   if(zoom!==renderedZoom){
    scale.textContent=Math.round(zoom*100)+'%';
    win.clearTimeout(zoomTimer);
    zoomTimer=win.setTimeout(()=>{commitWidth=true;frames.request();},140);
   }
   renderedZoom=zoom;renderedScale=visualScale;
  }
  canvas.style.transform=`translate3d(${left-x}px,${-y}px,0) scale(${visualScale})`;
  labels?.schedule(camera.snapshot());
 }
 const frames=mapFrameRenderer(render,win);
 const snapshot=()=>{const {zoom,x,y}=camera.snapshot();return {zoom,x,y,legendOpen:legend?.open,gatheringOpen:gatheringLegend?.open,hiddenKinds:visibility.snapshot(),namesPreference:labels.snapshot()};};
 function center(){
  const point=mapNodes.find(n=>n.id===host.dataset.place);
  if(point){
   visibility.show(mapMarkerKind(point,state.mapVariant));
   if(camera.snapshot().zoom<1.5)camera.zoomAt(1.5,{x:0,y:0});
   camera.center(point.u,point.v);
  }else{
   const points=filterMapNodes(state);
   if(state.mapQuery)for(const kind of new Set(points.map(n=>mapMarkerKind(n,state.mapVariant))))visibility.show(kind);
   camera.fitPoints(points);
  }
  labels?.refresh();
  frames.request();
 }
 function zoomAt(value,anchor,from=anchor){
  const rect=viewport.getBoundingClientRect(),left=rect.left+viewport.clientLeft,top=rect.top+viewport.clientTop;
  camera.zoomAt(value,{x:anchor.x-left,y:anchor.y-top},{x:from.x-left,y:from.y-top});frames.request();
 }
 if(!view&&host.dataset.place){camera.zoomAt(1.5,{x:0,y:0});center();}
 labels=bindMapLabels(host,{camera:camera.snapshot,showNames:view?.namesPreference??(view?.showNames===false?false:null),compact:win.matchMedia('(max-width:600px)').matches});
 render();
 const observer=new ResizeObserver(()=>{camera.resize(viewport.clientWidth,viewport.clientHeight);labels.responsive(win.matchMedia('(max-width:600px)').matches);win.clearTimeout(zoomTimer);commitWidth=true;frames.request();});
 observer.observe(viewport);
 const gestures=bindMapGestures(viewport,{getZoom:()=>camera.snapshot().zoom,zoomAt,panBy:(x,y)=>{camera.panBy(x,y);frames.request();}});
 host.querySelectorAll('[data-part1-zoom]').forEach(button=>button.addEventListener('click',()=>{
  const action=button.dataset.part1Zoom,{width,height,zoom}=camera.snapshot();
  camera.zoomAt(action==='fit'?1:zoom+(action==='in'?.5:-.5),{x:width/2,y:height/2});
  if(action==='fit')camera.moveTo(0,0);
  frames.request();
 }));
 // Keyboard focus must reveal a marker even though the interactive camera no
 // longer uses the browser's scroll position. Mouse/touch selection stays put.
 const focusPoint=event=>{
  if(!event.target.matches('.part1-point:focus-visible'))return;
  const point=mapNodes.find(n=>n.id===event.target.dataset.mapPlace);
  if(point){camera.center(point.u,point.v);frames.request();}
 };
 viewport.addEventListener('focusin',focusPoint);
 const moveKey=event=>{
  if(event.target!==viewport||event.ctrlKey||event.metaKey||event.altKey)return;
  const directions={ArrowLeft:[80,0],ArrowRight:[-80,0],ArrowUp:[0,80],ArrowDown:[0,-80]};
  if(!directions[event.key])return;
  event.preventDefault();camera.panBy(...directions[event.key]);frames.request();
 };
 viewport.addEventListener('keydown',moveKey);
 host.addEventListener('click',event=>{
  const variant=event.target.closest('[data-map-variant]');
  if(variant&&event.button===0&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){event.preventDefault();change(switchMapVariant(state,variant.dataset.mapVariant),{focus:'[data-map-variant="'+variant.dataset.mapVariant+'"]',center:true});return;}
  const place=mapClickPlace(event,host);
  if(!place||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();change({mapPlace:place.dataset.mapPlace},{focus:'#map-selection',center:true});
 });
 const search=bindMapSearch({input:host.querySelector('#map-search'),panel:host.querySelector('#map-search-panel'),form:host.querySelector('form'),t,change,variant:state.mapVariant});
 return {snapshot,center,closeSearch:search.close,destroy(){labels.destroy();search.destroy();win.clearTimeout(zoomTimer);observer.disconnect();visibility.destroy();gestures.destroy();frames.destroy();viewport.removeEventListener('focusin',focusPoint);viewport.removeEventListener('keydown',moveKey);}};
}
