import {calculatorData,buildFromPreset} from './growth-calculator-data.mjs';
import {benchmarkPlans,benchmarkVersion} from './growth-calculator-benchmark-plans.mjs';
import {calculateBuild} from './growth-calculator-model.mjs';
import {analyzeGrowth} from './growth-calculator-analysis.mjs';
import {recordStatBreakdowns} from './growth-calculator-stat-bonuses.mjs';
import {recordDisplayValues,currentEquipment} from './growth-calculator-equipment.mjs';
import {recordCharacterId,recordLevel,comparisonSides,statComparison} from './growth-calculator-records.mjs';
import {calculatorKeys as keys} from './growth-calculator-state.mjs';
import {activeBuild,integerStat} from './growth-calculator-plans.mjs';
import {radarScale} from './growth-calculator-scale.mjs';
const cache=new Map();
export function standardGrowthRecord(characterId,level){
 const key=characterId+':'+level;if(cache.has(key))return structuredClone(cache.get(key));
 const plan=benchmarkPlans[characterId],preset=calculatorData.presets.find(p=>p.id===plan?.presetId&&p.characterId===characterId);
 if(!preset||!Number.isInteger(level)||level<preset.level||level>99)return null;
 const build=buildFromPreset(preset);build.stages=plan.stages.filter(s=>s[0]<=level).map(([level,classId])=>({level,classId,mountId:'',bond:5,skill:characterId==='mu'}));
 const state={characterId,target:level,weapon:'none',builds:[build]},result=calculateBuild(calculatorData,characterId,build,level);
 if(!result.values)return null;
 const record={state,kind:'calculated',values:result.values,benchmarkVersion};cache.set(key,record);return structuredClone(record);
}
function numericAnalysis(left,right){
 const compared=statComparison(left,right),level=Math.max(...[left,right].map(recordLevel).filter(v=>Number.isInteger(v)&&v>=1&&v<=99));
 return {reason:'',rows:compared.rows.map(r=>({key:r.key,value:r.right,expected:r.left,difference:r.difference,score:null,status:'missing'})),totals:{value:compared.rightTotal,expected:compared.leftTotal,difference:compared.difference},graphLevel:level,graphScales:radarScale(level),average:null,overall:null};
}
export function comparisonView(state,result,saves){
 const sides=comparisonSides(state,result,saves);
 if(state.comparison.purpose==='records')return {...sides,analysis:numericAnalysis(sides.left,sides.right),evaluation:false};
 const right=sides.right,characterId=recordCharacterId(right)||state.characterId,level=recordLevel(right)||state.target,standard=standardGrowthRecord(characterId,level);
 if(!standard)return {left:null,right,analysis:{...numericAnalysis(null,right),reason:'standard'},evaluation:true};
 const model=calculateBuild(calculatorData,characterId,standard.state.builds[0],level),details=recordStatBreakdowns(right);
 const context=right?.state?currentEquipment(right.state):right?.context;
 const unknownBonusKeys=keys.filter(k=>!Number.isFinite(details.rows[k].job)||!details.rows[k].extraComplete);
 const referenceValues=Object.fromEntries(keys.map(k=>[k,unknownBonusKeys.includes(k)?null:integerStat(model.intrinsic[k]+details.rows[k].job+details.rows[k].extraKnown)]));
 const left={kind:'manual',characterId,level,values:referenceValues,basis:'total',context,benchmarkVersion};
 const numeric=numericAnalysis(left,right);
 if(right?.state&&right.kind!=='calculated'){
  const current=calculateBuild(calculatorData,characterId,activeBuild(right.state.builds[0],level),level);
  const expected=current.values?recordDisplayValues({state:right.state,values:current.values}):null,actual=recordDisplayValues(right);
  if(!expected||keys.some(k=>!unknownBonusKeys.includes(k)&&expected[k]!==actual[k]))return {left,right,analysis:{...numeric,reason:'outdated'},evaluation:true};
 }

 const standardClass=calculatorData.classes.find(c=>c.id===standard.state.builds[0].stages.at(-1).classId);
 const normalized={kind:'manual',characterId,level,values:Object.fromEntries(keys.map(k=>[k,details.rows[k].body===null?null:details.rows[k].body+standardClass.modifiers[k]]))};
 const analysis=analyzeGrowth(calculatorData,standard,normalized);
 // Compare visible totals, but score intrinsic growth against the immutable reference distribution.
 analysis.rows=analysis.rows.map(row=>({...row,...numeric.rows.find(r=>r.key===row.key),score:row.score,status:row.status,bonusUnknown:unknownBonusKeys.includes(row.key)}));
 analysis.unknownBonusKeys=unknownBonusKeys;
 if(unknownBonusKeys.length)analysis.reason='partialContext';
 if(analysis.rows.some(row=>row.status==='outside')){analysis.overall=null;analysis.reason='outsideValues';}
 analysis.totals=numeric.totals;analysis.graphScales=numeric.graphScales;analysis.graphLevel=numeric.graphLevel;
 return {left,right,analysis,evaluation:true};
}
