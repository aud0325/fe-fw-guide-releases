import {abilitySources,sourceRecords} from './ability-sources.generated.mjs';
import {sourceLinkKey} from '../source-links.mjs';
import {abilityIcon,characterIcon,proficiencyIcon} from './icon-model.mjs';
export function abilitySourceLinks(row,{ownerId}={}){
 const entry=abilitySources[row.id];if(!entry)return [];
 const owners=ownerId?[ownerId]:(row.relations||[]).map(r=>r.id);
 return [...new Map([...entry.definition,...owners.flatMap(id=>entry.relations[id]||[])].map(index=>sourceRecords[index]).map(s=>[sourceLinkKey(s.url)||'local:'+JSON.stringify(s.title),s])).values()];
}
export function abilitySourceImages(row){
 return [abilityIcon(row),...(row.relations||[]).flatMap(r=>[r.type==='character'?characterIcon(r.id):null,...(r.routes||[r]).map(route=>proficiencyIcon(route.proficiency))])].filter(Boolean);
}
