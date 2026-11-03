// Keep source category IDs stable; every screen shares these display names.
export const classTierOrder=['Unique','Beginner','Specialty','Advanced','Master','Divine'];
export const tierNames={Unique:['기본직','Base'],Beginner:['하급직','Beginner'],Specialty:['중급직','Specialty'],Advanced:['상급직','Advanced'],Master:['최상급직','Master'],Divine:['신장직','Divine']};
export const canonicalClassTier=tier=>tier==='Intermediate'?'Specialty':tier;
export function classTierName(tier,lang='ko',{compact=false}={}){
 const label=tierNames[canonicalClassTier(tier)]?.[lang==='ko'?0:1]||tier;
 return compact&&lang==='ko'?label.replace(/직$/,''):label;
}
export const classTierLabels=Object.fromEntries([...classTierOrder,'Intermediate'].map(tier=>[tier,{ko:classTierName(tier,'ko'),en:classTierName(tier,'en')}]));
export function classTierSearchNames(tier){
 return [...(tierNames[canonicalClassTier(tier)]||[]),...(tier==='Beginner'?['초급직']:['Intermediate','Specialty'].includes(tier)?['Intermediate']:[])];
}
