/** One navigation tree shared by the desktop sidebar and native mobile dialog. */
export function setupNavigationDrawer(){
 const drawer=document.getElementById('mobile-menu');
 const sidebar=document.getElementById('sidebar');
 const shell=document.querySelector('.shell');
 const trigger=document.getElementById('menu-toggle');
 const closeButton=document.getElementById('menu-close');
 const mobile=window.matchMedia('(max-width:960px)');
 const close=()=>{if(drawer.open)drawer.close()};
 trigger.addEventListener('click',()=>{
  if(!mobile.matches||drawer.open)return;
  drawer.showModal();
  document.body.classList.add('menu-open');
  trigger.setAttribute('aria-expanded','true');
  closeButton.focus({preventScroll:true});
 });
 closeButton.addEventListener('click',close);
 drawer.addEventListener('close',()=>{
  document.body.classList.remove('menu-open');
  trigger.setAttribute('aria-expanded','false');
  // Native dialog restores focus and traps Tab without a custom focus loop.
  if(mobile.matches&&document.activeElement===document.body)trigger.focus({preventScroll:true});
 });
 let backdropPointer=false;
 const outside=event=>{const r=drawer.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom};
 drawer.addEventListener('pointerdown',event=>{backdropPointer=outside(event)});
 drawer.addEventListener('click',event=>{if(backdropPointer&&outside(event))close();backdropPointer=false});
 sidebar.addEventListener('click',event=>{
  if(mobile.matches&&event.target.closest('#navigation a,.sidebar-brand')&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey)close();
 });
 window.addEventListener('hashchange',close);
 drawer.addEventListener('keydown',event=>{
  // Avoid the page's slash-to-search shortcut moving focus outside the dialog.
  if(event.key==='/')event.stopPropagation();
 });
 const sync=()=>{
  close();
  if(mobile.matches)drawer.append(sidebar);
  else shell.prepend(sidebar);
  if(!mobile.matches&&document.activeElement===trigger)document.getElementById('language').focus({preventScroll:true});
 };
 mobile.addEventListener('change',sync);
 sync();
}
