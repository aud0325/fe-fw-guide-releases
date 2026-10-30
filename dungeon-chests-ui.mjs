import {escapeHtml as esc} from './core.mjs';
const itemKey=row=>(row.itemId||row.name?.en||'unknown')+':'+(row.upgrade||0);
export function dungeonChestDetails(e,{t,name,href,entries,routes}){
 const data=e.dungeonChests;if(!data||!data.groups.some(g=>g.status==='listed'||g.status==='locked'))return '';
 const group=g=>{
  if(g.status==='not-listed')return '';
  const heading=t('dungeon.part',{part:g.part});
  if(g.status==='locked')return `<div class="dungeon-chest-period"><h3>${heading}</h3><p>${t('dungeon.locked')}</p></div>`;
  const scope=g.routeIds?.length===routes.length?'':(g.routeIds||[]).map(id=>routes.find(r=>r[0]===id)).filter(Boolean).map(r=>t(r[1],r[2])).join(' · ');
  const condition=g.condition?t(g.condition.ko,g.condition.en):'';
  const place=g.discovery&&entries.find(e=>e.id===g.discovery.locationId),discovery=place?`<p class="dungeon-chest-scope"><a href="${esc(href(place.id))}">${esc(name(place))}</a> · ${esc(t(g.discovery.action.ko,g.discovery.action.en))}</p>`:'';
  const rows=new Map();for(const row of g.entries){const key=itemKey(row);if(!rows.has(key))rows.set(key,{...row,count:0});rows.get(key).count++;}
  const table=`${scope||condition?`<p class="dungeon-chest-scope">${esc([scope,condition].filter(Boolean).join(' · '))}</p>`:''}<div class="table-wrap dungeon-chest-table"><table><colgroup><col>${g.countsKnown?'<col class="dungeon-count-column">':''}</colgroup><thead><tr><th scope="col">${t('dungeon.item')}</th>${g.countsKnown?`<th scope="col">${t('dungeon.chest-count')}</th>`:''}</tr></thead><tbody>${[...rows.values()].map(row=>{const item=entries.find(e=>e.id===row.itemId),upgrade=row.upgrade?' +'+row.upgrade:'';return `<tr><th scope="row">${item?`<a href="${esc(href(item.id))}">${esc(name(item))}${upgrade}</a>`:row.unknown?esc(t('dungeon.unknown-item')):`<span lang="en">${esc(row.name.en)}${upgrade}</span>`}</th>${g.countsKnown?`<td>${row.count}</td>`:''}</tr>`;}).join('')}</tbody></table></div>`;
  return g.part>1?`<details class="dungeon-chest-later"><summary>${t('dungeon.later',{part:g.part})}</summary>${discovery}${table}</details>`:`<div class="dungeon-chest-period"><h3>${heading}</h3>${discovery}${table}</div>`;
 };
 return `<section class="dungeon-chests" id="section-dungeon-chests"><h2>${t('dungeon.title')}</h2>${data.navigation?`<p class="dungeon-navigation"><strong>${t('dungeon.navigation')}</strong> ${esc(t(data.navigation.ko,data.navigation.en))}</p>`:''}${data.groups.map(group).join('')}</section>`;
}
