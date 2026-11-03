import {entries} from './data.mjs';
import {calculatorData} from './growth-calculator-data.mjs';
import {mountStatsByBond} from './growth-calculator.generated.mjs';
import {calculatorKeys as keys} from './growth-calculator-state.mjs';
import {activeBuild,integerStat} from './growth-calculator-plans.mjs';
import {recordCharacterId,recordLevel} from './growth-calculator-records.mjs';
const zero=()=>Object.fromEntries(keys.map(key=>[key,0]));
const total=values=>values.every(Number.isFinite)?values.reduce((a,b)=>a+b,0):null;
// Only the reviewed unconditional nine-stat effects of the base personal ability are included.
const personalRules={orchel:{key:'def',pattern:/수비\s*\+\s*(\d+)/,name:{ko:'견뢰견고',en:'Solid and Sturdy'}},talimun:{key:'lck',pattern:/행운\s*\+\s*(\d+)/,name:{ko:'모험왕의 행운',en:"Swashbuckler’s Luck"}}};
export function characterFixedBonuses(characterId){
 const character=calculatorData.characters.find(e=>e.id===characterId),core=zero(),personal=zero(),fact=character?.facts?.find(f=>f.key==='unique-possession'),names=[];
 if(fact){const match=fact.value.match(/ · Grants (HP|Str|Mag|Spd|Dex|Def|Res|Lck|Cha)\+(\d+)\./);if(match)core[match[1].toLowerCase()]=Number(match[2]);else keys.forEach(k=>core[k]=null);names.push({ko:(fact.valueKo||fact.value).split(' · ')[0],en:fact.value.split(' · ')[0]});}
 const rule=personalRules[characterId];if(rule){const text=character?.facts?.find(f=>f.key==='personal-ko')?.value||'',match=text.match(rule.pattern);personal[rule.key]=match?Number(match[1]):null;names.push(rule.name);}
 return {core,personal,names};
}
export function recordStatBreakdowns(record,{values=record?.values}={}){
 const characterId=recordCharacterId(record),character=characterFixedBonuses(characterId),state=record?.state,build=state?.builds?.[0],stage=build?activeBuild(build,state.target).stages.at(-1):null,cls=calculatorData.classes.find(c=>c.id===stage?.classId),mount=entries.find(e=>e.type==='mount'&&e.id===stage?.mountId),multiplier=cls?.id==='class-charioteer'?2:1;
 const compatible=mount&&calculatorData.mounts.some(m=>m.id===mount.id&&m.type===cls?.mountType)&&!['orchel','goliath'].includes(characterId);
 const mountValues=stage&&!stage.mountId?zero():compatible?(mountStatsByBond[mount.id]?.[stage.bond]||(stage.bond===5?mount.mountDetails?.modifiers?.values:null)):null;
 const rows=Object.fromEntries(keys.map(key=>{const primary=Number.isFinite(values?.[key])&&values[key]>=0&&(record?.kind!=='manual'||Number.isInteger(values[key])&&values[key]<=999)?integerStat(values[key]):null,job=cls?.modifiers[key]??null,animal=Number.isFinite(mountValues?.[key])?mountValues[key]*multiplier:null,own=total([character.core[key],character.personal[key]]),extraKnown=[animal,character.core[key],character.personal[key]].filter(Number.isFinite).reduce((a,b)=>a+b,0),extraComplete=[animal,own].every(Number.isFinite);return [key,{key,primary,body:primary!==null&&job!==null?primary-job:null,job,animal,own,extraKnown,extraComplete,included:primary!==null&&extraComplete?primary+extraKnown:null}];}));
 const sum=key=>total(Object.values(rows).map(row=>row[key]));
 return {rows,manual:!state,characterId,level:recordLevel(record),className:cls?.name,mountName:mount?.name,mountId:stage?.mountId||'',bond:stage?.bond,multiplier,characterNames:character.names,total:{key:'total',primary:sum('primary'),body:sum('body'),job:sum('job'),animal:sum('animal'),own:sum('own'),extraKnown:sum('extraKnown'),extraComplete:Object.values(rows).every(row=>row.extraComplete),included:sum('included')}};
}
export function statBreakdownPayload(context,key){return {...(key==='total'?context.total:context.rows[key]),manual:context.manual,className:context.className,mountName:context.mountName,mountId:context.mountId,bond:context.bond,multiplier:context.multiplier,characterNames:context.characterNames};}
