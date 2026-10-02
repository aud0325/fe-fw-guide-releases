// Google Material Icons Outlined, Apache-2.0. SVGs are served locally.
export const iconNames=['menu','close','search','language','all','character','item','mount','map','location','class','paralogue','quest','tip','sources','arrow','expand','external','filter','add','remove','reset'];
export function icon(name){
 if(!iconNames.includes(name))throw new Error(`Unknown UI icon: ${name}`);
 return `<span class="ui-icon icon-${name}" aria-hidden="true"></span>`;
}
