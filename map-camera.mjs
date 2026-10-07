import {clampMapZoom} from './map-gestures.mjs';

// Camera geometry is independent of layout. Dragging changes one transform;
// neither pointer frequency nor image decoding forces synchronous DOM layout.
export function createMapCamera({width,height,aspect,zoom=1,x=0,y=0}){
 let state={width,height,zoom:clampMapZoom(zoom),x,y};
 const geometry=()=>{
  const w=Math.min(state.width,state.height*aspect)*state.zoom;
  return {w,h:w/aspect,left:Math.max(0,(state.width-w)/2)};
 };
 const clamp=()=>{
  const {w,h}=geometry();
  state.x=Math.max(0,Math.min(Math.max(0,w-state.width),state.x));
  state.y=Math.max(0,Math.min(Math.max(0,h-state.height),state.y));
 };
 const snapshot=()=>({...state,...geometry()});
 clamp();
 return {
  snapshot,
  panBy(dx,dy){state.x-=dx;state.y-=dy;clamp();},
  moveTo(x,y){state.x=x;state.y=y;clamp();},
  center(u,v){const {w,h}=geometry();state.x=w*u-state.width/2;state.y=h*v-state.height/2;clamp();},
  fitPoints(points,padding=44){
   if(!points.length)return;
   const us=points.map(p=>p.u),vs=points.map(p=>p.v),minU=Math.min(...us),maxU=Math.max(...us),minV=Math.min(...vs),maxV=Math.max(...vs);
   const base=Math.min(state.width,state.height*aspect);
   state.zoom=clampMapZoom(Math.min(Math.max(1,state.width-2*padding)/(base*(maxU-minU)||1),Math.max(1,state.height-2*padding)/(base/aspect*(maxV-minV)||1)));
   const {w,h}=geometry();state.x=w*(minU+maxU)/2-state.width/2;state.y=h*(minV+maxV)/2-state.height/2;clamp();
  },
  zoomAt(zoom,anchor,from=anchor){
   const old=geometry(),u=(from.x-old.left+state.x)/old.w,v=(from.y+state.y)/old.h;
   state.zoom=clampMapZoom(zoom);
   const next=geometry();
   state.x=next.left+u*next.w-anchor.x;state.y=v*next.h-anchor.y;clamp();
  },
  resize(width,height){
   const old=geometry(),u=(state.x+state.width/2-old.left)/old.w,v=(state.y+state.height/2)/old.h;
   state.width=width;state.height=height;
   const next=geometry();state.x=next.left+u*next.w-width/2;state.y=v*next.h-height/2;clamp();
  }
 };
}

export function mapFrameRenderer(render,win){
 let frame=null;
 return {
  request(){if(frame===null)frame=win.requestAnimationFrame(()=>{frame=null;render();});},
  destroy(){if(frame!==null)win.cancelAnimationFrame(frame);frame=null;}
 };
}
