import {statLabels} from './locales/labels.mjs';
import {escapeHtml as esc} from './core.mjs';
import {informationHint} from './presentation.mjs';
import {growthCellStyle} from './growth-comparison.mjs';
const categories={馬:['말','Horse'],飛駝:['비약 타조','Ornius'],天馬:['천마','Pegasus'],飛竜:['드래곤','Dragon']};
export function mountCategory(e,t){
 const category=categories[e.mountDetails?.category];
 const fallback=e.facts?.find(f=>f.key==='namu-category')?.value||(e.id==='ornius'?'비약 타조':'');
 return category?t(...category):fallback?t(fallback,{'말':'Horse','천마':'Pegasus','드래곤':'Dragon','코끼리':'Elephant','비약 타조':'Ornius'}[fallback]||fallback):'';
}
export function mountBonusDetails(e,{t,tx}){
 const details=e.mountDetails,text=value=>typeof value==='object'?tx(value):value;
 const fallback=e.facts?.find(f=>f.key==='namu-stats')||e.facts?.find(f=>f.key==='mount-stats-ko');
 const fallbackText=fallback?text(fallback.value):'';
 const fallbackValues=Object.fromEntries(statLabels.flatMap(([key,ko,en])=>{
  const match=fallbackText.match(new RegExp(`(?:${ko}|${en})\\s*([+-]?\\d+)`,'i'));
  return match?[[key,Number(match[1])]]:[];
 }));
 const rows=[];
 const modifiers=details?.modifiers?.values||(Object.keys(fallbackValues).length?fallbackValues:null);
 if(modifiers)rows.push({label:t('mount.stat-bonuses'),values:modifiers});
 if(details?.growth)rows.push({label:t('mount.growth-row'),values:details.growth.values,growth:true});
 if(!rows.length)return fallbackText?`<section class="mount-bonuses"><h2>${t('mount.bonuses')}</h2><p>${esc(fallbackText)}</p></section>`:'';
 const headings=()=>statLabels.map(([,ko,en])=>`<th scope="col">${esc(t(ko,en))}</th>`).join('');
 const values=row=>statLabels.map(([key])=>{
  const value=row.values[key],style=row.growth?growthCellStyle(value,key,null,{growthTab:'mount'}):'';
  return `<td class="growth-value" data-growth-stat="${key}"${style?` style="${style}"`:''}>${Number.isFinite(value)?(value>0?'+':'')+value:'—'}</td>`;
 }).join('');
 const grid=`<div class="character-stats mount-stats"><div class="table-wrap stats-wide"><table><thead><tr><th scope="col">${t('character.context')}</th>${headings()}</tr></thead><tbody>${rows.map(row=>`<tr><th scope="row">${esc(row.label)}</th>${values(row)}</tr>`).join('')}</tbody></table></div><div class="stats-narrow">${rows.map(row=>`<table><caption>${esc(row.label)}</caption><thead><tr>${headings()}</tr></thead><tbody><tr>${values(row)}</tr></tbody></table>`).join('')}</div></div>`;
 return `<section class="mount-bonuses"><h2>${t('mount.bonuses')}</h2>${details?.modifiers?`<p class="result-label">${t('mount.maximum-bonuses')}</p>`:''}${details?.growth?.condition?`<p class="result-label">${esc(tx(details.growth.condition))}</p>`:''}${grid}${fallbackText&&!modifiers?`<p>${esc(fallbackText)}</p>`:''}${details?.growth?`<p><a class="entry-map-link" href="#category/growth/mount">${t('mount.compare')}</a></p>`:''}</section>`;
}
export function mountSkillDetails(e,{t,tx}){
 const text=value=>typeof value==='object'||t.locale==='en'?tx(value):value;
 const full=(e.facts||[]).filter(f=>/^namu-skill-/.test(f.key));
 const observed=e.facts?.find(f=>f.key==='mount-skills-ko');
 if(!full.length&&!observed)return '';
 const skills=full.length?full.map(f=>text(f.value)):[text(observed.value).replace(/\s*\+\s*사진은[\s\S]*$/,'').trim()];
 const help=full.length?t('mount.skill-levels'):t('mount.observed-skills');
 return `<section class="mount-skills"><h2>${t('mount.skills')} ${informationHint(help,t('mount.skills')+' · '+t('presentation.information'))}</h2><ul>${skills.map(value=>`<li${t.locale==='en'&&/[가-힣]/.test(value)?' lang="ko"':''}>${esc(value)}</li>`).join('')}</ul></section>`;
}
