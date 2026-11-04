// Width transitions shared by CSS generation and browser interactions.
// Viewport: navigation and page structure. Container: independent nested components only.
export const breakpoints=Object.freeze({minimum:360,tight:480,compact:640,regular:800,navigation:960,wide:1200,spacious:1440,calculator:720,acquisition:900});

export function widthQuery(name,{above=false}={}){
 if(!Object.hasOwn(breakpoints,name))throw new Error('Unknown responsive breakpoint: '+name);
 return `(width ${above?'>':'<='} ${breakpoints[name]}px)`;
}

export const viewportQueries=Object.freeze({navigation:widthQuery('navigation'),compact:widthQuery('compact'),regular:widthQuery('regular')});

export function responsiveVariables(){
 return ':root{'+Object.entries(breakpoints).map(([name,value])=>`--breakpoint-${name}:${value}px`).join(';')+'}';
}
