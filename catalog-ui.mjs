import {guideTopics,guideTopic} from './browse-topics.mjs';
import {renderEntityText} from './entity-text.mjs';
import {itemUsageDetails} from './item-usage.mjs';
import {classifyItem} from './item-types.mjs';
import {isPublicSource} from './source-visibility.mjs';
import {consolidateFacts,isDiscoverable} from './editorial-view.mjs';
import {createTranslator} from './locales/index.mjs';
export {roleNames} from './locales/labels.mjs';
import {roleNames} from './locales/labels.mjs';
import {icon} from './icons.mjs';
import {displayText,localizedFacts,sourceHint,informationHint} from './presentation.mjs';
import {paralogueDetails} from './paralogue-ui.mjs';
import {communityDetails} from './community-ui.mjs';
import {entries,routes,coverage,sources} from './data.mjs';
import {escapeHtml as esc} from './core.mjs';
import {recruitmentDetails} from './recruitment-ui.mjs';
import {characterDetails,characterGuide} from './character-ui.mjs';
import {beginnerGuideBrief} from './beginner-guide-ui.mjs';
import {ingredientFoodRow,mountFoodRow} from './food-ui.mjs';
import {foodFactKeys} from './food.mjs';
import {mountCategory,mountBonusDetails,mountSkillDetails} from './mount-ui.mjs';
export const classTierOrder=['Unique','Beginner','Specialty','Advanced','Master','Divine'];
export const locationRegion=e=>e.mapProvince?.ko||e.region||'Unverified';
export function locationRegions(list,t){
 const titles=new Map([['Capital',t('app.capital-dagsion')],['Saveilon',t('app.saveilon')],['Southern Dagda',t('app.southern-dagda')],['Northwestern desert',t('app.northwestern-desert')],['Dagsion outskirts',t('app.dagsion-outskirts')],['Pasithea',t('app.pasithea')],['Nation',t('app.nations')]]);
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
export function coveragePanel(t){const counts=['character','item','mount','class','location'].map(type=>entries.filter(e=>e.type===type).length);return `<details class="coverage"><summary>${t('catalog.coverage-and-remaining-gaps')} · ${entries.filter(isDiscoverable).length}</summary><p>${t('catalog.characters-items-mounts-classes-locations-quests',{characters:counts[0],items:counts[1],mounts:counts[2],classes:counts[3],locations:counts[4]})}</p><p>${t('catalog.audited-wiki-character-names-item-index-entries-weapon-rows',{characters:coverage.wikiCharacters.length,items:coverage.itemIndex.filter(id=>entries.some(e=>e.id===id)).length,weapons:coverage.weaponTable.length,classes:coverage.classTable.length,recruitment:coverage.recruitmentGuide.length})}</p><p>${t('catalog.this-measures-source-list-coverage-not-completeness-of-the')}</p><p>${t('catalog.complete-mount-varieties-and-capture-sites-some-item-effects')}</p></details>`;}
export function catalogDetails(e,{t,tx,name,href,route='all',portraitHtml='',acquisitionHtml='',base='/',growthSkill=false}){
 const text=(x,literal,key)=>displayText(x,t,entries,literal,key);
 const table=(facts,extraRows='',head=true)=>{
  const rows=facts.map(f=>{
   let value=text(t(f.valueKo||f.value,f.value),f.literal,f.key);
   if(t.locale==='en'&&f.key==='namu-full-name'&&e.namuProfile?.names?.en)value=e.namuProfile.names.en;
   const untranslated=t.locale==='en'&&/[가-힣]/.test(value);
   const ids=[...new Set([f.sourceId,...(f.sourceIds||[])])].filter(id=>isPublicSource(id,sources[id]));
   const pendingId=ids.find(id=>sources[id].kind==='unverified');
   const tooltip=pendingId?[...ids.map(id=>{const s=sources[id];return `${tx(s.title)}${s.checked?' · '+t('common.checked')+' '+s.checked:''}`;}),t('catalog.field-reference-only')].join('\n'):'';
   const hint=pendingId?sourceHint({href:'#source-'+pendingId,tooltip,label:t('editorial.field-source'),symbol:'†',className:'field-reference'}):'';
   const linked=e.type==='character'?esc(value):renderEntityText(t(f.valueKo||f.value,f.value),e,{entries,lang:t.locale,href,format:x=>text(x,f.literal,f.key)});
   return `<tr><th${head?'':' scope="row"'}>${esc(tx(f.label).replace(/\s*\((?:Game8|나무위키|namu\.wiki)\)/g,''))}</th><td>${untranslated?`<span lang="ko">${linked}</span> <small class="original-language">${t('editorial.korean-source-text')}</small>`:linked}${hint}</td></tr>`;
  }).join('');
  return `<div class="table-wrap facts-table${e.type==='item'&&classifyItem(e).minor==='weapons'?' weapon-stats-table':''}"><table>${head?`<thead><tr><th>${t('catalog.field')}</th><th>${t('catalog.value')}</th></tr></thead>`:''}<tbody>${rows}${extraRows}</tbody></table></div>`;
 };
 let out=paralogueDetails(e,{t,tx,name,href,route});
 if(e.roles?.length)out+=`<p class="role-tags">${e.roles.map(r=>esc(t(...roleNames[r]))).join(' · ')}</p>`;
 const movedItemKeys=['game8-item-part1','game8-item-part3','game8-item-gathering','game8-report-817080','game8-report-817081'];
 const mountMoved=f=>foodFactKeys.includes(f.key)||/^(?:capture-|mount-stats|mount-skills|namu-|game8-(?:capture|acquisition|scope|food-conflict))/.test(f.key);
 const facts=consolidateFacts(localizedFacts((e.facts||[]).filter(f=>(e.type!=='mount'||!mountMoved(f))&&!(e.type==='item'&&acquisitionHtml&&movedItemKeys.includes(f.key))&&!(e.caiPlaceDetails&&e.mapPoint&&f.key==='cai-farming')&&!(e.recruitment&&f.key.startsWith('game8-recruitment-'))),t));
 if(e.type==='mount'){
  const category=mountCategory(e,t);
  if(category)facts.unshift({key:'mount-category',label:{ko:'분류',en:'Category'},value:category,literal:true});
 }
 const basic=facts.filter(f=>!['joins','first-appearance'].includes(f.key)),story=facts.filter(f=>['joins','first-appearance'].includes(f.key));
 if(e.type==='item'&&classifyItem(e).minor==='weapons'){
  const order=['category','rank','might','hit','crit','weight','avoid','range','uses','curse','effect'];
  const position=f=>order.includes(f.key)?order.indexOf(f.key):order.length;
  basic.sort((a,b)=>position(a)-position(b));
 }
 const foodRow=mountFoodRow(e,{t,sources,tx})+ingredientFoodRow(e,{t});
 const basicHtml=(basic.length||foodRow)?`<h2>${t('catalog.reference-facts')}</h2>${table(basic,foodRow,false)}`:'';
 if(e.type==='character'){
  const growth=characterDetails(e,{t,tx,name,href,entries,base,growthSkill,part:'growth'});
  const extra=characterDetails(e,{t,tx,name,href,entries,base,growthSkill,part:'other'});
  const identityKeys=['class','namu-class','faction'];
  const capabilityKeys=['pref_skills','nonideal_skills','ability','personal-ko','namu-personal-skill'];
  const value=f=>f?text(t(f.valueKo||f.value,f.value),f.literal,f.key).trim():'';
  const initialClass=value(basic.find(f=>f.key==='class'));
  const personalKo=e.facts?.find(f=>f.key==='personal-ko')?.value?.split(/[:：]/)[0].trim();
  const personal=value(basic.find(f=>f.key==='personal-ko')||basic.find(f=>f.key==='ability'));
  // Collapse only matching duplicate labels; keep differing reports and all source records.
  const core=basic.filter(f=>!(f.key==='namu-class'&&value(f)===initialClass)&&!(f.key==='namu-personal-skill'&&(value(f)===personal.split(/[:：]/)[0].trim()||(t.locale==='en'&&basic.some(x=>x.key==='ability')&&f.value.trim()===personalKo))));
  const profileFacts=[...core.filter(f=>identityKeys.includes(f.key)),...core.filter(f=>capabilityKeys.includes(f.key))];
  const biography=basic.filter(f=>!identityKeys.includes(f.key)&&!capabilityKeys.includes(f.key));
  const sections=['profile',...(e.recruitment?['recruitment']:[]),...(growth?['training']:[]),...(e.trainingGuide?['guide']:[]),...(extra?['gifts']:[]),...(biography.length?['biography']:[])];
  out+=`<nav class="character-sections" aria-label="${t('character.sections')}">${sections.map(id=>`<a href="#section-${id}">${t('character.'+id)}</a>`).join('')}</nav>`;
  out+=beginnerGuideBrief(e,{t,tx,name,href,entries});
  out+=`<section id="section-profile" tabindex="-1"><h2>${t('character.core-profile')}</h2><div class="character-overview${portraitHtml?' has-portrait':''}">${portraitHtml}${profileFacts.length?table(profileFacts,'',false):''}</div></section>`;
  out+=recruitmentDetails(e,{t,tx,name,href,entries,routes,sources,route,text});
  out+=growth;
  out+=characterGuide(e,{t,tx,name,href,entries,sources});
  out+=extra;
  if(biography.length)out+=`<section id="section-biography" tabindex="-1"><h2>${t('character.biography')}</h2>${table(biography,'',false)}</section>`;
 }else if(e.type==='mount')out+=basicHtml+mountBonusDetails(e,{t,tx})+mountSkillDetails(e,{t,tx})+acquisitionHtml;
 else out+=basicHtml+acquisitionHtml+itemUsageDetails(e,{t,name,href,entries});
 if(story.length||e.lateJoin)out+=`<details class="coverage"><summary>${t('catalog.appearances-later-recruitment-spoilers')}</summary>${story.length?table(story):''}${e.lateJoin?`<p>${esc(tx(e.lateJoin))}</p>`:''}</details>`;

 if(e.acquisition?.length&&!acquisitionHtml)out+=`<h2>${t('catalog.reported-acquisition')} ${informationHint(t('catalog.these-are-unverified-secondary-reports-an-absent-route-or'),t('catalog.reported-acquisition')+' · '+t('presentation.information'))}</h2><div class="table-wrap"><table><thead><tr><th>${t('catalog.method')}</th><th>${t('catalog.location-quest')}</th><th>${t('catalog.route-chapter')}</th></tr></thead><tbody>${e.acquisition.map(a=>`<tr><td>${esc(text(a.method))}</td><td>${a.locationId?`<a href="${href(a.locationId)}">${esc(a.locationId?name(entries.find(e=>e.id===a.locationId)):text(a.where))}</a>`:esc(a.locationId?name(entries.find(e=>e.id===a.locationId)):text(a.where))}</td><td>${esc(text(a.route||'—'))} · ${a.chapter??'—'}</td></tr>`).join('')}</tbody></table></div>`;
 if(e.missing?.length)out+=`<p class="notice">${t('catalog.still-to-verify')}: ${esc(e.missing.map(text).join(' · '))}</p>`;

 out+=communityDetails(e,{t,tx,routes,route,showGathering:!acquisitionHtml,showNotes:e.type!=='mount'});
 return out;
}
