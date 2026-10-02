import {conflictData} from './conflict-resolution.generated.mjs';
const bi=(ko,en)=>({ko,en});
const source=page=>'game8-jp-'+page+'-20260928';
const same=(a,b)=>Object.keys(a).every(k=>a[k]===b[k])&&Object.keys(a).length===Object.keys(b).length;
export function applyConflictResolution(db,sources){
 Object.assign(sources,conflictData.sources);
 const get=id=>{const e=db.get(id);if(!e)throw Error('Missing conflict target: '+id);return e;};
 const cite=(e,id)=>{if(!sources[id])throw Error('Missing resolution source: '+id);e.sourceIds=[...new Set([...e.sourceIds,id])];};
 const fact=(e,key,ko,en,valueKo,value,sourceId)=>{
  e.facts=e.facts.filter(f=>f.key!==key);e.facts.push({key,label:bi(ko,en),valueKo,value,sourceId,literal:true});cite(e,sourceId);
 };
 // Change thresholds only on the reviewed routes; keep items, quests and automatic joins.
 for(const [id,route,page] of [['halvin','cai',816457],['esmeralda','cai',816422],['ninae','leda',816437],['loretta','dietrich',816451],['nezha','theodora',816439],['yang-jie','leda',816446]]){
  const e=get(id),prior=structuredClone(e.recruitment[route]),report=e.game8Recruitment[route],sid=source(page);
  if(!report||!['scout','unknown'].includes(prior.mode))throw Error('Unexpected recruitment resolution: '+id);
  e.recruitmentHistory??={};e.recruitmentHistory[route]=[prior];
  e.recruitment[route]={...prior,mode:'scout',support:report.support,renown:report.renown,sourceId:sid,requirementSourceId:prior.mode==='unknown'?sid:prior.sourceId,resolution:'game8-jp',checked:conflictData.checked};
  if(id==='yang-jie')e.recruitment[route].requirement='Answer Questions';
  const priorFact=e.facts.find(f=>f.key==='game8-recruitment-'+route);
  if(priorFact){e.resolvedFactHistory??=[];e.resolvedFactHistory.push(priorFact);}
  fact(e,'game8-recruitment-'+route,'영입 조건 채택 · '+route,'Selected recruitment · '+route,`지원 ${report.support} / 명성 ${report.renown} — Game8 일본어 기준. 추가 요구품·퀘스트 조건도 충족해야 합니다.`,`Support ${report.support} / renown ${report.renown} — Game8 JP selected. Additional item and quest requirements still apply.`,sid);
  cite(e,sid);
 }
 get('loretta').note=bi('디트리히 명성은 Game8 일본어 기준 9를 채택합니다. RPG Site 서두의 8은 이전 보고로 보존합니다.','Dietrich renown 9 is selected from Game8 JP. RPG Site’s introductory value of 8 is retained as an earlier report.');
 get('nezha').note=bi('세오도라 지원은 Game8 일본어 기준 2를 채택합니다. 모래 벌레 고기 3개 등 추가 조건은 유지합니다. Raider King의 3은 이전 보고입니다.','Theodora support 2 is selected from Game8 JP. Three Sandworm Meat and other requirements remain. Raider King’s 3 is an earlier report.');
 const yang=get('yang-jie'),oldAnswer=yang.facts.find(f=>f.key==='answers');
 yang.resolvedFactHistory??=[];yang.resolvedFactHistory.push(oldAnswer);
 fact(yang,'answers','권장 영입 답변 (Game8)','Recommended recruitment answers (Game8)','치즈 → 보름달의 밤 → 과실','Cheese → Full moon → Fruit',source(816446));
 yang.communityNotes=(yang.communityNotes||[]).map(n=>n.sourceId==='translated-guide'?{...n,text:bi('Game8 일본어의 과실 답변을 채택했습니다. RPG Site의 감자는 이전 보고로 보존하며, 다른 답변의 성공 여부는 미확인입니다.','The fruit answer from Game8 JP is selected. RPG Site’s potato answer is retained as an earlier report; other accepted answers remain unverified.')}:n);
 for(const report of conflictData.growth){
  const e=get(report.id),{id,...selected}=report;
  e.growthHistory=[structuredClone(e.growthRates),...(e.growthAlternative?[structuredClone(e.growthAlternative)]:[]),...structuredClone(e.communityGrowthReports||[])];
  e.growthRates=structuredClone(selected);
  // Only genuinely different historical values belong in the comparison block.
  e.communityGrowthReports=e.growthHistory.filter((r,i,a)=>!same(r.values,selected.values)&&a.findIndex(x=>x.sourceId===r.sourceId&&same(x.values,r.values))===i);
  delete e.growthAlternative;
  fact(e,'growth-resolution','성장률 기준','Growth-rate source','Game8 일본어 원문 기준. 다른 수치는 아래 이전 출처 비교에 보존합니다.','Game8 JP selected. Differing values remain in the historical source comparison below.',selected.sourceId);
 }
 for(const report of conflictData.modifiers){
  const e=get(report.id),{id,...selected}=report;
  e.classStatHistory=[{...structuredClone(e.classStats.modifiers),field:'modifiers'},...structuredClone(e.classStatAlternatives||[])];
  e.classStats.modifiers=structuredClone(selected);
  e.classStatAlternatives=e.classStatHistory.filter(r=>r.field!=='modifiers'||!same(r.values,selected.values)||r.movement!=null);
  fact(e,'modifier-resolution','병종 보정치 기준','Class modifier source','Game8 일본어의 보정치 표를 채택했습니다. 이동 보정량은 미확인으로 두고 이동력 자체를 별도로 표시합니다.','Game8 JP stat modifiers selected. The movement modifier is unverified; absolute movement is listed separately.',selected.sourceId);
  fact(e,'game8-absolute-movement','이동력 (Game8)','Movement (Game8)',String(selected.absoluteMovement),String(selected.absoluteMovement),selected.sourceId);
 }
 // The +20 report for Mu describes the already displayed personal-skill-adjusted row.
 const mu=get('mu');
 mu.modifiedGrowthReports=(mu.communityGrowthReports||[]).filter(r=>same(r.values,mu.modifiedGrowthRates.values));
 mu.communityGrowthReports=(mu.communityGrowthReports||[]).filter(r=>!same(r.values,mu.modifiedGrowthRates.values));
 const halvin=get('halvin'),garum=halvin.gifts.find(g=>g.itemId==='garum');
 if(!garum)throw Error('Missing Halvin Garum report');
 halvin.giftHistory=[structuredClone(garum)];Object.assign(garum,{preference:'loved',sourceId:source(816457)});
 fact(halvin,'garum-resolution','가룸 선호도','Garum preference','Game8 일본어의 매우 좋아함을 채택했습니다. 이전 영어 추출본은 좋아함으로 기록했습니다.','Loved is selected from Game8 JP. The earlier English export recorded liked.',source(816457));
 const meat=get('sandworm-meat');
 meat.trade={ingredientJa:'リガネット',quantity:10,sourceId:source(817080)};
 meat.communityNoteHistory=structuredClone(meat.communityNotes);
 meat.communityNotes=meat.communityNotes.map(n=>n.sourceId==='dc-750384'?{...n,text:bi('반달상회 교환은 Game8 일본어 기준 리가네트 10개를 채택합니다. 기존 30개 보고는 이력으로 보존하며 수량 단위의 차이는 미확인입니다.','The Vandal trader exchange uses 10 Riganet according to Game8 JP. The earlier 30 report is retained; its quantity basis is unverified.')} :n.sourceId==='dc-754849'?{...n,text:bi('키라 마을 탐색 동선은 기존 보고를 참고합니다. 판매 가격은 Game8 일본어 240G를 채택하고 기존 300G 보고는 이력으로 보존합니다.','Keep the earlier Kira village discovery report. Game8 JP lists 240G; the earlier 300G report is retained as history.')} :n);
 for(const l of meat.links)if(l.to==='alecto-city'){l.label=bi('반달상회 · 리가네트 10개 교환','Vandal trader · 10 Riganet');l.sourceId=source(817080);}else if(l.to==='kira-village'){l.label=bi('시장 · 240G (Game8)','Market · 240G (Game8)');l.sourceId=source(817080);}
 const purchase=meat.facts.find(f=>f.key==='game8-report-817080');purchase.sourceId=source(817080);cite(meat,source(817080));
 for(const id of ['meganius','dark-pegasus']){
  const e=get(id),f=e.facts.find(f=>f.key==='game8-food-conflict');
  f.label=bi('선호 맛 채택','Selected flavor');f.valueKo='Game8 일본어의 매운맛을 채택했습니다. 이전 커뮤니티의 다른 보고는 출처 비교에 보존합니다.';f.value='Spicy is selected from Game8 JP. Differing community reports remain in the source comparison.';
 }
 for(const [id,page] of [['talimun',816695],['orchel',816783]]){
  const e=get('paralogue-'+id);e.scheduleHistory=[structuredClone(e.schedule)];e.schedule=structuredClone(e.schedule);
  e.schedule.sourceId=source(page);e.schedule.deadlineSourceId='paralogue-schedule';cite(e,source(page));
  if(id==='talimun'){
   e.schedule.routes.dietrich.windows[0][1]='09/19';
   for(const r of Object.values(e.schedule.routes))r.windows[1][1]='10/12';
   e.schedule.note=bi('수주 기간은 Game8 일본어 기준입니다. 디트리히 첫 기간은 9/19까지, 세 루트의 두 번째 기간은 10/12까지입니다. 기존 RPG Site의 9/22·10/10과 차이가 있으며 완료 마감 10/12는 유지합니다.','Acceptance follows Game8 JP: Dietrich’s first window ends September 19; the second ends October 12 on all three routes. Earlier RPG Site dates were September 22 / October 10. The October 12 completion deadline is retained.');
  }else{
   e.schedule.routes.cai.windows[0][1]='10/19';
   for(const route of ['dietrich','leda'])e.schedule.routes[route].windows[0][1]='10/27';
   // Preserve the distinct chapter cutoff, not Game8’s generic calendar end.
   e.schedule.routes.theodora.reportedWindows=[['10/18','10/27']];
   e.schedule.note=bi('수주는 Game8 일본어 기준: 카이 10/19, 디트리히·레다 10/27까지. 세오도라는 Game8 표기 10/27과 별개로 12장 종료 10/24를 실제 마감으로 유지합니다. 카이 완료 마감 10/21도 별도입니다. 이전 수주 종료 10/20·10/25는 이력에 보존합니다.','Acceptance follows Game8 JP: Cai through October 19, Dietrich/Leda through October 27. Theodora retains the effective chapter-12 cutoff of October 24, distinct from Game8’s October 27 calendar date. Cai’s completion deadline remains October 21. Earlier acceptance ends of October 20/25 are retained as history.');
  }
 }
}
