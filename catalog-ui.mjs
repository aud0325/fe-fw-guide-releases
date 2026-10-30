import {sampleAbilitySections,sampleCharacters,sampleItemAbilities,sampleProfileProficiencies} from './_abilities/sample-integration.mjs';
import {guideTopics,guideTopic} from './browse-topics.mjs';
import {renderEntityText} from './entity-text.mjs';
import {itemUsageDetails} from './item-usage.mjs';
import {classifyItem} from './item-types.mjs';
import {visibleMissingFields,visibleProfileFact} from './editorial-details.mjs';
import {consolidateFacts,isDiscoverable} from './editorial-view.mjs';
import {createTranslator} from './locales/index.mjs';
export {roleNames} from './locales/labels.mjs';
import {roleNames} from './locales/labels.mjs';
import {icon} from './icons.mjs';
import {displayText,localizedFacts} from './presentation.mjs';
import {paralogueDetails} from './paralogue-ui.mjs';
import {crateContentsDetails,tradeUsageDetails} from './item-economy-ui.mjs';
import {dungeonChestDetails} from './dungeon-chests-ui.mjs';
import {locationGuidanceDetails} from './location-guidance-ui.mjs';
import {locationMountCaptures} from './mount-acquisition-ui.mjs';
import {locationSupplyDetails} from './location-supplies-ui.mjs';
import {locationReconstruction,materialReconstruction} from './reconstruction-ui.mjs';
import {communityDetails} from './community-ui.mjs';
import {entries,routes,coverage,sources} from './data.mjs';
import {escapeHtml as esc} from './core.mjs';
import {recruitmentDetails} from './recruitment-ui.mjs';
import {recruitmentEquipment,recruitmentCarriers} from './recruitment-equipment-ui.mjs';
import {uncoveredAcquisitionRecords} from './acquisition-map.mjs';
import {promotionItemDetails} from './promotion-items-ui.mjs';
import {forgingDetails,forgingMaterialDetails} from './forging-ui.mjs';
import {equipmentVariantDetails} from './equipment-variants-ui.mjs';
import {pagePath,stateQuery,defaultState} from './routing.mjs';
import {characterDetails,characterGuide} from './character-ui.mjs';
import {ingredientFoodRow,mountFoodRow} from './food-ui.mjs';
import {foodFactKeys} from './food.mjs';
import {mountCategory,mountBonusDetails,mountSkillDetails} from './mount-ui.mjs';
export const classTierOrder=['Unique','Beginner','Specialty','Advanced','Master','Divine'];
export const locationRegion=e=>e.mapProvince?.ko||e.region||'Unverified';
export function locationRegions(list,t){
 const titles=new Map([['Capital',t('app.capital-dagsion')],['Southern Dagda',t('app.southern-dagda')],['Northwestern desert',t('app.northwestern-desert')],['Dagsion outskirts',t('app.dagsion-outskirts')],['Pasithea',t('app.pasithea')]]);
 const ids=[...new Set(list.map(locationRegion))];
 const ordered=[...titles.keys()].filter(id=>ids.includes(id)).concat(ids.filter(id=>!titles.has(id)&&id!=='Unverified'));
 if(ids.includes('Unverified'))ordered.push('Unverified');
 return ordered.map(id=>({id,title:titles.get(id)||(id==='Unverified'?t('app.region-unverified'):displayText(id,t,entries)),entries:list.filter(e=>locationRegion(e)===id)}));
}
export function groupOptions(type){
 if(type==='tip')return guideTopics.filter(g=>entries.some(e=>e.type==='tip'&&isDiscoverable(e)&&guideTopic(e).id===g.id)).map(g=>[g.id,[createTranslator('ko')(g.key),createTranslator('en')(g.key)]]);
 if(type==='character')return Object.entries(roleNames);
 if(type==='location'){const ko=locationRegions(entries.filter(e=>e.type==='location'&&isDiscoverable(e)),createTranslator('ko')),en=locationRegions(entries.filter(e=>e.type==='location'&&isDiscoverable(e)),createTranslator('en'));return ko.map((g,i)=>[g.id,[g.title,en[i].title]]);}
 const categories=[...new Set(entries.filter(e=>e.type===type).map(e=>e.category).filter(Boolean))];
 const ordered=type==='class'?[...classTierOrder.filter(x=>categories.includes(x)),...categories.filter(x=>!classTierOrder.includes(x)).sort()]:categories.sort();
 return ordered.map(x=>[x,[displayText(x,createTranslator('ko'),entries),x]]);
}
export function coveragePanel(t){const counts=['character','item','mount','class','location'].map(type=>entries.filter(e=>e.type===type).length);return `<details class="coverage"><summary>${t('catalog.coverage')} · ${entries.filter(isDiscoverable).length}</summary><p>${t('catalog.characters-items-mounts-classes-locations-quests',{characters:counts[0],items:counts[1],mounts:counts[2],classes:counts[3],locations:counts[4]})}</p></details>`;}
export function catalogDetails(e,{t,tx,name,href,route='all',portraitHtml='',acquisitionHtml='',base='/',growthSkill=false,forgeSelection={},profileProficiencies=sampleProfileProficiencies(e,t.locale,base),characterSkills=sampleCharacters.includes(e.id)?sampleAbilitySections(e,t.locale,base):null}){
 const text=(x,literal,key)=>displayText(x,t,entries,literal,key);
 const table=(facts,extraRows='',head=true)=>{
  const rows=facts.map(f=>{
   let value=text(t(f.valueKo||f.value,f.value),f.literal,f.key);
   if(t.locale==='en'&&f.key==='namu-full-name'&&e.namuProfile?.names?.en)value=e.namuProfile.names.en;
   const untranslated=t.locale==='en'&&/[가-힣]/.test(value);
   const linkedItem=f.itemId&&entries.find(e=>e.id===f.itemId&&e.type==='item');
   const linked=linkedItem?`<a href="${esc(href(linkedItem.id))}">${esc(name(linkedItem))}</a>`:e.type==='character'?esc(value):renderEntityText(t(f.valueKo||f.value,f.value),e,{entries,lang:t.locale,href,format:x=>text(x,f.literal,f.key)});
   return `<tr><th${head?'':' scope="row"'}>${esc(tx(f.label).replace(/\s*\((?:Game8|나무위키|namu\.wiki)\)/g,''))}</th><td>${untranslated?`<span lang="ko" data-keyword-field="${esc(f.key)}">${linked}</span> <small class="original-language">${t('editorial.korean-source-text')}</small>`:`<span data-keyword-field="${esc(f.key)}">${linked}</span>`}</td></tr>`;
  }).join('');
  return `<div class="table-wrap facts-table${e.type==='item'&&!e.forging&&classifyItem(e).minor==='weapons'?' weapon-stats-table':''}"><table>${head?`<thead><tr><th>${t('catalog.field')}</th><th>${t('catalog.value')}</th></tr></thead>`:''}<tbody>${rows}${extraRows}</tbody></table></div>`;
 };
 let out=locationGuidanceDetails(e,{t,name,entries,routes,base})+paralogueDetails(e,{t,tx,name,href,route})+locationReconstruction(e,{t,name,entries,base})+(e.type==='location'?promotionItemDetails(e,{t,name,href,entries,base}):'')+locationMountCaptures(e,{t,name,entries,routes,base})+locationSupplyDetails(e,{t,name,href,entries,routes})+dungeonChestDetails(e,{t,name,href,entries,routes});
 if(e.type!=='character'&&e.roles?.length)out+=`<p class="role-tags">${e.roles.map(r=>esc(t(...roleNames[r]))).join(' · ')}</p>`;
 const movedItemKeys=['game8-item-part1','game8-item-part3','game8-item-gathering','game8-report-817080','game8-report-817081'];
 const mountMoved=f=>foodFactKeys.includes(f.key)||/^(?:capture-|mount-stats|mount-skills|namu-|game8-(?:capture|acquisition|scope|food-conflict))/.test(f.key);
 const facts=consolidateFacts(localizedFacts((e.facts||[]).filter(f=>(e.type!=='mount'||!mountMoved(f))&&!(e.type==='item'&&acquisitionHtml&&movedItemKeys.includes(f.key))&&!(e.caiPlaceDetails&&e.mapPoint&&f.key==='cai-farming')&&!(e.recruitment&&f.key.startsWith('game8-recruitment-'))),t));
 if(e.type==='mount'){
  const category=mountCategory(e,t);
  if(category)facts.unshift({key:'mount-category',label:{ko:'분류',en:'Category'},value:category,literal:true});
 }
 const forgingKeys=new Set(['category','rank','might','hit','crit','weight','avoid','range','uses','curse','effect']);
 const basic=facts.filter(f=>!['joins','first-appearance'].includes(f.key)&&!(e.forging&&(forgingKeys.has(f.key)||/^observed-(?:upgrade-|base-differences)/.test(f.key)))),story=facts.filter(f=>['joins','first-appearance'].includes(f.key));
 if(e.type==='item'&&classifyItem(e).minor==='weapons'){
  const order=['category','rank','might','hit','crit','weight','avoid','range','uses','curse','effect'];
  const position=f=>order.includes(f.key)?order.indexOf(f.key):order.length;
  basic.sort((a,b)=>position(a)-position(b));
 }
 const foodRow=mountFoodRow(e,{t,sources,tx})+ingredientFoodRow(e,{t});
 const basicHtml=(basic.length||foodRow)?`<h2>${t('catalog.reference-facts')}</h2>${table(basic,foodRow,false)}`:'';
 if(e.type==='character'){
  const growth=characterDetails(e,{t,tx,name,href,entries,base,growthSkill,part:'growth'});
  const support=characterDetails(e,{t,tx,name,href,entries,base,growthSkill,part:'supports'}),activities=characterDetails(e,{t,tx,name,href,entries,base,growthSkill,part:'activities'}),social=characterDetails(e,{t,tx,name,href,entries,base,growthSkill,part:'social'});
  const identityKeys=['class','namu-class','faction'];
  const capabilityKeys=['pref_skills','nonideal_skills','ability','personal-ko','namu-personal-skill'];
  const value=f=>f?text(t(f.valueKo||f.value,f.value),f.literal,f.key).trim():'';
  const initialClass=value(basic.find(f=>f.key==='class'));
  const personalKo=e.facts?.find(f=>f.key==='personal-ko')?.value?.split(/[:：]/)[0].trim();
  const personal=value(basic.find(f=>f.key==='personal-ko')||basic.find(f=>f.key==='ability'));
  // Collapse only matching duplicate labels; keep differing reports and all source records.
  const core=basic.filter(f=>!(f.key==='namu-class'&&value(f)===initialClass)&&!(f.key==='namu-personal-skill'&&(value(f)===personal.split(/[:：]/)[0].trim()||(t.locale==='en'&&basic.some(x=>x.key==='ability')&&f.value.trim()===personalKo))));
  const profileFacts=core.filter(f=>identityKeys.includes(f.key));
  const proficiencyFacts=core.filter(f=>['pref_skills','nonideal_skills'].includes(f.key));
  const skillFacts=core.filter(f=>capabilityKeys.includes(f.key)&&!proficiencyFacts.includes(f));
  const definitions=(facts,className)=>`<dl class="${className}">${[...table(facts,'',false).matchAll(/<tr><th[^>]*>([\s\S]*?)<\/th><td>([\s\S]*?)<\/td><\/tr>/g)].map(([,label,value],index)=>`<div><dt>${label}</dt><dd>${className==='proficiency-overview'?`<span class="proficiency-affinity affinity-${facts[index].key==='pref_skills'?'preferred':'nonpreferred'}">${value}</span>`:value}</dd></div>`).join('')}</dl>`;
  const proficiencies=profileProficiencies??(proficiencyFacts.length?definitions(proficiencyFacts,'proficiency-overview'):'');
  const skills=characterSkills??(skillFacts.length?`<section id="section-abilities" tabindex="-1"><h2>${t('character.skills')}</h2>${table(skillFacts,'',false)}</section>`:'');
  const biography=basic.filter(f=>!identityKeys.includes(f.key)&&!capabilityKeys.includes(f.key)&&visibleProfileFact(f));
  const sections=['profile',...(e.recruitment||e.recruitmentAvailability?['recruitment']:[]),...(growth?['training']:[]),...(e.recruitmentEquipment?.length?['recruitment-equipment']:[]),...(skills?['abilities']:[]),...(e.trainingGuide?['guide']:[]),...(support?['supports']:[]),...(activities?['activities']:[]),...(biography.length?['biography']:[]),...(e.gifts?.length?['gifts']:[]),...(e.birdConversations?.length?['bird-dialogue']:[])];
  const sectionPath=pagePath({id:e.id},t.locale,base)+stateQuery({...defaultState(),id:e.id,route,growthSkill});
  out+=`<nav class="character-sections" aria-label="${t('character.sections')}">${sections.map(id=>`<a href="${esc(sectionPath)}#section-${id}">${id==='recruitment-equipment'?t('equipment.nav'):id==='supports'?t('support.title'):id==='meals'?t('social.meals'):id==='bird-dialogue'?t('social.bird-title'):id==='activities'?t('activity.nav'):t('character.'+id)}</a>`).join('')}</nav>`;
  out+=`<div class="character-overview-layout"><div class="character-identity"><section id="section-profile" class="character-profile${portraitHtml?' has-portrait':''}" aria-label="${t('character.profile-proficiencies')}" tabindex="-1"><div class="profile-top">${portraitHtml}<div class="profile-info"><h1 tabindex="-1" id="entry-title">${esc(name(e))}</h1>${profileFacts.length?definitions(profileFacts,'profile-facts'):''}</div>${proficiencies}</div></section>`;
  out+=growth+'</div>';
  out+=recruitmentDetails(e,{t,tx,name,href,entries,routes,sources,route,text})+'</div>';
  out+=recruitmentEquipment(e,{t,name,href,entries,routes,route,base});
  out+=skills;
  out+=characterGuide(e,{t,tx,name,href,entries,sources});
  out+=support+activities;
  if(biography.length)out+=`<section id="section-biography" tabindex="-1"><h2>${t('character.biography')}</h2>${table(biography,'',false)}</section>`;
  out+=social;
 }else if(e.type==='mount')out+=basicHtml+mountBonusDetails(e,{t,tx})+mountSkillDetails(e,{t,tx})+acquisitionHtml;
 else out+=basicHtml+equipmentVariantDetails(e,{t,entries,base})+forgingDetails(e,{t,name,entries,base,forgeSelection})+(e.forging?'':sampleItemAbilities(e,t.locale,base))+(e.type==='item'?promotionItemDetails(e,{t,name,href,entries,base}):'')+recruitmentCarriers(e,{t,name,href,entries,routes,route,base})+crateContentsDetails(e,{t,name,href,entries})+acquisitionHtml+materialReconstruction(e,{t,name,entries,base})+forgingMaterialDetails(e,{t,name,entries,base})+tradeUsageDetails(e,{t,name,href,entries})+itemUsageDetails(e,{t,name,href,entries,base});
 if(e.type!=='character'&&(story.length||e.lateJoin&&!e.lateRecruitment&&!e.recruitmentAvailability))out+=`<details class="coverage"><summary>${t(e.lateRecruitment?'recruitment.earlier-spoilers':'catalog.appearances-later-recruitment-spoilers')}</summary>${story.length?table(story):''}${e.lateJoin&&!e.lateRecruitment&&!e.recruitmentAvailability?`<p>${esc(tx(e.lateJoin))}</p>`:''}</details>`;

 const otherAcquisition=uncoveredAcquisitionRecords(e);
 if(otherAcquisition.length&&!acquisitionHtml)out+=`<h2>${t('catalog.reported-acquisition')}</h2><div class="table-wrap"><table><thead><tr><th>${t('catalog.method')}</th><th>${t('catalog.location-quest')}</th><th>${t('catalog.route-chapter')}</th></tr></thead><tbody>${otherAcquisition.map(a=>`<tr><td>${esc(text(a.method))}</td><td>${a.locationId?`<a href="${href(a.locationId)}">${esc(a.locationId?name(entries.find(e=>e.id===a.locationId)):text(a.where))}</a>`:esc(a.locationId?name(entries.find(e=>e.id===a.locationId)):text(a.where))}</td><td>${esc(text(a.route||'—'))} · ${a.chapter??'—'}</td></tr>`).join('')}</tbody></table></div>`;
 const missing=visibleMissingFields(e,entries),missingLabels={'Acquisition location':'catalog.unknown-acquisition','Food preference':'catalog.unknown-food','Recruitment requirements':'catalog.unknown-recruitment'};
 if(missing.length)out+=`<p class="notice">${missing.map(field=>esc(missingLabels[field]?t(missingLabels[field]):t('catalog.unknown-field',{field:text(field)}))).join(' · ')}</p>`;

 out+=communityDetails(e,{t,tx,routes,route,showGathering:!acquisitionHtml,showNotes:e.type!=='mount'});
 return out;
}
