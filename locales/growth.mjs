export default {
 "growth.title": {
  "ko": "성장률 비교",
  "en": "Compare growth rates"
 },
 "growth.description": {
  "ko": "누가 어떤 능력치를 잘 키우는지, 성장률을 나란히 비교하세요.",
  "en": "Compare how characters, classes and mounts affect each stat’s growth."
 },
 "growth.character": {
  "ko": "캐릭터",
  "en": "Characters"
 },
 "growth.class": {
  "ko": "병종",
  "en": "Classes"
 },
 "growth.mount": {
  "ko": "탈것",
  "en": "Mounts"
 },
 "growth.contextCharacter": {
  "ko": "개인 성장률",
  "en": "Personal growth rates"
 },
 "growth.contextClass": {
  "ko": "병종 성장률 보정",
  "en": "Class growth modifiers"
 },
 "growth.contextMount": {
  "ko": "탈것 성장률 보정",
  "en": "Mount growth modifiers"
 },
 "growth.unitCharacter": {
  "ko": "병종·탈것 보정 전 (%)",
  "en": "Before class and mount modifiers (%)"
 },
 "growth.unitModifier": {
  "ko": "개인 성장률에 더함 (%p)",
  "en": "Added to personal growth rates (pp)"
 },
 "growth.skill": {
  "ko": "개인 기술 보정 포함",
  "en": "Include personal skill modifiers"
 },
 "growth.compactSkill": {
  "ko": "기술 보정 포함",
  "en": "Personal skills"
 },
 "growth.tier": {
  "ko": "등급",
  "en": "Tier"
 },
 "growth.kind": {
  "ko": "종류",
  "en": "Kind"
 },
 "growth.all": {
  "ko": "전체",
  "en": "All"
 },
 "growth.heatmap": {
  "ko": "히트맵",
  "en": "Heatmap"
 },
 "growth.name": {
  "ko": "이름",
  "en": "Name"
 },
 "growth.sum": {
  "ko": "합계",
  "en": "Total"
 },
 "growth.effective": {
  "ko": "유효합계",
  "en": "Effective total"
 },
 "growth.effectiveHelp": {
  "ko": "힘·마력 중 높은 성장률 하나만 반영하고, 나머지 7개 능력치를 더한 값입니다. 합계 − min(힘, 마력)으로 계산합니다.",
  "en": "Adds the higher of Strength or Magic growth to the other seven stats. Formula: total − min(Str, Mag)."
 },
 "growth.effectiveHelpLabel": {
  "ko": "유효합계 계산 설명",
  "en": "How effective total is calculated"
 },
 "growth.average": {
  "ko": "능력치별 평균",
  "en": "Mean per stat"
 },
 "growth.low": {
  "ko": "평균보다 낮음",
  "en": "Below mean"
 },
 "growth.center": {
  "ko": "평균",
  "en": "Mean"
 },
 "growth.high": {
  "ko": "평균보다 높음",
  "en": "Above mean"
 },
 "growth.signedLow": {
  "ko": "−30%p",
  "en": "−30 pp"
 },
 "growth.signedHigh": {
  "ko": "+30%p",
  "en": "+30 pp"
 },
 "growth.zero": {
  "ko": "0",
  "en": "0"
 },
 "growth.numeric": {
  "ko": "색상 끔 · 숫자로 비교합니다.",
  "en": "Colors off · Compare numeric values."
 },
 "growth.scroll": {
  "ko": "표를 좌우로 넘기세요. 이름 열은 고정됩니다.",
  "en": "Scroll the table sideways. Names stay fixed."
 },
 "growth.sourceCoverage": {
  "ko": "해당 대상",
  "en": "Entries covered"
 },
 "growth.methodTitle": {
  "ko": "히트맵 기준과 표 읽는 법",
  "en": "How to read the table and heatmap"
 },
 "growth.sourcesTitle": {
  "ko": "출처",
  "en": "Sources"
 },
 "growth.relativeMethod": {
  "ko": "능력치별 색은 전체 캐릭터에서 계산한 평균과 표준편차를 기준으로 합니다. 평균은 중립색이며 ±2 표준편차에서 색 농도가 최대가 됩니다. 평균보다 낮으면 파랑, 높으면 빨강입니다.",
  "en": "Per-stat colors use each column’s mean and standard deviation across the full character roster. The mean is neutral; color saturates at ±2 standard deviations. Blue is below mean; red is above mean."
 },
 "growth.stableMethod": {
  "ko": "개인 기술 적용 조건을 바꾸면 평균과 색 기준을 다시 계산합니다. 미기재값은 제외하고, 모두 같은 수치인 열은 중립색으로 표시합니다.",
  "en": "Changing personal-skill context recalculates the baseline. Missing values are excluded; constant columns are neutral."
 },
 "growth.modifierMethod": {
  "ko": "병종·탈것은 능력치마다 같은 −30~+30%p 절대 척도를 사용합니다. 음수는 파랑, 0은 흰색, 양수는 빨강입니다.",
  "en": "Classes and mounts share a fixed −30 to +30 pp scale for every stat. Negative values are blue, zero is white, positive values are red."
 },
 "growth.totalMethod": {
  "ko": "합계는 9개 성장률의 단순 합입니다. 캐릭터 성능 순위나 능력치 상승 확률이 아닙니다. 성장률 보정은 즉시 스탯 증가량과 다릅니다.",
  "en": "Totals are simple sums of the nine rates, not unit rankings or a stat-gain probability. Growth modifiers are separate from immediate stat bonuses."
 },
 "growth.skillMethod": {
  "ko": "개인 기술 보정 포함은 기존 데이터에 적용 후 수치가 있는 대상만 바꿉니다. 무우는 적용 전과 Signs of Growth 적용 후를 구분하며, 한 번만 집계합니다.",
  "en": "The skill option uses documented modified values only. Mu’s base rates and Signs of Growth rates stay separate, and Mu is counted once."
 },
 "growth.mountSourceNote": {
  "ko": "갤러리 원문을 출처로 연결합니다. 수치는 원문을 옮긴 정리표 기준이며, 원문에서 생략한 능력치의 0도 정리표의 기입값입니다. 친밀도 기준은 미기재입니다.",
  "en": "The original community post is linked below. Values use its compilation, including zeros for stats omitted in the post. Friendship level is unspecified."
 },
 "growth.empty": {
  "ko": "표시할 대상이 없습니다. 종류를 전체로 바꾸세요.",
  "en": "No rows to show. Choose All types."
 },
 "growth.corrected": {
  "ko": "기술 적용",
  "en": "Skill applied"
 },
 "growth.base": {
  "ko": "개인 기본",
  "en": "Personal base"
 },
 "growth.alternative": {
  "ko": "상충 보고 있음",
  "en": "Conflicting reports"
 },
 "growth.tabLabel": {
  "ko": "성장률 종류",
  "en": "Growth context"
 },
 "growth.tableLabel": {
  "ko": "성장률 비교표 · 좌우 스크롤",
  "en": "Growth comparison table · Scroll sideways"
 },
 "growth.sourceNote": {
  "ko": "성장률 원문과 해당 대상을 아래에 모았습니다. ≠는 상충 보고가 있는 대상입니다.",
  "en": "Original growth references and the entries they cover are collected below. ≠ marks conflicting reports."
 },
 "growth.count": {
  "ko": "{count}개",
  "en": "{count} rows"
 },
 "growth.filteredCount": {
  "ko": "{count} / {total}개",
  "en": "{count} / {total} rows"
 },
 "growth.homeDescription": {
  "ko": "캐릭터·병종·탈것 성장률과 히트맵",
  "en": "Character, class and mount growth rates with heatmaps"
 },
 "growth.imageSources": {
  "ko": "이미지 출처",
  "en": "Image sources"
 }
};
