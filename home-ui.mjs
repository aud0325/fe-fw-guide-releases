import {navigationGroups,types} from './locales/labels.mjs';
import {localized} from './locales/index.mjs';
import {pagePath} from './routing.mjs';
import {escapeHtml as esc} from './core.mjs';
import {feedbackLink} from './feedback.mjs';
import {icon} from './icons.mjs';
export const communityUrl='https://gall.dcinside.com/mgallery/board/lists/?id=fireemblem';
export function homePage({t,lang,base='/'}){
 const label=type=>types[type][lang==='ko'?0:1];
 return `<article class="home-hub"><h1 class="sr-only">${t('app.fortune-s-weave-encyclopedia')}</h1><nav class="home-directory home-directory-groups" aria-label="${t('browse.home-directory')}">${navigationGroups.map(group=>`<section class="home-directory-group"><h2>${esc(localized(group.label,lang))}</h2>${group.types.map(type=>`<a href="${esc(pagePath({type},lang,base))}">${icon(type==='calculator'?'class':type)}<div><strong>${esc(label(type))}</strong><p>${t('home.description-'+type)}</p></div></a>`).join('')}</section>`).join('')}</nav><div class="home-community"><span>${t('home.community-label')}</span><a href="${communityUrl}" target="_blank" rel="noopener noreferrer">${t('home.community-link')}${icon('external')}</a>${feedbackLink(lang)}</div></article>`;
}
