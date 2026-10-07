import {mapNodes} from './part1-map.generated.mjs';
const mapPointForEntry=id=>mapNodes.find(n=>n.entryId===id);
const acquisitionCache=new WeakMap();
// Explicit editorial correspondences to the existing Game8 item-place glossary.
// These identify a place, never a field tile or an unlock/availability condition.
const japanesePlaces={
 '封呪の祭壇':'votive-altar','巨人の足跡砦':'giants-footprint-fort','ニグリア鉱山':'niglia-mine',
 '崩れ砦':'ruined-fort','禁断の森':'video-forbidden-forest','異教徒の洞窟':'heretics-cave',
 'ワルハラ鉱山':'valhalla-mine','ノーアの洞窟':'noah-cave','ディオネ砦':'the-piercer-dione-fort','ガレーン砦跡':'galen-fort-ruins',
 '落ち日の道':'collection-sunset-path','オレアンス平原':'oleance-plains','エリッサ峠':'collection-elisa-pass',
 'ファロの森':'video-paro-forest','ウラノス山':'collection-uranos-mountain',
 'アクシオン渓谷':'collection-exion-valley','雀躍の辻':'collection-peony-crossroads',
 '首狩り岩':'collection-headhunting-rock','天馬岩':'collection-pegasus-rock','黒翼の谷':'collection-black-wing-valley',
 '巨鳥の頸':'collection-giant-bird-neck','竜呼びの岬':'collection-dragon-cape',
 '日見峠':'collection-sunrise-pass','ファウヌスの森':'fauns-forest',
 '星生まれの花園':'starbirth-garden','エンケラドゥス橋':'collection-enkeladus-bridge','サンテナ橋':'collection-santana-bridge','サンタナ橋':'collection-santana-bridge',
 '暁平原':'collection-dawn-plain','ウツナ峠':'collection-utsuna-pass','ドラグデン峠':'collection-dragden-pass','ネイピアの森':'napier-woods',
 '地図にない島':'uncharted-island','輝石の洞':'collection-sparstone-cave','月見峠':'moonwatch-pass','ゴーラ草原帯':'collection-gora-grassland',
 'ぺルーサ岬':'collection-pelusa-cape','星見峠':'collection-stargazing-pass','陽光の花園':'collection-sunlight-garden',
 'クリュテイオス平原':'collection-clitios-plain','フィーナの岩礁':'collection-pina-reef','ダダ平原':'collection-dada-plain',
 'アイギーナ山':'collection-aegina-mountain','コーシャルー湖':'collection-cosalu-lake','ブロンテス湖':'lake-brontes',
 'ヴァレリ峡谷':'valeri-gorge','ダマセン岬':'video-damasen-cape','滝の裏の洞窟':'waterfall-cave','虫穴':'collection-insect-hole',
 'ゼートス大滝':'collection-zetos-falls','アルシネウス大橋':'collection-arsineus-bridge','死将の塚':'fallen-generals-barrows',
 'ルベスの森':'rubess-forest','哭き木の森':'collection-howling-tree-forest'
};
const englishPlaceAliases={
 'Enceladus Bridge':'collection-enkeladus-bridge','Santana Bridge':'collection-santana-bridge','Utuna Pass':'collection-utsuna-pass',
 'Whispering Rock':'collection-whispering-rock','Zethus Falls':'collection-zetos-falls','Daybreak Plains':'collection-dawn-plain',
 'Sunwatch Pass':'collection-sunrise-pass','Collapsed Fort':'ruined-fort','Niraga Mine':'niglia-mine','Nowah’s Cave':'noah-cave',
 'Dragdon Pass':'collection-dragden-pass','Uncharted Isle':'uncharted-island','Gaura Grassland':'collection-gora-grassland',
 'Sunlit Garden':'collection-sunlight-garden','Dada Plains':'collection-dada-plain','Starwatch Pass':'collection-stargazing-pass',
 'Peluza Cape':'collection-pelusa-cape','Wailing Woods':'collection-howling-tree-forest','Klytius Plains':'collection-clitios-plain',
 'Fina Reef':'collection-pina-reef','Mount Aegina':'collection-aegina-mountain','Kothar Lake':'collection-cosalu-lake',
 'Alcineus Span':'collection-arsineus-bridge','Isle of Balor':'collection-balor-island','Giant’s-Print Fort':'giants-footprint-fort',
 'Cape Damasen':'video-damasen-cape','Brigadier Pass':'collection-brigadier-pass','Bugs’ Burrow':'collection-insect-hole',
 'Cave Behind the Falls':'waterfall-cave','Thiere Island':'collection-chere-island','Dione Fort':'the-piercer-dione-fort'
};
const captureNames={
 '陽だまり峠':{ko:'양지 고개',en:'Sunlit Pass'},'ダイモス台地':{ko:'다이모스 대지',en:'Daimos Plateau'},
 'タルボス平原':{ko:'타르보스 평원',en:'Tarvos Plains'},'ヤシロ砦':{ko:'야시로 요새',en:'Yashiro Fort'},
 '戦士の道':{ko:'전사의 길',en:'Warrior’s Road'},'シデムの谷':{ko:'시뎀 계곡',en:'Sidem Valley'}
};
const placeKey=value=>String(value).normalize('NFKC').toLowerCase().replace(/[’']/g,'').replace(/\s+/g,' ').trim();
function existingPlace(value,entries){
 const explicit=japanesePlaces[value]||englishPlaceAliases[value];if(explicit)return explicit;
 const key=placeKey(value);
 const matches=entries.filter(e=>e.type==='location'&&e.mapPoint&&[e.name.ko,e.name.en,...(e.aliases||[])].some(n=>placeKey(n)===key));
 return matches.length===1?matches[0].id:null;
}
function gatheringRows(row,entries){
 if(row.locationId)return [row];
 const where=typeof row.where==='object'?row.where.en||row.where.ko:row.where;
 if(!where)return [row];
 return String(where).split(/\s*;\s*/).flatMap(token=>{
  const grouped=token.match(/^([^()]+)\s*\(([^()]+)\)$/);
  const region=grouped?grouped[1].trim():row.region;
  return (grouped?grouped[2]:token).split(/\s*,\s*/).map(place=>({...row,region,where:place.trim(),locationId:existingPlace(place.trim(),entries)}));
 });
}
const factMethods={'game8-item-part1':['dungeon',1],'game8-item-part3':['dungeon',3],'game8-item-gathering':['gathering',null]};
const acquisitionLabel=l=>/gather|found|acqui|obtain|purchase|buy|drop|fish|harvest|capture|채집|획득|구매|낚시|포획/.test([l?.en,l?.ko].join(' ').toLowerCase());
const tradeReports={
 'sandworm-meat':{key:'game8-report-817080',rows:[
  ['kira-village',{ko:'구매',en:'Purchase'},{ko:'시장: 240G, 재고 5.',en:'Market: 240G, stock 5.'}],
  ['alecto-city',{ko:'교환',en:'Trade'},{ko:'상회: 「リガネット」 10개와 교환, 재고 5.',en:'Trader: exchange 10 「リガネット」, stock 5.'}]
 ]},
 'giants-meat':{key:'game8-report-817081',rows:[
  ['alecto-city',{ko:'교환',en:'Trade'},{ko:'「煉獄草」 10개와 교환, 재고 2.',en:'Exchange 10 「煉獄草」, stock 2.'}]
 ]}
};
export function acquisitionRecords(entry,entries){
 let cache=acquisitionCache.get(entries);if(!cache){cache=new WeakMap();acquisitionCache.set(entries,cache);}if(cache.has(entry))return cache.get(entry);
 const records=[];
 for(const fact of entry.facts||[]){
  const method=factMethods[fact.key];if(!method)continue;
  const korean=String(fact.valueKo||fact.value).split(/\s*\/\s*/);
  for(const [index,token] of String(fact.value).split(/\s*\/\s*/).entries()){
   const place=token.replace(/^(?:Part I(?:II)? dungeon|World-map exploration):\s*/,'').trim();
   const ko=(korean[index]||place).replace(/^(?:1부 던전|3부 던전|세계지도 탐색):\s*/,'');
   if(place)records.push({where:{ko,en:place},whereKey:place,locationId:existingPlace(place,entries)||existingPlace(ko.replace(/\([^)]*\)/g,'').trim(),entries),sourceId:fact.sourceId,method:method[0],part:method[1],factKey:fact.key});
  }
 }
 if(entry.type==='mount'){
  const fact=entry.facts?.find(f=>f.key==='game8-capture')||entry.facts?.find(f=>f.key==='capture-jp');
  const direct=entry.mountDetails?.capturePlaces;
  const names=direct?.length?direct:fact?fact.value.split(/\s*\/\s*|\s*・\s*/).filter(Boolean):[];
  const companion=entry.links?.some(l=>l.label?.en==='Recruited with');
  if(!companion)for(const place of names){
   const locationId=existingPlace(place,entries);
   const late=['black-horse','red-bau','black-bau'].includes(entry.id);
   records.push({locationId,where:captureNames[place]||{ko:place,en:place},whereKey:place,method:{ko:'포획',en:'Capture'},sourceId:direct?.length?entry.mountDetails.sourceId:fact.sourceId,part:late?3:null,condition:late?null:{ko:'카이편·구세편',en:'Cai / Salvation'},conditionSourceId:late?'dc-758284':'game8-jp-816904'});
  }
 }
 for(const row of entry.gathering||[])for(const resolved of gatheringRows(row,entries))records.push({...resolved,method:'gathering'});
 for(const row of entry.acquisition||[])records.push({...row,method:row.method||'acquisition'});
 for(const place of entries.filter(e=>e.type==='location'&&e.mapDetails)){
  for(const [key,method] of [['materials','gathering'],['loot',{ko:'출현물',en:'Loot'}]]){
   if(place.mapDetails[key]?.some(row=>row.itemId===entry.id))records.push({locationId:place.id,method,part:1,observedRoute:place.mapDetails.observedRoute,gameDate:place.mapDetails.gameDate,sourceId:place.mapDetails.sourceId});
  }
 }
 for(const place of entries.filter(e=>e.type==='location'&&e.mapDetails))for(const report of place.mapDetails.previousReports||[])if(report.rows.some(r=>r.itemId===entry.id))records.push({locationId:place.id,method:'gathering',part:1,observedRoute:report.observedRoute,gameDate:report.gameDate,sourceId:place.mapDetails.sourceId});
 const trade=tradeReports[entry.id],tradeFact=trade&&(entry.facts||[]).find(f=>f.key===trade.key);
 if(tradeFact)for(const [locationId,method,condition] of trade.rows)records.push({locationId,method,condition,sourceId:tradeFact.sourceId,factKey:tradeFact.key});
 const links=[...(entry.links||[]).filter(l=>acquisitionLabel(l.label)&&entries.some(e=>e.id===l.to&&e.type==='location')),
  ...entries.filter(e=>e.type==='location').flatMap(e=>(e.links||[]).filter(l=>l.to===entry.id&&acquisitionLabel(l.label)).map(l=>({...l,to:e.id})))];
 for(const link of links){
  if(records.some(r=>r.locationId===link.to&&r.sourceId===link.sourceId&&r.observedRoute===link.observedRoute&&r.gameDate===link.gameDate))continue;
  records.push({...link,locationId:link.to,method:'acquisition'});
 }
 const result=records.map(r=>({...r,point:r.locationId?mapPointForEntry(r.locationId):null}));cache.set(entry,result);return result;
}
export function acquisitionPlaces(entry,entries){
 const groups=new Map();
 for(const r of acquisitionRecords(entry,entries)){
  const key=r.locationId||r.whereKey||(typeof r.where==='object'?JSON.stringify(r.where):r.where);if(!key)continue;
  if(!groups.has(key))groups.set(key,{id:r.locationId||null,point:r.point,where:r.where,records:[]});
  groups.get(key).records.push(r);
 }
 return [...groups.values()].sort((a,b)=>Boolean(b.point)-Boolean(a.point));
}
// Only these literal names in a capture-direction fact can become reference pins.
// They are intentionally absent from acquisitionRecords and mapAcquisitions.
const landmarks=[['다그시온','dagsion'],['칼리스토역','callisto-station'],['칼라스토역','callisto-station'],['아우로라 신전','auroras-temple'],['페로니아역','peronia-station'],['살라키아역','salacia-station'],['오하드역','ohad-station'],['우르카역','urca-station']];
const englishDirections={
 'wild-horse':'Southwest of Dagsion: 2 turns from Dagsion. South of Dagsion: 3 turns from Callisto Station, or 1 turn if warping to Aurora’s Temple is available. Another southern location: 3 turns from Peronia Station.',
 'ferghanan-horse':'South of Dagsion: 3 turns from Peronia Station.',
 'monoceros':'South of Dagsion: 3 turns from Callisto Station, or 1 turn if warping to Aurora’s Temple is available.',
 'wild-ornius':'East of Dagsion: 2 turns from Dagsion. Southern locations: 1 turn from Callisto Station or 1 turn from Salacia Station. Northeast of Dagsion: 5 turns from Ohad Station.',
 'white-ornius':'Northeast of Dagsion: 5 turns from Ohad Station.',
 'meganius':'South of Dagsion: 1 turn from Callisto Station; other southern locations are 1 or 3 turns from Salacia Station. The original report spells Callisto as 칼라스토.',
 'red-meganius':'South of Dagsion: 3 turns from Salacia Station.',
 'magonius':'South of Dagsion, in the 5 o’clock direction: 9 turns from Salacia Station. The author had not confirmed shorter travel by another route or means of transport.',
 'black-magonius':'South of Dagsion, in the 5 o’clock direction: 9 turns from Salacia Station. The author had not confirmed shorter travel by another route or means of transport.',
 'pegasus':'Northeast of Dagsion: 4 or 3 turns from Ohad Station. East of Dagsion: 3 turns from Urca Station.',
 'dark-pegasus':'East of Dagsion: 3 turns from Urca Station.',
 'falicorn':'East of Dagsion: 4 or 3 turns from Ohad Station.',
 'wild-bau':'East of Dagsion: 3 turns from Urca Station.'
};
export function mountDirectionReferences(entry){
 const fact=entry.type==='mount'&&(entry.facts||[]).find(f=>f.key==='capture-ko');if(!fact)return null;
 const points=[...new Set(landmarks.filter(([name])=>fact.value.includes(name)).map(([,id])=>id))].map(id=>mapNodes.find(n=>n.id===id)).filter(Boolean);
 return {fact,points,text:{ko:fact.value,en:englishDirections[entry.id]||fact.value}};
}
