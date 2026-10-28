import {rewriteLinks} from '../routing.mjs';
import {categoryLabels,normalizeSection,characterSkills,providerGroups,abilityTarget,acquisitionLevel,catalogEntryHref,characterSkillHref} from './catalog-model.mjs';
import {rows} from './full-data.mjs';
import {canonicalAbilityId,abilitySlug} from './ability-identities.mjs';
import {uniqueAvailability,itemConnections} from './integration-data.mjs';
import {proficiencyGlyph} from './proficiency-ui.mjs';
import {abilityIcon,characterIcon,proficiencyIcon,categoryIcon} from './icon-model.mjs';
import {skillGroups,artGroups,spellGroups,labelsForKind,categoryOf,groupFamilies,availableGroups,normalizeCategory} from './scale-model.mjs';
let state;
let base='/';
const txt=(ko,en)=>state.lang==='ko'?ko:en;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=x=>x?.[state.lang]??'';
const kinds={'skill':['스킬','Skills'],'combat-art':['전투 기술','Combat arts'],'spell':['마법','Magic']};
const methods={'proficiency':['숙련도','Proficiency'],'overblaze':['오버블레이즈 중','During Overblaze'],'personal':['개인 고유','Personal'],'class-mastery':['병종 마스터','Class mastery'],'class-active':['병종 제공','Class access'],'equipment':['장비 제공','Equipment'],'weapon':['장비 제공','Equipment'],'mount-active':['탈것 제공','Mount access'],'item-use':['아이템 습득','Learn from item'],'initial-possession':['초기 소지','Initially known'],'unknown':['조건 미확인','Unconfirmed']};
const profs={'white-magic':['백마술','White magic'],'black-magic':['흑마술','Black magic'],sword:['검술','Sword'],spear:['창술','Spear'],axe:['도끼술','Axe'],bow:['궁술','Bow'],gauntlet:['격투술','Gauntlet'],infantry:['보병','Infantry'],authority:['지휘','Authority'],armor:['중장','Armor'],flying:['비행','Flying'],cavalry:['기마','Riding']};
const contexts={cavalry:['기병','Cavalry'],infantry:['보병','Infantry'],flying:['비행','Flying'],armored:['중장','Armored']};
const purposes={'attack':['공격','Attack'],'heal':['회복','Healing'],'move':['이동','Movement'],'support':['지원','Support']};
const school=spellGroups;
const pair=p=>p?txt(...p):txt('미확인','Unknown');
function url(patch){
 const next={...state,...patch};
 if(next.view==='detail'&&next.id)return `${base}${next.lang}/entry/${encodeURIComponent(abilitySlug(next.id))}/`;
 const query=next.section?'?group='+encodeURIComponent(next.section):'';
 return `${base}${next.lang}/category/${next.kind}/${query}`;
}
function methodName(m){return pair(methods[m]??(m?.includes('equipment')?methods.equipment:methods.unknown));}
function kindName(r){return r.kind==='spell'?pair(school[r.stats.magicSchool]):pair(kinds[r.kind]);}
function relevant(r){return state.char?r.relations.filter(x=>x.id===state.char):r.relations;}
function iconImage(asset,style='ability-icon'){return asset?`<img class="${style}${asset.source?.startsWith('user-screenshot-')?' proficiency-glyph':''}" src="${esc(asset.src.startsWith('./assets/classes/')?base+asset.src.slice(2):base+'_abilities/'+asset.src.replace(/^\.\//,''))}" width="${style==='character-icon'?30:22}" height="${style==='character-icon'?30:22}" alt="" loading="lazy" decoding="async">`:'';}
function portrait(id){return iconImage(characterIcon(id),'character-icon');}
function routeCondition(r){
 const p=r.proficiency?pair(profs[r.proficiency]):r.rank!=null?txt('숙련 종류 미확인','Proficiency type unconfirmed'):'';
 if(r.friendshipLevel!=null)return txt(`우호도 ${esc(r.friendshipLevel)}`,`Friendship ${esc(r.friendshipLevel)}`);
 if(r.level!=null)return `Lv ${esc(r.level)}`;
 if(r.rank!=null)return `<span class="proficiency-label">${proficiencyGlyph(r.proficiency)||iconImage(proficiencyIcon(r.proficiency),'proficiency-icon')}${esc(p)}</span> <span class="rank">${esc(r.rank)}</span>`;
 const labels={overblaze:['오버블레이즈 중 · 기본 개인스킬 대체','During Overblaze · replaces the base personal skill'],'initial-possession':['초기 소지','Initially known'],'class-mastery':['병종 마스터','Master this class'],'class-active':['해당 병종 상태','While in this class'],personal:['개인 고유','Personal'],'item-use':['아이템 사용','Use item'],'mount-active':['탑승 중','While mounted'],'equipment-granted':['장비 중','While equipped'],'character-specific':['캐릭터 고유','Character-specific'],'character-specific-unknown':['캐릭터 고유 · 조건 미확인','Character-specific · condition unconfirmed']};
 return labels[r.method]?pair(labels[r.method]):`${esc(p)} ${txt('조건 미확인','Condition unconfirmed')}`;
}
function condition(r){const routes=r.routes?.length?r.routes:[r];return [...new Set(routes.map(routeCondition))].map(x=>`<span class="condition-line">${x}</span>`).join('');}
function metrics(r){if(r.kind==='skill'||(r.kind==='combat-art'&&r.purpose==='support'))return '';const fields=r.kind==='spell'?[['might','위력','Mt'],['hit','명중','Hit'],['range','사거리','Rng'],['uses','기본 횟수','Base uses']]:[['might','위력 보정','Mt bonus'],['hit','명중 보정','Hit bonus'],['range','사거리','Rng']];return `<div class="metrics">${fields.filter(([k])=>r.stats[k]!=null).map(([k,ko,en])=>`<span>${txt(ko,en)}<b>${esc(r.stats[k])}</b></span>`).join('')}</div>`;}
function sourceBox(r){const isMagic=(r?.kind||state.kind)==='spell';return `<details class="source-box"><summary>${txt('출처','Sources')}</summary>${[...(r?.englishNameSources||[]),...(r?.reviewedSources||[])].map(source=>`<p><a href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(source.title)}</a></p>`).join('')}${r?.relations.some(x=>x.id==='saramis-war-elephant')?`<p><a href="https://gall.dcinside.com/mgallery/board/view/?id=fireemblem&no=769933" target="_blank" rel="noreferrer">${txt('살라미스 전투 코끼리 · 게임 화면','Saramis War Elephant · game screenshots')}</a></p>`:''}${r?itemConnections.filter(x=>x.abilityId===r.id).map(x=>!x.url?`<p>${txt('제공된 게임 화면 · 마법 습득 아이템','Provided gameplay captures · Spell-learning items')}</p>`:`<p><a href="${esc(x.url)}" target="_blank" rel="noreferrer">${x.relation==='equipment-granted'?txt('장비 전투 기술 대응표','Equipment combat art correspondence'):x.status==='game-capture'?txt('마법 습득 아이템 · 게임 화면','Spell-learning items · gameplay captures'):x.status==='guide-correspondence'?txt('마법 습득 아이템 · 공략 자료','Spell-learning items · guides'):txt('마법 습득 제보','Spell acquisition report')}</a></p>`).join(''):''}<p><a href="https://game8.jp/fe-banshisenko/${isMagic?'817283':(r?.kind||state.kind)==='combat-art'?'817286':'818786'}" target="_blank" rel="noreferrer">Game8</a><a href="https://gamewith.jp/fefw/${isMagic?'574424':(r?.kind||state.kind)==='combat-art'?'573032':'574420'}" target="_blank" rel="noreferrer">GameWith</a><a href="https://docs.google.com/spreadsheets/d/1YW5AdvPUbLPr1RAGlnotcRaNTFCQPTKiIgshwrcdUtE/edit" target="_blank" rel="noreferrer">${txt('커뮤니티 습득표','Community learnsets')}</a></p><p class="image-credit">${txt('이미지: 병종 아이콘과 전투 기술·마법 문양은 Game8, 기술능력 12종 문양은 사용자 제공 게임 화면에서 추출했습니다. 캐릭터 얼굴은 기존 Fire Emblem Wiki 초상화에서 추출했으며 클라프카·타호니아는 Game8 이미지를 사용합니다.','Images: Class icons, combat art and spell symbols from Game8; all twelve proficiency glyphs cropped from user-provided game screenshots. Character faces are cropped from existing Fire Emblem Wiki portraits; Klapka and Tahonia use Game8 images.')} <a href="${esc(characterIcon(state.char)?.sourceUrl||'https://fireemblemwiki.org/')}" target="_blank" rel="noreferrer">Fire Emblem Wiki</a></p><p class="scope">© Nintendo / INTELLIGENT SYSTEMS</p></details>`;}
const weaponNames={sword:['검','Sword'],spear:['창','Spear'],axe:['도끼','Axe'],bow:['활','Bow'],gauntlet:['격투','Gauntlet'],general:['공용·지원','General & support']};
const rankOrder=['D','D+','C','C+','B','B+','A','A+','S','S+'];
function entityLink(x){const href=catalogEntryHref(x,state.lang),content=x.type==='character'?`${portrait(x.id)}<span>${esc(label(x.name))}</span>`:x.type==='class'?`${iconImage(x.icon,'class-icon')}<span>${esc(label(x.name))}</span>`:esc(label(x.name));return href?`<a class="${x.type==='character'?'person-link':'provider-link'+(x.type==='class'?' class-owner':'')}" href="${esc(href)}">${content}</a>`:esc(label(x.name));}
function learnBlock(r){const groups=new Map();for(const x of r.relations){const key=x.rank?`${x.proficiency||''}|${x.rank}`:x.initial?'initial':x.method;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(x);}const sorted=[...groups.values()].sort((a,b)=>(a[0].rank?rankOrder.indexOf(a[0].rank):99)-(b[0].rank?rankOrder.indexOf(b[0].rank):99));return `<div class="learn-groups">${sorted.map(xs=>`<div class="learn-group"><div>${condition({...xs[0],initial:xs.every(x=>x.initial)&&!xs[0].rank})}</div><div class="people">${xs.map(x=>entityLink(x)+(x.initial&&x.rank?` <small>${txt('(초기 소지 기록)','(initially known)')}</small>`:'')).join('<span class="person-sep">, </span>')}</div></div>`).join('')||`<p>${txt('습득 대상 확인이 필요합니다.','Learning sources are unconfirmed.')}</p>`}</div>`;}
function learnDisclosure(r){return acquisitionLink(r);}
function abilityName(r){return `<a class="name" href="${characterSkillHref(r,state.lang)||url(abilityTarget(r))}">${r.kind==='skill'?'':iconImage(abilityIcon(r))}<span>${esc(label(r.name))}</span></a>`;}
function sectionNav(items){return `<nav class="section-nav" aria-label="${txt('본문 목차','Page sections')}">${items.map(([id,ko,en])=>`<a href="${url({section:id})}" ${state.section===id?'aria-current="location"':''}>${txt(ko,en)}</a>`).join('')}</nav>`;}
function effectText(r){return `${r.descriptionStatus==='source-conflict'?`<span class="conflict-tag">${txt('효과 확인 중','Effect unresolved')}</span>`:''}<span>${esc(label(r.effect))}</span>`;}
function scopeNav(){const groups=state.kind==='skill'?Object.entries(categoryLabels).map(([id,p])=>({id,label:p,rows:rows.filter(r=>r.kind==='skill'&&normalizeSection('skill',r.category)===id)})):availableGroups(rows,state.kind);return `<nav class="scope-nav" aria-label="${txt('분류별 도감','Browse categories')}">${groups.filter(g=>g.rows.length).map(g=>`<a data-scope="${g.id}" href="${url({section:g.id,page:1,view:'list',id:'',char:''})}" ${g.id===state.section?'aria-current="page"':''}>${pair(g.label)}</a>`).join('')}</nav>`;}
function tableHeading(title){return `<h2 class="table-heading" id="results-title" tabindex="-1">${esc(title)}</h2>`;}
function skillText(items){return groupFamilies(items).map(f=>`<div class="skill-lines">${f.map(r=>`<div class="skill-inline" data-ability-id="${r.id}">${abilityName(r)}<span>${effectText(r)}</span></div>`).join('')}</div>`).join('')||'<span class="scope">—</span>';}
function familyLines(f,columns=[]){return `<div class="family-lines ${columns.length?'with-stats':''}" style="--stat-count:${columns.length}">${f.map(r=>`<div class="family-line" data-ability-id="${r.id}"><div class="family-name">${abilityName(r)}</div><div class="family-effect">${effectText(r)}</div>${columns.map(([key,ko,en])=>`<div class="family-stat" data-label="${txt(ko,en)}">${r.stats[key]==null?'—':r.kind==='combat-art'&&['might','hit','crit'].includes(key)&&Number(r.stats[key])>0?'+'+esc(r.stats[key]):esc(r.stats[key])}</div>`).join('')}</div>`).join('')}</div>`;}
function familyTable(families,columns=[]){return `<div class="comparison-wrap"><table class="comparison-table ${columns.length?'performance-table':''}"><colgroup><col style="width:25%"><col>${columns.map(()=>'<col style="width:7%">').join('')}</colgroup><thead><tr><th scope="col">${txt('기술명','Name')}</th><th scope="col">${txt('효과','Effect')}</th>${columns.map(([,ko,en])=>`<th scope="col">${txt(ko,en)}</th>`).join('')}</tr></thead><tbody>${families.map(f=>`<tr data-family-group="${esc(f[0].family)}"><td colspan="${2+columns.length}">${familyLines(f,columns)}</td></tr>`).join('')}</tbody></table></div>`;}
const skillTypes={personal:['개인스킬','Personal'],unique:['고유스킬','Unique'],mastery:['마스터스킬','Mastery skill'],class:['병과스킬','Class skill']};
function classifiedFamilies(groups,ownerHeading){
 return `<table class="comparison-table classified-table"><colgroup><col style="width:16%"><col style="width:12%"><col style="width:23%"><col style="width:49%"></colgroup><thead><tr><th scope="col">${ownerHeading}</th><th scope="col">${txt('분류','Type')}</th><th scope="col">${txt('이름','Name')}</th><th scope="col">${txt('효과','Effect')}</th></tr></thead>${groups.map(g=>`<tbody data-owner-id="${g.owner.id}">${g.families.map((f,i)=>`<tr data-family-group="${esc(f[0].family)}">${i===0?`<th class="owner-cell" scope="rowgroup" rowspan="${g.families.length+(uniqueAvailability[g.owner.id]?1:0)}">${entityLink(g.owner)}</th>`:''}<td class="classification"><span class="skill-type-tag skill-type-${f[0].category}">${pair(skillTypes[f[0].category])}</span></td><td colspan="2" class="classified-content"><div class="classified-lines">${f.map(r=>{const level=r.category==='unique'?acquisitionLevel(r,g.owner.id):null;return `<div class="classified-line" data-ability-id="${r.id}"><div class="classified-name">${abilityName(r)}${level!=null?`<small class="acquisition-level">Lv ${esc(level)}</small>`:''}</div><div class="classified-effect">${effectText(r)}</div></div>`;}).join('')}</div></td></tr>`).join('')}${uniqueAvailability[g.owner.id]?`<tr><td class="classification"><span class="skill-type-tag skill-type-unique">${txt('고유스킬','Unique')}</span></td><td colspan="2" class="unique-availability">${uniqueAvailability[g.owner.id].status==='reported-absent'?txt('없음으로 보고됨','Reported absent'):txt('미확인','Unconfirmed')}</td></tr>`:''}</tbody>`).join('')}</table>`;
}
function skillView(){
 if(state.section==='character')return tableHeading(txt('캐릭터 스킬','Character skills'))+classifiedFamilies(characterSkills(rows).map(c=>({owner:c,families:[...groupFamilies(c.personal),...groupFamilies(c.unique)]})),txt('캐릭터','Character'));
 const groups=providerGroups(rows,state.section),head=state.section==='training'?txt('기술능력','Proficiency'):state.section==='mount'?txt('탈것','Mount'):txt('병종','Class');
 if(state.section==='class')return tableHeading(pair(categoryLabels.class))+classifiedFamilies(groups,head);
 return tableHeading(pair(categoryLabels[state.section]))+`<table class="comparison-table provider-table"><colgroup><col style="width:19%"><col style="width:25%"><col></colgroup><thead><tr><th scope="col">${head}</th><th scope="col">${txt('스킬명','Skill')}</th><th scope="col">${txt('효과','Effect')}</th></tr></thead>${groups.map(g=>`<tbody>${g.families.map((f,i)=>`<tr data-family-group="${esc(f[0].family)}">${i===0?`<th class="provider-name" scope="rowgroup" rowspan="${g.families.length+(uniqueAvailability[g.owner.id]?1:0)}">${g.owner.type==='proficiency'?`<span class="proficiency-label" id="proficiency-${g.owner.id}" tabindex="-1">${proficiencyGlyph(g.owner.id)}${pair(profs[g.owner.id])}</span>`:`<span id="proficiency-${g.owner.id}" tabindex="-1">${entityLink(g.owner)}</span>`}</th>`:''}<td colspan="2">${familyLines(f)}</td></tr>`).join('')}</tbody>`).join('')}</table>`;
}
const artColumns=[['might','위력 보정','Mt bonus'],['hit','명중 보정','Hit bonus'],['crit','필살 보정','Crit bonus'],['range','사거리','Range'],['durabilityCost','내구 소모','Durability cost']];
function artView(){const selected=rows.filter(r=>r.kind==='combat-art'&&categoryOf(r)===state.section);return tableHeading(pair(artGroups[state.section]))+familyTable(groupFamilies(selected),artColumns);}
function magicPerformance(){const selected=rows.filter(r=>r.kind==='spell'&&categoryOf(r)===state.section);const columns=[['might','위력','Mt'],['hit','명중','Hit'],['crit','필살','Crit'],['weight','무게','Wt'],['range','사거리','Range'],['uses','횟수','Uses']];return tableHeading(pair(spellGroups[state.section]))+familyTable(groupFamilies(selected),columns);}
function proficiencyJump(){return state.kind==='skill'&&state.section==='training'?`<label class="proficiency-jump"><span>${txt('기술능력 바로가기','Jump to proficiency')}</span><select id="proficiency-jump"><option value="">${txt('선택','Select')}</option>${providerGroups(rows,'training').map(g=>`<option value="${g.owner.id}">${pair(profs[g.owner.id])}</option>`).join('')}</select></label>`:'';}
function breadcrumbs(row=null){
 const kind=row?.kind||state.kind,section=row?abilityTarget(row).section:state.section;
 const category=kind==='skill'?categoryLabels[section]:kind==='spell'?spellGroups[section]:artGroups[section];
 const listHref=patch=>url({kind,view:'list',id:'',char:'',page:1,mode:'performance',...patch});
 return `<nav class="crumb" aria-label="${txt('현재 위치','Breadcrumb')}"><a href="${base}${state.lang}/">${txt('전체 기록','All records')}</a><span aria-hidden="true"> / </span>${row?`<a href="${listHref({section:''})}">${pair(kinds[kind])}</a>${category?`<span aria-hidden="true"> / </span><a href="${listHref({section})}">${pair(category)}</a>`:''}<span aria-hidden="true"> / </span><span aria-current="page">${esc(label(row.name))}</span>`:`<span aria-current="page">${pair(kinds[kind])}</span>`}</nav>`;
}
function list(){return `${breadcrumbs()}<h1 tabindex="-1">${pair(kinds[state.kind])}</h1><div class="catalog-controls"><div class="catalog-subnav">${scopeNav()}${proficiencyJump()}</div></div>${state.kind==='skill'?skillView():state.kind==='combat-art'?artView():magicPerformance()}${sourceBox()}`;}


