// Reveal nested source disclosures before scrolling to their anchor.
export function revealAnchor(document,hash){
 if(!hash||hash==='#')return false;
 let id;try{id=decodeURIComponent(hash.slice(1));}catch{return false;}
 const target=document.getElementById(id);if(!target)return false;
 if(target.tagName==='DETAILS')target.open=true;
 for(let parent=target.parentElement;parent;parent=parent.parentElement)if(parent.tagName==='DETAILS')parent.open=true;
 target.scrollIntoView({block:'start'});
 const focus=target.classList.contains('source-anchor')?target.closest('li'):target;
 if(focus){focus.setAttribute('tabindex','-1');focus.focus({preventScroll:true});}
 return true;
}
