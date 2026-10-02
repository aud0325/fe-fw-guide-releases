// Administrator-reported Korean game labels; the English names and stable IDs are preserved.
export const userNameCorrections={velheit:'사부 벨하이트','azagas-bow':'아가제의 활',halberd:'핼버드',bolganone:'볼케논','cleansing-blade':'재계의 검',veroquine:'사검 벨로키네',ridersbane:'나이트 킬러','short-spear':'쇼트 스피어','short-axe':'쇼트 액스',longbow:'롱 보우'};
export const userWeaponMatches={'cleansing-blade':'清めの剣',veroquine:'邪剣ヴェロキネ',ridersbane:'ナイトキラー','short-spear':'ショートスピア','short-axe':'ショートアクス',longbow:'ロングボウ'};
export function applyUserNameCorrections(db,sources){
 const sourceId='user-item-names-20260926';
 sources[sourceId]={title:{ko:'관리자 게임 내 명칭 확인 · 2026-09-26',en:'Administrator-reported in-game Korean names · 2026-09-26'},url:'./evidence/item-names-20260926.html',kind:'reference',note:{ko:'관리자가 게임에서 확인해 전달한 한국어 표기 10건입니다. 이번 전달에는 별도 화면이 첨부되지 않았습니다.',en:'Ten Korean labels reported by the administrator after checking the game. No additional screenshot accompanied this report.'}};
 for(const [id,ko] of Object.entries(userNameCorrections)){
  const e=db.get(id);if(!e)throw new Error(`Unknown corrected item: ${id}`);
  e.aliases=[...new Set([...e.aliases,e.name.ko,ko])];
  e.name={...e.name,ko};e.translation='user-reported';
  e.koreanNameEvidence={sourceId,method:'user-reported-game-label',checked:'2026-09-26'};
  e.sourceIds=[...new Set([...e.sourceIds,sourceId])];
 }
 const jpSource='game8-jp-817514';
 sources[jpSource]={title:{ko:'Game8 일본어판 · 무기 목록',en:'Game8 Japanese weapon list'},url:'https://game8.jp/fe-banshisenko/817514',kind:'guide',note:{ko:'2026-09-26 무기 이름·요구 기능·사거리를 대조했습니다. 한국어 이름은 관리자 제보에 근거합니다.',en:'Weapon names, required skills and ranges compared on 2026-09-26. Korean names are administrator-reported.'}};
 for(const [id,jp] of Object.entries(userWeaponMatches)){
  const e=db.get(id);e.aliases=[...new Set([...e.aliases,jp])];
  e.japaneseNameEvidence={name:jp,sourceId:jpSource,checked:'2026-09-26',method:'name-and-weapon-properties-match'};
  e.sourceIds=[...new Set([...e.sourceIds,jpSource])];
 }
 const sword=db.get('veroquine'),prior=sword.facts.find(f=>f.key==='rank');
 if(prior){prior.key='prior-index-rank';prior.label={ko:'기존 영어 색인 요구 랭크 · 불완전한 참고값',en:'Prior English index rank · incomplete reference'};}
 sword.facts.push({key:'rank',label:{ko:'요구 기능 · 관리자 제보 / Game8',en:'Required skills · administrator report / Game8'},value:'Sword B / Axe C',valueKo:'검 B / 도끼 C',literal:true,sourceId:jpSource});
}

// Apply after weapon expansion so regenerated provisional labels cannot replace reports.
export function applyUserWeaponCorrections(db,sources){
 const bi=(ko,en)=>({ko,en}),sourceId='user-assal-20260930';
 sources[sourceId]={title:bi('관리자 · 성스러운 창 아살 명칭·소지·무기 설명','Administrator · Assal Korean label, carried weapon and description'),url:'./evidence/assal-20260930.html',kind:'reference',checked:'2026-09-30',note:bi('관리자가 전달한 한국어 이름·전투 기술명·무기 설명과 세테스의 기본 소지 정보입니다. 별도 화면은 첨부되지 않았으며 독립 실기 검증은 하지 않았습니다.','The administrator supplied the Korean weapon label, combat art name, weapon description and Seteth’s default possession. No screenshot accompanied the report; it has not been independently reproduced.')};
 const e=db.get('assal');if(!e||!db.has('seteth'))throw Error('Missing Assal or Seteth');
 e.aliases=[...new Set([...e.aliases,e.name.ko,e.name.ko.replace(/\([^()]*\)$/,''),'성스러운 창 아살'])];
 e.name={...e.name,ko:'성스러운 창 아살'};e.translation='user-reported';e.translationSourceId=sourceId;
 e.koreanNameEvidence={sourceId,method:'user-reported-game-label',checked:'2026-09-30'};
 e.sourceIds=[...new Set([...e.sourceIds,sourceId])];
 e.summary=bi('세테스가 기본적으로 소지한 창. 전투 기술 [성격] 사용 가능.','A spear carried by Seteth by default. Grants the 성격 combat art (Korean name).');
 const effect=e.facts.find(f=>f.key==='effect');if(!effect)throw Error('Missing Assal combat art');
 effect.valueKo='전투 기술 [성격] 사용 가능';effect.translationSourceId=sourceId;
 e.facts.push({key:'weapon-description',label:bi('무기 설명','Weapon description'),value:'A spear that Seteth forged himself long ago. Grants the 성격 combat art (Korean name).',valueKo:'일찍이 세테스가 스스로 단조한 창.\n전투 기술 [성격] 사용 가능',literal:true,sourceId});
 e.acquisition=[...(e.acquisition||[]),{method:bi('기본 소지','Default possession'),where:bi('세테스가 기본적으로 소지','Carried by Seteth by default'),characterId:'seteth',status:'user-reported',sourceId}];
 e.links=[...(e.links||[]),{to:'seteth',label:bi('기본 소지 캐릭터','Default carrier'),sourceId}];
 e.missing=(e.missing||[]).filter(v=>v!=='Acquisition location');
 e.note=bi('한국어 이름·전투 기술명·무기 설명과 세테스의 기본 소지는 관리자 제보에 근거합니다. 성능·요구 기능은 기존 일본어 Game8 값을 유지합니다.','The Korean label, combat art name, weapon description and Seteth’s default possession are administrator-reported. Stats and required skills retain the Japanese Game8 values.');
}
