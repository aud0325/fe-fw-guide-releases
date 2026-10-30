export function recruitmentDisclosureState(root){return [...root.querySelectorAll('details[data-recruitment-disclosure][id]')].filter(d=>d.open).map(d=>d.id);}
export function restoreRecruitmentDisclosures(root,ids){
 if(!Array.isArray(ids))return;
 const opened=new Set(ids);
 for(const detail of root.querySelectorAll('details[data-recruitment-disclosure][id]'))detail.open=opened.has(detail.id);
}
export function bindRecruitmentEquipment(root){
 for(const dialog of root.querySelectorAll('.recruitment-level-dialog')){
  if(dialog.dataset.bound)continue;dialog.dataset.bound='1';
  let trigger;
  const close=()=>dialog.close();
  dialog.querySelector('[data-recruitment-close]').addEventListener('click',close);
  dialog.addEventListener('close',()=>{trigger?.focus({preventScroll:true});trigger=null;});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();});
  for(const button of root.querySelectorAll('[data-recruitment-levels]')){
   if(button.dataset.recruitmentLevels!==dialog.id)continue;
   button.disabled=false;
   button.addEventListener('click',()=>{trigger=button;dialog.showModal();});
  }
 }
}
