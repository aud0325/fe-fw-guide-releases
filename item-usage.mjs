import {classifyItem,itemKinds} from './item-types.mjs';
import {flavors} from './food.mjs';
import {escapeHtml as esc} from './core.mjs';
import {displayText} from './presentation.mjs';
import {routes} from './locales/labels.mjs';

export function itemUses(e,entries){
 if(e.type!=='item')return {gifts:[],recruitment:[],sourceIds:[]};
 const gifts=[],recruitment=[],sourceIds=new Set();
 for(const character of entries.filter(e=>e.type==='character')){
  for(const gift of character.gifts||[])if(gift.itemId===e.id){gifts.push({character,gift});if(gift.sourceId)sourceIds.add(gift.sourceId);}
  const requirements=Object.entries(character.recruitment||{}).filter(([,r])=>r.mode==='scout'&&r.item===e.id);
  if(requirements.length){recruitment.push({character,requirements});for(const [,r] of requirements)sourceIds.add(r.requirementSourceId||r.sourceId);}
 }
 return {gifts,recruitment,sourceIds:[...sourceIds].filter(Boolean)};
}
export function itemDescription(e,{t,tx,entries,sources}){
 if(e.type!=='item')return '';
 const facts=e.facts||[],kind=classifyItem(e),field=f=>displayText(t.locale==='ko'?f.valueKo||f.value:f.value,t,entries,f.literal,f.key);
 const effect=facts.find(f=>f.key==='game8-item-effect')||facts.find(f=>f.key==='effect');
 if(effect){
  const prefix=sources[effect.sourceId]?.kind==='unverified'?t('catalog.field-reference-only')+' · ':'';
  const stage=facts.find(f=>f.key==='weapon-stage');
  return prefix+t('item.effect-summary',{effect:field(effect)})+(stage?' '+field(stage):'');
 }
 if(e.materialDescription)return tx(e.materialDescription);
 if(e.ingredientFlavor&&flavors[e.ingredientFlavor.flavor])return t('item.known-flavor',{flavor:tx(flavors[e.ingredientFlavor.flavor])});
 if(facts.some(f=>f.key==='game8-item-gathering')||e.gathering?.length)return t('item.material-summary',{kind:t(itemKinds[kind.kind].ko,itemKinds[kind.kind].en)});
 const original=tx(e.summary);
 if(!/성능과 요구 기능을 확인할 수 있습니다|weapon with reference stats and required skills|영어 색인 수록|영어 위키 (?:무기|병종) 표 수록|Only information supported by the cited references|확인된 참고 자료의 정보만|See the verification status|(?:Listed in the )?English wiki (?:weapon|class) table/i.test(original))return original;
 if(kind.kind==='gift')return t('item.gift-summary');
 if(['weapons','magic'].includes(kind.minor)){
  const rank=facts.find(f=>f.key==='rank'),range=facts.find(f=>f.key==='range');
  const requirements=(rank?t('item.rank-summary',{rank:field(rank)}):'')+(range?t('item.range-summary',{range:field(range)}):'');
  return t(kind.minor==='magic'?'item.magic-summary':'item.weapon-summary',{kind:t(itemKinds[kind.kind].ko,itemKinds[kind.kind].en),requirements});
 }
 const gathering=facts.find(f=>['game8-item-gathering','game8-item-drop'].includes(f.key));
 if(gathering)return field(gathering);
 return kind.kind==='other'?t('item.use-undocumented'):t('item.material-summary',{kind:t(itemKinds[kind.kind].ko,itemKinds[kind.kind].en)});
}
export function itemUsageDetails(e,{t,name,href,entries}){
 const {gifts,recruitment}=itemUses(e,entries);
 if(!gifts.length&&!recruitment.length)return '';
 const link=(entry,route='')=>`<a href="${href(entry.id)+(route?'?route='+route:'')}">${esc(name(entry))}</a>`;
 let html=`<section class="item-usage"><h2>${t('item.usage')}</h2>`;
 if(recruitment.length)html+=`<h3>${t('item.required-by')}</h3><ul>${recruitment.map(({character,requirements})=>`<li>${link(character)}<ul>${requirements.map(([route,r])=>`<li><a href="${href(character.id)+'?route='+route}">${esc(t(...routes.find(([id])=>id===route).slice(1)))}</a> · ${esc(t('item.quantity',{count:r.quantity??'—'}))}</li>`).join('')}</ul></li>`).join('')}</ul>`;
 if(gifts.length)html+=`<h3>${t('item.gift-for')}</h3><p class="result-label">${t('character.unverified-public-game8-export-only-reported-preferences-are-shown')}</p><div class="gift-recipients">${gifts.map(({character,gift})=>`<div>${link(character)}<small>${gift.preference==='loved'?t('character.loved'):t('character.really-liked')}</small></div>`).join('')}</div>`;
 return html+'</section>';
}
