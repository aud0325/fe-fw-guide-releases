import {calculatorData,calculatorCharacters,calculatorClasses} from './growth-calculator-data.mjs';
import {calculatorKeys as keys} from './growth-calculator-state.mjs';
import {activeBuild,integerStat} from './growth-calculator-plans.mjs';
import {currentEquipment,recordDisplayValues} from './growth-calculator-equipment.mjs';
const name=(entry,lang)=>entry?.name?.[lang]||entry?.name?.en||'—';
export const recordCharacterId=record=>record?.kind==='manual'?record.characterId:record?.state?.characterId;
export const recordLevel=record=>record?.kind==='manual'?record.level:record?.state?.target;
export function comparisonStatLabels(state,{t}){
 return {reference:t(state.comparison.purpose!=='records'?'calculator.standardStats':state.comparison.leftMode==='saved'?'calculator.referenceRole':'calculator.expectedStats'),target:t(state.comparison.mode==='saved'?'calculator.targetRole':'calculator.enteredStats')};
}
export function manualMetadata(state,lang='ko'){
 const c=state.comparison;return {name:c.manualName??(lang==='ko'?'내 육성정보':'My training'),characterId:c.manualCharacterId||state.characterId,level:c.manualLevel===''?state.target:c.manualLevel};
}
export function pathDescription(state,lang='ko',{levels=true}={}){
 return activeBuild(state.builds[0],state.target).stages.map(s=>`${levels?'Lv'+s.level+' ':''}${name(calculatorClasses.find(c=>c.id===s.classId),lang)}${s.mountId?'*':''}`).join(' → ');
}
export function recordTitle(state,lang='ko',manual=false){
 if(manual)return manualMetadata(state,lang).name;
 const character=calculatorCharacters.find(c=>c.id===state.characterId);
 return `${name(character,lang)} Lv${state.target} · ${pathDescription(state,lang,{levels:false})}`.slice(0,768);
}
export function makeSavedRecord(state,values,{title,manual=false,id,created=Date.now()}){
 const common={id,name:title,created,basis:'total',values:manual?Object.fromEntries(keys.map(k=>[k,integerStat(values[k])])):recordDisplayValues({state,values})};
 if(manual){const meta=manualMetadata(state);return {...common,kind:'manual',characterId:meta.characterId,level:meta.level,context:manualEquipmentContext(state)};}
 const snapshot=JSON.parse(JSON.stringify(state));snapshot.compare=false;
 snapshot.comparison={purpose:'evaluation',context:null,valueBasis:'total',mode:'manual',savedId:'',leftMode:'current',leftSavedId:'',manualName:null,manualCharacterId:'',manualLevel:'',manualLocked:false,manualSavedId:'',stats:Object.fromEntries(keys.map(k=>[k,'']))};
 snapshot.builds=[snapshot.builds[0]];return {...common,state:snapshot};
}
export function comparisonSides(state,result,saves){
 const c=state.comparison,current={state,values:result.values,kind:'calculated'};
 const meta=manualMetadata(state);
 return {left:c.leftMode==='saved'?saves.find(s=>s.id===c.leftSavedId):current,right:c.mode==='saved'?saves.find(s=>s.id===c.savedId):{kind:'manual',...meta,values:c.stats,basis:c.valueBasis,context:c.valueBasis==='total'?manualEquipmentContext(state):null}};
}
export function copiedExpectedComparison(state,source){
 if(!source?.values||!keys.every(k=>Number.isFinite(source.values[k])))return null;
 const c=state.comparison,meta=manualMetadata(state),id=recordCharacterId(source),level=recordLevel(source);
 // An empty manual level follows the target; copying stats must retain that link.
 return {...c,stats:recordDisplayValues(source),manualCharacterId:id,manualLevel:c.manualLevel===''?'':level,manualSavedId:meta.characterId===id&&meta.level===level?c.manualSavedId:'',context:source.state?currentEquipment(source.state):source.context,valueBasis:'total'};
}
export function matchingCalculation(state,result,saves){
 if(!result.values)return null;
 const signature=s=>{const b=s.builds[0];return JSON.stringify([s.characterId,s.target,s.weapon,s.battalionId||'',b.presetId,b.level,b.classId,keys.map(k=>b.stats[k]),b.stages.map(p=>[p.level,p.classId,p.mountId,p.bond,p.skill]),keys.map(k=>b.startBonus[k]),keys.map(k=>b.endBonus[k])]);};
 return saves.find(s=>s.kind!=='manual'&&signature(s.state)===signature(state)&&keys.every(k=>recordDisplayValues(s)[k]===recordDisplayValues({state,values:result.values})[k]));
}
export function statComparison(left,right){
 const valid=(value,record)=>Number.isFinite(value)&&value>=0&&(record?.kind!=='manual'||Number.isInteger(value)&&value<=999);
 const aValues=recordDisplayValues(left),bValues=recordDisplayValues(right);
 const rows=keys.map(key=>{const a=valid(aValues[key],left)?aValues[key]:null,b=valid(bValues[key],right)?bValues[key]:null;return {key,left:a,right:b,difference:a!==null&&b!==null?b-a:null};});
 const sum=side=>rows.every(r=>r[side]!==null)?rows.reduce((n,r)=>n+r[side],0):null;
 const leftTotal=sum('left'),rightTotal=sum('right');return {rows,leftTotal,rightTotal,difference:leftTotal!==null&&rightTotal!==null?rightTotal-leftTotal:null};
}
export {calculatorData};

export function manualInputError(state){
 const c=state.comparison,bad=keys.find(k=>!Number.isInteger(c.stats[k])||c.stats[k]<0||c.stats[k]>999);
 if(bad)return {key:'calculator.fillAllStats',field:'#calc-comp-'+bad};
 if(!manualMetadata(state).name.trim())return {key:'calculator.nameRequired',field:'#calc-manual-name'};
 const meta=manualMetadata(state);if(!calculatorCharacters.some(c=>c.id===meta.characterId)||!Number.isInteger(meta.level)||meta.level<1||meta.level>99)return {key:'calculator.invalidMetadata'};
 if(c.valueBasis!=='total'||!calculatorClasses.some(cls=>cls.id===manualEquipmentContext(state)?.classId))return {key:'calculator.analysis.context',field:'#calc-context-class'};
 return null;
}
export function matchingManualRecord(state,saves,lang='ko'){
 const c=state.comparison,saved=saves.find(s=>s.id===c.manualSavedId&&s.kind==='manual'),meta=manualMetadata(state,lang);
 return saved&&saved.characterId===meta.characterId&&saved.level===meta.level&&saved.name===(c.manualName??saved.name)&&JSON.stringify(saved.context||null)===JSON.stringify(manualEquipmentContext(state))&&keys.every(k=>saved.values[k]===c.stats[k])?saved:null;
}

export function manualEquipmentContext(state){
 const c=state.comparison,meta=manualMetadata(state);
 return c.context||(meta.characterId===state.characterId&&meta.level===state.target?currentEquipment(state):null);
}
