const integer=value=>typeof value==='number'?Number.isInteger(value)?value:null:/^\d+$/.test(String(value??''))?Number(value):null;

export function normalizeForgeSelection(forging,fromValue,toValue){
 if(!forging?.stages||forging.stages.length<2)return null;
 const levels=forging.stages.map(stage=>stage.level),minimum=forging.forgeFromLevel||0,maximum=levels.at(-1);
 if(minimum>=maximum)return null;
 const candidateFrom=integer(fromValue),candidateTo=integer(toValue);
 const from=levels.includes(candidateFrom)&&candidateFrom>=minimum&&candidateFrom<maximum?candidateFrom:minimum;
 const to=levels.includes(candidateTo)&&candidateTo>from?candidateTo:maximum;
 return {from,to,minimum,maximum};
}

// Each stage contains its additional cost. No missing input becomes zero/free.
export function totalForgeCost(forging,from,to){
 const selection=normalizeForgeSelection(forging,from,to);
 if(!selection||selection.from!==from||selection.to!==to)throw new RangeError('Invalid forge interval');
 const stages=forging.stages.filter(stage=>stage.level>from&&stage.level<=to);
 if(stages.length!==to-from||stages.some(stage=>stage.storyAwardPart))throw new RangeError('Not a contiguous paid forge interval');
 const quantities=new Map();let materialsComplete=true,goldComplete=true,knownGold=0;
 for(const stage of stages){
  const cost=stage.cost||{};
  if(cost.materials==null)materialsComplete=false;
  else for(const material of cost.materials){
   if(!material.itemId||!Number.isInteger(material.quantity)||material.quantity<0)throw new TypeError('Invalid forge material');
   quantities.set(material.itemId,(quantities.get(material.itemId)||0)+material.quantity);
  }
  if(cost.gold==null)goldComplete=false;
  else{
   if(!Number.isInteger(cost.gold)||cost.gold<0)throw new TypeError('Invalid forge fee');
   knownGold+=cost.gold;
  }
 }
 return {from,to,materials:[...quantities].map(([itemId,quantity])=>({itemId,quantity})),materialsComplete,gold:goldComplete?knownGold:null,knownGold,goldComplete};
}

export function forgeMaterialUses(weapons){
 const materials=new Map();
 for(const weapon of weapons)for(const stage of weapon.forging?.stages||[]){
  if(stage.level===0||stage.storyAwardPart)continue;
  for(const material of stage.cost?.materials||[]){
   if(!materials.has(material.itemId))materials.set(material.itemId,new Map());
   const uses=materials.get(material.itemId);
   if(!uses.has(weapon.id))uses.set(weapon.id,[]);
   uses.get(weapon.id).push({level:stage.level,quantity:material.quantity});
  }
 }
 return new Map([...materials].map(([itemId,weapons])=>[itemId,[...weapons].map(([weaponId,stages])=>({weaponId,stages}))]));
}
