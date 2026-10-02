// Editorial navigation groups; source records and gameplay categories are unchanged.
export const guideTopics=[
 {id:'routine',key:'browse.guide-routine',ids:['weekly-routine','game8-weekly','game8-motivation','game8-cultivation','game8-theatre','game8-money','game8-baths','game8-carriage']},
 {id:'recruitment',key:'browse.guide-recruitment',ids:['scouting-basics','support-s-report','bargain-tip','game8-renown']},
 {id:'training',key:'browse.guide-training',ids:['game8-training','game8-exams','game8-lessons','game8-forge','game8-challenges']},
 {id:'exploration',key:'browse.guide-exploration',ids:['fish-tip','game8-capture','game8-gates','game8-forest','game8-cave','game8-island','game8-paralogues','game8-favors','part-three-exploration','part-three-rng']},
 {id:'save-settings',key:'browse.guide-save-settings',ids:['save-replay-guide','carryover-guide','japanese-voice-tip']},
 {id:'other-guides',key:'browse.guide-other',ids:[]}
];
export const guideTopic=e=>guideTopics.find(g=>g.ids.includes(e.id))||guideTopics.at(-1);
