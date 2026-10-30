import {normalize} from './core.mjs';
import {completedReconstruction,remainingReconstruction,reconstructionStorageKey} from './reconstruction-model.mjs';
export function bindReconstructionPlan(root,entry,t,storage){
 const plan=root.querySelector('[data-reconstruction-plan]');if(!plan||!entry?.reconstructionProjects)return;
 const projects=entry.reconstructionProjects;let raw=null;
 try{raw=(storage||globalThis.localStorage)?.getItem(reconstructionStorageKey);}catch{}
 let completed=completedReconstruction(raw,projects);
 const checks=[...plan.querySelectorAll('[data-reconstruction-complete]')],rows=[...plan.querySelectorAll('[data-reconstruction-project]')],search=plan.querySelector('[data-reconstruction-search]'),reset=plan.querySelector('[data-reconstruction-reset]');
 const save=()=>{try{(storage||globalThis.localStorage)?.setItem(reconstructionStorageKey,JSON.stringify(completed));}catch{}};
 const filter=()=>{const query=normalize(search.value);let visible=0;for(const row of rows){row.hidden=!!query&&!normalize(row.dataset.reconstructionTerms).includes(query);if(!row.hidden)visible++;}plan.querySelector('[data-reconstruction-no-results]').hidden=visible>0;plan.querySelector('#reconstruction-projects table').hidden=visible===0;};
 const update=()=>{
  const selected=new Set(completed),result=remainingReconstruction(projects,completed),totals=new Map(result.materials.map(m=>[m.itemId,m.quantity]));
  for(const input of checks){input.checked=selected.has(input.dataset.reconstructionComplete);input.closest('tr').dataset.completed=String(input.checked);}
  for(const row of plan.querySelectorAll('[data-reconstruction-total]')){const quantity=totals.get(row.dataset.reconstructionTotal)||0;row.hidden=quantity===0;row.querySelector('[data-reconstruction-quantity]').textContent=String(quantity);}
  plan.querySelector('[data-reconstruction-status]').textContent=t('reconstruction.status',{remaining:result.remaining,total:result.total});
  plan.querySelector('[data-reconstruction-finished]').hidden=result.remaining!==0;plan.querySelector('#reconstruction-totals table').hidden=result.remaining===0;
 };
 for(const input of checks){input.disabled=false;input.addEventListener('change',()=>{completed=checks.filter(c=>c.checked).map(c=>c.dataset.reconstructionComplete);save();update();});}
 search.disabled=false;reset.disabled=false;search.addEventListener('input',filter);reset.addEventListener('click',()=>{completed=[];save();update();});update();filter();
}
