import {mountGrowthReports,mountGrowthSource} from './mount-growth.generated.mjs';
import {entryDisplayName} from './editorial-view.mjs';
import {characterFaction} from './presentation.mjs';
import {createTranslator} from './locales/index.mjs';
import {media} from './media.mjs';
import {entryIconMedia} from './entity-media.mjs';
export const growthKeys=['hp','str','mag','spd','dex','def','res','lck','cha'];
export const growthTabs=['character','class','mount'];
export const growthTiers={Unique:0,Beginner:1,Specialty:2,Intermediate:2,Advanced:3,Master:4,Divine:5};
export const mountGrowthGroups={Horses:{ko:'말',en:'Horses'},Ornius:{ko:'비약 타조',en:'Ornius'},Pegasi:{ko:'천마',en:'Pegasi'},Dragons:{ko:'드래곤',en:'Dragons'},Elephants:{ko:'코끼리',en:'Elephants'}};
export {mountGrowthSource};
export function normalizeGrowthState(state={}){
 const tab=growthTabs.includes(state.growthTab)?state.growthTab:'character';
 const sorts=['default','name','total',...(tab==='character'?['effective']:[]),...growthKeys];
 return {growthTab:tab,growthHeat:state.growthHeat!=='off'?'on':'off',growthSkill:state.growthSkill===true,growthGroup:tab==='character'?'':String(state.growthGroup||''),growthSort:sorts.includes(state.growthSort)?state.growthSort:'default',growthDirection:state.growthDirection==='asc'?'asc':'desc',growthFocus:tab==='character'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(state.growthFocus||'')?state.growthFocus:''};
}
export function growthRows(entries){
 const ko=createTranslator('ko'),en=createTranslator('en');
 const rows=entries.filter(e=>e.type==='class'||e.type==='character'&&e.roles?.includes('playable')&&e.growthRates).map(e=>{
  const growth=e.type==='class'?e.classStats?.growth:e.growthRates,m=e.type==='character'?media[e.id]:entryIconMedia(e);
  return {id:e.id,type:e.type,name:{ko:entryDisplayName(e,'ko'),en:entryDisplayName(e,'en')},group:e.type==='class'?{ko:e.category,en:e.category}:{ko:characterFaction(e,ko,entries),en:characterFaction(e,en,entries)},values:growth?.values||{},modified:e.modifiedGrowthRates?.values,sourceId:growth?.sourceId,status:growth?.status,image:m?.thumbnailSrc||m?.src||'',imageSource:m?.sourceUrl||'',imageCredit:m?.credit||'',hasDetail:true};
 });
 for(const report of mountGrowthReports){
  const e=entries.find(e=>e.id===report.id);
  rows.push({...report,type:'mount',name:e?{ko:entryDisplayName(e,'ko'),en:entryDisplayName(e,'en')}:{ko:report.sourceName,en:'Red Falicorn'},group:{en:report.group,ko:mountGrowthGroups[report.group].ko},hasDetail:!!e,image:''});
 }
 return rows;
}
export const growthValues=(row,state)=>row.type==='character'&&state.growthSkill&&row.modified?row.modified:row.values;
export function growthTotal(row,state){const values=growthValues(row,state);return growthKeys.every(k=>Number.isFinite(values[k]))?growthKeys.reduce((sum,k)=>sum+values[k],0):null;}
export function growthRank(row,rows,state){
 const total=growthTotal(row,state),totals=rows.map(r=>growthTotal(r,state)).filter(Number.isFinite);
 if(!Number.isFinite(total)||!rows.some(r=>r.id===row.id))return null;
 return {rank:1+totals.filter(value=>value>total).length,count:totals.length,tied:totals.filter(value=>value===total).length>1};
}
export function growthEffectiveTotal(row,state){const total=growthTotal(row,state),values=growthValues(row,state);return Number.isFinite(total)?total-Math.min(values.str,values.mag):null;}
export const growthSortContext=state=>({sort:state.growthSort==='default'&&state.growthTab==='character'?'total':state.growthSort,direction:state.growthSort==='default'?'desc':state.growthDirection});
export function sortGrowthRows(rows,state,lang){
 const {sort,direction}=growthSortContext(state),sign=direction==='asc'?1:-1;
 return [...rows].sort((a,b)=>{
  if(sort==='default')return state.growthTab==='class'?(growthTiers[a.group.en]??99)-(growthTiers[b.group.en]??99):0;
  if(sort==='name')return a.name[lang].localeCompare(b.name[lang],lang)*sign;
  const value=r=>sort==='total'?growthTotal(r,state):sort==='effective'?growthEffectiveTotal(r,state):growthValues(r,state)[sort];
  const av=value(a),bv=value(b);
  if(!Number.isFinite(av))return Number.isFinite(bv)?1:0;if(!Number.isFinite(bv))return -1;
  return (av-bv)*sign||a.name[lang].localeCompare(b.name[lang],lang);
 });
}
export function growthBaseline(rows,state){
 return Object.fromEntries(growthKeys.map(k=>{const values=rows.map(r=>growthValues(r,state)[k]).filter(Number.isFinite),mean=values.length?values.reduce((sum,v)=>sum+v,0)/values.length:null;return [k,{mean,sd:values.length?Math.sqrt(values.reduce((sum,v)=>sum+(v-mean)**2,0)/values.length):0,n:values.length}];}));
}
export function growthCellStyle(value,key,stats,state){
 if(!Number.isFinite(value)||state.growthHeat==='off')return '';
 const z=state.growthTab==='character'?(stats[key].sd?(value-stats[key].mean)/(2*stats[key].sd):0):value/30,amount=Math.min(1,Math.abs(z)),end=z<0?[56,103,212]:[221,78,78],color=[255,255,255].map((v,i)=>Math.round(v+(end[i]-v)*amount));
 const rgb=color.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4),lum=rgb.reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
 return `background:rgb(${color});color:${lum<=.179?'#fff':'#000'}`;
}
