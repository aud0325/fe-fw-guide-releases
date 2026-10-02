import {normalize} from './core.mjs';
const shortcuts=[{category:'growth',titleKey:'growth.title',descriptionKey:'growth.homeDescription',terms:['성장률','성장률 비교','성장률 표','히트맵','growth','growth rates','heatmap']},{
 category:'paralogue',titleKey:'app.paralogue-index',descriptionKey:'app.paralogue-index-description',
 terms:['외전','외전 목록','외전 일정','외전 조건','외전 보상','paralogue','paralogues','schedule','conditions','rewards','overview']
}];
export function searchShortcuts(query=''){
 const tokens=query.trim().split(/\s+/).map(normalize).filter(Boolean);
 return tokens.length?shortcuts.filter(s=>tokens.every(token=>s.terms.some(term=>normalize(term).includes(token)))):[];
}
