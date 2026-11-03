export const calculatorStorageKey='fw-growth-calculator-v1';
export const calculatorSessionKey='fw-growth-calculator-session-v1';
export const calculatorKeys=['hp','str','mag','spd','dex','def','res','lck','cha'];
const id=value=>typeof value==='string'&&/^[a-z0-9][a-z0-9:-]{0,100}$/.test(value)?value:'';
const number=value=>typeof value==='number'&&Number.isFinite(value)?value:'';
const vector=value=>Object.fromEntries(calculatorKeys.map(k=>[k,number(value?.[k])]));
export function cleanCalculatorState(value){
 if(!value||value.v!==1||!Array.isArray(value.builds)||value.builds.length<1||value.builds.length>2)return null;
 if(value.builds.some(b=>!b||!Array.isArray(b.stages)||b.stages.length>12||b.stages.some(s=>!s||typeof s!=='object'||Array.isArray(s))))return null;
 return {v:1,recruitmentRoute:['cai','dietrich','theodora','leda'].includes(value.recruitmentRoute)?value.recruitmentRoute:'',characterId:id(value.characterId),target:number(value.target),compare:value.compare===true,comparison:{mode:value.comparison?.mode==='saved'?'saved':'manual',savedId:id(value.comparison?.savedId),leftMode:value.comparison?.leftMode==='saved'?'saved':'current',leftSavedId:id(value.comparison?.leftSavedId),manualName:typeof value.comparison?.manualName==='string'?value.comparison.manualName.slice(0,160):null,manualCharacterId:id(value.comparison?.manualCharacterId),manualLevel:number(value.comparison?.manualLevel),manualLocked:value.comparison?.manualLocked===true,manualSavedId:id(value.comparison?.manualSavedId),stats:vector(value.comparison?.stats)},builds:value.builds.map(b=>({
  mode:b.mode==='manual'?'manual':'recruit',route:id(b.route),presetId:id(b.presetId),level:number(b.level),classId:id(b.classId),stats:vector(b.stats),
  stages:b.stages.map(s=>({level:number(s.level),classId:id(s.classId),mountId:id(s.mountId),bond:number(s.bond),skill:s.skill===true})),
  startBonus:vector(b.startBonus),endBonus:vector(b.endBonus)
 }))};
}
export function parseCalculatorState(text){
 if(typeof text!=='string'||text.length>12000)return null;
 try{return cleanCalculatorState(JSON.parse(text));}catch{return null;}
}
export const serializeCalculatorState=value=>{const clean=cleanCalculatorState(value);return clean?JSON.stringify(clean):'';};
export function readCalculatorDraft(storage,characterId='',historical){
 const history=cleanCalculatorState(historical);
 if(history&&(!characterId||history.characterId===characterId))return history;
 try{const saved=parseCalculatorState(storage?.getItem(calculatorSessionKey));return saved&&(!characterId||saved.characterId===characterId)?saved:null;}catch{return null;}
}
export function writeCalculatorDraft(storage,value){try{const text=serializeCalculatorState(value);if(!text||!storage)return false;storage.setItem(calculatorSessionKey,text);return true;}catch{return false;}}
const packedVector=v=>calculatorKeys.map(k=>v[k]);
const unpackedVector=v=>Object.fromEntries(calculatorKeys.map((k,i)=>[k,v?.[i]??'']));
const shortClass=id=>id.startsWith('class-')?id.slice(6):id;
const fullClass=id=>typeof id==='string'&&id?'class-'+id:'';
// The array format removes repeated field names; source values and stable IDs survive data updates.
export function serializeCalculatorShare(value){
 const c=cleanCalculatorState(value);if(!c)return '';
 const comp=c.comparison,builds=c.builds.map(b=>[b.presetId,b.route,b.level,shortClass(b.classId),packedVector(b.stats),b.stages.map(s=>[s.level,shortClass(s.classId),s.mountId,s.bond,s.skill?1:0]),packedVector(b.startBonus),packedVector(b.endBonus),b.mode==='manual'?1:0]);
 const packed=[2,c.characterId,c.target,c.recruitmentRoute,c.compare?1:0,builds,[comp.mode==='saved'?1:0,comp.savedId,comp.leftMode==='saved'?1:0,comp.leftSavedId,comp.manualCharacterId,comp.manualLevel,comp.manualSavedId,packedVector(comp.stats)]];
 return btoa(JSON.stringify(packed)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
}
export function parseCalculatorShare(text){
 if(typeof text!=='string'||text.length>12000||!/^[A-Za-z0-9_-]+$/.test(text))return null;
 try{const [version,characterId,target,recruitmentRoute,compare,rows,p]=JSON.parse(atob(text.replaceAll('-','+').replaceAll('_','/')));if(version!==2||!Array.isArray(rows)||!Array.isArray(p))return null;
  const builds=rows.map(b=>({presetId:b[0],route:b[1],level:b[2],classId:fullClass(b[3]),stats:unpackedVector(b[4]),stages:b[5].map(s=>({level:s[0],classId:fullClass(s[1]),mountId:s[2],bond:s[3],skill:s[4]===1})),startBonus:unpackedVector(b[6]),endBonus:unpackedVector(b[7]),mode:b[8]===1?'manual':'recruit'}));
  return cleanCalculatorState({v:1,characterId,target,recruitmentRoute,compare:compare===1,builds,comparison:{mode:p[0]===1?'saved':'manual',savedId:p[1],leftMode:p[2]===1?'saved':'current',leftSavedId:p[3],manualCharacterId:p[4],manualLevel:p[5],manualSavedId:p[6],stats:unpackedVector(p[7])}});
 }catch{return null;}
}
// Restore a private draft name only when every public calculator field matches.
export function restorePrivateCalculatorName(value,privateValue){
 const current=cleanCalculatorState(value),stored=cleanCalculatorState(privateValue);
 if(!current||current.comparison.manualName!==null||!stored||stored.comparison.manualName===null)return current||value;
 const name=stored.comparison.manualName;stored.comparison.manualName=null;
 if(JSON.stringify(current)===JSON.stringify(stored))current.comparison.manualName=name;
 return current;
}
