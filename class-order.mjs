import {classOrder} from './class-order.generated.mjs';
export {classOrder} from './class-order.generated.mjs';
const ranks=new Map(classOrder.map((id,index)=>[id,index]));
export const classOrderRank=id=>ranks.get(id)??10000;
export const sortClasses=list=>[...list].sort((a,b)=>classOrderRank(a.id)-classOrderRank(b.id));
