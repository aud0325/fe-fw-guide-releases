import {radarScales} from './growth-calculator-scales.generated.mjs';
export function radarScale(level){
 const scale=Number.isInteger(level)&&level>=1&&level<=99?radarScales[level-1]:null;
 return scale?{hp:scale[0],other:scale[1]}:null;
}
