import {writeCalculatorDraft,calculatorKeys as keys} from './growth-calculator-state.mjs';
import {stateQuery} from './routing.mjs';
import {calculatorData,calculatorCharacters,calculatorClasses,startsFor,buildFromPreset,initialCalculatorState,resolveCalculatorState} from './growth-calculator-data.mjs';
import {recommendedStages,compatibleMounts,sortStages,activeBuild,integerStat} from './growth-calculator-plans.mjs';
import {calculatorResultsHtml,calculatorLevelRows,calculatorTargetValid,canAddCalculatorStage} from './growth-calculator-ui.mjs';
import {calculateBuild} from './growth-calculator-model.mjs';
import {bindCalculatorPickers} from './growth-calculator-picker.mjs';
import {readSavedCalculations,writeSavedCalculations,calculatorSaveLimit,renamedSavedCalculations} from './growth-calculator-saves.mjs';
import {savedCalculationsHtml,comparisonHtml,refreshComparisonMetrics} from './growth-calculator-comparison-ui.mjs';
import {makeSavedRecord,recordTitle,manualMetadata,matchingCalculation,comparisonSides,recordCharacterId,recordLevel} from './growth-calculator-records.mjs';
import {bindStatBreakdowns} from './growth-calculator-stat-ui.mjs';
import {bindStageGrowthTips} from './growth-calculator-stage-ui.mjs';
export function bindGrowthCalculator(root,{state:input,t,change}){
 const host=root.querySelector('[data-growth-calculator]');if(!host)return;
 const state=resolveCalculatorState(input.calculator,input.calculatorCharacter),lang=host.dataset.lang,clone=()=>JSON.parse(JSON.stringify(state)),numeric=el=>el.value===''?'':Number(el.value);
 let storage;try{storage=localStorage;}catch{}
 let session;try{session=sessionStorage;}catch{}
 let saves=readSavedCalculations(storage);
 const status=key=>{const el=host.querySelector('#calc-status');if(el)el.textContent=t(key);};
 const result=()=>calculateBuild(calculatorData,state.characterId,activeBuild(state.builds[0],state.target),state.target);
 const commit=(next,focus,replace=true,message)=>{
  next.compare=false;
  change(next,focus,{replace});
  writeCalculatorDraft(session,next);
  if(message){const el=root.querySelector('#calc-status');if(el)el.textContent=t(message);}
 };
 const dialog=host.querySelector('#calc-records-dialog');let opener,openerSelector,recordTarget='manage',highlightId='',editingId='';
 const showComparison=(out=result())=>{host.querySelector('#calc-comparison-result').innerHTML=comparisonHtml(state,out,saves,{t,lang});refreshComparisonMetrics(host,state,out,saves,{t,lang});};
 const commitInput=next=>{Object.assign(state,next);change(next,null,{replace:true,render:false});writeCalculatorDraft(session,next);refreshComparisonMetrics(host,state,result(),saves,{t,lang});};
 const filterRecords=()=>{
  const q=host.querySelector('#calc-record-search').value.normalize('NFKC').toLowerCase().trim();let count=0;
  host.querySelectorAll('[data-calc-record]').forEach(row=>{row.hidden=!row.dataset.search.includes(q);if(!row.hidden)count++;});
  host.querySelectorAll('[data-calc-record-group]').forEach(group=>{group.hidden=!!q&&!group.querySelector('[data-calc-record]:not([hidden])');});
  host.querySelector('#calc-record-no-matches').hidden=!q||count>0;
 };
 const refreshSaves=()=>{
  host.querySelector('#calc-saves').innerHTML=savedCalculationsHtml(saves,{t,lang,characterId:state.characterId,highlightId,editingId});
  host.querySelectorAll('[data-calc-choose]').forEach(button=>{button.hidden=recordTarget!=='manage'&&!button.dataset.calcChoose.startsWith(recordTarget+':');});
  host.querySelectorAll('[data-calc-load]').forEach(button=>{button.hidden=recordTarget!=='manage';});
  filterRecords();showComparison();
 };
 const openRecords=(target='manage',message,savedId='')=>{
  recordTarget=target;highlightId=savedId;editingId='';opener=document.activeElement;openerSelector=opener?.id?'#'+opener.id:opener?.hasAttribute('data-calc-save-manual')?'#calc-comp-hp':`[data-calc-open-records="${target}"]`;
  host.querySelector('#calc-records-title').textContent=t(target==='left'?'calculator.selectLeft':target==='right'?'calculator.selectRight':'calculator.saveList');
  host.querySelector('#calc-record-search').value='';host.querySelector('#calc-records-status').textContent=message?t(message):'';
  refreshSaves();if(!dialog.open)dialog.showModal();host.querySelector('.calc-dialog-body').scrollTop=0;host.querySelector('[data-calc-dialog-close]').focus();if(highlightId)host.querySelector(`[data-calc-record="${highlightId}"]`)?.scrollIntoView({block:'nearest'});
 };
 const closeRecords=()=>dialog.close();
 dialog.addEventListener('keydown',event=>{if(event.key==='Escape'&&!event.target.closest('[data-calc-rename-form]')){event.preventDefault();event.stopPropagation();closeRecords();}});
 dialog.addEventListener('close',()=>{const target=opener?.isConnected?opener:host.querySelector(openerSelector);target?.focus({preventScroll:true});});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)closeRecords();});
 host.querySelector('[data-calc-dialog-close]').addEventListener('click',closeRecords);
 host.querySelector('#calc-record-search').addEventListener('input',filterRecords);
 refreshSaves();
 const cleanupTips=bindStageGrowthTips(host),cleanupStats=bindStatBreakdowns(host,{t,lang});
 const cleanup=bindCalculatorPickers(host,(id,value,route)=>{
  if(id==='calc-character'){commit(initialCalculatorState(value,route),'#calc-character',false);return;}
  if(id==='calc-start-level'){const next=clone(),p=startsFor(next.characterId).find(p=>p.id===value);if(!p)return;next.builds[0]=buildFromPreset(p);if(Number.isInteger(next.target)&&next.target<p.level)next.target=p.level;commit(next,'#calc-start-level',false);return;}
  const match=id.match(/^calc-stage-(\d+)-(class|mount)$/);if(!match)return;
  const next=clone(),stage=next.builds[0].stages[Number(match[1])];
  if(match[2]==='class'){stage.classId=value;if(!compatibleMounts(next.characterId,value).some(m=>m.id===stage.mountId))stage.mountId='';}
  else stage.mountId=value;
  stage.bond=5;commit(next,'#'+id,false);
 },{onRoute:(_id,route)=>{const next=clone();next.recruitmentRoute=route;commitInput(next);}});
 host.querySelector('#calc-target').addEventListener('input',event=>{
  const next=clone();next.target=numeric(event.target);commitInput(next);const out=result(),valid=calculatorTargetValid(state);
  host.querySelector('.calc-results').innerHTML=calculatorResultsHtml(state,out,{t,lang});host.querySelector('[data-calc-disclosure="levels"] tbody').innerHTML=calculatorLevelRows(out);
  host.querySelector('[data-calc-level-ups]').textContent=valid?t('calculator.levelUps',{count:state.target-state.builds[0].level}):'—';
  host.querySelector('[data-calc-autofill]').disabled=!valid;host.querySelector('[data-calc-add]').disabled=!canAddCalculatorStage(state);event.target.setAttribute('aria-invalid',String(!valid));
  host.querySelectorAll('[data-calc-stage]').forEach(row=>row.closest('.calc-stage-group').classList.toggle('calc-stage-future',state.builds[0].stages[Number(row.dataset.calcStage)].level>state.target));
  host.querySelector('[data-calc-future-stages]').hidden=!state.builds[0].stages.some(s=>s.level>state.target);showComparison(out);
 });
 host.querySelector('[data-calc-autofill]').addEventListener('click',()=>{
  const next=clone();next.builds[0].stages=recommendedStages(next.characterId,next.builds[0],next.target);commit(next,'[data-calc-autofill]',false,'calculator.autofilled');
 });
 host.querySelector('[data-calc-add]').addEventListener('click',()=>{
  const next=clone(),b=next.builds[0];if(!Number.isInteger(next.target)||next.target>99||b.stages.length>=12)return;
  let level=Number(b.stages.at(-1).level)+1;if(!Number.isInteger(level)||level>next.target)level=b.level+1;while(level<=next.target&&b.stages.some(s=>s.level===level))level++;if(level>next.target)return;
  const prior=[...b.stages].reverse().find(s=>s.level<level)||b.stages[0];b.stages=sortStages([...b.stages,{...prior,level}]);
  commit(next,`#calc-stage-${b.stages.findIndex(s=>s.level===level)}-level`,false);
 });
 host.querySelectorAll('[data-calc-remove]').forEach(button=>button.addEventListener('click',()=>{
  const index=Number(button.dataset.calcRemove);if(index===0)return;const next=clone();next.builds[0].stages.splice(index,1);commit(next,'[data-calc-add]',false);
 }));
 host.querySelectorAll('[data-calc-stage]').forEach(row=>{
  const index=Number(row.dataset.calcStage),level=row.querySelector('input[type="number"]');
  if(index)level.addEventListener('change',()=>{
   const next=clone(),b=next.builds[0],stage=b.stages[index];stage.level=numeric(level);
   b.stages=sortStages(b.stages);commit(next,`#calc-stage-${b.stages.indexOf(stage)>=0?b.stages.indexOf(stage):b.stages.findIndex(s=>s.level===stage.level)}-level`,false);
  });

 });
 host.querySelectorAll('[data-calc-stage-skill]').forEach(control=>control.addEventListener('change',()=>{const next=clone(),index=Number(control.dataset.calcStageSkill);next.builds[0].stages[index].skill=control.checked;commit(next,'#'+control.id,false);}));
 const saveRecord=manual=>{
  const out=result(),meta=manualMetadata(state,lang),values=manual?state.comparison.stats:out.values,message=host.querySelector(manual?'#calc-right-status':'#calc-status');
  if(manual&&!keys.every(k=>Number.isInteger(values[k])&&values[k]>=0&&values[k]<=999)){message.textContent=t('calculator.fillAllStats');host.querySelector('#calc-comp-'+keys.find(k=>!Number.isInteger(values[k])||values[k]<0||values[k]>999))?.focus();return;}
  const title=manual?host.querySelector('#calc-manual-name').value.trim():recordTitle(state,lang);
  if(!values)return;if(!title){message.textContent=t('calculator.nameRequired');host.querySelector('#calc-manual-name')?.focus();return;}
  if(manual&&(!calculatorCharacters.some(c=>c.id===meta.characterId)||!Number.isInteger(meta.level)||meta.level<1||meta.level>99)){message.textContent=t('calculator.invalidMetadata');return;}
  saves=readSavedCalculations(storage);
  if(!manual&&matchingCalculation(state,out,saves)){openRecords('manage',null,matchingCalculation(state,out,saves).id);return;}
  const existing=manual?saves.find(s=>s.id===state.comparison.manualSavedId&&s.kind==='manual'):null;
  if(saves.length>=calculatorSaveLimit&&!existing){message.textContent=t('calculator.saveLimit');return;}
  const id=existing?.id||'save-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),item=makeSavedRecord(state,values,{title,manual,id,created:existing?.created||Date.now()});
  try{writeSavedCalculations(storage,[item,...saves.filter(s=>s.id!==id)]);saves=readSavedCalculations(storage);
   if(manual){const next=clone();Object.assign(next.comparison,{manualLocked:false,manualSavedId:id,manualName:title,manualCharacterId:meta.characterId,manualLevel:meta.level});commitInput(next);openRecords('manage','calculator.resultSaved',id);}
   else openRecords('manage','calculator.resultSaved',id);
  }catch{message.textContent=t('calculator.storageFailed');}
 };
 const cancelRename=()=>{const id=editingId;editingId='';refreshSaves();host.querySelector(`[data-calc-rename="${id}"]`)?.focus();};
 host.addEventListener('submit',event=>{
  const form=event.target.closest('[data-calc-rename-form]');if(!form)return;event.preventDefault();
  const id=form.dataset.calcRenameForm,field=form.querySelector('input'),name=field.value.trim(),error=form.querySelector('.calc-rename-error');
  const latest=readSavedCalculations(storage),record=latest.find(s=>s.id===id),limit=record?.kind==='manual'?160:768,nextSaves=renamedSavedCalculations(latest,id,name);
  if(!nextSaves){error.textContent=t(!record?'calculator.snapshotDeleted':!name?'calculator.nameRequired':'calculator.nameTooLong',{limit});error.hidden=false;field.focus();return;}
  try{writeSavedCalculations(storage,nextSaves);saves=readSavedCalculations(storage);
   if(state.comparison.manualSavedId===id&&(state.comparison.manualName===null||state.comparison.manualName===record.name)){const next=clone();next.comparison.manualName=name;commitInput(next);}
   editingId='';highlightId=id;host.querySelector('#calc-record-search').value='';refreshSaves();host.querySelector('#calc-records-status').textContent=t('calculator.renamed');host.querySelector(`[data-calc-rename="${id}"]`)?.focus({preventScroll:true});host.querySelector(`[data-calc-record="${id}"]`)?.scrollIntoView({block:'nearest'});
  }catch{error.textContent=t('calculator.storageFailed');error.hidden=false;}
 });
 host.addEventListener('keydown',event=>{if(event.key==='Escape'&&event.target.closest('[data-calc-rename-form]')){event.preventDefault();event.stopPropagation();cancelRename();}});
 const setSource=(side,mode)=>{const next=clone();if(side==='left')next.comparison.leftMode=mode;else next.comparison.mode=mode;commit(next,`#calc-${side}-tab-${mode}`,false);if(mode==='saved'&&!(side==='left'?next.comparison.leftSavedId:next.comparison.savedId))root.querySelector(`[data-calc-open-records="${side}"]`)?.click();};
 // Focus and mouse clicks select the whole stat so typing replaces the current value.
 const selectStats=event=>{if(event.target.matches('[data-calc-stat-input]'))event.target.select();};
 host.addEventListener('focusin',selectStats);
 host.addEventListener('mouseup',event=>{if(event.target.matches('[data-calc-stat-input]')&&event.target.dataset.calcSelectOnMouseup){event.preventDefault();event.target.select();delete event.target.dataset.calcSelectOnMouseup;}});
 host.addEventListener('pointerdown',event=>{if(event.target.matches('[data-calc-stat-input]')&&event.pointerType==='mouse')event.target.dataset.calcSelectOnMouseup='true';});
 host.addEventListener('input',event=>{
  const match=event.target.id.match(/^calc-comp-(hp|str|mag|spd|dex|def|res|lck|cha)$/),next=clone();
  if(match)next.comparison.stats[match[1]]=numeric(event.target);
  else if(event.target.id==='calc-manual-name')next.comparison.manualName=event.target.value;
  else return;
  commitInput(next);
 });
 host.addEventListener('keydown',event=>{const tab=event.target.closest('[data-calc-tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=[...tab.parentElement.querySelectorAll('[data-calc-tab]')],index=tabs.indexOf(tab),next=event.key==='Home'?tabs[0]:event.key==='End'?tabs.at(-1):tabs[(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];const [side,mode]=next.dataset.calcTab.split(':');setSource(side,mode);});
 host.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.calcRename){editingId=button.dataset.calcRename;refreshSaves();const field=host.querySelector('#calc-rename-'+editingId);field?.focus();field?.select();return;}
  if(button.dataset.calcRenameCancel){cancelRename();return;}
  if(button.dataset.calcTab){const [side,mode]=button.dataset.calcTab.split(':');setSource(side,mode);return;}
  if(button.hasAttribute('data-calc-open-records')){openRecords(button.dataset.calcOpenRecords);return;}
  if(button.hasAttribute('data-calc-save-current')){saveRecord(false);return;}
  if(button.hasAttribute('data-calc-save-manual')){saveRecord(true);return;}
  if(button.dataset.calcEditRecord){const saved=saves.find(s=>s.id===button.dataset.calcEditRecord&&s.kind==='manual');if(!saved)return;const next=clone();Object.assign(next.comparison,{mode:'manual',stats:{...saved.values},manualName:saved.name,manualCharacterId:saved.characterId,manualLevel:saved.level,manualSavedId:saved.id,manualLocked:false});commit(next,'#calc-manual-name',false);return;}
  if(button.hasAttribute('data-calc-fill-expected')){const source=comparisonSides(state,result(),saves).left;if(!source?.values||!keys.every(k=>Number.isFinite(source.values[k])))return;const next=clone(),id=recordCharacterId(source),level=recordLevel(source);if(manualMetadata(state).characterId!==id||manualMetadata(state).level!==level)next.comparison.manualSavedId='';Object.assign(next.comparison,{stats:Object.fromEntries(keys.map(k=>[k,integerStat(source.values[k])])),manualCharacterId:id,manualLevel:level});commit(next,'#calc-comp-hp',false);return;}
  if(button.dataset.calcChoose){const [side,id]=button.dataset.calcChoose.split(':'),next=clone();if(side==='left'){next.comparison.leftMode='saved';next.comparison.leftSavedId=id;}else{next.comparison.mode='saved';next.comparison.savedId=id;}closeRecords();commit(next,`#calc-${side}-tab-saved`,false);root.querySelector('#calc-comparison-title')?.scrollIntoView({block:'start'});return;}
  if(button.dataset.calcLoad){const saved=saves.find(s=>s.id===button.dataset.calcLoad);if(!saved||saved.kind==='manual')return;closeRecords();commit(resolveCalculatorState(saved.state),'#calc-character',false,'calculator.loaded');root.querySelector('.growth-calculator')?.scrollIntoView({block:'start'});return;}
  if(button.dataset.calcDelete){try{const id=button.dataset.calcDelete,record=saves.find(s=>s.id===id);writeSavedCalculations(storage,saves.filter(s=>s.id!==id));saves=readSavedCalculations(storage);if(state.comparison.manualSavedId===id){const next=clone();next.comparison.manualName??=record?.name;next.comparison.manualSavedId='';commitInput(next);}if(editingId===id)editingId='';refreshSaves();host.querySelector('#calc-records-status').textContent=t('calculator.deleted');host.querySelector('[data-calc-dialog-close]').focus();}catch{host.querySelector('#calc-records-status').textContent=t('calculator.storageFailed');}}
 });
 host.querySelector('[data-calc-share]').addEventListener('click',async()=>{
  const url=new URL(location.href);url.search=stateQuery({type:'calculator',calculator:clone()},{share:true});url.hash='';
  try{await navigator.clipboard.writeText(url.href);root.querySelector('#calc-status').textContent=t('calculator.copied');}catch{root.querySelector('#calc-status').textContent=t('calculator.copyFailed');}
 });
 const storageChanged=event=>{if(event.key==='fw-growth-calculator-saves-v1'){saves=readSavedCalculations(storage);refreshSaves();}};window.addEventListener('storage',storageChanged);
 return ()=>{cleanup();cleanupTips();cleanupStats();if(dialog.open)dialog.close();window.removeEventListener('storage',storageChanged);};
}
