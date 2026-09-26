import test from 'node:test';import assert from 'node:assert/strict';
import {entryPage,entryAction,parseEntryRoute,ACTIVE_ENTRY_ROUTES} from '../server/entry-presentation-proxy.mjs';
test('Home, Buyer and Condo are the active staged entries; QR parser is bounded',()=>{
  assert.deepEqual([...ACTIVE_ENTRY_ROUTES],['home','buyer','condo','tech']);assert.deepEqual(parseEntryRoute('/home/qr/95118/rate'),{entry:'home',market:'95118',campaign:'rate'});
  assert.equal(parseEntryRoute('/home/qr/person@example.com/rate'),null);assert.equal(parseEntryRoute('/home/qr/95118/unknown'),null);assert.equal(parseEntryRoute('/life/'),null);
});
test('408 renders canonical questions without a redirect or local question engine',async()=>{
  const response=await entryPage(new Request('https://408farmers.com/home/?campaign_id=home_a&email=private@example.com'),{entry:'home'},{fetch:async(url)=>{
    assert.equal(typeof url,'string');url=new URL(url);assert.equal(url.origin,'https://coveragefit.com');assert.equal(url.searchParams.get('campaign_id'),'home_a');assert.equal(url.searchParams.has('email'),false);
    return new Response('<fieldset><legend>Canonical question</legend></fieldset>',{headers:{'X-Robots-Tag':'noindex'}});
  }});
  assert.equal(response.status,200);assert.equal(response.headers.get('location'),null);assert.equal(response.headers.has('X-Robots-Tag'),false);assert.match(await response.text(),/Canonical question/);
});
test('same-origin action proxy forwards only the opaque capability and fixed CoverageFit destination',async()=>{
  const capability='cf_distribution_resume=pvxw_'+'A'.repeat(43);let calls=0;
  const request=new Request('https://408farmers.com/api/entry/interact',{method:'POST',headers:{Origin:'https://408farmers.com','Content-Type':'application/json',Cookie:'unrelated=private; '+capability},body:'{"action":"load"}'});
  const response=await entryAction(request,{fetch:async(url,options)=>{calls++;assert.equal(typeof url,'string');url=new URL(url);assert.equal(url.href,'https://coveragefit.com/api/distribution/interact');assert.equal(options.headers.Cookie,capability);return Response.json({ok:true},{headers:{'Set-Cookie':capability+'; Path=/; HttpOnly; Secure; SameSite=Lax'}});}});
  assert.equal(calls,1);assert.equal(response.status,200);assert.match(response.headers.get('set-cookie'),/HttpOnly/);
  const denied=await entryAction(new Request(request.url,{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:'{}'}),{fetch:()=>{throw Error('must not call')}});assert.equal(denied.status,403);
});

test('Pages dispatch includes the active trailing-slash and compatibility entry URLs',async()=>{const {readFileSync}=await import('node:fs');const routes=JSON.parse(readFileSync(new URL('../_routes.json',import.meta.url),'utf8'));for(const path of ['/home','/home/','/buyer/','/buyer/continue','/buyer/continue.html'])assert.ok(routes.include.includes(path));});

test('upstream failure gives a safe contact fallback and logs only status/stage/type',async(t)=>{const log=t.mock.method(console,'warn',()=>{});const response=await entryPage(new Request('https://408farmers.com/home/?campaign_id=private_campaign'),{entry:'home'},{fetch:async()=>new Response('internal upstream details',{status:403})});assert.equal(response.status,503);assert.doesNotMatch(await response.text(),/internal upstream details|private_campaign/);assert.deepEqual(log.mock.calls[0].arguments,['entry_presentation_upstream_failure','{"status":403,"stage":"response","name":"Error"}']);});


test('native fetch keeps its global receiver and rejects redirects on page and action paths',async(t)=>{
  let calls=0;
  t.mock.method(globalThis,'fetch',function(url,init){
    assert.equal(this,globalThis);assert.equal(typeof url,'string');
    assert.equal(init.redirect,'manual');calls++;
    return Promise.resolve(new Response('{}',{headers:{'Content-Type':'application/json'}}));
  });
  assert.equal((await entryPage(new Request('https://408farmers.com/buyer/continue.html'),{entry:'buyer'})).status,200);
  assert.equal((await entryAction(new Request('https://408farmers.com/api/entry/interact',{method:'POST',headers:{Origin:'https://408farmers.com','Content-Type':'application/json'},body:'{}'}))).status,200);
  assert.equal(calls,2);
});
test('fetch exception is distinguished without logging URLs, tokens or exception messages',async(t)=>{
  const log=t.mock.method(console,'warn',()=>{});
  const response=await entryPage(new Request('https://408farmers.com/buyer/continue.html'),{entry:'buyer'},{fetch:()=>{throw new TypeError('sensitive upstream context')}});
  assert.equal(response.status,503);
  assert.deepEqual(log.mock.calls[0].arguments,['entry_presentation_upstream_failure','{"status":null,"stage":"fetch","name":"TypeError"}']);
});


