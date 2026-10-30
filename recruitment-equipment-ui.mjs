import {escapeHtml as esc} from './core.mjs';
import {itemIcon} from './item-ui.mjs';
import {pagePath} from './routing.mjs';
const conditional=row=>row.minimumLevel!=null||row.maximumRenown!=null||row.fromChapter!=null;
const routeName=(id,{routes,t})=>{const r=routes.find(r=>r[0]===id);return r?t(r[1],r[2]):id;};
function equipmentName(row,{entries,t,name,href}){
 const item=entries.find(e=>e.id===row.itemId),title=(item?name(item):row.name?.en||'')+(row.upgrade?'+'+row.upgrade:'');
 return item?`<a class="recruitment-item" href="${href(item.id)}">${itemIcon(item,{t},'recruitment-item-icon')}<span>${esc(title)}</span></a>`:`<span lang="en">${esc(title)}</span>`;
}
function conditionText(row,ctx){
 const {t}=ctx;
 if(row.minimumLevel!=null)return (row.part>1?t('equipment.part',{part:row.part})+' · ':'')+t('equipment.minimum',{level:row.minimumLevel});
 if(row.maximumRenown!=null)return t('equipment.renown',{renown:row.maximumRenown});
 if(row.fromChapter!=null)return row.routeIds?.length?row.routeIds.map(id=>t('equipment.route-chapter',{route:routeName(id,ctx),chapter:row.fromChapter})).join(' · '):t('equipment.chapter-condition',{chapter:row.fromChapter});
 if(row.prologue)return t('equipment.prologue');
 return row.part?t('equipment.part',{part:row.part}):t('equipment.on-join');
}
function hasDialog(owner,row){return row.minimumLevel!=null&&!(row.part>1)&&!!owner.recruitmentLevelSchedule?.length;}
const dialogId=(owner,row)=>'recruitment-levels-'+owner.id+'-'+(row.itemId||'items')+'-'+(row.upgrade||0);
function equipmentCondition(row,ctx,owner){
 const {t}=ctx,id=dialogId(owner,row);
 const link=hasDialog(owner,row)?`<button type="button" class="recruitment-level-link" data-recruitment-levels="${id}" aria-haspopup="dialog" aria-controls="${id}" disabled>${t('equipment.check-routes')}</button>`:'';
 return `<div class="recruitment-condition"><span>${esc(conditionText(row,ctx))}</span>${link}</div>`;
}
function levelTable(owner,ctx,minimum){
 const {t,routes}=ctx,schedule=owner.recruitmentLevelSchedule||[],chapters=[...new Set(schedule.map(row=>row.chapter))].sort((a,b)=>a-b);
 return `<div class="table-wrap recruitment-level-table"><table><thead><tr><th scope="col">${t('equipment.chapter')}</th>${routes.map(([,ko,en])=>`<th scope="col">${esc(t(ko,en))}</th>`).join('')}</tr></thead><tbody>${chapters.map(chapter=>`<tr><th scope="row">${chapter}</th>${routes.map(([route])=>{const row=schedule.find(r=>r.chapter===chapter&&r.route===route);return `<td${minimum!=null&&row?.level>=minimum?' class="recruitment-level-eligible"':''}>${row?.level??'—'}</td>`;}).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function levelDialog(owner,ctx,record){
 if(!hasDialog(owner,record))return '';
 const {t,name}=ctx,special=record.fromChapter!=null||record.additionalCondition?[record]:[],id=dialogId(owner,record);
 const notes=special.map(row=>row.additionalCondition?t(row.additionalCondition.ko,row.additionalCondition.en):t('equipment.route-chapter',{route:routeName(row.routeIds[0],ctx),chapter:row.fromChapter}));
 const title=t('equipment.level-title',{name:name(owner)}),table=levelTable(owner,ctx,record.minimumLevel);
 return `<dialog class="recruitment-level-dialog" id="${id}" aria-labelledby="${id}-title"><div class="level-dialog-header"><h2 id="${id}-title">${esc(title)}</h2><button type="button" class="level-dialog-close" data-recruitment-close autofocus>${t('equipment.close')}</button></div><p class="recruitment-level-caption">${conditional(record)?esc(conditionText(record,ctx)):t('equipment.level-help')}</p>${table}${notes.map(note=>`<p class="recruitment-level-note">${esc(note)}</p>`).join('')}</dialog><noscript><details class="recruitment-level-fallback"><summary>${esc(title)}</summary>${table}${notes.map(note=>`<p>${esc(note)}</p>`).join('')}</details></noscript>`;
}
export function recruitmentEquipment(e,ctx){
 const sourceRecords=e.recruitmentEquipment;if(!sourceRecords?.length)return '';
 const records=[...sourceRecords.filter(row=>!conditional(row)),...sourceRecords.filter(conditional)];
 const {t}=ctx,late=records.every(row=>row.part>1);
 const content=`<div class="table-wrap recruitment-equipment-table"><table><colgroup><col class="equipment-name-column"><col></colgroup><thead><tr><th scope="col">${t('equipment.item')}</th><th scope="col">${t('equipment.condition')}</th></tr></thead><tbody>${records.map(row=>`<tr><th scope="row">${equipmentName(row,ctx)}</th><td>${equipmentCondition(row,ctx,e)}</td></tr>`).join('')}</tbody></table></div>`;
 const dialogs=records.map(row=>levelDialog(e,ctx,row)).join('');
 return `<section class="recruitment-equipment" id="section-recruitment-equipment" tabindex="-1"><h2>${t('equipment.title')}</h2>${late?`<details class="recruitment-late" id="recruitment-items-${e.id}" data-recruitment-disclosure><summary>${t('equipment.later-spoilers')}</summary>${content}</details>`:content+dialogs}</section>`;
}
export function recruitmentCarriers(e,ctx){
 if(!e.recruitmentCarriers?.length)return '';
 const {t,entries,name}=ctx,early=e.recruitmentCarriers.filter(row=>!row.part||row.part<2),late=e.recruitmentCarriers.filter(row=>row.part>1);
 const rows=list=>`<div class="table-wrap recruitment-equipment-table"><table><colgroup><col class="equipment-name-column"><col></colgroup><thead><tr><th scope="col">${t('equipment.character')}</th><th scope="col">${t('equipment.condition')}</th></tr></thead><tbody>${list.map(row=>{const c=entries.find(c=>c.id===row.characterId);return `<tr><th scope="row"><a href="${pagePath({id:c.id},t.locale,ctx.base)}#section-recruitment-equipment">${esc(name(c))}</a>${row.upgrade?`<small>+${row.upgrade}</small>`:''}</th><td>${equipmentCondition(row,ctx,c)}</td></tr>`;}).join('')}</tbody></table></div>`;
 return `<section class="recruitment-carriers" id="section-recruitment-carriers"><h2>${t('equipment.carriers')}</h2>${early.length?rows(early):''}${late.length?`<details class="recruitment-late" id="recruitment-carriers-${e.id}" data-recruitment-disclosure><summary>${t('equipment.later-spoilers')}</summary>${rows(late)}</details>`:''}${early.map(row=>levelDialog(entries.find(c=>c.id===row.characterId),ctx,row)).join('')}</section>`;
}
