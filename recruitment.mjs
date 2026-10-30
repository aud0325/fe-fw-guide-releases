// Public views use the selected values; previous reports remain in research.
export const recruitmentReports=()=>[];
export const recruitmentComparison=()=>null;
export const isTutorialRecruit=(e,route)=>e.recruitment?.[route]?.mode==='automatic'&&e.recruitment[route].requirement==='Automatic (Recruitment Tutorial)';
export function recruitmentValue(e,route,key){
 const main=e.recruitment?.[route];
 return String(main?.[key]??'—');
}

// Display-only: reviewed translations omit the duplicate English condition.
// Original requirements and the English view retain the source wording.
const reviewedRequirements=new Set([
 "Clear Cai's Paralogue, 3000G",'Quest','Automatic (Chapter 6)',
 "Clear Dietrich's Paralogue and They Have Lost, Suitable Item",
 "Clear Leda's Paralogue",'3x Quest',"Clear Bertrand's Paralogue and They Have Lost",
 "Clear Talimun's Paralogue, Answer Yes x3",'Coin flip (pick Tails)',
 "Clear Orchel's Paralogue","Clear Anatolia's Paralogue, Answer Questions",
 'Negotiate',"Clear Bertrand's Paralogue",'Answer Questions','Question',
 '3000G','5000G','8000G','2000G','500G','6000G','4000G','800G','1500G'
]);
export function recruitmentRequirementText(requirement,{lang,translate}){
 const value=translate(requirement),suffix='('+requirement+')';
 return lang==='ko'&&reviewedRequirements.has(requirement)&&value.endsWith(suffix)?value.slice(0,-suffix.length).trimEnd():value;
}

export function recruitmentRequirementLines(row,ctx){
 return row.requirementSteps?.length?row.requirementSteps.map(step=>step.text[ctx.lang]||step.text.en):[recruitmentRequirementText(row.requirement,ctx)];
}
