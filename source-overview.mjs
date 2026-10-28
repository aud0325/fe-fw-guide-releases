import {referenceSite,localized} from './presentation.mjs';
import {escapeHtml as esc} from './core.mjs';
import {icon} from './icons.mjs';

// Site introductions belong to the index; article-level evidence stays on details.
const providers={
 'forums.serenesforest.net':{name:'Serenes Forest Forums',url:'https://forums.serenesforest.net/topic/108370-mounts-give-bonus-stats-and-growth-rates/',ko:'파이어 엠블렘 플레이어 포럼. 야생 탈것의 이름과 포획 장소를 참고했습니다.',en:'A player forum used for wild mount names and capture locations.'},
 'annasnotebook.net':{name:'Anna’s Notebook',url:'https://annasnotebook.net/en/',ko:'커뮤니티 공략 도감. 아이템 영문명·획득처와 개인스킬의 강화 조건을 참고했습니다.',en:'A community guide used for English item names, gathering locations and personal ability upgrade conditions.'},
 'neoseeker.com':{name:'Neoseeker',url:'https://www.neoseeker.com/fire-emblem-fortunes-weave/',ko:'영문 게임 공략 사이트. 지명과 탐색 동선을 참고했습니다.',en:'An English walkthrough used for location names and exploration routes.'},
 'videogameschronicle.com':{name:'VGC',url:'https://www.videogameschronicle.com/guide/fire-emblem-fortunes-weave-yaamanthemum-location-petals-of-encouragement-quest-guide/',ko:'게임 전문 매체. 야먼 국화의 영문명과 획득처를 참고했습니다.',en:'Gaming coverage used for the English name and acquisition of Yaamanthemum.'},
 game8:{name:'Game8',url:'https://game8.jp/fe-banshisenko/',ko:'일본어·영어 게임 공략 사이트. 영입 조건, 병종·장비·기술, 획득처와 추천 육성 경로를 참고했습니다.',en:'Japanese and English game guides used for recruitment, classes, equipment, abilities, acquisition and training recommendations.'},
 'nintendo.com':{name:'Nintendo',ko:'게임 공식 소개. 작품 개요와 주요 시스템 설명을 참고했습니다.',en:'Official game coverage used for the game overview and core systems.'},
 'rpgsite.net':{name:'RPG Site',ko:'영문 RPG 공략 매체. 캐릭터 영입, 외전 일정과 던전 획득물을 참고했습니다.',en:'English-language RPG coverage used for recruitment, paralogue schedules and dungeon rewards.'},
 'fireemblemwiki.org':{name:'Fire Emblem Wiki',ko:'파이어 엠블렘 시리즈 팬 위키. 캐릭터·병종·무기의 영문 명칭과 초상화를 참고했습니다.',en:'A Fire Emblem fan wiki used for English character, class and weapon names, and character portraits.'},
 'namu.wiki':{name:{ko:'나무위키',en:'Namu Wiki'},sourceId:'namu',ko:'한국어 위키. 등장인물·병종·탈것·혈인과 한국어 명칭을 참고했습니다.',en:'A Korean wiki used for characters, classes, mounts, crests and Korean names.'},
 'al-gest.com':{name:'AlGest',ko:'일본어 게임 공략 사이트. 캐릭터별 육성 방향과 병종 경로를 참고했습니다.',en:'A Japanese game guide site used for character training and class paths.'},
 'allthings.how':{name:'AllThingsHow',ko:'영문 공략·사용법 사이트. 식물·광석·물고기의 채집 지역을 참고했습니다.',en:'An English guide site used for plant, stone and fish gathering locations.'},
 'appmedia.jp':{name:'AppMedia',ko:'일본어 게임 공략 사이트. 메이스와 마법 습득 아이템의 획득 조건을 참고했습니다.',en:'A Japanese game guide site used for Mace and spell-learning item requirements.'},
 'bluegirl6.blogspot.com':{name:'My Way',ko:'개인 게임 블로그. 음성 설정 경험담을 참고했습니다.',en:'A personal gaming blog used for a player report on voice settings.'},
 'cass07.github.io':{name:{ko:'Cass07 · 만자천홍 DB',en:'Cass07 · Fortune’s Weave DB'},url:'https://cass07.github.io/fe18-db/',ko:'커뮤니티 제작 데이터베이스. 개인·병종 성장률, 능력치 보정과 외전 일정을 참고했습니다.',en:'A community database used for character and class growth rates, stat modifiers and paralogue schedules.'},
 'dcinside.com':{name:{ko:'디시인사이드 · 파이어 엠블렘 갤러리',en:'DC Inside · Fire Emblem gallery'},url:'https://gall.dcinside.com/mgallery/board/view/?id=fireemblem&no=746786',ko:'한국어 게임 커뮤니티. 영입·외전·육성 공략, 탈것 포획과 게임 화면 제보를 참고했습니다.',en:'A Korean gaming community used for recruitment, paralogues, training, mount capture and gameplay screenshots.'},
 'docs.google.com':{name:{ko:'커뮤니티 기술표',en:'Community ability spreadsheet'},url:'https://docs.google.com/spreadsheets/d/1YW5AdvPUbLPr1RAGlnotcRaNTFCQPTKiIgshwrcdUtE/edit',ko:'플레이어들이 정리한 스프레드시트. 장비와 전투 기술의 대응 정보를 참고했습니다.',en:'A player-compiled spreadsheet used for equipment and combat art connections.'},
 'edricsn.com':{name:{ko:'에드릭슨',en:'Edricsn'},ko:'한국어 게임 공략 블로그. 캐릭터·병종·무기 명칭과 무기 성능을 참고했습니다.',en:'A Korean game guide blog used for character, class and weapon names, and weapon stats.'},
 'fefw.azaws.workers.dev':{name:{ko:'만자천홍 육성 도감',en:'Fortune’s Weave training guide'},ko:'커뮤니티 번역 육성 도감. 캐릭터별 육성 안내의 구성을 참고했습니다.',en:'A community-translated training guide used as a reference for character training guide structure.'},
 'forums.somethingawful.com':{name:'Something Awful',ko:'영문 커뮤니티 게시판. 탈것의 선호 먹이와 포획 경험담을 참고했습니다.',en:'An English-language forum used for preferred mount foods and capture reports.'},
 'gamecap.jp':{name:'Gamecap',ko:'일본어 게임 공략 사이트. 1부·3부 상점의 판매 품목을 참고했습니다.',en:'A Japanese game guide site used for Part I and Part III shop inventories.'},
 'gamewith.jp':{name:'GameWith',ko:'일본어 게임 공략 사이트. 마법 습득 아이템과 획득처를 참고했습니다.',en:'A Japanese game guide site used for spell-learning items and their acquisition.'},
 'github.com':{name:'Rico0319 · Fortune’s Weave Helper',ko:'커뮤니티 제작 도감의 공개 저장소. 캐릭터 데이터와 연결된 공략 자료를 참고했습니다.',en:'A public community guide repository used for character data and linked guide material.'},
 local:{name:{ko:'제공된 게임 화면·플레이 정보',en:'Provided gameplay materials'},ko:'직접 제공된 게임 자료. 한국어 명칭, 아이템 설명·획득처와 지도·탈것 정보를 참고했습니다.',en:'Provided game materials used for Korean names, item descriptions and acquisition, maps and mounts.'},
 'ndw.jp':{name:'Nintendo DREAM WEB',ko:'일본 게임 매체. 저장 방식과 스카우트 등 게임 시스템 해설을 참고했습니다.',en:'A Japanese gaming publication used for explanations of saving, scouting and other game systems.'},
 'note.com':{name:{ko:'ph0zzy · 플레이 기록',en:'ph0zzy · Player notes'},ko:'개인 플레이 기록. 다그시온 상회의 아이템 교환 정보를 참고했습니다.',en:'Personal play notes used for item exchanges at the Dagsion trader.'},
 'raiderking.com':{name:'Raider King',ko:'영문 게임 공략 사이트. 소재 획득처와 나타 영입 정보를 참고했습니다.',en:'An English game guide site used for material locations and Nezha recruitment.'},
 'reddit.com':{name:'Reddit · FE Fortunes Weave',ko:'영문 게임 커뮤니티. 미끼 희귀도와 탈것 출현에 관한 플레이 경험담을 참고했습니다.',en:'An English gaming community used for player reports on bait rarity and mount appearances.'},
 'serenesforest.net':{name:'Serenes Forest',ko:'파이어 엠블렘 팬 사이트. 캐릭터별 개인 성장률을 참고했습니다.',en:'A Fire Emblem fan site used for personal character growth rates.'},
 'siliconera.com':{name:'Siliconera',ko:'영문 게임 매체. 모노케로스의 획득 방법을 참고했습니다.',en:'An English gaming publication used for Monoceros acquisition.'},
 'yuphastemple.com':{name:'Yu Phas’ Temple',ko:'게임 도감과 지도 안내 사이트. 장소·아이템·병종·기술의 영문 이름을 참고했습니다.',en:'A game database and map guide used for English place, item, class and ability names.'}
};
const priority=['game8','nintendo.com','rpgsite.net','fireemblemwiki.org','namu.wiki'];
export function sourceOverviewGroups(records){
 const groups=new Map();
 for(const source of records){const site=referenceSite(source.url);if(!groups.has(site))groups.set(site,[]);groups.get(site).push(source);}
 const rank=site=>priority.includes(site)?priority.indexOf(site):priority.length;
 return [...groups].sort(([a],[b])=>rank(a)-rank(b)||a.localeCompare(b)).map(([site,list])=>{
  const provider=providers[site];
  const representative=list.find(s=>s.id===provider?.sourceId)||list[0];
  return {site,name:provider?.name||site,url:site==='local'?null:provider?.url||representative.url,description:provider?{ko:provider.ko,en:provider.en}:representative.title};
 });
}
export function sourceOverview(groups,lang){
 return `<ul class="source-overview">${groups.map(group=>`<li class="source-provider"><h2>${group.url?`<a href="${esc(group.url)}" target="_blank" rel="noopener noreferrer">${esc(localized(group.name,lang))} ${icon('external')}</a>`:esc(localized(group.name,lang))}</h2><p>${esc(localized(group.description,lang))}</p></li>`).join('')}</ul>`;
}
