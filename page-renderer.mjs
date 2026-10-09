import {growthComparison} from './growth-ui.mjs';
import {renderEntityText} from './entity-text.mjs';
import {guideTopics,guideTopic} from './browse-topics.mjs';
import {tipGuide} from './tip-ui.mjs';
import {feedbackLink} from './feedback.mjs';
import {isPublicSource,referencedSources} from './source-visibility.mjs';
import {itemUses} from './item-usage.mjs';
import {part1Map,entryMapLinks} from './part1-map-ui.mjs';
import {groupedBrowse} from './browse-groups.mjs';
import {isDiscoverable,entryDisplayName,groupedRelations} from './editorial-view.mjs';
import {entryMetadata} from './seo.mjs';
import {createTranslator} from './locales/index.mjs';
import {types} from './locales/labels.mjs';
import {icon} from './icons.mjs';
import {itemIcon,itemTypeLabel,itemFilters,itemScopeLabel} from './item-ui.mjs';
import {classifyItem,normalizeItemFilters} from './item-types.mjs';
import {itemMedia} from './item-media.mjs';
import {navigationGroups,navigationContext,filterContext,listingState} from './navigation.mjs';
import {localized,referenceSection,referenceSite,displayText,characterFaction,sourceHint} from './presentation.mjs';
import {paralogueOverview} from './paralogue-ui.mjs';
import {catalogDetails,coveragePanel,groupOptions,locationRegions} from './catalog-ui.mjs';
import {entries,sources,routes,updated} from './data.mjs';
import {media} from './media.mjs';
import {entryIconMedia} from './entity-media.mjs';
import {searchEntries,relatedTo,isSpoilerEntry,escapeHtml as esc} from './core.mjs';
import {rewriteLinks,pagePath,stateQuery} from './routing.mjs';
import {searchShortcuts} from './search-shortcuts.mjs';
import {foodKinds,flavors,preferredMountFood,mountFoodReports} from './food.mjs';
import {ingredientFlavorLabel} from './food-ui.mjs';
import {scoutRoute,sortScouts,scoutConditions,scoutToolbar,scoutGroupedList} from './character-list.mjs';
export function renderPage(state,lang='ko',visibleLimit=36,base='/'){
 const t=createTranslator(lang),tx=x=>displayText(localized(x,lang),t,entries),name=e=>entryDisplayName(e,lang),text=x=>displayText(x,t,entries);
 const href=id=>'#entry/'+encodeURIComponent(id),label=type=>types[type][lang==='ko'?0:1];
 const mapContext={t,lang,base,entries,sources,routes,name,href,tx,text,factText:(value,key)=>displayText(value,t,entries,false,key)};
 const browseEntries=entries.filter(isDiscoverable);
 const brandName=t('app.fire-emblem-fortune-s-weave-encyclopedia');
 const breadcrumbRow=(crumbs,extraClass='')=>`<div class="breadcrumb-row${extraClass?' '+extraClass:''}"><div class="breadcrumbs">${crumbs}</div>${feedbackLink(lang)}</div>`;
function portrait(e,full=false){const m=media[e.id]||e.portrait;return e.type==='character'&&m?`<img class="portrait" src="${esc(full?m.src:(m.thumbnailSrc||m.src))}" alt="${esc(name(e))}" loading="${full?'eager':'lazy'}" decoding="async" width="${m.width||240}" height="${m.height||240}">`:'';}
function mediaHint(m){return m?.sourceUrl?sourceHint({href:m.sourceUrl,tooltip:`${t('presentation.image-credit')} · ${m.credit||referenceSite(m.sourceUrl)}`,className:'source-hint image-source-hint',external:true}):'';}
function entryIcon(e,extraClass=''){const m=entryIconMedia(e);return m?`<img class="entity-icon${extraClass?' '+extraClass:''}" src="${esc(m.src)}" alt="" width="50" height="50" loading="lazy" decoding="async">`:'';}
function sourceList(ids){
 const groups=new Map();
 for(const id of ids){const source=sources[id],site=referenceSite(source.url);if(!groups.has(site))groups.set(site,[]);groups.get(site).push(source);}
 const priority=['game8','nintendo.com','rpgsite.net','fireemblemwiki.org','namu.wiki'];
 const ordered=[...groups].sort(([a],[b])=>{const rank=site=>priority.includes(site)?priority.indexOf(site):priority.length;return rank(a)-rank(b)||a.localeCompare(b);});
 return `<div class="source-groups">${ordered.map(([site,list])=>{
  const notes=[...new Set(list.map(s=>tx(s.note)).filter(Boolean))];
  return `<details class="source-group"><summary>${esc(site==='game8'?'Game8':site==='local'?t('presentation.gameplay-recordings'):site)} <span>${t(list.length===1?'browse.source-record-one':'browse.source-records',{count:list.length})}</span></summary>${notes.length===1?`<p class="result-label">${esc(notes[0])}</p>`:''}<div class="sources">${list.map(s=>`<div class="source"><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(tx(s.title))} ${icon('external')}</a><small>${s.checked?`${t('common.checked')} ${esc(s.checked)}`:t('editorial.individual-check-date-not-recorded')} · ${esc(({official:t('app.official-2'),guide:t('app.guide-2'),community:t('app.community'),reference:t('app.reference'),unavailable:t('app.unavailable'),unverified:t('app.unverified')})[s.kind]||s.kind)}</small>${notes.length!==1?`<p>${esc(tx(s.note))}</p>`:''}</div>`).join('')}</div></details>`;
 }).join('')}</div>`;
}
function listingMeta(e){
 if(e.type==='tip')return tx(e.summary);
 if(e.type==='location'){
  if(e.mapDetails?.facilities?.length)return t('map.facilities')+': '+e.mapDetails.facilities.map(row=>t('map.facility-'+row.kind)+(row.count>1?' ('+row.count+')':'')).join(' · ');
  if(e.mapDetails?.materials?.length)return t('map.materials')+': '+e.mapDetails.materials.map(row=>{const item=entries.find(e=>e.id===row.itemId);return t.locale==='en'&&item?name(item):row.ko;}).join(' · ');
  const items=relatedTo(browseEntries,e.id).filter(x=>x.type==='item');
  return items.length?`${t('editorial.related-items')}: ${items.slice(0,3).map(name).join(', ')}${items.length>3?' …':''}`:e.region&&e.region!=='Unverified'?locationRegions([e],t)[0].title:t('editorial.region-unverified-view-acquisition-notes');
 }
 if(e.type==='mount'){
  const food=preferredMountFood(e),reports=mountFoodReports(e);
  const choice=food?[food.kind?t(foodKinds[food.kind].ko,foodKinds[food.kind].en):t('item.food-kind-unknown'),t(flavors[food.flavor].ko,flavors[food.flavor].en)].join(' · '):t('item.food-unknown');
  const conflict=new Set(reports.map(r=>r.flavor).filter(f=>f!=='unknown')).size>1;
  const uncertain=food?.reports.some(r=>r.uncertain);
  return t('item.preferred-food')+': '+choice+(conflict?' · '+t('character.conflict'):uncertain?' · '+t('app.unverified'):'');
 }
 return text(e.category||label(e.type));
}
function mountGroups(list){
 const categories=[...new Set(list.map(e=>e.category||''))];
 return `<div class="mount-groups">${categories.map(category=>{const rows=list.filter(e=>(e.category||'')===category);return `<section class="mount-group"><div class="browse-group-heading"><h2>${esc(category?text(category):t('browse.mount-other'))}</h2><small>${rows.length}${t('common.entries')}</small></div><div class="cards mount-list icon-cards">${rows.map(card).join('')}</div></section>`;}).join('')}</div>`;
}
function locationGroups(list){
 return `<div class="location-groups">${locationRegions(list,t).map(g=>{const url='#category/location?group='+encodeURIComponent(g.id)+(state.route!=='all'?'&route='+encodeURIComponent(state.route):'');return `<section class="location-group"><div class="browse-group-heading"><h2>${esc(g.title)}</h2><small>${g.entries.length}${t('common.entries')}</small>${g.entries.length>6?`<a class="group-more" href="${url}" aria-label="${esc(t('browse.view-group',{name:g.title,count:g.entries.length}))}">${t('browse.view-all')}</a>`:''}</div><div class="cards location-list">${g.entries.slice(0,6).map(card).join('')}</div></section>`;}).join('')}</div>`;
}
function guideGroups(list){
 return `<div class="guide-topics">${guideTopics.map(g=>{const rows=list.filter(e=>guideTopic(e).id===g.id);if(!rows.length)return '';const title=t(g.key),url='#category/tip?group='+g.id+(state.route!=='all'?'&route='+encodeURIComponent(state.route):'');return `<section class="guide-topic"><div class="browse-group-heading"><h2>${esc(title)}</h2><small>${rows.length}${t('common.entries')}</small>${rows.length>3?`<a class="group-more" href="${url}" aria-label="${esc(t('browse.view-group',{name:title,count:rows.length}))}">${t('browse.view-all')}</a>`:''}</div><div class="cards guide-list">${rows.slice(0,3).map(card).join('')}</div></section>`;}).join('')}</div>`;
}
function homeDirectory(list){
 return `<nav class="home-directory" aria-label="${t('browse.home-directory')}">${navigationGroups.flatMap(g=>g.types).map(type=>{const rows=list.filter(e=>e.type===type);if(type==='growth')return `<a href="#category/growth">${icon('class')}<div><div class="home-category-heading"><strong>${t('growth.title')}</strong></div><p>${t('growth.homeDescription')}</p></div>${icon('arrow')}</a>`;if(!rows.length&&type!=='map')return '';const purpose={character:'editorial.recruit-allies',item:'editorial.find-items',paralogue:'editorial.paralogue-deadlines',class:'editorial.compare-classes'};const url='#category/'+type+(state.route!=='all'&&type!=='character'?'?route='+encodeURIComponent(state.route):'');return `<a href="${url}">${icon(type)}<div><div class="home-category-heading"><strong>${esc(purpose[type]?t(purpose[type]):label(type))}</strong>${type==='map'?'':`<small>${t(rows.length===1?'browse.entry-one':'browse.entry-count',{count:rows.length})}</small>`}</div><p>${t('browse.home-'+type)}</p></div>${icon('arrow')}</a>`;}).join('')}</nav><h2 class="home-records-heading">${t('browse.home-records')}</h2>`;
}
function classComparison(list){
 return `<div class="cards class-cards icon-cards">${list.map(e=>{const image=entryIcon(e)||icon('class');return `<a class="card class-card" href="${href(e.id)}"><span class="card-media">${image}</span><div class="card-copy"><h3>${esc(name(e))}</h3><p class="class-tier">${esc(text(e.category||''))}</p></div></a>`;}).join('')}</div>`;
}
function card(e){
 const facts=e.facts||[];const value=key=>{const f=facts.find(f=>f.key===key);return f&&(lang==='ko'?f.valueKo??f.value:f.value);};
 const r=state.type==='character'&&scoutRoute(state)!=='all'?e.recruitment?.[scoutRoute(state)]:null;
 const meta=r?r.mode==='automatic'?t('common.automatic'):r.mode==='unavailable'?t('app.unavailable-2'):r.mode==='unknown'?t('app.unknown'):t('app.s')+(r.support??'—')+' · '+t('app.r')+(r.renown??'—'):e.type==='item'?[itemTypeLabel(e,{t}).split(' · ').at(-1),value('might')?t('app.mt')+value('might'):'',value('rank')?value('rank')+' '+t('app.rank'):'',foodKinds[classifyItem(e).kind]?ingredientFlavorLabel(e,t):''].filter(Boolean).join(' · '):e.type==='character'?characterFaction(e,t,entries):listingMeta(e);
 const cardHref=href(e.id)+(r?'?route='+scoutRoute(state):'');
 const image=portrait(e)||entryIcon(e)||(e.type==='item'?itemIcon(e,{t}):'');
 return `<a class="card compact-card listing-card${image?' has-media':''}${image&&e.type!=='character'?' icon-card':''}" href="${cardHref}">${image?`<span class="card-media">${image}</span>`:''}<div class="card-copy"><h3>${esc(name(e))}${e.type==='tip'&&isSpoilerEntry(e)&&!/스포일러|spoiler/i.test(name(e))?`<span class="listing-spoiler">${t('tip.spoiler')}</span>`:''}</h3><p class="card-meta">${esc(r?scoutConditions(e,scoutRoute(state),t):text(meta))}</p></div></a>`;
}

function detail(e){
 const metadata=entryMetadata(e,{t,tx,name,entries,sources});
 const shownMaterials=new Set([...(e.mapDetails?.materials||[]),...(e.mapDetails?.loot||[])].map(row=>row.itemId).filter(Boolean));
 const shownCai=new Set((e.caiPlaceDetails?.mounts||[]).map(row=>row.id));
 if(e.videoGathering)for(const link of e.links||[])if(link.label?.en==='Observed gathering')shownMaterials.add(link.to);
 const outgoing=groupedRelations((e.links||[]).filter(l=>isDiscoverable(entries.find(x=>x.id===l.to))&&!(shownMaterials.has(l.to)&&l.label?.en==='Observed gathering')&&!(shownCai.has(l.to)&&['Appearing mount','Appearing mount · inferred'].includes(l.label?.en))));
 const incoming=relatedTo(browseEntries,e.id);
 const relation=l=>{const target=entries.find(x=>x.id===l.to);return `<a class="relation" href="${href(l.to)}"><small>${esc(l.labels?l.labels.map(tx).join(' / '):tx(l.label))}</small><strong>${esc(name(target))}</strong>${icon('arrow')}</a>`};
 const titleMedia=entryIconMedia(e)||(e.type==='item'?itemMedia[classifyItem(e).icon]:null);
 const titleImage=entryIcon(e,'entity-detail-icon')||(e.type==='item'?itemIcon(e,{t},'item-detail-icon'):'');
 const prose=value=>renderEntityText(localized(value,lang),e,{entries,lang,href,format:tx});
 let body=`<article class="detail detail-top"><div class="detail-heading">${breadcrumbRow(`<a href="#">${t('app.archive')}</a> / <a href="#category/${e.type}${e.type==='character'&&state.route!=='all'?'?scout='+state.route:''}">${label(e.type)}</a>`)}<div class="detail-title"><div><span class="eyebrow">${label(e.type)} / ${t('app.encyclopedia')}</span><h1 tabindex="-1" id="entry-title">${titleImage?`<span class="detail-icon-frame">${titleMedia?.sourceUrl?`<button type="button" class="detail-icon-source" data-source-tip="${esc(`${t('presentation.image-credit')} · ${tx(titleMedia.credit)||referenceSite(titleMedia.sourceUrl)}`)}" data-source-href="${esc(titleMedia.sourceUrl)}" data-source-action="${esc(t('presentation.open-image-source'))}" aria-label="${esc(t('presentation.image-credit'))}" aria-haspopup="dialog" aria-controls="source-tooltip" aria-expanded="false">${titleImage}</button>`:titleImage}</span>`:''}${esc(name(e))}</h1></div></div></div>${e.type==='item'?`<p class="item-classification">${esc(itemTypeLabel(e,{t}))}</p>`:''}<div class="detail-intro"><p class="body">${prose(metadata.summary)}</p></div>`;
 let portraitHtml='';
 if(e.type==='character'&&(media[e.id]||e.portrait)){const m=media[e.id]||e.portrait;portraitHtml=`<figure class="character-figure"><span class="image-credit-frame portrait-credit-frame">${portrait(e,true)}${mediaHint(m)}</span></figure>`;}
 if(lang==='ko'&&e.translation==='provisional'&&e.type!=='item')body+=`<p class="original-name" lang="en">${esc(e.name.en)}</p>`;
 if(lang==='ko'&&e.translation==='provisional')body+=`<p class="result-label">${t('app.korean-provisional')}</p>`;
 if(e.type==='quest')body+=`<p class="notice">${t('editorial.the-quest-listing-has-been-retired-this-address-retains-reward-and-location-notes')} <a href="#category/paralogue">${t('editorial.view-paralogue-schedules')}</a></p>`;
 if(e.body&&e.type!=='mount')body+=`<p class="body">${prose(e.body)}</p>`;
 if(e.note&&e.type!=='mount')body+=`<p class="notice">${prose(e.note)}</p>`;
 body+=tipGuide(e,{t,tx,prose,sectionHref:id=>pagePath(state,lang,base)+stateQuery(state)+'#'+id,sourceTitle:id=>`${tx(sources[id].title)}${sources[id].checked?' · '+t('common.checked')+' '+sources[id].checked:''}`});
 const mapHtml=entryMapLinks(e,mapContext),acquisitionBelowFacts=e.type==='item'||e.type==='mount';
 if(!acquisitionBelowFacts)body+=mapHtml;
 body+=catalogDetails(e,{t,tx,name,href,route:state.route,portraitHtml,acquisitionHtml:acquisitionBelowFacts?mapHtml:'',base,growthSkill:state.growthSkill});
 if(e.type==='mount'&&state.route!=='all'&&e.routeIds&&!e.routeIds.includes(state.route))body+=`<p class="notice">${t('app.this-capture-method-is-documented-for-cai-s-route')}</p>`;
 if(outgoing.length)body+=`<h2>${t('app.follow-the-trail')}</h2><div class="relations">${outgoing.map(relation).join('')}</div>`;
 if(incoming.length)body+=`<details class="backlinks"><summary>${t('app.linked-from')} (${incoming.length})</summary><div class="relations">${incoming.map(x=>relation({to:x.id,label:{ko:label(x.type),en:label(x.type)}})).join('')}</div></details>`;
 body+=references([e,{sourceIds:itemUses(e,entries).sourceIds}],e.type==='item'?[itemMedia[classifyItem(e).icon]]:[entryIconMedia(e)||media[e.id]||e.portrait])+'</article>';
 return body;
}
const references=(list,images=[])=>referenceSection(list,{sources,t,tx,updated,images});
 let html='';const e=entries.find(x=>x.id===state.id);
 if(state.id){html=e?detail(e):`<div class="empty"><h2>${t('app.entry-not-found')}</h2><a class="back" href="#">${t('app.back-to-archive')}</a></div>`;}
 else if(state.type==='growth'){html=growthComparison(state,{entries,sources,t,lang,base});}
 else if(state.type==='quest'){html=`<h1>${t('editorial.quest-notes')}</h1><p>${t('editorial.the-standalone-quest-listing-has-been-retired-find-schedules-and-rewards-under-paralogues-and-acquisition-notes-under-items')}</p><div class="archive-links"><a href="#category/paralogue">${label('paralogue')}</a><a href="#category/item">${label('item')}</a></div>`;}
 else if(state.type==='sources'){
  const ids=Object.keys(referencedSources(entries,sources)).filter(id=>isPublicSource(id,sources[id])),sites=new Set(ids.map(id=>referenceSite(sources[id].url)));
  html=`<div class="section-head"><h2>${t('app.source-register')}</h2><small>${t('browse.source-count',{sites:sites.size,count:ids.length})}</small></div><p class="notice">${t('app.unavailable-or-stale-pages-are-not-treated-as-verified')}</p><div class="sources-layout"><section class="sources-index"><h2>${t('browse.source-originals')}</h2><p class="result-label">${t('editorial.dates-by-source')}</p>${sourceList(ids)}</section><div class="source-coverage">${coveragePanel(t)}</div></div>`;
 }
 else if(state.type==='paralogue'){html=paralogueOverview(searchEntries(browseEntries,listingState(state,browseEntries)),state,{t,tx,name,href});}
 else{
  const matches=searchEntries(browseEntries,listingState(state,browseEntries));const list=state.type==='character'?sortScouts(matches,scoutRoute(state)):matches;const home=state.type==='all'&&!state.query;
  const shortcuts=state.type==='all'?searchShortcuts(state.query):[];
  if(shortcuts.length)html+=`<div class="search-shortcuts">${shortcuts.map(s=>`<a class="card compact-card search-shortcut" href="#category/${s.category}">${icon(s.category==='growth'?'class':s.category)}<div class="card-copy"><h3>${t(s.titleKey)}</h3><p class="card-meta">${t(s.descriptionKey)}</p></div>${icon('arrow')}</a>`).join('')}</div>`;
  html+=`<div class="section-head"><h2>${state.query?t('app.search-results'):label(state.type)}</h2><small role="status" aria-live="polite">${state.type==='item'?esc(t('item.result-count',{scope:itemScopeLabel(state,{t}),count:list.length})):state.type==='map'&&!state.query?t('browse.map-scope'):list.length+t('common.entries')}</small></div>`;
  if(home)html+=homeDirectory(list);
  if(state.type==='character')html+=scoutToolbar(state,t);
  if(state.type==='location')html+=`<p class="location-atlas-link"><a href="#category/map">${t('browse.open-atlas')}</a></p>`;
  if(state.type==='item'&&state.itemFlavor&&!list.length)html+="<p class=\"notice\">"+t('item.flavor-empty')+'</p>';
  if(state.type==='map'&&!state.query)html+=part1Map(state,mapContext);
  if(state.type==='item')html+=itemFilters(searchEntries(entries,{...listingState(state,entries),group:'',itemMajor:'',itemMinor:'',itemKind:'',itemFlavor:''}),state,{t});
  const options=groupOptions(state.type);if(state.type!=='item'&&options.length>1)html+=`<label class="catalog-filter">${t(state.type==='character'?'browse.character-role':state.type==='mount'?'browse.mount-type':state.type==='class'?'browse.class-tier':state.type==='location'?'browse.location-region':state.type==='tip'?'browse.guide-topic':'app.filter-category')} <select id="catalog-group"><option value="">${t('common.all')}</option>${options.map(([id,n])=>`<option value="${esc(id)}" ${state.group===id?'selected':''}>${esc(t(...n))}</option>`).join('')}</select></label>`;
  const grouped=!state.query&&((state.type==='tip'&&!state.group)||(state.type==='location'&&!state.group)||(state.type==='character'&&scoutRoute(state)==='all'&&!state.faction&&!state.group)||(state.type==='item'&&!state.itemMinor&&!state.itemKind&&!state.itemFlavor)||(state.type==='class'&&!state.group));
  if((state.type==='tip'&&state.group)||(state.type==='location'&&state.group)||(state.type==='character'&&(state.faction||state.group))||(state.type==='item'&&state.query&&(state.itemMinor||state.itemKind))||(state.type==='class'&&state.group))html+=`<p class="browse-overview-link"><a class="group-more" href="#category/${state.type}">${t('browse.back-overview')}</a></p>`;
  const routeGrouped=state.type==='character'&&scoutRoute(state)!=='all'&&list.length>0;
  if(state.type==='tip'&&!state.query&&!state.group)html+=guideGroups(list);
  else if(state.type==='location'&&!state.query&&!state.group)html+=locationGroups(list);
  else if(state.type==='map'&&!state.query){/* The interactive place map is the complete overview. */}
  else if(state.type==='mount'&&!state.query&&!state.group)html+=mountGroups(list);
  else if(routeGrouped)html+=scoutGroupedList(list,scoutRoute(state),{t,card});
  else if(grouped)html+=groupedBrowse(list,state,{t,lang,base,card,classCards:classComparison,entries});
  else html+=list.length?`${state.type==='class'?classComparison(list.slice(0,visibleLimit)):`<div class="cards ${state.type==='tip'?'guide-list':state.type==='location'?'location-list':state.type==='mount'?'mount-list icon-cards':state.type==='item'?'icon-cards':''}">${list.slice(0,visibleLimit).map(card).join('')}</div>`}`:shortcuts.length?'':`<div class="empty"><h3>${t('app.no-matching-entries')}</h3><p>${t('app.try-another-name-english-or-korean-or-reset-the')}</p></div>`;
  if(!grouped&&!routeGrouped&&list.length>visibleLimit)html+=`<button id="show-more" class="load-more">${t('app.show-36-more')} (${visibleLimit} / ${list.length})</button>`;
 }
 if(!e){
  const current=state.id?t('app.not-found'):state.query?t('app.search-results'):state.type!=='all'?label(state.type):t('app.archive');
  html=breadcrumbRow(state.id||state.query||state.type!=='all'?`<a href="#">${t('app.archive')}</a> / <span aria-current="page">${esc(current)}</span>`:`<span aria-current="page">${esc(current)}</span>`,'page-breadcrumb-row')+html;
 }
 if(!e&&state.type==='all')html='<div class="all-listing'+(!state.query?' home-listing':'')+'">'+html+'</div>';
 if(!e&&state.type==='sources')html='<div class="sources-listing">'+html+'</div>';
 if(!e&&state.type==='tip')html='<div class="guide-listing">'+html+'</div>';
 if(!e&&state.type==='paralogue')html='<div class="paralogue-listing">'+html+'</div>';
 if(!e&&state.type==='location')html='<div class="location-listing">'+html+'</div>';
 if(!e&&state.type==='map')html='<div class="atlas-listing">'+html+'</div>';
 if(!e&&state.type==='class')html='<div class="class-listing">'+html+'</div>';
 if(!e&&state.type==='mount')html='<div class="mount-listing">'+html+'</div>';
 if(!e&&state.type==='character')html='<div class="character-listing">'+html+'</div>';
 if(!e&&state.type==='item')html='<div class="item-listing">'+html+'</div>';
 const pageTitle=state.id?(e?name(e):t('app.not-found')):state.query?t('app.search-results'):state.type==='map'&&state.mapVariant==='cai'?t('map.cai-title'):state.type==='growth'?t('growth.title')+' · '+t('growth.'+(state.growthTab||'character')):state.type!=='all'?label(state.type):'';
 const metadata=e?entryMetadata(e,{t,tx,name,entries,sources}):null;
 const title=metadata?.title||(pageTitle?`${pageTitle} · ${t('app.fortune-s-weave-encyclopedia')}`:brandName);
 const description=(state.type==='growth'&&!state.id?t('growth.homeDescription'):'')||metadata?.description||(pageTitle?pageTitle+' · '+t('app.description'):t('app.description'));
 if(!state.id&&state.type!=='all')html=html.replace('<h2>','<h1>').replace('</h2>','</h1>');
 if(e)html=html.replace(/href="#(section-[a-z]+|field-reference-[0-9]+|source-[a-zA-Z0-9_-]+)"/g,(_,id)=>`href="${esc(pagePath(state,lang,base)+stateQuery(state))}#${id}"`);
 return {html:rewriteLinks(html,lang,base),title,description,entryType:e?.type,entryName:e?name(e):null,missing:Boolean(state.id&&!e)};
}
