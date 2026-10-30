export function equipmentVariantSearchProse(entry){
 return (entry.equipmentVariants||[]).flatMap(row=>[...Object.values(row.name),...Object.values(row.effect||{})]);
}
