import {escapeHtml as esc} from './core.mjs';
import {recordStatBreakdowns,statBreakdownPayload} from './growth-calculator-stat-bonuses.mjs';
import {statBonusButton} from './growth-calculator-stat-ui.mjs';
import {statLabels} from './locales/labels.mjs';
const label=(key,lang)=>statLabels.find(s=>s[0]===key)[lang==='en'?2:1];
export const percentileText=score=>score===null?'—':score<.1?'<0.1%':score>99.9?'>99.9%':score.toFixed(1)+'%';
const point=(index,radius)=>{const angle=(-90+index*40)*Math.PI/180;return [180+radius*Math.cos(angle),180+radius*Math.sin(angle)];};
const coords=(index,radius)=>point(index,radius).map(v=>v.toFixed(2)).join(',');
const signed=value=>{const rounded=Number(value.toFixed(2));return (rounded>0?'+':'')+rounded.toFixed(2);};
export function growthRating(score){
 if(!Number.isFinite(score))return '';
 return score<=25+1e-9?'poor':score<=50+1e-9?'below':score<=70+1e-9?'above':score<=85+1e-9?'great':'best';
}
export const rankTone=score=>!Number.isFinite(score)||Math.abs(score-50)<1e-9?'middle':score>50?'upper':'lower';
export function relativeRank(score,{t}){
 if(!Number.isFinite(score))return '—';
 if(Math.abs(score-50)<1e-9)return t('calculator.rankMiddle');
 return t(score>50?'calculator.rankUpper':'calculator.rankLower',{value:percentileText(score>50?100-score:score)});
}
const statNumber=value=>Number.isFinite(value)?String(value):'—';
const statDelta=row=>Number.isFinite(row.value)&&Number.isFinite(row.expected)?row.value-row.expected:null;
const deltaNumber=value=>Number.isFinite(value)?(value>0?'+':'')+value:'—';
const deltaTone=row=>statDelta(row)>0?'calc-value-up':statDelta(row)<0?'calc-value-down':'';
export function growthRadarSvg(rows,{t,lang,scales=null,labels}){
 const valid=scales&&[scales.hp,scales.other].every(n=>Number.isFinite(n)&&n>0),maximum=row=>row.key==='hp'?scales?.hp:scales?.other;
 const radius=(row,value)=>valid?110*Math.max(0,Math.min(1,value/maximum(row))):0;
 const names=labels||{reference:t('calculator.expectedStats'),target:t('calculator.enteredStats')};
 const description=rows.map(r=>label(r.key,lang)+' · '+names.target+' '+statNumber(r.value)+' / '+names.reference+' '+statNumber(r.expected)).join(', ');
 const rings=[.25,.5,.75,1].map(part=>`<polygon class="calc-radar-ring" points="${rows.map((_,i)=>coords(i,110*part)).join(' ')}"></polygon>`).join('');
 const axes=rows.map((row,i)=>{const [x,y]=point(i,145);return `<line x1="180" y1="180" x2="${point(i,110)[0]}" y2="${point(i,110)[1]}" class="calc-radar-axis"></line><text x="${x.toFixed(2)}" y="${(y-5).toFixed(2)}" text-anchor="middle" dominant-baseline="middle" class="calc-radar-label">${label(row.key,lang)}<tspan x="${x.toFixed(2)}" dy="16" class="calc-radar-stat ${deltaTone(row)}">${statNumber(row.value)}${Number.isFinite(statDelta(row))&&statDelta(row)!==0?` (${deltaNumber(statDelta(row))})`: ""}</tspan></text>`;}).join('');
 const shape=(field,cls)=>!valid?'':rows.every(r=>Number.isFinite(r[field]))?`<polygon class="${cls}" points="${rows.map((r,i)=>coords(i,radius(r,r[field]))).join(' ')}"></polygon>`:rows.map((row,i)=>{const next=rows[(i+1)%rows.length];if(!Number.isFinite(row[field])||!Number.isFinite(next[field]))return '';const a=point(i,radius(row,row[field])),b=point((i+1)%rows.length,radius(next,next[field]));return `<line class="${cls}-line" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"></line>`;}).join('');
 const clipped=rows.some(row=>valid&&['value','expected'].some(field=>row[field]>maximum(row)));
 const dots=rows.map((row,i)=>!valid||!Number.isFinite(row.value)?'':`<circle class="calc-radar-dot${deltaTone(row)?' '+deltaTone(row):''}${row.value>maximum(row)?' calc-radar-clipped':''}" data-calc-radar-stat="${row.key}" cx="${point(i,radius(row,row.value))[0]}" cy="${point(i,radius(row,row.value))[1]}" r="${row.value>maximum(row)?4:3}"><title>${esc(label(row.key,lang)+' '+row.value+' · '+names.target+' · '+t('calculator.statDifferenceDescription',{reference:names.reference,difference:deltaNumber(statDelta(row))})+(row.value>maximum(row)?' · '+t('calculator.graphClipped'):''))}</title></circle>`).join('');
 const ticks=[.5,1].map(part=>`<text x="187" y="${180-110*part-4}" class="calc-radar-scale">${valid?Number((scales.hp*part).toFixed(1)):'—'}</text>`).join('');
 const scaleText=t('calculator.graphScales',{hp:valid?scales.hp:'—',other:valid?scales.other:'—'});
 return `<svg viewBox="0 0 360 360" role="img" aria-labelledby="calc-radar-title calc-radar-desc" data-calc-radar-hp-maximum="${valid?scales.hp:0}" data-calc-radar-other-maximum="${valid?scales.other:0}"><title id="calc-radar-title">${t('calculator.radarTitle')}</title><desc id="calc-radar-desc">${esc(description+' · '+scaleText+(clipped?' · '+t('calculator.graphClipped'):''))}</desc>${rings}${axes}${shape('expected','calc-radar-reference')}${shape('value','calc-radar-value')}${dots}${ticks}</svg>`;
}
export function growthPercentileChart(rows,{t,lang,labels}){
 const names=labels||{reference:t('calculator.expectedStats'),target:t('calculator.enteredStats')};
 return `<div class="calc-growth-chart"><div class="calc-growth-columns" aria-hidden="true"><span class="calc-growth-stat"><span>${t('calculator.statColumn')}</span><span>${t('calculator.valueColumn')}</span><span>${t('calculator.deltaColumn')}</span></span><span class="calc-growth-axis"><span>0</span><span>50</span><span>100</span></span><span class="calc-growth-percent-heading">${t('calculator.percentileColumn')}</span></div><ol class="calc-growth-rows" aria-label="${t('calculator.growthChartTitle')}">${rows.map(row=>{
  const valid=row.status==='ok'&&Number.isFinite(row.score),score=valid?Math.max(0,Math.min(100,row.score)):null;
  const text=row.bonusUnknown?t('calculator.bonusUnknown'):row.status==='fixed'||row.status==='outside'?t('calculator.percentile.'+row.status):relativeRank(score,{t});
  const tone=rankTone(score),difference=statDelta(row),description=label(row.key,lang)+' · '+names.target+' '+statNumber(row.value)+' · '+t('calculator.statDifferenceDescription',{reference:names.reference,difference:deltaNumber(difference)})+' · '+text;
  return `<li data-calc-growth-row="${row.key}" aria-label="${esc(description)}"><span class="calc-growth-stat"><span class="calc-growth-name">${label(row.key,lang)}</span><strong class="calc-growth-value" data-calc-growth-value="${row.key}">${statNumber(row.value)}</strong><span class="calc-growth-delta ${deltaTone(row)}" data-calc-growth-delta="${row.key}">${deltaNumber(difference)}</span></span><span class="calc-growth-track calc-rank-${tone}" aria-hidden="true">${score===null?'':`<span class="calc-growth-fill" style="left:${Math.min(50,score)}%;width:${Math.abs(score-50)}%"></span><span class="calc-growth-marker" data-calc-growth-score="${row.key}" style="left:${score}%"></span>`}</span><strong class="calc-growth-rank calc-rank-${tone}" data-calc-growth-rank="${row.key}">${esc(text)}</strong></li>`;
 }).join('')}</ol></div>`;
}
export function growthAnalysisHtml(analysis,{t,lang,record,labels,evaluation=true}){
 const context=recordStatBreakdowns(record),a=analysis.average,overall=analysis.overall,overallScore=overall?.status&&overall.status!=='ok'?null:overall?.score,rating=growthRating(overallScore),rank=score=>`calc-rank calc-rank-${rankTone(score)}`;
 const names=labels||{reference:t('calculator.standardStats'),target:t('calculator.enteredStats')},scales=analysis.graphScales;
 const clipped=scales&&analysis.rows.some(row=>['value','expected'].some(field=>row[field]>(row.key==='hp'?scales.hp:scales.other)));
 const figure=`<figure class="calc-radar">${growthRadarSvg(analysis.rows,{t,lang,scales,labels:names})}<figcaption><span class="calc-radar-median-key">${esc(names.reference)}</span><span class="calc-radar-key">${esc(names.target)}</span></figcaption>${scales?`<p class="calc-graph-note">${t('calculator.graphLevelScales',{level:analysis.graphLevel,hp:scales.hp,other:scales.other})}${clipped?`<br>${t('calculator.graphClipped')}`:''}</p>`:''}</figure>`;
 const unknownNote=analysis.unknownBonusKeys?.length?t('calculator.analysis.partialContext',{stats:analysis.unknownBonusKeys.map(k=>label(k,lang)).join(', ')}):'';
 const summary=evaluation?`<div class="calc-average calc-summary"><div class="calc-overall"><span>${t('calculator.overallGrowth')}</span><strong data-calc-overall-top class="${rank(overallScore)}">${esc(relativeRank(overallScore,{t}))}</strong>${rating?`<span class="calc-result-tag calc-rating-${rating}" data-calc-rating="${rating}" title="${t('calculator.ratingRange.'+rating)}">${t('calculator.rating.'+rating)}</span>`:''}</div><div class="calc-level-average"><span>${t('calculator.averageGrowth')}</span><strong data-calc-average>${a?a.value.toFixed(2):'—'}<small>${t('calculator.gainsUnit')}</small></strong>${a?`<p>${t('calculator.averageCompared',{value:a.expected.toFixed(2),difference:signed(a.value-a.expected)})}</p>`:unknownNote?`<p class="calc-analysis-status" role="status">${esc(unknownNote)}</p>`:''}</div></div>`:'';
 const percentile=row=>`<td><strong data-calc-percentile="${row.key}" class="${rank(row.score)}">${esc(relativeRank(row.score,{t}))}</strong>${row.status==='fixed'||row.status==='outside'?`<small>${t('calculator.percentile.'+row.status)}</small>`:''}</td>`;
 const table=`<table class="calc-percentile-table${evaluation?'':' calc-numeric-table'}"><caption class="sr-only">${t(evaluation?'calculator.numericComparison':'calculator.numericDetails')}</caption><colgroup><col class="calc-analysis-stat"><col class="calc-analysis-value"><col class="calc-analysis-expected"><col class="calc-analysis-delta">${evaluation?'<col class="calc-analysis-percent">':''}</colgroup><thead><tr><th scope="col">${t('calculator.statColumn')}</th><th scope="col">${t('calculator.valueColumn')}</th><th scope="col">${t('calculator.expectedColumn')}</th><th scope="col">${t('calculator.deltaColumn')}</th>${evaluation?`<th scope="col">${t('calculator.percentileColumn')}</th>`:''}</tr></thead><tbody>${analysis.rows.map(row=>`<tr><th scope="row">${label(row.key,lang)}</th><td data-calc-analysis-value="${row.key}">${statBonusButton(statBreakdownPayload(context,row.key),{t,lang,content:`<strong>${statNumber(row.value)}</strong>`})}</td><td>${statNumber(row.expected)}</td><td class="${deltaTone(row)}">${deltaNumber(statDelta(row))}</td>${evaluation?percentile(row):''}</tr>`).join('')}</tbody><tfoot><tr><th scope="row">${t('calculator.statTotal')}</th><td>${statNumber(analysis.totals?.value)}</td><td>${statNumber(analysis.totals?.expected)}</td><td>${deltaNumber(analysis.totals?.difference)}</td>${evaluation?`<td><strong data-calc-overall-percentile class="${rank(overallScore)}">${esc(relativeRank(overallScore,{t}))}</strong></td>`:''}</tr></tfoot></table>`;
 const reason=analysis.reason&&!['values','partialContext'].includes(analysis.reason)?t('calculator.analysis.'+analysis.reason):'';
 return `${summary}${evaluation?`<div class="calc-analysis-grid"><div class="calc-stat-report"><h4>${t('calculator.currentStats')}</h4>${figure}</div><div class="calc-growth-report"><h4>${t('calculator.growthChartTitle')}</h4>${reason?`<p class="calc-help calc-analysis-status" role="status">${esc(reason)}</p>`:''}${growthPercentileChart(analysis.rows,{t,lang,labels:names})}</div></div>`:`<div class="calc-record-radar"><h4>${t('calculator.currentStats')}</h4>${figure}</div>`}<details class="calc-analysis-details" data-calc-analysis-details><summary>${t('calculator.numericDetails')}</summary>${table}</details>`;
}
