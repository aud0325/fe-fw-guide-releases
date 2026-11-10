export function bindLearnsetTabs(root,{change}){
 root.querySelectorAll('[data-learnset-tab]').forEach(tab=>{
  tab.addEventListener('click',event=>{
   if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.defaultPrevented)return;
   event.preventDefault();
   if(tab.getAttribute('aria-selected')!=='true')change(tab.dataset.learnsetTab);
  });
  tab.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   event.preventDefault();const tabs=[...root.querySelectorAll('[data-learnset-tab]')],i=tabs.indexOf(tab),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;
   tabs[next].click();root.querySelector('[data-learnset-tab][aria-selected="true"]')?.focus({preventScroll:true});
  });
 });
}
