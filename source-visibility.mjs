// Recording provenance is retained in local research, not in the public source list.
export const internalSourceIds=new Set(['game-video-20260926','game-flavors-20260926','game-materials-20261009']);
export const isPublicSource=(id,source)=>Boolean(source)&&!internalSourceIds.has(id);
// Original notes describe collection and editorial decisions. Keep them in the
// local source records; readers receive the provider, original URL and credits.
export function publicSourceRecord(id,source){
 if(!source)return source;
 const {note,snapshot,sha256,...record}=source;
 const cleanTitle=value=>typeof value==='string'?value.replace(/\s*\((?:snapshot review|명칭 대조|누락 항목 보완)\)/g,'').replace('은 무기 기본 성능 보완','은 무기 기본 성능'):value;
 record.title=typeof record.title==='object'?Object.fromEntries(Object.entries(record.title).map(([lang,text])=>[lang,cleanTitle(text)])):cleanTitle(record.title);
 if(id==='game8-jp-weapon-names-20260929')record.title={ko:'Game8 JP · 무기 목록',en:'Game8 JP · Weapon list'};
 if(id==='edricsn-weapons-expanded-20260929')record.title={ko:'에드릭슨 · 무기 목록',en:'Edricsn · Weapon list'};
 const local=!record.url||/^(?:\.\/)?evidence\//.test(record.url);
 if(local){
  delete record.url;
  record.provider={ko:'제공된 게임 화면·플레이 정보',en:'Provided gameplay materials'};
  if(id==='administrator-recruitment-equipment-20261029')record.provider={ko:'관리자',en:'Administrator'};
  const topics={
   'user-item-names-20260926':['한국어 명칭','Korean names'],
   'user-weapon-labels-20260929':['무기 명칭','Weapon names'],
   'user-ursa-claw-condition-20260930':['녹투라 영입 장비','Noctula recruitment equipment'],
   'user-assal-20260930':['성스러운 창 아살','Assal'],
   'user-horsekiller-bow-20261005':['말 킬러의 활','Horsekiller Bow'],
   'user-kallas-bow-20261026':['칼라의 활 시련','Kalla’s Bow trial'],
   'administrator-mount-bait-20261011':['포획 먹이','Capture bait'],
   'administrator-sculptor-quest':['전설의 조각가의 유산','Legacy of a Legendary Sculptor'],
   'administrator-theodora-items':['세오도라 아이템','Theodora items'],
   'administrator-leda-map-20261025':['레다 지역','Leda locations'],
   'administrator-part1-map':['1부 지도','Part I map'],
   'administrator-leda-map-20261018':['신탁의 폭포·여행자의 언덕','Oracle Falls and Traveler’s Hill'],
   'administrator-map-access':['해상 접근 조건','Sea access'],
   'feedback-item-names-20261006':['게임 내 명칭','In-game names'],
   'administrator-cai-observations':['카이 탈것·지역','Cai mounts and locations'],
   'administrator-cai-cultivation-20261009':['카이 재배','Cai cultivation'],
   'user-sweet-leaf-20261012':['스위트 리프','Sweet Leaves'],
   'administrator-leda-map-20261013':['심록의 구멍','Verdant Hollow'],
   'administrator-item-identity-review-20261025':['아이템·획득처','Items and acquisition'],
   'administrator-spell-items-20261026':['마법 습득 아이템','Spell-learning items']
  };
  if(topics[id])record.title={ko:'제공 자료 · '+topics[id][0],en:'Provided material · '+topics[id][1]};
  if(id==='administrator-leda-map-20261013')record.originals=[{title:{ko:'Game8 · 리가네트',en:'Game8 · Liganet'},url:'https://game8.jp/fe-banshisenko/817014'}];
 }
 return record;
}
export function publicCatalogValue(value){
 if(Array.isArray(value))return value.map(publicCatalogValue);
 if(!value||typeof value!=='object')return value;
 const result={};
 for(const [key,item] of Object.entries(value)){
  if(['video','time','snapshot','sha256','baseStats'].includes(key))continue;
  if(key==='sourceIds'){result[key]=item.filter(id=>!internalSourceIds.has(id));continue;}
  if(/sourceId$/i.test(key)&&internalSourceIds.has(item))continue;
  result[key]=publicCatalogValue(item);
 }
 return result;
}

// Keep source records locally; publish only references used by the resolved entries.
export function referencedSources(entries,sources){
 const used=new Set();
 function visit(value){
  if(!value||typeof value!=='object')return;
  for(const [key,item]of Object.entries(value)){
   if(key==='sourceIds'&&Array.isArray(item))item.forEach(id=>used.add(id));
   else if(/sourceId$/i.test(key)&&typeof item==='string')used.add(item);
   else visit(item);
  }
 }
 visit(entries);
 return Object.fromEntries(Object.entries(sources).filter(([id])=>used.has(id)));
}
