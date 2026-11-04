import {calculatorKeys as keys} from './growth-calculator-state.mjs';
import {integerStat} from './growth-calculator-plans.mjs';
import {recordEquipment} from './growth-calculator-equipment.mjs';
export {characterFixedBonuses} from './growth-calculator-equipment.mjs';
const total=values=>values.every(Number.isFinite)?values.reduce((a,b)=>a+b,0):null;
export function recordStatBreakdowns(record,{values=record?.values}={}){
 const e=recordEquipment(record),state=record?.state;
 const rows=Object.fromEntries(keys.map(key=>{
  const raw=Number.isFinite(values?.[key])&&values[key]>=0&&(record?.kind!=='manual'||Number.isInteger(values[key])&&values[key]<=999)?integerStat(values[key]):null;
  const job=e.cls?.modifiers[key]??null,animal=e.animal?.[key]===undefined?null:e.animal[key]*e.multiplier,own=e.own[key],troop=e.battalion.values[key],extraKnown=[animal,own,troop].filter(Number.isFinite).reduce((a,b)=>a+b,0),extraComplete=[animal,own,troop].every(Number.isFinite);
  const primary=raw===null?null:record?.basis==='total'?extraComplete?raw-extraKnown:null:raw;
  return [key,{key,primary,body:primary!==null&&job!==null?primary-job:null,job,animal,own,troop,weapon:e.weapon[key],extraKnown,extraComplete,fixedKnown:extraKnown+(job??0),included:record?.basis==='total'?raw:primary!==null&&extraComplete?primary+extraKnown:null}];
 }));
 const sum=key=>total(Object.values(rows).map(row=>row[key]));
 return {rows,manual:!e.cls,characterId:e.characterId,level:e.level,className:e.cls?.name,battalionName:e.battalion.entry?.name,battalionId:e.battalion.entry?.id,battalionActive:e.battalion.active,mountName:e.mount?.name,mountId:e.context?.mountId||'',bond:5,multiplier:e.multiplier,characterNames:e.character.names,total:{key:'total',primary:sum('primary'),body:sum('body'),job:sum('job'),animal:sum('animal'),own:sum('own'),troop:sum('troop'),weapon:sum('weapon'),extraKnown:sum('extraKnown'),fixedKnown:sum('fixedKnown'),extraComplete:Object.values(rows).every(row=>row.extraComplete),included:sum('included')}};
}
export function statBreakdownPayload(context,key){return {...(key==='total'?context.total:context.rows[key]),manual:context.manual,className:context.className,battalionName:context.battalionName,battalionId:context.battalionId,battalionActive:context.battalionActive,mountName:context.mountName,mountId:context.mountId,bond:context.bond,multiplier:context.multiplier,characterNames:context.characterNames};}
