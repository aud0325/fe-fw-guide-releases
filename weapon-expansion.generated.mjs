// Generated from saved source tables. Edit scripts/weapon-expansion-mappings.mjs.
export const weaponExpansionData={
 "sources": {
  "wiki-weapon-list-20260929": {
   "title": "Fire Emblem Wiki · weapon list (English identities)",
   "url": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "kind": "reference",
   "checked": "2026-09-29",
   "snapshot": "research/weapon-expansion-20260929/wiki-weapons.html",
   "sha256": "96d0c7b3d332a94749ebd3a42d041b792088cd24414edf1a6d7f69775e21bd5d",
   "note": {
    "ko": "개별 문서가 없는 무기도 포함한 영어 목록입니다. 이름·종류 대응에 사용하며 성능은 일본어 Game8을 우선합니다.",
    "en": "English identity/type reference, including red-linked weapons. Japanese Game8 takes priority for performance."
   }
  },
  "game8-jp-weapons-expanded-20260929": {
   "title": "Game8 JP · 武器一覧 (2026-09-29)",
   "url": "https://game8.jp/fe-banshisenko/817514",
   "kind": "guide",
   "checked": "2026-09-29",
   "snapshot": "research/weapon-expansion-20260929/game8-weapons.html",
   "sha256": "170960becbca9f637987e64f5c22365d7d8263a76122de85013fd535d19eaada",
   "note": {
    "ko": "일본어 표의 수치·요구 기능·효과를 사용합니다. 강화 단계가 명시되지 않은 수치는 기본 성능으로 단정하지 않습니다.",
    "en": "Japanese table statistics, required skills and effects. Unspecified upgrade stages are not assumed to be base stats."
   }
  },
  "edricsn-weapons-expanded-20260929": {
   "title": "에드릭슨 · 무기 목록 (누락 항목 보완)",
   "url": "https://edricsn.com/fe-manja-weapon-list/",
   "kind": "community",
   "checked": "2026-09-29",
   "snapshot": "research/weapon-names-20260929/edricsn.html",
   "sha256": "ee7206b8db30af81a476c912fc6abe6a153a8fff5200ed9f551f1f1921a9cecd",
   "note": {
    "ko": "한국어 참고 번역과 Game8 일본어 목록에 없는 무기의 기본 성능·요구 기능을 보완합니다. 공식 한글명 또는 독립 검증 자료로 간주하지 않습니다.",
    "en": "Provisional Korean wording and base stats/skills for weapons absent from Japanese Game8. Not verified official localization or independent corroboration."
   }
  },
  "user-weapon-labels-20260929": {
   "title": {
    "ko": "관리자 무기 명칭 지정 · 2026-09-29",
    "en": "Administrator-requested weapon labels · 2026-09-29"
   },
   "url": "./evidence/weapon-labels-20260929.html",
   "kind": "reference",
   "checked": "2026-09-29",
   "note": {
    "ko": "관리자가 지정한 표기를 우선합니다. 이번 요청은 공식 한국어판 화면 검증으로 분류하지 않습니다.",
    "en": "Administrator-requested labels take priority. This request is not classified as verification against official Korean game footage."
   }
  }
 },
 "newEntries": [
  {
   "id": "chosen-sword",
   "type": "item",
   "name": {
    "ko": "열린 구세의 검(Chosen Sword)",
    "en": "Chosen Sword"
   },
   "summary": {
    "ko": "검 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Sword weapon with reference stats and required skills."
   },
   "aliases": [
    "Chosen Sword",
    "열린 구세의 검",
    "開かれし救世の剣"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Sword",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Sword",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "13",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "90",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "5",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "30",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Sword E",
     "valueKo": "검술 E",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Adjacent allies gain +1 defense.",
     "valueKo": "인접한 아군의 방어력 +1.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weapon-stage",
     "label": {
      "ko": "성능 표의 강화 단계",
      "en": "Upgrade stage of listed stats"
     },
     "value": "Unspecified in Game8; do not treat as confirmed base stats",
     "valueKo": "Game8 단계 미표기 · 기본 성능 미확정",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "Game8 표의 수치를 채택했습니다. 일부 수치가 블로그의 최대 강화값과 같지만 Game8에는 강화 단계가 명시되지 않아 기본 성능으로 확정하지 않습니다. 획득 조건은 확인 대기입니다.",
    "en": "Values follow the Game8 table. Some match the blog’s maximum upgrade values, but Game8 does not specify the upgrade stage; these are not confirmed base stats. Acquisition remains unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w005",
    "ko": "열린 구세의 검",
    "jp": "開かれし救世の剣",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "開かれし救世の剣",
    "stage": "unspecified",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w005",
    "ko": "열린 구세의 검",
    "jp": "開かれし救世の剣",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "royal-sword",
   "type": "item",
   "name": {
    "ko": "왕가의 보검(Royal Sword)",
    "en": "Royal Sword"
   },
   "summary": {
    "ko": "검 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Sword weapon with reference stats and required skills."
   },
   "aliases": [
    "Royal Sword",
    "왕가의 보검",
    "王家の宝剣"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Sword",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Sword",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "12",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "90",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "4",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Sword E",
     "valueKo": "검술 E",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the Ennea Fire EX combat art.",
     "valueKo": "전기 「노나 파이어 EX」를 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weapon-stage",
     "label": {
      "ko": "성능 표의 강화 단계",
      "en": "Upgrade stage of listed stats"
     },
     "value": "Unspecified in Game8; do not treat as confirmed base stats",
     "valueKo": "Game8 단계 미표기 · 기본 성능 미확정",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "Game8 표의 수치를 채택했습니다. 일부 수치가 블로그의 최대 강화값과 같지만 Game8에는 강화 단계가 명시되지 않아 기본 성능으로 확정하지 않습니다. 획득 조건은 확인 대기입니다.",
    "en": "Values follow the Game8 table. Some match the blog’s maximum upgrade values, but Game8 does not specify the upgrade stage; these are not confirmed base stats. Acquisition remains unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w006",
    "ko": "왕가의 보검",
    "jp": "王家の宝剣",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "王家の宝剣",
    "stage": "unspecified",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w006",
    "ko": "왕가의 보검",
    "jp": "王家の宝剣",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "greatsword",
   "type": "item",
   "name": {
    "ko": "그레이트소드(Greatsword)",
    "en": "Greatsword"
   },
   "summary": {
    "ko": "검 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Sword weapon with reference stats and required skills."
   },
   "aliases": [
    "Greatsword",
    "그레이트소드",
    "グレートソード"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Sword",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Sword",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "15",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "60",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "15",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "30",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Sword D / Axe D",
     "valueKo": "검술 D / 도끼술 D",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w016",
    "ko": "그레이트소드",
    "jp": "グレートソード",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "グレートソード",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w016",
    "ko": "그레이트소드",
    "jp": "グレートソード",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "angela",
   "type": "item",
   "name": {
    "ko": "사검 엔주라(Angela)",
    "en": "Angela"
   },
   "summary": {
    "ko": "검 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Sword weapon with reference stats and required skills."
   },
   "aliases": [
    "Angela",
    "사검 엔주라",
    "邪剣エンジュラ"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Sword",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Sword",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "14",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "80",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "8",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "curse",
     "label": {
      "ko": "원주력",
      "en": "Curse"
     },
     "value": "2",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Sword A",
     "valueKo": "검술 A",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the Poison Burial combat art.",
     "valueKo": "전기 「독장」을 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w020",
    "ko": "사검 엔주라",
    "jp": "邪剣エンジュラ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "邪剣エンジュラ",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w020",
    "ko": "사검 엔주라",
    "jp": "邪剣エンジュラ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "onoa",
   "type": "item",
   "name": {
    "ko": "사창 하노아(Onoa)",
    "en": "Onoa"
   },
   "summary": {
    "ko": "창 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Spear weapon with reference stats and required skills."
   },
   "aliases": [
    "Onoa",
    "사창 하노아",
    "邪槍ハノーア"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Spear",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Spear",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "12",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "80",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "7",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "curse",
     "label": {
      "ko": "원주력",
      "en": "Curse"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Spear A",
     "valueKo": "창술 A",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the Cavalry Ruin combat art.",
     "valueKo": "전기 「멸기」를 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w026",
    "ko": "사창 하노아",
    "jp": "邪槍ハノーア",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "邪槍ハノーア",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w026",
    "ko": "사창 하노아",
    "jp": "邪槍ハノーア",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "chosen-lance",
   "type": "item",
   "name": {
    "ko": "얼음의 구세의 창(Chosen Lance)",
    "en": "Chosen Lance"
   },
   "summary": {
    "ko": "창 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Spear weapon with reference stats and required skills."
   },
   "aliases": [
    "Chosen Lance",
    "얼음의 구세의 창",
    "氷の救世の槍"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Spear",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Spear",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "14",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "85",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "7",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "30",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "10",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Spear E",
     "valueKo": "창술 E",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weapon-stage",
     "label": {
      "ko": "성능 표의 강화 단계",
      "en": "Upgrade stage of listed stats"
     },
     "value": "Unspecified in Game8; do not treat as confirmed base stats",
     "valueKo": "Game8 단계 미표기 · 기본 성능 미확정",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "Game8 표의 수치를 채택했습니다. 일부 수치가 블로그의 최대 강화값과 같지만 Game8에는 강화 단계가 명시되지 않아 기본 성능으로 확정하지 않습니다. 획득 조건은 확인 대기입니다.",
    "en": "Values follow the Game8 table. Some match the blog’s maximum upgrade values, but Game8 does not specify the upgrade stage; these are not confirmed base stats. Acquisition remains unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w027",
    "ko": "얼음의 구세의 창",
    "jp": "氷の救世の槍",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "氷の救世の槍",
    "stage": "unspecified",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w027",
    "ko": "얼음의 구세의 창",
    "jp": "氷の救世の槍",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "muen",
   "type": "item",
   "name": {
    "ko": "사창 무엔(Muen)",
    "en": "Muen"
   },
   "summary": {
    "ko": "창 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Spear weapon with reference stats and required skills."
   },
   "aliases": [
    "Muen",
    "사창 무엔",
    "邪槍ムーエン"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Spear",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Spear",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "22",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "45",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "30",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "curse",
     "label": {
      "ko": "원주력",
      "en": "Curse"
     },
     "value": "2",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Spear A",
     "valueKo": "창술 A",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the Black Roar combat art.",
     "valueKo": "전기 「흑굉」를 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w030",
    "ko": "사창 무엔",
    "jp": "邪槍ムーエン",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "邪槍ムーエン",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w030",
    "ko": "사창 무엔",
    "jp": "邪槍ムーエン",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "pilum",
   "type": "item",
   "name": {
    "ko": "스렌드 스피어(Pilum)",
    "en": "Pilum"
   },
   "summary": {
    "ko": "창 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Spear weapon with reference stats and required skills."
   },
   "aliases": [
    "Pilum",
    "스렌드 스피어",
    "スレンドスピア"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Spear",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Spear",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "11",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "70",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "12",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1-2",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "25",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Spear B",
     "valueKo": "창술 B",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w033",
    "ko": "스렌드 스피어",
    "jp": "スレンドスピア",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "スレンドスピア",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w033",
    "ko": "스렌드 스피어",
    "jp": "スレンドスピア",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "glaive",
   "type": "item",
   "name": {
    "ko": "글레이브(Glaive)",
    "en": "Glaive"
   },
   "summary": {
    "ko": "창 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Spear weapon with reference stats and required skills."
   },
   "aliases": [
    "Glaive",
    "글레이브",
    "グレイブ"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Spear",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Spear",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "6",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "90",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "5",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "6",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Sword D / Spear D",
     "valueKo": "검술 D / 창술 D",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the 必殺槍 combat art (Japanese name).",
     "valueKo": "전기 「필살창」을 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w035",
    "ko": "글레이브",
    "jp": "グレイブ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "グレイブ",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w035",
    "ko": "글레이브",
    "jp": "グレイブ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "grasitha",
   "type": "item",
   "name": {
    "ko": "마창 그라시다(Grasitha)",
    "en": "Grasitha"
   },
   "summary": {
    "ko": "창 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Spear weapon with reference stats and required skills."
   },
   "aliases": [
    "Grasitha",
    "마창 그라시다",
    "魔槍グラシーダ"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Spear",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Spear",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "14",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "75",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "14",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1-2",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "30",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Spear B",
     "valueKo": "창술 B",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "A Hero's Relic wielded by a bloodmark bearer. Only Esmeralda can use its 無塵 combat art (Japanese name).",
     "valueKo": "혈인을 가진 자가 다루는 영웅의 유산. 에스메랄다만 전기 「무진」을 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w037",
    "ko": "마창 그라시다",
    "jp": "魔槍グラシーダ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "魔槍グラシーダ",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w037",
    "ko": "마창 그라시다",
    "jp": "魔槍グラシーダ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "ji",
   "type": "item",
   "name": {
    "ko": "극(Ji)",
    "en": "Ji"
   },
   "summary": {
    "ko": "창 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Spear weapon with reference stats and required skills."
   },
   "aliases": [
    "Ji",
    "극",
    "ゲキ"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Spear",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Spear",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "11",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "80",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "7",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "25",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Spear B / Axe D",
     "valueKo": "창술 B / 도끼술 D",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the 風縫い combat art (Japanese name).",
     "valueKo": "전기 「풍봉」을 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w038",
    "ko": "극",
    "jp": "ゲキ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "ゲキ",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w038",
    "ko": "극",
    "jp": "ゲキ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "silver-spear",
   "type": "item",
   "name": {
    "ko": "은창(Silver Spear)",
    "en": "Silver Spear"
   },
   "summary": {
    "ko": "창 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Spear weapon with reference stats and required skills."
   },
   "aliases": [
    "Silver Spear",
    "은창",
    "銀の槍"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "community",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929"
   ],
   "category": "Spear",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Spear",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "20",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "85",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "6",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Spear B",
     "valueKo": "창B",
     "literal": true,
     "sourceId": "edricsn-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 목록에 없어 블로그의 기본 성능·요구 기능을 참고했습니다. 공식 번역·게임 내 검증값이 아니며, 정확한 획득 조건은 확인 대기입니다.",
    "en": "Absent from the Japanese Game8 list; base stats and required skills follow the blog. Localization and in-game values are unverified. Exact acquisition conditions remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "blogId": "w040",
    "ko": "은창",
    "jp": "銀の槍",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "銀の槍",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "blogId": "w040",
    "ko": "은창",
    "jp": "銀の槍",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "vendetta",
   "type": "item",
   "name": {
    "ko": "요창 벤데타(Vendetta)",
    "en": "Vendetta"
   },
   "summary": {
    "ko": "창 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Spear weapon with reference stats and required skills."
   },
   "aliases": [
    "Vendetta",
    "요창 벤데타",
    "妖槍ヴェンデッタ"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Spear",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Spear",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "27",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "60",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1-2",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "curse",
     "label": {
      "ko": "원주력",
      "en": "Curse"
     },
     "value": "2",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Spear A",
     "valueKo": "창술 A",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the Supreme Serpent combat art.",
     "valueKo": "전기 「패사」를 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w041",
    "ko": "요창 벤데타",
    "jp": "妖槍ヴェンデッタ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "妖槍ヴェンデッタ",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w041",
    "ko": "요창 벤데타",
    "jp": "妖槍ヴェンデッタ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "assal",
   "type": "item",
   "name": {
    "ko": "성창 아살(Assal)",
    "en": "Assal"
   },
   "summary": {
    "ko": "창 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Spear weapon with reference stats and required skills."
   },
   "aliases": [
    "Assal",
    "성창 아살",
    "聖槍アッサル"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Spear",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Spear",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "7",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "85",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "8",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Spear D",
     "valueKo": "창술 D",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the 聖撃 combat art (Japanese name).",
     "valueKo": "전기 「성스러운 일격」을 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w042",
    "ko": "성창 아살",
    "jp": "聖槍アッサル",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "聖槍アッサル",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w042",
    "ko": "성창 아살",
    "jp": "聖槍アッサル",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "gundogya",
   "type": "item",
   "name": {
    "ko": "사부 간도기야(Gundogya)",
    "en": "Gundogya"
   },
   "summary": {
    "ko": "도끼 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Axe weapon with reference stats and required skills."
   },
   "aliases": [
    "Gundogya",
    "사부 간도기야",
    "邪斧ガンドギャ"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Axe",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Axe",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "16",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "75",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "12",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "25",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "curse",
     "label": {
      "ko": "원주력",
      "en": "Curse"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Axe A",
     "valueKo": "도끼술 A",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the 魔裂 combat art (Japanese name).",
     "valueKo": "전기 「마열」을 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w053",
    "ko": "사부 간도기야",
    "jp": "邪斧ガンドギャ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "邪斧ガンドギャ",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w053",
    "ko": "사부 간도기야",
    "jp": "邪斧ガンドギャ",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "you-sou-fu",
   "type": "item",
   "name": {
    "ko": "매의 발톱 도끼(You Sou Fu)",
    "en": "You Sou Fu"
   },
   "summary": {
    "ko": "도끼 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Axe weapon with reference stats and required skills."
   },
   "aliases": [
    "You Sou Fu",
    "매의 발톱 도끼",
    "鷹爪斧"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Axe",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Axe",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "4",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "75",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "8",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1-2",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Sword D / Axe D",
     "valueKo": "검술 D / 도끼술 D",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w055",
    "ko": "매의 발톱 도끼",
    "jp": "鷹爪斧",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "鷹爪斧",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w055",
    "ko": "매의 발톱 도끼",
    "jp": "鷹爪斧",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "zalmoxis",
   "type": "item",
   "name": {
    "ko": "잘목시스(Zalmoxis)",
    "en": "Zalmoxis"
   },
   "summary": {
    "ko": "도끼 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Axe weapon with reference stats and required skills."
   },
   "aliases": [
    "Zalmoxis",
    "잘목시스",
    "ザルモクシス"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Axe",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Axe",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "18",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "80",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "10",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "30",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Axe E",
     "valueKo": "도끼술 E",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the 覇絶+ combat art (Japanese name).",
     "valueKo": "전기 「패절+」를 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w057",
    "ko": "잘목시스",
    "jp": "ザルモクシス",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "ザルモクシス",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w057",
    "ko": "잘목시스",
    "jp": "ザルモクシス",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "sagaris",
   "type": "item",
   "name": {
    "ko": "사가리스(Sagaris)",
    "en": "Sagaris"
   },
   "summary": {
    "ko": "도끼 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Axe weapon with reference stats and required skills."
   },
   "aliases": [
    "Sagaris",
    "사가리스",
    "サガリス"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "community",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929"
   ],
   "category": "Axe",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Axe",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "15",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "55",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "14",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1-2",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "30",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Axe B",
     "valueKo": "도끼B",
     "literal": true,
     "sourceId": "edricsn-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 목록에 없어 블로그의 기본 성능·요구 기능을 참고했습니다. 공식 번역·게임 내 검증값이 아니며, 정확한 획득 조건은 확인 대기입니다.",
    "en": "Absent from the Japanese Game8 list; base stats and required skills follow the blog. Localization and in-game values are unverified. Exact acquisition conditions remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "blogId": "w058",
    "ko": "사가리스",
    "jp": "サガリス",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "サガリス",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "blogId": "w058",
    "ko": "사가리스",
    "jp": "サガリス",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "dagdas-club",
   "type": "item",
   "name": {
    "ko": "다그자의 곤봉(Dagda's Club)",
    "en": "Dagda's Club"
   },
   "summary": {
    "ko": "도끼 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Axe weapon with reference stats and required skills."
   },
   "aliases": [
    "Dagda's Club",
    "다그자의 곤봉",
    "ダグザの棍棒"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Axe",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Axe",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "36",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "5",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "25",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "35",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Axe A",
     "valueKo": "도끼술 A",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Only the 神撃 combat art (Japanese name) can be used.",
     "valueKo": "전기 「신격」만 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w060",
    "ko": "다그자의 곤봉",
    "jp": "ダグザの棍棒",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "ダグザの棍棒",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w060",
    "ko": "다그자의 곤봉",
    "jp": "ダグザの棍棒",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "da-mina-bow",
   "type": "item",
   "name": {
    "ko": "다 미나의 활(Da Mina Bow)",
    "en": "Da Mina Bow"
   },
   "summary": {
    "ko": "활 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Bow weapon with reference stats and required skills."
   },
   "aliases": [
    "Da Mina Bow",
    "다 미나의 활",
    "ダ・ミナの弓"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Bow",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Bow",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "12",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "70",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "6",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "2",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "25",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Bow C",
     "valueKo": "궁술 C",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants +10 hit when attacking with a combat art.",
     "valueKo": "전기로 공격할 때 명중 +10.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w070",
    "ko": "다 미나의 활",
    "jp": "ダ・ミナの弓",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "ダ・ミナの弓",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w070",
    "ko": "다 미나의 활",
    "jp": "ダ・ミナの弓",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "idahs-bow",
   "type": "item",
   "name": {
    "ko": "이데아의 활(Idah's Bow)",
    "en": "Idah's Bow"
   },
   "summary": {
    "ko": "활 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Bow weapon with reference stats and required skills."
   },
   "aliases": [
    "Idah's Bow",
    "이데아의 활",
    "イデアの弓"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "community",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929"
   ],
   "category": "Bow",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Bow",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "18",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "80",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "8",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "2",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Bow B",
     "valueKo": "활B",
     "literal": true,
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the Star Flash combat art (provisional translation); effective against flying units. Blog report.",
     "valueKo": "전기 「성섬」 사용 가능. 비행 특효. (블로그 기재)",
     "literal": true,
     "sourceId": "edricsn-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 목록에 없어 블로그의 기본 성능·요구 기능을 참고했습니다. 공식 번역·게임 내 검증값이 아니며, 정확한 획득 조건은 확인 대기입니다.",
    "en": "Absent from the Japanese Game8 list; base stats and required skills follow the blog. Localization and in-game values are unverified. Exact acquisition conditions remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "blogId": "w072",
    "ko": "이데아의 활",
    "jp": "イデアの弓",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "イデアの弓",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "blogId": "w072",
    "ko": "이데아의 활",
    "jp": "イデアの弓",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "silver-bow",
   "type": "item",
   "name": {
    "ko": "은활(Silver Bow)",
    "en": "Silver Bow"
   },
   "summary": {
    "ko": "활 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Bow weapon with reference stats and required skills."
   },
   "aliases": [
    "Silver Bow",
    "은활",
    "銀の弓"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "community",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929"
   ],
   "category": "Bow",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Bow",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "18",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "75",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "5",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "2",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Bow B",
     "valueKo": "활B",
     "literal": true,
     "sourceId": "edricsn-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Effective against flying units. Blog report.",
     "valueKo": "비행 특효. (블로그 기재)",
     "literal": true,
     "sourceId": "edricsn-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 목록에 없어 블로그의 기본 성능·요구 기능을 참고했습니다. 공식 번역·게임 내 검증값이 아니며, 정확한 획득 조건은 확인 대기입니다.",
    "en": "Absent from the Japanese Game8 list; base stats and required skills follow the blog. Localization and in-game values are unverified. Exact acquisition conditions remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "blogId": "w073",
    "ko": "은활",
    "jp": "銀の弓",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "銀の弓",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "blogId": "w073",
    "ko": "은활",
    "jp": "銀の弓",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "counter-gauntlets",
   "type": "item",
   "name": {
    "ko": "반격의 건틀릿(Counter Gauntlets)",
    "en": "Counter Gauntlets"
   },
   "summary": {
    "ko": "건틀릿 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Gauntlets weapon with reference stats and required skills."
   },
   "aliases": [
    "Counter Gauntlets",
    "반격의 건틀릿",
    "反撃の籠手"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Gauntlets",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Gauntlets",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "11",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "70",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "4",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Brawling C",
     "valueKo": "격투술 C",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants +5 attack when acting second in combat.",
     "valueKo": "후공으로 전투할 때 공격력 +5.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w075",
    "ko": "반격의 건틀릿",
    "jp": "反撃の籠手",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "反撃の籠手",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w075",
    "ko": "반격의 건틀릿",
    "jp": "反撃の籠手",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "ursas-right-claw",
   "type": "item",
   "name": {
    "ko": "큰 곰의 오른 갈고리발톱(Ursa's Right Claw)",
    "en": "Ursa's Right Claw"
   },
   "summary": {
    "ko": "건틀릿 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Gauntlets weapon with reference stats and required skills."
   },
   "aliases": [
    "Ursa's Right Claw",
    "큰 곰의 오른 갈고리발톱",
    "大熊の右鉤爪"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Gauntlets",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Gauntlets",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "15",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "75",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "curse",
     "label": {
      "ko": "원주력",
      "en": "Curse"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Brawling B",
     "valueKo": "격투술 B",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the 暴爪 combat art (Japanese name).",
     "valueKo": "전기 「폭조」를 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w076",
    "ko": "큰 곰의 오른 갈고리발톱",
    "jp": "大熊の右鉤爪",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "大熊の右鉤爪",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w076",
    "ko": "큰 곰의 오른 갈고리발톱",
    "jp": "大熊の右鉤爪",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "breidablik",
   "type": "item",
   "name": {
    "ko": "브레이자브리크(Breidablik)",
    "en": "Breidablik"
   },
   "summary": {
    "ko": "건틀릿 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Gauntlets weapon with reference stats and required skills."
   },
   "aliases": [
    "Breidablik",
    "브레이자브리크",
    "ブレイザブリク"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Gauntlets",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Gauntlets",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "5",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "85",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "4",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1-2",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "30",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Brawling E",
     "valueKo": "격투술 E",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Deals magic damage, increases support gain, and grants the 絆の光明 combat art (Japanese name).",
     "valueKo": "마법 공격으로 취급하며 지원치가 오르기 쉽습니다. 전기 「인연의 광명」을 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weapon-stage",
     "label": {
      "ko": "성능 표의 강화 단계",
      "en": "Upgrade stage of listed stats"
     },
     "value": "Unspecified in Game8; do not treat as confirmed base stats",
     "valueKo": "Game8 단계 미표기 · 기본 성능 미확정",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "Game8 표의 수치를 채택했습니다. 일부 수치가 블로그의 최대 강화값과 같지만 Game8에는 강화 단계가 명시되지 않아 기본 성능으로 확정하지 않습니다. 획득 조건은 확인 대기입니다.",
    "en": "Values follow the Game8 table. Some match the blog’s maximum upgrade values, but Game8 does not specify the upgrade stage; these are not confirmed base stats. Acquisition remains unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w077",
    "ko": "브레이자브리크",
    "jp": "ブレイザブリク",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "ブレイザブリク",
    "stage": "unspecified",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w077",
    "ko": "브레이자브리크",
    "jp": "ブレイザブリク",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "da-mina-gauntlets",
   "type": "item",
   "name": {
    "ko": "다 미나의 건틀릿(Da Mina Gauntlets)",
    "en": "Da Mina Gauntlets"
   },
   "summary": {
    "ko": "건틀릿 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Gauntlets weapon with reference stats and required skills."
   },
   "aliases": [
    "Da Mina Gauntlets",
    "다 미나의 건틀릿",
    "ダ・ミナの籠手"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Gauntlets",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Gauntlets",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "11",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "90",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "4",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "25",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Brawling C",
     "valueKo": "격투술 C",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants +10 hit when attacking with a combat art.",
     "valueKo": "전기로 공격할 때 명중 +10.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w080",
    "ko": "다 미나의 건틀릿",
    "jp": "ダ・ミナの籠手",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "ダ・ミナの籠手",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w080",
    "ko": "다 미나의 건틀릿",
    "jp": "ダ・ミナの籠手",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "resistant-gauntlets",
   "type": "item",
   "name": {
    "ko": "대마법의 철갑(Resistant Gauntlets)",
    "en": "Resistant Gauntlets"
   },
   "summary": {
    "ko": "건틀릿 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Gauntlets weapon with reference stats and required skills."
   },
   "aliases": [
    "Resistant Gauntlets",
    "대마법의 철갑",
    "対魔の鉄甲"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Gauntlets",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Gauntlets",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "12",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "80",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "5",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Brawling C",
     "valueKo": "격투술 C",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants +3 resistance.",
     "valueKo": "마방 +3.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w081",
    "ko": "대마법의 철갑",
    "jp": "対魔の鉄甲",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "対魔の鉄甲",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w081",
    "ko": "대마법의 철갑",
    "jp": "対魔の鉄甲",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "qiankun-circles",
   "type": "item",
   "name": {
    "ko": "건곤권(Qiankun Circles)",
    "en": "Qiankun Circles"
   },
   "summary": {
    "ko": "건틀릿 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Gauntlets weapon with reference stats and required skills."
   },
   "aliases": [
    "Qiankun Circles",
    "건곤권",
    "乾坤圏"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Gauntlets",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Gauntlets",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "10",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "70",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "4",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1-2",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Sword D / Brawling C",
     "valueKo": "검술 D / 격투술 C",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w082",
    "ko": "건곤권",
    "jp": "乾坤圏",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "乾坤圏",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w082",
    "ko": "건곤권",
    "jp": "乾坤圏",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "jamadhars",
   "type": "item",
   "name": {
    "ko": "자마다하르(Jamadhars)",
    "en": "Jamadhars"
   },
   "summary": {
    "ko": "건틀릿 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Gauntlets weapon with reference stats and required skills."
   },
   "aliases": [
    "Jamadhars",
    "자마다하르",
    "ジャマダハル"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Gauntlets",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Gauntlets",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "12",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "90",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "5",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "5",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "20",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Sword D / Brawling D",
     "valueKo": "검술 D / 격투술 D",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the 必殺甲 combat art (Japanese name).",
     "valueKo": "전기 「필살갑」을 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w085",
    "ko": "자마다하르",
    "jp": "ジャマダハル",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "ジャマダハル",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w085",
    "ko": "자마다하르",
    "jp": "ジャマダハル",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  },
  {
   "id": "windfire-rings",
   "type": "item",
   "name": {
    "ko": "풍화륜(Windfire Rings)",
    "en": "Windfire Rings"
   },
   "summary": {
    "ko": "건틀릿 무기. 성능과 요구 기능을 확인할 수 있습니다.",
    "en": "Gauntlets weapon with reference stats and required skills."
   },
   "aliases": [
    "Windfire Rings",
    "풍화륜",
    "風火輪"
   ],
   "translation": "provisional",
   "translationSourceId": "edricsn-weapons-expanded-20260929",
   "status": "reference",
   "sourceIds": [
    "wiki-weapon-list-20260929",
    "edricsn-weapons-expanded-20260929",
    "game8-jp-weapons-expanded-20260929"
   ],
   "category": "Gauntlets",
   "categorySourceId": "wiki-weapon-list-20260929",
   "weapon": true,
   "facts": [
    {
     "key": "category",
     "label": {
      "ko": "분류",
      "en": "Category"
     },
     "value": "Gauntlets",
     "sourceId": "wiki-weapon-list-20260929"
    },
    {
     "key": "might",
     "label": {
      "ko": "위력",
      "en": "Might"
     },
     "value": "17",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "hit",
     "label": {
      "ko": "명중",
      "en": "Hit"
     },
     "value": "65",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "crit",
     "label": {
      "ko": "필살",
      "en": "Critical"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "weight",
     "label": {
      "ko": "무게",
      "en": "Weight"
     },
     "value": "6",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "range",
     "label": {
      "ko": "사거리",
      "en": "Range"
     },
     "value": "1-2",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "uses",
     "label": {
      "ko": "내구도",
      "en": "Uses"
     },
     "value": "15",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "avoid",
     "label": {
      "ko": "회피",
      "en": "Avoid"
     },
     "value": "0",
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "rank",
     "label": {
      "ko": "요구 기능",
      "en": "Required skills"
     },
     "value": "Sword D / Brawling B",
     "valueKo": "검술 D / 격투술 B",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    },
    {
     "key": "effect",
     "label": {
      "ko": "효과",
      "en": "Effect"
     },
     "value": "Grants the 炎輪 combat art (Japanese name).",
     "valueKo": "전기 「염륜」을 사용할 수 있습니다.",
     "literal": true,
     "sourceId": "game8-jp-weapons-expanded-20260929"
    }
   ],
   "acquisition": [],
   "links": [],
   "missing": [
    "Acquisition location"
   ],
   "note": {
    "ko": "일본어 Game8 표의 성능·요구 기능을 기준으로 합니다. 한국어 이름·전기명은 참고 번역이며, 정확한 획득 장소·시기는 확인 대기입니다.",
    "en": "Statistics and required skills follow Japanese Game8. Korean labels are provisional. Exact acquisition location and timing remain unverified."
   },
   "referenceUrl": "https://fireemblemwiki.org/wiki/List_of_weapons_in_Fire_Emblem:_Fortune%27s_Weave",
   "weaponNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w086",
    "ko": "풍화륜",
    "jp": "風火輪",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false
   },
   "weaponExpansionEvidence": {
    "sourceId": "game8-jp-weapons-expanded-20260929",
    "englishSourceId": "wiki-weapon-list-20260929",
    "japanese": "風火輪",
    "stage": "source-table",
    "checked": "2026-09-29"
   },
   "koreanNameEvidence": {
    "sourceId": "edricsn-weapons-expanded-20260929",
    "jpSourceId": "game8-jp-weapons-expanded-20260929",
    "blogId": "w086",
    "ko": "풍화륜",
    "jp": "風火輪",
    "method": "editorial-wiki-list-name-type-and-japanese-match",
    "checked": "2026-09-29",
    "officialKorean": false,
    "status": "provisional"
   }
  }
 ],
 "requestedWeaponNames": {
  "answerer": "앤서러",
  "flyssa": "플리사",
  "hunters-bow": "수렵의 활",
  "star-spear": "아우로라의 성창",
  "da-mina-gauntlets": "다 미나의 건틀릿",
  "qiankun-circles": "건곤권"
 },
 "pending": [
  {
   "en": "Kalla's Bow",
   "reason": "일본어·한국어 대응과 획득 퀘스트를 확인하지 못했습니다. 기존 목록 기록만 유지합니다."
  },
  {
   "en": "Hedagg's Bow",
   "reason": "일본어·한국어 대응과 상세 정보 미확인. 기존 목록 기록만 유지합니다."
  },
  {
   "en": "Mini Bow",
   "reason": "이번 Game8·블로그 목록에 대응 항목이 없습니다. 다른 작품의 명칭을 차용하지 않습니다."
  },
  {
   "en": "The Nameless",
   "reason": "이번 Game8·블로그 목록에 대응 항목이 없습니다."
  },
  {
   "en": "Twin Blades",
   "reason": "이번 Game8·블로그 목록에 대응 항목이 없습니다. 동명 Heroes 스킬과 구분합니다."
  },
  {
   "en": "Smoldering Sword",
   "reason": "영어 목록에는 있지만 Game8·블로그 대응 미확인. 신규 페이지 생성을 보류합니다."
  },
  {
   "en": "Credna's Mallet",
   "reason": "영어 목록에는 있지만 Game8·블로그 대응 미확인. 신규 페이지 생성을 보류합니다."
  },
  {
   "en": "Smyrnos's Channels",
   "reason": "영어 목록에는 있지만 Game8·블로그 대응 미확인. 신규 페이지 생성을 보류합니다."
  }
 ],
 "englishCorrection": {
  "id": "guanado",
  "en": "Guandao",
  "sourceId": "wiki-weapon-list-20260929"
 },
 "userSourceId": "user-weapon-labels-20260929"
};
