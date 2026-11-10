export const learnsetViews=['all','combat','support'];
export const normalizeLearnsetView=view=>learnsetViews.includes(view)?view:'all';
const combatProficiencies=['sword','spear','axe','bow','gauntlet','black-magic','white-magic'];
const supportProficiencies=['authority','infantry','armor','cavalry','flying'];
export function selectLearnsetView(lines,view,ranks){
 const selected=normalizeLearnsetView(view);
 if(selected==='all')return {lines,ranks};
 const proficiencies=selected==='combat'?combatProficiencies:supportProficiencies;
 const filtered=lines.filter(line=>proficiencies.includes(line.id)).map(line=>({...line,cells:Object.fromEntries(Object.entries(line.cells).map(([rank,abilities])=>[rank,abilities.filter(ability=>selected==='combat'?['combat-art','spell'].includes(ability.kind):ability.kind==='skill')]))}));
 // Filtered views keep only ranks with visible abilities in an available row.
 return {lines:filtered,ranks:ranks.filter(rank=>filtered.some(line=>!line.restriction&&line.cells[rank].length))};
}
