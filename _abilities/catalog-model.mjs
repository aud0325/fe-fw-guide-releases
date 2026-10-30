import {proficiencySupplement} from './integration-data.mjs';
import {observedNonSpecialties} from './proficiency-observations.mjs';
import {groupFamilies} from './scale-model.mjs';
import {characters,entities} from './catalog-context.mjs';
export const proficiencyOrder=['sword','spear','axe','bow','gauntlet','black-magic','white-magic','authority','infantry','armor','cavalry','flying'];
export const categoryLabels={character:['캐릭터 스킬','Character skills'],training:['기술능력','Proficiencies'],class:['병종','Classes'],mount:['탈것','Mounts']};
export const characterOrder=characters.map(x=>x.id);
export function normalizeSection(kind,section){return kind==='spell'&&['dark','unknown'].includes(section)?'black':kind==='skill'?(['','personal','unique'].includes(section)?'character':section==='mastery'?'class':section==='unknown'?'mount':section):section;}
export function orderedCharacters(rows){const ids=new Set(rows.flatMap(r=>r.relations.filter(x=>x.type==='character').map(x=>x.id)));const known=characters.filter(c=>ids.has(c.id));const missing=[...new Map(rows.flatMap(r=>r.relations.filter(x=>x.type==='character'&&!characters.some(c=>c.id===x.id)).map(x=>[x.id,x]))).values()];return [...known,...missing];}
export function characterSkills(rows){return orderedCharacters(rows).map(c=>({...c,personal:rows.filter(r=>r.kind==='skill'&&r.category==='personal'&&r.relations.some(x=>x.type==='character'&&x.id===c.id)),unique:rows.filter(r=>r.kind==='skill'&&r.category==='unique'&&r.relations.some(x=>x.type==='character'&&x.id===c.id))})).filter(c=>c.personal.length||c.unique.length);}
export function proficiencies(row){return [...new Set(row.relations.flatMap(x=>(x.routes||[x]).map(r=>r.proficiency)).filter(Boolean))];}
export function providerGroups(rows,section){
 section=normalizeSection('skill',section);
 const selected=rows.filter(r=>r.kind==='skill'&&normalizeSection('skill',r.category)===normalizeSection('skill',section)),groups=new Map();
 for(const category of [...new Set(selected.map(r=>r.category))])for(const family of groupFamilies(selected.filter(r=>r.category===category))){
  const providers=section==='training'?[...new Set(family.flatMap(proficiencies))].map(id=>({id,type:'proficiency'})):[...new Map(family.flatMap(r=>r.relations.filter(x=>x.type===(section==='mount'?'mount':'class')).map(x=>[x.id,x]))).values()];
  if(!providers.length)providers.push({id:'unknown',name:{ko:'미확인',en:'Unknown'}});
  for(const owner of providers){if(!groups.has(owner.id))groups.set(owner.id,{owner:{...owner,icon:entities.find(e=>e.id===owner.id)?.icon},families:[]});groups.get(owner.id).families.push(family);}
 }
 const order=section==='training'?proficiencyOrder:entities.map(e=>e.id);const rank=id=>order.includes(id)?order.indexOf(id):9999;
 return [...groups.values()].sort((a,b)=>rank(a.owner.id)-rank(b.owner.id));
}
const preferenceMap={'Sword':'sword','Spear':'spear','Axe':'axe','Bow':'bow','Brawl':'gauntlet','Brawling':'gauntlet','Gauntlet':'gauntlet','Black Magic':'black-magic','White Magic':'white-magic','Authority':'authority','Leadership':'authority','Infantry':'infantry','Armor':'armor','Heavy Armor':'armor','Riding':'cavalry','Flying':'flying'};
function preferenceCodes(id,key){const fact=characters.find(c=>c.id===id)?.facts.find(f=>f.key===key);return (fact?.value||'').split(',').map(v=>preferenceMap[v.trim().replace(/ Skill$/,'')]).filter(Boolean).sort((a,b)=>proficiencyOrder.indexOf(a)-proficiencyOrder.indexOf(b));}
function affinityCodes(id,key){const existing=characters.find(c=>c.id===id)?.facts.some(f=>f.key===key);return existing?preferenceCodes(id,key):(proficiencySupplement[id]?.[key==='pref_skills'?'preferred':'nonpreferred']||[]).slice().sort((a,b)=>proficiencyOrder.indexOf(a)-proficiencyOrder.indexOf(b));}
export function specialties(id){return affinityCodes(id,'pref_skills');}
export function nonSpecialties(id){return [...new Set([...affinityCodes(id,'nonideal_skills'),...(observedNonSpecialties[id]||[])])].sort((a,b)=>proficiencyOrder.indexOf(a)-proficiencyOrder.indexOf(b));}
export function characterSections(rows,id){
 const learned=rows.filter(r=>r.relations.some(x=>x.type==='character'&&x.id===id)),fav=specialties(id);
 const sections=[];
 for(const p of proficiencyOrder){const rr=learned.filter(r=>r.relations.some(x=>x.id===id&&(x.routes||[x]).some(y=>y.proficiency===p)));if(rr.length)sections.push({id:p,preferred:fav.includes(p),rows:rr});}
 for(const category of ['personal','unique','training','mastery','class','mount','unknown']){const rr=learned.filter(r=>r.kind==='skill'&&r.category===category&&!sections.some(s=>s.rows.includes(r)));if(rr.length)sections.push({id:category,preferred:false,rows:rr});}
 for(const kind of ['combat-art','spell']){const rr=learned.filter(r=>r.kind===kind&&!sections.some(s=>s.rows.includes(r)));if(rr.length)sections.push({id:kind,preferred:false,rows:rr});}
 return sections.sort((a,b)=>Number(b.preferred)-Number(a.preferred));
}

