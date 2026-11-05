// Sections sharing a row keep the user's chosen tab; scrolling chooses the first otherwise.
export function currentCharacterSection(sections,top,preferredId=''){
 const visible=sections.filter(section=>section.height>0);
 if(!visible.length)return '';
 const passed=visible.filter(section=>section.top<=top+1);
 const position=passed.length?Math.max(...passed.map(section=>section.top)):Math.min(...visible.map(section=>section.top));
 const row=visible.filter(section=>Math.abs(section.top-position)<2);
 return row.find(section=>section.id===preferredId)?.id||row[0].id;
}

export function characterSectionScroll(nav,link){
 if(link.left<nav.left+8)return nav.scrollLeft+link.left-nav.left-8;
 if(link.right>nav.right-8)return nav.scrollLeft+link.right-nav.right+8;
 return nav.scrollLeft;
}

export function bindCharacterSections(root){
 const nav=root.querySelector('.character-sections');
 if(!nav)return;
 const doc=root.ownerDocument,win=doc.defaultView,header=doc.querySelector('body>header');
 const links=[...nav.querySelectorAll('a[href*="#section-"]')];
 const targets=links.map(link=>{const id=new URL(link.href,doc.baseURI).hash.slice(1);return {link,target:doc.getElementById(id)};}).filter(row=>row.target);
 let frame=0,active='',preferred=win.location.hash.slice(1),height='',width=0;
 const update=()=>{
  frame=0;
  const box=nav.getBoundingClientRect(),nextHeight=box.height+'px';
  if(height!==nextHeight){height=nextHeight;doc.documentElement.style.setProperty('--character-sections-height',height);}
  const top=(header?.getBoundingClientRect().bottom||0)+box.height+24;
  const id=currentCharacterSection(targets.map(({target})=>{const rect=target.getBoundingClientRect();return {id:target.id,top:rect.top,height:rect.height};}),top,preferred||active);
  if(id===active&&width===box.width)return;
  active=id;width=box.width;
  for(const {link,target}of targets){
   if(target.id===id){
    link.setAttribute('aria-current','location');
    const rect=link.getBoundingClientRect(),left=characterSectionScroll({left:box.left,right:box.right,scrollLeft:nav.scrollLeft},rect);
    if(Math.abs(left-nav.scrollLeft)>1)nav.scrollTo({left,behavior:'instant'});
   }else link.removeAttribute('aria-current');
  }
 };
 const schedule=()=>{if(!frame)frame=win.requestAnimationFrame(update);};
 const choose=event=>{const link=event.target.closest('a');if(!link||!nav.contains(link))return;preferred=new URL(link.href,doc.baseURI).hash.slice(1);schedule();};
 const hash=()=>{preferred=win.location.hash.slice(1);schedule();};
 const observer=new win.ResizeObserver(schedule);
 for(const node of [header,nav,nav.closest('article')].filter(Boolean))observer.observe(node);
 win.addEventListener('scroll',schedule,{passive:true});
 win.addEventListener('resize',schedule,{passive:true});
 win.addEventListener('hashchange',hash);
 root.addEventListener('toggle',schedule,true);
 nav.addEventListener('click',choose);
 update();
 return ()=>{
  observer.disconnect();win.cancelAnimationFrame(frame);
  win.removeEventListener('scroll',schedule);win.removeEventListener('resize',schedule);win.removeEventListener('hashchange',hash);
  root.removeEventListener('toggle',schedule,true);nav.removeEventListener('click',choose);
  doc.documentElement.style.removeProperty('--character-sections-height');
 };
}
