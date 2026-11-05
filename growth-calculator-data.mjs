import {entries} from './data.mjs';
import {growthRows} from './growth-comparison.mjs';
import {recruitmentPresets,classGrowthVariants,classMountTypes,mountGrowthByBond} from './growth-calculator.generated.mjs';
import {calculatorKeys as keys} from './growth-calculator-state.mjs';
import {cleanCalculatorState} from './growth-calculator-state.mjs';
import {sortClasses} from './class-order.mjs';
import {classTierSearchNames} from './class-tiers.mjs';
export {recruitmentPresets,classGrowthVariants};
const rows=growthRows(entries);
export const calculatorCharacters=entries.filter(e=>e.type==='character'&&e.roles?.includes('playable')&&e.growthRates);
export const calculatorClasses=sortClasses(entries.filter(e=>e.type==='class')).map(e=>({id:e.id,type:'class',name:e.name,aliases:[...(e.aliases||[]),...classTierSearchNames(e.category)],growth:e.classStats.growth.values,modifiers:e.classStats.modifiers.values,tier:e.category,mountType:classMountTypes[e.id]||'No'}));
const groups={Horses:'Horse',Ornius:'Ornius',Pegasi:'Pegasus',Dragons:'Bau',Elephants:'Elephant'};
export const calculatorMounts=rows.filter(r=>r.type==='mount').map(r=>({id:r.id,name:r.name,type:groups[r.group.en],growthByBond:mountGrowthByBond[r.id]||{5:r.values}}));
export const calculatorBattalions=entries.filter(e=>e.type==='battalion');
export const calculatorData={characters:calculatorCharacters,classes:calculatorClasses,mounts:calculatorMounts,variants:classGrowthVariants,presets:recruitmentPresets};
export function startsFor(characterId,route){return recruitmentPresets.filter(p=>p.characterId===characterId&&(!route||p.route===route));}
export const zeroStats=()=>Object.fromEntries(keys.map(k=>[k,0]));
// Confirmed companion mounts; only compatible training classes receive a default.
export const calculatorCompanionMounts={io:'rocinan',alexandra:'bucephalus'};
export function defaultCalculatorMount(characterId,classId){const mount=calculatorMounts.find(m=>m.id===calculatorCompanionMounts[characterId]);return mount&&calculatorClasses.find(c=>c.id===classId)?.mountType===mount.type?mount.id:'';}
export function buildFromPreset(p){return {mode:'recruit',route:p.route,presetId:p.id,level:p.level,classId:p.classId,stats:{...p.stats},startBonus:zeroStats(),endBonus:zeroStats(),stages:[{level:p.level,classId:p.classId,mountId:defaultCalculatorMount(p.characterId,p.classId),bond:5,skill:p.characterId==='mu'}]};}
export function initialCalculatorState(characterId='esmeralda',route=''){
 const available=startsFor(characterId,route),p=available.length?available:startsFor(characterId),first=[...p].sort((a,b)=>a.level-b.level)[0];
 const a=first?buildFromPreset(first):{mode:'manual',route:'cai',presetId:'',level:1,classId:'class-commoner',stats:Object.fromEntries(keys.map(k=>[k,''])),startBonus:zeroStats(),endBonus:zeroStats(),stages:[{level:1,classId:'class-commoner',mountId:'',bond:5,skill:characterId==='mu'}]};
 const late=p.find(p=>p.route===a.route&&p.chapter===9&&p.level>a.level);
 const b=late?buildFromPreset(late):JSON.parse(JSON.stringify(a));
 return {v:1,battalionAdded:false,battalionId:'',weapon:'none',recruitmentRoute:route,characterId,target:Math.max(40,a.level,b.level),compare:false,comparison:{recordLines:null,recordOrder:null,recordIds:null,includeOtherRecords:false,recordDraft:null,purpose:'evaluation',context:null,valueBasis:'total',mode:'manual',savedId:'',leftMode:'current',leftSavedId:'',manualName:null,manualCharacterId:'',manualLevel:'',manualLocked:false,manualSavedId:'',stats:Object.fromEntries(keys.map(k=>[k,'']))},builds:[a,b]};
}
export function resetCalculatorState(state){
 const next=initialCalculatorState(state.characterId,state.recruitmentRoute);
 next.comparison.recordIds=['current:'];
 return next;
}
export function resolveCalculatorState(input,characterId){
 const clean=cleanCalculatorState(input),valid=clean&&calculatorCharacters.some(c=>c.id===clean.characterId);
 const state=valid?clean:initialCalculatorState(calculatorCharacters.some(c=>c.id===characterId)?characterId:'esmeralda');
 while(state.builds.length<2)state.builds.push(JSON.parse(JSON.stringify(state.builds[0])));
 for(const build of state.builds){
  if(build.mode!=='recruit'){const nearest=startsFor(state.characterId).sort((a,b)=>Math.abs(a.level-build.level)-Math.abs(b.level-build.level))[0];if(nearest)Object.assign(build,buildFromPreset(nearest));}
  build.endBonus=zeroStats();build.stages=build.stages.map(s=>({...s,bond:5,skill:state.characterId==='mu'||s.skill}));
  let p=recruitmentPresets.find(p=>p.id===build.presetId&&p.characterId===state.characterId);
  if(!p){const rows=startsFor(state.characterId,build.route).sort((a,b)=>a.level-b.level);p=rows.find(p=>p.level>=build.level)||rows.at(-1)||startsFor(state.characterId)[0];if(p){const later=build.stages.filter(s=>s.level>p.level);Object.assign(build,buildFromPreset(p),{stages:[buildFromPreset(p).stages[0],...later]});state.recruitmentAdjusted=true;if(Number.isInteger(state.target)&&state.target<p.level)state.target=p.level;}}
  if(p)Object.assign(build,{route:p.route,level:p.level,classId:p.classId,stats:{...p.stats},startBonus:zeroStats()});
 }
 state.comparison.manualLocked=false;
 return state;
}
