import {createTranslator} from './locales/index.mjs';
export function bindDirectoryControls(root,{lang,change}){
 const input=root.querySelector('[data-overview-query]');if(!input)return;
 const host=input.closest('[data-overview-directory]'),t=createTranslator(lang);
 input.oninput=()=>{
  const query=input.value.trim().toLocaleLowerCase(),rows=[...host.querySelectorAll('[data-overview-id]')];
  rows.forEach(row=>{row.hidden=!!query&&!row.dataset.overviewSearch.includes(query);});
  host.querySelectorAll('.overview-group').forEach(group=>{const count=[...group.querySelectorAll('[data-overview-id]')].filter(row=>!row.hidden).length;group.hidden=count===0;group.querySelector('h2 small').textContent=count;});
  const other=host.querySelector('.overview-other');if(other){if(query&&!other.dataset.queryOpen){other.dataset.wasOpen=String(other.open);other.dataset.queryOpen='1';}if(query)other.open=true;else if(other.dataset.queryOpen){other.open=other.dataset.wasOpen==='true';delete other.dataset.queryOpen;}other.hidden=[...other.querySelectorAll('[data-overview-id]')].every(row=>row.hidden);}
  const count=rows.filter(row=>!row.hidden).length;host.querySelector('[data-overview-count]').textContent=t(count===1?'browse.entry-one':'browse.entry-count',{count});host.querySelector('.overview-query-empty').hidden=count!==0;
  host.querySelectorAll('[data-overview-filter]').forEach(link=>{const url=new URL(link.href);if(input.value)url.searchParams.set('find',input.value);else url.searchParams.delete('find');link.href=url.href;});
  change(input.value);
 };
}
