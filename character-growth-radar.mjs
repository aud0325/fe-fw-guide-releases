import {characterGrowthValues} from './growth-rates.mjs';
import {escapeHtml as esc} from './core.mjs';
import {statLabels} from './locales/labels.mjs';
// Reviewed base-growth maxima of the playable comparison roster. Skills never change these axes.
export const characterGrowthRadarMaximums=Object.freeze({hp:70,str:60,mag:55,spd:65,dex:60,def:60,res:60,lck:60,cha:60});
const point=(index,radius)=>{const angle=(-90+index*40)*Math.PI/180;return [180+radius*Math.cos(angle),180+radius*Math.sin(angle)];};
const coords=(index,radius)=>point(index,radius).map(value=>value.toFixed(2)).join(',');
const radius=(key,value)=>110*Math.max(0,Math.min(1,value/characterGrowthRadarMaximums[key]));
export function characterGrowthTextLevel(value,baseline){
 if(!Number.isFinite(value)||!Number.isFinite(baseline?.mean)||value<=baseline.mean)return 0;
 if(!Number.isFinite(baseline.sd)||baseline.sd<=0)return 0;
 const distance=(value-baseline.mean)/baseline.sd;
 return distance>=2?3:distance>=1?2:0;
}
export function characterGrowthRadar(entry,{t,growthSkill=false,stats}){
 const rates=characterGrowthValues(entry,growthSkill);
 if(!rates||statLabels.some(([key])=>!Number.isFinite(rates[key])))return '';
 const skill=entry.id==='mu'?t('growth.signsIncluded')+' · ':'',title=t('character.personal-growth-chart'),range=t('character.growth-radar-range'),id='character-growth-radar-'+entry.id;
 const maximum=key=>t('character.growth-radar-maximum',{value:characterGrowthRadarMaximums[key]});
 const levels=Object.fromEntries(statLabels.map(([key])=>[key,characterGrowthTextLevel(rates[key],stats?.[key])]));
 const aboveAverage=key=>levels[key]>0;
 const assessment=key=>aboveAverage(key)?' · '+t(levels[key]===3?'character.growth-radar-very-high':'character.growth-radar-high'):'';
 const description=statLabels.map(([key,ko,en])=>t(ko,en)+' '+rates[key]+'% · '+maximum(key)+assessment(key)).join(', ');
 const rings=[.25,.5,.75,1].map(part=>`<polygon class="character-radar-ring" points="${statLabels.map((_,i)=>coords(i,110*part)).join(' ')}"/>`).join('');
 const axes=statLabels.map(([key,ko,en],i)=>{const [x,y]=point(i,147),[endX,endY]=point(i,110);return `<line class="character-radar-axis" x1="180" y1="180" x2="${endX.toFixed(2)}" y2="${endY.toFixed(2)}"/><text class="character-radar-label" x="${x.toFixed(2)}" y="${(y-5).toFixed(2)}" text-anchor="middle" dominant-baseline="middle">${t(ko,en)}<tspan class="character-radar-rate${aboveAverage(key)?' character-radar-above-average character-radar-level-'+levels[key]:''}" x="${x.toFixed(2)}" dy="18">${rates[key]}%</tspan></text>`;}).join('');
 const values=statLabels.map(([key],i)=>coords(i,radius(key,rates[key]))).join(' ');
 const dots=statLabels.map(([key,ko,en],i)=>{const [x,y]=point(i,radius(key,rates[key]));return `<circle class="character-radar-point" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.8"><title>${t(ko,en)} ${rates[key]}% · ${maximum(key)}${assessment(key)}</title></circle>`;}).join('');
 return `<figure class="character-growth-radar"><figcaption><span>${title}</span></figcaption><svg viewBox="0 0 360 360" role="img" aria-labelledby="${esc(id)}"><title id="${esc(id)}">${title} · ${skill}${range} · ${esc(description)}</title>${rings}${axes}<polygon class="character-radar-value" points="${values}"/>${dots}<text class="character-radar-tick" x="185" y="184">0</text></svg><p class="character-growth-radar-note">${range}</p></figure>`;
}
