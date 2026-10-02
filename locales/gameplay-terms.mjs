// Editorial display translations, not official names. Source values and ranks stay intact.
export const generalTerms={
 'Male':'남성','Female':'여성','Chosen by the player':'플레이어 선택','Unknown':'미확인',
 'Sweet':'단맛','Spicy':'매운맛','Delicacy':'진미','Bitter':'쓴맛','Sweet (author uncertain)':'단맛 (작성자도 확실하지 않음)',
 'Recruitment requirements':'영입 조건','Acquisition location':'획득 장소','Exact capture location':'정확한 포획 장소','Food preference':'먹이 취향',
 'Unannounced Playable Characters':'동료 (소속 미공개)','1454: Tutorial Bosses':'1454년: 튜토리얼 보스',
 '1449: Bosses against Ribeira Winds':'1449년: 히베이라의 바람 적대 세력','1449: Bosses against House Lamine':'1449년: 라민 일가 적대 세력',
 "1449: Bosses against Megaira's Beacon":'1449년: 메가에라의 등불 적대 세력','1449: Bosses against Rose Tempest':'1449년: 장미의 폭풍 적대 세력','Others/Unconfirmed':'기타·미확인',
 'Commoner/Diviner':'평민 / 점술사','Sea Beast':'해수',
 'Clashes only':'격돌 시에만 적용','Part X':'부 번호 미확인',
 'quest':'퀘스트','quest-reward':'퀘스트 보상','story':'스토리 진행','other':'기타','dungeon-reward':'던전 보상','chapter-reward':'장 완료 보상','chest':'보물상자','dungeon-chest':'던전 보물상자','bulletin':'게시판','drop':'적 드롭',
 'Cheese → Moon → Potatoes':'치즈 → 달 → 감자',
 '12/2 Dagdan Year 1433':'다그다력 1433년 12월 2일','28th of April Dagdan Year 1426':'다그다력 1426년 4월 28일','27th of the Ethereal Moon (December 27th)':'천상의 달 27일 (12월 27일)',
 'might':'위력','hit':'명중','crit':'필살','weight':'무게','range':'사거리','uses':'사용 횟수',
 '포획 동선 보고 · Part I':'포획 동선 보고 · 1부',
 '175 cm (male) 167 cm (female)':'남성 175cm / 여성 167cm',
 'Restores (damage dealt / 2) HP to the user.':'가한 피해의 절반만큼 사용자의 HP를 회복한다.',
 'Ignores the effect of enemy Underworld Boon.':'적의 명부의 가호 효과를 무시한다.',
 'Grants +10 hit when using a combat art.':'전투 기술 사용 시 명중 +10.',
 'Targets foe\'s defense. Effective against flying units.':'적의 수비를 기준으로 피해를 준다. 비행 유닛에게 특효.',
 'Sword training, fishing':'검술 수련, 낚시','Writing fables, preaching, teaching':'우화 집필, 설교, 교육','Classroom study, archery training':'학과 공부, 궁술 수련',
 'Python Technique fighting, attending to Aswan':'비단뱀 권법 수련, 아스완 보좌',
 'The teachings of Seiros, fishing, his daughter, hardworking people':'세이로스의 가르침, 낚시, 딸, 근면한 사람',
 "Dante's plays, board games, sewing, beautiful landscapes":'단테의 희곡, 보드게임, 바느질, 아름다운 풍경','Reading, sewing, training':'독서, 바느질, 수련'
};
const skills={
 'Authority Skill':'지휘술','Spear Skill':'창술','Sword Skill':'검술','Axe Skill':'도끼술','Bow Skill':'궁술','Gauntlet Skill':'격투술',
 'White Magic Skill':'백마술','Black Magic Skill':'흑마술','Infantry Skill':'보병술','Heavy Armor Skill':'중장술','Flying Skill':'비행술','Riding Skill':'기마술',
 'Heavy Armor':'중장술','White Magic':'백마술','Black Magic':'흑마술',
 Swords:'검',Spears:'창',Axes:'도끼',Bows:'활',Sword:'검술',Spear:'창술',Axe:'도끼술',Bow:'궁술',Gauntlet:'격투술',Brawling:'격투술',Reason:'흑마술',Faith:'백마술',
 Riding:'기마술',Flying:'비행술',Infantry:'보병술',Heavy:'중장술',Rider:'기마술',Flier:'비행술',All:'모든 무기'
};
const unitTypes={Infantry:'보병',Cavalry:'기병',Armored:'중갑',Flying:'비행'};
const movement={foot:'보행',mounted:'기승',flying:'비행'};
const stats={Hit:'명중',Weight:'무게',Def:'수비',Res:'마방',Crit:'필살',Str:'힘',Mag:'마력',Spd:'속도',Dex:'기술',Lck:'행운',Cha:'매력',Avoid:'회피',Move:'이동력',turn:'턴'};
const arts={'Bloodletting':'출혈','Deadly Blade':'치명검','Toxic Wind':'독풍','Siphon Luck':'행운 흡수','Deadeye':'정밀 사격','??':'미확인','Full Moon':'만월','Compressed Laser':'압축 광선','Brute Throw':'강력 투척','Prune':'가지치기'};
const classSkills={
 'Magic Basics':'마법의 기초','Attack Basics':'공격의 기초','Hunting Basics':'사냥의 기초','Defense Basics':'방어의 기초','Mount/Dismount':'기승 / 하마',
 'War-Elephant Boots':'전투 코끼리의 발걸음','Elephant Tactics':'코끼리 전술',"Elephant Rider's Path":'코끼리 기수의 길',
 'Combat Arts':'전투 기술','Bow Hit':'활 명중','Strike-Last Def':'후공 시 수비','Black-Magic Seeker':'흑마술 탐구','Magic Heal':'마법 회복량','Magic Hit':'마법 명중',
 'White-Magic Seeker':'백마술 탐구','Brawl Avo':'격투 회피','Sword Crit':'검 필살','Dance':'춤','Axe Hit':'도끼 명중','Brawl Hit':'격투 명중',
 'White-Magic Zenith':'백마술의 극의','Locktouch':'자물쇠 해제','Ultimate Search':'탐색의 극의','Golden Ride':'황금 기승','All-Magic Zenith':'모든 마법의 극의',
 'Pavise':'대방패','Elephant Vanguard':'코끼리 선봉',"Hunter's Cross":'사냥꾼의 십자격','Fierce Shield':'맹렬한 방패','Astra':'유성','Song of Courage':'용기의 노래','Strike and Heal':'공격과 치유',
 'Divine Insight':'신의 통찰','Divine Dance':'신의 춤','Divine Might':'신의 힘','Divine Adornment':'신의 장식','Divine Will':'신의 의지','Divine Wall':'신의 방벽','Divine Dexterity':'신의 기교','Divine Law':'신의 법칙'
};
function replaceTerms(value,terms){
 const pattern=Object.keys(terms).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
 return value.replace(new RegExp('(?<![A-Za-z])('+pattern+')(?![A-Za-z])','g'),term=>terms[term]);
}
export function koreanGameplayValue(value,key=''){
 const source=String(value??'');
 if(generalTerms[source])return generalTerms[source];
 if(['pref_skills','nonideal_skills','weapons','other-skills','proficiency'].includes(key))return replaceTerms(source,skills);
 if(key==='unit-type')return replaceTerms(source,unitTypes);
 if(key==='movement')return movement[source]||source;
 if(['bonuses','decay'].includes(key))return replaceTerms(source,stats).replace(/\s*\/\s*턴/g,' / 턴');
 if(['skills','mastery'].includes(key))return replaceTerms(source,classSkills);
 if(key==='unlock')return replaceTerms(source,{Cai:'카이',Dietrich:'디트리히',Theodora:'세오도라',Leda:'레다'});
 if(['joins','first-appearance'].includes(key))return source
  .replace('Prologue: Descent','서장: 강림').replaceAll('Part I:','1부:')
  .replace(/(Cai|Dietrich|Theodora|Leda)'s Path/g,(_,name)=>({Cai:'카이',Dietrich:'디트리히',Theodora:'세오도라',Leda:'레다'}[name])+' 루트')
  .replace(/Chapter (\d+|x)/g,(_,chapter)=>chapter==='x'?'장 번호 미확인':chapter+'장')
  .replace("Friendly Match with Brigid's King",'브리기트 왕과의 친선전').replace('(Quest)','(퀘스트)');
 if(key==='effect')return source
  .replace('Effective against cavalry units and armored units.','기병·중갑 유닛에게 특효.')
  .replace(/Effective(\+)? against (flying|cavalry|armored|beast|undead) units\.?/g,(_,plus,type)=>({flying:'비행',cavalry:'기병',armored:'중갑',beast:'야수',undead:'언데드'}[type])+' 유닛에게 '+(plus?'강화 특효.':'특효.'))
  .replace(/Grants access to the (.+?) combat art\./g,(_,art)=>'전투 기술 「'+(arts[art]||art)+'」 사용 가능.')
  .replace('Works as magic damage.','마법 피해로 적용된다.').replace('+3 avoid when initiating combat.','선제공격 시 회피 +3.');
 if(key==='capture-jp')return source.replace('(translated place names)','(지명 임시 번역)').replace('Recruit Alexandra','알렉산드라 영입').replaceAll('Oleance Plains','올레안스 평원');
 return source;
}
