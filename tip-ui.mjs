import {escapeHtml as esc} from './core.mjs';
import {sourceHint} from './presentation.mjs';
export function tipGuide(e,{t,tx,sectionHref,sourceTitle=id=>id}){
 if(!e.guideSections?.length)return '';
 const paragraphs=list=>(list||[]).map(value=>`<p>${esc(tx(value))}</p>`).join('');
 const listing=(tag,list)=>list?.length?`<${tag}>${list.map(value=>`<li>${esc(tx(value))}</li>`).join('')}</${tag}>`:'';
 const table=value=>value?`<div class="table-wrap"><table><thead><tr>${value.headers.map(x=>`<th scope="col">${esc(tx(x))}</th>`).join('')}</tr></thead><tbody>${value.rows.map(row=>`<tr>${row.map((x,i)=>`<${i?'td data-label="'+esc(tx(value.headers[i]))+'"':'th scope="row"'}>${esc(tx(x))}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
 return `<div class="tip-guide"><nav class="tip-contents" aria-label="${t('tip.contents')}"><strong>${t('tip.contents')}</strong><ol>${e.guideSections.map((s,i)=>`<li><a href="${esc(sectionHref('guide-'+(i+1)))}">${esc(tx(s.title))}${s.spoiler?' · '+t('tip.spoiler'):''}</a></li>`).join('')}</ol></nav>${e.guideSections.map((s,i)=>{
  const hints=s.sourceIds.map(id=>sourceHint({href:'#source-'+id,tooltip:sourceTitle(id),label:t('tip.section-sources')})).join('');
  const body=paragraphs(s.paragraphs)+listing('ol',s.steps)+listing('ul',s.bullets)+table(s.table);
  return s.spoiler?`<details class="tip-section" id="guide-${i+1}"><summary>${esc(tx(s.title))} · ${t('tip.spoiler')}</summary>${hints?`<div class="tip-evidence">${hints}</div>`:''}${body}</details>`:`<section class="tip-section" id="guide-${i+1}" tabindex="-1"><h2>${esc(tx(s.title))} ${hints}</h2>${body}</section>`;
 }).join('')}</div>`;
}
