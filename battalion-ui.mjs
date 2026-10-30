import {escapeHtml as esc} from './core.mjs';
import {entryDisplayName} from './editorial-view.mjs';
import {pagePath,stateQuery} from './routing.mjs';
import {createTranslator} from './locales/index.mjs';
import {statLabels} from './locales/labels.mjs';
import {feedbackLink} from './feedback.mjs';

const kinds=['physical','magical','defense','support'];
const get=(entries,id)=>entries.find(e=>e.id===id);
const link=(e,{lang,base},anchor='')=>`<a href="${esc(pagePath({id:e.id},lang,base)+anchor)}">${esc(entryDisplayName(e,lang))}</a>`;
const unknown=t=>`<span class="battalion-unknown">${esc(t('battalion.unknown'))}</span>`;
export function battalionBonuses(bonuses,lang='ko'){
 return Object.entries(bonuses).map(([stat,value])=>{const label=statLabels.find(([key])=>key===stat.toLowerCase());return `<span>${esc(label?.[lang==='ko'?1:2]||stat)} <b>+${esc(value)}</b></span>`;}).join('');
}
export function gambitNumber(number,t,{uses=false}={}){
 if(!number)return unknown(t);
 if(number.status==='uncertain')return `<span class="battalion-unknown">${esc(t('gambit.uncertain',{values:number.candidates.join('/')}))}</span>`;
 return esc(number.unit==='percent'?number.value+'%':uses?t('gambit.times',{value:number.value}):number.value);
}
export function gambitArea(area,{t}){
 const affected=new Set(area.affected.map(p=>p.x+','+p.y));
 const coordinates=t('gambit.coordinates',{actor:`${area.actor.x+1}, ${area.actor.y+1}`,tiles:area.affected.map(p=>`(${p.x+1}, ${p.y+1})`).join('; ')});
 return `<figure class="gambit-area"><div role="img" aria-label="${esc(t('gambit.area-label',{width:area.width,height:area.height,count:affected.size}))}" class="gambit-grid" style="--gambit-columns:${area.width}">${Array.from({length:area.width*area.height},(_,i)=>{const x=i%area.width,y=Math.floor(i/area.width),actor=x===area.actor.x&&y===area.actor.y;return `<span aria-hidden="true" class="gambit-tile${actor?' is-actor':''}${affected.has(x+','+y)?' is-affected':''}">${actor?'●':''}</span>`;}).join('')}</div><figcaption class="sr-only">${esc(coordinates)}</figcaption></figure>`;
}
const areaForRank=(areas,rank)=>areas.filter(a=>a.ranks===null||a.ranks.includes(rank));
function gambitAreas(g,{t,rank=null}={}){
 const areas=rank?areaForRank(g.areas,rank):g.areas;
 if(!areas.length)return rank?`<p class="battalion-unknown">${t('gambit.rank-unknown')}</p>`:'';
 return `<div class="gambit-area-list">${areas.map(a=>`<div>${a.ranks&&!rank?`<h4>${esc(t('gambit.ranks',{ranks:a.ranks.join('/')}))}</h4>`:''}${gambitArea(a,{t})}${a.uncertainRanks.length?`<small>${t('gambit.d-rank-unknown')}</small>`:''}</div>`).join('')}</div><p class="gambit-legend">${t('gambit.legend')}</p>`;
}
function gambitValues(g,t){
 return `<dl class="gambit-values">${[['gambit.uses',g.uses,true],...(g.power?[[g.power.unit==='percent'?'gambit.recovery':'gambit.might',g.power,false]]:[]),...(g.hit?[['gambit.hit',g.hit,false]]:[])].map(([key,n,uses])=>`<div><dt>${t(key)}</dt><dd>${gambitNumber(n,t,{uses})}</dd></div>`).join('')}</dl>`;
}
function gambitBody(entry,{entries,lang,t,base,rank=null}){
 const g=entry.gambit;
 return `${g.effect?`<p>${esc(g.effect[lang])}</p>`:''}${gambitValues(g,t)}${gambitAreas(g,{t,rank})}`;
}
function conditions(p,t){return p.scopes.length?p.scopes.map(s=>s.part===3?t('battalion.part-three'):t('battalion.theodora')+' '+t('battalion.part-one')).join(' · '):t('battalion.unspecified');}
export function battalionDetails(e,{entries,lang='ko',base='/'}){
 const t=createTranslator(lang),ctx={entries,lang,t,base};
 if(e.type==='gambit'){
  const owners=e.gambit.battalionIds.map(id=>get(entries,id)).filter(Boolean);
  return `<section class="battalion-detail battalion-profile" id="section-gambit"><div class="battalion-columns"><div class="battalion-primary"><h2>${t('gambit.details')}</h2>${gambitBody(e,ctx)}</div><section class="battalion-secondary" id="section-gambit-owners"><h2>${t('gambit.owners')}</h2><table class="battalion-owner-table"><thead><tr>${['battalion.name','battalion.kind','battalion.rank'].map(key=>`<th scope="col">${t(key)}</th>`).join('')}</tr></thead><tbody>${owners.map(b=>`<tr><th scope="row">${link(b,ctx)}</th><td>${t('battalion.'+b.category)}</td><td>${esc(b.battalion.rank||t('battalion.unknown'))}</td></tr>`).join('')}</tbody></table></section></div></section>`;
 }
 if(e.type!=='battalion')return '';
 const b=e.battalion,g=b.gambit.id?get(entries,b.gambit.id):null;
 const header=`<p class="battalion-classification">${esc(b.rank||t('battalion.unknown'))} · ${t('battalion.'+e.category)}</p><p class="battalion-rule">${t('battalion.infantry')}</p>`;
 const stats=`<section id="section-battalion-bonuses"><h2>${t('battalion.bonuses')}</h2><div class="battalion-bonuses">${battalionBonuses(b.bonuses,lang)||unknown(t)}</div></section>`;
 const gambit=`<section id="section-battalion-gambit"><h2>${t('battalion.gambit')}</h2><h3>${g?link(g,ctx):esc(b.gambit.name[lang])}</h3>${g?gambitBody(g,{...ctx,rank:b.rank}):''}</section>`;
 const hire=`<section id="section-battalion-hire"><h2>${t('battalion.hire')}</h2>${b.tutorial?`<p>${t('battalion.tutorial')}</p>`:''}${b.hirePlaces.length?`<table role="table" class="battalion-hire-table"><thead role="rowgroup"><tr role="row"><th role="columnheader" scope="col">${t('battalion.place')}</th><th role="columnheader" scope="col">${t('battalion.conditions')}</th></tr></thead><tbody role="rowgroup">${b.hirePlaces.map(p=>`<tr role="row"><th role="rowheader" scope="row">${link(get(entries,p.locationId),ctx,'#section-place-battalions')}</th><td role="cell">${esc(conditions(p,t))}</td></tr>`).join('')}</tbody></table>`:`<p class="battalion-unknown">${t('battalion.unknown-hire')}</p>`}</section>`;
 const gather=b.gatherLimit.normal==null?'':`<section id="section-battalion-gather"><h2>${t('battalion.gather')}</h2><dl class="gambit-values"><div><dt>${t('battalion.normal')}</dt><dd>${b.gatherLimit.normal}</dd></div><div><dt>${t('battalion.affinity')}</dt><dd>${b.gatherLimit.affinity}</dd></div></dl></section>`;
 return `<div class="battalion-detail battalion-profile">${header}<div class="battalion-columns"><div class="battalion-primary">${stats}${gambit}</div><div class="battalion-secondary">${hire}${gather}</div></div></div>`;
}
export function placeBattalions(e,{entries,lang='ko',base='/'}){
 if(!e.battalionRecruitment?.length)return '';
 const t=createTranslator(lang),ctx={lang,base},groups=[{key:'first',title:t('battalion.theodora')+' '+t('battalion.part-one'),rows:e.battalionRecruitment.filter(r=>r.scopes.some(s=>s.part===1))},{key:'unspecified',title:t('battalion.unspecified'),rows:e.battalionRecruitment.filter(r=>!r.scopes.length)},{key:'third',title:t('battalion.part-three'),rows:e.battalionRecruitment.filter(r=>r.scopes.some(s=>s.part===3))}];
 const body=groups.filter(g=>g.rows.length).map(g=>{const table=`<h3>${esc(g.title)}</h3><table role="table" class="battalion-hire-table"><thead role="rowgroup"><tr role="row"><th role="columnheader" scope="col">${t('battalion.name')}</th><th role="columnheader" scope="col">${t('battalion.gambit')}</th></tr></thead><tbody role="rowgroup">${g.rows.map(r=>{const b=get(entries,r.battalionId),gambit=b.battalion.gambit;return `<tr role="row"><th role="rowheader" scope="row">${link(b,ctx,'#section-battalion-hire')} <small>${esc(b.battalion.rank||t('battalion.unknown'))}</small></th><td role="cell">${gambit.id?link(get(entries,gambit.id),ctx):esc(gambit.name[lang])}</td></tr>`;}).join('')}</tbody></table>`;return g.key==='third'?`<details class="battalion-part-three"><summary>${t('battalion.part-three')}</summary>${table.replace(`<h3>${esc(g.title)}</h3>`,'')}</details>`:table;}).join('');
 return `<section class="battalion-detail" id="section-place-battalions"><h2>${t('battalion.place-title')}</h2>${body}</section>`;
}
export function battalionSearchText(e,entries){return [e.name.ko,e.name.en,...e.aliases,e.category,...(e.battalion?[e.battalion.rank,...Object.keys(e.battalion.bonuses),...Object.keys(e.battalion.bonuses).flatMap(s=>statLabels.find(([k])=>k===s.toLowerCase())?.slice(1)||[]),...Object.values(e.battalion.gambit.name)]:[...Object.values(e.gambit.effect||{}),...e.gambit.battalionIds.flatMap(id=>Object.values(get(entries,id)?.name||{}))])].join(' ').toLocaleLowerCase();}
export function battalionDirectory(state,lang,entries,base='/'){
 const t=createTranslator(lang),type=state.type,ctx={lang,base},query=(state.catalogQuery||'').trim().toLocaleLowerCase(),list=entries.filter(e=>e.type===type&&(!state.group||e.category===state.group));
 if(type==='battalion'){const rank=e=>e.battalion.rank?'EDCBA'.indexOf(e.battalion.rank):5;list.sort((a,b)=>rank(a)-rank(b));}
 const title=t(type==='battalion'?'battalion.title':'battalion.gambits'),search=t(type==='battalion'?'battalion.find':'battalion.find-gambit');
 const tabs=['',...kinds].map(group=>{const target={...state,id:'',group};return `<a data-overview-filter href="${esc(pagePath(target,lang,base)+stateQuery(target))}"${state.group===group?' aria-current="page"':''}>${t(group?'battalion.'+group:'battalion.all')}</a>`;}).join('');
 const rows=list.map(e=>{const searchText=battalionSearchText(e,entries),hide=query&&!searchText.includes(query);const cells=type==='battalion'?`<td role="cell" data-label="${t('battalion.rank')}">${esc(e.battalion.rank||t('battalion.unknown'))}</td><td role="cell" data-label="${t('battalion.bonuses')}"><div class="battalion-bonuses">${battalionBonuses(e.battalion.bonuses,lang)||unknown(t)}</div></td><td role="cell" data-label="${t('battalion.gambit')}">${e.battalion.gambit.id?link(get(entries,e.battalion.gambit.id),ctx):esc(e.battalion.gambit.name[lang])}</td>`:`<td role="cell" data-label="${t('gambit.uses')}">${gambitNumber(e.gambit.uses,t,{uses:true})}</td><td role="cell" data-label="${t('gambit.effect')}">${esc(e.gambit.effect?.[lang]||'')}</td>`;
  return `<tr role="row" data-overview-id="${e.id}" data-overview-search="${esc(searchText)}"${hide?' hidden':''}><th role="rowheader" scope="row">${link(e,ctx)}</th><td role="cell" data-label="${t('battalion.kind')}">${t('battalion.'+e.category)}</td>${cells}</tr>`;
 }).join('');
 const count=list.filter(e=>!query||battalionSearchText(e,entries).includes(query)).length;
 const caps=[...new Map(entries.filter(e=>e.battalion?.rank&&e.battalion.gatherLimit.normal!=null).map(e=>[e.battalion.rank,e.battalion.gatherLimit])).entries()].sort(([a],[b])=>'EDCBA'.indexOf(a)-'EDCBA'.indexOf(b));
 const gathering=type==='battalion'?`<details class="battalion-caps"><summary>${t('battalion.gather')}</summary><table role="table"><thead><tr><th scope="col">${t('battalion.rank')}</th><th scope="col">${t('battalion.normal')}</th><th scope="col">${t('battalion.affinity')}</th></tr></thead><tbody>${caps.map(([rank,c])=>`<tr><th scope="row">${rank}</th><td>${c.normal}</td><td>${c.affinity}</td></tr>`).join('')}</tbody></table></details>`:'';
 return {html:`<div class="battalion-directory battalion-directory-${type}" data-overview-directory><div class="breadcrumb-row page-breadcrumb-row"><div class="breadcrumbs"><a href="${base}${lang}/">${t('app.archive')}</a> / ${title}</div>${feedbackLink(lang)}</div><div class="section-head"><h1>${title}</h1><small data-overview-count role="status" aria-live="polite">${t(count===1?'browse.entry-one':'browse.entry-count',{count})}</small></div><nav class="battalion-tabs" aria-label="${t('battalion.kind')}">${tabs}</nav><label class="battalion-query"><span class="sr-only">${search}</span><input type="search" data-overview-query placeholder="${search}" value="${esc(state.catalogQuery||'')}"></label>${type==='battalion'?`<p class="battalion-rule">${t('battalion.infantry')}</p>`:''}${gathering}<table role="table" class="battalion-directory-table"><thead role="rowgroup"><tr role="row"><th role="columnheader" scope="col">${t(type==='battalion'?'battalion.name':'battalion.gambit')}</th>${(type==='battalion'?['battalion.kind','battalion.rank','battalion.bonuses','battalion.gambit']:['battalion.kind','gambit.uses','gambit.effect']).map(key=>`<th role="columnheader" scope="col">${t(key)}</th>`).join('')}</tr></thead><tbody role="rowgroup">${rows}</tbody></table><p class="overview-query-empty"${count?' hidden':''}>${t('battalion.empty')}</p></div>`};
}
