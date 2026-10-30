import {entries} from './data.mjs';
import {searchEntries,escapeHtml as esc} from './core.mjs';
import {entryDisplayName,isDiscoverable} from './editorial-view.mjs';
import {characterFaction,displayText,localized} from './presentation.mjs';
import {listingState} from './navigation.mjs';
import {pagePath,stateQuery} from './routing.mjs';
import {createTranslator} from './locales/index.mjs';
import {roleNames} from './locales/labels.mjs';
import {feedbackLink} from './feedback.mjs';
import {characterGroups,primaryRole,factionKey} from './browse-groups.mjs';
import {scoutRoute,sortScouts,scoutToolbar} from './character-list.mjs';
import {recruitmentValue,isTutorialRecruit,recruitmentRequirementText,recruitmentRequirementLines} from './recruitment.mjs';
import {specialties,nonSpecialties} from './_abilities/catalog-model.mjs';
import {uniqueAvailability} from './_abilities/integration-data.mjs';
import {abilityToken} from './_abilities/token-links.mjs';
import {characterIcon} from './_abilities/icon-model.mjs';
import {entityToken} from './entity-token.mjs';
import {entryIconMedia} from './entity-media.mjs';
import {mountCategory} from './mount-ui.mjs';
import {tierNames,proficiencyNames,classFact,certification,classSkills,characterSkills,mountSkills} from './catalog-overview-model.mjs';
const empty=()=>'<span class="overview-empty" aria-label="—">—</span>';
export function classToken(e,lang,base='/'){const media=entryIconMedia(e);return entityToken({id:e.id,label:entryDisplayName(e,lang),kind:'class',href:pagePath({id:e.id},lang,base),icon:media?{...media,src:base+media.src.slice(2)}:null});}
function tokenList(abilities,lang,fallback='',base='/',stacked=false){return abilities.length?`<div class="entity-token-stack${stacked?' overview-stacked-skills':''}">${abilities.map(r=>abilityToken(r,lang,{base})).join(stacked?'':', ')}</div>`:fallback?`<span class="entity-token-static">${esc(fallback)}</span>`:empty();}
const cell=(key,label,content,shortLabel=label)=>`<td role="cell" class="overview-${key}"><span class="overview-mobile-label" aria-hidden="true">${esc(shortLabel)}</span><div class="overview-cell-content">${content}</div></td>`;
function tableFrame({kind,caption,headings,body}){return `<div class="overview-scroll" role="region" tabindex="0" aria-label="${esc(caption)}"><table role="table" class="overview-table ${kind}-overview-table"><caption class="sr-only">${esc(caption)}</caption><thead role="rowgroup"><tr role="row">${headings.map(h=>`<th scope="col" role="columnheader">${esc(h)}</th>`).join('')}</tr></thead><tbody role="rowgroup">${body}</tbody></table></div>`;}
function personName(e,lang,base,route){const media=characterIcon(e.id);return `<a class="overview-person" href="${pagePath({id:e.id},lang,base)}${route!=='all'?'?route='+route:''}">${media?`<img src="${esc(base+'_abilities/'+media.src.replace(/^\.\//,''))}" alt="" width="24" height="26" loading="lazy" decoding="async">`:''}<span>${esc(entryDisplayName(e,lang))}</span></a>`;}
export function directorySearchText(e){
 if(e.type==='class')return [e.name.ko,e.name.en,certification(e,'ko'),certification(e,'en'),tierNames[e.category]?.join(' '),...['class-mastery','class-active'].flatMap(method=>classSkills(e.id,method).flatMap(r=>Object.values(r.name)))].join(' ').toLocaleLowerCase();
 if(e.type==='mount')return [e.name.ko,e.name.en,...(e.aliases||[]),...['ko','en'].map(lang=>mountCategory(e,createTranslator(lang))),e.category,...mountSkills(e).flatMap(r=>Object.values(r.name)),...(e.mountSkills||[]).flatMap(r=>Object.values(r.name))].join(' ').toLocaleLowerCase();
 return [e.name.ko,e.name.en,...(e.aliases||[]),...(e.roles||[]).flatMap(role=>roleNames[role]||[]),...['ko','en'].map(lang=>characterFaction(e,createTranslator(lang),entries)),...specialties(e.id).map(p=>proficiencyNames[p]?.join(' ')),...nonSpecialties(e.id).map(p=>proficiencyNames[p]?.join(' ')),...['personal','unique'].flatMap(category=>characterSkills(e.id,category).flatMap(r=>Object.values(r.name)))].join(' ').toLocaleLowerCase();
}
const matchesQuery=(entry,query)=>!query||directorySearchText(entry).includes(query.trim().toLocaleLowerCase());
const rowStart=(entry,query)=>`<tr role="row" data-overview-id="${entry.id}"${matchesQuery(entry,query)?'':' hidden'} data-overview-search="${esc(directorySearchText(entry))}">`;
function scoutRequirement(e,route,{t,lang,base}){
 const r=e.recruitment?.[route];if(!r)return esc(t('catalog.not-documented'));
 if(r.mode==='unknown'&&e.lateRecruitment)return `<a href="${pagePath({id:e.id},lang,base)}#section-later-recruitment">${esc(t('recruitment.later-link'))}</a>`;
 if(r.mode==='automatic')return esc(t(isTutorialRecruit(e,route)?'character.tutorial-report':'common.automatic'));
 const parts=[],item=entries.find(x=>x.id===r.item);
 if(item)parts.push(`<a href="${pagePath({id:item.id},lang,base)}">${esc(entryDisplayName(item,lang))}</a>${r.quantity!=null?' × '+esc(r.quantity):''}`);
 if(r.gold!=null&&!r.requirementSteps?.length)parts.push(esc(r.gold.toLocaleString(lang))+'G');
 // The free-text condition can carry a prerequisite in addition to a numeric cost.
 let requirement=String(r.requirement||'').trim();
 if(r.gold!=null)requirement=requirement.replace(new RegExp('\\b'+String(r.gold).replace(/(\d)(?=(\d{3})+$)/g,'$1,?')+'\\s*G\\b','ig'),'').replace(/^[\s,·+]+|[\s,·+]+$/g,'');
 if(!item&&requirement&&!['N/A','Automatic','None'].includes(requirement))parts.unshift(...recruitmentRequirementLines({...r,requirement},{lang,translate:value=>displayText(value,t,entries)}).map(esc));
 if(r.mode==='unknown')parts.push(esc(t('catalog.not-documented')));
 return parts.length?parts.map(part=>`<span class="recruitment-condition-line">${part}</span>`).join(''):empty();
}
function characterRow(e,{lang,t,state,route,base,query}){
 const name=personName(e,lang,base,route);
 if(route!=='all'){
  const automatic=e.recruitment?.[route]?.mode==='automatic';
  return rowStart(e,query)+`<th scope="row" role="rowheader" class="overview-name">${name}</th>`+cell('support',t('directory.support-level'),automatic?'—':esc(recruitmentValue(e,route,'support')),t('catalog.support'))+cell('renown',t('catalog.renown'),automatic?'—':esc(recruitmentValue(e,route,'renown')))+cell('requirement',t('catalog.requirement'),scoutRequirement(e,route,{t,lang,base}))+'</tr>';
 }
 const faction=characterFaction(e,t,entries),factionState={...state,query:'',catalogQuery:'',group:primaryRole(e),faction:factionKey(e)},availability=uniqueAvailability[e.id];
 const factionLink=primaryRole(e)==='playable'?`<a href="${esc(pagePath(factionState,lang,base)+stateQuery(factionState))}">${esc(faction)}</a>`:esc(faction);
 const uniqueFallback=availability?t(availability.status==='reported-absent'?'overview.reported-absent':'overview.unconfirmed'):'';
 return rowStart(e,query)+`<th scope="row" role="rowheader" class="overview-name">${name}</th>`+cell('faction',t('overview.faction'),factionLink)+cell('personal',t('overview.personal-skill'),tokenList(characterSkills(e.id,'personal'),lang,'',base))+cell('unique',t('overview.unique-skill'),tokenList(characterSkills(e.id,'unique'),lang,uniqueFallback,base,true))+'</tr>';
}
export function characterOverviewTable(list,{lang='ko',state={},route='all',caption='',base='/',query=''}={}){
 const t=createTranslator(lang),scout=route!=='all';
 return tableFrame({kind:scout?'scout':'character',caption:caption||t('overview.character-directory'),headings:scout?[t('overview.name'),t('directory.support-level'),t('catalog.renown'),t('catalog.requirement')]:[t('overview.name'),t('overview.faction'),t('overview.personal-skill'),t('overview.unique-skill')],body:list.map(e=>characterRow(e,{lang,t,state,route,base,query})).join('')});
}
export function classOverviewTable(list,lang='ko',base='/',query=''){
 const t=createTranslator(lang);
 return tableFrame({kind:'class',caption:t('overview.class-directory'),headings:[t('overview.class'),t('overview.tier'),t('overview.certification'),t('overview.mastery'),t('overview.class-abilities')],body:list.map(e=>{
  const condition=certification(e,lang),unlock=classFact(e,'unlock',lang);
  return rowStart(e,query)+`<th scope="row" role="rowheader" class="overview-name">${classToken(e,lang,base)}</th>`+cell('tier',t('overview.tier'),esc(tierNames[e.category]?.[lang==='ko'?0:1]||e.category))+cell('condition',t('overview.certification'),(condition?esc(condition):empty())+(unlock?`<details class="overview-unlock"><summary>${t('overview.unlock-condition')}</summary><p>${esc(unlock)}</p></details>`:''))+cell('mastery',t('overview.mastery'),tokenList(classSkills(e.id,'class-mastery'),lang,classFact(e,'mastery',lang),base))+cell('active',t('overview.class-abilities'),tokenList(classSkills(e.id,'class-active'),lang,classFact(e,'skills',lang),base))+'</tr>';
 }).join('')});
}
export function mountOverviewTable(list,lang='ko',base='/',query=''){
 const t=createTranslator(lang);
 return tableFrame({kind:'mount',caption:t('directory.mount-directory'),headings:[t('overview.name'),t('directory.kind'),t('directory.skills')],body:list.map(e=>{
  const media=entryIconMedia(e),name=`<a class="overview-mount" href="${pagePath({id:e.id},lang,base)}">${media?`<img src="${esc(base+media.src.slice(2))}" alt="" width="24" height="24" loading="lazy" decoding="async">`:''}<span>${esc(entryDisplayName(e,lang))}</span></a>`;
  const linked=mountSkills(e),fallback=(e.mountSkills||[]).map(s=>localized(s.name,lang)).join(', ');
  return rowStart(e,query)+`<th scope="row" role="rowheader" class="overview-name">${name}</th>`+cell('kind',t('directory.kind'),esc(mountCategory(e,t)||t('overview.unconfirmed')))+cell('skills',t('directory.skills'),tokenList(linked,lang,fallback,base))+'</tr>';
 }).join('')});
}
export function directoryPage(state,lang,base='/'){
 state={...state,route:state.type==='character'?'all':state.route};
 const t=createTranslator(lang),type=state.type,query=state.catalogQuery||'',route=scoutRoute(state),matches=searchEntries(entries.filter(isDiscoverable),listingState(state,entries));
 const list=type==='character'?sortScouts(matches,route):type==='class'?[...matches].sort((a,b)=>Object.keys(tierNames).indexOf(a.category)-Object.keys(tierNames).indexOf(b.category)):matches;
 const title=t(type==='character'?'overview.characters':type==='class'?'overview.classes':'directory.mounts');
 const queryPlaceholder=t(type==='character'?'overview.find-a-name-faction-or-ability':type==='class'?'overview.find-a-class-or-ability':'directory.find-mount');
 const growth=pagePath({type:'growth',growthTab:type},lang,base),allHref=pagePath({type},lang,base);
 const filters=`${type==='character'?scoutToolbar(state,t):''}<div class="overview-toolbar"><label class="overview-query"><span class="sr-only">${esc(queryPlaceholder)}</span><input type="search" data-overview-query value="${esc(query)}" placeholder="${esc(queryPlaceholder)}"></label>${state.group||state.faction?`<a class="overview-clear-filter" href="${allHref}">${t('overview.show-all')}</a>`:''}</div>`;
 let body='';
 if(type==='class')body=classOverviewTable(list,lang,base,query);
 else if(type==='mount')body=mountOverviewTable(list,lang,base,query);
 else if(route!=='all')body=characterOverviewTable(list,{lang,state,route,base,query});
 else{
  const groups=characterGroups(list),allies=groups.filter(g=>g.role==='playable').flatMap(g=>g.entries),guests=groups.filter(g=>g.role==='guest').flatMap(g=>g.entries),other=groups.filter(g=>!['playable','guest'].includes(g.role)).flatMap(g=>g.entries);
  for(const [key,items] of [['overview.playable-characters',allies],['overview.guests',guests]])if(items.length)body+=`<section class="overview-group"${items.some(e=>matchesQuery(e,query))?'':' hidden'}><h2>${t(key)}<small>${items.filter(e=>matchesQuery(e,query)).length}</small></h2>${characterOverviewTable(items,{lang,state,base,query})}</section>`;
  if(other.length)body+=state.group||state.query?characterOverviewTable(other,{lang,state,base,query}):`<details class="overview-other"${other.some(e=>matchesQuery(e,query))?'':' hidden'}${query?' open data-query-open="1" data-was-open="false"':''}><summary>${t('overview.other-characters')} (${other.length})</summary>${characterOverviewTable(other,{lang,state,base,query})}</details>`;
 }
 return {html:`<div class="${type}-listing overview-page" data-overview-directory><div class="breadcrumb-row page-breadcrumb-row"><div class="breadcrumbs"><a href="${base}${lang}/">${t('app.archive')}</a> / ${title}</div>${feedbackLink(lang)}</div><div class="section-head"><div class="overview-heading"><h1>${title}</h1><a class="overview-growth-link" href="${growth}">${t('directory.growth-table')}</a></div><small data-overview-count role="status" aria-live="polite">${t(list.filter(e=>matchesQuery(e,query)).length===1?'browse.entry-one':'browse.entry-count',{count:list.filter(e=>matchesQuery(e,query)).length})}</small></div>${filters}${body}<p class="overview-query-empty"${list.some(e=>matchesQuery(e,query))?' hidden':''}>${t('overview.no-matching-entries')}</p><p class="overview-note">${t('overview.undocumented')}</p></div>`};
}
