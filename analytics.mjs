const measurementId='G-GV3T2SC3J4';
const siteUrl='https://fire-emblem-fortunes-weave.turam.dev/';
export function createAnalytics(win,doc){
 let initialized=false,lastPage='';
 const clean=value=>{try{const url=new URL(value);return url.origin+url.pathname;}catch{return '';}};
 return function track(){
  const url=new URL(win.location.href);
  if(doc.querySelector('meta[name="site-url"]')?.content!==siteUrl||url.origin!==new URL(siteUrl).origin)return;
  const page=clean(url.href);
  if(lastPage===page)return;
  if(!initialized){
   initialized=true;
   win.dataLayer=win.dataLayer||[];
   win.gtag=function(){win.dataLayer.push(arguments);};
   win.gtag('js',new Date());
   win.gtag('config',measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
   const script=doc.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;doc.head.append(script);
  }
  win.gtag('event','page_view',{send_to:measurementId,page_location:page,page_title:doc.title,page_referrer:lastPage||clean(doc.referrer),language:doc.documentElement.lang});
  lastPage=page;
 };
}
export const trackPage=typeof window==='undefined'?()=>{}:createAnalytics(window,document);
// The app normalizes the initial language route synchronously before this runs.
if(typeof window!=='undefined')queueMicrotask(trackPage);
