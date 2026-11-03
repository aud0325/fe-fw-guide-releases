import {escapeHtml as esc} from './core.mjs';
import {statLabels} from './locales/labels.mjs';
import {delayedHover} from './growth-calculator-stage-ui.mjs';
export const bonusText=value=>Number.isFinite(value)&&value!==0?(value>0?'+':'')+value:'';
const number=value=>Number.isFinite(value)?String(value):'—';
const statName=(key,t,lang)=>key==='total'?t('calculator.statTotal'):statLabels.find(s=>s[0]===key)?.[lang==='en'?2:1]||'';
const localName=(name,lang)=>typeof name==='string'?name:name?.[lang]||name?.en||'';
const localPayload=(payload,lang)=>({...payload,className:localName(payload.className,lang),mountName:localName(payload.mountName,lang),characterNames:(payload.characterNames||[]).map(n=>localName(n,lang))});
const accessibleName=(payload,t,lang)=>statName(payload.key,t,lang)+(payload.primary!==null?' '+payload.primary:'')+' · '+t('calculator.statBreakdown')+(bonusText(payload.extraKnown)?' · '+t('calculator.knownExtra')+' '+bonusText(payload.extraKnown):'');
export function statBonusButton(payload,{t,lang,content='',addon=false}){
 if(!payload||payload.primary===null&&!addon)return content||'—';
 const extra=bonusText(payload.extraKnown);if(addon&&!extra)return '';
 return `<button type="button" tabindex="${addon?-1:0}" class="${addon?'calc-bonus-addon':'calc-stat-breakdown'}" data-calc-stat-tip="${esc(JSON.stringify(localPayload(payload,lang)))}" aria-label="${esc(accessibleName(payload,t,lang))}" title="${esc(t('calculator.statBreakdown'))}">${content}${addon?(extra?`<span class="calc-fixed-addition">${extra}</span>`:'<span class="calc-fixed-info" aria-hidden="true">ⓘ</span>'):`<small class="calc-fixed-addition"${extra?'':' hidden'}>${extra}</small>`}</button>`;
}
export function updateStatBonusButton(button,payload,{t,lang}){
 button.dataset.calcStatTip=JSON.stringify(localPayload(payload,lang));button.setAttribute('aria-label',accessibleName(payload,t,lang));
 const extra=button.querySelector('.calc-fixed-addition');if(extra){extra.hidden=!payload.extraKnown;extra.textContent=bonusText(payload.extraKnown);}
}
export function statTooltipHtml(payload,{t,lang}){
 const localized=name=>localName(name,lang),own=(payload.characterNames||[]).map(localized).join(' · '),job=localized(payload.className),mount=localized(payload.mountName),name=statName(payload.key,t,lang),row=(label,value,detail='')=>`<div><span>${esc(label)}${detail?`<small>${esc(detail)}</small>`:''}</span><b>${Number.isFinite(value)?(value>0&&label!==t('calculator.intrinsic')&&label!==t('calculator.inputBase')?'+':'')+value:'—'}</b></div>`;
 return `<strong>${esc(name+' · '+t('calculator.statBreakdown'))}</strong>${row(t(payload.manual?'calculator.inputBase':'calculator.intrinsic'),payload.manual?payload.primary:payload.body)}${row(t('calculator.class'),payload.job,job)}${row(t('calculator.mount'),payload.animal,mount+(mount&&payload.multiplier===2?' ×2':''))}${row(t('calculator.corePersonal'),payload.own,own)}<div class="calc-tooltip-total"><span>${t('calculator.knownExtra')}</span><b>${bonusText(payload.extraKnown)||'0'}</b></div><div><span>${t('calculator.withBonuses')}</span><b>${number(payload.included)}</b></div><p>${t('calculator.bonusSplitNote')}${payload.manual?' '+t('calculator.manualBonusUnknown'):!payload.extraComplete?' '+t('calculator.bonusIncomplete'):''} ${t('calculator.basePersonalNote')}</p>`;
}
export function bindStatBreakdowns(host,{t,lang}){
 const tip=document.createElement('div');tip.id='calc-stat-tooltip';tip.className='calc-stat-tooltip';tip.setAttribute('role','tooltip');tip.hidden=true;document.body.append(tip);let current,pinned=false;
 const hide=()=>{intent.cancel();current?.removeAttribute('aria-describedby');current=null;pinned=false;tip.hidden=true;};
 const show=button=>{if(!button?.isConnected){hide();return;}if(current!==button)current?.removeAttribute('aria-describedby');current=button;let payload;try{payload=JSON.parse(button.dataset.calcStatTip);}catch{hide();return;}tip.innerHTML=statTooltipHtml(payload,{t,lang});tip.hidden=false;button.setAttribute('aria-describedby',tip.id);const anchor=button.getBoundingClientRect(),box=tip.getBoundingClientRect();tip.style.left=Math.max(8,Math.min(innerWidth-box.width-8,anchor.right-box.width))+'px';tip.style.top=(anchor.bottom+box.height+8>innerHeight?Math.max(8,anchor.top-box.height-8):anchor.bottom+8)+'px';};
 const intent=delayedHover(()=>show(current));
 const enter=event=>{const button=event.target.closest('[data-calc-stat-tip]');if(!button||button.contains(event.relatedTarget)||event.pointerType==='touch')return;if(current!==button)hide();current=button;intent.enter();};
 const leave=event=>{const button=event.target.closest('[data-calc-stat-tip]');if(button&&button===current&&!button.contains(event.relatedTarget)){intent.cancel();if(!pinned&&document.activeElement!==button)hide();}};
 const focus=event=>{const button=event.target.closest('[data-calc-stat-tip]');if(button){intent.cancel();show(button);}};
 const blur=event=>{if(event.target===current)hide();};
 const click=event=>{const button=event.target.closest('[data-calc-stat-tip]');if(!button)return;intent.cancel();if(current===button&&pinned)hide();else{show(button);pinned=true;}};
 const key=event=>{if(event.altKey&&event.key==='ArrowDown'&&event.target.matches('[data-calc-stat-input]')){const button=event.target.parentElement.querySelector('[data-calc-stat-tip]');if(button){event.preventDefault();button.focus({preventScroll:true});}return;}if(event.key==='Escape'&&event.target.closest('[data-calc-stat-tip]')){event.preventDefault();event.stopPropagation();const input=event.target.classList.contains('calc-bonus-addon')?event.target.parentElement.querySelector('input'):null;hide();input?.focus({preventScroll:true});}};
 const outside=event=>{if(!event.target.closest('[data-calc-stat-tip]')&&!tip.contains(event.target))hide();};
 host.addEventListener('pointerover',enter);host.addEventListener('pointerout',leave);host.addEventListener('focusin',focus);host.addEventListener('focusout',blur);host.addEventListener('click',click);host.addEventListener('keydown',key);host.addEventListener('calc-stat-update',hide);document.addEventListener('pointerdown',outside);window.addEventListener('resize',hide);window.addEventListener('scroll',hide,true);
 return ()=>{hide();tip.remove();host.removeEventListener('pointerover',enter);host.removeEventListener('pointerout',leave);host.removeEventListener('focusin',focus);host.removeEventListener('focusout',blur);host.removeEventListener('click',click);host.removeEventListener('keydown',key);host.removeEventListener('calc-stat-update',hide);document.removeEventListener('pointerdown',outside);window.removeEventListener('resize',hide);window.removeEventListener('scroll',hide,true);};
}
