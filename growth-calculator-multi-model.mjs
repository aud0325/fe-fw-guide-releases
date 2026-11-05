import {calculatorKeys as keys} from './growth-calculator-state.mjs';
import {recordCharacterId,recordLevel,manualMetadata} from './growth-calculator-records.mjs';
import {recordDisplayValues} from './growth-calculator-equipment.mjs';
import {radarScale} from './growth-calculator-scale.mjs';
export const multiColors=['#82536a','#356c87','#397451','#aa6423','#7158a2','#a13f3f'];
const patterns=['','7 3','2 3','9 3 2 3','5 2 2 2','12 3 3 3 3 3'];
export function assignedRecordLines(ids,previous,known=ids){
 const active=[...new Set(ids.filter(id=>known.includes(id)))],kept=new Map(),used=new Set();
 for(const [id,slot] of previous||[])if(active.includes(id)&&!kept.has(id)&&Number.isInteger(slot)&&slot>=0&&slot<multiColors.length*patterns.length&&!used.has(slot)){kept.set(id,slot);used.add(slot);}
 return active.map(id=>{if(!kept.has(id)){let slot=0;while(used.has(slot))slot++;kept.set(id,slot);used.add(slot);}return [id,kept.get(id)];});
}
export const validRecordDraft=draft=>!!draft&&Number.isInteger(draft.level)&&draft.level>=1&&draft.level<=99&&keys.every(k=>Number.isInteger(draft.stats?.[k])&&draft.stats?.[k]>=0&&draft.stats?.[k]<=999);
export function copiedRecordDraft(row,name=''){
 const draft={name:name.slice(0,160),characterId:row?.characterId||'',level:row?.level,stats:Object.fromEntries(keys.map(k=>[k,row?.values?.[k]]))};
 return validRecordDraft(draft)?draft:null;
}
function duplicateRecordIds(candidates,savedRows){
 const seen=new Map(),aliases=new Map();
 // Prefer a saved record, with a stable identity even when the list is reordered.
 const priority=[...savedRows].sort((a,b)=>a.key.localeCompare(b.key)).concat(candidates.filter(r=>!savedRows.includes(r)));
 for(const row of priority){
  if(!row.characterId||!Number.isInteger(row.level)||row.level<1||row.level>99||!keys.every(k=>Number.isFinite(row.values[k])&&row.values[k]>=0)||row.kind==='draft'&&!validRecordDraft({level:row.level,stats:row.values}))continue;
  const signature=JSON.stringify([row.characterId,row.level,...keys.map(k=>row.values[k])]);
  if(seen.has(signature))aliases.set(row.key,seen.get(signature));else seen.set(signature,row.key);
 }
 return aliases;
}
export function multiRecordModel(state,result,saves){
 const c=state.comparison,meta=manualMetadata(state),draft=c.recordDraft;
 const current={key:'current:',kind:'current',characterId:state.characterId,level:state.target,values:recordDisplayValues({state,values:result.values})};
 const entered=keys.some(k=>Number.isFinite(c.stats[k]))?{key:'entered:',kind:'entered',name:c.manualName,characterId:meta.characterId,level:meta.level,values:recordDisplayValues({kind:'manual',...meta,values:c.stats,basis:c.valueBasis,context:c.context})}:null;
 const savedRows=saves.filter(s=>recordCharacterId(s)===state.characterId).concat(saves.filter(s=>recordCharacterId(s)!==state.characterId)).map(s=>({key:s.id,kind:s.kind==='manual'?'manual':'saved',name:s.name,characterId:recordCharacterId(s),level:recordLevel(s),values:recordDisplayValues(s)}));
 const candidates=[current,...(entered?[entered]:[]),...savedRows,...(draft?[{key:'draft:',kind:'draft',name:draft.name,characterId:draft.characterId||state.characterId,level:draft.level,values:draft.stats}]:[])];
 const aliases=duplicateRecordIds(candidates,savedRows),canonical=id=>aliases.get(id)||id;
 const initial=[c.leftMode==='saved'?c.leftSavedId:'current:',c.mode==='saved'?c.savedId:entered?'entered:':saves.find(s=>recordCharacterId(s)===state.characterId)?.id].filter(Boolean);
 const ids=[...new Set((Array.isArray(c.recordIds)?c.recordIds:initial).map(canonical))],previous=c.recordLines||[];
 const lines=[...previous.filter(([id])=>canonical(id)===id),...previous.filter(([id])=>canonical(id)!==id)].map(([id,slot])=>[canonical(id),slot]);
 const lineSlots=assignedRecordLines(ids,lines,candidates.map(r=>r.key)),styles=new Map(lineSlots);
 const ordered=(c.recordOrder||[]).map(key=>candidates.find(r=>r.key===key)).filter(Boolean).concat(candidates.filter(r=>!c.recordOrder?.includes(r.key)));
 const rows=ordered.map(r=>{const index=styles.get(r.key);return {...r,color:index===undefined?null:multiColors[index%multiColors.length],dash:index===undefined?null:patterns[Math.floor(index/multiColors.length)%patterns.length],visible:!aliases.has(r.key)&&(r.characterId===state.characterId||c.includeOtherRecords===true),valid:Number.isInteger(r.level)&&r.level>=1&&r.level<=99&&keys.every(k=>Number.isFinite(r.values[k])&&r.values[k]>=0)&&(r.kind!=='draft'||validRecordDraft(draft))};});
 const selected=ids.map(id=>rows.find(r=>r.key===id&&r.visible&&r.valid)).filter(Boolean);
 // Selection never rescales the graph: every visible, valid record shares these axes.
 const visible=rows.filter(r=>r.visible&&r.valid),level=Math.max(1,...visible.map(r=>r.level)),base=radarScale(level)||{hp:75,other:50};
 const max=(statKeys,fallback)=>Math.max(fallback,...visible.flatMap(r=>statKeys.map(k=>r.values[k])));
 const hp=max(['hp'],base.hp),other=max(keys.filter(k=>k!=='hp'),base.other),scales={hp:hp>base.hp?Math.ceil(hp/10)*10:base.hp,other:other>base.other?Math.ceil(other/10)*10:base.other};
 return {rows,ids,lineSlots,selected,scales,mixedLevels:new Set(selected.map(r=>r.level)).size>1,missing:Array.isArray(c.recordIds)&&ids.some(id=>!rows.some(r=>r.key===id)),savedCount:saves.filter(s=>recordCharacterId(s)===state.characterId).length};
}
