// A named variant is used only when a source identifies enhancement but does not
// specify its numeric level. Never render it as an unupgraded weapon or +N.
export function itemVariantSuffix(row,t){
 return row.upgrade?' +'+row.upgrade:row.variant?' ('+t(row.variant.ko,row.variant.en)+')':'';
}
