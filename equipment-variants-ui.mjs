import {escapeHtml as esc} from './core.mjs';
import {pagePath} from './routing.mjs';
export function equipmentVariantDetails(entry,{t,entries,base=''}){
 if(entry.equipmentFamilyId){
  const family=entries.find(item=>item.id===entry.equipmentFamilyId);
  return family?`<p class="equipment-family-link"><a href="${esc(pagePath({id:family.id},t.locale,base)+'#equipment-variant-charm')}">${t('equipment-variants.compare-family')}</a></p>`:'';
 }
 if(!entry.equipmentVariants?.length)return '';
 const rowHtml=row=>{
  const target=row.itemId&&entries.find(entry=>entry.id===row.itemId),name=esc(t(row.name.ko,row.name.en));
  return `<tr id="equipment-variant-${esc(row.key)}"><th scope="row">${target?`<a href="${esc(pagePath({id:target.id},t.locale,base))}">${name}</a>`:name}</th><td>${row.weight==null?t('equipment-variants.unknown'):esc(row.weight)}</td><td>${row.effect?esc(t(row.effect.ko,row.effect.en)):t('equipment-variants.unknown')}</td></tr>`;
 };
 const stages=entry.equipmentVariants.filter(row=>row.level!=null),related=entry.equipmentVariants.filter(row=>row.itemId);
 return `<section class="equipment-variants" id="section-equipment-variants" tabindex="-1"><h2 id="equipment-variants-title">${t('equipment-variants.title')}</h2><div class="table-wrap"><table aria-labelledby="equipment-variants-title"><thead><tr><th scope="col">${t('equipment-variants.item')}</th><th scope="col">${t('equipment-variants.weight')}</th><th scope="col">${t('equipment-variants.effect')}</th></tr></thead><tbody>${stages.map(rowHtml).join('')}</tbody>${related.length?`<tbody><tr class="equipment-related-heading"><th scope="rowgroup" colspan="3">${t('equipment-variants.related')}</th></tr>${related.map(rowHtml).join('')}</tbody>`:''}</table></div></section>`;
}
