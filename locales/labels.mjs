// Shared labels and presentation taxonomies. IDs remain language-independent.
export const types={growth:['성장률 비교','Growth comparison'],all:['전체 기록','All entries'],character:['캐릭터','Characters'],item:['아이템','Items'],mount:['탈것','Mounts'],map:['지도','Atlas'],location:['위치','Locations'],class:['병종','Classes'],paralogue:['외전','Paralogues'],quest:['의뢰 보상 참고','Quest reward notes'],tip:['공략·팁','Tips'],sources:['출처 안내','Sources']};
export const roleNames={playable:['동료','Playable'],guest:['게스트','Guest'],boss:['보스','Boss'],npc:['NPC','NPC'],background:['배경 인물','Background']};
export const statLabels=[['hp','HP','HP'],['str','힘','Str'],['mag','마력','Mag'],['spd','속도','Spd'],['dex','기술','Dex'],['def','수비','Def'],['res','마방','Res'],['lck','행운','Lck'],['cha','매력','Cha']];
export const navigationGroups=[
 {id:'compendium',label:{ko:'인게임 도감',en:'Game compendium'},types:['character','item','mount','class','map','location']},
 {id:'guides',label:{ko:'종합 가이드',en:'Guides'},types:['growth','paralogue','tip']}
];
export const itemMajors={equipment:{ko:'장비',en:'Equipment'},materials:{ko:'소재',en:'Materials'}};
export const itemMinors={
 weapons:{major:'equipment',ko:'무기',en:'Weapons',icon:'sword'},
 magic:{major:'equipment',ko:'마법',en:'Magic',icon:'black-magic'},
 consumables:{major:'equipment',ko:'소모품',en:'Consumables',icon:'consumable'},
 accessories:{major:'equipment',ko:'방패·장신구',en:'Shields & accessories',icon:'shield'},
 promotion:{major:'equipment',ko:'전직용 아이템',en:'Class-change items',icon:'promotion'},
 gifts:{major:'materials',ko:'선물',en:'Gifts',icon:'gift'},
 ingredients:{major:'materials',ko:'재료',en:'Ingredients & crafting',icon:'ore'},
 other:{major:'materials',ko:'기타',en:'Other',icon:'other'}
};
export const itemKinds={
 sword:{minor:'weapons',ko:'검',en:'Swords',icon:'sword'},spear:{minor:'weapons',ko:'창',en:'Spears',icon:'spear'},axe:{minor:'weapons',ko:'도끼',en:'Axes',icon:'axe'},bow:{minor:'weapons',ko:'활',en:'Bows',icon:'bow'},gauntlet:{minor:'weapons',ko:'건틀릿',en:'Gauntlets',icon:'gauntlet'},
 'black-magic':{minor:'magic',ko:'흑마법',en:'Black magic',icon:'black-magic'},'white-magic':{minor:'magic',ko:'백마법',en:'White magic',icon:'white-magic'},'dark-magic':{minor:'magic',ko:'암흑마법',en:'Dark magic',icon:'dark-magic'},
 consumable:{minor:'consumables',ko:'회복·보조 도구',en:'Recovery & support',icon:'consumable'},manual:{minor:'consumables',ko:'숙련서',en:'Skill manuals',icon:'manual'},
 shield:{minor:'accessories',ko:'방패',en:'Shields',icon:'shield'},accessory:{minor:'accessories',ko:'장신구',en:'Accessories',icon:'accessory'},promotion:{minor:'promotion',ko:'전직·자격증',en:'Certifications',icon:'promotion'},
 gift:{minor:'gifts',ko:'선물',en:'Gifts',icon:'gift'},plant:{minor:'ingredients',ko:'식재료·식물',en:'Food & plants',icon:'plant'},meat:{minor:'ingredients',ko:'고기',en:'Meat',icon:'meat'},fish:{minor:'ingredients',ko:'물고기',en:'Fish',icon:'fish'},ore:{minor:'ingredients',ko:'광석·제련 재료',en:'Ore & smithing',icon:'ore'},material:{minor:'ingredients',ko:'기타 재료',en:'Other materials',icon:'ore'},quest:{minor:'other',ko:'의뢰용 아이템',en:'Quest items',icon:'other'},other:{minor:'other',ko:'기타·분류 미확인',en:'Other / unclassified',icon:'other'}
};
export const routes=[['cai','카이','Cai'],['dietrich','디트리히','Dietrich'],['theodora','세오도라','Theodora'],['leda','레다','Leda']];
export const allRoute=['all','전체','All'];
export const paralogueOrders=[['start','수주 시작일','Acceptance date'],['deadline','완료 마감일','Deadline'],['owner','진영·캐릭터','Faction / character']];
export const skillTerms={'흑마법':'Black magic','백마법':'White magic','흑마술':'Black magic','백마술':'White magic','기마술':'Riding','중장술':'Heavy armor','비행술':'Flying','격투술':'Brawling','도끼술':'Axe','검술':'Sword','창술':'Spear','궁술':'Bow','기마':'Riding','중갑':'Heavy armor','비행':'Flying','격투':'Brawling','도끼':'Axe','선택':'choice','검':'Sword','창':'Spear','활':'Bow'};
export const factLabels={'class-required-ko':'Required skills','class-choice-ko':'Alternative skills','ko-require':'Class skill requirements','ko-master_skill':'Mastery','personal-ko':'Personal ability','ko-class_skill_1':'Class skill','ko-class_skill_2':'Class skill','ko-class_skill_3':'Class skill'};
