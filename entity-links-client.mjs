import {entries} from './data.mjs';
import {entityPeekFrame,entityPeekStats} from './entity-peek-ui.mjs';
import {abilityVariantComparison} from './_abilities/ability-variants-ui.mjs';
import {combatArtBaseId} from './_abilities/combat-art-upgrades.mjs';
import {rows} from './_abilities/full-data.mjs';
import {abilityHref} from './_abilities/sample-integration.mjs';
import {abilityToken} from './_abilities/token-links.mjs';
import {abilityIcon,characterIcon} from './_abilities/icon-model.mjs';
import {classFact,certification,classSkills} from './catalog-overview-model.mjs';
import {renderKeywordText,keywordCandidates} from './game-keywords.mjs';
import {entryDisplayName} from './editorial-view.mjs';
import {createTranslator} from './locales/index.mjs';
import {pagePath} from './routing.mjs';
import {escapeHtml as esc,isSpoilerEntry} from './core.mjs';

// Installed once. The SPA owns navigation and tells this controller before replacing content.
export function setupEntityLinks(doc,win,{context}){
 let dialog=null,opener=null,tipOwner=null,tipPinned=false;
 const env=()=>{const {lang,base}=context();return {lang,base,t:createTranslator(lang)};};
 function hideTip(){if(tipOwner){tipOwner.setAttribute('aria-expanded','false');tipOwner.removeAttribute('aria-describedby');}doc.getElementById('proficiency-help')?.remove();tipOwner=null;tipPinned=false;}
 function showTip(button,pinned=false){
  if(tipOwner!==button)hideTip();let tip=doc.getElementById('proficiency-help');
  if(!tip){tip=doc.createElement('div');tip.id='proficiency-help';tip.className='proficiency-tip';tip.setAttribute('role','tooltip');doc.body.append(tip);}
  tipOwner=button;tipPinned=pinned||tipPinned;tip.textContent=button.dataset.proficiencyHelp;button.setAttribute('aria-expanded','true');button.setAttribute('aria-describedby',tip.id);
  const r=button.getBoundingClientRect();tip.style.left=Math.max(8,Math.min(win.innerWidth-tip.offsetWidth-8,r.left+(r.width-tip.offsetWidth)/2))+'px';tip.style.top=Math.max(8,r.top-tip.offsetHeight-7)+'px';
 }
 function show(title,body,href){
  const {t}=env();if(!dialog){
   dialog=doc.createElement('dialog');dialog.id='entity-peek';dialog.className='entity-peek';dialog.setAttribute('aria-labelledby','entity-peek-title');doc.body.append(dialog);
   dialog.addEventListener('close',()=>{if(!dialog.open&&opener?.isConnected)opener.focus({preventScroll:true});});
   dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  }
  if(!dialog.open)opener=doc.activeElement;
  dialog.innerHTML=entityPeekFrame(title,body,href,t);
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());if(!dialog.open)dialog.showModal();dialog.querySelector('button').focus();
 }
 function peek(id,triggerLabel=''){
  const {lang,base,t}=env(),row=rows.find(r=>r.id===combatArtBaseId(id)),entry=entries.find(e=>e.id===id);
  const prose=value=>renderKeywordText(value,{entryId:id,lang,base});
  if(id.startsWith('keyword:')){const choices=keywordCandidates(id.slice(8));if(!choices.length)return false;show(triggerLabel||id.slice(8),`<p>${t('entity.choose-keyword')}</p>${choices.map(r=>`<div class="entity-peek-ability">${abilityToken(r,lang,{base})} <small>${t('entity.'+r.kind)}</small><p>${renderKeywordText(r.effect[lang],{entryId:r.id,lang,base})}</p></div>`).join('')}`,base+lang+'/?q='+encodeURIComponent(id.slice(8)));return true;}
  if(row){
   const icon=abilityIcon(row),stats=row.stats||{},art=row.kind==='combat-art';
   const owners=row.relations.filter(x=>x.type==='character'&&entries.some(e=>e.id===x.id&&e.roles?.includes('playable')&&!isSpoilerEntry(e)));
   const comparison=abilityVariantComparison(row,rows,lang,{effect:prose,compact:true});
   const body=`<p class="entity-peek-type">${icon?`<img src="${esc(base+'_abilities/'+icon.src.replace(/^\.\//,''))}" alt="" width="22" height="22"> `:''}${t('entity.'+row.kind)}${row.provisional&&lang==='ko'?' · '+t('app.korean-provisional'):''}</p>${comparison||entityPeekStats(stats,{t,combatArt:art})}${comparison?'':`<p class="entity-peek-effect">${prose(row.effect[lang])}</p>`}${owners.length?`<details class="entity-peek-learning"${owners.length===1?' open':''}><summary>${t('entity.learned-by',{count:owners.length})}</summary><div class="entity-peek-owners">${owners.map(owner=>{
    const media=characterIcon(owner.id),conditions=[...new Set((owner.routes||[owner]).map(r=>[r.rank,r.level!=null?'Lv '+r.level:'',r.method==='overblaze'?t('entity.overblaze'):''].filter(Boolean).join(' ')).filter(Boolean))];
    return `<a href="${pagePath({id:owner.id},lang,base)}">${media?`<img src="${esc(base+'_abilities/'+media.src.replace(/^\.\//,''))}" alt="" width="26" height="26">`:''}${esc(owner.name[lang])}${conditions.length?` <small>${esc(conditions.join(' / '))}</small>`:''}</a>`;
   }).join('')}</div></details>`:''}`;
   show(row.name[lang],body,base.replace(/\/$/,'')+abilityHref(row,lang));return true;
  }
  if(entry?.type==='class'){
   const mastery=classSkills(id,'class-mastery'),active=classSkills(id,'class-active'),condition=certification(entry,lang),unlock=classFact(entry,'unlock',lang);
   const effects=list=>list.map(r=>`<div class="entity-peek-ability">${abilityToken(r,lang,{base})}<p>${renderKeywordText(r.effect[lang],{entryId:r.id,lang,base})}</p></div>`).join('');
   show(entryDisplayName(entry,lang),`<p class="entity-peek-type">${t('entity.class')}</p>${condition?`<p>${prose(condition)}</p>`:''}${unlock?`<p>${prose(unlock)}</p>`:''}<h3>${t('overview.mastery')}</h3>${mastery.length?effects(mastery):`<p>${prose(classFact(entry,'mastery',lang)||'—')}</p>`}${active.length?`<h3>${t('overview.class-abilities')}</h3>${effects(active)}`:''}`,pagePath({id},lang,base));return true;
  }
  return false;
 }
 doc.addEventListener('click',event=>{
  const link=event.target.closest('a[data-entity-id]');if(!link||link.closest('[data-entity-link-mode="direct"]')||event.defaultPrevented||event.button||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const id=link.dataset.entityId;if(!keywordCandidates(id.startsWith('keyword:')?id.slice(8):'').length&&!rows.some(r=>r.id===id)&&!entries.some(e=>e.id===id&&e.type==='class'))return;
  event.preventDefault();event.stopImmediatePropagation();hideTip();peek(id,link.textContent.trim());
 },true);
 doc.addEventListener('click',event=>{if(event.target.closest('#entity-peek a:not([data-entity-id])'))beforeNavigate();},true);
 doc.addEventListener('pointerover',event=>{const b=event.target.closest('[data-proficiency-help]');if(b)showTip(b);});
 doc.addEventListener('pointerout',event=>{if(!tipPinned&&tipOwner&&!tipOwner.contains(event.relatedTarget))hideTip();});
 doc.addEventListener('focusin',event=>{const b=event.target.closest('[data-proficiency-help]');if(b)showTip(b);});
 doc.addEventListener('focusout',event=>{if(event.target===tipOwner)hideTip();});
 doc.addEventListener('click',event=>{const b=event.target.closest('[data-proficiency-help]');if(b){if(tipOwner===b&&tipPinned)hideTip();else showTip(b,true);}else hideTip();});
 doc.addEventListener('keydown',event=>{if(event.key==='Escape'&&tipOwner){event.preventDefault();hideTip();}});
 win.addEventListener('scroll',hideTip,{capture:true,passive:true});win.addEventListener('resize',hideTip,{passive:true});
 function beforeNavigate(){opener=null;if(dialog?.open)dialog.close();hideTip();}
 return {beforeNavigate};
}
