// Compare the version embedded in this document, never a first-fetch baseline.
export function createUpdateChecker({version,url,fetchVersion,readGuard,writeGuard,reload,canReload=()=>true,now=Date.now}){
 let pending=false,reloading=false,lastCheck=-Infinity;
 return async function check(){
  if(!version||pending||reloading||!canReload()||now()-lastCheck<30000)return;
  pending=true;lastCheck=now();
  try{
   const target=new URL('version.json',url);target.searchParams.set('t',String(now()));
   const response=await fetchVersion(target.href,{cache:'no-store',signal:AbortSignal.timeout(8000)});
   if(!response.ok)return;
   const next=await response.json();
   if(typeof next.id!=='string'||!/^\d{13}-[a-f0-9-]{36}$/.test(next.id)||!Number.isFinite(Date.parse(next.createdAt))||next.id===version||!canReload())return;
   const guard=readGuard();
   if(guard&&((guard.from===version&&guard.to===next.id)||now()-guard.at<60000))return;
   // Persist before reloading; if persistence fails, leave the current page usable.
   writeGuard({from:version,to:next.id,at:now()});
   reloading=true;reload();
  }catch{
   // Offline, timeout, invalid responses and denied storage must not interrupt reading.
  }finally{pending=false;}
 };
}

export function setupUpdateCheck(win,doc,beforeReload=()=>{}){
 const version=doc.querySelector('meta[name="site-version"]')?.content;
 const site=doc.querySelector('meta[name="site-url"]')?.content;
 if(!version||!site||new URL(site).origin!==win.location.origin)return {schedule(){}};
 let timer,lastInput=-Infinity,composing=false;
 const key='fw-update-reload';
 const readGuard=()=>{
  const historyGuard=win.history.state?.fwUpdateReload;
  try{const stored=JSON.parse(win.sessionStorage.getItem(key));return stored?.at>=(historyGuard?.at??0)?stored:historyGuard;}catch{return historyGuard;}
 };
 const check=createUpdateChecker({version,url:site,fetchVersion:win.fetch.bind(win),readGuard,
  writeGuard:guard=>{
   win.history.replaceState({...win.history.state,fwUpdateReload:guard},'',win.location.href);
   try{win.sessionStorage.setItem(key,JSON.stringify(guard));}catch{}
  },
  canReload:()=>doc.visibilityState!=='hidden'&&!composing&&Date.now()-lastInput>2000,
  reload:()=>{beforeReload();win.location.reload();}
 });
 const schedule=()=>{win.clearTimeout(timer);timer=win.setTimeout(check,2200);};
 doc.addEventListener('input',()=>{lastInput=Date.now();schedule();});
 doc.addEventListener('compositionstart',()=>{composing=true;});
 doc.addEventListener('compositionend',()=>{composing=false;lastInput=Date.now();schedule();});
 doc.addEventListener('visibilitychange',schedule);
 win.addEventListener('pageshow',schedule);win.addEventListener('online',schedule);
 win.setInterval(check,60000);
 return {schedule};
}
