import {escapeHtml as esc} from './core.mjs';
import {birdActions} from './bird-actions.mjs';
export function characterBirdDialogue(e,{t}){
 if(!e.birdConversations?.length)return '';
 const rows=e.birdConversations.map(row=>{
  const action=birdActions[row.actionId],answer=action?`<span>${esc(t(action.ko,action.en))}</span>${t.locale==='ko'?`<small lang="en">${esc(action.en)}</small>`:''}`:`<span class="result-label">${t('social.bird-unknown')}</span>`;
  return `<tr id="${esc(row.id)}" tabindex="-1"><th scope="row">${esc(t(row.clue.ko,row.clue.en))}</th><td>${answer}</td></tr>`;
 }).join('');
 return `<section id="section-bird-dialogue" class="social-section bird-dialogue" tabindex="-1"><h2>${t('social.bird-title')}</h2><details><summary>${t('social.bird-open')}</summary><p class="result-label">${t('social.bird-help')}</p><table class="bird-dialogue-table"><thead><tr><th scope="col">${t('social.bird-clue')}</th><th scope="col">${t('social.bird-response')}</th></tr></thead><tbody>${rows}</tbody></table></details></section>`;
}
