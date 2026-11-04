import {growthSortContext} from './growth-comparison.mjs';
// The app owns URL/history and language; this module only binds the comparison.
export function bindGrowthControls(root,{state,change}){
 const host=root.querySelector('[data-growth-comparison]');if(!host)return;
 const query=host.querySelector('#growth-query');if(query){let composing=false;query.addEventListener('compositionstart',()=>{composing=true;});query.addEventListener('compositionend',()=>{composing=false;change({growthQuery:query.value},'#growth-query',{replace:true});});query.addEventListener('input',()=>{if(!composing)change({growthQuery:query.value},'#growth-query',{replace:true});});}
 for(const [id,key,value]of [['heat-enabled','growthHeat',e=>e.checked?'on':'off'],['personal-skill','growthSkill',e=>e.checked]])host.querySelector('#'+id)?.addEventListener('change',event=>change({[key]:value(event.target)},'#'+id));
 host.querySelectorAll('[data-growth-sort]').forEach(button=>button.addEventListener('click',()=>{const current=growthSortContext(state);change({growthSort:button.dataset.growthSort,growthDirection:current.sort===button.dataset.growthSort&&current.direction==='desc'?'asc':'desc'},`[data-growth-sort="${button.dataset.growthSort}"]`);}));
}

export function bindCharacterGrowthControls(root,{change}){
 const checkbox=root.querySelector('[data-character-growth-skill]');if(!checkbox)return;
 checkbox.disabled=false;
 checkbox.addEventListener('change',()=>change(checkbox.checked));
}

// Center the row inside the table while keeping its stat colors unchanged.
export function revealGrowthFocus(root,id,{focus=false}={}){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id||''))return false;
 const viewport=root.querySelector('.growth-scroll'),row=root.querySelector('#growth-row-'+id);
 if(!viewport||!row||!viewport.contains(row))return false;
 const rowBox=row.getBoundingClientRect(),viewportBox=viewport.getBoundingClientRect();
 viewport.scrollTop=Math.max(0,viewport.scrollTop+rowBox.top-viewportBox.top-(viewport.clientHeight-rowBox.height)/2);
 viewport.scrollLeft=0;
 viewport.scrollIntoView({block:'nearest',inline:'nearest'});
 if(focus)row.querySelector('a')?.focus({preventScroll:true});
 return true;
}