export function abilityTarget(r){return {kind:r.kind,view:'detail',id:r.id,char:'',section:r.kind==='skill'&&['personal','unique'].includes(r.category)?'character':r.kind==='spell'?(r.stats.magicSchool||'unknown'):normalizeSection(r.kind,r.category),page:1};}

export const learningRanks=['D','D+','C','C+','B','B+','A','A+','S','S+'];
export function acquisitionLevel(row,id){
 const levels=[...new Set(row.relations.filter(x=>x.type==='character'&&x.id===id).flatMap(x=>(x.routes||[x]).map(r=>r.level)).filter(v=>v!=null))];
 return levels.length===1?levels[0]:null;
}
export function characterMatrix(rows,id){
 const preferred=specialties(id),nonPreferred=nonSpecialties(id),learned=rows.filter(r=>r.relations.some(x=>x.type==='character'&&x.id===id));
 const matrix=proficiencyOrder.map(proficiency=>({id:proficiency,preferred:preferred.includes(proficiency),nonPreferred:nonPreferred.includes(proficiency),cells:Object.fromEntries(learningRanks.map(rank=>[rank,[]]))}));
 const initial=[],unranked=[],exclusive=[];
 for(const row of learned){
  const routes=row.relations.filter(x=>x.type==='character'&&x.id===id).flatMap(x=>x.routes||[x]);
  let placed=false;
  for(const route of routes){
   const line=matrix.find(x=>x.id===route.proficiency);
   if(line&&learningRanks.includes(route.rank)){
    if(!line.cells[route.rank].some(x=>x.id===row.id))line.cells[route.rank].push(row);
    placed=true;
   }
  }
  if(routes.some(r=>r.method==='quest-reward'))exclusive.push(row);
  if(routes.some(r=>r.method==='initial-possession'))initial.push(row);
  if(!placed&&!initial.includes(row)&&!exclusive.includes(row))unranked.push(row);
 }
 return {lines:matrix.filter(x=>Object.values(x.cells).some(c=>c.length)),initial,unranked,exclusive};
}

export function catalogEntryHref(entity,lang='ko'){
 const known=(entity.type==='character'?characters:entities).some(x=>x.id===entity.id&&x.type===entity.type);
 return known?`/${lang==='en'?'en':'ko'}/entry/${encodeURIComponent(entity.id)}/`:null;
}

export function characterSkillHref(row,lang='ko'){
 if(row.kind!=='skill'||!['personal','unique'].includes(row.category))return null;
 const owners=row.relations.filter(x=>x.type==='character');
 if(owners.length!==1)return null;
 const page=catalogEntryHref(owners[0],lang);
 return page?`${page}#ability-${encodeURIComponent(row.id)}`:null;
}
