import {entries} from './data.mjs';
import {media} from './media.mjs';
import {entryIconMedia} from './entity-media.mjs';
import {characterIcon} from './_abilities/icon-model.mjs';
import {characterGroups} from './browse-groups.mjs';
import {characterFaction} from './presentation.mjs';
import {classTierOrder,classTierName} from './class-tiers.mjs';
import {sortClasses} from './class-order.mjs';
import {mountCategory} from './mount-ui.mjs';
import {entryDisplayName} from './editorial-view.mjs';
import {pagePath} from './routing.mjs';
import {escapeHtml as esc} from './core.mjs';
import {icon} from './icons.mjs';
export function directoryCards(list,{type,lang,t,base='/',query='',searchText}){
 const matches=e=>!query||searchText(e).includes(query.trim().toLocaleLowerCase());
 const card=e=>{
  const artwork=e.type==='character'?media[e.id]||e.portrait:entryIconMedia(e),face=!artwork&&e.type==='character'?characterIcon(e.id):null;
  const src=artwork?base+artwork.src.replace(/^\.\//,''):face?base+'_abilities/'+face.src.replace(/^\.\//,''):'';
  const image=src?`<img src="${esc(src)}" alt="" loading="lazy" decoding="async"${artwork?.width?` width="${artwork.width}" height="${artwork.height}"`:''}>`:icon(type);
  return `<li data-overview-id="${e.id}"${matches(e)?'':' hidden'} data-overview-search="${esc(searchText(e))}"><article class="directory-card"><a class="directory-card-head" href="${pagePath({id:e.id},lang,base)}"><span class="directory-card-picture">${image}</span><span class="directory-card-name">${esc(entryDisplayName(e,lang))}</span></a></article></li>`;
 };
 const group=(title,rows)=>{const count=rows.filter(matches).length;return `<section class="overview-group directory-card-group"${count?'':' hidden'}><h2>${esc(title)}<small>${count}</small></h2><ul class="directory-card-grid">${rows.map(card).join('')}</ul></section>`;};
 let body='';
 if(type==='character')body=characterGroups(list).filter(g=>['playable','guest'].includes(g.role)).map(g=>group(g.role==='guest'?t('overview.guests'):characterFaction(g.entries[0],t,entries),g.entries)).join('');
 else if(type==='class')body=classTierOrder.map(tier=>{const rows=sortClasses(list.filter(e=>e.category===tier));return rows.length?group(classTierName(tier,lang),rows):'';}).join('');
 else{
  const category=e=>mountCategory(e,t)||t('overview.unconfirmed');
  body=[...new Set(list.map(category))].map(name=>group(name,list.filter(e=>category(e)===name))).join('');
 }
 return `<div id="directory-cards" class="directory-card-list directory-card-list-${type}${type==='character'?'':' directory-icon-list'}">${body}</div>`;
}
