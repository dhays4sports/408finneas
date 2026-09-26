// Presentation/transport only. All question selection, evidence and durable
// session mutations happen in CoverageFit. No provider or CRM adapter here.
export const COVERAGEFIT_ENTRY_BASE='https://coveragefit.com/api/distribution/';
export const ACTIVE_ENTRY_ROUTES=new Set(['home','buyer','condo']);
export function parseEntryRoute(path){
  const direct=path.match(/^\/(home|buyer|condo|auto-bundle|tech|teachers|healthcare|engineers)\/?$/);
  if(direct)return {entry:direct[1]};
  const qr=path.match(/^\/(home|condo)\/qr\/(\d{5})\/(rate|review|fit)\/?$/);
  return qr?{entry:qr[1],market:qr[2],campaign:qr[3]}:null;
}
const cookie=request=>(request.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>/^cf_distribution_resume=pvxw_[A-Za-z0-9_-]{43}$/.test(x))||'';
// Invoke the runtime method with its global receiver. Cloudflare runtimes may
// reject detached native fetch calls; use a string input at the transport boundary.
const upstreamFetch=(url,init,options)=>options.fetch
  ? options.fetch(url.href,init)
  : globalThis.fetch(url.href,init);
export async function entryPage(request,context,options={}){
  const incoming=new URL(request.url),target=new URL('presentation',COVERAGEFIT_ENTRY_BASE);
  for(const key of ['campaign_id','campaign_variant','partner_id','utm_source','utm_medium','utm_campaign','utm_content','utm_term','creative']){
    const value=incoming.searchParams.get(key);if(value)target.searchParams.set(key,value);
  }
  target.searchParams.set('entry',context.entry);target.searchParams.set('presentation','408_contextual');
  if(context.market){target.searchParams.set('market',context.market);target.searchParams.set('qr_campaign',context.campaign);}
  let stage='fetch',status=null;
  try{
    const upstream=await upstreamFetch(target,{headers:{Cookie:cookie(request)},redirect:'manual'},options);
    status=upstream.status;stage='response';
    if(!upstream.ok)throw Object.assign(Error('upstream'),{upstreamStatus:upstream.status});
    const headers=new Headers(upstream.headers);headers.delete('X-Robots-Tag');
    headers.set('Cache-Control','private, no-store');headers.set('Referrer-Policy','no-referrer');
    headers.set('Content-Security-Policy',"default-src 'none'; script-src 'self' https://coveragefit.com; style-src https://coveragefit.com; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
    return new Response(request.method==='HEAD'?null:upstream.body,{status:200,headers});
  }catch(error){console.warn('entry_presentation_upstream_failure',JSON.stringify({status,stage,name:error?.name||'Error'}));return new Response('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Review with Dylan — 408FARMERS</title><main><h1>Let’s pick up with Dylan</h1><p>The quick review is temporarily unavailable. You can still contact Dylan directly.</p><a href="/contact/">Contact Dylan</a></main></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});}
}
export async function entryAction(request,options={}){
  const url=new URL(request.url),action=url.pathname.split('/').pop();
  if(request.method!=='POST'||request.headers.get('origin')!==url.origin||!['interact','events'].includes(action))return new Response(null,{status:403});
  if(!request.headers.get('content-type')?.includes('application/json'))return new Response(null,{status:415});
  const body=await request.text();if(body.length>8192)return new Response(null,{status:413});
  try{
    const upstream=await upstreamFetch(new URL(action,COVERAGEFIT_ENTRY_BASE),{method:'POST',redirect:'manual',headers:{'Content-Type':'application/json',Origin:'https://coveragefit.com',Cookie:cookie(request)},body},options);
    if(upstream.status>=300&&upstream.status<400)throw Object.assign(Error('upstream_redirect'),{upstreamStatus:upstream.status});
    const headers=new Headers({'Content-Type':'application/json','Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'});
    const session=upstream.headers.get('set-cookie');
    if(session&&/^cf_distribution_resume=pvxw_[A-Za-z0-9_-]{43};/.test(session))headers.set('Set-Cookie',session);
    return new Response(upstream.body,{status:upstream.status,headers});
  }catch(error){console.warn('entry_action_upstream_failure',JSON.stringify({name:error?.name||'Error'}));return Response.json({ok:false,message:'Please retry or contact Dylan.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
