import {normalizeForgeSelection} from './forging-model.mjs';
export function bindForgingControls(root,{entry,change}){
 const table=root.querySelector('.forging-scroll'),hint=root.querySelector('.forging-scroll-hint');let observer;
 if(table&&hint){const update=()=>{hint.hidden=table.scrollWidth<=table.clientWidth;};observer=new ResizeObserver(update);observer.observe(table);update();}
 const from=root.querySelector('#forge-from'),to=root.querySelector('#forge-to');
 const update=event=>{const selection=normalizeForgeSelection(entry.forging,from.value,to.value);change(selection,event.target.id);};
 from?.addEventListener('change',update);to?.addEventListener('change',update);
 return {destroy(){observer?.disconnect();from?.removeEventListener('change',update);to?.removeEventListener('change',update);}};
}
