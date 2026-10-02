// Keep citations usable above scrollable tables and cards, including on keyboard focus.
export function setupSourceTooltips(doc=globalThis.document,win=globalThis.window){
 const popup=doc.createElement('div');popup.className='source-tooltip';popup.id='source-tooltip';popup.setAttribute('role','tooltip');popup.hidden=true;doc.body.append(popup);
 let active=null,pinned=false,restoringFocus=false;
 const place=()=>{
  if(!active)return;
  const rect=active.getBoundingClientRect(),margin=10;
  popup.style.maxWidth=Math.min(340,win.innerWidth-2*margin)+'px';
  popup.style.left=Math.max(margin,Math.min(rect.left,win.innerWidth-popup.offsetWidth-margin))+'px';
  popup.style.top=(rect.bottom+popup.offsetHeight+margin>win.innerHeight?Math.max(margin,rect.top-popup.offsetHeight-6):rect.bottom+6)+'px';
 };
 const show=(element,interactive=false)=>{
  if(!element?.dataset.sourceTip||pinned&&!interactive)return;
  if(active!==element)hide();
  active=element;pinned=interactive;
  popup.replaceChildren(doc.createTextNode(element.dataset.sourceTip));
  if(interactive&&element.dataset.sourceHref){
   const link=doc.createElement('a');link.href=element.dataset.sourceHref;link.target='_blank';link.rel='noopener noreferrer';link.textContent=element.dataset.sourceAction||element.dataset.sourceTip;
   popup.append(link);
  }
  popup.setAttribute('role',interactive?'dialog':'tooltip');
  if(interactive)popup.setAttribute('aria-label',element.dataset.sourceTip);else popup.removeAttribute('aria-label');
  popup.classList.toggle('interactive',interactive);
  if(element.matches('.detail-icon-source,.information-hint'))element.setAttribute('aria-expanded',String(interactive));
  if(element.classList.contains('information-hint'))element.setAttribute('aria-describedby','source-tooltip');
  popup.hidden=false;place();
 };
 const hide=()=>{if(active?.matches('.detail-icon-source,.information-hint'))active.setAttribute('aria-expanded','false');if(active?.classList.contains('information-hint'))active.removeAttribute('aria-describedby');active=null;pinned=false;popup.hidden=true;popup.classList.remove('interactive');};
 doc.addEventListener('pointerover',event=>show(event.target.closest?.('[data-source-tip]')));
 doc.addEventListener('pointerout',event=>{if(active&&!pinned&&!active.contains(event.relatedTarget))hide();});
 doc.addEventListener('focusin',event=>{if(!restoringFocus)show(event.target.closest?.('[data-source-tip]'));});
 doc.addEventListener('focusout',event=>{if(active&&!pinned&&!active.contains(event.relatedTarget))hide();});
 doc.addEventListener('click',event=>{
  if(popup.contains(event.target))return;
  const trigger=event.target.closest?.('.detail-icon-source,.information-hint');
  if(trigger){event.preventDefault();if(active===trigger&&pinned)hide();else{show(trigger,true);if(trigger.classList.contains('detail-icon-source'))popup.querySelector('a')?.focus({preventScroll:true});}return;}
  if(pinned)hide();
 });
 doc.addEventListener('keydown',event=>{if(event.key==='Escape'){const returnFocus=popup.contains(doc.activeElement)?active:null;hide();if(returnFocus){restoringFocus=true;returnFocus.focus({preventScroll:true});restoringFocus=false;}}});
 win.addEventListener('scroll',hide,true);win.addEventListener('resize',hide);
 return {hide};
}
