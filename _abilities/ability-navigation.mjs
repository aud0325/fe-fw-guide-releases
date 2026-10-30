import {rows} from './full-data.mjs';
import {characterSkillHref} from './catalog-model.mjs';
import {canonicalAbilityId,abilityDetailHref} from './ability-identities.mjs';
import {isCombatArtUpgrade,combatArtVariants} from './combat-art-upgrades.mjs';

export const abilityKinds=['skill','combat-art','spell'];
export const abilityEntries=rows.filter(r=>!isCombatArtUpgrade(r)).map(r=>({id:r.id,type:r.kind,name:r.name,summary:r.effect,aliases:[...new Set([...Object.values(r.aliases||{}).flat(),...combatArtVariants(r,rows).slice(1).flatMap(v=>[...Object.values(v.name),...Object.values(v.aliases||{}).flat()])])],facts:[],links:[],sourceIds:[]}));
export const abilityEntry=id=>abilityEntries.find(e=>e.id===canonicalAbilityId(id));
export function characterAbilityTarget(id,lang){
 const row=rows.find(r=>r.id===id);return row?characterSkillHref(row,lang):null;
}
export function legacyAbilityPath(hash){
 const p=new URLSearchParams(hash.replace(/^#/,'')),lang=p.get('lang')==='en'?'en':'ko';
 if(!p.has('kind')&&!p.has('view'))return null;
 if(p.get('view')==='character'&&p.get('char'))return `/${lang}/entry/${encodeURIComponent(p.get('char'))}/`;
 if(p.get('view')==='characters'||p.get('mode')==='learnsets')return `/${lang}/category/character/`;
 if(p.get('view')==='detail'&&p.get('id'))return characterAbilityTarget(canonicalAbilityId(p.get('id')),lang)||abilityDetailHref(p.get('id'),lang);
 const kind=abilityKinds.includes(p.get('kind'))?p.get('kind'):'skill',group=p.get('section');
 return `/${lang}/category/${kind}/`+(group?'?group='+encodeURIComponent(group):'');
}
