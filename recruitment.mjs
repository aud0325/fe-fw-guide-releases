// Earlier reports remain available after a source has been selected.
const noteReports={
 loretta:{dietrich:{renown:8,sourceId:'recruitment',labelKey:'character.introduction'}},
 nezha:{theodora:{support:3,sourceId:'nezha-guide'}}
};
export function recruitmentReports(e,route){
 return [...(e.recruitmentHistory?.[route]||[]),e.game8Recruitment?.[route],noteReports[e.id]?.[route]].filter(Boolean);
}
export const isTutorialRecruit=(e,route)=>e.recruitment?.[route]?.mode==='automatic'&&e.recruitment[route].requirement==='Automatic (Recruitment Tutorial)';
export function recruitmentComparison(e,route){
 const main=e.recruitment?.[route];
 if(!main)return null;
 const reports=recruitmentReports(e,route).filter(r=>['support','renown'].some(key=>r[key]!=null&&r[key]!==main[key]));
 if(!reports.length)return null;
 return {main,reports,kind:isTutorialRecruit(e,route)?'tutorial-report':main.resolution?'selected-source':main.mode==='automatic'?'automatic-report':main.mode==='unknown'?'additional-report':'conflict'};
}
export function recruitmentValue(e,route,key){
 const main=e.recruitment?.[route];
 if(!main)return '—';
 if(main.resolution)return String(main[key]??'—');
 const values=[main[key]??'—'];
 if(main.mode==='scout')for(const r of recruitmentReports(e,route))if(r[key]!=null&&!values.includes(r[key]))values.push(r[key]);
 return values.join(' / ');
}
