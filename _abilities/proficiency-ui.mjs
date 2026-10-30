import {proficiencyMedia} from './proficiency-media.mjs';
export function proficiencyGlyph(id,affinity='normal'){
 const media=proficiencyMedia[id];if(!media)return '';
 const tone=['preferred','nonpreferred'].includes(affinity)?affinity:'normal',asset=media.variants?.[tone]||media;
 return `<img class="proficiency-glyph proficiency-glyph-${tone}" src="${'_abilities/'+asset.src.replace(/^\.\//,'')}" width="28" height="28" alt="" aria-hidden="true" decoding="async">`;
}
