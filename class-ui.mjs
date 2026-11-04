import {entryDisplayName} from './editorial-view.mjs';
import {classReference} from './class-reference.generated.mjs';
import {entries} from './data.mjs';
import {classSkills,tierNames,proficiencyNames} from './catalog-overview-model.mjs';
import {proficiencyGlyph} from './_abilities/proficiency-ui.mjs';
import {proficiencyOrder} from './_abilities/catalog-model.mjs';
import {abilityToken} from './_abilities/token-links.mjs';
import {renderKeywordText} from './game-keywords.mjs';
import {growthCellStyle} from './growth-comparison.mjs';
import {statLabels} from './locales/labels.mjs';
import {pagePath} from './routing.mjs';
import {escapeHtml as esc} from './core.mjs';
export function classProficiency(id,value,{lang='ko',base='/'}={}){
 const label=proficiencyNames[id]?.[lang==='ko'?0:1];
 return `<span class="class-proficiency">${proficiencyGlyph(id,'normal',base)}<span>${esc(label)}${value==null?'':` <b>${esc(value)}</b>`}</span></span>`;
}
export function classCertification(e,{t,base='/',compact=false}){
 const p=classReference[e.id];if(!p)return '';
 const lang=t.locale;
 const rank=list=>list.map(r=>classProficiency(r.id,r.rank,{lang,base})).join('');
 const itemLink=id=>{const item=entries.find(x=>x.id===id);return item?`<a href="${pagePath({id},lang,base)}">${esc(entryDisplayName(item,lang))}</a>`:'';};
 const conditions=[];
 if(p.level!=null)conditions.push('Lv.'+p.level);
 if(p.renown!=null)conditions.push(t('class.renown',{level:p.renown}));
 if(p.licenceId&&p.licenceId!==p.itemId)conditions.push(itemLink(p.licenceId));
 if(p.itemId)conditions.push(itemLink(p.itemId));
 const rows=[];
 if(p.required.length)rows.push([t('class.required'),rank(p.required)]);
 if(p.oneOf.length)rows.push([t('class.one-of'),rank(p.oneOf)]);
 if(conditions.length)rows.push([t('class.exam'),conditions.join(' · ')]);
 const restrictions=[];
 if(p.female)restrictions.push(t('class.female'));
 if(p.concurrentLimit)restrictions.push(t('class.concurrent',{count:p.concurrentLimit}));
 if(restrictions.length)rows.push([t('class.restrictions'),restrictions.map(esc).join(' · ')]);
 const unlock=classUnlock(e,{t,base});
 if(unlock)rows.push([t('class.unlock'),unlock]);
 if(!rows.length)rows.push([t('class.exam'),esc(t('class.base'))]);
 return `<dl class="class-requirements${compact?' class-requirements-compact':''}">${rows.map(([label,body])=>`<div><dt>${esc(label)}</dt><dd>${body}</dd></div>`).join('')}</dl>`;
}
export function classUnlock(e,{t,base='/'}){
 const p=classReference[e.id];if(!p)return '';
 if(p.routes.length)return p.routes.map(r=>esc(t(r.chapter?'class.route-chapter':'class.route',{route:entries.find(e=>e.id===r.id).name[t.locale],chapter:r.chapter}))).join(' / ');
 return p.part?t('class.part',{part:t.locale==='en'?['','I','II','III'][p.part]:p.part}):'';
}
export function classListCertification(e,{t,base='/'}){
 const p=classReference[e.id];
 const rankGroup=(list,label,choice)=>!list.length?'':`<div class="class-list-ranks" data-rank-rule="${choice?'one-of':'all'}"><small>${t(label)}</small><ul class="class-rank-values">${list.map((r,i)=>`<li>${classProficiency(r.id,r.rank,{lang:t.locale,base})}${i<list.length-1?`<span class="sr-only">${t(choice?'class.or':'class.and')}</span>`:''}</li>`).join('')}</ul></div>`;
 const groups=[rankGroup(p.required,'class.required',false),rankGroup(p.oneOf,'class.one-of',true)].filter(Boolean);
 if(p.female)groups.push(`<p class="class-list-meta">${esc(t('class.female'))}</p>`);
 const unlock=p.routes.length?p.routes.map(r=>t(r.chapter?'class.route-chapter-short':'class.route-short',{route:entries.find(e=>e.id===r.id).name[t.locale],chapter:r.chapter})).join(' / '):p.part?t('class.part-short',{part:t.locale==='en'?['','I','II','III'][p.part]:p.part}):'';
 if(unlock)groups.push(`<p class="class-list-unlock"><small>${t('class.unlock')}</small><span>${esc(unlock)}</span></p>`);
 if(p.concurrentLimit)groups.push(`<p class="class-list-meta class-list-limit">${esc(t('class.list-concurrent',{count:p.concurrentLimit}))}</p>`);
 return `<div class="class-list-certification">${groups.join('')||t('class.base')}</div>`;
}
export function classAbilityTable(list,{t,base='/'}){
 if(!list.length)return `<p class="class-empty">${t('class.none')}</p>`;
 return `<table class="class-ability-table"><colgroup><col class="class-ability-name"><col></colgroup><thead><tr><th scope="col">${t('class.skill-name')}</th><th scope="col">${t('class.effect')}</th></tr></thead><tbody>${list.map(r=>`<tr><th scope="row">${abilityToken(r,t.locale,{base})}</th><td>${renderKeywordText(r.effect[t.locale],{entryId:r.id,lang:t.locale,base})}</td></tr>`).join('')}</tbody></table>`;
}
export function classStatTables(e,{t,base='/'}){
 const p=classReference[e.id],keys=statLabels,heading=()=>keys.map(([,ko,en])=>`<th scope="col">${esc(t(ko,en))}</th>`).join('');
 const values=(r,mode)=>keys.map(([k])=>{const v=r.values[k],style=v?growthCellStyle(v,k,{}, {growthTab:'class',growthMode:mode,growthHeat:'on'}):'';return `<td data-stat="${k}"${style?` style="${style}"`:''}>${v==null?'—':`${v>0?'+':''}${esc(v)}${mode==='growth'?'%':''}`}</td>`;}).join('');
 const table=(caption,rows,mode)=>`<div class="class-stat-scroll" role="region" tabindex="0" aria-label="${esc(caption)}"><table class="class-stat-table"><caption>${esc(caption)}</caption><thead><tr><th scope="col">${t('class.context')}</th>${heading()}</tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${esc(r.label)}</th>${values(r,mode)}</tr>`).join('')}</tbody></table></div>`;
 const growths=p.growth.map(r=>({...r,label:r.level?'Lv.'+r.level:t('class.growth')}));
 return table(t('class.growth'),growths,'growth')+table(t('class.modifiers'),[{values:p.modifiers,label:t('class.modifiers')}],'stats')+`<p class="class-stat-key">${t('class.stat-key')}</p>`;
}
export function classDetails(e,{t,base='/',compact=false}){
 const p=classReference[e.id];if(!p)return '';
 const type=p.types.map(id=>t('class.type-'+id)).join(' / '),mastery=classSkills(e.id,'class-mastery'),active=classSkills(e.id,'class-active');
 const h=compact?'h3':'h2';
 const section=(id,title,body)=>`<section${compact?'':` id="class-${id}"`}><${h}>${esc(title)}</${h}>${body}</section>`;
 const skills=[...p.allowed].sort((a,b)=>proficiencyOrder.indexOf(a.id)-proficiencyOrder.indexOf(b.id));
 return `<div class="class-reference${compact?' class-reference-compact':''}"><p class="class-meta">${esc(tierNames[p.tier]?.[t.locale==='ko'?0:1]||p.tier)} · ${esc(type)} · ${t('class.movement',{value:p.movement})}</p>${section('certification',t('class.certification'),classCertification(e,{t,base,compact}))}${section('proficiencies',t('class.proficiencies'),`<div class="class-allowed">${skills.map(r=>classProficiency(r.id,r.bonus?'+'+r.bonus:null,{lang:t.locale,base})).join('')}</div><p class="class-skill-key">${t('class.skill-key')}${p.dismountedInfantry?' '+t('class.dismounted'):''}${p.obstacleFlight?' '+t('class.obstacles'):''}</p>`)}${section('mastery',t('overview.mastery'),classAbilityTable(mastery,{t,base}))}${section('abilities',t('overview.class-abilities'),classAbilityTable(active,{t,base}))}${section('stats',t('class.stats'),classStatTables(e,{t,base}))}</div>`;
}
