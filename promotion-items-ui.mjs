import {escapeHtml as esc} from './core.mjs';
import {classToken} from './catalog-overview.mjs';
export function promotionItemDetails(e,{t,name,href,entries,base='/'}){
 if(e.promotionItems?.length){
  const first=e.promotionItems[0];
  return `<section class="item-promotion-details" id="section-promotion-items"><h2>${t('promotion.items')}</h2><details class="location-supply-later"><summary>${t('promotion.part3')}</summary><p>${t('promotion.common',{level:first.minimumLevel})}</p><div class="table-wrap economy-trade-table"><table><colgroup><col class="economy-item-column"><col></colgroup><thead><tr><th scope="col">${t('promotion.item')}</th><th scope="col">${t('promotion.class-room')}</th></tr></thead><tbody>${e.promotionItems.map(p=>{const item=entries.find(e=>e.id===p.itemId),cls=entries.find(e=>e.id===p.classId);return `<tr><th scope="row"><a href="${esc(href(item.id))}">${esc(name(item))}</a></th><td>${classToken(cls,t.locale,base)}<div>${esc(t(p.room.ko,p.room.en))}</div></td></tr>`;}).join('')}</tbody></table></div></details></section>`;
 }
 if(!e.promotionUse)return '';
 const p=e.promotionUse,cls=entries.find(e=>e.id===p.classId);if(!cls)return '';
 const requirements=[t(p.concurrentLimit===1?'promotion.common':'promotion.level',{level:p.minimumLevel}),...(p.conditions||[]).map(c=>esc(t(c.ko,c.en)))];
 return `<section class="item-promotion-details"><h2>${t('promotion.enabled-class')}</h2><div class="table-wrap economy-trade-table"><table><thead><tr><th scope="col">${t('promotion.class')}</th><th scope="col">${t('promotion.requirements')}</th></tr></thead><tbody><tr><th scope="row">${classToken(cls,t.locale,base)}</th><td>${requirements.join('<br>')}</td></tr></tbody></table></div></section>`;
}
