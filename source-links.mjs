// URL identity is used for grouping only. Keep the selected original URL intact.
export function sourceLinkKey(value){
 try{
  const url=new URL(value);url.hostname=url.hostname.replace(/^www\./,'');
  if(url.hostname==='docs.google.com'&&/^\/spreadsheets\/d\//.test(url.pathname)){
   const id=url.pathname.split('/')[3],gid=url.searchParams.get('gid')||new URLSearchParams(url.hash.slice(1)).get('gid');
   return `sheet:${id}${gid?'#'+gid:''}`;
  }
  if(['m.dcinside.com','gall.dcinside.com'].includes(url.hostname)){
   const path=url.pathname.match(/^\/board\/([^/]+)\/(\d+)/),board=path?.[1]||url.searchParams.get('id'),number=path?.[2]||url.searchParams.get('no');
   if(board&&number)return `dc:${board}/${number}`;
  }
  for(const key of [...url.searchParams.keys()])if(/^utm_|^fbclid$|^gclid$/.test(key))url.searchParams.delete(key);
  url.hash='';url.pathname=url.pathname.replace(/\/$/,'')||'/';return url.href;
 }catch{return value;}
}
const names={game8:'Game8','yuphastemple.com':'Yu Phas’ Temple','cass07.github.io':'Cass07','serenesforest.net':'Serenes Forest','fireemblemwiki.org':'Fire Emblem Wiki','namu.wiki':{ko:'나무위키',en:'Namu Wiki'},'dcinside.com':{ko:'디시인사이드',en:'DC Inside'},'docs.google.com':{ko:'커뮤니티 자료표',en:'Community spreadsheets'},'rpgsite.net':'RPG Site','raiderking.com':'Raider King','siliconera.com':'Siliconera','edricsn.com':{ko:'에드릭슨',en:'Edricsn'},'al-gest.com':'AlGest','allthings.how':'AllThingsHow','gamewith.jp':'GameWith','gamecap.jp':'Gamecap','appmedia.jp':'AppMedia','annasnotebook.net':'Anna’s Notebook','nintendo.com':'Nintendo'};
const order=['docs.google.com','yuphastemple.com','cass07.github.io','game8','serenesforest.net','fireemblemwiki.org','namu.wiki','dcinside.com'];
export const sourceProviderName=site=>names[site]||site;
export const sourceProviderOrder=site=>order.includes(site)?order.indexOf(site):order.length;
export function sourceTitle(value){
 const clean=text=>typeof text==='string'?text.replace(/\s*\([^)]*(?:\d{4}-\d{2}-\d{2}|via public database|관리자 제공 HTML|snapshot review)[^)]*\)/g,'').replace(/\s*\d+건/g,'').trim():text;
 return value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([lang,text])=>[lang,clean(text)])):clean(value);
}
