import {entries} from './data.mjs';
import {rows} from './_abilities/full-data.mjs';
import {createTranslator} from './locales/index.mjs';
import {displayText} from './presentation.mjs';
export {tierNames} from './class-tiers.mjs';
import {proficiencyNames} from './proficiency-names.mjs';
export {proficiencyNames} from './proficiency-names.mjs';
import {classReference} from './class-reference.generated.mjs';
export function classFact(e,key,lang){const f=e.facts?.find(f=>f.key===key);return f?displayText(lang==='ko'?f.valueKo??f.value:f.value,createTranslator(lang),entries,false,key):'';}
export function certification(e,lang){
 const p=classReference[e.id];if(!p)return '';
 const names=rows=>rows.map(r=>proficiencyNames[r.id][lang==='ko'?0:1]+' '+r.rank).join(' / ');
 return [p.level?'Lv'+p.level+(lang==='ko'?' 이상':'+'):'',names(p.required),p.oneOf.length?(lang==='ko'?'하나 선택: ':'Any one: ')+names(p.oneOf):''].filter(Boolean).join(' · ');
}
export function classSkills(id,method){const p=classReference[id];if(!p)return [];const ids=method==='class-mastery'?p.masteryIds:method==='class-active'?p.abilityIds:[];return ids.map(id=>rows.find(r=>r.id===id)).filter(Boolean);}
export function characterSkills(id,category){return rows.filter(r=>r.kind==='skill'&&r.category===category&&r.relations.some(x=>x.id===id&&x.type==='character'));}
export function guestSkillSearchNames(entry){return (entry.guestCombat?.appearances||[]).flatMap(appearance=>appearance.abilities?.skill||[]).flatMap(skill=>Object.values(skill.abilityId?rows.find(row=>row.id===skill.abilityId)?.name||{}:skill.name));}
// List one name per declared mount skill, retaining its recorded order and canonical link.
export function mountSkills(entry){
 const provided=rows.filter(r=>r.kind==='skill'&&r.relations.some(x=>x.type==='mount'&&x.id===entry.id));
 return (entry.mountSkills||[]).map(skill=>provided.find(r=>['ko','en'].some(lang=>r.name[lang]===skill.name[lang]))).filter(Boolean);
}
