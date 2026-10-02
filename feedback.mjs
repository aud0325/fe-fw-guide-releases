import {createTranslator} from './locales/index.mjs';
import {escapeHtml as esc} from './core.mjs';
export function feedbackLink(lang='ko'){
 const t=createTranslator(lang),en=lang==='en',id=en?'1FAIpQLSfdP47LcPChfTHRnLNptPTCZJIs4r5DENfUuu8BMXgubPKV8A':'1FAIpQLSdWZMoEP41kMrm00YTUUTtqm1ZTmV7UL1phn9tJVKYgzzV74g';
 return `<a class="feedback-link" href="https://docs.google.com/forms/d/e/${id}/viewform?hl=${en?'en':'ko'}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('feedback.label'))}">${esc(t('feedback.title'))}</a>`;
}
