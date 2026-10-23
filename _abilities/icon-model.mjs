import {media} from './preview-media.mjs';
import {proficiencyMedia} from './proficiency-media.mjs';
export function abilityIcon(row){
 if(row.kind==='skill')return null;
 const direct=media.abilities[row.id];
 if(direct)return media.assets[direct];
 if(row.kind==='combat-art')return media.assets[media.groups[row.category]]||null;
 return null;
}
export function characterIcon(id){return media.characters[id]||null;}
export function proficiencyIcon(id){return proficiencyMedia[id]||media.assets[media.proficiencies[id]]||null;}
export function categoryIcon(kind,id){
 if(kind==='combat-art')return media.assets[media.groups[id]]||null;
 if(kind==='spell'&&['white','black'].includes(id))return proficiencyIcon(id+'-magic');
 return null;
}
