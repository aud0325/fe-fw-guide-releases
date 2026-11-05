import {growthRows,normalizeGrowthState,growthBaseline,growthValues,growthTotal,growthRank} from './growth-comparison.mjs';

// The detail view uses the comparison table's full roster and skill context.
export function characterGrowthContext(entries,growthSkill=false){
 const state=normalizeGrowthState({growthTab:'character',growthSkill}),rows=growthRows(entries).filter(row=>row.type==='character');
 return {state,rows,stats:growthBaseline(rows,state)};
}
export function characterGrowthSummary(entry,context){
 const row=context.rows.find(row=>row.id===entry.id)||{id:entry.id,type:'character',values:entry.growthRates?.values||{},modified:entry.modifiedGrowthRates?.values};
 return {total:growthTotal(row,context.state),ranking:growthRank(row,context.rows,context.state)};
}

// Keep detail tables and charts on the same effective personal rates as the comparison.
export function characterGrowthValues(entry,growthSkill=false){
 if(!entry.growthRates)return null;
 return growthValues({id:entry.id,type:'character',values:entry.growthRates.values,modified:entry.modifiedGrowthRates?.values},{growthSkill});
}
