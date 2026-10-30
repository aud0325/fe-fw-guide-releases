import {entries} from './data.mjs';
import {rows} from './_abilities/full-data.mjs';
import {createTranslator} from './locales/index.mjs';
import {displayText} from './presentation.mjs';
export const tierNames={Unique:['기본직','Base'],Beginner:['초급직','Beginner'],Specialty:['중급직','Specialty'],Advanced:['상급직','Advanced'],Master:['최상급직','Master'],Divine:['신장직','Divine']};
export const proficiencyNames={sword:['검술','Sword'],spear:['창술','Spear'],axe:['도끼술','Axe'],bow:['궁술','Bow'],gauntlet:['격투술','Gauntlet'],'black-magic':['흑마술','Black magic'],'white-magic':['백마술','White magic'],authority:['지휘','Authority'],infantry:['보병','Infantry'],armor:['중장','Armor'],cavalry:['기마','Riding'],flying:['비행','Flying']};
export function classFact(e,key,lang){const f=e.facts?.find(f=>f.key===key);return f?displayText(lang==='ko'?f.valueKo??f.value:f.value,createTranslator(lang),entries,false,key):'';}
export function certification(e,lang){
 const level=e.promotionRequirement?.minimumLevel,prefix=level?(lang==='ko'?`Lv${level} 이상`:`Lv${level}+`):'';
 const result=value=>[prefix,value].filter(Boolean).join(' · ');
 const required=classFact(e,'class-required-ko',lang),choice=classFact(e,'class-choice-ko',lang);
 if(required||choice)return result([required,choice&&choice!==required?createTranslator(lang)('overview.one-of')+choice:''].filter(Boolean).join(' · '));
 for(const key of ['ko-require','requirements','requirement','exam']){const value=classFact(e,key,lang);if(value)return result(value);}
 return prefix;
}
export function classSkills(id,method){return rows.filter(r=>r.relations.some(x=>x.id===id&&x.type==='class'&&(x.routes||[x]).some(y=>y.method===method)));}
export function characterSkills(id,category){return rows.filter(r=>r.kind==='skill'&&r.category===category&&r.relations.some(x=>x.id===id&&x.type==='character'));}
// List one name per declared mount skill, retaining its recorded order and canonical link.
export function mountSkills(entry){
 const provided=rows.filter(r=>r.kind==='skill'&&r.relations.some(x=>x.type==='mount'&&x.id===entry.id));
 return (entry.mountSkills||[]).map(skill=>provided.find(r=>['ko','en'].some(lang=>r.name[lang]===skill.name[lang]))).filter(Boolean);
}
