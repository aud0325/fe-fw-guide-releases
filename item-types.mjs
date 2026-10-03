export {itemMajors,itemMinors,itemKinds} from './locales/labels.mjs';
import {itemMajors,itemMinors,itemKinds} from './locales/labels.mjs';
import {foodKinds,ingredientFlavorId} from './food.mjs';
// Presentation taxonomy. Source categories stay intact for provenance and search.
const categories={sword:'sword',spear:'spear',axe:'axe',bow:'bow',gauntlet:'gauntlet',gauntlets:'gauntlet','black magic':'black-magic','white magic':'white-magic','dark magic':'dark-magic',consumable:'consumable','shield (equipment)':'shield','accessory (equipment)':'accessory','class-change item (licence)':'promotion','class-change item (unverified)':'promotion',gift:'gift',ingredient:'plant','fish (ingredient)':'fish','ore / smithing material':'ore',material:'material','quest item':'quest','other item':'other','?':'other'};
const overrides={'dagdandi':'fish','giants-meat':'meat','mask-of-turmoil-report':'accessory','banshee-theta-scroll-report':'dark-magic','video-jade-steel':'ore','video-gold-dust':'ore','video-gold-dust-lump':'ore','video-ladon-carp':'fish','video-yunamei':'material','grady-goby':'fish','lir-fish':'fish','meltfish':'fish','queen-loach':'fish'};
export function classifyItem(entry){
 let kind=entry.observedFoodKind||overrides[entry.id]||categories[(entry.category||'').toLowerCase()]||'other';
 if(kind==='plant'&&/\bmeat\b/i.test(entry.name?.en||''))kind='meat';
 if(kind==='consumable'&&/\bmanual\b/i.test(entry.name?.en||''))kind='manual';
 const minor=itemKinds[kind].minor,major=itemMinors[minor].major;
 return {major,minor,kind,icon:itemKinds[kind].icon};
}
export function normalizeItemFilters({itemMajor='',itemMinor='',itemKind='',group=''}={}){
 if(!itemMajors[itemMajor])itemMajor='';
 if(!itemMinors[itemMinor]||(itemMajor&&itemMinors[itemMinor].major!==itemMajor))itemMinor='';
 if(!itemKinds[itemKind])itemKind=categories[group.toLowerCase()]||'';
 if(itemKind){const minor=itemKinds[itemKind].minor,major=itemMinors[minor].major;if((itemMajor&&major!==itemMajor)||(itemMinor&&minor!==itemMinor))itemKind='';else{itemMinor=minor;itemMajor=major;}}
 if(itemMinor)itemMajor=itemMinors[itemMinor].major;
 return {itemMajor,itemMinor,itemKind};
}
export function matchesItemFilters(entry,{itemMajor='',itemMinor='',itemKind='',itemFlavor=''}={}){
 if(!itemMajor&&!itemMinor&&!itemKind&&!itemFlavor)return true;
 if(entry.type!=='item')return false;
 const item=classifyItem(entry);
 return (!itemMajor||item.major===itemMajor)&&(!itemMinor||item.minor===itemMinor)&&(!itemKind||item.kind===itemKind)&&(!itemFlavor||(foodKinds[item.kind]&&ingredientFlavorId(entry)===itemFlavor));
}
