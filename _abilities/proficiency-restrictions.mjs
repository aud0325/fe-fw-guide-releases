// Explicit access restrictions override display, while reported learnsets stay intact.
// Black Magic!L55 and White Magic!K55; user-confirmed interpretation, 2026-11-05.
const restrictions={tahonia:{proficiencies:['black-magic','white-magic'],reasonKey:'character.tahonia-magic-unavailable',sourceUrl:'https://docs.google.com/spreadsheets/d/1YW5AdvPUbLPr1RAGlnotcRaNTFCQPTKiIgshwrcdUtE/edit?gid=0#gid=0'}};
export function proficiencyRestriction(id,proficiency){const restriction=restrictions[id];return restriction?.proficiencies.includes(proficiency)?restriction:null;}
