import {writeCalculatorDraft,calculatorKeys as keys} from './growth-calculator-state.mjs';
import {stateQuery} from './routing.mjs';
import {calculatorData,calculatorCharacters,calculatorClasses,startsFor,buildFromPreset,initialCalculatorState,resetCalculatorState,resolveCalculatorState} from './growth-calculator-data.mjs';
import {recommendedStages,compatibleMounts,sortStages,activeBuild,integerStat} from './growth-calculator-plans.mjs';
import {calculatorResultsHtml,calculatorLevelRows,calculatorTargetValid,canAddCalculatorStage} from './growth-calculator-ui.mjs';
import {finalClassBonusHtml,finalEffectHtml,warriorBloodTitle,warriorBloodLevel,warriorBloodThresholds,battalionConditionText} from './growth-calculator-final-ui.mjs';
import {calculateBuild} from './growth-calculator-model.mjs';
import {bindCalculatorPickers} from './growth-calculator-picker.mjs';
import {readSavedCalculations,writeSavedCalculations,calculatorSaveLimit,renamedSavedCalculations,movedRecordIds,droppedRecordIds,orderedSavedCalculations,savedCalculationsWithRecord} from './growth-calculator-saves.mjs';
import {savedCalculationsHtml,comparisonHtml,refreshComparisonMetrics} from './growth-calculator-comparison-ui.mjs';
import {makeSavedRecord,recordTitle,manualMetadata,matchingCalculation,comparisonSides,recordCharacterId,manualEquipmentContext,copiedExpectedComparison,resetManualComparison} from './growth-calculator-records.mjs';
import {comparisonView} from './growth-calculator-evaluation.mjs';
import {recordDisplayValues} from './growth-calculator-equipment.mjs';
import {multiRecordModel,validRecordDraft,copiedRecordDraft} from './growth-calculator-multi-model.mjs';
import {bindStatBreakdowns} from './growth-calculator-stat-ui.mjs';
import {bindStageGrowthTips} from './growth-calculator-stage-ui.mjs';
import {bindRecordReordering} from './growth-calculator-record-drag.mjs';
export function bindGrowthCalculator(root,{state:input,t,change}){
 const host=root.querySelector('[data-growth-calculator]');if(!host)return;
 const state=resolveCalculatorState(input.calculator,input.calculatorCharacter),lang=host.dataset.lang,clone=()=>JSON.parse(JSON.stringify(state)),numeric=el=>el.value===''?'':Number(el.value);
 let storage;try{storage=localStorage;}catch{}
 let session;try{session=sessionStorage;}catch{}
 let saves=readSavedCalculations(storage);
 const status=key=>{const el=host.querySelector('#calc-status');if(el)el.textContent=t(key);};
 const result=()=>calculateBuild(calculatorData,state.characterId,activeBuild(state.builds[0],state.target),state.target);
 state.comparison.recordLines=multiRecordModel(state,result(),saves).lineSlots;
 const commit=(next,focus,replace=true,message)=>{
  next.compare=false;
  next.comparison.recordLines=multiRecordModel(next,calculateBuild(calculatorData,next.characterId,activeBuild(next.builds[0],next.target),next.target),saves).lineSlots;
  change(next,focus,{replace});
  writeCalculatorDraft(session,next);
  if(message){const el=root.querySelector('#calc-status');if(el)el.textContent=t(message);}
 };
 const dialog=host.querySelector('#calc-records-dialog');let opener,openerSelector,recordTarget='manage',highlightId='',editingId='',recordEditingId='';
 const showComparison=(out=result())=>{host.querySelector('#calc-comparison-result').innerHTML=comparisonHtml(state,out,saves,{t,lang,recordEditingId});refreshComparisonMetrics(host,state,out,saves,{t,lang});};
 const commitInput=next=>{Object.assign(state,next);const out=result();state.comparison.recordLines=multiRecordModel(state,out,saves).lineSlots;change(next,null,{replace:true,render:false});writeCalculatorDraft(session,next);refreshComparisonMetrics(host,state,out,saves,{t,lang});};
 const refreshSaves=()=>{
  const othersOpen=host.querySelector('[data-calc-other-records]')?.open;
  host.querySelector('#calc-saves').innerHTML=savedCalculationsHtml(saves,{t,lang,characterId:state.characterId,highlightId,editingId});
  if(othersOpen)host.querySelector('[data-calc-other-records]')?.setAttribute('open','');
  host.querySelectorAll('[data-calc-choose]').forEach(button=>{button.hidden=recordTarget!=='manage'&&!button.dataset.calcChoose.startsWith(recordTarget+':');});
  host.querySelectorAll('[data-calc-load]').forEach(button=>{button.hidden=recordTarget!=='manage';});
  showComparison();
 };
 const openRecords=(target='manage',message,savedId='')=>{
  recordTarget=target;highlightId=savedId;editingId='';recordEditingId='';opener=document.activeElement;openerSelector=opener?.id?'#'+opener.id:opener?.hasAttribute('data-calc-save-manual')?'#calc-comp-hp':`[data-calc-open-records="${target}"]`;
  host.querySelector('#calc-records-title').textContent=t(target==='left'?'calculator.selectLeft':target==='right'?'calculator.selectRight':'calculator.saveList');
  host.querySelector('#calc-records-status').textContent=message?t(message):'';
  host.querySelector('[data-calc-other-records]')?.removeAttribute('open');refreshSaves();if(!dialog.open)dialog.showModal();host.querySelector('.calc-dialog-body').scrollTop=0;host.querySelector('[data-calc-dialog-close]').focus();if(highlightId)host.querySelector(`[data-calc-record="${highlightId}"]`)?.scrollIntoView({block:'nearest'});
 };
 const closeRecords=()=>dialog.close();
 const commitRecords=(next,focus)=>{Object.assign(state,next);const out=result();state.comparison.recordLines=multiRecordModel(state,out,saves).lineSlots;change(next,null,{replace:true,render:false});writeCalculatorDraft(session,next);showComparison(out);if(focus){const target=host.querySelector(focus);(target?.closest('[hidden]')?host.querySelector('[data-calc-record-add]'):target)?.focus({preventScroll:true});}};
 const toggleRecord=(id,checked)=>{const next=clone(),model=multiRecordModel(state,result(),saves);next.comparison.recordIds=[...new Set(checked?[...model.ids,id]:model.ids.filter(key=>key!==id))];commitInput(next);};
 const reorderRecord=(id,scope,{direction,target,placement}={})=>{
  const popup=scope==='saved',latest=readSavedCalculations(storage),model=multiRecordModel(state,result(),latest),ids=model.rows.map(r=>r.key),move=(order,visible)=>target?droppedRecordIds(order,id,target,placement,visible):movedRecordIds(order,id,direction,visible);let order,nextSaves;
  if(popup){const record=latest.find(s=>s.id===id);if(!record)return;const current=recordCharacterId(record)===state.characterId,group=latest.filter(s=>(recordCharacterId(s)===state.characterId)===current).map(s=>s.id),moved=move(latest.map(s=>s.id),group);if(!moved)return;nextSaves=orderedSavedCalculations(latest,moved);const queue=moved.filter(key=>group.includes(key));order=ids.map(key=>group.includes(key)?queue.shift():key);}
  else{order=move(ids,model.rows.filter(r=>r.visible).map(r=>r.key));if(!order)return;nextSaves=orderedSavedCalculations(latest,order);}
  try{if(nextSaves.some((s,i)=>s.id!==latest[i]?.id))writeSavedCalculations(storage,nextSaves);saves=readSavedCalculations(storage);const next=clone();next.comparison.recordOrder=order;commitInput(next);refreshSaves();const row=host.querySelector(popup?`[data-calc-record="${id}"]`:`[data-multi-row="${id}"]`);row?.querySelector('[data-calc-record-drag]')?.focus({preventScroll:true});row?.scrollIntoView({block:'nearest'});host.querySelector(popup?'#calc-records-status':'#calc-status').textContent=t('calculator.recordMoved');}catch{host.querySelector(popup?'#calc-records-status':'#calc-status').textContent=t('calculator.storageFailed');}
 };
 const cleanupReordering=bindRecordReordering(host,{onMove:(id,direction,scope)=>reorderRecord(id,scope,{direction}),onDrop:(id,target,placement,scope)=>reorderRecord(id,scope,{target,placement}),onHint:scope=>{host.querySelector(scope==='saved'?'#calc-records-status':'#calc-status').textContent=t('calculator.dragHelp');}});
 dialog.addEventListener('keydown',event=>{if(event.key==='Escape'&&!event.target.closest('[data-calc-rename-form]')){event.preventDefault();event.stopPropagation();const open=event.target.closest('.calc-record-more[open]')||dialog.querySelector('.calc-record-more[open]');if(open){open.open=false;open.querySelector('summary').focus();}else closeRecords();}});
 dialog.addEventListener('close',()=>{const target=opener?.isConnected?opener:host.querySelector(openerSelector);target?.focus({preventScroll:true});});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)closeRecords();});
 host.querySelector('[data-calc-dialog-close]').addEventListener('click',closeRecords);
 refreshSaves();
 const cleanupTips=bindStageGrowthTips(host),cleanupStats=bindStatBreakdowns(host,{t,lang});
 const cleanup=bindCalculatorPickers(host,(id,value,route)=>{
  if(id==='calc-character'){commit(initialCalculatorState(value,route),'#calc-character',false);return;}
  if(id==='calc-battalion'){const next=clone();next.battalionAdded=true;next.battalionId=value;commit(next,'#calc-battalion',false);return;}
  if(id==='calc-start-level'){const next=clone(),p=startsFor(next.characterId).find(p=>p.id===value);if(!p)return;next.builds[0]=buildFromPreset(p);if(Number.isInteger(next.target)&&next.target<p.level)next.target=p.level;commit(next,'#calc-start-level',false);return;}
  const match=id.match(/^calc-stage-(\d+)-(class|mount)$/);if(!match)return;
  const next=clone(),stage=next.builds[0].stages[Number(match[1])];
  if(match[2]==='class'){stage.classId=value;if(!compatibleMounts(next.characterId,value).some(m=>m.id===stage.mountId))stage.mountId='';}
  else stage.mountId=value;
  stage.bond=5;commit(next,'#'+id,false);
 },{onRoute:(_id,route)=>{const next=clone();next.recruitmentRoute=route;commitInput(next);}});
 host.querySelector('#calc-target').addEventListener('input',event=>{
  const next=clone();next.target=numeric(event.target);commitInput(next);const out=result(),valid=calculatorTargetValid(state);
  host.querySelector('.calc-results').innerHTML=calculatorResultsHtml(state,out,{t,lang});host.querySelector('[data-calc-disclosure="levels"] tbody').innerHTML=calculatorLevelRows(out,state);
  host.querySelector('[data-calc-level-ups]').textContent=valid?t('calculator.levelUps',{count:state.target-state.builds[0].level}):'—';
  host.querySelector('[data-calc-autofill]').disabled=!valid;host.querySelector('[data-calc-add]').disabled=!canAddCalculatorStage(state);event.target.setAttribute('aria-invalid',String(!valid));
  host.querySelectorAll('[data-calc-stage]').forEach(row=>row.closest('.calc-stage-group').classList.toggle('calc-stage-future',state.builds[0].stages[Number(row.dataset.calcStage)].level>state.target));
  host.querySelector('[data-calc-future-stages]').hidden=!state.builds[0].stages.some(s=>s.level>state.target);
  host.querySelectorAll('[data-calc-final-stage]').forEach(el=>el.innerHTML=finalClassBonusHtml(state,Number(el.dataset.calcFinalStage),{t,lang}));
  host.querySelectorAll('[data-calc-final-effect]').forEach(el=>el.innerHTML=finalEffectHtml(state,el.dataset.calcFinalEffect,{t,lang}));
  const armyCondition=host.querySelector('[data-calc-battalion-condition]');if(armyCondition)armyCondition.textContent=battalionConditionText(state,{t});
  const bloodTitle=host.querySelector('[data-calc-blood-title]');if(bloodTitle){bloodTitle.textContent=warriorBloodTitle(state,{t});host.querySelector('[data-calc-blood-level]').textContent=warriorBloodLevel(state,{t});host.querySelector('[data-calc-blood-thresholds]').innerHTML=warriorBloodThresholds(state,{t,lang});}
  showComparison(out);
 });
 host.querySelector('[data-calc-autofill]').addEventListener('click',()=>{
  const next=clone();next.builds[0].stages=recommendedStages(next.characterId,next.builds[0],next.target);commit(next,'[data-calc-autofill]',false,'calculator.autofilled');
 });
 host.querySelector('[data-calc-reset]').addEventListener('click',()=>{
  commit(resetCalculatorState(state),'[data-calc-reset]',false,'calculator.resetDone');
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
 host.addEventListener('change',event=>{
  if(event.target.hasAttribute('data-calc-record-check')){toggleRecord(event.target.dataset.calcRecordCheck,event.target.checked);return;}
  if(event.target.hasAttribute('data-calc-record-others')){const next=clone();next.comparison.recordIds=multiRecordModel(state,result(),saves).ids;next.comparison.includeOtherRecords=event.target.checked;commitInput(next);return;}
  if(event.target.id==='calc-mu-weapon'){const next=clone();next.weapon=event.target.value;commit(next,'#calc-mu-weapon',false);return;}
 });
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
  const order=multiRecordModel(state,out,saves).rows.map(r=>r.key);
  try{writeSavedCalculations(storage,savedCalculationsWithRecord(saves,item));saves=readSavedCalculations(storage);
   const ordered=clone();ordered.comparison.recordOrder=existing?order:[...order,id];ordered.comparison.recordIds=multiRecordModel(state,out,saves).ids;commitInput(ordered);
   if(manual){const next=clone();Object.assign(next.comparison,{manualLocked:false,manualSavedId:id,manualName:title,manualCharacterId:meta.characterId,manualLevel:meta.level});commitInput(next);openRecords('manage','calculator.resultSaved',id);}
   else openRecords('manage','calculator.resultSaved',id);
  }catch{message.textContent=t('calculator.storageFailed');}
 };
 const cancelRecordRename=()=>{const id=recordEditingId;recordEditingId='';showComparison();host.querySelector(`[data-calc-multi-more="${id}"]`)?.focus({preventScroll:true});};
 const cancelRename=()=>{const id=editingId;editingId='';refreshSaves();host.querySelector(`[data-calc-record-more="${id}"]`)?.focus();};
 host.addEventListener('submit',event=>{
  const form=event.target.closest('[data-calc-rename-form],[data-calc-inline-rename-form]');if(!form)return;event.preventDefault();
  const inline=form.hasAttribute('data-calc-inline-rename-form'),id=inline?form.dataset.calcInlineRenameForm:form.dataset.calcRenameForm,field=form.querySelector('input'),name=field.value.trim(),error=form.querySelector('.calc-rename-error');
  const latest=readSavedCalculations(storage),record=latest.find(s=>s.id===id),limit=record?.kind==='manual'?160:768,nextSaves=renamedSavedCalculations(latest,id,name);
  if(!nextSaves){error.textContent=t(!record?'calculator.snapshotDeleted':!name?'calculator.nameRequired':'calculator.nameTooLong',{limit});error.hidden=false;field.focus();return;}
  try{writeSavedCalculations(storage,nextSaves);saves=readSavedCalculations(storage);
   if(state.comparison.manualSavedId===id&&(state.comparison.manualName===null||state.comparison.manualName===record.name)){const next=clone();next.comparison.manualName=name;commitInput(next);}
   if(inline){recordEditingId='';showComparison();host.querySelector('#calc-status').textContent=t('calculator.renamed');host.querySelector(`[data-calc-multi-more="${id}"]`)?.focus({preventScroll:true});return;}
   editingId='';highlightId=id;refreshSaves();host.querySelector('#calc-records-status').textContent=t('calculator.renamed');host.querySelector(`[data-calc-record-more="${id}"]`)?.focus({preventScroll:true});host.querySelector(`[data-calc-record="${id}"]`)?.scrollIntoView({block:'nearest'});
  }catch{error.textContent=t('calculator.storageFailed');error.hidden=false;}
 });
 host.addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(event.target.closest('[data-calc-inline-rename-form]')){event.preventDefault();event.stopPropagation();cancelRecordRename();return;}if(event.target.closest('[data-calc-rename-form]')){event.preventDefault();event.stopPropagation();cancelRename();return;}const menu=event.target.closest('.calc-multi-menu[open]');if(menu){event.preventDefault();event.stopPropagation();menu.open=false;menu.querySelector('summary').focus();}});
 host.addEventListener('toggle',event=>{const menu=event.target;if(!menu.matches('.calc-multi-menu')||!menu.open)return;for(const other of host.querySelectorAll('.calc-multi-menu[open]'))if(other!==menu)other.open=false;menu.scrollIntoView({block:'nearest'});},true);
 const setSource=(side,mode)=>{const next=clone();if(side==='left')next.comparison.leftMode=mode;else next.comparison.mode=mode;commit(next,`#calc-${side}-tab-${mode}`,false);if(mode==='saved'&&!(side==='left'?next.comparison.leftSavedId:next.comparison.savedId))root.querySelector(`[data-calc-open-records="${side}"]`)?.click();};
 // Focus and mouse clicks select the whole stat so typing replaces the current value.
 const selectStats=event=>{if(event.target.matches('[data-calc-stat-input],.calc-quick-stats input'))event.target.select();};
 host.addEventListener('focusin',selectStats);
 host.addEventListener('mouseup',event=>{if(event.target.matches('[data-calc-stat-input],.calc-quick-stats input')&&event.target.dataset.calcSelectOnMouseup){event.preventDefault();event.target.select();delete event.target.dataset.calcSelectOnMouseup;}});
 host.addEventListener('pointerdown',event=>{if(event.target.matches('[data-calc-stat-input],.calc-quick-stats input')&&event.pointerType==='mouse')event.target.dataset.calcSelectOnMouseup='true';});
 host.addEventListener('input',event=>{
  if(event.target.hasAttribute('data-calc-record-draft')){const next=clone(),key=event.target.dataset.calcRecordDraft;if(key==='name')next.comparison.recordDraft.name=event.target.value;else if(key==='level')next.comparison.recordDraft.level=numeric(event.target);else next.comparison.recordDraft.stats[key]=numeric(event.target);commitInput(next);return;}
  const match=event.target.id.match(/^calc-comp-(hp|str|mag|spd|dex|def|res|lck|cha)$/),next=clone(),legacy=state.comparison.valueBasis!=='total';
  if(match){if(!next.comparison.context)next.comparison.context=manualEquipmentContext(state);if(next.comparison.valueBasis!=='total'){const meta=manualMetadata(state);next.comparison.stats=recordDisplayValues({kind:'manual',...meta,context:next.comparison.context,values:state.comparison.stats});}next.comparison.valueBasis='total';next.comparison.stats[match[1]]=numeric(event.target);}
  else if(event.target.id==='calc-manual-name')next.comparison.manualName=event.target.value;
  else return;
  commitInput(next);
  if(match&&legacy)for(const key of keys){const field=host.querySelector('#calc-comp-'+key);if(field&&field!==event.target)field.value=next.comparison.stats[key];}
 });
 host.addEventListener('keydown',event=>{const purpose=event.target.closest('[data-calc-purpose]');if(purpose&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=clone(),mode=event.key==='Home'?'evaluation':event.key==='End'?'records':purpose.dataset.calcPurpose==='records'?'evaluation':'records';next.comparison.purpose=mode;commit(next,'#calc-purpose-'+mode,false);return;}const tab=event.target.closest('[data-calc-tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=[...tab.parentElement.querySelectorAll('[data-calc-tab]')],index=tabs.indexOf(tab),next=event.key==='Home'?tabs[0]:event.key==='End'?tabs.at(-1):tabs[(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];const [side,mode]=next.dataset.calcTab.split(':');setSource(side,mode);});
 host.addEventListener('click',event=>{
  const row=event.target.closest('[data-multi-row]');if(row&&!event.target.closest('input,label,button,a,summary,details')){const input=row.querySelector('[data-calc-record-check]');if(!input.disabled)toggleRecord(input.dataset.calcRecordCheck,!input.checked);return;}
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-calc-record-copy')){const row=multiRecordModel(state,result(),saves).rows.find(r=>r.key===button.dataset.calcRecordCopy);if(!row)return;const draft=copiedRecordDraft(row,t('calculator.recordCopyName',{name:row.name||t(row.kind==='current'?'calculator.currentRecord':'calculator.enteredStats')}));if(!draft){status('calculator.inputInvalid');return;}recordEditingId='';const next=clone();next.comparison.recordDraft=draft;next.comparison.recordOrder=[...multiRecordModel(state,result(),saves).rows.map(r=>r.key).filter(key=>key!=='draft:'),'draft:'];next.comparison.recordIds=[...new Set([...multiRecordModel(state,result(),saves).ids,'draft:'])];commitRecords(next,'#calc-record-draft-hp');return;}
  if(button.hasAttribute('data-calc-inline-rename')){const id=button.dataset.calcInlineRename;if(id==='draft:'){host.querySelector('#calc-record-draft-name')?.focus();return;}recordEditingId=id;showComparison();const field=host.querySelector('#calc-inline-rename-'+id);field?.focus();field?.select();return;}
  if(button.hasAttribute('data-calc-inline-rename-cancel')){cancelRecordRename();return;}
  if(button.hasAttribute('data-calc-inline-delete')&&button.dataset.calcInlineDelete!=='draft:'){const id=button.dataset.calcInlineDelete;try{const latest=readSavedCalculations(storage),record=latest.find(s=>s.id===id);if(!record)return;writeSavedCalculations(storage,latest.filter(s=>s.id!==id));saves=readSavedCalculations(storage);const next=clone();next.comparison.recordIds=multiRecordModel(state,result(),saves).ids.filter(key=>key!==id);if(next.comparison.manualSavedId===id){next.comparison.manualName??=record.name;next.comparison.manualSavedId='';}if(next.comparison.savedId===id){next.comparison.savedId='';next.comparison.mode='manual';}if(next.comparison.leftSavedId===id){next.comparison.leftSavedId='';next.comparison.leftMode='current';}recordEditingId='';commitRecords(next,'[data-calc-record-check="current:"]');host.querySelector('#calc-status').textContent=t('calculator.deleted');}catch{host.querySelector('#calc-status').textContent=t('calculator.storageFailed');}return;}
  if(button.hasAttribute('data-calc-record-add')){const next=clone();next.comparison.recordOrder=[...multiRecordModel(state,result(),saves).rows.map(r=>r.key),'draft:'];next.comparison.recordIds=[...new Set([...multiRecordModel(state,result(),saves).ids,'draft:'])];next.comparison.recordDraft={name:'',characterId:state.characterId,level:state.target,stats:Object.fromEntries(keys.map(k=>[k,'']))};commitRecords(next,'#calc-record-draft-hp');return;}
  if(button.hasAttribute('data-calc-record-cancel')||button.dataset.calcInlineDelete==='draft:'){const next=clone();next.comparison.recordDraft=null;next.comparison.recordIds=multiRecordModel(state,result(),saves).ids.filter(id=>id!=='draft:');commitRecords(next,'[data-calc-record-add]');return;}
  if(button.hasAttribute('data-calc-record-save')){const draft=state.comparison.recordDraft,message=host.querySelector('[data-calc-record-draft-status]');if(!validRecordDraft(draft))return;saves=readSavedCalculations(storage);if(saves.length>=calculatorSaveLimit){message.hidden=false;message.textContent=t('calculator.saveLimit');return;}const id='save-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),record={id,name:draft.name?.trim()||t('calculator.manualTab')+' · Lv'+draft.level,kind:'manual',characterId:draft.characterId||state.characterId,level:draft.level,basis:'total',context:null,created:Date.now(),values:{...draft.stats}};const order=multiRecordModel(state,result(),saves).rows.map(r=>r.key);try{writeSavedCalculations(storage,savedCalculationsWithRecord(saves,record));saves=readSavedCalculations(storage);const next=clone();next.comparison.recordIds=[...new Set(multiRecordModel(state,result(),saves).ids.map(key=>key==='draft:'?id:key))];next.comparison.recordDraft=null;next.comparison.recordLines=next.comparison.recordLines?.map(([key,slot])=>[key==='draft:'?id:key,slot])||null;next.comparison.recordOrder=order.map(key=>key==='draft:'?id:key);commitRecords(next,`[data-calc-record-check="${id}"]`);host.querySelector('#calc-status').textContent=t('calculator.resultSaved');}catch{message.hidden=false;message.textContent=t('calculator.storageFailed');}return;}
  if(button.dataset.calcPurpose){const next=clone();next.comparison.purpose=button.dataset.calcPurpose;commit(next,'#calc-purpose-'+button.dataset.calcPurpose,false);return;}
  if(button.hasAttribute('data-calc-add-battalion')){const next=clone();next.battalionAdded=true;commit(next,'#calc-battalion',false);root.querySelector('#calc-battalion')?.click();return;}
  if(button.hasAttribute('data-calc-clear-battalion')){const next=clone();next.battalionId='';next.battalionAdded=false;commit(next,'[data-calc-add-battalion]',false);return;}
  if(button.dataset.calcRename){editingId=button.dataset.calcRename;refreshSaves();const field=host.querySelector('#calc-rename-'+editingId);field?.focus();field?.select();return;}
  if(button.dataset.calcRenameCancel){cancelRename();return;}
  if(button.dataset.calcTab){const [side,mode]=button.dataset.calcTab.split(':');setSource(side,mode);return;}
  if(button.hasAttribute('data-calc-open-records')){openRecords(button.dataset.calcOpenRecords);return;}
  if(button.hasAttribute('data-calc-save-current')){saveRecord(false);return;}
  if(button.hasAttribute('data-calc-reset-manual')){const next=clone();next.comparison=resetManualComparison(state);commit(next,'#calc-comp-hp',false);return;}
  if(button.hasAttribute('data-calc-save-manual')){saveRecord(true);return;}
  if(button.dataset.calcEditRecord){const saved=saves.find(s=>s.id===button.dataset.calcEditRecord&&s.kind==='manual');if(!saved)return;const next=clone();Object.assign(next.comparison,{mode:'manual',stats:{...saved.values},manualName:saved.name,manualCharacterId:saved.characterId,manualLevel:saved.level,manualSavedId:saved.id,manualLocked:false,context:saved.context||null,valueBasis:saved.basis==='total'?'total':'base'});commit(next,'#calc-manual-name',false);return;}
  if(button.hasAttribute('data-calc-fill-expected')){const comparison=copiedExpectedComparison(state,comparisonView(state,result(),saves).left);if(!comparison)return;const next=clone();next.comparison=comparison;commit(next,'#calc-comp-hp',false);return;}
  if(button.dataset.calcChoose){const [side,id]=button.dataset.calcChoose.split(':'),next=clone();if(side==='left'){next.comparison.purpose='records';next.comparison.leftMode='saved';next.comparison.leftSavedId=id;next.comparison.recordIds=[...new Set([...multiRecordModel(state,result(),saves).ids,id])];if(recordCharacterId(saves.find(s=>s.id===id))!==state.characterId)next.comparison.includeOtherRecords=true;}else{next.comparison.purpose='evaluation';next.comparison.mode='saved';next.comparison.savedId=id;}closeRecords();commit(next,side==='left'?`[data-calc-record-check="${id}"]`:'#calc-right-tab-saved',false);root.querySelector('#calc-comparison-title')?.scrollIntoView({block:'start'});return;}
  if(button.dataset.calcLoad){const saved=saves.find(s=>s.id===button.dataset.calcLoad);if(!saved||saved.kind==='manual')return;closeRecords();commit(resolveCalculatorState(saved.state),'#calc-character',false,'calculator.loaded');root.querySelector('.growth-calculator')?.scrollIntoView({block:'start'});return;}
  if(button.dataset.calcDelete){try{const id=button.dataset.calcDelete,record=saves.find(s=>s.id===id);writeSavedCalculations(storage,saves.filter(s=>s.id!==id));saves=readSavedCalculations(storage);if(state.comparison.manualSavedId===id||state.comparison.recordIds?.includes(id)){const next=clone();if(next.comparison.manualSavedId===id){next.comparison.manualName??=record?.name;next.comparison.manualSavedId='';}if(next.comparison.recordIds)next.comparison.recordIds=next.comparison.recordIds.filter(key=>key!==id);commitInput(next);}if(editingId===id)editingId='';refreshSaves();host.querySelector('#calc-records-status').textContent=t('calculator.deleted');host.querySelector('[data-calc-dialog-close]').focus();}catch{host.querySelector('#calc-records-status').textContent=t('calculator.storageFailed');}}
 });
 host.querySelector('[data-calc-share]').addEventListener('click',async()=>{
  const url=new URL(location.href);url.search=stateQuery({type:'calculator',calculator:clone()},{share:true});url.hash='';
  try{await navigator.clipboard.writeText(url.href);root.querySelector('#calc-status').textContent=t('calculator.copied');}catch{root.querySelector('#calc-status').textContent=t('calculator.copyFailed');}
 });
 const storageChanged=event=>{if(event.key==='fw-growth-calculator-saves-v1'){saves=readSavedCalculations(storage);refreshSaves();}};window.addEventListener('storage',storageChanged);
 return ()=>{cleanupReordering();cleanup();cleanupTips();cleanupStats();if(dialog.open)dialog.close();window.removeEventListener('storage',storageChanged);};
}
