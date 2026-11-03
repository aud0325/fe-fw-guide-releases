import {createTranslator} from './locales/index.mjs';
let overflowObserver;
export function bindDirectoryControls(root,{lang,change}){
 overflowObserver?.disconnect();overflowObserver=null;
 const input=root.querySelector('[data-overview-query]');if(!input)return;
 const host=input.closest('[data-overview-directory]'),t=createTranslator(lang);
 const scrollControls=host.querySelector('.class-scroll-controls'),scroll=host.querySelector('.overview-scroll');
 if(scrollControls&&scroll){
  const buttons=[...scrollControls.querySelectorAll('[data-overview-scroll]')];
  const update=()=>{const max=scroll.scrollWidth-scroll.clientWidth;scrollControls.hidden=max<2;buttons.forEach(button=>{button.disabled=Number(button.dataset.overviewScroll)<0?scroll.scrollLeft<=1:scroll.scrollLeft>=max-1;});};
  buttons.forEach(button=>{button.onclick=()=>{scroll.scrollBy({left:Number(button.dataset.overviewScroll)*scroll.clientWidth*.8,behavior:'auto'});update();};});
  scroll.addEventListener('scroll',update,{passive:true});
  if(typeof ResizeObserver==='function'){overflowObserver=new ResizeObserver(update);overflowObserver.observe(scroll);}
  update();
 }

 input.oninput=()=>{
  const query=input.value.trim().toLocaleLowerCase(),rows=[...host.querySelectorAll('[data-overview-id]')];
  rows.forEach(row=>{row.hidden=!!query&&!row.dataset.overviewSearch.includes(query);});
  const tiers=new Set();for(const row of rows){const tier=row.dataset.classTier;if(!tier)continue;row.dataset.tierStart=String(!row.hidden&&!tiers.has(tier));if(!row.hidden)tiers.add(tier);}
  host.querySelectorAll('.overview-group').forEach(group=>{const count=[...group.querySelectorAll('[data-overview-id]')].filter(row=>!row.hidden).length;group.hidden=count===0;group.querySelector('h2 small').textContent=count;});
  const other=host.querySelector('.overview-other');if(other){if(query&&!other.dataset.queryOpen){other.dataset.wasOpen=String(other.open);other.dataset.queryOpen='1';}if(query)other.open=true;else if(other.dataset.queryOpen){other.open=other.dataset.wasOpen==='true';delete other.dataset.queryOpen;}other.hidden=[...other.querySelectorAll('[data-overview-id]')].every(row=>row.hidden);}
  const count=rows.filter(row=>!row.hidden).length;host.querySelector('[data-overview-count]').textContent=t(count===1?'browse.entry-one':'browse.entry-count',{count});host.querySelector('.overview-query-empty').hidden=count!==0;
  host.querySelectorAll('[data-overview-filter]').forEach(link=>{const url=new URL(link.href);if(input.value)url.searchParams.set('find',input.value);else url.searchParams.delete('find');link.href=url.href;});
  change(input.value);
 };
}
