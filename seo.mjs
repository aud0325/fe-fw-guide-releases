import {mountCategory} from './mount-ui.mjs';
import {itemDescription} from './item-usage.mjs';
import {types} from './locales/labels.mjs';
import {displayText,localizedFacts} from './presentation.mjs';
import {flavors} from './food.mjs';
import {pagePath} from './routing.mjs';

export function entryMetadata(e,{t,tx,name,entries,sources}){
 const en=t.locale==='en',pick=(ko,enText)=>en?enText:ko;
 const category=types[e.type][en?1:0];
 const topics={character:e.recruitment?pick('영입 조건·프로필','recruitment & profile'):pick('캐릭터 프로필','character profile'),class:pick('병종·전직 정보','class & promotion'),item:pick('아이템 정보','item details'),mount:pick('탈것·포획 정보','mount & capture'),paralogue:pick('외전·수주 일정','paralogue & schedule')};
 const title=`${tx(e.name)} ${topics[e.type]||category} · ${t('app.fortune-s-weave-encyclopedia')}`;
 let original=e.type==='item'?itemDescription(e,{t,tx,entries,sources}):e.trainingGuide?tx(e.trainingGuide.summary):tx(e.summary);
 if(e.type==='mount')original=!en&&e.facts?.some(f=>f.key==='namu-desc')?e.facts.find(f=>f.key==='namu-desc').value:t('mount.summary',{category:mountCategory(e,t)||pick('다양한 종류의','varied')});
 if(e.type==='quest')original=pick('기존 자료에 기록된 의뢰 보상·장소 참고 정보입니다. 진행 방법은 확인되지 않았습니다.','Reward and location notes retained from source material. A walkthrough has not been verified.');
 if(e.type==='location'){
  if(/아이템 획득 보고에 등장하는 장소|Named in an item acquisition report|Only information supported by the cited references|확인된 참고 자료의 정보만|관리자 제공 게임 화면에서 확인한 항목|Observed in Korean gameplay/.test(original)){
   const ids=new Set((e.links||[]).map(l=>l.to)),items=entries.filter(item=>item.type==='item'&&(ids.has(item.id)||item.links?.some(l=>l.to===e.id)));
   const region=e.videoGathering?.region||e.region;
   original=region&&region!=='Unverified'?displayText(region,t,entries):items.length?t('editorial.related-items')+': '+items.map(name).join(', '):t('map.location-items');
  }
  original=original.replace(/\s*(?:영문 명칭은 확인 전입니다\.|English spelling not yet confirmed\.|개별 재고는 확인 대기입니다\.|Individual stock awaits verification\.|상세 동선은 확인 대기입니다\.|Detailed directions await verification\.)/g,'').trim();
 }
 const generic=/영어 색인 수록|영어 위키 (?:무기|병종) 표 수록|Only information supported by the cited references|확인된 참고 자료의 정보만|See the verification status|(?:Listed in the )?English wiki (?:weapon|class) table/i.test(original);
 const details=[];
 if(e.ingredientFlavor&&flavors[e.ingredientFlavor.flavor]){
  const flavor=tx(flavors[e.ingredientFlavor.flavor]);
  details.push(`${pick('맛','Flavor')}: ${flavor} (${e.ingredientFlavor.basis==='game-ui'?pick('게임 화면 확인','observed in game'):pick('설명문 기반 분류','description-based classification')})`);
  if(e.ingredientFlavorReports?.some(r=>r.flavor!==e.ingredientFlavor.flavor))details.push(pick('맛 분류의 출처별 차이는 본문 참조','See source differences for flavor in the entry'));
 }
 const keys={character:['faction','class','ability'],item:['category','might','rank','game8-item-gathering'],class:['tier','mastery','ko-master_skill'],mount:[]};
 for(const f of localizedFacts(e.facts||[],t).filter(f=>(keys[e.type]||[]).includes(f.key))){
  const value=displayText(en?f.value:f.valueKo||f.value,t,entries,f.literal,f.key);
  // Never cut off a field's qualifier, route or conflicting report to fit a snippet.
  if(!value||value.length>100)continue;
  const uncertain=sources[f.sourceId]?.kind==='unverified';
  details.push(`${uncertain?pick('미검증 보고 · ','Unverified report · '):''}${tx(f.label)}: ${value}`);
 }
 if(generic&&e.acquisition?.length){
  const a=e.acquisition[0],where=a.locationId?entries.find(x=>x.id===a.locationId):null;
  const location=where?name(where):tx(a.where);
  const scope=[tx(a.route),a.chapter==null?'':pick(`${a.chapter}장`,`Chapter ${a.chapter}`)].filter(Boolean).join(' / ');
  if(location)details.push(`${pick('획득 보고(미검증)','Acquisition report (unverified)')}: ${location}${scope?' · '+scope:''}`);
 }
 const summary=generic&&details.length?details.slice(0,3).join(' · '):original;
 const parts=[name(e),generic?summary:original];
 if(!generic)for(const detail of details){if(parts.join(' · ').length+detail.length<220)parts.push(detail);}
 if(e.note)parts.push(pick('출처별 차이와 주의사항은 본문 참조','See the entry for source differences and caveats'));
 return {title,summary,description:parts.filter(Boolean).join(' · ').replace(/<[^>]*>/g,'').replace(/\s+/g,' ')};
}

export function pageStructuredData(page,state,lang,siteUrl){
 if(!siteUrl||page.missing)return [];
 const root=new URL(siteUrl),base=root.pathname;
 const website={'@context':'https://schema.org','@type':'WebSite','@id':new URL('#website',root).href,url:root.href,name:'만자천홍 도감',alternateName:['파이어엠블렘 만자천홍 도감','Fortune’s Weave Encyclopedia'],inLanguage:['ko','en']};
 if(!state.id&&state.type==='all')return [website];
 const crumbs=[{name:lang==='en'?'Fortune’s Weave Encyclopedia':'만자천홍 도감',path:`${base}${lang}/`}];
 if(page.entryType)crumbs.push({name:types[page.entryType][lang==='en'?1:0],path:pagePath({type:page.entryType},lang,base)});
 crumbs.push({name:page.entryName||types[state.type]?.[lang==='en'?1:0]||page.title,path:pagePath(state,lang,base)});
 return [{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((crumb,i)=>({'@type':'ListItem',position:i+1,name:crumb.name,item:new URL(crumb.path,root).href}))}];
}

export const serializeStructuredData=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
