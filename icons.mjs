// Google Material Icons Outlined, Apache-2.0. The battalion flag and gambit grid
// are project UI symbols. SVGs are served locally, separate from game artwork.
export const iconNames=['skill','combat-art','spell','menu','close','search','language','all','character','item','mount','map','location','class','battalion','gambit','paralogue','quest','tip','sources','arrow','expand','external','filter','add','remove','reset'];
export function icon(name){
 if(!iconNames.includes(name))throw new Error(`Unknown UI icon: ${name}`);
 return `<span class="ui-icon icon-${name}" aria-hidden="true"></span>`;
}
