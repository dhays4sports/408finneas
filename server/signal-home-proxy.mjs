const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
const targets=new Set(['https://cf-signal-sms-integration.coveragefit.pages.dev/api/signal/home-handoff','https://coveragefit.com/api/signal/home-handoff']);
export async function handleHomeContact(request,env={},deliver=fetch){
 if(request.method!=='POST')return reply({ok:false,error:'method_not_allowed'},405);
 if(request.headers.get('origin')!==new URL(request.url).origin)return reply({ok:false,error:'origin_rejected'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return reply({ok:false,error:'json_required'},415);
 const raw=await request.text();if(new TextEncoder().encode(raw).length>8192)return reply({ok:false,error:'body_too_large'},413);
 const endpoint=env.SIGNAL_HOME_HANDOFF_URL,secret=env.COVERAGEFIT_LEAD_SYNC_SECRET;
 if(!targets.has(endpoint)||typeof secret!=='string'||secret.length<32)return reply({ok:false,error:'handoff_not_configured'},503);
 const sentAt=String(Date.now()),key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const signature=Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(sentAt+'.'+raw)))).map(n=>n.toString(16).padStart(2,'0')).join('');
 try{
  const upstream=await deliver(endpoint,{method:'POST',redirect:'error',signal:AbortSignal.timeout(10000),body:raw,headers:{'Content-Type':'application/json','X-CoverageFit-Sent-At':sentAt,'X-CoverageFit-Signature':signature}});
  const result=await upstream.json();
  if(!upstream.ok||result.ok!==true||result.durable!==true||result.operatorVisible!==true)return reply({ok:false,error:'delivery_unavailable'},upstream.status===422?422:503);
  return reply({ok:true,receipt:result.receipt,booked:false},200);
 }catch{return reply({ok:false,error:'delivery_unavailable'},503);}
}
