// Shared safeguards for text references, independent of link rendering and game data.
export const escapePattern=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function mentionBoundary(raw,start,end,term){
 if(/[\p{L}\p{N}_]$/u.test(raw.slice(0,start)))return false;
 const rest=raw.slice(end);
 if(/[A-Za-z0-9]$/.test(term)&&/^[A-Za-z0-9_]/.test(rest))return false;
 if(/^(?:\+|\s+(?:Lv\.?\s*\d|\+\d))/i.test(rest))return false;
 // Possessives can introduce another name (사도의 천관, Warrior's Blood).
 // They are never sufficient boundaries for an inferred reference.
 if(/^(?:의|['’]s\b)/i.test(rest))return false;
 if(/[\p{L}\p{N}]$/u.test(term)&&/^[가-힣]/.test(rest)){
  const particle=rest.match(/^(?:으로부터|에게서|으로|에서|에게|보다|처럼|하고|이며|이나|이랑|이라|와|과|은|는|이|가|을|를|에|로|도|만|랑)/)?.[0];
  if(!particle)return false;
  const tail=rest.slice(particle.length);
  if(tail&&/^[가-힣]/.test(tail)&&!/^(?:전직|승급|사용|발동|습득|장비|대체|배우|해금|적용)/.test(tail))return false;
 }
 // Do not take Brawn out of an unrecorded Brawn Avo +3, or Fire out of Fire Emblem.
 if(/[A-Za-z]$/.test(term)&&/^[ \t]+[A-Z][A-Za-z]+/.test(rest)&&!/^[ \t]+(?:Lv\b|I{1,3}\b)/.test(rest))return false;
 return true;
}
export function nameProtector(records){
 const names=new Set();
 for(const e of records){
  for(const value of [...Object.values(e.name||{}),...(Array.isArray(e.aliases)?e.aliases:Object.values(e.aliases||{}).flat()),...(e.textAliases||[])])if(typeof value==='string'&&value.trim().length>1)names.add(value.trim());
  // Identity fields name different things even when no separate encyclopedia entry exists.
  for(const f of e.facts||[])if(/^(?:namu-crest|namu-full-name|namu-alias|namu-blaze-arts)$/.test(f.key))for(const value of [f.value,f.valueKo])if(typeof value==='string')for(const part of value.split(/\s*[·;]\s*/)){
   names.add(part.trim());const bare=part.replace(/\s*\([^)]*\)\s*/g,'').trim();if(bare.length>1)names.add(bare);
  }
 }
 // A trie avoids compiling thousands of unrelated proper names into a costly regexp.
 const root=new Map();
 for(const name of names){let node=root;for(const c of name.toLocaleLowerCase()){if(!node.has(c))node.set(c,new Map());node=node.get(c);}node.set(null,name);}
 return raw=>{
  const lower=raw.toLocaleLowerCase(),spans=[];
  for(let start=0;start<lower.length;start++){
   let node=root,end=start,longest=null;
   while(end<lower.length&&node.has(lower[end])){node=node.get(lower[end++]);if(node.has(null))longest={start,end,name:node.get(null)};}
   if(longest)spans.push(longest);
  }
  return spans;
 };
}
export const insideOtherName=(spans,start,end)=>spans.find(s=>s.start<=start&&s.end>=end&&(s.start<start||s.end>end));
