// Static-host fallback. HTTP redirects remain the primary migration path.
export function entryRedirectTarget(currentHref,destination){
 const current=new URL(currentHref),target=new URL(destination,current);
 if(!target.search)target.search=current.search;
 if(!target.hash)target.hash=current.hash;
 return target.href;
}
if(typeof document!=='undefined'){
 const link=document.querySelector('link[data-entry-redirect]');
 if(link)location.replace(entryRedirectTarget(location.href,link.getAttribute('data-entry-redirect')));
}
