// The main app owns navigation, language and history; this module owns table controls.
let observer;
export function bindAbilityControls(root){
 observer?.disconnect();
 const controls=root.querySelector('.catalog-controls');
 if(controls){observer=new ResizeObserver(()=>document.documentElement.style.setProperty('--catalog-controls-height',controls.offsetHeight+'px'));observer.observe(controls);}
 const jump=root.querySelector('#proficiency-jump');
 if(jump)jump.onchange=()=>{
  const target=root.querySelector('#proficiency-'+jump.value);if(!target)return;
  const header=document.querySelector('body>header');
  window.scrollTo({top:window.scrollY+target.getBoundingClientRect().top-(header?.getBoundingClientRect().height||0)-(controls?.offsetHeight||0)-12});
  target.focus({preventScroll:true});
 };
}
