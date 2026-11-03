import {calculatorKeys as keys} from './growth-calculator-state.mjs';
const integer=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
const complete=v=>keys.every(k=>Number.isFinite(v?.[k]));
export function growthAt(data,character,stage,level){
 const cls=data.classes.find(c=>c.id===stage.classId),mount=stage.mountId?data.mounts.find(m=>m.id===stage.mountId):null;
 const base=stage.skill&&character.modifiedGrowthRates?character.modifiedGrowthRates.values:character.growthRates.values;
 const variant=data.variants.filter(v=>v.classId===cls?.id&&v.level<=level).sort((a,b)=>b.level-a.level)[0];
 const classGrowth=variant?.growth||cls?.growth;
 const mountGrowth=mount?.growthByBond[stage.bond];
 const multiplier=cls?.id==='class-charioteer'?2:1;
 return {personal:base,classGrowth,mountGrowth,multiplier,total:Object.fromEntries(keys.map(k=>[k,Number.isFinite(base?.[k])&&Number.isFinite(classGrowth?.[k])&&(!stage.mountId||Number.isFinite(mountGrowth?.[k]))?base[k]+classGrowth[k]+(stage.mountId?mountGrowth[k]*multiplier:0):null]))};
}
export function calculateBuild(data,characterId,build,target){
 const errors=[],error=(code,stage)=>errors.push({code,stage}),character=data.characters.find(c=>c.id===characterId);
 if(!character)error('character');
 if(build.mode==='recruit'&&data.presets&&!data.presets.some(p=>p.id===build.presetId&&p.characterId===characterId))error('preset');
 if(!integer(build.level,1,99))error('startLevel');
 if(!integer(target,1,99)||target<build.level)error('target');
 if(!keys.every(k=>integer(build.stats?.[k],0,999)))error('stats');
 if(!complete(build.startBonus)||!complete(build.endBonus)||!keys.every(k=>Math.abs(build.startBonus[k])<=999&&Math.abs(build.endBonus[k])<=999))error('bonus');
 const startClass=data.classes.find(c=>c.id===build.classId);if(!startClass)error('class');
 if(!build.stages.length||build.stages.length>12)error('stages');
 build.stages.forEach((stage,i)=>{
  const cls=data.classes.find(c=>c.id===stage.classId),mount=data.mounts.find(m=>m.id===stage.mountId);
  if(!integer(stage.level,1,99)||stage.level<build.level||stage.level>target||(i===0&&stage.level!==build.level)||(i&&stage.level<=build.stages[i-1].level))error('order',i);
  if(!cls)error('class',i);
  if(stage.mountId&&(!mount||mount.type!==cls?.mountType||['goliath','orchel'].includes(characterId)))error('mount',i);
  if(stage.mountId&&!complete(mount?.growthByBond[stage.bond]))error('bond',i);
 });
 if(errors.length)return {errors,values:null,levels:[],segments:[]};
 const intrinsic=Object.fromEntries(keys.map(k=>[k,build.stats[k]-startClass.modifiers[k]-build.startBonus[k]]));
 if(keys.some(k=>intrinsic[k]<0))return {errors:[{code:'bonus'}],values:null,levels:[],segments:[]};
 const levels=[],segments=[];let stageIndex=0;
 for(let level=build.level;level<=target;level++){
  while(stageIndex+1<build.stages.length&&build.stages[stageIndex+1].level<=level)stageIndex++;
  const stage=build.stages[stageIndex],cls=data.classes.find(c=>c.id===stage.classId),rates=growthAt(data,character,stage,level);
  const values=Object.fromEntries(keys.map(k=>[k,intrinsic[k]+cls.modifiers[k]+(level===target?build.endBonus[k]:0)]));
  levels.push({level,classId:cls.id,values});
  if(level===target)break;
  if(keys.some(k=>!Number.isFinite(rates.total[k])||rates.total[k]<0))return {errors:[{code:'growth',stage:stageIndex}],values:null,levels:[],segments:[]};
  for(const k of keys)intrinsic[k]+=rates.total[k]/100;
  const last=segments.at(-1),signature=JSON.stringify([stageIndex,rates.total]);
  if(last?.signature===signature)last.to=level+1;
  else segments.push({signature,from:level,to:level+1,classId:cls.id,mountId:stage.mountId,bond:stage.bond,skill:stage.skill,...rates});
 }
 return {errors:[],values:levels.at(-1).values,levels,segments,levelUps:target-build.level,intrinsic:{...intrinsic}};
}
export function compareBuilds(data,state){
 const a=calculateBuild(data,state.characterId,state.builds[0],state.target),b=state.compare&&state.builds[1]?calculateBuild(data,state.characterId,state.builds[1],state.target):null;
 return {a,b,difference:a.values&&b?.values?Object.fromEntries(keys.map(k=>[k,b.values[k]-a.values[k]])):null};
}
