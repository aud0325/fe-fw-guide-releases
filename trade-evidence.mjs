const bi=(ko,en)=>({ko,en});
// Reviewed against the saved JP articles and the current fish article on 2026-10-02.
// Existence and exchange evidence do not establish equipment stats or official names.
export function applyTradeEvidence(db,sources){
 const sourceId='game8-jp-816890-trade-20261002';
 sources[sourceId]={title:'Game8 JP · カガヤキウオの入手方法と使い道',url:'https://game8.jp/fe-banshisenko/816890',kind:'guide',checked:'2026-10-02',note:bi('교환품의 존재·장소·필요 수량을 확인했습니다. 거인의 반지의 한영 이름은 일본어 원명의 편집 번역이며 성능은 수록하지 않습니다.','Confirms the trade item, location and required quantity. Giant’s Ring is an editorial translation of the Japanese name; equipment stats are not documented here.')};
 if(db.has('giants-ring'))throw Error('Duplicate trade item: giants-ring');
 db.set('giants-ring',{
  id:'giants-ring',type:'item',name:bi('거인의 반지','Giant’s Ring'),aliases:['巨人の指輪',"Giant's Ring"],textAliases:['巨人の指輪'],translation:'provisional',status:'reference',
  summary:bi('해양 도시 알렉토의 상회에서 반짝반짝어 1개와 교환하는 아이템입니다.','Trade one Paradise Fish at the trading company in Alecto.'),
  sourceIds:[sourceId],facts:[],
  nameEvidence:{sourceId,method:'editorial-translation',original:'巨人の指輪',languages:['ko','en']},
  acquisition:[{locationId:'alecto-city',method:bi('교환','Trade'),condition:bi('상회: 반짝반짝어 1개와 교환.','Trading company: exchange one Paradise Fish.'),sourceId}],
  links:[{to:'alecto-city',label:bi('교환 장소','Trade location'),sourceId},{to:'paradise-fish',label:bi('교환 재료','Trade ingredient'),sourceId}]
 });
 const aliases=[['alecto-city',['海都アレクトー','해도 알렉토']],['lake-brontes',['ブロンテス湖','브론테스 호수']],['kira-village',['キラの村']],['liganet',['リガネット']],['torment-grass',['煉獄草']]];
 const aliasSources={'alecto-city':sourceId,'lake-brontes':sourceId,'kira-village':'game8-jp-817080',liganet:'game8-jp-817234','torment-grass':'game8-jp-817234'};
 for(const [id,terms] of aliases){
  const e=db.get(id);if(!e)throw Error('Missing trade target: '+id);
  e.aliases=[...new Set([...e.aliases,...terms])];e.textAliases=[...new Set([...(e.textAliases||[]),...terms])];
  e.textAliasEvidence=[...(e.textAliasEvidence||[]),{terms,sourceId:aliasSources[id],method:'editorial-name-and-context-match'}];
 }
 const relationships=[
  ['paradise-fish','alecto-city','교환 사용처','Trade use',sourceId],
  ['paradise-fish','giants-ring','교환 결과','Trade result',sourceId],
  ['paradise-fish','ninae','영입 요구품','Recruitment requirement','game8-jp-816890'],
  ['sandworm-meat','kira-village','구매 장소','Purchase location','game8-jp-817080'],
  ['sandworm-meat','alecto-city','교환 장소','Trade location','game8-jp-817080'],
  ['sandworm-meat','liganet','교환 재료','Trade ingredient','game8-jp-817080'],
  ['giants-meat','alecto-city','교환 장소','Trade location','game8-jp-817081'],
  ['giants-meat','torment-grass','교환 재료','Trade ingredient','game8-jp-817081']
 ];
 for(const [from,to,ko,en,id] of relationships){
  const e=db.get(from);if(!e||!db.has(to)||!sources[id])throw Error('Missing reviewed trade target: '+from+' / '+to);
  if(!e.links.some(l=>l.to===to&&l.label.en===en))e.links.push({to,label:bi(ko,en),sourceId:id});
  e.sourceIds=[...new Set([...e.sourceIds,id])];
 }
}
