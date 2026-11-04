import {calculatorClasses,calculatorMounts,calculatorBattalions} from './growth-calculator-data.mjs';
import {calculatorWeapons} from './growth-calculator-state.mjs';
import {manualEquipmentContext,manualMetadata} from './growth-calculator-records.mjs';
import {escapeHtml as esc} from './core.mjs';
export function contextMountOptions(context,characterId,{t,lang}){
 const cls=calculatorClasses.find(c=>c.id===context?.classId),mounts=['goliath','orchel'].includes(characterId)?[]:calculatorMounts.filter(m=>m.type===cls?.mountType);
 return `<option value="">${t('calculator.noMount')}</option>`+mounts.map(m=>`<option value="${m.id}"${m.id===context?.mountId?' selected':''}>${esc(m.name[lang]||m.name.en)}</option>`).join('');
}
export function manualContextHtml(state,{t,lang}){
 const context=manualEquipmentContext(state),meta=manualMetadata(state),field=(id,text,options)=>`<label class="calc-field" for="${id}">${text}<select id="${id}" data-calc-context>${options}</select></label>`;
 return `<details class="calc-manual-context"><summary>${t('calculator.contextTitle')}</summary><div>${field('calc-context-class',t('calculator.class'),'<option value="" disabled>—</option>'+calculatorClasses.map(c=>`<option value="${c.id}"${c.id===context?.classId?' selected':''}>${esc(c.name[lang]||c.name.en)}</option>`).join(''))}${field('calc-context-mount',t('calculator.mount'),contextMountOptions(context,meta.characterId,{t,lang}))}${meta.characterId==='mu'?field('calc-context-weapon',t('calculator.muWeapon'),calculatorWeapons.map(w=>`<option value="${w}"${w===(context?.weapon||'none')?' selected':''}>${t('calculator.weapon.'+w)}</option>`).join('')):''}${field('calc-context-battalion',t('calculator.battalionContext'),'<option value="">'+t('calculator.noBattalion')+'</option>'+calculatorBattalions.map(b=>`<option value="${b.id}"${b.id===context?.battalionId?' selected':''}>${esc(b.name[lang]||b.name.en)}</option>`).join(''))}</div><button type="button" data-calc-confirm-context>${t('calculator.confirmContext')}</button></details>`;
}
