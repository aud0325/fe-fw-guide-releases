import {content,formatContent} from './locales/content.mjs';
export const paralogueSource={title:'RPG Site · Paralogue windows — Adam Vitale',url:'https://www.rpgsite.net/guide/21387-fire-emblem-fortunes-weave-paralogues-how-to-access-all-paralogue-battles-where-to-find-them',kind:'guide',note:content['paralogues.checked-september-25-2026-acceptance-windows-and-effective-deadlines']};
const period=(start,end,deadline)=>({windows:[[start,end]],deadline});
const shared=(ids,value)=>Object.fromEntries(ids.map(id=>[id,structuredClone(value)]));
const trio=['cai','dietrich','theodora'];
export const paralogueSchedule={
 leda:{title:'Diversionary Tactics',giver:'leda',place:'Temple Row',routes:shared(['dietrich','theodora'],period('09/02','09/08','09/08')),note:content['paralogues.battle-on-9-8-a-community-schedule-instead-lists']},
 theodora:{title:'Missing Brave-Warrior Statue',giver:'bonaventure',place:'Temple Row',routes:{dietrich:period('09/03','09/12','09/15')}},
 bertrand:{title:"Friendly Match with Brigid's King",giver:'gabriel',place:'Arena Square',routes:{...shared(['cai','theodora'],period('09/17','09/25','09/25')),dietrich:period('09/17','09/17','09/17')},note:content['paralogues.dietrich-must-accept-and-complete-this-on-9-17']},
 talimun:{title:'Secret of the Vanished Carriage',giver:'talimun',place:'Port',routes:shared(trio,{windows:[['09/17','09/22'],['10/01','10/10']],deadline:'10/12'}),note:content['paralogues.dietrich-first-window-end-differs-rpg-site-9-22']},
 anna:{title:'Golden Secret',giver:'anna',place:'Dagsion Summit',routes:{...shared(['cai','theodora'],period('09/24','10/05','10/05')),dietrich:period('09/29','10/05','10/05')}},
 anatolia:{title:'Queen of the Erased',giver:'anatolia',place:'City Streets',routes:shared(['dietrich','leda'],period('10/05','10/14','10/17'))},
 cai:{title:'Great Escape',giver:'cai',place:'City Streets',routes:shared(['dietrich','theodora','leda'],period('10/16','10/22','10/22')),note:content['paralogues.battle-on-10-22']},
 dietrich:{title:'Sealed-Off Past',giver:'fabio',place:'Arena',routes:{theodora:period('10/16','10/24','10/24'),leda:period('10/16','10/22','11/01')},note:content['paralogues.theodora-s-actual-cutoff-is-chapter-12-ending-10']},
 orchel:{title:"Orchel's Regret",giver:'orchel',place:'Lower Temple Row',routes:{cai:period('10/18','10/20','10/21'),dietrich:period('10/18','10/25','10/27'),theodora:period('10/18','10/24','10/24'),leda:period('10/18','10/25','10/27')},note:content['paralogues.cai-and-theodora-end-earlier-than-the-generic-10']}
};
// Japanese acceptance windows are distinct from the retained completion/chapter cutoffs.
const acceptanceReview={
 theodora:{page:816854,ends:{dietrich:'09/15'},note:{ko:'수주 종료는 Game8 일본어 9/15를 채택합니다. RPG Site의 이전 수주 종료는 9/12이며, 별도 완료 마감 9/15는 유지합니다.',en:'Acceptance ends September 15 according to Game8 JP, rather than RPG Site’s September 12. The separate September 15 completion deadline is retained.'}},
 anatolia:{page:816835,ends:{dietrich:'10/17',leda:'10/17'},note:{ko:'수주 종료는 Game8 일본어 10/17을 채택합니다. RPG Site의 이전 수주 종료는 10/14이며, 별도 완료 마감 10/17은 유지합니다.',en:'Acceptance ends October 17 according to Game8 JP, rather than RPG Site’s October 14. The separate October 17 completion deadline is retained.'}},
 dietrich:{page:816837,ends:{leda:'11/01'},note:{ko:'레다의 수주 종료는 Game8 일본어 11/1을 채택합니다(RPG Site 이전 수주 종료 10/22). 세오도라는 Game8의 11/1 표기와 별개로 12장 종료 10/24를 수주·완료 마감으로 유지합니다.',en:'Leda’s acceptance ends November 1 according to Game8 JP (previously October 22 in RPG Site). Theodora retains the October 24 chapter-12 cutoff for acceptance and completion, distinct from Game8’s November 1 listing.'}}
};
export function applyParalogues(merged,sources){
 sources['paralogue-schedule']=paralogueSource;
 for(const [owner,schedule]of Object.entries(paralogueSchedule)){
  const e=merged.get('paralogue-'+owner);if(!e)throw Error('Missing paralogue '+owner);
  const character=merged.get(owner),giver=merged.get(schedule.giver);
  e.type='paralogue';e.status='guide';e.schedule={...schedule,owner,sourceId:'paralogue-schedule'};
  e.name.en=schedule.title;e.routeIds=Object.keys(schedule.routes);
  e.summary=formatContent('paralogue-summary',{ko:{owner:character.name.ko,giver:giver.name.ko},en:{owner:character.name.en,giver:giver.name.en}});
  e.aliases=[...new Set([...e.aliases,'외전','Paralogue',character.name.ko,character.name.en,...character.aliases,giver.name.ko,giver.name.en,character.group||'',character.koreanNameEvidence?.section||'',...Object.values(schedule.routes).flatMap(r=>[...r.windows.flat(),r.deadline])])];
  e.sourceIds=[...new Set([...e.sourceIds,'paralogue-schedule'])];
  if(!e.links.some(l=>l.to===giver.id))e.links.push({to:giver.id,label:content['paralogues.quest-giver'],sourceId:'paralogue-schedule'});
  const review=acceptanceReview[owner];
  if(review){
   const sid=`game8-jp-${review.page}-paralogue-review`;
   sources[sid]={title:{ko:`Game8 JP · ${character.name.ko} 외전 수주 기간`,en:`Game8 JP · ${character.name.en} paralogue acceptance`},url:`https://game8.jp/fe-banshisenko/${review.page}`,kind:'guide',checked:'2026-10-01',note:{ko:'개별 일본어 원문의 수주 기간을 대조했습니다. 완료 마감과 장 종료 조건은 별도 출처를 유지하며 게임 내 실기 검증은 아닙니다.',en:'Individual Japanese acceptance windows checked. Completion and chapter cutoffs retain their separate source; not verified in-game.'}};
   e.scheduleHistory=[structuredClone(e.schedule)];e.schedule=structuredClone(e.schedule);
   e.schedule.sourceId=sid;e.schedule.deadlineSourceId='paralogue-schedule';e.schedule.note=review.note;
   for(const [route,end] of Object.entries(review.ends))e.schedule.routes[route].windows[0][1]=end;
   if(owner==='dietrich')e.schedule.routes.theodora.reportedWindows=[['10/16','11/01']];
   e.sourceIds.push(sid);
  }
 }
}
export function dateValue(value){const [m,d]=value.split('/').map(Number);return m*100+d;}
export function scheduleRows(list,route='all',order='start'){
 return list.filter(e=>e.schedule).map(e=>({e,windows:Object.entries(e.schedule.routes).filter(([id])=>route==='all'||route===id)})).filter(r=>r.windows.length).sort((a,b)=>{
  if(order==='owner')return a.e.schedule.owner.localeCompare(b.e.schedule.owner);
  const key=row=>Math.min(...row.windows.flatMap(([,v])=>order==='deadline'?[dateValue(v.deadline)]:v.windows.map(w=>dateValue(w[0]))));
  return key(a)-key(b)||a.e.id.localeCompare(b.e.id);
 });
}
