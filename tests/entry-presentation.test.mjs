import test from 'node:test';import assert from 'node:assert/strict';
import {entryPage,entryAction,parseEntryRoute,ACTIVE_ENTRY_ROUTES} from '../server/entry-presentation-proxy.mjs';
test('only Home is activated first; strict QR parser is ready but not a blind wildcard',()=>{
  assert.deepEqual([...ACTIVE_ENTRY_ROUTES],['home']);assert.deepEqual(parseEntryRoute('/home/qr/95118/rate'),{entry:'home',market:'95118',campaign:'rate'});
  assert.equal(parseEntryRoute('/home/qr/person@example.com/rate'),null);assert.equal(parseEntryRoute('/home/qr/95118/unknown'),null);assert.equal(parseEntryRoute('/life/'),null);
});
test('408 renders canonical questions without a redirect or local question engine',async()=>{
  const response=await entryPage(new Request('https://408farmers.com/home/?campaign_id=home_a&email=private@example.com'),{entry:'home'},{fetch:async(url)=>{
    assert.equal(url.origin,'https://coveragefit.com');assert.equal(url.searchParams.get('campaign_id'),'home_a');assert.equal(url.searchParams.has('email'),false);
    return new Response('<fieldset><legend>Canonical question</legend></fieldset>',{headers:{'X-Robots-Tag':'noindex'}});
  }});
  assert.equal(response.status,200);assert.equal(response.headers.get('location'),null);assert.equal(response.headers.has('X-Robots-Tag'),false);assert.match(await response.text(),/Canonical question/);
});
test('same-origin action proxy forwards only the opaque capability and fixed CoverageFit destination',async()=>{
  const capability='cf_distribution_resume=pvxw_'+'A'.repeat(43);let calls=0;
  const request=new Request('https://408farmers.com/api/entry/interact',{method:'POST',headers:{Origin:'https://408farmers.com','Content-Type':'application/json',Cookie:'unrelated=private; '+capability},body:'{"action":"load"}'});
  const response=await entryAction(request,{fetch:async(url,options)=>{calls++;assert.equal(url.href,'https://coveragefit.com/api/distribution/interact');assert.equal(options.headers.Cookie,capability);return Response.json({ok:true},{headers:{'Set-Cookie':capability+'; Path=/; HttpOnly; Secure; SameSite=Lax'}});}});
  assert.equal(calls,1);assert.equal(response.status,200);assert.match(response.headers.get('set-cookie'),/HttpOnly/);
  const denied=await entryAction(new Request(request.url,{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:'{}'}),{fetch:()=>{throw Error('must not call')}});assert.equal(denied.status,403);
});
