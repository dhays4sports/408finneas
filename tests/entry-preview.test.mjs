import test from 'node:test';import assert from 'node:assert/strict';
import {entryPage,entryAction,entryUpstream} from '../server/entry-presentation-proxy.mjs';
const origin='https://candidate.408farmers-v2.pages.dev',backend='https://1234abcd.coveragefit.pages.dev';
const env={BUYER_STAGING_ISOLATED:'1',COVERAGEFIT_PREVIEW_ORIGIN:backend};
const action=()=>new Request(origin+'/api/entry/interact',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{"action":"load"}'});
test('preview fails closed before network for absent, production, arbitrary, or mutable upstream',async(t)=>{
 t.mock.method(console,'warn',()=>{});
 for(const config of [{},{...env,BUYER_STAGING_ISOLATED:'0'},{...env,COVERAGEFIT_PREVIEW_ORIGIN:'https://coveragefit.com'},{...env,COVERAGEFIT_PREVIEW_ORIGIN:'https://evil.example'},{...env,COVERAGEFIT_PREVIEW_ORIGIN:'https://branch.coveragefit.pages.dev'},{...env,COVERAGEFIT_PREVIEW_ORIGIN:backend+'/?x=1'}]){
 let calls=0;const options={env:config,fetch:()=>{calls++;throw Error('should not fetch');}};
 assert.equal((await entryPage(new Request(origin+'/buyer/?upstream=https://coveragefit.com'),{entry:'buyer'},options)).status,503);
 assert.equal((await entryAction(action(),options)).status,503);assert.equal(calls,0);
 }
});
test('production ignores staging configuration; unknown hosts cannot select an upstream',()=>{
 assert.equal(entryUpstream(new Request('https://408farmers.com/buyer/'),env).origin,'https://coveragefit.com');
 assert.throws(()=>entryUpstream(new Request('https://evil.example/buyer/'),env));
});
test('preview presentation pins script, styles, CSP and noindex to configured backend',async()=>{
 const response=await entryPage(new Request(origin+'/tech/'),{entry:'tech'},{env,fetch:async(url,init)=>{
 assert.equal(new URL(url).origin,backend);assert.equal(init.redirect,'manual');
 return new Response(`<link rel="stylesheet" href="${backend}/assets/css/distribution-check-in.css"><script defer src="${backend}/assets/js/entry-client.js?v=BUYER-1.0"></script><fieldset>Question</fieldset>`);
 }});
 assert.equal(response.status,200);assert.match(response.headers.get('X-Robots-Tag'),/noindex/);assert.ok(response.headers.get('Content-Security-Policy').includes(backend));assert.doesNotMatch(response.headers.get('Content-Security-Policy'),/https:\/\/coveragefit\.com|\*/);
});
test('preview rejects mixed production assets and stale client versions',async(t)=>{
 t.mock.method(console,'warn',()=>{});
 for(const html of ['<script src="https://coveragefit.com/assets/js/entry-client.js?v=BUYER-1.0"></script>',`<script src="${backend}/assets/js/entry-client.js?v=ENTRY-1.0"></script>`])assert.equal((await entryPage(new Request(origin+'/buyer/'),{entry:'buyer'},{env,fetch:async()=>new Response(html)})).status,503);
});
test('preview POST Origin and private cookie stay on the pinned pair',async()=>{
 const response=await entryAction(action(),{env,fetch:async(url,init)=>{assert.equal(url,backend+'/api/distribution/interact');assert.equal(init.headers.Origin,backend);return Response.json({ok:true},{headers:{'Set-Cookie':'cf_distribution_resume=pvxw_'+'A'.repeat(43)+'; Path=/; HttpOnly; Secure; SameSite=Lax'}});}});
 assert.equal(response.status,200);assert.doesNotMatch(response.headers.get('set-cookie'),/Domain=/);assert.match(response.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Lax/);
});
