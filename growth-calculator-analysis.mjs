import {calculatorKeys as keys} from './growth-calculator-state.mjs';
import {calculateBuild} from './growth-calculator-model.mjs';
import {activeBuild,integerStat} from './growth-calculator-plans.mjs';
import {recordCharacterId,recordLevel,statComparison} from './growth-calculator-records.mjs';
import {radarScale} from './growth-calculator-scale.mjs';
// Independent per-stat rolls. Whole hundreds are guaranteed gains; only the remainder is random.
export function statGrowthDistribution(segments,key){
 let minimum=0,probabilities=[1],mean=0,variance=0;
 for(const segment of segments){
  const n=segment.to-segment.from,rate=segment.total[key]/100;
  if(!Number.isInteger(n)||n<0||!Number.isFinite(rate)||rate<0)return null;
  const whole=Math.floor(rate),p=rate-whole;minimum+=n*whole;mean+=n*rate;variance+=n*p*(1-p);
  if(p===0)continue;
  for(let level=0;level<n;level++){const next=Array(probabilities.length+1).fill(0);for(let i=0;i<probabilities.length;i++){next[i]+=probabilities[i]*(1-p);next[i+1]+=probabilities[i]*p;}probabilities=next;}
 }
 return {minimum,maximum:minimum+probabilities.length-1,probabilities,mean,variance};
}
export function growthPercentile(distribution,gain){
 if(!distribution||!Number.isFinite(gain))return {score:null,status:'missing'};
 const {minimum,maximum,probabilities,variance}=distribution;
 if(variance<1e-12&&Math.abs(gain-minimum)<1e-9)return {score:null,status:'fixed'};
 let below=0,equal=0,total=0;
 probabilities.forEach((p,i)=>{total+=p;const value=minimum+i;if(value<gain-1e-9)below+=p;else if(Math.abs(value-gain)<1e-9)equal+=p;});
 return {score:Math.max(0,Math.min(100,100*(below+equal/2)/total)),status:gain<minimum-1e-9||gain>maximum+1e-9?'outside':'ok'};
}
// Convolve the nine independent stat distributions; do not average their percentiles.
export function combinedGrowthDistribution(distributions){
 let minimum=0,mean=0,variance=0,probabilities=[1];
 for(const d of distributions){
  if(!d)return null;
  const next=Array(probabilities.length+d.probabilities.length-1).fill(0);
  for(let a=0;a<probabilities.length;a++)for(let b=0;b<d.probabilities.length;b++)next[a+b]+=probabilities[a]*d.probabilities[b];
  probabilities=next;minimum+=d.minimum;mean+=d.mean;variance+=d.variance;
 }
 return {minimum,maximum:minimum+probabilities.length-1,probabilities,mean,variance};
}
const sum=v=>keys.reduce((total,key)=>total+v[key],0);
function endpoint(data,state){
 const build=activeBuild(state.builds[0],state.target),start=data.classes.find(c=>c.id===build.classId),end=data.classes.find(c=>c.id===build.stages.at(-1)?.classId);
 return start&&end?{build,start,end}:null;
}
export function analyzeGrowth(data,left,right){
 const compared=statComparison(left,right),numbers=key=>{const row=compared.rows.find(r=>r.key===key);return {value:row.right,expected:row.left,difference:row.difference};};
 const totals={value:compared.rightTotal,expected:compared.leftTotal,difference:compared.difference};
 const levels=[left,right].map(recordLevel).filter(n=>Number.isInteger(n)&&n>=1&&n<=99),graphLevel=levels.length?Math.max(...levels):null,graphScales=radarScale(graphLevel);
 let maximumValues={};
 const empty=reason=>({reason,rows:keys.map(key=>({key,score:null,status:'missing',...numbers(key),maximumValue:maximumValues[key]??null})),average:null,overall:null,totals,graphScales,graphLevel});
 if(!left?.state||left.kind==='manual')return empty('baseline');
 if(data.presets&&[left,right].some(record=>record?.state&&!data.presets.some(p=>p.id===record.state.builds?.[0]?.presetId&&p.characterId===record.state.characterId)))return empty('outdated');
 const state=left.state,ends=endpoint(data,state);if(!ends)return empty('baseline');
 const model=calculateBuild(data,state.characterId,ends.build,state.target);if(!model.values)return empty('baseline');
 if(left.kind!=='calculated'&&keys.some(k=>integerStat(model.values[k])!==left.values[k]))return empty('outdated');
 const startIntrinsic=Object.fromEntries(keys.map(k=>[k,ends.build.stats[k]-ends.start.modifiers[k]-ends.build.startBonus[k]]));
 const distributions=keys.map(key=>statGrowthDistribution(model.segments,key));
 maximumValues=Object.fromEntries(keys.map((key,i)=>[key,startIntrinsic[key]+distributions[i].maximum+ends.end.modifiers[key]+ends.build.endBonus[key]]));
 if(!right)return empty('values');
 if(recordCharacterId(left)!==recordCharacterId(right)||recordLevel(left)!==recordLevel(right))return empty('mismatch');
 if(model.levelUps===0)return empty('noLevels');
 const actualEnds=right.state?endpoint(data,right.state):ends;if(!actualEnds)return empty('baseline');
 const actualIntrinsic=Object.fromEntries(keys.map(k=>[k,numbers(k).value===null?null:numbers(k).value-actualEnds.end.modifiers[k]-actualEnds.build.endBonus[k]]));
 const rows=keys.map((key,i)=>{const distribution=distributions[i],gain=actualIntrinsic[key]===null?null:actualIntrinsic[key]-startIntrinsic[key];return {key,...numbers(key),maximumValue:maximumValues[key],...growthPercentile(distribution,gain),gain,expectedGain:distribution.mean,minimum:distribution.minimum,maximum:distribution.maximum};});
 if(!keys.every(k=>actualIntrinsic[k]!==null))return {reason:'values',rows,totals,graphScales,graphLevel,average:null,overall:null};
 const gain=sum(actualIntrinsic)-sum(startIntrinsic),expectedGain=sum(model.intrinsic)-sum(startIntrinsic);
 const overall=growthPercentile(combinedGrowthDistribution(distributions),gain);
 return {reason:'',rows,totals,graphScales,graphLevel,overall:{...overall,top:overall.score===null?null:100-overall.score},average:gain<0?null:{gain,expectedGain,levels:model.levelUps,value:gain/model.levelUps,expected:expectedGain/model.levelUps},startLevel:ends.build.level,target:state.target};
}
