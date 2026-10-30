// The main app owns navigation, language and history; this module owns table controls.
let observer;
export function bindAbilityControls(root){
 observer?.disconnect();
 const controls=root.querySelector('.catalog-controls');
 if(controls){observer=new ResizeObserver(()=>document.documentElement.style.setProperty('--catalog-controls-height',controls.offsetHeight+'px'));observer.observe(controls);}
}
