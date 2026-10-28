// User-confirmed scope: the collected elephant data describes the equippable mount.
export const mountIdAliases={elephant:'saramis-war-elephant'};
export const canonicalMountId=id=>mountIdAliases[id]||id;
const bi=(ko,en)=>({ko,en});
export function applyMountReview(db,sources){
 const entry=db.get('elephant');
 if(!entry)throw Error('Missing elephant scope review target');
 const sourceId='administrator-mount-scope-20261028';
 sources[sourceId]={title:bi('관리자 제공 플레이 정보 · 탈것','Provided gameplay information · Mounts'),kind:'reference',checked:'2026-10-28',hideChecked:true};
 sources['dc-769933']={title:bi('살라미스 전투 코끼리 · 기승 기술 화면','Saramis War Elephant · Riding skill screenshots'),url:'https://gall.dcinside.com/mgallery/board/view/?id=fireemblem&no=769933',kind:'community',checked:'2026-10-23',hideChecked:true};
 entry.id='saramis-war-elephant';
 entry.name=bi('살라미스 전투 코끼리','Saramis War Elephant');
 entry.aliases=['살라미스 코끼리','サラミス戦象'];
 entry.summary=bi('따로 장비하는 살라미스 전투 코끼리. 성장 보정과 기승 기술을 확인할 수 있습니다.','An equippable Saramis War Elephant with growth bonuses and riding skills.');
 entry.status='reference';entry.mountScope='equippable';
 entry.scopeEvidence={sourceId,checked:'2026-10-28',method:'administrator-confirmed-mount-scope'};
 entry.koreanNameEvidence={sourceId,checked:'2026-10-28',method:'administrator-confirmed-name'};
 entry.englishNameEvidence={sourceId,checked:'2026-10-28',method:'administrator-confirmed-mount-scope',officiallyVerified:false};
 entry.sourceIds=[...new Set([...entry.sourceIds,sourceId,'dc-769933'])];
 entry.missing=entry.missing.map(value=>value==='Exact capture location'?'Acquisition location':value);
 for(const field of ['growth','internalGrowth'])if(entry.mountDetails[field])entry.mountDetails[field].condition=bi('살라미스 전투 코끼리','Saramis War Elephant');
 entry.mountSkills=[{id:'paired-dash',name:bi('연계 대이동','Paired Dash'),effects:{3:bi('이동력 +1','Move +1'),5:bi('이동력 +2','Move +2')},sourceId:'dc-769933',checked:'2026-10-23',status:'community-game-screenshot',appliesTo:'cavalry'}];
 db.delete('elephant');db.set(entry.id,entry);
 for(const entity of db.values())for(const link of entity.links||[])link.to=canonicalMountId(link.to);
}
