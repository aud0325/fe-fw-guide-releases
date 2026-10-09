import {mapNodes,caiMap} from './part1-map.generated.mjs';
export const caiMarkerKinds=['clearing','animal-horse','animal-ornius','animal-pegasus','animal-bau'];
const caiIds=new Set(caiMap.placeIds);
export const mapVariantNodes=(variant='all')=>variant==='cai'?mapNodes.filter(n=>caiIds.has(n.id)):mapNodes;
export const variantMarkerKind=(node,variant='all')=>variant==='cai'&&caiMap.markerKinds[node.id]||
 (node.kind==='gathering'&&node.gatheringType?'gathering-'+node.gatheringType:node.kind);
export const caiChangedPlace=id=>Boolean(caiMap.markerKinds[id]);
export const caiMapAnimals=caiMap.animals;
export function switchMapVariant(state,variant){
 const next={...state,mapVariant:variant};
 if(!mapVariantNodes(variant).some(n=>n.id===next.mapPlace))next.mapPlace='';
 // Search and subtype filters belong to the selected map's own vocabulary.
 return {...next,mapQuery:'',mapProvince:'',mapKind:'',mapItem:''};
}
