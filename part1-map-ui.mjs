import {mapProvinces,mapMeta,mapKinds,filterMapNodes,mapAcquisitions,mapPointForEntry,mapNodes} from './part1-map.mjs';
import {mapTiles} from './part1-map-assets.mjs';
import {escapeHtml as esc} from './core.mjs';
import {pagePath,stateQuery,defaultState} from './routing.mjs';
import {isPublicSource} from './source-visibility.mjs';
import {informationHint} from './presentation.mjs';
import {acquisitionPlaces} from './acquisition-map.mjs';
import {renderEntityText} from './entity-text.mjs';
export const mapName=(n,t)=>n.ko==='???'?t('map.unknown-name'):t(n.ko,n.en||n.ko);
export const provinceName=(id,t)=>{const p=mapProvinces.find(p=>p.id===id);return p?t(p.ko,p.en||p.ko):t('map.unknown-province');};
export function mapHref(point,item,lang,base='/'){
 const state={...defaultState(),type:'map',mapPlace:point,mapItem:item||''};
 return pagePath(state,lang,base)+stateQuery(state);
}
function mapRoute(state,lang,base,changes){const next={...state,id:null,type:'map',...changes};return pagePath(next,lang,base)+stateQuery(next);}
export function mapViewTabs(state,{t,lang,base}){
 return `<nav class="part1-tabs" aria-label="${t('map.views')}">${[['part1','map.part1'],['continent','map.continent']].map(([view,key])=>`<a href="${esc(mapRoute(state,lang,base,{mapView:view}))}"${(state.mapView||'part1')===view?' aria-current="page"':''}>${t(key)}</a>`).join('')}</nav>`;
}
function recordConditions(r,{t,routes}){
 const route=r.observedRoute||r.route;
 const routeName=routes.find(row=>row[0]===route);
 const values=[r.part?t('map.part-record',{part:r.part}):'',routeName?t(routeName[1],routeName[2]):route||'',r.gameDate?t('map.record-date',{date:r.gameDate}):'',r.chapter!=null?t('map.chapter',{chapter:r.chapter}):''];
 
 if(r.condition)values.push(typeof r.condition==='object'?t(r.condition.ko,r.condition.en):r.condition);
 return values.filter(Boolean).join(' · ');
}
function recordLine(r,ctx,item,{compact=false}={}){
 const {t,sources,lang,base}=ctx,source=sources[r.sourceId];
 const publicSource=isPublicSource(r.sourceId,source);
 const method=r.label?ctx.tx(r.label):r.method==='gathering'?t('map.gathering-method'):r.method==='dungeon'?t('map.dungeon-record'):typeof r.method==='object'?ctx.tx(r.method):r.method&&r.method!=='acquisition'?ctx.text(r.method):t('map.acquisition');
 const sourceName=publicSource?ctx.tx(source.title):t('map.administrator');
 const shortName=publicSource&&source.url?.includes('game8.jp')?t('map.game8-source'):sourceName;
 const description=renderEntityText([method,recordConditions(r,ctx)].filter(Boolean).join(' · '),item,{entries:ctx.entries,lang,href:ctx.href,format:ctx.text});
 if(compact)return `<small>${description}</small>`;
 return `<small>${description} · ${publicSource?`<a href="${pagePath({id:item.id},lang,base)}#source-${esc(r.sourceId)}" title="${esc(sourceName)}">${esc(shortName)}</a>`:esc(sourceName)}</small>`;
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
 return `${description&&d.description?`<p>${esc(tx(d.description))}</p>`:''}${facilities}${list(d.materials,'map.materials')}${list(d.loot,'map.loot')}${destinations}`;
}
function selectedDetails(node,ctx,state){
 const {t,name,href}=ctx;
 if(!node)return `<p>${t('map.select')}</p>`;
 const reports=mapAcquisitions(ctx.entries,node).sort((a,b)=>(b.item.id===state.mapItem)-(a.item.id===state.mapItem));
 return `<h3>${esc(mapName(node,t))}</h3><p>${esc(provinceName(node.province,t))} · ${t('map.'+node.kind)}</p>${placeDetails(node,ctx)}${node.entryId?`<a class="part1-entry-link" href="${href(node.entryId)}">${t('map.entry')}</a>`:''}${reports.length?`<details class="part1-linked-records"${state.mapItem?' open':''}><summary>${t('map.items')} (${reports.length})</summary><ul class="part1-acquisitions">${reports.map(({item,records})=>`<li${item.id===state.mapItem?' class="context-item"':''}><a href="${href(item.id)}">${esc(name(item))}</a>${records.map(r=>recordLine(r,ctx,item)).join('')}</li>`).join('')}</ul></details>`:''}`;
}
export function part1Map(state,ctx){
 const {t,lang,base}=ctx,rows=filterMapNodes(state),selected=rows.find(n=>n.id===state.mapPlace);
 const placeHref=n=>mapRoute(state,lang,base,{mapPlace:n.id});
 return `<section class="part1-map" data-part1-map data-place="${esc(selected?.id||'')}">
 <noscript><p>${t('map.static-help')}</p></noscript>
 <form class="part1-filters" action="${esc(pagePath({type:'map'},lang,base))}" role="search" aria-label="${t('map.search')}">
 <label>${t('map.search')}<input id="map-search" name="mq" type="search" value="${esc(state.mapQuery||'')}" placeholder="${t('map.placeholder')}"></label>
 <label>${t('map.province')}<select id="map-province" name="province"><option value="">${t('map.all-provinces')}</option>${[...mapProvinces,{id:'undocumented'}].map(p=>`<option value="${p.id}"${state.mapProvince===p.id?' selected':''}>${esc(provinceName(p.id,t))}</option>`).join('')}</select></label>
 <label>${t('map.kind')}<select id="map-kind" name="map-kind"><option value="">${t('map.all-kinds')}</option>${mapKinds.map(k=>`<option value="${k}"${state.mapKind===k?' selected':''}>${t('map.'+k)}</option>`).join('')}</select></label>
 ${(state.mapQuery||state.mapProvince||state.mapKind)?`<a class="part1-reset" href="${esc(mapRoute(state,lang,base,{mapQuery:'',mapProvince:'',mapKind:'',mapPlace:'',mapItem:''}))}">${t('map.reset')}</a>`:''}
 </form><div class="part1-layout"><div class="part1-map-pane">
 <div class="part1-toolbar"><button type="button" data-part1-zoom="out" aria-label="${t('map.zoom-out')}">−</button><output id="part1-scale">100%</output><button type="button" data-part1-zoom="in" aria-label="${t('map.zoom-in')}">+</button><button type="button" data-part1-zoom="fit">${t('map.fit')}</button><span role="status" aria-live="polite">${t('map.count',{count:rows.length})}</span></div>
 <div class="part1-viewport" tabindex="0" role="region" aria-label="${t('map.viewport')}"><div class="part1-canvas">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mapMeta.width} ${mapMeta.height}" role="img" aria-label="${t('map.art')}">${mapTiles.map(tile=>`<image href="${esc(tile.src)}" x="${tile.x}" y="${tile.y}" width="${tile.width}" height="${tile.height}"/>`).join('')}</svg>
 <div class="part1-points">${rows.map(n=>`<a class="part1-point ${n.kind}${n.id===selected?.id?' selected':''}${n.ko==='???'?' unidentified':''}" href="${esc(placeHref(n))}" data-map-place="${n.id}" style="left:${n.u*100}%;top:${n.v*100}%" aria-label="${esc(t('map.point',{name:mapName(n,t)}))}"${selected?.id===n.id?' aria-current="location"':''}><span class="part1-mark" aria-hidden="true"></span><span class="part1-point-label">${esc(mapName(n,t))}</span></a>`).join('')}</div>
 </div></div><p class="part1-legend">${t('map.legend')}</p><p class="part1-pan">${t('map.pan')}</p>
 </div><div class="part1-sidebar"><section class="part1-selection" id="map-selection" tabindex="-1" aria-live="polite">${selectedDetails(selected,ctx,state)}</section>
 <h3 class="part1-list-heading">${t('map.results')}</h3><div class="part1-results">${rows.length?rows.map(n=>`<div class="part1-result${n.id===selected?.id?' selected':''}"><a class="part1-row-place" href="${esc(placeHref(n))}" data-map-place="${n.id}"${n.id===selected?.id?' aria-current="location"':''}><span${t.locale==='en'&&/[가-힣]/.test(mapName(n,t))?' lang="ko"':''}>${esc(mapName(n,t))}</span><small>${esc(provinceName(n.province,t))} · ${t('map.'+n.kind)}</small></a>${n.entryId?`<a class="part1-row-entry" href="${ctx.href(n.entryId)}" aria-label="${esc(t('map.entry')+' · '+mapName(n,t))}">${t('map.row-entry')}</a>`:''}</div>`).join(''):`<p class="empty">${t('map.empty')}</p>`}</div></div></div>
 <footer class="part1-credit" id="map-source"><span>${t('map.credit')}</span> <a href="./evidence/part1-map.html">${t('map.evidence')}</a></footer>
 </section>`;
}
function inlineMap(points,entry,ctx,{reference=false}={}){
 const {t,lang,base}=ctx;
 return `<figure class="entry-place-map${reference?' reference-map':''}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${mapMeta.width} ${mapMeta.height}" role="group" aria-label="${t(reference?'map.reference-points':'map.place-map')}">${mapTiles.map(tile=>`<image href="${esc(tile.src)}" x="${tile.x}" y="${tile.y}" width="${tile.width}" height="${tile.height}" aria-hidden="true"/>`).join('')}${points.map((n,i)=>`<a href="${esc(mapHref(n.id,reference||entry.type==='location'?'':entry.id,lang,base))}" aria-label="${esc((i+1)+'. '+mapName(n,t)+' · '+t(reference?'map.reference-open':'map.open'))}"><title>${esc(mapName(n,t))}</title><circle class="entry-place-pin${reference?' landmark-pin':''}" cx="${n.u*810}" cy="${n.v*760}" r="21"/><text x="${n.u*810}" y="${n.v*760}" dy=".35em" text-anchor="middle" aria-hidden="true">${i+1}</text></a>`).join('')}</svg><figcaption>${t('map.credit')} <a href="${pagePath({type:'map'},lang,base)}#map-source">${t('map.image-source')}</a></figcaption></figure>`;
}
function placeRows(places,entry,ctx){
 const {t,lang,base,href,name,entries,tx}=ctx;
 return `<ol class="entry-acquisition-list">${places.map((place,i)=>{
  const target=entries.find(e=>e.id===place.id),title=place.point?mapName(place.point,t):target?name(target):tx(place.where);
  const lines=[...new Set(place.records.map(r=>recordLine(r,ctx,entry,{compact:true})))];
  const shownLines=lines.filter(line=>line.includes(' · ')||!lines.some(other=>other!==line&&other.startsWith(line.replace('</small>',' · '))));
  return `<li><div class="entry-acquisition-heading"><span class="entry-place-number" aria-hidden="true">${i+1}</span><h3>${target?`<a href="${href(target.id)}">${esc(title)}</a>`:esc(title)}</h3></div>${place.point?`<p class="entry-place-region">${esc(provinceName(place.point.province,t))} · ${t('map.'+place.point.kind)}</p><a class="entry-map-link" href="${esc(mapHref(place.point.id,entry.id,lang,base))}">${t('map.open')}</a>`:`<p class="entry-unmapped">${esc([...new Set(place.records.map(r=>r.region?ctx.text(r.region):'').filter(Boolean))].join(' · '))}${place.records.some(r=>r.region)?' · ':''}${t('map.map-unconfirmed')}</p>`}${shownLines.join('')}</li>`;
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
  return `<section class="entry-acquisition entry-map-location" id="entry-acquisition"><h2>${t('map.place-map')}</h2><div class="entry-location-layout">${inlineMap([point],entry,ctx)}<div><p>${esc(provinceName(point.province,t))} · ${t('map.'+point.kind)}</p><a class="entry-map-link" href="${esc(mapHref(point.id,'',lang,base))}">${t('map.open')}</a>${placeDetails(point,ctx,{description:false,heading:3})}</div></div></section>`;
 }
 if(entry.type==='mount')return mountPlaces(entry,ctx);
 if(entry.type!=='item')return '';
 const places=acquisitionPlaces(entry,entries);if(!places.length)return '';
 const mapped=places.filter(p=>p.point),unmapped=places.filter(p=>!p.point);
 return `<section class="entry-acquisition" id="entry-acquisition"><h2>${t('map.where-to-find')}</h2>${entry.type==='mount'&&entry.body?`<p>${esc(ctx.tx(entry.body))}</p>`:''}${mapped.length?`<div class="entry-acquisition-layout">${inlineMap(mapped.map(p=>p.point),entry,ctx)}${placeRows(mapped,entry,ctx)}</div>`:''}${unmapped.length?mapped.length?`<details class="entry-unmapped-places"><summary>${t('map.unmapped-places',{count:unmapped.length})}</summary>${placeRows(unmapped,entry,ctx)}</details>`:placeRows(unmapped,entry,ctx):''}</section>`;
}
