import {entries} from './data.mjs';
import {mentionBoundary,nameProtector,insideOtherName} from './entity-mentions.mjs';
import {rows} from './_abilities/full-data.mjs';
import {entryDisplayName,isDiscoverable} from './editorial-view.mjs';
import {entryIconMedia} from './entity-media.mjs';
import {abilityToken} from './_abilities/token-links.mjs';
import {entityToken} from './entity-token.mjs';
import {pagePath,readRoute} from './routing.mjs';
import {escapeHtml as esc} from './core.mjs';

// UI references do not add acquisition, equipment or other gameplay relationships.
export const keywordRecords=[...entries.filter(e=>e.type==='class'&&isDiscoverable(e)).map(e=>({...e,kind:'class'})),...rows];
const byId=new Map(keywordRecords.map(e=>[e.id,e]));
// These names also occur as ordinary prose. They require an explicit keyword context.
const ordinaryTerms=new Set(['평민','귀족','병사','가속','순응','습격','질주','존','매','결계','조력','괴력','체격','고요','만류','호조','악운','직격','양동','전신','무신','무모','전력','광휘','난사','즉흥','차단','협박','살의','간파','압박','질풍','속공','철혈','견제','보복','성격','훈수','호기','비상','태양','양단','기습','위협','파괴','집중','운수','주명','Commoner','Noble','Soldier','Archer','Hunter','Priest','Warrior','Ranger','Dancer','Guardian','Blacksmith','Accelerate','Adaptability','Ambush','Astra','Aura','Barrier','Brawn','Build','Dance','Deadeye','Dodge','Falcon','Hurl','Intercept','Menace','Perception','Rein','Soar','Sol','Sunder','Thunder','Torch','Warp','Wind','Heal','Recover','Steal','Rescue','Silence','Fire'].map(s=>s.toLocaleLowerCase()));
const specificEnglish=new Set(['Aegis','Astra','Airfighter','Arrowcrack','Axefaire','Bolganone','Bolting','Bowblock','Bowfaire','Brio','Canto','Continuum','Crescendo','Destreza','Emergis','Excalibur','Fistfaire','Flamekeeper','Hexblade','Improviso','Khamsin','Laia','Locktouch','Magecleaver','Nosferatu','Pavise','Physic','Regenera','Resquia','Sagittae','Seraphim','Skysplit','Spearblock','Spearfaire','Stormstep','Swordfaire','Thoron','Windsweep','Windweave']);
for(const row of rows)if(/^[A-Za-z]+$/.test(row.name.en)&&!specificEnglish.has(row.name.en))ordinaryTerms.add(row.name.en.toLowerCase());
const specificEnglishKeys=new Set([...specificEnglish].map(s=>s.toLocaleLowerCase()));
const contextRequired=term=>ordinaryTerms.has(term.toLocaleLowerCase())||(/^[a-z]+$/i.test(term)&&!specificEnglishKeys.has(term.toLocaleLowerCase()))||term.length===1||/^(?:HP|힘|마력|속도|기술|수비|마방|행운|매력|체격|이동(?:력)?|명중|회피|필살|Strength|Magic|Speed|Dexterity|Defense|Resistance|Luck|Charm|Move|Hit|Avo|Crit)\s*[+-]\s*\d+$/i.test(term);
const classCategoryTerms=/^(?:Unique|Beginner|Specialty|Intermediate|Advanced|Master|Divine|기본직|초급직|중급직|상급직|최상급직|신장직)$/i;
const index=new Map();
for(const entry of keywordRecords){
 const aliases=entry.kind==='class'?[...(entry.textAliases||[]),...(entry.aliases||[]).filter(term=>!classCategoryTerms.test(term))]:Object.values(entry.aliases||{}).flat();
 for(const term of new Set([...Object.values(entry.name),...(entry.kind==='class'?['ko','en'].map(lang=>entryDisplayName(entry,lang)):[]),...aliases])){
  if(typeof term!=='string'||!term.trim()||term.includes('\n'))continue;
  const key=term.toLocaleLowerCase();if(!index.has(key))index.set(key,{term,ids:new Set()});index.get(key).ids.add(entry.id);
 }
}
export const keywordTerms=[...index.values()].map(({term,ids})=>({term,ids:[...ids],contextRequired:contextRequired(term)}));
const regex=new RegExp(keywordTerms.map(x=>x.term).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'giu');
const contexts=new Map(),protectNames=nameProtector([...entries,...rows]);
const identityField=/^(?:namu-(?:crest|full-name|alias|cv|age|birthday|height|nationality|hobby|likes|relation|blaze-arts)|first-appearance|joins|faction|likes|interests|pref_skills|nonideal_skills|gender|age|birthday|height)$/;
function relatedIds(id){
 if(contexts.has(id))return contexts.get(id);
 const entry=entries.find(e=>e.id===id),ability=byId.get(id),ids=new Set((entry?.links||[]).map(x=>x.to));
 // A shared provider is not evidence of a relationship between all of its recipients.
 for(const r of rows)if(r.relations.some(x=>x.id===id)||(ability?.family&&r.family===ability.family))ids.add(r.id);
 for(const relation of ability?.relations||[])ids.add(relation.id);
 for(const relation of ability?.abilityRelations||[])ids.add(relation.to);
 contexts.set(id,ids);return ids;
}
function fieldKind(field){
 if(/^(?:class|namu-class)$/.test(field))return 'class';
 if(/^(?:skills|mastery|ability|personal-ko|ko-master_skill|ko-class_skill_\d+|namu-personal-skill)$/.test(field))return 'skill';
 return null;
}
function nameSlot(raw,start,end,term,field){
 if(!fieldKind(field))return false;
 // A field can contain "name : effect". The effect is not a list of skill names.
 const head=raw.split(/[:：]/)[0];if(end>head.length)return false;
 const before=head.slice(0,start).trimEnd().replace(/[「『“‘"']$/,''),after=head.slice(end).trimStart().replace(/^[」』”’"']/,'');
 return (!before||/[,·;/|]$|\b(?:and|or)$/i.test(before))&&(!after||/^[,·;/|]|^(?:and|or)\b/i.test(after));
}
function localContext(raw,start,end){
 const before=raw.slice(Math.max(0,start-40),start).replace(/[「『“‘"']\s*$/,'').trimEnd();
 let after=raw.slice(end).replace(/^[」』”’"']/,'');
 const kind=/(?:전투\s*기술|combat\s+art)\s*[:：]?$/i.test(before)?'combat-art':/(?:스킬|skill|ability)\s*[:：]?$/i.test(before)?'skill':/(?:마법|spell)\s*[:：]?$/i.test(before)?'spell':/(?:병종|class)\s*[:：]?$/i.test(before)?'class':null;
 if(kind)return {kinds:[kind],reason:'explicit-kind'};
 const suffix=after.match(/^\s+(combat art|skill|ability|spell|class)\b/i)?.[1]?.toLowerCase();
 if(suffix)return {kinds:[suffix==='combat art'?'combat-art':suffix==='ability'?'skill':suffix],reason:'explicit-kind'};
 // Follow a list only through complete known names, never across arbitrary prose.
 for(let i=0;i<5;i++){
  const separator=after.match(/^\s*(?:과|와|,|·|\/|and\b|or\b)\s*/i);if(!separator)break;
  const tail=after.slice(separator[0].length),next=[...tail.matchAll(regex)][0];
  if(!next||next.index!==0||!mentionBoundary(tail,0,next[0].length,next[0]))break;
  after=tail.slice(next[0].length);
 }
 after=after.replace(/^(?:을|를|으로|로|에서|이|가|은|는|도)?\s*/,'');
 if(/^(?:전직|승급)/.test(after))return {kinds:['class'],reason:'class-action'};
 if(/^(?:사용|발동|습득|배우|장비|해금|대체)/.test(after)||/\b(?:learn(?:s|ed)?|equip(?:s|ped)?|cast(?:s)?|unlock(?:s|ed)?|replace(?:s|d)?|use(?:s|d)?)\s*$/i.test(before)||/^\s*(?:activates|triggers|at\s+(?:rank|[DCBAS]\+?\b))/i.test(after))return {kinds:['skill','combat-art','spell'],reason:'ability-action'};
 return null;
}
// Every inferred link carries positive semantic evidence. A dictionary hit alone is rejected.
export function keywordDecisions(value,{entryId='',field='',referenceIds=[]}={}){
 const raw=String(value??''),related=relatedIds(entryId),spans=protectNames(raw),decisions=[];
 for(const match of raw.matchAll(regex)){
  const term=match[0],start=match.index,end=start+term.length,candidates=[...index.get(term.toLocaleLowerCase()).ids];
  let reason='',id=null,kind='ambiguous',allowed=candidates;
  if(identityField.test(field))reason='identity-field';
  else if(insideOtherName(spans,start,end))reason='inside-other-name';
  else if(!mentionBoundary(raw,start,end,term))reason='word-boundary';
  const local=localContext(raw,start,end),slot=nameSlot(raw,start,end,term,field),typed=slot?{kinds:[fieldKind(field)],reason:'typed-name-field'}:local;
  if(!reason){
   if(typed){
    allowed=candidates.filter(id=>typed.kinds.includes(byId.get(id).kind));if(!allowed.length)reason='kind-mismatch';
    // "Use Search" can mean the game's ordinary interaction, not the Search skill.
    if(typed.reason==='ability-action'&&contextRequired(term)&&!allowed.some(id=>related.has(id)||referenceIds.includes(id))){
     const before=raw.slice(0,start),after=raw.slice(end).replace(/^[」』”’"']/,'').replace(/^(?:을|를|이|가|은|는)?\s*/,'');
     const quoted=/[「『“‘"']$/.test(before)&&/^[」』”’"']/.test(raw.slice(end));
     if(!quoted&&!/^(?:발동|습득|배우|대체)/.test(after)&&!/^\s*(?:activates|triggers|at\s+(?:rank|[DCBAS]\+?\b))/i.test(after)&&!/\b(?:learn(?:s|ed)?|replace(?:s|d)?)\s*$/i.test(before))reason='ordinary-action';
    }
   }
   else if(candidates.some(id=>referenceIds.includes(id)))allowed=candidates.filter(id=>referenceIds.includes(id));
   else if(!contextRequired(term))allowed=candidates.filter(id=>related.has(id));
   else allowed=[];
   if(!reason&&!allowed.length)reason='no-reference-context';
   if(!reason){
    const contextual=allowed.filter(id=>related.has(id));
    id=allowed.length===1?allowed[0]:contextual.length===1?contextual[0]:'keyword:'+term.toLocaleLowerCase();
    if(id===entryId)reason='self-reference';
    else{reason=typed?.reason||(referenceIds.includes(id)?'scoped-reference':'recorded-relation');kind=byId.get(id)?.kind||'ambiguous';}
   }
  }
  decisions.push({id,ids:allowed.length?allowed:candidates,term,start,end,kind,accepted:Boolean(id)&&reason!=='self-reference',reason});
 }
 return decisions;
}
export const keywordMatches=(raw,options={})=>keywordDecisions(raw,options).filter(m=>m.accepted);
export const keywordCandidates=term=>(index.get(term.toLocaleLowerCase())?.ids? [...index.get(term.toLocaleLowerCase()).ids].map(id=>byId.get(id)):[]);
export function keywordLink(id,label,{lang='ko',base='/',inline=true,href,className='',attributes={}}={}){
 if(id.startsWith('keyword:'))return entityToken({id,label,kind:'ambiguous',href:base+lang+'/?q='+encodeURIComponent(id.slice(8)),inline,className,attributes});
 const record=byId.get(id);if(!record)return esc(label);
 if(record.kind!=='class'){
  const html=abilityToken(record,lang,{base,inline,label,className,attributes});
  return href?html.replace(/href="[^"]*"/,`href="${esc(href)}"`):html;
 }
 const media=entryIconMedia(record),icon=media?{...media,src:base+media.src.replace(/^\.\//,'')}:null;
 return entityToken({id,label,kind:'class',icon,href:href||pagePath({id},lang,base),inline,className,attributes});
}
export function renderKeywordText(raw,options={}){
 const value=String(raw??''),matches=keywordMatches(value,options);let html='',offset=0;
 for(const match of matches){html+=esc(value.slice(offset,match.start))+keywordLink(match.id,match.term,options);offset=match.end;}
 return matches.length?html+esc(value.slice(offset)):esc(value);
}
const decode=value=>value.replace(/&(?:amp|lt|gt|quot|apos|#39|#x[0-9a-f]+|#\d+);/gi,s=>{
 const named={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&#39;':"'"};
 if(named[s])return named[s];const n=s.slice(2,-1);const code=n[0]?.toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return code>0&&code<=0x10ffff?String.fromCodePoint(code):s;
});
function tagEnd(html,offset){
 let end=offset+1,quote='';for(;end<html.length;end++){const c=html[end];if(quote){if(c===quote)quote='';}else if(c==='"'||c==="'")quote=c;else if(c==='>')break;}return Math.min(end,html.length-1);
}
// An inline emphasis/span must not conceal that a match is part of another name.
function textProjection(html){
 let text='',offset=0;const indices=new Map();
 while(offset<html.length){
  if(html[offset]==='<'){
   if(html.startsWith('<!--',offset)){const close=html.indexOf('-->',offset+4);offset=close<0?html.length:close+3;continue;}
   const end=tagEnd(html,offset),tag=html.slice(offset,end+1).match(/^<\/?([\w-]+)/)?.[1]?.toLowerCase();
   if(/^(?:p|div|section|article|li|ul|ol|dl|dt|dd|table|thead|tbody|tr|th|td|br|hr|h[1-6])$/.test(tag||''))text+='\n';
   offset=end+1;continue;
  }
  const entity=html.slice(offset).match(/^&(?:[a-z]+|#x[0-9a-f]+|#\d+);/i)?.[0],chunk=entity?decode(entity):html[offset],size=entity?entity.length:1;
  indices.set(offset,text.length);text+=chunk;indices.set(offset+size,text.length);offset+=size;
 }
 return {text,indices,spans:protectNames(text)};
}
function renderTextNode(source,options,sourceOffset,projection){
 let text='',i=0;const boundaries=[0];
 while(i<source.length){const entity=source.slice(i).match(/^&(?:[a-z]+|#x[0-9a-f]+|#\d+);/i)?.[0],chunk=entity?decode(entity):source[i];const size=entity?entity.length:1;text+=chunk;for(let j=0;j<chunk.length;j++)boundaries.push(i+size);i+=size;}
 const decisions=keywordDecisions(text,options);
 for(const decision of decisions)if(decision.accepted){
  const start=projection.indices.get(sourceOffset+boundaries[decision.start]),end=projection.indices.get(sourceOffset+boundaries[decision.end]);
  const other=insideOtherName(projection.spans,start,end);
  if(other||!mentionBoundary(projection.text,start,end,decision.term)){decision.accepted=false;decision.reason=other?'inside-other-name':'word-boundary';}
 }
 if(options.onDecision)for(const decision of decisions)options.onDecision({...decision,text,entryId:options.entryId||'',field:options.field||'',referenceIds:options.referenceIds||[]});
 const matches=decisions.filter(m=>m.accepted);if(!matches.length)return source;
 let html='',offset=0;for(const match of matches){html+=source.slice(offset,boundaries[match.start])+keywordLink(match.id,match.term,options);offset=boundaries[match.end];}return html+source.slice(offset);
}
const skipTags=new Set(['a','button','nav','header','footer','h1','h2','h3','h4','h5','h6','th','caption','dt','label','summary','script','style','code','pre','textarea','select','option','svg','math']);
const voidTags=new Set(['img','br','hr','input','meta','link','source','wbr','area','base','col','embed','param','track']);
const skipClasses=/\b(?:sources-listing|page-references|source-box|growth-sources|image-credit|breadcrumbs|matrix-legend|proficiency-label|proficiency-overview|classification|role-tags|entity-token)\b/;
// Quote-aware tokenization keeps attributes and existing links outside the text matcher.
// Rendered data is already escaped; matched nodes are decoded once and re-escaped.
export function linkContentKeywords(html,options={}){
 const stack=[],projection=textProjection(html);let out='',offset=0;
 while(offset<html.length){
  if(html[offset]!=='<'){
   const end=html.indexOf('<',offset),stop=end<0?html.length:end,source=html.slice(offset,stop);
   if(stack.some(x=>x.skip))out+=source;
   else{const scoped={...options,entryId:[...stack].reverse().find(x=>x.entryId)?.entryId||options.entryId,field:[...stack].reverse().find(x=>x.field)?.field||options.field,referenceIds:[...stack].reverse().find(x=>x.referenceIds)?.referenceIds||options.referenceIds};out+=renderTextNode(source,scoped,offset,projection);}
   offset=stop;continue;
  }
  if(html.startsWith('<!--',offset)){const end=html.indexOf('-->',offset+4);const stop=end<0?html.length:end+3;out+=html.slice(offset,stop);offset=stop;continue;}
  const end=tagEnd(html,offset);
  const token=html.slice(offset,end+1),match=token.match(/^<\s*(\/?)\s*([\w-]+)/),tag=match?.[2].toLowerCase();
  if(match?.[1]){const i=stack.map(x=>x.tag).lastIndexOf(tag);if(i>=0)stack.splice(i);}
  else if(tag){
   const parentSkipped=stack.some(x=>x.skip),classes=token.match(/\bclass="([^"]*)"/)?.[1]||'';
   // Upgrade simple existing game-keyword links, preserving their exact URL and label.
   if(tag==='a'&&!parentSkipped&&!/\b(?:entity-token|card|relation|person-link|growth-rank-link)\b/.test(classes)){
    const href=decode(token.match(/\bhref="([^"]*)"/)?.[1]||''),close=html.indexOf('</a>',end+1),body=html.slice(end+1,close);
    if(href&&close>=0&&!body.includes('<')){
     const url=new URL(href,'https://local.invalid'+(options.base||'/'));
     const route=url.origin==='https://local.invalid'?readRoute(url,options.base||'/',options.lang||'ko'):null,id=route?.state.id;
     if(byId.has(id)){out+=keywordLink(id,decode(body),{...options,href,className:classes});offset=close+4;continue;}
    }
   }
   if(!voidTags.has(tag)&&!token.endsWith('/>'))stack.push({tag,referenceIds:token.match(/\bdata-keyword-ids="([^"]*)"/)?.[1].split(/\s+/).filter(id=>byId.has(id)),entryId:token.match(/\bdata-ability-id="([^"]*)"/)?.[1],field:token.match(/\bdata-keyword-field="([^"]*)"/)?.[1],skip:parentSkipped||skipTags.has(tag)||skipClasses.test(classes)||/\bdata-keywords="off"/.test(token)});
  }
  out+=token;offset=end+1;
 }
 return out;
}
