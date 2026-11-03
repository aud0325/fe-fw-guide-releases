import {calculatorCharacters,calculatorClasses,startsFor} from './growth-calculator-data.mjs';
import {startLevelOptions} from './growth-calculator-plans.mjs';
export const recruitmentRoutes=['cai','dietrich','theodora','leda'];
export const recruitmentRouteName=(route,lang,t)=>calculatorCharacters.find(e=>e.id===route)?.name?.[lang]||t('calculator.'+route);
const chapterText=(p,t)=>t('calculator.recruitChapter',{chapter:p.chapter});
const first=(id,route)=>startsFor(id,route).sort((a,b)=>a.chapter-b.chapter||a.level-b.level)[0];
const localized=(ko,en)=>({ko,en});
const detail=(p,lang,t,minimum=false)=>`${recruitmentRouteName(p.route,lang,t)} ${chapterText(p,t)}${minimum?' · '+t('calculator.recruitMinimum'):''}`;
export function characterRecruitmentViews({t,lang}){
 const all=calculatorCharacters.map(e=>{const starts=startsFor(e.id),level=Math.min(...starts.map(p=>p.level)),minimum=starts.filter(p=>p.level===level).sort((a,b)=>a.chapter-b.chapter)[0];return {...e,pickerLevel:level,pickerDetail:minimum?detail(minimum,lang,t,true):''};});
 const views=[{route:'',items:all}];
 for(const route of recruitmentRoutes){const items=calculatorCharacters.flatMap(e=>{const p=first(e.id,route);return p?[{...e,pickerLevel:p.level,pickerChapter:p.chapter,pickerGroup:chapterText(p,t),pickerDetail:e.recruitment?.[route]?.mode==='automatic'?t('calculator.recruitAutomatic'):t('calculator.recruitRequirements',{renown:e.recruitment?.[route]?.renown,support:e.recruitment?.[route]?.support})}]:[];}).sort((a,b)=>a.pickerChapter-b.pickerChapter||a.pickerLevel-b.pickerLevel||a.name[lang].localeCompare(b.name[lang]));if(items.length)views.push({route,items});}
 return views;
}
export function startRecruitmentViews(characterId,selectedId,{t,lang}){
 const starts=startsFor(characterId),className=p=>calculatorClasses.find(c=>c.id===p.classId)?.name?.[lang]||'',item=(p,text)=>({id:p.id,name:localized('Lv'+p.level,'Lv'+p.level),pickerDetail:text+' · '+className(p)});
 const all=startLevelOptions(characterId).map(g=>{const p=starts.find(s=>s.id===selectedId&&g.routes.includes(s.route)&&s.level===g.preset.level&&s.classId===g.preset.classId&&JSON.stringify(s.stats)===JSON.stringify(g.preset.stats))||g.preset;const routes=g.minimumRoutes.length?g.minimumRoutes:g.routes;return item(p,routes.map(route=>detail(g.minimumRoutes.length?first(characterId,route):starts.find(s=>s.route===route&&s.level===p.level&&s.classId===p.classId&&JSON.stringify(s.stats)===JSON.stringify(p.stats)),lang,t,g.minimumRoutes.includes(route))).join(' / '));});
 return [{route:'',items:all},...recruitmentRoutes.flatMap(route=>{const rows=starts.filter(p=>p.route===route).sort((a,b)=>a.chapter-b.chapter||a.level-b.level);return rows.length?[{route,items:rows.map((p,i)=>item(p,chapterText(p,t)+(i===0?' · '+t('calculator.recruitMinimum'):'')))}]:[]})];
}