function detail(){
 const r=rows.find(r=>r.id===state.id);if(!r)return list();
 const rr=[...r.relations].sort((a,b)=>(a.rank?rankOrder.indexOf(a.rank):99)-(b.rank?rankOrder.indexOf(b.rank):99)||a.name.en.localeCompare(b.name.en,'en'));
 const isSpell=r.kind==='spell';
 const statKeys=isSpell?[['might',r.purpose==='heal'?'회복 위력':'위력',r.purpose==='heal'?'Healing Mt':'Might'],['hit','명중','Hit'],['crit','필살','Crit'],['weight','무게','Weight'],['range','사거리','Range'],['uses','기본 횟수','Base uses']]:r.kind==='combat-art'?[['might','위력 보정','Might bonus'],['hit','명중 보정','Hit bonus'],['crit','필살 보정','Crit bonus'],['range','사거리','Range'],['durabilityCost','내구 소모','Durability cost']]:[];
 const granted=r.abilityRelations.filter(x=>x.type==='grants-use-of').map(x=>rows.find(y=>y.id===x.to)).filter(Boolean);
 const permissions=rows.filter(x=>x.abilityRelations.some(y=>y.type==='grants-use-of'&&y.to===r.id));
 const alternatives=r.descriptionAlternatives.length?`<div class="effect-alternatives"><h2>${txt('서로 다른 효과 기록','Conflicting effect reports')}</h2>${r.descriptionAlternatives.map(a=>`<article><strong>${a.sourceGroup==='community-sheet'?txt('커뮤니티 시트','Community sheet'):'GameWith'}</strong><p>${esc(label(a.description))}</p></article>`).join('')}</div>`:'';
 const family=rows.filter(x=>x.family===r.family&&x.id!==r.id);
 return `${breadcrumbs(r)}<div class="detail-grid"><section><div class="detail-kind">${kindName(r)}${r.useContext?' · '+pair(contexts[r.useContext]):''}</div><h1 tabindex="-1" id="entry-title">${r.kind==='skill'?'':iconImage(abilityIcon(r))}${esc(label(r.name))}${r.provisional&&state.lang==='ko'?'<span class="pill">임시명</span>':''}</h1>${state.lang==='ko'?`<p class="sub">${esc(r.name.en)}</p>`:''}<p class="lead">${effectText(r)}</p>${alternatives}
 ${statKeys.some(([k])=>r.stats[k]!=null)?`<dl class="stat-grid">${statKeys.filter(([k])=>r.stats[k]!=null).map(([k,ko,en])=>`<div><dt>${txt(ko,en)}</dt><dd>${esc(r.stats[k])}</dd></div>`).join('')}</dl>`:''}
 ${isSpell?`<p class="scope">${txt('횟수는 병종 보정 전 기본값입니다. 습득 랭크와 병종의 사용 가능 여부는 별개입니다.','Uses are base values before class modifiers. Learning rank and class access are separate requirements.')}</p>`:''}
 ${r.id==='spell-21ac388ec0ea'?`<p class="scope">${txt('사거리 1은 아군을 선택하는 거리입니다. 이동시킬 수 있는 거리는 주위 5칸입니다.','Range 1 selects the ally. The destination can be within 5 spaces.')}</p>`:''}
 ${r.useContext?`<div class="usage"><h3>${txt('적용 병과','Applies to')}</h3><p>${pair(contexts[r.useContext])}</p></div>`:''}
 ${granted.length?`<div class="related"><h3>${txt('사용할 수 있는 행동','Grants access to')}</h3>${granted.map(abilityName).join(', ')}</div>`:''}
 ${permissions.length?`<div class="related"><h3>${txt('행동 사용에 필요한 스킬','Required access skill')}</h3>${permissions.map(abilityName).join(', ')}</div>`:''}
 ${family.length?`<div class="related"><h3>${txt('단계·강화형','Related variants')}</h3><div class="family-links">${family.map(abilityName).join('')}</div></div>`:''}
 </section><section class="detail-aside"><h2>${txt('습득·제공 조건','Acquisition & access')} <span class="sub">${rr.length}</span></h2>${rr.length?`<table class="learners"><thead><tr><th scope="col">${txt('캐릭터·제공처','Character / source')}</th><th scope="col">${txt('조건','Requirement')}</th></tr></thead><tbody>${rr.map(x=>`<tr><td>${entityLink(x)}</td><td>${condition(x)}</td></tr>`).join('')}</tbody></table>`:`<p class="sub">${txt('캐릭터·병종별 습득 조건이 아직 정리되지 않았습니다.','Character and class acquisition conditions have not been established.')}</p>`}
 ${r.relations.some(x=>x.routes.some(y=>['class-active','mount-active','equipment-granted'].includes(y.method)))?`<p class="scope">${txt('병종·장비·탑승 상태에서 제공되는 효과는 영구 습득과 구분합니다.','Class, equipment and mount access does not establish permanent acquisition.')}</p>`:''}
 ${r.relatedItems.length?`<div class="related"><h3>${txt('마법을 배우는 아이템','Spell-learning item')}</h3>${r.relatedItems.map(x=>`<p><a href="${base}${state.lang}/entry/${esc(x.id)}/">${esc(label(x.name))}</a><br>${condition(x)}</p>`).join('')}</div>`:''}</section></div>${sourceBox(r)}`;
}

export function renderAbilityPage(catalogState,lang='ko',basePath='/'){
 const row=rows.find(r=>r.id===canonicalAbilityId(catalogState.id));
 if(!row&&!['skill','combat-art','spell'].includes(catalogState.type))return null;
 base=basePath;
 state={lang,kind:row?.kind||catalogState.type,view:row?'detail':'list',id:row?.id||'',char:'',mode:'performance',section:catalogState.group||'',page:1};
 if(row){state.section=abilityTarget(row).section;}
 else{state.section=normalizeSection(state.kind,state.section);state.section=state.kind==='skill'?(categoryLabels[state.section]?state.section:'character'):normalizeCategory(rows,state.kind,state.section);}
 const name=row?label(row.name):pair(kinds[state.kind]);
 return {html:rewriteLinks(`<article class="ability-catalog">${row?detail():list()}</article>`,lang,basePath),title:name+txt(' · 만자천홍 도감',' · Fortune’s Weave Encyclopedia'),description:row?label(row.effect):name,entryType:row?.kind,entryName:row?name:null,missing:false};
}
