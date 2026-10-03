import {displayTerms} from './display-terms.mjs';
import {editorialPhrases} from './editorial-text.mjs';
import {generalTerms} from './gameplay-terms.mjs';
import {englishSourceTitles} from './english-source-titles.mjs';

// Display-only translations and romanizations. These do not establish official names,
// new relationships, or in-game verification. Original fields and aliases stay intact.
export const englishTerms=Object.fromEntries(`
구세주, 백아의 사자|Savior, Emissary of the Pale Raven
남의 것을 가로채는 자, 뜻이 없는 자, 추악한 자|People who steal from others, people without ambition, ugly people
파사선격|Evil-Breaking Flash
붉은 마력|Crimson Magic
마안|Mystic Eye
명염|Dark Flame
미영귀|Demon of Beauty
아드레스티아 제국|Adrestian Empire
「아름답지 않다」라고 느껴지는 것, 속박, 지위, 종교, 권위|Things he finds unbeautiful, restraints, status, religion, authority
저주사|Curse-Caster
세이로스 성교회|Church of Seiros
어리석은 짐승, 친한 척 하는 상대, 신이라 불리는 자들|Foolish beasts, people who pretend to be close to him, those called gods
거짓말쟁이, 비겁한 자, 어려운 말만 하는 녀석|Liars, cowards, people who only use difficult words
철혈의 미카엘라|Iron-Blooded Mikaela
술주정꾼, 악당, 거짓말쟁이, 노래 부르기|Drunks, villains, liars, singing
파군성|Army-Breaking Star
벌레|Insects
릴리안 타비사|Lilian Tabitha
타비사의 딸 릴리안|Lilian, Daughter of Tabitha
유현의 연주자, 카엘루스의 장미|Player of Hidden Strings, Rose of Caelus
신에게 의지하는 것, 상스러운 남자, 뱀, 개구리, 요리|Relying on gods, vulgar men, snakes, frogs, cooking
바포스의 귀웅|Demon Hero of Bafos
뜻이 없는 하찮은 자들, 유약한 젊은이|Petty people without ambition, weak young people
변덕스러운 바람|Fickle Wind
집착하는 남자, 독특한 풍미의 식재료|Possessive men, ingredients with unusual flavors
매운 것, 남의 마음을 몰라주는 사람|Spicy things, people who disregard others' feelings
승부욕|Competitive Spirit
카엘루스의 푸른 장미|Blue Rose of Caelus
온갖 벌레들, 요리, 뜨개질|All kinds of insects, cooking, knitting
투기장의 백발귀|White-Haired Demon of the Arena
우살자|Bau-Slayer
지옥의 제스터|Jester of Hell
단순노동, 겉치레, 말이 통하지 않는 녀석, 귀찮은 녀석|Menial labor, pretension, unreasonable people, bothersome people
낭비, 모든 종교, 무질서한 것, 거친 전사|Waste, all religions, disorder, rough warriors
하야부사|Falcon
흑려사의 리네|Ninae of the Black Temple
신비의 신부|Mystic Bride
드래곤 스트라이크|Dragon Strike
뇌운기사단|Thundercloud Knights
백은의 처녀|Silver Maiden
은의 처녀|Silver Maiden
테루스 백은기사단|Tellus Silver Knights
가이아 여단|Gaia Brigade
팔마의 비|Consort of Palma
흑조 해적단|Black Bird Pirates
괴조|Monstrous Bird
건방진 녀석, 반항하는 녀석, 부자, 귀신|Insolent people, rebels, rich people, ghosts
꿰뚫기|Pierce
브라간사 동포단|Braganza Fellowship
마궁의 이니오니|Inyoni of the Demon Bow
브리기트군|Brigid Army
소년왕|Boy King
강옥|Corundum
원격 치유|Remote Healing
불사의 그자람|Guzran the Undying
강행돌파|Breakthrough
백성을 돌보지 않는 통치자, 이를 고치도록 간언하지 않는 신하|Rulers who neglect their people, retainers who fail to counsel them against it
품위 없는 자, 저열한 자, 가난한 생활|Undignified people, vulgar people, living in poverty
맹목적인 신앙, 엄격한 규율에 매달리는 것|Blind faith, clinging to strict rules
할 하리 족|Hal Hari Tribe
무모함|Recklessness
아라고의 쌍벽|One of Arago's Twin Pillars
킬릭 “판터“ 아반시오|Creek “Panther” Avancio
카이의 아버지. 전 아우로라 신전 발칸으로 카이에게 창·검·도끼술을 가르쳤다.|Cai's father. A former Vulcan of Aurora's temple who taught Cai spear, sword and axe techniques.
아라고 왕국의 여왕. 정식 이름은 아스완 하스드루발 아라곤.|Queen of the Kingdom of Arago. Her full name is Aswan Hasdrubal Aragon.
아라고와 주라의 아들. 크레르의 이복형.|Son of Arago and Jurah, and Credna's half-brother.
살라미스 왕국의 왕자. 세오도라의 남동생.|Prince of the Kingdom of Saramis and Theodora's younger brother.
아라고 왕국의 여장군.|A female general of the Kingdom of Arago.
아라고 국왕의 친위대장. 「광견」이라 불린다.|Captain of the King of Arago's personal guard, known as the Mad Dog.
레다의 아버지이자 버커니어의 전 상관. 전 다그시온 법무관으로 시도니아 영주였다.|Leda's father and Buccar's former superior. A former Dagsion praetor and lord of Sidonia.
아라고 왕국의 재상.|Chancellor of the Kingdom of Arago.
군신. 브레저란트 왕국의 조상 브레저가 그 피를 잇는다고 한다.|God of war. Breza, ancestor of the Kingdom of Brezarant, is said to carry his blood.
다그다 대륙의 신들 중 하나.|One of the gods of the continent of Dagda.
아라고의 아내이자 다그다의 두 번째 아내. 크레르와 린드의 어머니.|Wife of Arago and Dagda's second wife. Mother of Credna and Lind.
다그다와 주라의 아들. 대장장이 역할을 맡은 신.|Son of Dagda and Jurah, and the god of smithing.
살라미스 왕국에서 숭배하는 밤과 죽음의 여신. 소렐의 아내, 아우로라의 어머니.|Goddess of night and death worshipped in the Kingdom of Saramis. Solel's wife and Aurora's mother.
명계군의 수장. 수천 년 만에 부활한 마신.|Leader of the Underworld Army, a demon god resurrected after thousands of years.
크레르 신전의 대사제. 리네의 아버지.|High priest of Credna's temple and Ninae's father.
살라미스 왕국의 선왕. 세오도라의 이름(세오도라 세르히오 사반그렌)에 미들네임으로 들어간다.|Former king of Saramis. His name is Theodora's middle name: Theodora Sergio Savangren.
미트라스 수도회와 연관된 인물.|A figure associated with the Order of Mithras.
레다의 스승. 레다가 찾는 원수 명단을 작성했다.|Leda's mentor, who wrote the list of enemies she seeks.
아라고 왕국의 왕. 하급 병사에서 장군으로 오른 인물.|King of Arago, who rose from a low-ranking soldier to a general.
「해왕 케투스」라 불리는 괴수. 블레다드의 문장을 지녔다.|A monster known as Cetus, King of the Sea. Bears the Crest of Blaiddyd.
에스메랄다의 아버지. 딸에게 작살을 물려주었다.|Esmeralda's father, who passed his harpoon down to his daughter.
전작에서는 아머 나이트였으나 이번 작에서 중갑 보병으로 번역되었다. 북미판은 여전히 Armor Knight.|The Korean class name changed from Armor Knight to Heavy Infantry; the North American name remains Armor Knight.
전작의 팔라딘에 해당한다.|Corresponds to the Paladin class in earlier games.
전작(도끼+활)과 달리 검·도끼·주먹을 쓰는 밸런스형 보병으로 바뀌었다.|A balanced infantry class using swords, axes and gauntlets, replacing the axe-and-bow combination of earlier games.
코끼리를 탄다.|Rides an elephant.
연계 질주: [기병] 이동력 +1 → [기병] 이동력 +2|Linked Sprint: [Cavalry] Move +1 → Move +2
연계 환기: [기병] 필살 회피 +5 → [기병] 필살 회피 +10|Linked Vigilance: [Cavalry] Critical Avoid +5 → Critical Avoid +10
재이동: [기병] 전투 후 1칸까지 이동할 수 있다. → [기병] 전투 후 2칸까지 이동할 수 있다.|Canto: [Cavalry] Move up to 1 space after combat → Move up to 2 spaces after combat.
연계 기적: [기병] 행운 +3 → [기병] 행운 +5|Linked Miracle: [Cavalry] Luck +3 → Luck +5
연계 치유: [기병] 전투 후 자신의 HP를 소량 회복한다. → [기병] 전투 후 자신의 HP를 적당량 회복한다.|Linked Healing: [Cavalry] Restore a small amount of the rider's HP after combat → Restore a moderate amount.
유리한 지형에 있을때 회피 +10, 방어 +3|Avoid +10 and Def +3 on advantageous terrain
자신 턴 시작시 독 해제 전투 후 회복|Cures poison at the start of the rider's turn; restores HP after combat
이동력 +2 체격 +4|Move +2, Build +4
이동력 +2 적의 치명타시 50% 감산|Move +2; reduces incoming critical damage by 50%
이동 +2|Move +2
재이동 +2 마법 장비 시 필살 +10|Canto +2; Crit +10 when magic is equipped
적이 마법을 장비중이면 자신의 공격력 +5|Attack +5 when the enemy has magic equipped
이동력 +2 마력%로 전투시 회피 +20 발동|Move +2; Mag% chance to gain Avoid +20 in combat
재이동 +2|Canto +2
이동력 +2 전투 기술로 공격시 자신의 공격력 +4|Move +2; Attack +4 when using a combat art
연계 (스킬명 일부 미기재): [기병] 이동력 +1 → [기병] 이동력 +2|Linked skill (name incomplete): [Cavalry] Move +1 → Move +2
루프 고기|Rupo Meat
방패 꼬치고기|Shield Pike
하드 피시|Hard Fish
조토곤|Jotogon
꿈 길잡이|Dream Guide
하나 열매|Hana Fruit
니네이아카|Nineiaka
다카 몽주|Daka Monju
코코미니|Kokomini
오드 몽주|Odd Monju
태양 열매|Sun Fruit
매직 어레이|Magic Array
열소 광석|Phlogiston Ore
아가르타니움|Agarthanium
다크 메탈|Dark Metal
코살루 가아|Kothar Gar
떠내려온 나무 상자|Drifted Wooden Crate
노어 열매|Noah Fruit
엔리예트|Enrietto
피레스 국화|Pyres Chrysanthemum
바스캐치|Basscatch
수수한 무구 상자|Plain Equipment Crate
야채 상자|Vegetable Crate
고기 상자|Meat Crate
생선 상자|Fish Crate
고급 고기 상자|Fine Meat Crate
白鴉の台|Pale Raven Plateau
大鮫の巣|Great Shark Nest
アトラスベア|Atlas Bear
アヌ島|Anu Island
イアペトス大洞窟|Iapetus Great Cave
アレシフ塩田|Areshif Salt Flats
ミュグリアの大樹|Myuglia Great Tree
ぺルーサの沖|Offshore Pelusa
ペルーサの沖|Offshore Pelusa
魔の海域|Demonic Waters
静寂の海|Silent Sea
砂流れの道|Flowing Sand Road
砂虫の巣|Sandworm Nest
暗がりの洞窟|Dark Cave
砂影の砦|Sandshadow Fort
アディティの洞窟|Aditi Cave
ムズラの屍洞|Muzra Corpse Cave
ドゥーベ峠|Dubhe Pass
オライオン渓谷|Orion Gorge
笑み岩|Smiling Rock
焼け草の砂丘|Burnt-Grass Dunes
旅人の丘|Traveler's Hill
フライヴィーデル|Flyvider
ウォレの森|Wore Forest
咽せ風の谷|Choking Wind Valley
オーガス山道|Augus Mountain Path
裏山道|Back Mountain Path
還らずの森|Forest of No Return
パンジャ湾|Panja Bay
ディオネ海流|Dione Current
パンジャ海流|Panja Current
クーガーの屋根|Cougar's Roof
ルナミリア峠|Lunamilia Pass
ゾトー湖|Zoto Lake
ゾドー湖|Zodo Lake
クサリク|Kusarik
バル・デル湖|Val Del Lake
神託の滝|Oracle Falls
タシット平原|Tacit Plains
闇夜峠|Darknight Pass
クーガー大森林帯|Cougar Great Forest
竜骨の森|Dragonbone Forest
ホメロス奇岩地帯|Homeros Rock Formations
ミラニラ|Miranilla
ソルト湖|Salt Lake
マハリパの園|Maharipa Garden
百穴洞窟|Hundred-Hole Cave
熱の道の洞窟|Heatway Cave
百穴岩窟|Hundred-Hole Cavern
南の通路|South Passage
北の通路|North Passage
砂の王宮|Sand Palace
ベルナール峠|Bernard Pass
メラク峠|Merak Pass
エール山地|Aile Mountains
スナブタ|Sand Boar
サンドバアル|Sandbael
砂虫|Sandworm
海獣|Sea Beast
パンドラの魚巣|Pandora Shoal
ネメアー大洞窟|Nemea Great Cave
魔獣の通り跡|Beast Trail
ハイン砦|Hain Fort
コロイオス砦|Koroios Fort
コーラス鉱山|Chorus Mine
リンドレイク岩帯|Lindrake Rock Belt
ソシエ湾|Soshie Bay
魚群岩礁|Fish Shoal Reef
ホルス海峡|Horus Strait
深緑の穴|Deep Green Hollow
骸の大流砂|Great Corpse Quicksand
タテジマオオカミ|Striped Wolf
ヤク|Yarc
ルフ|Rupo
エンデの小渦|Ende's Small Whirlpool
流浪者の古庭|Wanderer's Old Garden
必殺槍|Killing Lance
無塵|Dustless
風縫い|Wind Stitch
聖撃|Holy Strike
성격 combat art (Korean name)|Holy Strike combat art (editorial translation)
魔裂|Magic Rend
覇絶+|Supreme Rupture+
神撃|Divine Strike
暴爪|Raging Claw
絆の光明|Light of Bonds
必殺甲|Killing Gauntlet
炎輪|Flame Ring
크레르|Credna
브론테스호|Lake Brontes
엑스트라|Extras
方尖塔の間|Obelisk Chamber
刃鳴り|Blade Ringing
空地|Vacant Plot
身支度|Preparation
クレール|Clare
アレーナの幻影|Phantom of the Arena
帝都じゃじゃ馬騒動記|Imperial Capital Shrew Uproar
稀代の歌い手コーエン|Koen, Singer of the Age
帝都でも手に入らぬ物|Something Unavailable Even in the Imperial Capital
毛むくじゃらのでけえ獣|Huge Shaggy Beast
加護の霧|Mist of Protection
玉鋼|Jade Steel (provisional)
マジックアレイ|Magic Array (provisional)
戦魂石|Battle Soul Stone (provisional)
翠嵐の宝珠|Jade Gale Orb (provisional)
ワラジムシ|Woodlouse
마츠오카 요시츠구 / 조슈아 워터스 (男)|Yoshitsugu Matsuoka / Joshua Waters (male)
오오츠 아이리 / 제니퍼 선 벨|Airi Otsu / Jennifer Sun Bell
나카무라 카오리 / 모니크 부리아스 시|Kaori Nakamura / Monique Burias Shi
야마시타 다이키 / 지노 로빈슨|Daiki Yamashita / Zeno Robinson
카와세 마키 / 매들린 모리스|Maki Kawase / Madeleine Morris
야마모토 카즈토미 / 마이클 존스턴|Kazutomi Yamamoto / Michael Johnston
이나가키 코노미 / 레이철 리얼|Konomi Inagaki / Rachel Rial
히노 사토시 / 잰더 모버스|Satoshi Hino / Xander Mobus
야마구치 사토시 / 지미 야마구치|Satoshi Yamaguchi / Jimmy Yamaguchi
히시카와 하나 / 켄들 버드|Hana Hishikawa / Kendall Byrd
히라타 히로미 / 마리 웨스트브룩|Hiromi Hirata / Marie Westbrook
타카야마 미나미 / 샤라 커비|Minami Takayama / Shara Kirby
츠루오카 사토시 / 데이브 피노이|Satoshi Tsuruoka / Dave Fennoy
토네 켄타로 / 캠런 니카드|Kentaro Tone / Kamran Nikhad
야나기타 준이치 / 하워드 웡|Junichi Yanagita / Howard Wang
사이토 슈카 / 스테퍼니 웡|Shuka Saito / Stephanie Wong
이세 마리야 / 카티아나 사키시안|Mariya Ise / Katiana Sarkissian
이시이 타카유키 / 크리스 오카와|Takayuki Ishii / Chris Okawa
미우라 카츠유키 / 데이먼 밀스|Katsuyuki Miura / Daman Mills
야마구치 아카네 / 아산테 망고|Akane Yamaguchi / Asante Mango
타츠미 유이코 / 매들린 도로|Yuiko Tatsumi / Madeline Dorroh
야스모토 히로키 / 크리스천 영|Hiroki Yasumoto / Christian Young
코야나기 료칸 / J. 마이클 테이텀|Ryokan Koyanagi / J. Michael Tatum
와타누키 류노스케 / 데이먼 앨럼스|Ryunosuke Watanuki / Damon Alums
나가츠카 타쿠마 / 키어런 리건|Takuma Nagatsuka / Kieran Regan
스미 토모미 제나 / 얼레이나 위즈|Tomomi Jiena Sumi / Alaina Wis
미키 신이치로 / 마우리시오 오티즈세구라|Shinichiro Miki / Mauricio Ortiz-Segura
야마키 안나 / 아멜리아 타일러|Anna Yamaki / Amelia Tyler
코바야시 치카히로 / 데이비드 체리|Chikahiro Kobayashi / David Cherry
타치바나 아즈사 / 카나 시마누키|Azusa Tachibana / Kana Shimanuki
스자키 아야 / 네리다 브론웬|Aya Suzaki / Nerida Bronwen
혼도 카에데 / 에린 이벳|Kaede Hondo / Erin Yvette
타카나시 켄고 / 나지 타샤|Kengo Takanashi / Nazeeh Tarsha
마츠다 사츠미 / 앰버 리 코너스|Satsumi Matsuda / Amber Lee Connors
사사하라 유우 / 케일리 밀스|Yu Sasahara / Kayli Mills
오가사와라 아리사 / 돈 M. 베넷|Arisa Ogasawara / Dawn M. Bennett
야하기 사유리 / 코트니 린|Sayuri Yahagi / Courtney Lin
하야마 쇼타 / 폴 카스트로 주니어|Shota Hayama / Paul Castro Jr.
야마구치 캇페이 / 영이 창|Kappei Yamaguchi / Y. Chang
카하라 모에 / 주디 앨리스 리|Moe Kahara / Judy Alice Lee
콘도 히로노리 /|Hironori Kondo / —
시바사키 노리코 / 나탈리 후버|Noriko Shibasaki / Natalie Hoover
미네 아키히로 / 조너선 퍼낸데즈|Akihiro Mine / Jonathan Fernandez
오오쿠보 아이코 / 헤더 곤잘레스|Aiko Okubo / Heather Gonzalez
토도 슌스케 / 제일런 애스킨스|Shunsuke Todo / Jalen Askins
미와 나츠키 / 애슐리 비스키|Natsuki Miwa / Ashley Biski
이토 토모야 / 필 스터먼|Tomoya Ito / Phil Sturman
타케다 코지 / 저스티스 워싱턴|Koji Takeda / Justice Washington
키요토 아리사 / 프랭키 케비치|Arisa Kiyoto / Frankie Kevich
카네코 하야토 / 매튜 데이비드 러드|Hayato Kaneko / Matthew David Rudd
미우라 사에코 / 안잘리 쿠나파네니|Saeko Miura / Anjali Kunapaneni
코바야시 히데유키 / 클리퍼드 체이핀|Hideyuki Kobayashi / Clifford Chapin
이이다 히카루 / 브리트니 라우다|Hikaru Iida / Brittany Lauda
나츠히 린코 / 캐시 울루|Rinko Natsuhi / Cassie Ewulu
캰 카즈키 / 브렌트 무카이|Kazuki Kyan / Brent Mukai
아키바 유우 / 조지 피터|Yu Akiba / George Peter
오노데라 유우키 / 알렉스 리|Yuki Onodera / Aleks Le
카네코 마코토 / 맷 실버|Makoto Kaneko / Matt Silver
이와사와 토시키 / 윌로 엥글|Toshiki Iwasawa / Willow Engel
시도니아|Sidonia
바포스구|Bafosgu
잔지바르 요새|Zanzibar Fort
클로브 수혈 도시|Clove Burrow City
오그마주|Ogma Province
탈리아주|Thaleia Province
새벽녘 평원|Dawn Plains
우츠나 고개|Utsuna Pass
속삭임 바위|Whispering Rock
제토스 대폭포|Zetos Great Falls
마그나스 고원|Magnas Plateau
천마암|Pegasus Rock
니글리아 광산|Niglia Mine
드래그덴 고개|Dragden Pass
지도에 없는 섬|Uncharted Island
휘석의 동굴|Pyroxene Cave
좌초된 대형 선박|Stranded Large Ship
고라 초원 지대|Gora Grasslands
햇빛의 화원|Sunlight Garden
안개 평원|Misty Plains
결투 광장|Duel Square
펠루사곶|Pelusa Cape
울부짖는 나무 숲|Howling Tree Forest
토리토파텔 대회랑|Tritopater Great Corridor
부목의 좁은 길|Driftwood Narrow Path
엑시온 골짜기|Exion Valley
클리티오스 평원|Clytios Plains
산들바람 언덕|Breeze Hill
피나의 암초|Pina Reef
작약의 갈림길|Peony Crossroads
코살루호|Kothar Lake
아르시네우스대교|Arsineus Great Bridge
발로르의 섬|Balor's Island
순환 바위|Cycle Rock
봉주의 제단|Altar of the Sealed Lord
거인의 발자국 요새|Giant's Footprint Fort
암묵의 묘소|Silent Tomb
브리거디어 고개|Brigadier Pass
소나이 고개|Sonai Pass
체레섬|Chere Island
물키베르 습지대|Mulciber Wetlands
미혹의 숲|Forest of Confusion
호숫가의 폐가|Lakeside Ruin
불랑 평원|Bulang Plains
해 지는 길|Sunset Road
그랑 아라곤|Gran Aragon
올레스 도시|Oles City
우르카역|Urca Station
카르멘타역|Carmenta Station
히베이라 마을|Ribeira Village
살라키아역|Salacia Station
죽음의 도시 아무 르|Amur, City of Death
비오의 제단|Bio Altar
메가에라의 등대|Megaira Lighthouse
동아말테아역|East Amalthea Station
서아말테아역|West Amalthea Station
침묵의 도시|Silent City
칼리스토역|Callisto Station
메그레즈 촌락 옛터|Megrez Village Ruins
료잔 요새|Ryozan Fort
소단의 마교 관문|Sodan Gate
오하드역|Eohid Station
피나 어촌|Pina Fishing Village
엘렉트라주|Electra Province
페로니아역|Feronia Station
작별 바위|Farewell Rock
연결 바위|Linking Rock
모르도 요새 옛터|Mordo Fort Ruins
해넘이 요새|Sunset Fort
소렐 신전 본전|Solel Temple Main Hall
베네트나시 마을|Benetnasi Village
크루데린데 유적|Crudelinde Ruins
리르해|Lir Sea
크뤼푸스 관문|Cryphus Gate
흑마법|Black Magic
기마|Riding
중갑|Heavy Armor
격투|Brawling
비행|Flying
선택|choose one
ヴォーダン峠|Wodan Pass
迷いの森|Forest of Confusion
エンケラドゥス橋|Enceladus Bridge
サンタナ橋|Santana Bridge
日見峠|Sunrise Pass
暁平原|Dawn Plains
ウツナ峠|Utsuna Pass
輝石の洞|Pyroxene Cave
ラドン湖|Ladon Lake
陽光の花園|Sunlight Garden
ダダ平原|Dada Plains
クリュテイオス平原|Clytios Plains
コーシャルー湖|Kothar Lake
ブロンテス湖|Lake Brontes
虫穴|Bugs’ Burrow
ゼートス大滝|Zetos Great Falls
ダマセン岬|Damasen Cape
死将の塚|Fallen General's Barrows
星見峠|Starwatch Pass
アイギーナ山|Mount Aegina
`.trim().split('\n').map(row=>row.split('|')));

