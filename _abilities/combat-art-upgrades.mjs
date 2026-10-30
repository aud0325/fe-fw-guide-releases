import {combatArtUpgradeBaseById} from './combat-art-upgrades.generated.mjs';
export {combatArtUpgradeBaseById};
export const isCombatArtUpgrade=value=>Object.hasOwn(combatArtUpgradeBaseById,typeof value==='string'?value:value.id);
export const combatArtBaseId=id=>Object.hasOwn(combatArtUpgradeBaseById,id)?combatArtUpgradeBaseById[id]:id;
export const combatArtVariants=(row,rows)=>[row,...rows.filter(r=>combatArtUpgradeBaseById[r.id]===row.id)];
