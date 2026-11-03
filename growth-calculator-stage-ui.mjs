import {escapeHtml as esc} from './core.mjs';
import {statLabels} from './locales/labels.mjs';
import {calculatorKeys as keys} from './growth-calculator-state.mjs';
import {growthAt} from './growth-calculator-model.mjs';
import {calculatorData} from './growth-calculator-data.mjs';
export function stageGrowthValues(character,stage){
 const rates=growthAt(calculatorData,character,stage,stage.level);
 return keys.map(key=>{const mount=stage.mountId?rates.mountGrowth?.[key]*rates.multiplier:0,cls=rates.classGrowth?.[key];return {key,cls,mount,multiplier:rates.multiplier,total:Number.isFinite(cls)&&Number.isFinite(mount)?cls+mount:null};});
}
export function delayedHover(show,{delay=350,schedule=setTimeout,cancel=clearTimeout}={}){
 let timer;const stop=()=>{if(timer!==undefined)cancel(timer);timer=undefined;};
 return {enter(){stop();timer=schedule(()=>{timer=undefined;show();},delay);},cancel:stop};
}
export function stageGrowthHtml(character,stage,index,{t,lang}){
 const stat=k=>statLabels.find(s=>s[0]===k)[lang==='en'?2:1],pct=value=>Number.isFinite(value)?value+'%':'—';
 return `<div class="calc-stage-growth" role="group" aria-label="${esc(t('calculator.stageGrowthLabel',{level:stage.level}))}">${stageGrowthValues(character,stage).map(({key,cls,mount,total,multiplier})=>{const id=`calc-tip-${index}-${key}`,interactive=Number.isFinite(mount)&&mount!==0,tag=interactive?'button':'span';return `<span class="calc-rate-cell"><${tag}${interactive?' type="button"':''} class="calc-rate-value${total>0?' calc-rate-up':total<0?' calc-rate-down':''}"${interactive?` data-calc-tip aria-expanded="false" aria-controls="${id}" aria-describedby="${id}"`:''}><span>${stat(key)}</span><strong>${pct(total)}${mount>0?'<span class="calc-mount-marker" aria-hidden="true">▲</span>':mount<0?'<span class="calc-mount-marker" aria-hidden="true">▼</span>':''}</strong></${tag}>${interactive?`<span role="tooltip" class="calc-rate-tooltip" id="${id}" hidden><strong>${stat(key)} · ${t('calculator.classMount')}</strong><span>${t('calculator.class')} <b>${pct(cls)}</b></span><span>${t('calculator.mount')}${multiplier===2?' ×2':''} <b>${pct(mount)}</b></span><span>${t('calculator.total')} <b>${pct(total)}</b></span></span>`:''}</span>`;}).join('')}</div>`;
}
export function bindStageGrowthTips(host){
 const cells=[...host.querySelectorAll('.calc-rate-cell')].filter(cell=>cell.querySelector('[data-calc-tip]')),intents=new Map();
 const hide=cell=>{intents.get(cell)?.cancel();cell.dataset.pinned='';cell.querySelector('[role=tooltip]').hidden=true;cell.querySelector('button').setAttribute('aria-expanded','false');};
 const show=cell=>{cells.forEach(other=>{if(other!==cell)hide(other);});const tip=cell.querySelector('[role=tooltip]');tip.hidden=false;tip.classList.remove('calc-tip-above');const bounds=tip.getBoundingClientRect();if(bounds.bottom>innerHeight-8&&cell.getBoundingClientRect().top>bounds.height+8)tip.classList.add('calc-tip-above');cell.querySelector('button').setAttribute('aria-expanded','true');};
 cells.forEach(cell=>{const button=cell.querySelector('button'),intent=delayedHover(()=>show(cell));intents.set(cell,intent);cell.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')intent.enter();});cell.addEventListener('pointerleave',()=>{intent.cancel();if(!cell.dataset.pinned&&!cell.contains(document.activeElement))hide(cell);});button.addEventListener('focus',()=>{intent.cancel();show(cell);});button.addEventListener('blur',()=>hide(cell));button.addEventListener('click',()=>{intent.cancel();const pin=cell.dataset.pinned!=='true';if(pin){show(cell);cell.dataset.pinned='true';}else hide(cell);});button.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();hide(cell);}});});
 const outside=event=>cells.forEach(cell=>{if(!cell.contains(event.target))hide(cell);});document.addEventListener('pointerdown',outside);
 return ()=>{intents.forEach(intent=>intent.cancel());document.removeEventListener('pointerdown',outside);};
}
