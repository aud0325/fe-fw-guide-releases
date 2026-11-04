import {media} from './preview-media.mjs';
import {proficiencyMedia} from './proficiency-media.mjs';
import {yuphasImages} from '../yuphas-images.generated.mjs';
import {yuphasAbilityIcons} from './yuphas-icons.generated.mjs';
// All observed spell rows share their school’s book glyph; reuse the representative
// Fire/Heal assets when a spelling variant has no per-row icon mapping.
const spellIcons={black:media.abilities['spell-9bd345189ecf'],white:media.abilities['spell-cc1a89815538']};
export function abilityIcon(row){
 if(row.kind==='skill'){
  const exact=yuphasAbilityIcons[row.id]||(row.category==='personal'&&row.relations.some(r=>(r.routes||[r]).some(r=>r.method==='overblaze'))?yuphasAbilityIcons[row.family]:null);
  if(exact)return exact;
  // A category glyph fills missing mount-skill art; it does not claim a per-skill match.
  if(row.relations?.some(r=>r.type==='mount')){
   const category=row.family==='skill-2f21c5adfe24'?'flying':'cavalry';
   return {...proficiencyIcon(category),categoryFallback:category};
  }
  return null;
 }
 const direct=media.abilities[row.id];
 if(direct)return media.assets[direct];
 if(row.kind==='combat-art')return media.assets[media.groups[row.category]]||null;
 if(row.kind==='spell')return media.assets[spellIcons[row.stats.magicSchool]]||null;
 return null;
}
export function characterIcon(id){
 const image=yuphasImages[id];
 return image?.faceSrc?{...image,src:image.faceSrc.replace('./_abilities/','./'),width:96,height:96}:media.characters[id]||null;
}
export function proficiencyIcon(id){return proficiencyMedia[id]||media.assets[media.proficiencies[id]]||null;}
export function categoryIcon(kind,id){
 if(kind==='combat-art')return media.assets[media.groups[id]]||null;
 if(kind==='spell'&&['white','black'].includes(id))return proficiencyIcon(id+'-magic');
 return null;
}
