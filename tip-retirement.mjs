// Retired article URLs point to useful catalog pages. Private records retain the prose.
export const retiredTipDestinations=Object.freeze({
 "weekly-routine": {
  "type": "all"
 },
 "save-replay-guide": {
  "type": "all"
 },
 "carryover-guide": {
  "type": "all"
 },
 "scouting-basics": {
  "type": "character"
 },
 "support-s-report": {
  "id": "eshmel"
 },
 "part-three-exploration": {
  "type": "reconstruction"
 },
 "part-three-rng": {
  "type": "all"
 },
 "bargain-tip": {
  "id": "zarcone"
 },
 "fish-tip": {
  "id": "paradise-fish"
 },
 "japanese-voice-tip": {
  "type": "all"
 },
 "game8-weekly": {
  "type": "all"
 },
 "game8-renown": {
  "type": "character"
 },
 "game8-training": {
  "type": "class"
 },
 "game8-motivation": {
  "type": "all"
 },
 "game8-exams": {
  "type": "class"
 },
 "game8-cultivation": {
  "type": "all"
 },
 "game8-capture": {
  "type": "mount"
 },
 "game8-lessons": {
  "type": "class"
 },
 "game8-theatre": {
  "type": "all"
 },
 "game8-money": {
  "type": "all"
 },
 "game8-baths": {
  "type": "all"
 },
 "game8-carriage": {
  "type": "map"
 },
 "game8-gates": {
  "type": "map"
 },
 "game8-forge": {
  "type": "item"
 },
 "game8-forest": {
  "type": "map"
 },
 "game8-cave": {
  "id": "heretics-cave"
 },
 "game8-island": {
  "type": "map"
 },
 "game8-paralogues": {
  "type": "paralogue"
 },
 "game8-favors": {
  "type": "character"
 },
 "game8-challenges": {
  "type": "character"
 },
 "legendary-sculptor-guide": {
  "type": "map"
 },
 "chapter-support-repeat": {
  "type": "all"
 },
 "exam-results-report": {
  "type": "class"
 },
 "mount-capture-tip": {
  "type": "mount"
 },
 "community-guide-index": {
  "type": "all"
 },
 "quick-battle-repeat": {
  "type": "all"
 },
 "route-tip": {
  "type": "all"
 }
});
export const isRetiredTipId=id=>Object.hasOwn(retiredTipDestinations,id);
export const isPublicCatalogEntry=e=>!!e&&e.type!=='tip';
export function retiredTipState(state){
 if(state.id&&isRetiredTipId(state.id))return {type:'all',id:null,...retiredTipDestinations[state.id]};
 return !state.id&&state.type==='tip'?{type:'all',id:null}:null;
}
