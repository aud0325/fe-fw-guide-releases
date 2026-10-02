import {messages} from './messages.mjs';
import {displayTerms} from './display-terms.mjs';
export {messages,messageGroups} from './messages.mjs';
export const supportedLocales=['ko','en'];
export const fallbackLocale='en';
export function normalizeLocale(locale){return supportedLocales.includes(locale)?locale:fallbackLocale;}

// Source-backed bilingual records keep their original values and English fallback.
export function localized(value,locale=fallbackLocale){
 if(value==null)return '';
 if(typeof value!=='object')return String(value);
 const lang=normalizeLocale(locale),selected=value[lang];
 const result=typeof selected==='string'&&selected.trim()?selected:value.en||'';
 return displayTerms[result]?.[lang]||displayTerms[result]?.en||result;
}
export function formatMessage(template,params={}){
 return template.replace(/\{([a-zA-Z][\w]*)\}/g,(_,key)=>{
  if(!Object.hasOwn(params,key))throw new Error('Missing translation parameter: '+key);
  return String(params[key]);
 });
}
export function translate(key,locale=fallbackLocale,params={}){
 if(!Object.hasOwn(messages,key))throw new Error('Unknown translation key: '+key);
 return formatMessage(localized(messages[key],locale),params);
}
export function createTranslator(locale){
 const lang=normalizeLocale(locale);
 // Two string arguments remain supported for bilingual source data and labels.
 const t=(key,params)=>typeof params==='string'?localized({ko:key,en:params},lang):translate(key,lang,params);
 t.locale=lang;
 return t;
}
