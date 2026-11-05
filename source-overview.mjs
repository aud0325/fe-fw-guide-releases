import {referenceSite,localized} from './presentation.mjs';
import {escapeHtml as esc} from './core.mjs';
import {icon} from './icons.mjs';

// Curate the main references here; individual evidence and credits stay on details.
// Separate the two collections even though they share the Google Sheets host.
const providers=[
 {site:'docs.google.com',documentId:'1YW5AdvPUbLPr1RAGlnotcRaNTFCQPTKiIgshwrcdUtE',name:{ko:'커뮤니티 자료표',en:'Community collection sheet'},url:'https://docs.google.com/spreadsheets/d/1YW5AdvPUbLPr1RAGlnotcRaNTFCQPTKiIgshwrcdUtE/edit',ko:'영입·기술 습득·병종·장비·교환·보물상자와 캐릭터 취향을 정리한 자료표입니다.',en:'A community collection of recruitment, learnsets, classes, equipment, trades, chests and character preferences.'},
 {site:'docs.google.com',documentId:'1Yn8-kj1VhoFwGrsRlxGylatuy0KHj-BPYvLQ8FmVFUA',name:{ko:'커뮤니티 WIP 자료표',en:'Community WIP sheet'},url:'https://docs.google.com/spreadsheets/d/1Yn8-kj1VhoFwGrsRlxGylatuy0KHj-BPYvLQ8FmVFUA/edit',ko:'성장률·장별 영입 레벨·아이템 효과·무기 강화·군단병과 계략을 정리한 자료표입니다.',en:'A community spreadsheet covering growth rates, chapter recruitment levels, item effects, forging, battalions and gambits.'},
 {site:'yuphastemple.com',name:'Yu Phas’ Temple',url:'https://yuphastemple.com/',ko:'장소·아이템·병종·기술의 영문 이름, 채집 확률·획득처와 영입 시 소지품을 참고한 도감·지도 사이트입니다.',en:'A database and map guide used for English names, gathering rates, acquisition and recruitment equipment.'},
 {site:'cass07.github.io',name:{ko:'Cass07 · 만자천홍 DB',en:'Cass07 · Fortune’s Weave DB'},url:'https://cass07.github.io/fe18-db/',ko:'한국어 지명·기술명과 습득 조건, 개인·병종 성장률, 능력치 보정과 외전 일정을 참고한 도감입니다.',en:'A community database used for Korean names, learnsets, character and class growth rates, stat modifiers and paralogue schedules.'},
 {site:'game8',name:'Game8',url:'https://game8.jp/fe-banshisenko/',ko:'영입 조건, 병종·장비·기술, 획득처와 추천 육성 경로를 참고한 일본어·영어 공략 사이트입니다.',en:'Japanese and English guides used for recruitment, classes, equipment, abilities, acquisition and training recommendations.'},
 {site:'serenesforest.net',name:'Serenes Forest',url:'https://serenesforest.net/fortunes-weave/characters/growth-rates/',ko:'개인·병종 성장률을 참고한 파이어 엠블렘 팬 사이트입니다.',en:'A Fire Emblem fan site used for character and class growth rates.'},
 {site:'fireemblemwiki.org',name:'Fire Emblem Wiki',url:'https://fireemblemwiki.org/wiki/List_of_characters_in_Fire_Emblem:_Fortune%27s_Weave',ko:'캐릭터·병종·무기의 영문 명칭과 초상화를 참고한 시리즈 팬 위키입니다.',en:'A series fan wiki used for English character, class and weapon names, and character portraits.'},
 {site:'namu.wiki',name:{ko:'나무위키',en:'Namu Wiki'},url:'https://namu.wiki/w/파이어%20엠블렘%20만자천홍',ko:'등장인물·병종·탈것·혈인과 한국어 명칭을 참고한 위키입니다.',en:'A Korean wiki used for characters, classes, mounts, crests and Korean names.'},
 {site:'dcinside.com',name:{ko:'디시인사이드 · 파이어 엠블렘 갤러리',en:'DC Inside · Fire Emblem gallery'},url:'https://gall.dcinside.com/mgallery/board/view/?id=fireemblem&no=746786',ko:'영입·외전·육성, 탈것 포획과 게임 화면 제보를 참고한 한국어 커뮤니티입니다.',en:'A Korean community used for recruitment, paralogues, training, mount capture and gameplay screenshots.'},
 {site:'nintendo.com',name:'Nintendo',ko:'작품 개요와 주요 시스템 설명을 참고한 공식 소개입니다.',en:'Official game coverage used for the game overview and core systems.'},
 {site:'local',name:{ko:'제공된 게임 화면·플레이 정보',en:'Provided gameplay materials'},ko:'관리자가 제공한 한국어 명칭, 아이템 설명·획득처, 지도·탈것 정보입니다.',en:'Administrator-provided Korean names, item descriptions and acquisition, maps and mount information.'}
];
export function sourceOverviewGroups(records){
 const groups=new Map();
 for(const source of records){const site=referenceSite(source.url);if(!groups.has(site))groups.set(site,[]);groups.get(site).push(source);}
 return providers.flatMap(provider=>{
  const list=groups.get(provider.site)||[];
  const representative=provider.documentId?list.find(source=>source.url?.startsWith(`https://docs.google.com/spreadsheets/d/${provider.documentId}/`)):list[0];
  if(!representative)return [];
  return [{site:provider.site,name:provider.name,url:provider.site==='local'?null:provider.url||representative.url,description:{ko:provider.ko,en:provider.en}}];
 });
}
export function sourceOverview(groups,lang){
 return `<ul class="source-overview">${groups.map(group=>`<li class="source-provider"><h2>${group.url?`<a href="${esc(group.url)}" target="_blank" rel="noopener noreferrer">${esc(localized(group.name,lang))} ${icon('external')}</a>`:esc(localized(group.name,lang))}</h2><p>${esc(localized(group.description,lang))}</p></li>`).join('')}</ul>`;
}
