import {calculatorCharacters,calculatorClasses,calculatorMounts,startsFor,buildFromPreset,defaultCalculatorMount} from './growth-calculator-data.mjs';
import {trainingDirections} from './training-directions.generated.mjs';
// Kept separately so recommendation priorities can change without changing the calculator.
export const calculatorRecommendationOverrides={benditz:['class-charioteer']};
export function startLevelOptions(characterId){
 const starts=startsFor(characterId).sort((a,b)=>a.level-b.level||a.route.localeCompare(b.route));
 const minima=new Map();for(const p of starts)if(!minima.has(p.route))minima.set(p.route,p.level);
 const groups=new Map();
 for(const p of starts){const key=JSON.stringify([p.level,p.classId,p.stats]);if(!groups.has(key))groups.set(key,{preset:p,routes:[],minimumRoutes:[]});const group=groups.get(key);if(!group.routes.includes(p.route))group.routes.push(p.route);if(p.level===minima.get(p.route)&&!group.minimumRoutes.includes(p.route))group.minimumRoutes.push(p.route);}
 return [...groups.values()];
}
export function compatibleMounts(characterId,classId){
 const type=calculatorClasses.find(c=>c.id===classId)?.mountType;
 return ['goliath','orchel'].includes(characterId)?[]:calculatorMounts.filter(m=>m.type===type);
}
export function recommendedStages(characterId,build,target){
 const character=calculatorCharacters.find(c=>c.id===characterId),override=calculatorRecommendationOverrides[characterId],reviewed=trainingDirections[characterId];
 const ids=override||(reviewed?[...reviewed.path,...reviewed.future].flatMap(s=>s.classIds):[...(character?.beginnerGuide?.path||[]).map(s=>s.classId),...(character?.beginnerGuide?.future||[]).map(s=>s.classId),...(character?.trainingGuide?.classIds||[])]);
 const stages=[{...buildFromPreset({characterId,level:build.level,classId:build.classId,stats:build.stats}).stages[0]}];
 for(const [level,tier] of [[20,'Specialty'],[35,'Advanced'],[45,'Master']]){
  if(level<build.level||level>target)continue;
  const classId=ids.find(id=>calculatorClasses.some(c=>c.id===id&&c.tier===tier))||stages.at(-1).classId;
  const mountId=defaultCalculatorMount(characterId,classId);
  if(level===build.level)Object.assign(stages[0],{classId,mountId});else stages.push({level,classId,mountId,bond:5,skill:characterId==='mu'});
 }
 return stages;
}
export function sortStages(stages){return stages.length?[{...stages[0],bond:5},...stages.slice(1).map(s=>({...s,bond:5})).sort((a,b)=>Number(a.level)-Number(b.level))]:[];}
export const integerStat=value=>Number.isFinite(value)?Math.sign(value)*Math.round(Math.abs(value)+1e-8):null;
export function activeBuild(build,target){return {...build,stages:sortStages(build.stages).filter(s=>s.level<=target)};}
