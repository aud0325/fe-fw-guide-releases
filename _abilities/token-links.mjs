import {entityToken} from '../entity-token.mjs';
import {abilityIcon} from './icon-model.mjs';
import {characterSkillHref} from './catalog-model.mjs';
import {abilityDetailHref} from './ability-identities.mjs';
export function abilityToken(row,lang='ko',{icon=abilityIcon(row),className='',attributes={},base='/',inline=false,label=row.name[lang]}={}){
 const href=characterSkillHref(row,lang)||abilityDetailHref(row.id,lang);
 const asset=icon?{...icon,src:icon.src.startsWith('./assets/classes/')?base+icon.src.slice(2):base+'_abilities/'+icon.src.replace(/^\.\//,'')}:null;
 return entityToken({id:row.id,label,inline,kind:row.kind,href:base==='/'?href:base.replace(/\/$/,'')+href,icon:asset,className,title:[row.provisional&&lang==='ko'?'한국어 임시명':'',row.effect?.[lang]].filter(Boolean).join(' · '),attributes});
}
