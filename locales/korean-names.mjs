// Names transcribed from the administrator-supplied HTML; identities matched editorially
// against English roster factions and character roles, not an official bilingual table.
export const koreanNameSource={
 title:'나무위키 · 등장인물 (관리자 제공 HTML)',
 url:'https://namu.wiki/w/파이어%20엠블렘%20만자천홍/등장인물',
 kind:'community',
 note:{ko:'관리자 제공 docs/copy/namu_등장인물.html을 확인했습니다. 문서 표시 수정 시각: 2026-09-25 11:55:35. 한글 표기는 원문에서, 영문 대응은 세력·역할 대조로 정리했습니다. 공식 한영 대조표는 아닙니다.',en:'Read the administrator-provided HTML snapshot, displaying revision time 2026-09-25 11:55:35. Korean spellings are from the snapshot; English identities were matched by faction and role. This is not an official bilingual name chart.'}
};
const groups=[
 ['1. 구세주군',[['eshmel','이스마르'],['hong-hua','홍화'],['troy','트로이아']]],
 ['2.1. 히베이라의 바람',[['cai','카이'],['tialla','티아라'],['peter','피터르'],['ultand','울턴드']]],
 ['2.2. 라민 일가',[['dietrich','디트리히'],['fabio','파비오'],['esmeralda','에스메랄다'],['mikaela','미카엘라']]],
 ['2.3. 메가에라의 등불',[['theodora','세오도라'],['bonaventure','보나파르트'],['tobias','토비아스'],['lysander','라이선더'],['lilian','릴리안']]],
 ['2.4. 장미의 폭풍',[['leda','레다'],['buccar','버커니어'],['sirocco','시로코'],['mu','무우'],['olympia','올림피아']]],
 ['2.5. 불꽃의 갈기',[['bertrand','베르트랑'],['gaitz','게이츠'],['dante','단테'],['goliath','골라이어스'],['jester','제스터']]],
 ['2.6. 섬백의 기만',[['talimun','타리문'],['ursula','우술라'],['simon','시몬'],['ludia','루루디아'],['fianna','피아나']]],
 ['2.7. 리나리아의 아침 이슬',[['orchel','오르헬'],['diego','디에고'],['ninae','리네'],['seteth','세테스'],['loretta','로레타']]],
 ['2.8. 백아의 신부단',[['anatolia','아나톨리아'],['sha-lan','사란'],['nezha','나타'],['dadao','대도'],['halvin','하르빈']]],
 ['2.9. 그 외 클랜',[['benditz','밴디츠'],['alexandra','알렉산드라'],['nuzzuo','누조'],['zarcone','자코네'],['jasmine','자스민'],['kiroc','키로이카'],['inyoni','이니오니'],['peppe','페페']]],
 ['2.10. 무소속',[['guzran','그자람'],['nydine','누디누'],['io','이오'],['catania','카타냐'],['noctula','녹투라'],['yang-jie','양계'],['majide','마지데']]],
 ['3. 다그다 제국',[['centurio','센트리온'],['sofia','소피아'],['character-dagda','다그다'],['solel','소렐'],['fortuna','포트나'],['aurora','아우로라'],['anna','안나'],['castor','카스톨']]],
 ['5. 아라고 왕국',[['nathan','네이선'],['creek','키릭'],['aswan','아스완'],['tahonia','타호니아']]],
 ['8. 기타',[['sothis','소티스']]]
];
export const koreanNames=groups.flatMap(([section,rows])=>rows.map(([id,ko])=>({id,ko,section})));
