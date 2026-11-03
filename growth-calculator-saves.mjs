import {cleanCalculatorState,calculatorKeys as keys} from './growth-calculator-state.mjs';
export const calculatorSavesKey='fw-growth-calculator-saves-v1';
export const calculatorSaveLimit=30;
export function cleanSavedCalculations(value){
 if(!Array.isArray(value)||value.length>calculatorSaveLimit)return [];
 return value.flatMap(s=>{
  if(!s||typeof s.id!=='string'||!/^[-a-z0-9]{1,80}$/.test(s.id)||typeof s.name!=='string'||!s.name.trim()||s.name.length>768||!Number.isFinite(s.created)||!keys.every(k=>Number.isInteger(s.values?.[k])&&Math.abs(s.values[k])<=9999))return [];
  const common={id:s.id,name:s.name,created:s.created,values:Object.fromEntries(keys.map(k=>[k,s.values[k]]))};
  if(s.kind==='manual'){
   const characterId=s.characterId||s.state?.characterId,level=s.level??s.state?.target;
   if(typeof characterId!=='string'||!/^[-a-z0-9]{1,100}$/.test(characterId)||!Number.isInteger(level)||level<1||level>99||!keys.every(k=>s.values[k]>=0&&s.values[k]<=999))return [];
   return [{...common,kind:'manual',characterId,level}];
  }
  const state=cleanCalculatorState(s.state);return state?[{id:s.id,name:s.name,created:s.created,state,values:common.values}]:[];
 });
}
export function readSavedCalculations(storage){try{const raw=storage.getItem(calculatorSavesKey);return raw&&raw.length<=500000?cleanSavedCalculations(JSON.parse(raw)):[];}catch{return [];}}
export function writeSavedCalculations(storage,saves){storage.setItem(calculatorSavesKey,JSON.stringify(cleanSavedCalculations(saves)));}

export function renamedSavedCalculations(saves,id,name){
 const record=saves.find(s=>s.id===id);if(!record||typeof name!=='string')return null;
 const value=name.trim();if(!value||value.length>(record.kind==='manual'?160:768))return null;
 return saves.map(s=>s.id===id?{...s,name:value}:s);
}
