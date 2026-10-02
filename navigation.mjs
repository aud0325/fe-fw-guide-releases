export {navigationGroups} from './locales/labels.mjs';
import {navigationGroups} from './locales/labels.mjs';
export function navigationContext(state,entries){
 const type=state.id?entries.find(e=>e.id===state.id)?.type:state.type;
 return {type,group:navigationGroups.find(group=>group.types.includes(type))?.id};
}
export function filterContext(state,entries){
 if(state.id)return {route:false,tips:false};
 if(state.type==='all')return {route:true,tips:true};
 if(state.type==='sources'||state.type==='character')return {route:false,tips:false};
 return {route:entries.some(e=>e.type===state.type&&(e.recruitment||e.routeIds?.length)),tips:false};
}
export function listingState(state,entries){
 const controls=filterContext(state,entries);
 return {...state,route:controls.route?state.route:'all',includeTips:controls.tips?state.includeTips:true};
}