test('manual redirects fail closed without forwarding location, cookies or bodies',async(t)=>{
  t.mock.method(console,'warn',()=>{});
  for(const status of [301,302,303,307,308]){
    let calls=0;
    const fetch=async(url,init)=>{calls++;assert.equal(init.redirect,'manual');return new Response('private redirect body',{status,headers:{Location:'https://other.example/','Set-Cookie':'private=value'}});};
    const page=await entryPage(new Request('https://408farmers.com/buyer/continue.html'),{entry:'buyer'},{fetch});
    const action=await entryAction(new Request('https://408farmers.com/api/entry/interact',{method:'POST',headers:{Origin:'https://408farmers.com','Content-Type':'application/json'},body:'{}'}),{fetch});
    for(const response of [page,action]){assert.equal(response.status,503);assert.equal(response.headers.get('location'),null);assert.equal(response.headers.get('set-cookie'),null);assert.doesNotMatch(await response.text(),/private redirect body/);}
    assert.equal(calls,2);
  }
});


test('Home compatibility bypasses campaign fallback and uses the pretty asset path',async()=>{
  const {readFileSync}=await import('node:fs');
  const source=readFileSync(new URL('../_worker.js',import.meta.url),'utf8');
  const branch=source.match(/if\(\['\/home\/legacy.html','\/home\/legacy'\][^\n]+/)[0];
  const dispatch=new Function('url','env','request','assetRequestFor',branch+'return null;');
  for(const path of ['/home/legacy','/home/legacy.html']){
    const request=new Request('https://408farmers.com'+path+'?utm_source=test');let destination;
    const result=await dispatch(new URL(request.url),{ASSETS:{fetch:r=>{destination=r.url;return new Response('legacy appointment');}}},request,(r,p)=>{const u=new URL(r.url);u.pathname=p;return new Request(u,r);});
    assert.equal(await result.text(),'legacy appointment');assert.equal(new URL(destination).pathname,'/home/legacy');assert.equal(new URL(destination).search,'?utm_source=test');
  }
  const routes=JSON.parse(readFileSync(new URL('../_routes.json',import.meta.url),'utf8'));
  for(const path of ['/home/legacy','/home/legacy.html'])assert.ok(routes.include.includes(path));
});

test('Buyer compatibility retains the original appointment form with independent canonical entry',async()=>{
  const {readFileSync}=await import('node:fs');
  assert.equal(readFileSync(new URL('../buyer/legacy.html',import.meta.url),'utf8'),readFileSync(new URL('../buyer/index.html',import.meta.url),'utf8'));
  assert.equal(ACTIVE_ENTRY_ROUTES.has('buyer'),true);
  const source=readFileSync(new URL('../_worker.js',import.meta.url),'utf8');
  assert.ok(source.includes("if(['/buyer/legacy.html','/buyer/legacy'].includes(url.pathname))return env.ASSETS.fetch(assetRequestFor(request,'/buyer/legacy'))"));
  const routes=JSON.parse(readFileSync(new URL('../_routes.json',import.meta.url),'utf8'));
  for(const p of ['/buyer/legacy','/buyer/legacy.html'])assert.ok(routes.include.includes(p));
});

test('Condo retains the appointment form and routes both legacy aliases',async()=>{
 const {readFileSync}=await import('node:fs');
 assert.equal(readFileSync(new URL('../condo/legacy.html',import.meta.url),'utf8'),readFileSync(new URL('../condo/index.html',import.meta.url),'utf8'));
 const routes=JSON.parse(readFileSync(new URL('../_routes.json',import.meta.url),'utf8'));
 for(const path of ['/condo/','/condo/legacy','/condo/legacy.html'])assert.ok(routes.include.includes(path));
 const source=readFileSync(new URL('../_worker.js',import.meta.url),'utf8');
 assert.ok(source.includes("if(['/condo/legacy.html','/condo/legacy'].includes(url.pathname))return env.ASSETS.fetch(assetRequestFor(request,'/condo/legacy'))"));
 assert.equal(ACTIVE_ENTRY_ROUTES.has('tech'),true);
});

test('Tech compatibility preserves historical links while public Tech remains gated',async()=>{
 const {readFileSync}=await import('node:fs');
 assert.equal(ACTIVE_ENTRY_ROUTES.has('tech'),true);
 assert.equal(readFileSync(new URL('../tech/legacy.html',import.meta.url),'utf8'),readFileSync(new URL('../tech/index.html',import.meta.url),'utf8'));
 const routes=JSON.parse(readFileSync(new URL('../_routes.json',import.meta.url),'utf8'));
 for(const p of ['/tech/legacy','/tech/legacy.html'])assert.ok(routes.include.includes(p));
});

test('remaining affinity compatibility is preserved without activating routes',async()=>{
 const {readFileSync}=await import('node:fs');
 const routes=JSON.parse(readFileSync(new URL('../_routes.json',import.meta.url),'utf8'));
 const worker=readFileSync(new URL('../_worker.js',import.meta.url),'utf8');
 for(const entry of ['teachers','healthcare','engineers']){
  assert.equal(ACTIVE_ENTRY_ROUTES.has(entry),false);
  assert.equal(readFileSync(new URL('../'+entry+'/legacy.html',import.meta.url),'utf8'),readFileSync(new URL('../'+entry+'/index.html',import.meta.url),'utf8'));
  for(const suffix of ['/legacy','/legacy.html'])assert.ok(routes.include.includes('/'+entry+suffix));
  assert.ok(worker.includes("assetRequestFor(request,'/"+entry+"/legacy')"));
 }
});
