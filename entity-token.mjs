import {escapeHtml as esc} from './core.mjs';
// A real anchor remains usable without JavaScript and with modifier/middle clicks.
export function entityToken({id,label,kind='skill',href,icon=null,className='',title='',ariaLabel='',inline=false,attributes={}}){
 const classes=['entity-token','entity-token-'+kind,!icon?'entity-token-text':'',inline?'entity-token-inline':'',className].filter(Boolean).join(' ');
 const attrs=Object.entries(attributes).map(([key,value])=>` ${key}="${esc(value)}"`).join('');
 return `<a class="${esc(classes)}" href="${esc(href)}" data-entity-id="${esc(id)}" data-entity-kind="${esc(kind)}" aria-haspopup="dialog"${title?` title="${esc(title)}"`:''}${ariaLabel?` aria-label="${esc(ariaLabel)}"`:''}${attrs}>${icon?`<img class="entity-token-icon" src="${esc(icon.src)}" alt="" width="20" height="20" loading="lazy" decoding="async">`:''}<span class="entity-token-label">${esc(label)}</span></a>`;
}
