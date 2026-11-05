import {escapeHtml as esc} from './core.mjs';
import {statLabels} from './locales/labels.mjs';
import {calculatorKeys as keys,calculatorWeapons} from './growth-calculator-state.mjs';
import {calculatorBattalions} from './growth-calculator-data.mjs';
import {currentEquipment,recordEquipment,muWeaponBonuses} from './growth-calculator-equipment.mjs';
import {calculatorPicker} from './growth-calculator-picker.mjs';
import {bonusText} from './growth-calculator-stat-ui.mjs';
const label=(key,lang)=>statLabels.find(s=>s[0]===key)[lang==='en'?2:1];
const valueText=value=>Number.isFinite(value)?bonusText(value)||'0':'—';
const removeIcon='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></svg>';
export function fixedStatsText(values,lang){
 return keys.filter(k=>Number.isFinite(values?.[k])&&values[k]!==0).map(k=>label(k,lang)+' '+bonusText(values[k])).join(' · ');
}
export function finalStageIndex(state){
 const context=currentEquipment(state),stages=state.builds[0].stages;
 if(!context||!Number.isInteger(state.target))return -1;
 return stages.reduce((best,s,i)=>Number.isFinite(s.level)&&s.level<=state.target&&(best<0||s.level>=stages[best].level)?i:best,-1);
}
export function finalClassBonusHtml(state,index,{t,lang}){
 if(index!==finalStageIndex(state))return '';
 const equipment=recordEquipment({state}),cls=equipment.cls;
 if(!cls)return '';
 const bonuses=`<div class="calc-stage-bonuses" role="group" aria-label="${t('calculator.finalClassBonus')}">${keys.map(k=>`<span class="${cls.modifiers[k]<0?'calc-stage-bonus-negative':''}" data-calc-class-bonus="${k}" aria-label="${esc(label(k,lang)+' '+t('calculator.finalClassBonus')+' '+valueText(cls.modifiers[k]))}" title="${esc(label(k,lang)+' · '+t('calculator.finalClassBonus'))}">${valueText(cls.modifiers[k])}</span>`).join('')}</div>`;
 const mount=equipment.context.mountId?Object.fromEntries(keys.map(k=>[k,Number.isFinite(equipment.animal?.[k])?equipment.animal[k]*equipment.multiplier:null])):null;
 return bonuses+(mount?`<div class="calc-stage-fixed"><span>${t('calculator.finalMountBonus')}</span><strong>${esc(fixedStatsText(mount,lang)||(keys.every(k=>Number.isFinite(mount[k]))?'0':'—'))}</strong></div>`:'');
}
export function finalEffectText(state,key,{t,lang}){
 const equipment=recordEquipment({state});
 if(key==='weapon')return fixedStatsText(muWeaponBonuses(state.target,state.weapon),lang)||t('calculator.noStatBonus');
 if(key==='battalion')return equipment.cls?.mountType!=='No'?t('calculator.battalionInfantry'):fixedStatsText(equipment.battalion.values,lang)||'';
 const values=Object.fromEntries(keys.map(k=>[k,(equipment.character.core[k]||0)+(equipment.character.personal[k]||0)]));
 return fixedStatsText(values,lang);
}
function modifierStatsHtml(values,{lang}){
 return `<div class="calc-modifier-stats">${keys.map(k=>`<span data-calc-final-stat="${k}" class="${values[k]>0?'calc-modifier-up':values[k]<0?'calc-modifier-down':''}"><small>${label(k,lang)}</small><strong>${valueText(values[k])}</strong></span>`).join('')}</div>`;
}
export function finalEffectHtml(state,key,ctx){
 const equipment=recordEquipment({state}),values=key==='weapon'?muWeaponBonuses(state.target,state.weapon):key==='battalion'?equipment.battalion.values:key==='origin'?equipment.character.core:key==='personal'?equipment.character.personal:Object.fromEntries(keys.map(k=>[k,(equipment.character.core[k]||0)+(equipment.character.personal[k]||0)]));
 return modifierStatsHtml(values,ctx);
}
export function warriorBloodTitle(state,{t}){return t(state.target>=35?'calculator.warriorBloodPlus':'calculator.warriorBlood');}
export function warriorBloodLevel(state,{t}){return !Number.isInteger(state.target)?'—':t(state.target<20?'calculator.bloodInactive':state.target<35?'calculator.bloodBaseRange':'calculator.bloodPlusRange');}
export function warriorBloodThresholds(state,{t,lang}){
 return [[20,'calculator.bloodBaseRange'],[35,'calculator.bloodPlusRange']].map(([level,key])=>`<span${state.target>=level&&(level===35||state.target<35)?' class="calc-blood-active"':''}>${t(key)}: ${esc(fixedStatsText(muWeaponBonuses(level,state.weapon),lang)||'0')}</span>`).join('');
}
export function battalionConditionText(state,{t}){return recordEquipment({state}).cls?.mountType!=='No'?t('calculator.battalionInfantry'):'';}
export function battalionPickerItems({t,lang},battalions=calculatorBattalions){
 const kinds=['physical','magical','defense','support'],kind=b=>{const i=kinds.indexOf(b.category);return i<0?kinds.length:i;},rank=b=>{const i='EDCBA'.indexOf(b.battalion.rank||'?');return i<0?5:i;};
 const sorted=[...battalions].sort((a,b)=>kind(a)-kind(b)||rank(a)-rank(b));
 return [{id:'',name:{ko:t('calculator.selectBattalion'),en:t('calculator.selectBattalion')}},...sorted.map(b=>({...b,pickerGroup:t('battalion.'+b.category),pickerGroupKey:b.category,aliases:[...(b.aliases||[]),b.category,t('battalion.'+b.category)],pickerDetail:(b.battalion.rank||'—')+' · '+Object.entries(b.battalion.bonuses).map(([k,v])=>label(k.toLowerCase(),lang)+' '+bonusText(v)).join(' · ')}))];
}
export function finalOptionsHtml(state,{t,lang,base='/'}){
 const effect=key=>`<div data-calc-final-effect="${key}">${finalEffectHtml(state,key,{t,lang})}</div>`;
 const items=battalionPickerItems({t,lang});
 const character=recordEquipment({state}).character,hasCore=keys.some(k=>character.core[k]!==0),hasPersonal=keys.some(k=>character.personal[k]!==0),originName=character.origin?.name||character.names[0],hasBattalion=state.battalionAdded||!!state.battalionId;
 return `<div class="calc-final-options" aria-label="${t('calculator.finalOptions')}">${hasBattalion?`<div class="calc-modifier-row" data-calc-modifier-kind="battalion"><div class="calc-modifier-header">${calculatorPicker({id:'calc-battalion',label:t('calculator.battalion'),groupJumpLabel:t('calculator.battalionTypeJump'),items,value:state.battalionId||'',lang,base,t})}<small data-calc-battalion-condition>${battalionConditionText(state,{t})}</small><button type="button" class="calc-delete calc-remove-modifier" data-calc-clear-battalion aria-label="${t('calculator.removeBattalion')}">${removeIcon}</button></div>${effect('battalion')}</div>`:''}${state.characterId==='mu'?`<div class="calc-modifier-row" data-calc-modifier-kind="weapon"><div class="calc-modifier-header calc-blood-header"><div><strong data-calc-blood-title>${warriorBloodTitle(state,{t})}</strong><small data-calc-blood-level>${warriorBloodLevel(state,{t})}</small></div><label class="calc-blood-weapon" for="calc-mu-weapon"><span>${t('calculator.muWeapon')}</span><select id="calc-mu-weapon">${calculatorWeapons.map(w=>`<option value="${w}"${state.weapon===w?' selected':''}>${t('calculator.weapon.'+w)}</option>`).join('')}</select></label></div>${effect('weapon')}<div class="calc-blood-thresholds" data-calc-blood-thresholds>${warriorBloodThresholds(state,{t,lang})}</div></div>`:''}${hasCore?`<div class="calc-modifier-row" data-calc-modifier-kind="origin"><div class="calc-modifier-header"><strong>${t('character.origin')} · ${esc(originName?.[lang]||originName?.en||'')}</strong></div>${effect('origin')}</div>`:''}${hasPersonal?`<div class="calc-modifier-row" data-calc-modifier-kind="personal"><div class="calc-modifier-header"><strong>${esc(character.personalName?.[lang]||character.personalName?.en||t('calculator.corePersonal'))}</strong></div>${effect('personal')}</div>`:''}</div>`;
}
