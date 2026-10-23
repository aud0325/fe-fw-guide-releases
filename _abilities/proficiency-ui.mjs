import {proficiencyMedia} from './proficiency-media.mjs';
export function proficiencyGlyph(id,affinity='normal'){
 const asset=proficiencyMedia[id];if(!asset)return '';
 const tone=['preferred','nonpreferred'].includes(affinity)?affinity:'normal';
 return `<img class="proficiency-glyph proficiency-glyph-${tone}" src="${'_abilities/'+asset.src.replace(/^\.\//,'')}" width="28" height="28" alt="" aria-hidden="true" decoding="async">`;
}
