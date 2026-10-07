import {mapProvinces,mapMeta,mapKinds,gatheringTypes,mapMarkerKind,filterMapNodes,mapPointForEntry,mapNodes} from './part1-map.mjs';
import {mapTiles} from './part1-map-assets.mjs';
import {mapIcons} from './part1-map-icons.generated.mjs';
import {escapeHtml as esc} from './core.mjs';
import {pagePath,stateQuery,defaultState} from './routing.mjs';
import {informationHint} from './presentation.mjs';
import {acquisitionPlaces} from './acquisition-map.mjs';
import {renderEntityText} from './entity-text.mjs';
import {defaultHiddenMapKinds} from './map-visibility.mjs';
export const mapName=(n,t)=>n.ko==='???'?t('map.unknown-name'):t(n.ko,n.en||n.ko);
export const placeKindName=(n,t)=>t('map.'+n.kind)+(n.gatheringType?' · '+t('map.gathering-'+n.gatheringType):'');
export const provinceName=(id,t)=>{const p=mapProvinces.find(p=>p.id===id);return p?t(p.ko,p.en||p.ko):t('map.unknown-province');};
const markerIcon=kind=>{const icon=mapIcons[kind];return `<img class="part1-marker-icon" src="${icon.src}" width="${icon.width}" height="${icon.height}" alt="" aria-hidden="true" draggable="false">`;};
function mapLegend(hiddenKinds,t){
 const label=kind=>`<label><input type="checkbox" data-map-toggle-kind="${kind}"${hiddenKinds.includes(kind)?'':' checked'} disabled><span class="part1-symbol ${kind}" aria-hidden="true">${markerIcon(kind)}</span><span>${t('map.'+kind)}</span></label>`;
 return mapKinds.map(kind=>kind==='gathering'?`<li class="part1-gathering-legend"><input type="checkbox" data-map-toggle-kind="gathering" aria-label="${t('map.gathering')}" checked disabled><details data-map-gathering><summary><span class="part1-symbol gathering" aria-hidden="true">${markerIcon('gathering')}</span><span>${t('map.gathering')}</span></summary><ul>${gatheringTypes.map(type=>`<li>${label('gathering-'+type)}</li>`).join('')}</ul></details></li>`:`<li>${label(kind)}</li>`).join('');
}
export function mapHref(point,item,lang,base='/'){
 const state={...defaultState(),type:'map',mapPlace:point,mapItem:item||''};
 return pagePath(state,lang,base)+stateQuery(state);
}
function mapRoute(state,lang,base,changes){const next={...state,id:null,type:'map',...changes};return pagePath(next,lang,base)+stateQuery(next);}
function recordConditions(r,{t,routes}){
 const route=r.observedRoute||r.route;
 const routeName=routes.find(row=>row[0]===route);
 const routeText=routeName?t(routeName[1],routeName[2]):route&&typeof route==='object'?t(route.ko,route.en):route||'';
 const part=r.part?t('map.part-record',{part:r.part}):'';
 const values=[part,routeText,r.gameDate?t('map.record-date',{date:r.gameDate}):'',r.chapter!=null?t('map.chapter',{chapter:r.chapter}):''];
 
 if(r.condition)values.push(typeof r.condition==='object'?t(r.condition.ko,r.condition.en):r.condition);
 return values.filter(Boolean).join(' · ');
}
function recordLine(r,ctx,item){
 const {t}=ctx;
 const method=r.label?ctx.tx(r.label):r.method==='gathering'?t('map.gathering-method'):r.method==='dungeon'?t('map.dungeon-record'):typeof r.method==='object'?ctx.tx(r.method):r.method&&r.method!=='acquisition'?ctx.text(r.method):t('map.acquisition');
 return renderEntityText([method,recordConditions(r,ctx)].filter(Boolean).join(' · '),item,{entries:ctx.entries,lang:ctx.lang,href:ctx.href,format:ctx.text});
}
export function placeDetails(node,ctx,{description=true,heading=4}={}){
 const {t,tx,href,name,entries}=ctx,d=node.details||{};
 const list=(rows,key)=>rows?.length?`<h${heading} class="place-content-heading">${t(key)}</h${heading}><ul class="place-content-list">${rows.map(row=>{
  const item=entries.find(e=>e.id===row.itemId);
  const label=item?(t.locale==='en'?name(item):row.ko):tx({ko:row.ko,en:row.en||row.ko});
  return `<li>${item?`<a href="${href(item.id)}">${esc(label)}</a>`:`<span${t.locale==='en'&&/[가-힣]/.test(label)?' lang="ko"':''}>${esc(label)}</span>`}</li>`;
 }).join('')}</ul>`:'';
 const facilities=d.facilities?.length?`<h${heading} class="place-content-heading">${t('map.facilities')}</h${heading}><ul class="place-content-list">${d.facilities.map(row=>`<li>${t('map.facility-'+row.kind)}${row.count>1?' · '+t('map.facility-count',{count:row.count}):''}</li>`).join('')}</ul>`:'';
 const destinations=d.destinations?.length?`<h${heading} class="place-content-heading">${t('map.destinations')}</h${heading}><ul class="place-content-list">${d.destinations.map(id=>{
  const target=mapNodes.find(n=>n.id===id);
  return `<li><a href="${href(target.entryId)}"${t.locale==='en'&&/[가-힣]/.test(mapName(target,t))?' lang="ko"':''}>${esc(mapName(target,t))}</a></li>`;
 }).join('')}${d.unknownDestinations?`<li>${t('map.hidden-destinations',{count:d.unknownDestinations})}</li>`:''}</ul>`:'';
 return `${description&&d.description?`<p>${esc(tx(d.description))}</p>`:''}${facilities}${list(d.materials,'map.materials')}${list(d.loot,'map.loot')}${destinations}${d.previousReports?.length?`<details class="part1-linked-records"><summary>${t('map.previous-report')}</summary>${d.previousReports.map(r=>`<p>${esc(recordConditions(r,ctx))}</p>${list(r.rows,r.key==='loot'?'map.loot':'map.materials')}`).join('')}</details>`:''}`;
}
function placeMetadata(node,ctx){
 const {t,tx}=ctx,access=node.details?.access;
 const tag=access?informationHint(tx(access.note),t('map.sea-area-help'),t('map.sea-area'),'sea-access-tag'):'';
 return `<p class="place-metadata"><span>${esc(provinceName(node.province,t))} · ${placeKindName(node,t)}</span>${tag}</p>${access?`<noscript><p>${esc(tx(access.note))}</p></noscript>`:''}`;
}
function selectedDetails(node,ctx){
 const {t,href}=ctx;
 if(!node)return `<p>${t('map.select')}</p>`;
 const title=esc(mapName(node,t));
 return `<h3>${node.entryId?`<a href="${href(node.entryId)}">${title}</a>`:title}</h3>${placeMetadata(node,ctx)}${placeDetails(node,ctx)}`;
}
export function part1Map(state,ctx){
 const {t,lang,base}=ctx,rows=filterMapNodes(state),selected=rows.find(n=>n.id===state.mapPlace);
 const matching=!!(state.mapQuery?.trim()||state.mapProvince||state.mapKind);
 const hiddenKinds=defaultHiddenMapKinds.filter(kind=>kind!==selected?.kind);
 const placeHref=n=>mapRoute(state,lang,base,{mapPlace:n.id});
 return `<section class="part1-map" data-part1-map data-place="${esc(selected?.id||'')}">
 <noscript><p>${t('map.static-help')} <a href="${esc(pagePath({type:'location'},lang,base))}">${t('map.browse-places')}</a></p></noscript>
 <form class="part1-filters" action="${esc(pagePath({type:'map'},lang,base))}" role="search" aria-label="${t('map.search')}">
 <div class="map-search-area"><label for="map-search">${t('map.search')}</label><input id="map-search" name="mq" type="search" autocomplete="off" value="${esc(state.mapQuery||(state.mapProvince?provinceName(state.mapProvince,t):''))}" placeholder="${t('map.placeholder')}"><div id="map-search-panel" class="map-search-panel" hidden><ul id="map-search-options" role="listbox" aria-label="${t('map.suggestions')}"></ul></div></div>
 <button type="submit" class="map-search-submit">${t('map.submit')}</button>
 ${(state.mapQuery||state.mapProvince||state.mapKind)?`<a class="part1-reset" href="${esc(mapRoute(state,lang,base,{mapQuery:'',mapProvince:'',mapKind:'',mapPlace:'',mapItem:''}))}">${t('map.reset')}</a>`:''}
 </form><div class="part1-layout"><div class="part1-map-pane">
 ${rows.length?'':`<p class="empty" role="status">${t('map.empty')}</p>`}<div class="part1-toolbar"><button type="button" data-part1-zoom="out" aria-label="${t('map.zoom-out')}">−</button><output id="part1-scale">100%</output><button type="button" data-part1-zoom="in" aria-label="${t('map.zoom-in')}">+</button><button type="button" data-part1-zoom="fit">${t('map.fit')}</button><span role="status" aria-live="polite">${t('map.count',{count:rows.length})}</span></div>
 <div class="part1-map-frame"><div class="part1-viewport" tabindex="0" role="region" aria-label="${t('map.viewport')}"><div class="part1-canvas" style="aspect-ratio:${mapMeta.width}/${mapMeta.height}">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mapMeta.width} ${mapMeta.height}" role="img" aria-label="${t('map.art')}">${mapTiles.map(tile=>`<image href="${esc(tile.src)}" x="${tile.x}" y="${tile.y}" width="${tile.width}" height="${tile.height}"/>`).join('')}</svg>
 <div class="part1-points">${rows.map(n=>`<a class="part1-point ${n.kind}${matching?' search-match':''}${n.id===selected?.id?' selected':''}${n.ko==='???'?' unidentified':''}" href="${esc(placeHref(n))}" data-map-place="${n.id}" data-map-kind="${mapMarkerKind(n)}"${hiddenKinds.includes(n.kind)?' hidden':''} style="left:${n.u*100}%;top:${n.v*100}%" aria-label="${esc(t('map.point',{name:mapName(n,t)}))}"${selected?.id===n.id?' aria-current="location"':''}><span class="part1-point-hit">${markerIcon(mapMarkerKind(n))}</span><span class="part1-point-label">${esc(mapName(n,t))}</span></a>`).join('')}</div>
 </div></div><details class="part1-legend" open><summary>${t('map.legend-title')}</summary><ul>${mapLegend(hiddenKinds,t)}</ul><div class="part1-name-toggle"><label title="${t('map.show-names-help')}"><input type="checkbox" data-map-toggle-names checked disabled><span>${t('map.show-names')}</span></label></div></details></div><p class="part1-pan">${t('map.pan')}</p>
 </div><div class="part1-sidebar"><section class="part1-selection" id="map-selection" tabindex="-1" aria-live="polite">${selectedDetails(selected,ctx)}</section>
 </div></div>
 <footer class="part1-credit" id="map-source"><span>${t('map.credit')}</span> <a href="./evidence/part1-map.html">${t('map.evidence')}</a></footer>
 </section>`;
}
function inlineMap(points,entry,ctx,{reference=false}={}){
 const {t,lang,base}=ctx;
 return `<figure class="entry-place-map${reference?' reference-map':''}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mapMeta.width} ${mapMeta.height}" role="group" aria-label="${t(reference?'map.reference-points':'map.place-map')}">${mapTiles.map(tile=>`<image href="${esc(tile.src)}" x="${tile.x}" y="${tile.y}" width="${tile.width}" height="${tile.height}" aria-hidden="true"/>`).join('')}${points.map((n,i)=>`<a href="${esc(mapHref(n.id,reference||entry.type==='location'||entry.type==='item'?'':entry.id,lang,base))}" aria-label="${esc((i+1)+'. '+mapName(n,t)+' · '+t(reference?'map.reference-open':'map.open'))}"><title>${esc(mapName(n,t))}</title><circle class="entry-place-pin${reference?' landmark-pin':''}" cx="${n.u*mapMeta.width}" cy="${n.v*mapMeta.height}" r="21"/><text x="${n.u*mapMeta.width}" y="${n.v*mapMeta.height}" dy=".35em" text-anchor="middle" aria-hidden="true">${i+1}</text></a>`).join('')}</svg><figcaption>${t('map.credit')} <a href="${pagePath({type:'map'},lang,base)}#map-source">${t('map.image-source')}</a></figcaption></figure>`;
}
function itemAcquisitionLine(record,place,ctx,item){
 // Generic guide/observation scopes are evidence, not availability conditions.
 if(['gathering','dungeon'].includes(record.method)&&!record.route&&record.chapter==null&&!record.condition){
  return place.point?'':ctx.t(record.method==='gathering'?'map.gathering-method':'map.dungeon');
 }
 if(record.method==='acquisition'&&['Found at','Acquisition location','Reported acquisition'].includes(record.label?.en))return '';
 return recordLine({...record,part:record.observedRoute||record.gameDate?null:record.part,observedRoute:null,gameDate:null},ctx,item);
}
function placeRows(places,entry,ctx){
 const {t,lang,base,href,name,entries,tx}=ctx;
 return `<ol class="entry-acquisition-list">${places.map((place,i)=>{
  const target=entries.find(e=>e.id===place.id),title=place.point?mapName(place.point,t):target?name(target):tx(place.where);
  const lines=[...new Set(place.records.map(r=>entry.type==='item'?itemAcquisitionLine(r,place,ctx,entry):recordLine(r,ctx,entry)).filter(Boolean))];
  const shownLines=lines.filter(line=>line.includes(' · ')||!lines.some(other=>other!==line&&other.startsWith(line+' · '))).map(line=>`<small>${line}</small>`);
  return `<li><div class="entry-acquisition-heading"><span class="entry-place-number" aria-hidden="true">${i+1}</span><h3>${target?`<a href="${href(target.id)}">${esc(title)}</a>`:esc(title)}</h3></div>${place.point?`${placeMetadata(place.point,ctx)}<a class="entry-map-link" href="${esc(mapHref(place.point.id,entry.type==='item'?'':entry.id,lang,base))}">${t('map.open')}</a>`:`<p class="entry-unmapped">${esc([...new Set(place.records.map(r=>r.region?ctx.text(r.region):'').filter(Boolean))].join(' · '))}${place.records.some(r=>r.region)?' · ':''}${t('map.map-unconfirmed')}</p>`}${shownLines.join('')}</li>`;
 }).join('')}</ol>`;
}
function mountPlaces(entry,ctx){
 const {t,href,name,entries}=ctx;
 const companion=(entry.links||[]).find(l=>l.label?.en==='Recruited with'&&entries.some(e=>e.id===l.to&&e.type==='character'));
 if(companion){const character=entries.find(e=>e.id===companion.to);return `<section class="entry-acquisition" id="entry-acquisition"><h2>${t('map.recruited-mount')}</h2><p>${t('map.recruited-mount-help')}</p><a class="entry-map-link" href="${href(character.id)}">${esc(name(character))}</a></section>`;}
 const places=acquisitionPlaces(entry,entries),mapped=places.filter(p=>p.point),unmapped=places.filter(p=>!p.point);
 if(!places.length)return '';
 return `<section class="entry-acquisition" id="entry-acquisition"><h2>${t('map.where-to-find')}</h2>${entry.type==='mount'&&entry.body?`<p>${esc(ctx.tx(entry.body))}</p>`:''}${mapped.length?`<div class="entry-acquisition-layout">${inlineMap(mapped.map(p=>p.point),entry,ctx)}${placeRows(mapped,entry,ctx)}</div>`:''}${unmapped.length?mapped.length?`<details class="entry-unmapped-places"><summary>${t('map.unmapped-places',{count:unmapped.length})}</summary>${placeRows(unmapped,entry,ctx)}</details>`:placeRows(unmapped,entry,ctx):''}<a class="entry-map-link" href="${href('game8-capture')}">${t('map.capture-guide')}</a></section>`;
}
export function entryMapLinks(entry,ctx){
 const {t,lang,base,entries}=ctx;
 if(entry.type==='location'){
  const point=mapPointForEntry(entry.id);
  if(!point){
   if(!entry.videoGathering?.names?.length)return '';
   const materials=entry.videoGathering.names.map(ko=>({ko,itemId:entries.find(e=>e.type==='item'&&(e.name.ko.replace(/\([^)]*\)$/,'').trim()===ko||e.aliases?.includes(ko)))?.id}));
   for(let i=0;i<(entry.videoGathering.unknownSlots||0);i++)materials.push({ko:'???'});
   return `<section class="entry-location-content">${placeDetails({details:{materials}},ctx,{description:false,heading:2})}</section>`;
  }
  return `<section class="entry-acquisition entry-map-location" id="entry-acquisition"><h2>${t('map.place-map')}</h2><div class="entry-location-layout">${inlineMap([point],entry,ctx)}<div>${placeMetadata(point,ctx)}<a class="entry-map-link" href="${esc(mapHref(point.id,'',lang,base))}">${t('map.open')}</a>${placeDetails(point,ctx,{description:false,heading:3})}</div></div></section>`;
 }
 if(entry.type==='mount')return mountPlaces(entry,ctx);
 if(entry.type!=='item')return '';
 const places=acquisitionPlaces(entry,entries);if(!places.length)return '';
 const mapped=places.filter(p=>p.point),unmapped=places.filter(p=>!p.point);
 return `<section class="entry-acquisition" id="entry-acquisition"><h2>${t('map.where-to-find')}</h2>${entry.type==='mount'&&entry.body?`<p>${esc(ctx.tx(entry.body))}</p>`:''}${mapped.length?`<div class="entry-acquisition-layout">${inlineMap(mapped.map(p=>p.point),entry,ctx)}${placeRows(mapped,entry,ctx)}</div>`:''}${unmapped.length?mapped.length?`<details class="entry-unmapped-places"><summary>${t('map.unmapped-places',{count:unmapped.length})}</summary>${placeRows(unmapped,entry,ctx)}</details>`:placeRows(unmapped,entry,ctx):''}</section>`;
}
