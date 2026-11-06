import {yuphasImages} from './yuphas-images.generated.mjs';
import {entityReplacementMedia} from './game8-replacement-media.generated.mjs';

const mountIconGroups = {
 "wild-horse": "horse",
 "ferghanan-horse": "horse",
 "monoceros": "horse",
 "rocinan": "horse",
 "rocinans-brother": "horse",
 "black-horse": "horse",
 "wild-ornius": "ornius",
 "white-ornius": "ornius",
 "meganius": "ornius",
 "red-meganius": "ornius",
 "magonius": "ornius",
 "black-magonius": "ornius",
 "ornius": "ornius",
 "pegasus": "pegasus",
 "dark-pegasus": "pegasus",
 "falicorn": "pegasus",
 "red-falicorn": "pegasus",
 "bucephalus": "pegasus",
 "bucephalus-foal": "pegasus",
 "wild-bau": "bau",
 "red-bau": "bau",
 "black-bau": "bau"
};
export function entryIconMedia(entry){
 if(entry.type==='class')return entityReplacementMedia[entry.id]||yuphasImages[entry.id]||null;
 if(entry.type==='mount'&&mountIconGroups[entry.id])return entityReplacementMedia[entry.id]||null;
 return null;
}
export const iconAssetSources=[...new Map(Object.values(entityReplacementMedia).map(media=>[media.src.slice(2),media.originalUrl]))];
