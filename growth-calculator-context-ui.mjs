export function equipmentContextText(record,context,{t,lang}){
 const weapon=record?.state?.weapon||record?.context?.weapon;
 return [context.className?.[lang]||context.className?.en,context.mountName?.[lang]||context.mountName?.en,context.characterId==='mu'&&weapon&&weapon!=='none'?t('calculator.weapon.'+weapon):'',context.battalionName?.[lang]||context.battalionName?.en].filter(Boolean).join(' · ');
}
