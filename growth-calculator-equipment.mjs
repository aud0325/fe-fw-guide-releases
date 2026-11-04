import {entries} from './data.mjs';
import {calculatorData,calculatorBattalions} from './growth-calculator-data.mjs';
import {mountStatsByBond} from './growth-calculator.generated.mjs';
import {calculatorKeys as keys,cleanCalculatorContext} from './growth-calculator-state.mjs';
import {activeBuild,integerStat} from './growth-calculator-plans.mjs';
const zero=()=>Object.fromEntries(keys.map(key=>[key,0]));
const total=values=>values.every(Number.isFinite)?values.reduce((a,b)=>a+b,0):null;
// Only the reviewed unconditional nine-stat effects of the base personal ability are included.
const personalRules={orchel:{key:'def',pattern:/수비\s*\+\s*(\d+)/,name:{ko:'견뢰견고',en:'Solid and Sturdy'}},talimun:{key:'lck',pattern:/행운\s*\+\s*(\d+)/,name:{ko:'모험왕의 행운',en:"Swashbuckler’s Luck"}}};
export function characterFixedBonuses(characterId){
 const character=calculatorData.characters.find(e=>e.id===characterId),core=zero(),personal=zero(),fact=character?.facts?.find(f=>f.key==='unique-possession'),names=[];
 if(character?.origin){keys.forEach(k=>core[k]=character.origin.bonuses[k]||0);names.push(character.origin.name);}
 else if(fact){const match=fact.value.match(/ · Grants (HP|Str|Mag|Spd|Dex|Def|Res|Lck|Cha)\+(\d+)\./);if(match)core[match[1].toLowerCase()]=Number(match[2]);else keys.forEach(k=>core[k]=null);names.push({ko:(fact.valueKo||fact.value).split(' · ')[0],en:fact.value.split(' · ')[0]});}
 const rule=personalRules[characterId];if(rule){const text=character?.facts?.find(f=>f.key==='personal-ko')?.value||'',match=text.match(rule.pattern);personal[rule.key]=match?Number(match[1]):null;names.push(rule.name);}
 return {core,personal,names,origin:character?.origin,personalName:rule?.name};
}
export function muWeaponBonuses(level,weapon){
 const values=zero();
 if(level<20)return values;
 const first={sword:'spd',spear:'dex',axe:'str',bow:'dex',gauntlet:'str'},second={sword:'dex',spear:'def',axe:'def',bow:'str',gauntlet:'spd'};
 if(first[weapon])values[first[weapon]]=2;
 if(level>=35&&second[weapon])values[second[weapon]]=2;
 return values;
}
export function battalionStatBonuses(battalionId,classId){
 const battalion=calculatorBattalions.find(b=>b.id===battalionId),cls=calculatorData.classes.find(c=>c.id===classId),active=!!battalion&&cls?.mountType==='No';
 return {entry:battalion,active,values:Object.fromEntries(keys.map(k=>[k,active?battalion.battalion.bonuses[({hp:'HP',str:'Str',mag:'Mag',spd:'Spd',dex:'Dex',def:'Def',res:'Res',lck:'Lck',cha:'Cha'})[k]]??0:0]))};
}
export function currentEquipment(state){
 const stage=activeBuild(state.builds[0],state.target).stages.at(-1);
 return stage?cleanCalculatorContext({...stage,weapon:state.weapon,battalionId:state.battalionId}):null;
}
export function recordEquipment(record){
 const characterId=record?.kind==='manual'?record.characterId:record?.state?.characterId,level=record?.kind==='manual'?record.level:record?.state?.target;
 const context=record?.state?currentEquipment(record.state):cleanCalculatorContext(record?.context),cls=calculatorData.classes.find(c=>c.id===context?.classId);
 const character=characterFixedBonuses(characterId),mount=calculatorData.mounts.find(m=>m.id===context?.mountId),entry=entries.find(e=>e.id===mount?.id),multiplier=cls?.id==='class-charioteer'?2:1;
 const compatible=mount&&mount.type===cls?.mountType&&!['orchel','goliath'].includes(characterId);
 const animal=context&&!context.mountId?zero():compatible?(mountStatsByBond[mount.id]?.[5]||entry?.mountDetails?.modifiers?.values):null;
 const weapon=characterId==='mu'?muWeaponBonuses(level,context?.weapon):zero();
 const own=Object.fromEntries(keys.map(k=>[k,total([character.core[k],character.personal[k],weapon[k]])]));
 const battalion=battalionStatBonuses(context?.battalionId,context?.classId);
 const extra=Object.fromEntries(keys.map(k=>[k,total([animal?.[k]===undefined?null:animal[k]*multiplier,own[k],battalion.values[k]])]));
 return {context,cls,mount:entry,character,weapon,own,extra,battalion,multiplier,characterId,level,animal};
}
export function recordDisplayValues(record){
 const equipment=recordEquipment(record);
 return Object.fromEntries(keys.map(k=>{const value=record?.values?.[k];return [k,Number.isFinite(value)&&value>=0&&(record?.kind!=='manual'||Number.isInteger(value)&&value<=999)?integerStat(value)+(record?.basis==='total'?0:equipment.extra[k]??0):null];}));
}