const cjk=/[가-힣ぁ-ゖァ-ヺ一-龯]/u;
const dictionaries=new WeakMap(),emptyEntries=[];
function dictionaryFor(entries){
 if(dictionaries.has(entries))return dictionaries.get(entries);
 const candidates=new Map();
 const add=(from,to)=>{
  if(!from||!to||!cjk.test(from)||cjk.test(to))return;
  if(!candidates.has(from))candidates.set(from,new Set());candidates.get(from).add(to);
 };
 for(const [raw,value] of Object.entries(displayTerms)){add(raw,value.en);add(value.ko,value.en);}
 for(const [en,ko] of Object.entries({...generalTerms,...editorialPhrases}))add(ko,en);
 const names=new Map();
 for(const e of entries)for(const ko of [e.name.ko,e.name.ko.replace(/\([^)]*\)$/,'').trim()]){
  if(!cjk.test(ko)||cjk.test(e.name.en))continue;
  if(!names.has(ko))names.set(ko,new Set());names.get(ko).add(e.name.en);
 }
 const dictionary=Object.fromEntries([...candidates].filter(([,values])=>values.size===1).map(([key,values])=>[key,[...values][0]]));
 Object.assign(dictionary,englishTerms);
 // An established, unambiguous entry name takes priority over an editorial rendering.
 for(const [ko,values] of names)if(values.size===1)dictionary[ko]=[...values][0];
 // Reuse reviewed Japanese-to-Korean place terms when an English mapping exists.
 for(const [jp,ko] of Object.entries(editorialPhrases))if(cjk.test(jp)&&dictionary[ko]&&!cjk.test(dictionary[ko]))dictionary[jp]=dictionary[ko];
 const pattern=new RegExp(Object.keys(dictionary).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gu');
 const result={dictionary,pattern};dictionaries.set(entries,result);return result;
}
export function englishText(value,entries=emptyEntries){
 const raw=String(value??'');if(!cjk.test(raw))return raw;
 if(englishSourceTitles[raw])return englishSourceTitles[raw];
 const {dictionary,pattern}=dictionaryFor(entries);
 if(dictionary[raw])return dictionary[raw];
 // Replace reviewed phrases as units; never remove untranslated source text.
 const dated=raw.replace(/다그다력 (\d+)년 (\d+)월 (\d+)일/g,'$2/$3 Dagdan Year $1').replace(/^(\d+)세$/,'$1 years');
 return dated.replace(pattern,(term,offset)=>{
  if(/[가-힣]$/.test(term)&&/^[가-힣]/.test(dated.slice(offset+term.length)))return term;
  if(/^[가-힣]/.test(term)&&/[가-힣]$/.test(dated.slice(0,offset)))return term;
  return dictionary[term];
 }).replace(/\((?:Japanese|Korean) name\)/g,'(editorial translation)');
}
